import themeColors from '@/theme/themeColors';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useState } from 'react';
import { Dimensions, Platform, StyleSheet, View } from 'react-native';

const { width, height } = Dimensions.get("window");

const DobPicker = ({ setIsOpenDobPicker, sendMessage }) => {
    const [dob, setDob] = useState(new Date());

    const handleDateChange = (event, selectedDate) => {
        if (selectedDate) {
            setDob(selectedDate);
            const formattedDate = formatDate(selectedDate);

            setIsOpenDobPicker(false);

            setTimeout(() => sendMessage(formattedDate), 100); 
        }
    };

    const formatDate = (date) => {
        const day = date.getDate().toString().padStart(2, '0');
        const month = (date.getMonth() + 1).toString().padStart(2, '0'); // months are 0-indexed
        const year = date.getFullYear();
        return `${year}-${month}-${day}`;
    };

    return (
        <View style={styles.container}>
            <DateTimePicker
                value={dob}
                mode="date"
                display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                onChange={handleDateChange}
                textColor={Platform.OS === 'ios' ? themeColors.primaryRichPurple : undefined}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        position: "absolute",
        top: 0,
        left: 0, // fixed typo
        width: width,
        height: height,
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    }
});

export default DobPicker;
