import globalFonts from "@/theme/fontFamily";
import globalStyle from '@/theme/globalStyle';
import themeColors from '@/theme/themeColors';
import { useState } from 'react';
import { Dimensions, Modal, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
const { width, height } = Dimensions.get('window');

const SelectProfession = ({ setIsOpenProfession, sendMessage, options, color }) => {
  const [inputIndustry, setInputIndustry] = useState('');
  const [inputProfession, setInputProfession] = useState('');
  const [inputCompany, setInputCompany] = useState('');

  const capitalize = (str) => {
    if (!str) return '';
    const words = str.split(' ');
    words[0] = words[0].charAt(0).toUpperCase() + words[0].slice(1);
    return words.join(' ');
  };

  const sendQuery = () => {
    if (inputProfession && inputCompany && inputIndustry) {
      const fullQuery = `${capitalize(inputProfession)} at ${capitalize(inputCompany)} in the ${capitalize(inputIndustry)}`;
      
      sendMessage(fullQuery, { profession: inputProfession, industry: inputIndustry, company: inputCompany });
      setIsOpenProfession(false);
    } else {
      console.warn('Please fill all fields.');
    }
  };

  return (
    <Modal transparent={true}>
      <View style={[globalStyle.flexContainer, globalStyle.bgLayer]}>
        <View style={globalStyle.modelBody}>
          <View style={[styles.optionInputBx, { borderColor: themeColors[color], }]}>
            <Text style={[styles.selectLabel, globalFonts.poppins_500, { color: themeColors[color], }]}>Industry</Text>
            <TextInput
              placeholder="Type your industry..."
              keyboardType="default"
              style={[styles.inputField, globalStyle.commonText, globalFonts.poppins_500,]}
              value={inputIndustry}
              onChangeText={setInputIndustry}
              placeholderTextColor={"#616161"}
            />
          </View>

          <View style={[styles.optionInputBx, { borderColor: themeColors[color], }]}>
            <Text style={[styles.selectLabel, globalFonts.poppins_500, { color: themeColors[color], }]}>Profession</Text>
            <TextInput
              placeholder="Type your profession..."
              keyboardType="default"
              style={[styles.inputField, globalStyle.commonText, globalFonts.poppins_500,]}
              value={inputProfession}
              onChangeText={setInputProfession}
              placeholderTextColor={"#616161"}
            />
          </View>


          <View style={[styles.optionInputBx, { borderColor: themeColors[color], }]}>
            <Text style={[styles.selectLabel, globalFonts.poppins_500, { color: themeColors[color], }]}>Company</Text>
            <TextInput
              placeholder="Type your company..."
              keyboardType="default"
              style={[styles.inputField, globalStyle.commonText, globalFonts.poppins_500,]}
              value={inputCompany}
              onChangeText={setInputCompany}
              placeholderTextColor={"#616161"}
            />
          </View>

          <TouchableOpacity
            onPress={sendQuery}
            style={[
              globalStyle.commonBtn,
              globalStyle.MarginTop15,
              {
                backgroundColor: themeColors[color],
                width: "100%",
              },
            ]}
          >
            <Text style={[globalStyle.btnTextCommon, globalFonts.poppins_700, { color: themeColors.white }]}>Send</Text>
          </TouchableOpacity>
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
  },
  inputField: {
    width: '100%',
    height: 50,
  },
});

export default SelectProfession;
