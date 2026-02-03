import SinglePerson from '@/components/atoms/SinglePerson';
import imagePath from '@/constant/imagePath';
import globalFonts from "@/theme/fontFamily";
import themeColors from '@/theme/themeColors';
import { useRouter } from 'expo-router';
import React, { useEffect, useRef } from 'react';
import { Animated, Dimensions, FlatList, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { scale, verticalScale } from 'react-native-size-matters';

const { width, height } = Dimensions.get('window');

const PersonCards = ({ setIsOpenPersonList, restaurant, token, usersData, setLoadingRestaurantId }) => {

    const bottomAnim = useRef(new Animated.Value(-height / 1.5)).current;
    const router = useRouter();
    // const [usersData, setUsersData] = useState([]);

    const showCard = () => {
        Animated.timing(bottomAnim, {
            toValue: 0,
            duration: 800,
            useNativeDriver: false,
        }).start();
    };

    const hideCard = () => {
        Animated.timing(bottomAnim, {
            toValue: -height / 1.5,
            duration: 500,
            useNativeDriver: false,
        }).start(() => {
            setIsOpenPersonList(false);
        });
    };
   

    useEffect(() => {
        if (usersData && usersData.length > 0){
            showCard();
        }
    }, [usersData])


    const onPersonPress = (user) => {
        router.push({
            pathname: "/userprofile",
            params: {
                uid: user?.id,
                token: token
            }
        })
    };


    return (
        <View style={styles.cardList}>
            <Animated.View style={[styles.cardListWrapper, { bottom: bottomAnim }]}>
                <View style={styles.cardHeader}>
                    <Text style={[styles.cardTitle, globalFonts.poppins_500]}>
                        {restaurant?.name}
                    </Text>
                    <TouchableOpacity onPress={hideCard}>
                        <Image
                            source={imagePath.close}
                            resizeMode="contain"
                            style={styles.closeIcon}
                        />
                    </TouchableOpacity>
                </View>
                <View style={styles.cardContent}>
                    <FlatList
                        data={usersData}
                        keyExtractor={(item, index) => `${item.name}-${index}`}
                        renderItem={({ item }) => (
                            <SinglePerson
                                user={item}
                                onPress={() => onPersonPress(item)}
                            />
                        )}
                        contentContainerStyle={styles.listData}
                    />
                </View>
            </Animated.View>
        </View>
    );
};

export default PersonCards;

const styles = StyleSheet.create({
    cardList: {
        position: 'absolute',
        top: 0,
        left: 0,
        bottom: 0,
        width: width,
    },
    cardListWrapper: {  // corrected typo
        position: 'absolute',
        left: 0,
        width: width,
        height: height / 1.5,
        backgroundColor: themeColors.white,
        borderRadius: scale(20),
        overflow: "hidden"
    },
    cardHeader: {
        position: "relative",
        width: "100%",
        height: verticalScale(50),
        backgroundColor: themeColors.primaryRichPurple,
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingHorizontal: scale(16),
    },
    cardTitle: {
        fontSize: scale(14),
        fontWeight: 'bold',
        color: themeColors.white
    },
    closeIcon: {
        width: scale(20),
        height: scale(20),
        tintColor: themeColors.white,
    },
    cardContent: {
        flex: 1,
    },
    listData: {
        padding: scale(16),
        paddingBottom: verticalScale(65),
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: "red"
    }
});
