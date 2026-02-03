// import globalFonts from '@/theme/fontFamily';
// import globalStyle from "@/theme/globalStyle";
// import themeColors from '@/theme/themeColors';
// import { Camera, CameraView } from "expo-camera";
// import { useRouter } from "expo-router";
// import { useEffect, useState } from "react";
// import { Dimensions, StyleSheet, Text, TouchableOpacity, View } from "react-native";
// import { verticalScale } from 'react-native-size-matters';
// import { useSelector } from 'react-redux';
// const { width, height } = Dimensions.get("window");
// const ScanQr = ({
//     setIsOpenCamera,
//     sendMessageToSocket,
//     socketData
// }) => {
//     const [hasPermission, setHasPermission] = useState(null);
//     const [scanned, setScanned] = useState(false);
//     const router = useRouter();
//     const { user_id } = useSelector((state) => state.auth);

//     useEffect(() => {
//         const getCameraPermissions = async () => {
//             const { status } = await Camera.requestCameraPermissionsAsync();
//             setHasPermission(status === "granted");
//         };

//         getCameraPermissions();
//     }, []);

//     const handleBarcodeScanned = ({ data }) => {
//         sendMessageToSocket({ ...socketData, userId: user_id, requestId: data })
//     };


//     if (hasPermission === null) {
//         return (
//             <View style={[styles.container]}>
//                 <Text style={[globalStyle.commonHeading, styles.scanText]}>
//                     Requesting for camera permission
//                 </Text>
//             </View>
//         );
//     }

//     if (hasPermission === false) {
//         return (
//             <View style={[styles.container]}>
//                 <Text style={[globalStyle.commonHeading, styles.scanText]}>
//                     No access to camera
//                 </Text>
//             </View>
//         );
//     }

//     return (
//         <View style={[styles.container]}>
//             <View style={styles.cameraContainer}>
//                 <CameraView
//                     onBarcodeScanned={scanned ? undefined : handleBarcodeScanned}
//                     barcodeScannerSettings={{
//                         barcodeTypes: ["qr", "pdf417"],
//                     }}
//                     style={styles.camera}
//                 />
//                 <View style={[styles.corner, styles.topLeft]} />
//                 <View style={[styles.corner, styles.topRight]} />
//                 <View style={[styles.corner, styles.bottomLeft]} />
//                 <View style={[styles.corner, styles.bottomRight]} />
//             </View>
//             <TouchableOpacity onPress={() => setIsOpenCamera(false)}
//                 style={[
//                     globalStyle.commonBtn,
//                     {
//                         backgroundColor: themeColors.secondaryVibrantPink,
//                         marginTop: 20,
//                         width: width * 0.4,
//                     },
//                 ]}
//             >
//                 <Text style={[globalStyle.btnTextCommon, globalFonts.poppins_500, { color: themeColors.white }]}>Close</Text>
//             </TouchableOpacity>
//         </View>
//     );
// }

// const styles = StyleSheet.create({
//     container: {
//         position: "absolute",
//         top: 0,
//         left: 0,
//         width: width,
//         height: height,
//         zIndex: 1000,
//         justifyContent: "center",
//         alignItems: "center",
//         backgroundColor: themeColors.white
//     },

//     cameraContainer: {
//         width: width * 0.8,
//         height: width * 0.8,
//         overflow: "hidden",
//     },

//     camera: {
//         width: "100%",
//         height: "100%",
//     },

//     scanText: {
//         color: themeColors.white,
//         marginTop: verticalScale(20),
//         fontFamily: "GoogleSansBold"
//     },

//     corner: {
//         position: 'absolute',
//         width: 30,
//         height: 30,
//         borderColor: themeColors.darkCharcoal,
//     },

//     topLeft: {
//         top: 0,
//         left: 0,
//         borderLeftWidth: 4,
//         borderTopWidth: 4,
//     },

//     topRight: {
//         top: 0,
//         right: 0,
//         borderRightWidth: 4,
//         borderTopWidth: 4,
//     },

//     bottomLeft: {
//         bottom: 0,
//         left: 0,
//         borderLeftWidth: 4,
//         borderBottomWidth: 4,
//     },

//     bottomRight: {
//         bottom: 0,
//         right: 0,
//         borderRightWidth: 4,
//         borderBottomWidth: 4,
//     },
// });

// export default ScanQr


import globalFonts from '@/theme/fontFamily';
import globalStyle from "@/theme/globalStyle";
import themeColors from '@/theme/themeColors';
import { Camera, CameraView } from "expo-camera";
import { useEffect, useState } from "react";
import { Dimensions, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { verticalScale } from 'react-native-size-matters';
import { useSelector } from 'react-redux';

const { width, height } = Dimensions.get("window");

const ScanQr = ({ setIsOpenCamera, sendMessageToSocket, socketData }) => {
    const [hasPermission, setHasPermission] = useState(null);
    const [scanned, setScanned] = useState(false);
    const { user_id } = useSelector((state) => state.auth);

    useEffect(() => {
        const getCameraPermissions = async () => {
            const { status } = await Camera.requestCameraPermissionsAsync();
            setHasPermission(status === "granted");
        };

        getCameraPermissions();
    }, []);

    const handleBarcodeScanned = ({ data }) => {
        if (!scanned) {
            sendMessageToSocket({ action: socketData["action"], userId: user_id, requestId: data });
            setIsOpenCamera(false);
            setScanned(true);
        }
    };

    if (hasPermission === null) {
        return (
            <View style={styles.container}>
                <Text style={[globalStyle.commonHeading, styles.scanText]}>
                    Requesting camera permission...
                </Text>
            </View>
        );
    }

    if (hasPermission === false) {
        return (
            <View style={styles.container}>
                <Text style={[globalStyle.commonHeading, styles.scanText]}>
                    No access to camera
                </Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <View style={styles.cameraContainer}>
                <CameraView
                    onBarcodeScanned={handleBarcodeScanned}
                    barcodeScannerSettings={{
                        barcodeTypes: ["qr", "pdf417"],
                    }}
                    style={styles.camera}
                />
                <View style={[styles.corner, styles.topLeft]} />
                <View style={[styles.corner, styles.topRight]} />
                <View style={[styles.corner, styles.bottomLeft]} />
                <View style={[styles.corner, styles.bottomRight]} />
            </View>
            <TouchableOpacity
                onPress={() => setIsOpenCamera(false)}
                style={[globalStyle.commonBtn, {
                    backgroundColor: themeColors.secondaryVibrantPink,
                    marginTop: 20,
                    width: width * 0.4,
                }]}
            >
                <Text style={[globalStyle.btnTextCommon, globalFonts.poppins_500, { color: themeColors.white }]}>
                    Close
                </Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        position: "absolute",
        top: 0,
        left: 0,
        width: width,
        height: height,
        zIndex: 1000,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: themeColors.white
    },
    cameraContainer: {
        width: width * 0.8,
        height: width * 0.8,
        overflow: "hidden",
    },
    camera: {
        width: "100%",
        height: "100%",
    },
    scanText: {
        color: themeColors.darkCharcoal,
        marginTop: verticalScale(20),
        fontFamily: "GoogleSansBold"
    },
    corner: {
        position: 'absolute',
        width: 30,
        height: 30,
        borderColor: themeColors.darkCharcoal,
    },
    topLeft: {
        top: 0,
        left: 0,
        borderLeftWidth: 4,
        borderTopWidth: 4,
    },
    topRight: {
        top: 0,
        right: 0,
        borderRightWidth: 4,
        borderTopWidth: 4,
    },
    bottomLeft: {
        bottom: 0,
        left: 0,
        borderLeftWidth: 4,
        borderBottomWidth: 4,
    },
    bottomRight: {
        bottom: 0,
        right: 0,
        borderRightWidth: 4,
        borderBottomWidth: 4,
    },
});

export default ScanQr;
