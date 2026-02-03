import Option from '@/components/atoms/Option';
import globalStyle from '@/theme/globalStyle';
import { useState } from 'react';
import { Modal, View } from 'react-native';
const SelectOption = () => {
    const [options, setOptions] = useState(["Happy 😊", "Excited 🎉", "Chill 😌", "Adventurous 🌍", "Romantic 💕", "Meh 😐", "Busy/Work Mode 💼"])
    return (
        <Modal transparent>
            <View style={[globalStyle.flexContainer, globalStyle.bgLayer]}>
                <View style={[globalStyle.modelBody]}>
                    <View style={globalStyle.btnGrid}>
                        {options.length > 0 && options.map((option, index) => <Option key={index} optionName={option} />)}
                    </View>
                </View>
            </View>
        </Modal>
    )
}


export default SelectOption