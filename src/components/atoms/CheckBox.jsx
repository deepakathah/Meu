import globalFonts from "@/theme/fontFamily";
import globalStyle from '@/theme/globalStyle';
import themeColors from '@/theme/themeColors';
import Checkbox from 'expo-checkbox';
import { useEffect } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { scale, verticalScale } from "react-native-size-matters";
const CheckBox = ({ options, selectedOptions, setSelectedOptions, color }) => {

  useEffect(() => {
  }, [selectedOptions]);

  // Handle checkbox value change
  const handleCheckboxChange = (value) => {
    setSelectedOptions((prev) => {
      if (prev.includes(value)) {
        return prev.filter(item => item !== value);
      } else {
        return [...prev, value];
      }
    });
  };

  return (
    <View style={styles.container}>
      {options?.map((item) => (
        <TouchableOpacity
          key={item}
          style={styles.section}
          onPress={() => handleCheckboxChange(item)}
          activeOpacity={0.7} 
        >
          <Checkbox
            style={[styles.checkbox, { transform: [{ scale: 0.8 }] }, globalStyle.commonText]}
            value={selectedOptions.includes(item)}
            onValueChange={() => handleCheckboxChange(item)}
            color={selectedOptions.includes(item) ? themeColors[color] : themeColors["warmYellow"]}
          />
          <Text style={[globalStyle.commonText, globalFonts.poppins_700,]}>{item}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};

export default CheckBox;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: "100%",
    paddingLeft: scale(20),
  },
  section: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: verticalScale(5),
  },
  paragraph: {
    fontSize: 15,
  },
  checkbox: {
    margin: 8,
  },
});
