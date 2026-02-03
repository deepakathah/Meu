import AnimateGif from "@/components/atoms/AnimateGif";
import globalStyle from '@/theme/globalStyle';
import { Dimensions, View } from 'react-native';

const { width, height } = Dimensions.get('window');

const Loading = () => {

    return (
        <View style={[globalStyle.flexContainer, { width: "100%", height: "100%", }]}>
            <AnimateGif width={80} height={80} />
        </View>
    )
}

export default Loading