import globalFonts from "@/theme/fontFamily";
import globalStyle from '@/theme/globalStyle';
import themeColors from '@/theme/themeColors';
import { Feather } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { useEffect, useState } from 'react';
import {
    Alert,
    Image,
    Modal,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';
import { scale } from "react-native-size-matters";

const MIN_IMAGES = 3;
const MAX_IMAGES = 5;

const UploadPictures = ({
    setIsselfiePicturs,
    sendMessage,
    socket,
    returnData,
}) => {

    const [images, setImages] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [hasFailedImages, setHasFailedImages] = useState(false);

    useEffect(() => {
        if (!returnData?.images?.length || !images.length) return;
        uploadAllImages();
    }, [returnData?.images]);

    const uploadAllImages = async () => {
        try {
            setIsLoading(true);
            setHasFailedImages(false);

            const uploadPromises = images.map(async (img) => {
                updateStatus(img.name, 'uploading');

                const s3Item = returnData.images.find(
                    el => el.image === img.name
                );

                if (!s3Item) {
                    updateStatus(img.name, 'failed');
                    throw img;
                }

                try {
                    await uploadToS3(s3Item.uploadUrl, img);
                    updateStatus(img.name, 'success');
                    return img;
                } catch {
                    updateStatus(img.name, 'failed');
                    throw img;
                }
            });

            const results = await Promise.allSettled(uploadPromises);

            const failed = results
                .filter(r => r.status === 'rejected')
                .map(r => r.reason);

            if (failed.length > 0) {
                setHasFailedImages(true);
                setImages(prev =>
                    prev.filter(img =>
                        failed.find(f => f.name === img.name)
                    )
                );

                Alert.alert(
                    "Invalid Images",
                    "Some images are not valid. Please upload other images."
                );
                return;
            }

            // for (const img of images) {
            //     sendMessage(img.uri, null, { success: true });
            // }

            sendMessage(returnData.images.map(img => img.s3Url), null, { success: true });

            socket.send(JSON.stringify({
                ...returnData,
                [returnData.key]: true,
            }));

            setIsselfiePicturs(false);

        } catch {
            Alert.alert(
                "Upload Failed",
                "Something went wrong while uploading images."
            );
        } finally {
            setIsLoading(false);
        }
    };

    const updateStatus = (name, status) => {
        setImages(prev =>
            prev.map(img =>
                img.name === name ? { ...img, status } : img
            )
        );
    };

    const uploadToS3 = async (signedUrl, file) => {
        const response = await fetch(file.uri);
        const blob = await response.blob();

        const uploadRes = await fetch(signedUrl, {
            method: 'PUT',
            body: blob,
            headers: {
                'Content-Type': file.type,
                'Content-Disposition': 'attachment',
            },
        });

        if (!uploadRes.ok) throw new Error('Upload failed');
    };

    const pickImages = async () => {
        if (isLoading) return;

        const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (!permission.granted) {
            Alert.alert("Permission Required", "Please allow access to photos.");
            return;
        }

        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsMultipleSelection: true,
            selectionLimit: MAX_IMAGES - images.length,
            quality: 1,
        });

        if (!result.canceled) {
            const selected = result.assets.map(img => ({
                uri: img.uri,
                type: img.type || 'image/jpeg',
                name: img.fileName || `image-${Date.now()}.jpg`,
                status: 'pending'
            }));

            setImages(prev => [...prev, ...selected].slice(0, MAX_IMAGES));
            setHasFailedImages(false);
        }
    };

    const removeImage = (index) => {
        if (isLoading) return;
        setImages(prev => prev.filter((_, i) => i !== index));
    };

    const startUpload = () => {
        if (isLoading) return;

        if (images.length < MIN_IMAGES) {
            Alert.alert(
                "Minimum Images Required",
                "Please upload at least 3 images."
            );
            return;
        }

        socket.send(JSON.stringify({
            ...returnData,
            images: images.map(img => ({ name: img.name }))
        }));
    };

    const renderBadge = (status) => {
        if (status === 'uploading') return { text: 'Uploading', bg: themeColors.primaryRichPurple };
        if (status === 'failed') return { text: 'Failed', bg: themeColors.secondaryVibrantPink };
        if (status === 'success') return { text: 'Done', bg: themeColors.green };
        return null;
    };

    return (
        <Modal transparent animationType="fade">
            <View style={[globalStyle.flexContainer, globalStyle.bgLayer]}>
                <View style={[globalStyle.modelBody]}>

                    <ScrollView style={{ width: "100%"}} showsVerticalScrollIndicator={false}>

                        <Text style={[globalStyle.headingSmall, globalFonts.poppins_600]}>
                            Upload 3–5 Images
                        </Text>

                        {hasFailedImages && (
                            <Text style={styles.failedText}>
                                Some images failed. Please replace the highlighted ones.
                            </Text>
                        )}

                        {images.length < MAX_IMAGES && !isLoading && (
                            <TouchableOpacity
                                onPress={pickImages}
                                style={[styles.uploadBox, globalStyle.MarginTop10]}
                            >
                                <Feather
                                    name="upload-cloud"
                                    size={36}
                                    color={themeColors.secondaryVibrantPink}
                                />
                                <Text style={styles.uploadText}>
                                    Tap to upload pictures
                                </Text>
                            </TouchableOpacity>
                        )}

                        <View style={[styles.imageContainer, globalStyle.MarginTop10]}>
                            {images.map((item, index) => {
                                const badge = renderBadge(item.status);
                                return (
                                    <View key={index} style={styles.imageWrapper}>
                                        <Image
                                            source={{ uri: item.uri }}
                                            style={[
                                                styles.image,
                                                item.status === 'failed' && styles.failedImage
                                            ]}
                                        />

                                        {badge && (
                                            <View style={[styles.badge, { backgroundColor: badge.bg }]}>
                                                <Text style={styles.badgeText}>
                                                    {badge.text}
                                                </Text>
                                            </View>
                                        )}

                                        <TouchableOpacity
                                            disabled={isLoading}
                                            onPress={() => removeImage(index)}
                                            style={[
                                                styles.removeBtn,
                                                isLoading && styles.disabled
                                            ]}
                                        >
                                            <Feather name="x" size={12} color="#fff" />
                                        </TouchableOpacity>
                                    </View>
                                );
                            })}
                        </View>

                        <TouchableOpacity
                            onPress={startUpload}
                            disabled={isLoading || images.length < MIN_IMAGES}
                            style={[
                                globalStyle.commonBtn,
                                globalStyle.MarginTop10,
                               {
                                 backgroundColor : (isLoading || images.length < MIN_IMAGES) ? themeColors.lightGray: themeColors.secondaryVibrantPink
                               }
                            ]}
                        >
                            <Text
                                style={[
                                    globalStyle.btnTextCommon,
                                    globalFonts.poppins_700,
                                    { color: isLoading ? themeColors.darkCharcoal : themeColors.white }
                                ]}
                            >
                                {isLoading ? 'Uploading Images...' : 'Upload Images'}
                            </Text>
                        </TouchableOpacity>

                    </ScrollView>
                </View>
            </View>
        </Modal>
    );
};

export default UploadPictures;
const styles = StyleSheet.create({
    failedText: {
        color: '#ff3b30',
        fontSize: 12,
        marginBottom: 12
    },
    uploadBox: {
        borderWidth: 1.5,
        borderStyle: 'dashed',
        borderColor: themeColors.secondaryVibrantPink,
        borderRadius: 14,
        paddingVertical: 26,
        alignItems: 'center',
        marginBottom: 14
    },
    uploadText: {
        marginTop: 8,
        color: themeColors.secondaryVibrantPink
    },
    imageContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        flexWrap: 'wrap'
    },
    imageWrapper: {
        margin: 6
    },
    image: {
        width: scale(100),
        height: scale(100),
        borderRadius: 12,
        borderWidth: 1,
        borderColor: themeColors.lightGray || '#E5E7EB',
    },
    failedImage: {
        opacity: 0.6
    },
    badge: {
        position: 'absolute',
        bottom: 4,
        left: 4,
        paddingHorizontal: 6,
        borderRadius: 6
    },
    badgeText: {
        color: themeColors.white,
        fontSize: 10,
        ...globalFonts.poppins_500
    },
    removeBtn: {
        position: 'absolute',
        top: -6,
        right: -6,
        backgroundColor: '#ff3b30',
        borderRadius: 12,
        width: 22,
        height: 22,
        alignItems: 'center',
        justifyContent: 'center'
    },
    disabled: {
        opacity: 0.5
    },
    disabledBtn: {
        backgroundColor: '#ccc'
    }
});
