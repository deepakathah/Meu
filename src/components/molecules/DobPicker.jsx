import globalFonts from "@/theme/fontFamily";
import globalStyle from '@/theme/globalStyle';
import themeColors from '@/theme/themeColors';
import { useEffect, useMemo, useRef, useState } from 'react';
import {
    Dimensions,
    FlatList,
    Modal,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { verticalScale } from "react-native-size-matters";

const { width } = Dimensions.get("window");

const ITEM_HEIGHT = 50;
const VISIBLE_ITEMS = 3;
const PICKER_HEIGHT = ITEM_HEIGHT * VISIBLE_ITEMS;

const HIGHLIGHT_COLOR = themeColors.secondaryVibrantPink;
const BACKGROUND_COLOR = themeColors.lightPink;
const FADED_TEXT_COLOR = themeColors.darkCharcoal;
const BOLD_TEXT_COLOR = themeColors.white;

const MONTHS = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
];

// Generate years (currentYear - 60) → (currentYear - 18)
const currentYear = new Date().getFullYear();
const YEARS = Array.from(
    { length: (currentYear - 18) - (currentYear - 60) + 1 },
    (_, i) => (currentYear - 60) + i
);

const WheelPicker = ({ data, onSelect, initialIndex = 0, style }) => {
    const [selectedIndex, setSelectedIndex] = useState(initialIndex);
    const flatListRef = useRef(null);

    useEffect(() => {
        if (flatListRef.current) {
            flatListRef.current.scrollToIndex({ index: initialIndex, animated: false });
            setSelectedIndex(initialIndex);
        }
    }, [initialIndex, data]);

    const handleMomentumScrollEnd = (event) => {
        const yOffset = event.nativeEvent.contentOffset.y;
        const index = Math.round(yOffset / ITEM_HEIGHT);

        if (index >= 0 && index < data.length) {
            setSelectedIndex(index);
            onSelect?.(data[index], index);
        }
    };

    const renderItem = ({ item, index }) => {
        const isSelected = index === selectedIndex;
        return (
            <View style={styles.itemContainer}>
                <Text
                    style={[
                        globalStyle.commonText,
                        globalFonts.poppins_500,
                        isSelected ? styles.selectedItemText : styles.fadedItemText,
                        style,
                    ]}
                >
                    {item}
                </Text>
            </View>
        );
    };

    return (
        <View style={styles.pickerContainer}>
            <FlatList
                ref={flatListRef}
                data={data}
                renderItem={renderItem}
                keyExtractor={(_, index) => index.toString()}
                showsVerticalScrollIndicator={false}
                snapToInterval={ITEM_HEIGHT}
                decelerationRate="fast"
                initialScrollIndex={initialIndex}
                getItemLayout={(_, index) => ({
                    length: ITEM_HEIGHT,
                    offset: ITEM_HEIGHT * index,
                    index,
                })}
                onMomentumScrollEnd={handleMomentumScrollEnd}
                contentContainerStyle={{
                    paddingVertical: (PICKER_HEIGHT - ITEM_HEIGHT) / 2,
                }}
            />
        </View>
    );
};

const DobPicker = ({ setIsOpenDobPicker, sendMessage }) => {
    const [selectedMonth, setSelectedMonth] = useState('September');
    const [selectedDay, setSelectedDay] = useState(8);
    const [selectedYear, setSelectedYear] = useState(1998);

    const getDaysInMonth = (month, year) => {
        const monthIndex = MONTHS.indexOf(month);
        return new Date(year, monthIndex + 1, 0).getDate();
    };

    const daysForMonth = useMemo(() => {
        const numDays = getDaysInMonth(selectedMonth, selectedYear);
        return Array.from({ length: numDays }, (_, i) => i + 1);
    }, [selectedMonth, selectedYear]);

    useEffect(() => {
        if (selectedDay > daysForMonth.length) {
            setSelectedDay(daysForMonth.length);
        }
    }, [daysForMonth, selectedDay]);

    const initialMonthIndex = useMemo(() => MONTHS.indexOf(selectedMonth), [selectedMonth]);
    const initialDayIndex = useMemo(() => {
        const index = daysForMonth.indexOf(selectedDay);
        return index > -1 ? index : 0;
    }, [selectedDay, daysForMonth]);
    const initialYearIndex = useMemo(() => YEARS.indexOf(selectedYear), [selectedYear]);

    const handleDOB = () => {
        const monthIndex = MONTHS.indexOf(selectedMonth) + 1;
        const formattedMonth = String(monthIndex).padStart(2, '0');
        const formattedDay = String(selectedDay).padStart(2, '0');
        const formattedYear = String(selectedYear);

        const formattedDate = `${formattedYear}-${formattedMonth}-${formattedDay}`;
        sendMessage(formattedDate);
        setIsOpenDobPicker(false);
    };

    return (
        <Modal transparent>
            <View style={[globalStyle.flexContainer, globalStyle.bgLayer]}>
                <View style={globalStyle.modelBody}>
                    <View style={styles.pickerWrapper}>
                        <View style={styles.highlightBar} />
                        <View style={styles.pickersRow}>
                            <View style={styles.column}>
                                <WheelPicker
                                    data={MONTHS}
                                    onSelect={setSelectedMonth}
                                    initialIndex={initialMonthIndex}
                                    style={{ textAlign: 'left' }}
                                />
                            </View>
                            <View style={styles.column}>
                                <WheelPicker
                                    data={daysForMonth}
                                    onSelect={setSelectedDay}
                                    initialIndex={initialDayIndex}
                                    style={{ textAlign: 'center' }}
                                />
                            </View>
                            <View style={styles.column}>
                                <WheelPicker
                                    data={YEARS}
                                    onSelect={setSelectedYear}
                                    initialIndex={initialYearIndex}
                                    style={{ textAlign: 'right' }}
                                />
                            </View>
                        </View>
                    </View>

                    <TouchableOpacity
                        onPress={handleDOB}
                        style={[
                            globalStyle.commonBtn,
                            {
                                backgroundColor: themeColors.secondaryVibrantPink,
                                width: '100%',
                                marginTop: verticalScale(15),
                            },
                        ]}
                    >
                        <Text
                            style={[
                                globalStyle.btnTextCommon,
                                globalFonts.poppins_700,
                                { color: themeColors.white },
                            ]}
                        >
                            Next
                        </Text>
                    </TouchableOpacity>
                </View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    pickerWrapper: {
        height: PICKER_HEIGHT,
        width: '100%',
        backgroundColor: BACKGROUND_COLOR,
        borderRadius: 10,
        justifyContent: 'center',
    },
    highlightBar: {
        position: 'absolute',
        top: (PICKER_HEIGHT - ITEM_HEIGHT) / 2,
        left: 10,
        right: 10,
        height: ITEM_HEIGHT,
        backgroundColor: HIGHLIGHT_COLOR,
        borderRadius: 10,
    },
    pickersRow: {
        height: '100%',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
    },
    column: {
        flex: 1,
        height: PICKER_HEIGHT,
    },
    pickerContainer: {
        height: PICKER_HEIGHT,
        width: '100%',
    },
    itemContainer: {
        height: ITEM_HEIGHT,
        justifyContent: 'center',
        width: '100%',
    },
    selectedItemText: {
        color: BOLD_TEXT_COLOR,
    },
    fadedItemText: {
        color: FADED_TEXT_COLOR,
        opacity: 0.5,
    },
});

export default DobPicker;
