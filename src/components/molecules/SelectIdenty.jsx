import SelectDropDwon from '@/components/atoms/SelectDropDwon';
import globalFonts from "@/theme/fontFamily";
import globalStyle from '@/theme/globalStyle';
import themeColors from '@/theme/themeColors';
import { useEffect, useState } from 'react';
import { Modal, StyleSheet, Text, View } from 'react-native';

const SelectIdenty = ({ setIsOpenIdentity, sendMessage, options, color }) => {
    const [dropDownVal, setDropDownVal] = useState(null);

    useEffect(() => {
        if (dropDownVal !== null) {
            sendMessage(dropDownVal);
            setIsOpenIdentity(false);
        }
    }, [dropDownVal]);

    return (
        <Modal transparent={true}>
            <View style={[globalStyle.flexContainer, globalStyle.bgLayer]}>
                <View style={globalStyle.modelBody}>
                    <View style={[styles.optionInputBx, { borderColor: themeColors[color], }]}>
                        <Text style={[styles.selectLabel, globalFonts.poppins_500, { color: themeColors[color], }]}>Select ID Proof</Text>
                        <SelectDropDwon options={options} setDropDownVal={setDropDownVal} />
                    </View>
                </View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    optionInputBx: {
        position: 'relative',
        width: '100%',
        borderWidth: 1,
        paddingHorizontal: 20,
        borderRadius: 12,
        marginBottom: 25,
    },
    selectLabel: {
        fontWeight: 'bold',
        position: 'absolute',
        top: -10,
        left: 20,
        backgroundColor: themeColors.white,
        paddingHorizontal: 5,
    }
});

export default SelectIdenty;
