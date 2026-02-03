import { Dimensions, StyleSheet } from 'react-native';
import { scale } from 'react-native-size-matters';
import themeColors from './themeColors';

const { width, height } = Dimensions.get('window');
const messageContainerW = width * 0.8;

const chatBotStyle = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'flex-end',
        alignItems: 'center',
        paddingTop: 5,
    },

    chatMessageBox: {
        flex: 1,
        width: width,
        paddingHorizontal: 10,
        paddingVertical: 20,
        backgroundColor: themeColors.lightPink,
    },

    messageContainer: {
        maxWidth: messageContainerW,
        flexDirection: 'row',
        alignItems: "flex-end",
        marginBottom: 10,
        gap: 10,
    },

    messageBx: {
        maxWidth: messageContainerW - 40,
        padding: scale(10),
        borderRadius: 15,
    },

    chatImage: {
        width: scale(20),
    },

    messageHeading: {
        fontWeight: '500',
        marginBottom: 10,
    },

    messageText: {
        lineHeight: 19,
    },

    timeText: {
        fontWeight: '600',
        marginTop: 5,
    },

    MessageRight: {
        marginLeft: 'auto',
    },

    MessageLeft: {
        marginRight: 'auto',
    },

    textAlignR: {
        textAlign: 'right',
    },

    borderRadiusLB: {
        borderBottomLeftRadius: 0,
    },

    borderRadiusRB: {
        borderBottomRightRadius: 0,
    },

    sendMessageInput: {
        height: height * 0.07,
        width: width,
        backgroundColor: themeColors.darkCharcoal,
        paddingHorizontal: 20,
    },

    inputField: {
        flex: 1,
        backgroundColor: themeColors.white,
        borderRadius: 30,
        paddingHorizontal: scale(15),
        height: height * 0.05
    },

    sendButton: {
        justifyContent: 'center',
        alignItems: 'center',
    },

    bottomRadiusNone: {
        borderBottomEndRadius: 0,
        borderBottomLeftRadius: 0
    },

    sendImage: {
        width: 70,
        height: 70,
        resizeMode: 'contain',
        borderRadius: 10,
    },

    imageGrid: {
       flexDirection: "row",
       flexWrap: 'wrap',
       gap: scale(10),
       justifyContent: "flex-end"
    },

    gridImage: {
        width: 70,
        height: 70,
        resizeMode: 'contain',
        borderRadius: 10,
    },
});

export default chatBotStyle;