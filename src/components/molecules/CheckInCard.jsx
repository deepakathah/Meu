import imagePath from '@/constant/imagePath';
import globalFonts from "@/theme/fontFamily";
import globalStyle from "@/theme/globalStyle";
import themeColors from "@/theme/themeColors";
import { LinearGradient } from "expo-linear-gradient";
import { Dimensions, Image, StyleSheet, Text, View } from "react-native";
import { moderateScale } from "react-native-size-matters";
const { width, height } = Dimensions.get("window")
const CheckInCard = ({ heading, text, imageName, bgColor }) => {
    return (
        <View style={styles.card}>
            <LinearGradient
                style={styles.gradientBox}
                colors={[themeColors.secondaryVibrantPink, themeColors[bgColor]]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
            >
                <View style={[globalStyle.grid, { flexWrap: "nowrap", alignItems: "center",}]}>
                    <View style={[styles.box, { width: "70%", }]}>
                        <Text style={[globalStyle.headingSmall, globalFonts.poppins_600, { color: themeColors.white }]}>
                            {heading}
                        </Text>
                        <Text style={[globalStyle.commonText, globalFonts.poppins_500, { color: themeColors.white }]}>
                            {text}
                        </Text>
                    </View>
                    <Image source={imagePath[imageName]} resizeMode="contain" />
                </View>
            </LinearGradient>
        </View>
    );
};

export default CheckInCard;

const styles = StyleSheet.create({
    card: {
        width: width * 0.8,
        overflow: "hidden",
    },
    gradientBox: {
        borderRadius: moderateScale(15),
        paddingHorizontal: moderateScale(20),
        paddingVertical: moderateScale(20),
        justifyContent: "center",
        minHeight: height*0.2,
    },

});
