
import SinglePlace from '@/components/atoms/SinglePlace';
import getApiUrl from '@/constant/apiUrl';
import imagePath from '@/constant/imagePath';
import useTimeZone from '@/constant/timeZone';
import useNearbyRestaurants from '@/hooks/restaurantList';
import globalFonts from "@/theme/fontFamily";
import globalStyle from '@/theme/globalStyle';
import themeColors from '@/theme/themeColors';
import { useEffect, useRef, useState } from 'react';
import {
    Alert,
    Animated,
    Dimensions,
    FlatList,
    Image,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';
import { scale, verticalScale } from 'react-native-size-matters';

const { width, height } = Dimensions.get('window');

const PlaceCards = ({
    isOpenCard,
    setIsOpenCard,
    place,
    onPlacePress,
    token,
    loadingRestaurantId,
    checkInDetails
}) => {

    const bottomAnim = useRef(new Animated.Value(-height / 2)).current;
    const [restaurants, fetchRestaurants] = useNearbyRestaurants();
    const [shopIds, setShopIds] = useState([]);
    const [displayRestaurants, setDisplayRestaurants] = useState([]);

    // ✅ Active check-in IDs
    const [activeHotspotShopId, setActiveHotspotShopId] = useState(null);
    const [activeScheduleShopId, setActiveScheduleShopId] = useState(null);

    const { userTimeZone } = useTimeZone();

    /* ---------------- FETCH RESTAURANTS ---------------- */
    useEffect(() => {
        if (place) {
            fetchRestaurants({
                latitude: place.latitude,
                longitude: place.longitude,
            });
        }
    }, [place]);

    /* ---------------- EXTRACT SHOP IDS ---------------- */
    useEffect(() => {
        if (restaurants.length) {
            setShopIds(restaurants.map(item => item.restaurantId));
        }
    }, [restaurants]);

    /* ---------------- FETCH USER COUNT ---------------- */
    useEffect(() => {
        if (!shopIds.length) return;

        const getUsersCount = async () => {
            try {
                const apiURL = getApiUrl();

                const response = await fetch(`${apiURL}/getUserCount`, {
                    method: "POST",
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        hotspotId: place?.placeId,
                        hotspotName: place?.name,
                        shopIds,
                        timeZone: userTimeZone,
                    }),
                });

                const obj = await response.json();

                if (!obj.status) {
                    Alert.alert(obj.message || "Something went wrong");
                    return;
                }

                const merged = restaurants.map(shop => {
                    const found = obj.data.find(i => i.shopId === shop.restaurantId);
                    return {
                        ...shop,
                        userCount: found?.userCount ?? 0,
                    };
                });

                setDisplayRestaurants(merged);
                showCard();

            } catch (err) {
                console.log(err);
            }
        };

        getUsersCount();
    }, [shopIds]);

    /* ---------------- FETCH CHECK-IN DETAILS ---------------- */
    useEffect(() => {
        const getCheckInDetails = async () => {
            try {
                if (checkInDetails) {
                    setActiveHotspotShopId(checkInDetails?.shopId ?? null);
                    setActiveScheduleShopId(checkInDetails?.shopId ?? null);
                    return;
                }

                const apiURL = getApiUrl();
                const response = await fetch(`${apiURL}/getUserCheckInDetails`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify({ timeZone: userTimeZone }),
                });

                const obj = await response.json();

                if (!obj.status) return;

                const { hotspotCheckIn, scheduleCheckIn } = obj.checkInData || {};

                setActiveHotspotShopId(hotspotCheckIn?.shopId ?? null);
                setActiveScheduleShopId(scheduleCheckIn?.shopId ?? null);

            } catch (err) {
                console.log(err);
            }
        };

        getCheckInDetails();
    }, [checkInDetails, token, userTimeZone]);

    /* ---------------- ANIMATION ---------------- */
    const showCard = () => {
        Animated.timing(bottomAnim, {
            toValue: 0,
            duration: 400,
            useNativeDriver: false,
        }).start();
    };

    const hideCard = () => {
        Animated.timing(bottomAnim, {
            toValue: -height / 2,
            duration: 400,
            useNativeDriver: false,
        }).start(() => setIsOpenCard(false));
    };

    return (
        <View style={[styles.cardList, globalStyle.bgLayer]}>
            <Animated.View style={[styles.cardListWrapper, { bottom: bottomAnim }]}>

                {/* HEADER */}
                <View style={styles.cardHeader}>
                    <Text style={[styles.cardTitle, globalFonts.poppins_500]}>
                        {place?.name ?? 'Unknown Place'}
                    </Text>

                    <TouchableOpacity onPress={hideCard}>
                        <Image source={imagePath.close} style={styles.closeIcon} />
                    </TouchableOpacity>
                </View>

                {/* LIST */}
                <FlatList
                    data={displayRestaurants}
                    keyExtractor={(item) => item.restaurantId}
                    renderItem={({ item }) => (
                        <SinglePlace
                            place={item}
                            onPress={() => onPlacePress(item)}
                            isLoading={loadingRestaurantId === item.restaurantId}
                            activeHotspotShopId={activeHotspotShopId}
                            activeScheduleShopId={activeScheduleShopId}
                        />
                    )}
                    contentContainerStyle={styles.listData}
                />
            </Animated.View>
        </View>
    );
};

export default PlaceCards;

/* ---------------- STYLES ---------------- */
const styles = StyleSheet.create({
    cardList: {
        position: 'absolute',
        top: 0,
        bottom: 0,
        width,
    },
    cardListWrapper: {
        position: 'absolute',
        width,
        height: height / 2,
        backgroundColor: themeColors.white,
        borderRadius: scale(20),
        overflow: "hidden",
    },
    cardHeader: {
        backgroundColor: themeColors.primaryRichPurple,
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        padding: scale(15),
    },
    cardTitle: {
        fontSize: scale(14),
        fontWeight: 'bold',
        color: themeColors.white,
        width: '85%',
    },
    closeIcon: {
        width: scale(18),
        height: scale(18),
        tintColor: themeColors.white,
    },
    listData: {
        padding: scale(16),
        paddingBottom: verticalScale(60),
    },
});

