
import ModelMessage from "@/components/molecules/ModelMessage";
import getApiUrl from "@/constant/apiUrl";
import useTimeZone from "@/constant/timeZone";
import globalFonts from "@/theme/fontFamily";
import globalStyle from "@/theme/globalStyle";
import themeColors from "@/theme/themeColors";
import { FontAwesome, Ionicons, MaterialIcons } from "@expo/vector-icons";
import { useLocalSearchParams } from "expo-router/build/hooks";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
    Alert,
    Dimensions,
    Image,
    ScrollView,
    StatusBar,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { moderateScale, scale, verticalScale } from "react-native-size-matters";

const { width, height } = Dimensions.get("window");

const userprofile = () => {
    const { uid, token } = useLocalSearchParams();
    const [loading, setLoading] = useState(false);
    const [activeIndex, setActiveIndex] = useState(null);
    const [user, setUser] = useState(null);
    const [isError, setIsError] = useState("");
    const { userTimeZone } = useTimeZone();
    const toggleSection = (index) => {
        setActiveIndex((prev) => (prev === index ? null : index));
    };


    useEffect(() => {
        const getUserData = async () => {
            try {
                setLoading(true);
                const apiURL = getApiUrl();
                const response = await fetch(`${apiURL}/getUserDetails`, {
                    method: "POST",
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${token}`
                    },
                    body: JSON.stringify({ uid, timeZone: userTimeZone })
                });

                const obj = await response.json();

                if (!obj.status) {
                    Alert.alert(obj.message || "Unknown error.");
                    return;
                }

                setUser(obj.data);
                
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        };
        getUserData();

    }, [uid]);


    const { Personality, bookWithoutPersonality } = useMemo(() => {
        const book = user?.bookOfLife ?? {};
        const { Personality, ...rest } = book;
        return {
            Personality,
            bookWithoutPersonality: rest,
        };
    }, [user]);

    const capitalize = useCallback((str) => {
        if (!str) return "";
        return str
            .split(" ")
            .map((item) => item.charAt(0).toUpperCase() + item.slice(1))
            .join(" ");
    }, []);

    const sendLetterRequest = useCallback(async () => {
        let timerId; // store timeout ID

        try {
            setLoading(true);
            const apiURL = getApiUrl();
            const response = await fetch(`${apiURL}/sendDateRequest`, {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({ rid: uid, timeZone: useTimeZone })
            });

            const obj = await response.json();

            if (!obj.status) {
                setIsError(obj.message || "Unknown error.");
                return;
            }

            setIsError(obj.message, "Success!");

        } catch (error) {
            console.error(error);
        } finally {
            timerId = setTimeout(() => {
                setLoading(false);
            }, 2000);
        }

        return () => clearTimeout(timerId)
    }, [uid, token]);

    return (
        <SafeAreaView style={styles.GradientBox}>
            <StatusBar barStyle={"dark"} />

            <View style={styles.whitePanel}>
                {isError ? <ModelMessage  message={isError} setIsError={setIsError} /> : null}
                <ScrollView
                    style={styles.scroll}
                    contentContainerStyle={styles.scrollContent}
                    showsVerticalScrollIndicator={false}
                    keyboardShouldPersistTaps="handled"
                >
                    <View style={[globalStyle.grid, styles.profileBx]}>
                        <View style={styles.profileBox}>
                            <Image
                                source={{
                                    uri:
                                        user?.selfie && user?.baseUrl
                                            ? `${user.baseUrl}${user.selfie}`
                                            : "https://i.pravatar.cc/150?img=4",
                                }}
                                style={styles.profileImage}
                            />
                        </View>

                        <View>
                            <Text style={[globalStyle.normalFontSize, globalFonts.poppins_600]}>
                                {capitalize(user?.name)}, {user?.age || 18}
                            </Text>
                            <Text style={[globalStyle.commonText, globalFonts.poppins_500]}>
                                {capitalize(user?.profession)} | {capitalize(user?.characteristic)}
                            </Text>

                            <View style={styles.buttonsRow}>
                                <TouchableOpacity
                                    style={[
                                        styles.actionBtn,
                                        {
                                            backgroundColor: themeColors.secondaryVibrantPink,
                                            transform: [{ rotate: '-60deg' }],
                                            opacity: loading ? 0.5 : 1
                                        },
                                    ]}
                                    onPress={sendLetterRequest}
                                    disabled={loading} // Disable button while loading
                                >
                                    <MaterialIcons name="send" size={18} color="white" />
                                </TouchableOpacity>

                                <TouchableOpacity
                                    style={[
                                        styles.actionBtn,
                                        { backgroundColor: themeColors.primaryRichPurple }
                                    ]}
                                >
                                    <Ionicons name="heart" size={18} color="white" />
                                </TouchableOpacity>

                                <TouchableOpacity
                                    style={[styles.actionBtn, { backgroundColor: "#29b6f6" }]}

                                >
                                    <Ionicons name="color-filter" size={18} color="white" />
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>

                    <View style={styles.headerDescription}>
                        <Text style={[globalStyle.headingSmall, globalFonts.poppins_600]}>
                            Personality
                        </Text>
                        <Text
                            style={[
                                globalStyle.commonText,
                                globalFonts.poppins_500,
                                {
                                    color: "#797979ff",
                                    marginBottom: 20
                                }
                            ]}
                        >
                            {Personality ?? ''}
                        </Text>
                    </View>

                    {Object.entries(bookWithoutPersonality ?? {})?.map(([title, content], index) => {
                        const isActive = activeIndex === index;
                        return (
                            <View key={title} style={styles.accordionBx}>
                                <TouchableOpacity
                                    style={[styles.header]}
                                    onPress={() => toggleSection(index)}
                                    activeOpacity={0.9}
                                >
                                    <Text
                                        style={[
                                            styles.title,
                                            globalStyle.commonHeading,
                                            globalFonts.poppins_600
                                        ]}
                                    >
                                        {title}
                                    </Text>
                                    <FontAwesome
                                        name={isActive ? "angle-up" : "angle-down"}
                                        size={24}
                                        color="#333"
                                    />
                                </TouchableOpacity>

                                {isActive && (
                                    <View style={styles.contentWrap}>
                                        <Text
                                            style={[
                                                styles.content,
                                                globalStyle.smallText,
                                                globalFonts.poppins_500
                                            ]}
                                        >
                                            {content}
                                        </Text>
                                    </View>
                                )}
                            </View>
                        );
                    })}
                </ScrollView>
            </View>
        </SafeAreaView>
    );
};

export default userprofile;

const styles = StyleSheet.create({
    GradientBox: {
        flex: 1,
    },

    whitePanel: {
        flex: 1,
        backgroundColor: themeColors.white,
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        overflow: "hidden",
    },

    scroll: {
        flex: 1,
    },

    scrollContent: {
        flexGrow: 1,
        padding: scale(20),
        paddingBottom: height * 0.1,
    },

    profileBox: {
        width: scale(100),
        height: scale(100),
        borderRadius: scale(50),
        backgroundColor: themeColors.warmYellow,
        marginBottom: 15,
        justifyContent: "center",
    },

    profileImage: {
        width: scale(96),
        height: scale(96),
        borderRadius: scale(48),
    },

    profileBx: {
        justifyContent: "flex-start",
        gap: scale(15),
        marginBottom: verticalScale(20),
    },

    accordionBx: {
        marginBottom: verticalScale(10),
        borderWidth: 1,
        borderColor: "#fff",
        borderRadius: 10,
        backgroundColor: "#f6f6f6",
        overflow: "hidden",
    },

    header: {
        flexDirection: "row",
        justifyContent: "space-between",
        padding: moderateScale(14),
        backgroundColor: "#f6f6f6",
    },

    title: {
        fontWeight: "600",
        color: "#333",
    },

    contentWrap: {
        overflow: "hidden",
        paddingHorizontal: moderateScale(14),
        paddingBottom: verticalScale(14),
    },

    content: {
        lineHeight: 16,
        color: "#797979ff",
    },

    buttonsRow: {
        flexDirection: "row",
        justifyContent: "flex-start",
        gap: scale(25),
    },

    actionBtn: {
        width: scale(36),
        height: scale(36),
        borderRadius: scale(18),
        justifyContent: "center",
        alignItems: "center",
        marginTop: verticalScale(5),
    },

    // Loader styles
    loaderContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: themeColors.white,
    },

    loaderText: {
        marginTop: verticalScale(10),
        color: "#333",
    },
});
