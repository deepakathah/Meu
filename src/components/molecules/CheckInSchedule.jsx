
import SinglePlace from '@/components/atoms/SinglePlace';
import TimeSlot from "@/components/atoms/TimeSlot";
import Calendar from '@/components/molecules/Calendar';
import imagePath from '@/constant/imagePath';
import globalFonts from "@/theme/fontFamily";
import globalStyle from '@/theme/globalStyle';
import themeColors from '@/theme/themeColors';
import moment from 'moment';
import { useEffect, useMemo, useRef, useState } from 'react';
import { ActivityIndicator, Animated, Dimensions, FlatList, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { scale, verticalScale } from 'react-native-size-matters';

const { width, height } = Dimensions.get('window');

const CheckInSchedule = ({
    isLoading,
    isSchedule,
    place,
    setIsSchedule,
    selectedRestaurant,
    onSchedulePress,
    setScheduleData
}) => {

    const [selectedDate, setSelectedDate] = useState(null);
    const [selectedSlot, setSelectedSlot] = useState(null);

    // Reset schedule when deselected
    useEffect(() => {
        if (!selectedDate || !selectedSlot) {
            setScheduleData(prev => ({
                ...prev,
                time: null,
                timeZone: null
            }));
        }
    }, [selectedDate, selectedSlot]);

    // Memoized time slots
    const timeSlots = useMemo(() => {
        const slots = [];
        const now = new Date();

        const isToday = selectedDate
            ? moment(selectedDate).isSame(moment(), "day")
            : false;

        const currentHour = now.getHours();
        const currentMinute = now.getMinutes();

        for (let i = 0; i < 24; i++) {
            const period = i < 12 ? 'AM' : 'PM';
            const hour12 = i % 12 === 0 ? 12 : i % 12;
            const formattedHour = hour12 < 10 ? `0${hour12}` : hour12;

            const parts = [
                { timeLabel: `${formattedHour}:00 ${period}`, hour: i, minute: 0 },
                { timeLabel: `${formattedHour}:30 ${period}`, hour: i, minute: 30 },
            ];

            parts.forEach((part) => {
                let isDisabled = false;

                if (!selectedDate) {
                    isDisabled = true;
                } else {
                    const sel = moment(selectedDate).startOf("day");
                    const today = moment().startOf("day");

                    if (sel.isBefore(today)) {
                        isDisabled = true;
                    } else if (isToday) {
                        if (part.hour < currentHour ||
                            (part.hour === currentHour && part.minute < currentMinute)
                        ) {
                            isDisabled = true;
                        }
                    }
                }

                slots.push({
                    time: part.timeLabel,
                    hour: part.hour,
                    minute: part.minute,
                    isDisabled
                });
            });
        }
        return slots;
    }, [selectedDate]);

    const bottomAnim = useRef(new Animated.Value(-height / 1.5)).current;

    useEffect(() => {
        isSchedule ? showCard() : hideCard();
    }, [isSchedule]);

    const showCard = () => {
        Animated.timing(bottomAnim, {
            toValue: 0,
            duration: 400,
            useNativeDriver: false,
        }).start();
    };

    const hideCard = () => {
        Animated.timing(bottomAnim, {
            toValue: -height / 1.2,
            duration: 400,
            useNativeDriver: false,
        }).start(() => {
            // Reset states when closing
            setSelectedDate(null);
            setSelectedSlot(null);
            setIsSchedule(false);
        });
    };

    const handleTimeSelection = (item) => {
        setSelectedSlot(item);

        if (selectedDate) {
            const date = moment(selectedDate, "YYYY-MM-DD")
                .hour(item.hour)
                .minute(item.minute)
                .second(0);

            const userTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;

            setScheduleData(prev => ({
                ...prev,
                time: date.format(),
                timeZone: userTimeZone,
            }));
        }
    };

    return (
        <View style={[styles.cardList, globalStyle.bgLayer]}>
            <Animated.View style={[styles.cardListWrapper, { bottom: bottomAnim }]}>

                <View style={styles.cardHeader}>
                    <Text style={[styles.cardTitle, globalFonts.poppins_500]}>
                        {place?.name}
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
                    <SinglePlace
                        place={selectedRestaurant}
                        onPress={() => console.log(selectedRestaurant)}
                    />

                    <Calendar
                        onSelectDate={setSelectedDate}
                        selected={selectedDate}
                    />

                    <View style={styles.section}>
                        <Text style={[globalStyle.commonHeading, globalFonts.poppins_500]}>
                            Select Time Slot
                        </Text>

                        <View style={styles.timeSlotContainer}>
                            <FlatList
                                data={timeSlots}
                                horizontal
                                showsHorizontalScrollIndicator={false}
                                keyExtractor={(_, i) => i.toString()}
                                contentContainerStyle={styles.timeSlotContentContainer}
                                renderItem={({ item }) => (
                                    <View
                                        style={[
                                            styles.timeSlotWrapper,
                                            item.isDisabled && styles.disabledSlotWrapper,
                                        ]}
                                        pointerEvents={item.isDisabled ? "none" : "auto"}
                                    >
                                        <TimeSlot
                                            slot={item.time}
                                            selectedSlot={selectedSlot?.time}
                                            onSelect={() => handleTimeSelection(item)}
                                            disabled={item.isDisabled}
                                        />
                                    </View>
                                )}
                            />
                        </View>
                    </View>

                    <TouchableOpacity style={styles.button} onPress={onSchedulePress}>
                        {isLoading ? (
                            <ActivityIndicator size="small" color={themeColors.white} />
                        ) : (
                            <Text style={[styles.buttonText, globalStyle.headingSmall]}>
                                Schedule Check In
                            </Text>
                        )}
                    </TouchableOpacity>
                </View>

            </Animated.View>
        </View>
    );
};
const styles = StyleSheet.create({
    cardList: {
        position: 'absolute',
        top: 0,
        left: 0,
        bottom: 0,
        width: width,
    },
    cardListWrapper: {
        position: 'absolute',
        left: 0,
        width: width,
        height: height / 1.2,
        backgroundColor: themeColors.white,
        borderRadius: scale(20),
        overflow: "hidden",
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
        color: themeColors.white,
    },
    closeIcon: {
        width: scale(20),
        height: scale(20),
        tintColor: themeColors.white,
    },
    cardContent: {
        flex: 1,
        padding: scale(16),
        paddingBottom: verticalScale(65),
    },
    section: {
        marginTop: 20,
    },
    title: {
        fontSize: 16,
        fontWeight: "600",
        marginBottom: 10,
    },
    timeSlotContainer: {
        marginTop: 10,
        height: verticalScale(50),
        paddingLeft: 10,
    },
    timeSlotContentContainer: {
        alignItems: 'center',
        paddingRight: scale(10),
    },
    timeSlotWrapper: {
        marginRight: scale(10),
    },
    disabledSlotWrapper: {
        opacity: 0.3,
    },
    button: {
        backgroundColor: themeColors.secondaryVibrantPink,
        paddingVertical: 15,
        borderRadius: 30,
        alignItems: "center",
        marginTop: 30,
    },
    buttonText: {
        color: themeColors.white,
        fontWeight: "700",
    },
});

export default CheckInSchedule;
