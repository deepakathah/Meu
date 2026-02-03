import globalFonts from "@/theme/fontFamily";
import globalStyle from '@/theme/globalStyle';
import themeColors from '@/theme/themeColors';
import { Dimensions, Image, Modal, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const { width, height } = Dimensions.get('window');

const GenderPicker = ({ setIsOpenGender, sendMessage, options, color }) => {
    const imageMap = {
        Man: require('@/assets/images/Man.png'),
        Woman: require('@/assets/images/Woman.png'),
        Other: require('@/assets/images/Non-Binary.png'), // Or whatever image you want
    };
    return (
        <Modal transparent={true}>
            <View style={[globalStyle.flexContainer, globalStyle.bgLayer]}>
                <View style={globalStyle.modelBody}>
                    {options && options.length > 0 && options.map((option, index) => (
                        <TouchableOpacity
                            key={index}
                            style={[
                                styles.genderBtn,
                                { borderColor: option === "Man" ? themeColors[color] : themeColors.lightPink }
                            ]}
                            onPress={() => {
                                sendMessage(option);
                                setIsOpenGender(false);
                            }}
                        >
                            <View style={[
                                styles.imageCircle,
                                {
                                    backgroundColor: option === "Man" ? themeColors.secondaryVibrantPink : themeColors.darkCharcoal,
                                    borderRadius: 50,
                                }
                            ]}>
                                <Image
                                    source={option === "Non-Binary" ? require('@/assets/images/Non-Binary.png') : imageMap[option]}
                                    resizeMode="contain"
                                    style={styles.genderImage}
                                />
                            </View>
                            <Text style={[styles.btnText, globalStyle.commonHeading, globalFonts.poppins_500,]}>{option}</Text>
                        </TouchableOpacity>
                    ))}
                </View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    genderBtn: {
        width: '100%',
        height: 55,
        borderRadius: 15,
        backgroundColor: themeColors.white,
        borderWidth: 1,
        flexDirection: 'row',
        alignItems: 'center',
        paddingLeft: 30,
        columnGap: 20,
        marginVertical: 10,
    },
    imageCircle: {
        width: 32,
        height: 32,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    genderImage: {
        width: 20,
        height: 20, 
    },
    btnText: {
        fontWeight: 'bold',
        color: themeColors.black,
    },
});

export default GenderPicker;
