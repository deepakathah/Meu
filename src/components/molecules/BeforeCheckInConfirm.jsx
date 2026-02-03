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

const BeforeCheckInConfirm = ({ place, setBeforeCheckIn, heading, description, handleConfirmedCheckIn }) => {

    return (
        <View style={styles.container}>
            <View style={styles.confirmBox}>
                <LinearGradient
                    style={[styles.boxHeading]}
                    colors={[themeColors.secondaryVibrantPink, themeColors.primaryRichPurple]}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                >
                    <View style={styles.topHeading}>
                        <Text
                            style={[
                                globalStyle.headingSmall,
                                globalFonts.poppins_500,
                                { color: themeColors.white },
                            ]}
                        >
                            {place?.name}
                        </Text>
                    </View>
                    <TouchableOpacity onPress={() => setBeforeCheckIn(false)}>
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
                    <TouchableOpacity
                        onPress={handleConfirmedCheckIn}
                        style={[
                            globalStyle.commonBtn,
                            {
                                backgroundColor: themeColors.warmYellow,
                                width: '100%',
                                marginTop: verticalScale(10),
                            },
                        ]}
                    >
                        <Text
                            style={[
                                globalStyle.btnTextCommon,
                                globalFonts.poppins_700,
                                { color: themeColors.white },
                            ]}
                        >
                            Next
                        </Text>
                    </TouchableOpacity>

                </View>

            </View>
        </View>
    );
};

export default BeforeCheckInConfirm;

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
        paddingVertical: verticalScale(10),
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
    },

    topHeading:{
        width: "80%"
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
