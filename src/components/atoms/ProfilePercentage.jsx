import imagePath from '@/constant/imagePath';
import themeColors from '@/theme/themeColors';
import React from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';
import { scale } from 'react-native-size-matters';

const ProfilePercentage = ({ percentage, imageSource }) => {
    const angle = percentage * 3.6; // Calculate angle based on percentage

    return (
        <View style={styles.container}>
            <View style={styles.progressContainer}>
                <View style={[styles.progressOverlay, { transform: [{ rotate: `${angle}deg` }] }]} />
                <Image
                    source={imageSource ? { uri: imageSource } : imagePath.person}
                    style={styles.image}
                    resizeMode="cover"
                />
                <View style={styles.blackOverlay} />
            </View>
            <Text style={styles.percentageText}>{`${Math.round(percentage)}%`}</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        justifyContent: 'center',
        alignItems: 'center',
    },

    progressContainer: {
        width: scale(60),
        height: scale(60),
        borderRadius: scale(30),
        backgroundColor: '#E0E0E0',
        position: 'relative',
        overflow: 'hidden',
        justifyContent: 'center',
        alignItems: 'center',
    },

    image: {
        width: scale(50),
        height: scale(50),
        borderRadius: scale(25),
    },

    blackOverlay: {
        position: 'absolute',
        alignSelf: "center",
        width: scale(50),
        height: scale(50),
        borderRadius: scale(25),
        backgroundColor: 'rgba(0, 0, 0, 0.4)',
        zIndex: 2,
    },

    progressOverlay: {
        position: 'absolute',
        width: scale(60),
        height: scale(60),
        borderRadius: scale(30),
        backgroundColor: 'transparent',
        borderWidth: scale(5),
        borderColor: themeColors.secondaryVibrantPink,
        borderTopWidth: 0,
        borderRightWidth: 0,
        zIndex: 1,

    },

    percentageText: {
        position: 'absolute',
        color: themeColors.white,
    },
});

export default ProfilePercentage;
