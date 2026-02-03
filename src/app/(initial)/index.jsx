import imagePath from '@/constant/imagePath';
import globalFonts from "@/theme/fontFamily";
import globalStyle from '@/theme/globalStyle';
import themeColors from '@/theme/themeColors';
import { useRouter } from 'expo-router';
import {
    Image,
    StatusBar,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { moderateScale, scale, verticalScale } from 'react-native-size-matters';

const GetStartedScreen = () => {

    const router = useRouter();
    const handleNavigation = () => {
        router.push('/(auth)/');
    };


    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="light" />
            <View style={globalStyle.topSection}>
                <Image source={imagePath.panda} style={[styles.imageCustom, { top: verticalScale(20), left: 0 }]} />
                <Image source={imagePath.dragon} style={[styles.imageCustom, { top: 0, right: verticalScale(40) }]} />
                <Image source={imagePath.monkey} style={[styles.imageCustom, { top: verticalScale(200), left: scale(10) }]} />
                <Image source={imagePath.cat} style={[styles.imageCustom, { top: verticalScale(180), right: scale(-5) }]} />

                <View style={globalStyle.logoWrapper}>
                    <Image source={imagePath.logo} style={globalStyle.logo} />
                    <Image source={imagePath.redDot} style={[globalStyle.dot, { top: "15%", left: "28%" }]} />
                    <Image source={imagePath.whiteDot} style={[globalStyle.dot, { top: "33%", right: "15%" }]} />
                    <Image source={imagePath.whiteDot} style={[globalStyle.dot, { top: "55%", left: "2%" }]} />
                    <Image source={imagePath.redDot} style={[globalStyle.dot, { top: "65%", right: "25%" }]} />
                    <Image source={imagePath.whiteDot} style={[globalStyle.dot, { bottom: "0", left: "35%" }]} />
                </View>
            </View>

            <View style={styles.middleSection}>
                <Text style={[globalStyle.heading, globalFonts.poppins_700]}>
                    FIND YOUR PERFECT MATCH
                </Text>
                <Text style={[globalStyle.description, globalFonts.poppins_500]}>
                    Meet real people and create real connections. Swipe, match, and start something meaningful today!
                </Text>

                <TouchableOpacity style={globalStyle.button} onPress={handleNavigation}>
                    <Text style={[globalFonts.poppins_600, globalStyle.buttonText]}>
                        Get Started
                    </Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: themeColors.primaryRichPurple,
        padding: moderateScale(20),
    },
    imageCustom: {
        position: 'absolute',
        resizeMode: 'contain',
        width: moderateScale(90),
    },
    middleSection: {
        flex: 1,
        paddingHorizontal: 20,
        gap: 30,
        marginTop: 40,
    },
});

export default GetStartedScreen;
