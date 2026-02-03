import globalStyle from '@/theme/globalStyle';
import themeColors from '@/theme/themeColors';
import { Text, TouchableOpacity } from 'react-native';

const Option = ({ optionName, isSelected, onSelect }) => {
    return (
        <TouchableOpacity
            style={[
                globalStyle.commonBtn,
                {
                    backgroundColor: isSelected ? themeColors.warmYellow : themeColors.softLavender,
                    paddingHorizontal: 10,
                    height: 30
                }
            ]}
            onPress={onSelect}
        >
            <Text style={[
                globalStyle.commonText,
                {
                    color: themeColors.black,
                    fontWeight: "bold",
                    textTransform: "capitalize",
                }
            ]}>
                {optionName}
            </Text>
        </TouchableOpacity>
    );
};

export default Option;
