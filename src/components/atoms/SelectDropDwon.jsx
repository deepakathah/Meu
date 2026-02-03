import globalFonts from '@/theme/fontFamily';
import globalStyle from '@/theme/globalStyle';
import { useState } from 'react';
import { StyleSheet, TextInput, View } from 'react-native';
import { Dropdown } from 'react-native-element-dropdown';

const SelectDropDown = ({ options, setDropDownVal }) => {

  const data = options.map(option => ({ label: option, value: option }));

  const [optionValue, setOptionValue] = useState('');
  const [customProfession, setCustomProfession] = useState('');

  return (
    <View style={{ width: '100%' }}>

      {/* If user selects "Other", show text input */}
      {optionValue.toLocaleLowerCase() === "other" ? (
        <TextInput
          style={[styles.inputField, globalStyle.commonText, globalFonts.poppins_500,]}
          placeholder="Type your industry"
          value={customProfession}
          placeholderTextColor={"#616161"}
          onChangeText={(text) => {
            setCustomProfession(text);
            setDropDownVal(text); 
          }}
        />
      ) : (
        <Dropdown
          style={styles.dropdown}
          placeholderStyle={[globalStyle.commonText, globalFonts.poppins_500]}
          selectedTextStyle={[globalStyle.commonText, globalFonts.poppins_500]}
          inputSearchStyle={[styles.inputSearchStyle, globalStyle.commonText, globalFonts.poppins_500]}
          iconStyle={styles.iconStyle}
          data={data}
          search
          maxHeight={300}
          labelField="label"
          valueField="value"
          placeholder="Select an option"
          searchPlaceholder="Search..."
          value={optionValue}
          onChange={item => {
            setOptionValue(item.value);

            if (item.value !== "Other") {
              setDropDownVal(item.value);
              setCustomProfession('');
            }
          }}
        />
      )}

    </View>
  );
};

const styles = StyleSheet.create({
  dropdown: {
    width: '100%',
    height: 50,
  },
  iconStyle: {
    width: 20,
    height: 20,
  },
  inputSearchStyle: {
    height: 40,
  },
  
  inputField: {
    width: '100%',
    height: 50,
  },
});

export default SelectDropDown;
