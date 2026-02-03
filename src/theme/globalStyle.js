import fontSize from "@/theme/fontSize";
import { Dimensions, StyleSheet } from "react-native";
import { moderateScale, scale, verticalScale } from "react-native-size-matters";
import themeColors from "./themeColors";
const { width, height } = Dimensions.get('window');

const globalStyle = StyleSheet.create({

    headingLarg: {
        fontSize: fontSize(40)
    },

    headingTitle: {
        fontSize: fontSize(32)
    },

    headingMedium: {
        fontSize: fontSize(24)
    },

    headingSmall: {
        fontSize: fontSize(20)
    },

    normalFontSize: {
        fontSize: fontSize(16),
    },

    commonHeading: {
        fontSize: fontSize(15),
    },

    commonText: {
        fontSize: fontSize(14),
    },

    smallText: {
        fontSize: fontSize(12),
    },

    MarginTop10: {
        marginTop: 10,
    },

    MarginTop15: {
        marginTop: 15,
    },

    MarginTop20: {
        marginTop: 20,
    },

    MarginTop25: {
        marginTop: 25,
    },

    MarginTop30: {
        marginTop: 30,
    },

    MarginTop35: {
        marginTop: 35,
    },

    MarginTop40: {
        marginTop: 40,
    },

    container: {
        flex: 1,
    },

    flexContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },

    displayFlex: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
    },

    flexStart: {
        flexDirection: "row",
        flexWrap: 'no-wrap',
        alignItems: 'flex-end',
    },

    flexCenter: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'center',
        alignContent: "center",
    },

    flexBetween: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
    },

    flexArround: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-around',
    },

    flexColumn: {
        flexDirection: "column",
        gap: verticalScale(20),
        position: "relative"
    },

    scrollContainer: {
        paddingVertical: 20,
        paddingHorizontal: 10,
        paddingBottom: 90,
    },

    btnContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: "row",
        gap: 10,
    },

    commonBtn: {
        height: 40,
        borderRadius: 10,
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "row",
    },

    btnText: {
        fontSize: 18,
    },

    btnTextCommon: {
        fontSize: 16,
    },

    loadingText: {
        fontSize: 18,
        color: 'black',
    },

    shadow: {
        shadowColor: "#c3cddb",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.8,
        shadowRadius: 2,
        elevation: 5
    },

    grid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        alignItems: "center",
        rowGap: 15,
    },

    gridItem: {
        width: '100%',
        backgroundColor: '#ffffff',
        borderRadius: 10,
        padding: 15,
        flexDirection: 'row',
        justifyContent: "flex-start",
        gap: 20,
    },



    //////////// model body /////

    modelContainer: {
        position: "absolute",
        top: 0,
        left: 0,
        width: width,
        height: height,
        justifyContent: 'center',
        alignItems: 'center',
    },

    modelBody: {
        width: width * 0.8,
        minHeight: width * 0.8,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: themeColors.white,
        borderRadius: 20,
        padding: 30,
        overflow: "hidden"
    },

    bgLayer: {
        // backgroundColor: '#000000aa',
        backgroundColor: '#00000075',
    },


    // ============= input style ===========

    inputWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: themeColors.white,
        borderRadius: 10,
        height: verticalScale(40),
        paddingHorizontal: scale(15),
    },

    indianNum: {
        fontSize: verticalScale(16),
        marginRight: scale(5),
        color: themeColors.black,
    },

    inputField: {
        flex: 1,
        fontSize: verticalScale(14),
        color: themeColors.black,
        paddingVertical: 0,
    },

    // ================ Loading styling ============
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },

    placeHolderColor: {
        color: "#616161"
    },

    // ========= top meu section =================
    topSection: {
        position: "relative",
        width: "100%",
        height: verticalScale(300),
        justifyContent: "center",
        alignItems: "center",
    },

    logoWrapper: {
        position: 'relative',
        width: scale(300),
        height: scale(200),
        justifyContent: "center",
        alignItems: "center",
        boxSizing: "border-box"
        // backgroundColor: "red",
        // opacity: 0.5
    },


    logo: {
        width: scale(120),
        resizeMode: 'contain',
    },


    dot: {
        position: 'absolute',
        height: 50,
        width: 50,
        resizeMode: 'contain',
    },


    heading: {
        fontSize: moderateScale(30),
        color: themeColors.white,
        textAlign: 'center',
        textTransform: "uppercase",
        lineHeight: moderateScale(40),
    },

    description: {
        fontSize: moderateScale(16),
        color: themeColors.white,
        lineHeight: moderateScale(22),
        textAlign: 'center',
    },

    button: {
        backgroundColor: themeColors.warmYellow,
        borderRadius: 25,
        height: verticalScale(40),
        width: "100%",
        alignItems: "center",
        justifyContent: "center"
    },

    buttonText: {
        fontSize: moderateScale(16),
        color: themeColors.darkCharcoal,
        textAlign: 'center',
        textTransform: "uppercase",
        width: "100%",
    },

    // =========== Select btn grid =============
    btnGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'center',
        gap: 10,
        borderRadius: 10
    }
});

export default globalStyle;