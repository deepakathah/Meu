
import DateCard from "@/components/atoms/DateCard";
import globalFonts from "@/theme/fontFamily";
import globalStyle from '@/theme/globalStyle';
import moment from "moment";
import { useEffect, useState } from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";

const Calendar = ({ onSelectDate, selected }) => {
   
    const [dates, setDates] = useState([]);

    const getDates = () => {
        const _dates = [];
        for (let i = 0; i < 10; i++) {
            const date = moment().add(i, "days");
            _dates.push(date);
        }
        setDates(_dates);
    };

    useEffect(() => {
        getDates();
    }, []);

    return (
        <>
            <View style={styles.section}>
                <Text style={[globalStyle.commonHeading, globalFonts.poppins_500,]}>Select Date</Text>
                <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                    {dates.map((date, index) => (
                        <DateCard
                            key={index}
                            date={date}
                            onSelectDate={onSelectDate}
                            selected={selected}
                        />
                    ))}
                </ScrollView>
            </View>
        </>
    );
};

export default Calendar;

const styles = StyleSheet.create({
    section: {
        paddingVertical: 15,
        paddingHorizontal: 10,
    },
    title: {
        fontSize: 16,
        fontWeight: "600",
        marginBottom: 10,
    },
});
