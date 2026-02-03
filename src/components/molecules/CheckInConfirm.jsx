import imagePath from '@/constant/imagePath';
import globalFonts from "@/theme/fontFamily";
import globalStyle from "@/theme/globalStyle";
import themeColors from "@/theme/themeColors";
import { LinearGradient } from 'expo-linear-gradient';
import {
    Dimensions,
    Image,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { scale, verticalScale } from "react-native-size-matters";
const { width, height } = Dimensions.get("window");

const CheckInConfirm = ({ closeModel, hotspotName, heading, description }) => {
    return (
        <View style={styles.container}>
            <View style={styles.confirmBox}>
                <LinearGradient
                    style={[styles.boxHeading]}
                    colors={[themeColors.secondaryVibrantPink, themeColors.primaryRichPurple]}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                >
                    <Text
                        style={[
                            globalStyle.headingSmall,
                            globalFonts.poppins_500,
                            { color: themeColors.white },
                        ]}
                    >
                        {hotspotName?.name}
                    </Text>
                    <TouchableOpacity onPress={closeModel}>
                        <Image source={imagePath.close} style={styles.closeIcon} />
                    </TouchableOpacity>
                </LinearGradient>

                <View style={[styles.boxContent]}>
                    <Text style={[
                        globalStyle.headingSmall,
                        globalFonts.poppins_600,
                    ]}>{heading}</Text>
                    <Text
                        style={[
                            globalStyle.normalFontSize,
                            globalFonts.poppins_500,
                        ]}
                    >
                        {description}
                    </Text>

                </View>

            </View>
        </View>
    );
};

export default CheckInConfirm;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        position: "absolute",
        width,
        height,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: '#00000039',
    },
    confirmBox: {
        width: width * 0.9,
        backgroundColor: themeColors.white,
        borderRadius: 15,
        overflow: "hidden",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 5,
    },
    boxHeading: {
        width: "100%",
        backgroundColor: themeColors.primaryRichPurple,
        paddingHorizontal: scale(15),
        height: verticalScale(35),
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
    },
    closeIcon: {
        width: scale(20),
        height: scale(20),
        resizeMode: "contain",
    },

    boxContent: {
        paddingHorizontal: scale(15),
        paddingVertical: verticalScale(20),
        paddingBottom: verticalScale(30),
        flexDirection: "column",
        gap: 3
    },
});
