import globalFonts from "@/theme/fontFamily";
import globalStyle from '@/theme/globalStyle';
import themeColors from '@/theme/themeColors';
import { useVideoPlayer, VideoView } from 'expo-video';
import { useCallback, useState } from 'react';
import { Dimensions, Modal, Text, TouchableOpacity, View } from 'react-native';

const { width: screenWidth } = Dimensions.get('window');
const aspectRatio = 16 / 9;

const ModelVideo = ({ videoPath, setIsVideo, color, returnData, socket }) => {
    const [containerWidth, setContainerWidth] = useState(screenWidth * 0.9);
    const player = useVideoPlayer(videoPath, (player) => {
        player.loop = false;
        player.play();
    });

    const handleSkip = useCallback(() => {
        setIsVideo('');
        socket.send(JSON.stringify(returnData));
    }, [socket, setIsVideo, returnData]);

    return (
        <Modal transparent>
            <View style={[globalStyle.modelContainer,{backgroundColor: "#000000e8"}]}>
                <View
                    style={[globalStyle.modelBody, { width: containerWidth, padding: 0, backgroundColor: "transparent" }]}
                    onLayout={({ nativeEvent }) => setContainerWidth(nativeEvent.layout.width)}
                >
                    <VideoView
                        player={player}
                        allowsFullscreen
                        allowsPictureInPicture
                        style={{ width: containerWidth, height: containerWidth * aspectRatio }}
                    />
                    <TouchableOpacity
                        onPress={handleSkip}
                        style={[
                            globalStyle.commonBtn,
                            globalStyle.MarginTop15,
                            { backgroundColor: themeColors[color], width: '100%' }
                        ]}
                    >
                        <Text style={[globalStyle.btnTextCommon, globalFonts.poppins_700, { color: themeColors.white }]}>
                            Skip
                        </Text>
                    </TouchableOpacity>
                </View>
            </View>
        </Modal>
    );
};

export default ModelVideo;
