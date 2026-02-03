import { useEffect, useRef } from 'react';
import { Animated, Easing, Image } from 'react-native';

const AnimateGif = ({width, height}) => {
     const spinValue = useRef(new Animated.Value(0)).current;
    
        useEffect(() => {
            const animate = () => {
                spinValue.setValue(0);
                Animated.timing(spinValue, {
                    toValue: 1,
                    duration: 700, 
                    easing: Easing.linear,
                    useNativeDriver: true,
                }).start(() => animate())
            };
    
            animate();
        }, [spinValue]);
    
        const spin = spinValue.interpolate({
            inputRange: [0, 1],
            outputRange: ['0deg', '360deg'],
        });
    
    return (
        <Animated.View style={{ transform: [{ rotate: spin }] }}>
            <Image
                source={require("@/assets/images/loading.gif")}
                style={{ width, height }}
                resizeMode="contain"
            />
        </Animated.View>
    )
}

export default AnimateGif

