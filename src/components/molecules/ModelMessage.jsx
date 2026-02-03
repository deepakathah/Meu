import globalFonts from "@/theme/fontFamily";
import globalStyle from '@/theme/globalStyle';
import themeColors from '@/theme/themeColors';
import { useRouter } from "expo-router";
import { Dimensions, Modal, Text, TouchableOpacity, View } from 'react-native';
const { width, height } = Dimensions.get('window');

const ModelMessage = ({ heading = null, message, setIsError, isCheckIn, setIsCheckIn }) => {
    const router = useRouter()

    const capitalise = (str) => {
        if (!str) return "";
        const words = str.split(" ");
        words[0] = words[0].charAt(0).toUpperCase() + words[0].slice(1);
        return words.join(" ");
    };

    const handleClose = () => {
        console.log(message)
        setIsError(null);
        if (isCheckIn) {
            setIsCheckIn(false)
            router.back()
        }
    }

    return (
        <Modal transparent visible={!!message} animationType="fade">
            <View style={[globalStyle.modelContainer, globalStyle.bgLayer]}>
                <View style={globalStyle.modelBody}>
                    <Text style={[globalStyle.headingTitle, globalFonts.poppins_700]}>Oops!</Text>


                    <Text style={[globalStyle.normalFontSize, globalStyle.MarginTop10, globalFonts.poppins_600,]}>{capitalise(message)} {heading ? `at ${heading}` : ""}</Text>


                    {/* <Text style={[globalStyle.normalFontSize, globalFonts.poppins_500, {textAlign: "left"}]}>
                        {capitalise(message)}
                    </Text> */}

                    <TouchableOpacity
                        onPress={handleClose}
                        style={[
                            globalStyle.commonBtn,
                            globalStyle.MarginTop15,
                            {
                                backgroundColor: themeColors.warmYellow,
                                width: "100%"

                            }]}
                    >
                        <Text style={[globalStyle.btnTextCommon, globalFonts.poppins_700, { color: themeColors.black }]}>OK</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </Modal>
    )
}


export default ModelMessage