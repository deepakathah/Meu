import imagePath from "@/constant/imagePath";
import globalFonts from "@/theme/fontFamily";
import globalStyle from "@/theme/globalStyle";
import themeColors from "@/theme/themeColors";
import { CameraView, useCameraPermissions } from 'expo-camera';
import { FlipType, manipulateAsync } from 'expo-image-manipulator';
import { useRef, useState } from 'react';
import { Button, Dimensions, Image, Modal, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { scale } from "react-native-size-matters";


const Camera = ({ color, setIsSelfie, pickSelfie, setModals }) => {
  const [facing, setFacing] = useState('front');
  const [photoUri, setPhotoUri] = useState(null);
  const cameraRef = useRef(null);
  const [permissionInfo, requestPermission] = useCameraPermissions();

  if (!permissionInfo) {
    return (
      <Modal transparent>
        <View style={[globalStyle.flexContainer, globalStyle.bgLayer]}>
          <View style={globalStyle.modelBody}>
            <Text style={globalFonts.poppins_500}>Loading...</Text>
          </View>
        </View>
      </Modal>
    )
  }

  if (!permissionInfo.granted) {
    return (
      <Modal transparent>
        <View style={[globalStyle.flexContainer, globalStyle.bgLayer]}>
          <View style={globalStyle.modelBody}>
            <Text style={[styles.message, globalFonts.poppins_500]}>We need your permission to show the camera</Text>
            <Button onPress={requestPermission} title="Grant Permission" />
          </View>
        </View>
      </Modal>
    );
  }

  const toggleCameraFacing = () => {
    setFacing(prev => (prev === 'back' ? 'front' : 'back'));
  };

  const takePhoto = async () => {
    if (cameraRef.current) {
      const photo = await cameraRef.current.takePictureAsync({ skipProcessing: true });

      // Mirror image if front-facing
      const finalPhoto = facing === 'front'
        ? await manipulateAsync(photo.uri, [{ flip: FlipType.Horizontal }], { compress: 1, format: 'jpeg' })
        : photo;

      setPhotoUri(finalPhoto.uri);

      const blob = await uriToBlob(finalPhoto.uri);
    }
  };

  const uriToBlob = async (uri) => {
    const response = await fetch(uri);
    const blob = await response.blob();
    return blob;
  };

  const retakePhoto = () => {
    setPhotoUri(null);
  };

  const handleImageSend = () => {
    pickSelfie(photoUri)
    setIsSelfie(false)
  }

  const isFront = facing === 'front';

  return (
    <Modal transparent >
      <View style={[globalStyle.flexContainer, globalStyle.bgLayer]}>
        <View style={[globalStyle.modelBody]}>
          <TouchableOpacity style={styles.closeBtn} onPress={() => setModals(prev => ({ ...prev, selfieImage: false }))}>
            <Image source={imagePath.close} style={styles.closeIcon} />
          </TouchableOpacity>
          <Text style={[globalStyle.headingMedium, globalFonts.poppins_500, { marginBottom: 10 }]}>
            Upload Selfie
          </Text>
          {photoUri ? (
            <View>
              <Image source={{ uri: photoUri }} style={styles.preview} />
              <View style={[globalStyle.flexArround, globalStyle.MarginTop15]}>
                <TouchableOpacity onPress={retakePhoto}
                  style={[globalStyle.commonBtn, {
                    backgroundColor: themeColors[color],
                    width: "45%"
                  }]} >
                  <Text style={[globalStyle.btnTextCommon, globalFonts.poppins_700, { color: themeColors.white }]}>Retake</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={handleImageSend}
                  style={[globalStyle.commonBtn, {
                    backgroundColor: themeColors[color],
                    width: "45%"
                  }]} >
                  <Text style={[globalStyle.btnTextCommon, globalFonts.poppins_700, { color: themeColors.white }]}>Send</Text>
                </TouchableOpacity>
              </View>
            </View>
          ) : (
            <View>
              <CameraView
                ref={cameraRef}
                style={[styles.camera, isFront && styles.mirror]}
                facing={facing}
              ></CameraView>

              <View style={[globalStyle.flexArround, globalStyle.MarginTop15]}>
                <TouchableOpacity
                  onPress={toggleCameraFacing}
                  style={[globalStyle.commonBtn, {
                    backgroundColor: themeColors[color],
                    width: "45%"
                  }]} >
                  <Text style={[globalStyle.btnTextCommon, globalFonts.poppins_700, { color: themeColors.white }]}>Flip</Text>
                </TouchableOpacity>

                <TouchableOpacity onPress={takePhoto}
                  style={[globalStyle.commonBtn, {
                    backgroundColor: themeColors[color],
                    width: "45%"
                  }]} >
                  <Text style={[globalStyle.btnTextCommon, globalFonts.poppins_700, { color: themeColors.white }]}>Capture</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
        </View>
      </View>
    </Modal>
  );
};

export default Camera;

const { width } = Dimensions.get('window');

const styles = StyleSheet.create({

  message: {
    textAlign: 'center',
    paddingBottom: 10,
    color: 'white',
  },
  camera: {
    width: width * 0.7,
    height: width * 0.7,
    borderRadius: 12,
    overflow: 'hidden',
    justifyContent: 'flex-end',
  },
  mirror: {
    transform: [{ scaleX: -1 }],
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 16,
    backgroundColor: 'transparent',
  },

  preview: {
    width: width * 0.7,
    height: width * 0.7,
    borderRadius: 12,
  },

  closeBtn: {
    position: "absolute",
    top: scale(5),
    right: scale(5),
    width: scale(20),
    height: scale(20),
    borderRadius: scale(20),
    backgroundColor: themeColors.darkCharcoal,
    justifyContent: "center",
    alignItems: "center"
  },

  closeIcon: {
    width: scale(15),
    height: scale(15),
    resizeMode: "contain"
  },

});
