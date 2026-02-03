

// import ProfileCardItem, { itemHeight } from "@/components/atoms/ProfileCardItem";
import FindingMatchLoader from "@/components/molecules/FindingMatchLoader";
import ModelMessage from "@/components/molecules/ModelMessage";
import getApiUrl from "@/constant/apiUrl";
import useTimeZone from "@/constant/timeZone";
import { useRequestPortal } from '@/context/RequestPortalContext2';
import themeColors from "@/theme/themeColors";
import { activateKeepAwakeAsync, deactivateKeepAwake } from 'expo-keep-awake';
import { useRouter } from "expo-router";
import { useEffect, useState } from 'react';
import { Dimensions, StyleSheet, View } from "react-native";
import { verticalScale } from "react-native-size-matters";
import { useSelector } from 'react-redux';
const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window");


const AutoMatchCard = () => {
    const { portalSocket, socketData } = useRequestPortal()
    const { token } = useSelector(state => state.auth);
    const [isError, setIsError] = useState('');
    const [isCheckIn, setIsCheckIn] = useState(false);
    const router = useRouter()
    const { userTimeZone } = useTimeZone();

    useEffect(() => {
        if (!portalSocket) return;
        let processingtimeOut

        if (portalSocket.readyState === WebSocket.OPEN && socketData) {
            try {
                console.log("Recieved socketData:", socketData);

                if (!socketData.status) {
                    return
                }

                if (socketData.action === "startDate") {
                    router.back()
                    return
                }

                if (socketData.action === "autoMatchSuccess") {
                    setIsCheckIn(true)
                    setIsError(socketData.message)
                    portalSocket.send(JSON.stringify(socketData))
                    return
                }


            } catch (err) {
                console.log("Error sending data via WebSocket:", err);
            }
        } else {
            console.log("WebSocket is not connected, cannot send data");
        }

        return () => clearTimeout(processingtimeOut);

    }, [portalSocket, socketData]);

    useEffect(() => {
        const keepScreenAwakeForOneMinute = async () => {

            await activateKeepAwakeAsync();

            const timer = setTimeout(() => {
                deactivateKeepAwake();
            }, 60000); // 1 min

            return () => {
                clearTimeout(timer);
                deactivateKeepAwake();
            };
        };

        keepScreenAwakeForOneMinute();
    }, []);

    useEffect(() => {
        const getRandomMatch = async () => {
            try {
                const apiURL = getApiUrl();
                if (!apiURL) {
                    console.log("API URL not found");
                    return;
                }
                if (!token) {
                    console.log("Token is missing");
                    return;
                }

                const response = await fetch(`${apiURL}/autoMatch`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify({ timeZone: userTimeZone })
                });

                const obj = await response.json();

                console.log("API Response:", obj);


                if (!obj.status) {
                    setIsCheckIn(true)
                    setIsError(obj.message || "Unknown error");
                    return;
                }

                if (obj.isSocket && portalSocket?.readyState === WebSocket.OPEN) {

                    portalSocket.send(JSON.stringify(obj.data));
                    console.log("sending by api ", obj.data)
                    return;
                }

            } catch (error) {
                console.log("Fetch error:", error);
            }
        };

        getRandomMatch();
    }, [token]);

    return (
        <View style={styles.container}>
            {isError ? (
                <ModelMessage
                    message={isError}
                    setIsError={setIsError}
                    isCheckIn={isCheckIn}
                    setIsCheckIn={setIsCheckIn}
                />
            ) :
                <FindingMatchLoader />
            }

        </View>
    );
};

export default AutoMatchCard;

const styles = StyleSheet.create({
    container: {
        position: "absolute",
        width: SCREEN_WIDTH,
        height: SCREEN_HEIGHT,
        backgroundColor: themeColors.lightGray,
        justifyContent: 'center',
        alignItems: 'center',
        paddingBottom: verticalScale(60)
    },
});

