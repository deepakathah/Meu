import globalFonts from "@/theme/fontFamily";
import globalStyle from '@/theme/globalStyle';
import themeColors from '@/theme/themeColors';
import * as DocumentPicker from 'expo-document-picker';
import * as ImagePicker from 'expo-image-picker';
import { useEffect, useState } from 'react';
import { Modal, Text, TouchableOpacity, View } from 'react-native';
import Loading from './Loading';
import ModelMessage from "./ModelMessage";

const FileUpload = ({ setIsIdentityImage, sendMessage, socket, returnData, s3UploadData }) => {
  const [fileData, setFileData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState("");

  useEffect(() => {
    if (s3UploadData?.url && fileData) {
      uploadToS3(s3UploadData.url, fileData, s3UploadData);
    }
  }, [s3UploadData]);

  const uploadToS3 = async (signedUrl, file, metadata) => {
    try {
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
      const keyName = metadata.key;
      const payload = { ...metadata, [keyName]: uploadRes.ok };

      if (uploadRes.ok) {
        sendMessage(file.uri, null, payload);
        setIsIdentityImage(false);
      } else {
        socket.send(JSON.stringify(payload));
        console.error('Upload failed with status:', uploadRes.status);
      }
    } catch (err) {
      console.error('Upload error:', err);
      setIsError("Something went wrong. Please try agian.");
    } finally {
      setIsLoading(false);
    }
  };

  const pickImage = async () => {
    try {
      // Request media library permissions
      const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (!permissionResult.granted) {
        alert('Permission to access media library is required!');
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        quality: 1,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        const image = result.assets[0];
        const filename = image.fileName || `img-${Date.now()}.jpg`;

        const file = {
          uri: image.uri,
          filename,
          type: image.type || 'image/jpeg',
        };

        setFileData(file);
        setIsLoading(true);

        const payload = {
          ...returnData,
          [returnData?.key || 'file']: { name: filename },
        };
        socket.send(JSON.stringify(payload));
      }
    } catch (err) {
      console.error('Image picking error:', err);
      setIsError("Something went wrong. Please try agian.");
    }
    finally {
      setIsLoading(false);
    }
  };


  const pickPDF = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: 'application/pdf',
        copyToCacheDirectory: true,
      });

      const data = result["assets"][0]
      if (data.uri && data.name) {
        const file = {
          uri: data.uri,
          filename: data.name || `doc-${Date.now()}.pdf`,
          type: 'application/pdf',
        };

        setFileData(file);
        setIsLoading(true);

        const payload = {
          ...returnData,
          [returnData?.key || 'file']: { name: file.filename },
        };
        socket.send(JSON.stringify(payload));
        console.log("sent :", JSON.stringify(payload))
      }
    } catch (err) {
      setIsError("Something went wrong. Please try agian.");
      console.warn('Error picking PDF:', err);

    }
    finally {
      setIsLoading(false);
    }
  };

  if (isError) {
    return <ModelMessage message={isError} setIsError={setIsError} />
  }


  return (
    <Modal transparent>
      <View style={[globalStyle.flexContainer, globalStyle.bgLayer]}>
        <View style={globalStyle.modelBody}>
          {isLoading ? (
            <Loading />
          ) : (
            <>
              <Text style={[globalStyle.headingSmall, globalFonts.poppins_500, { marginBottom: 10 }]}>
                Upload Image or PDF
              </Text>

              <TouchableOpacity
                onPress={pickImage}
                style={[
                  globalStyle.commonBtn,
                  {
                    backgroundColor: themeColors.secondaryVibrantPink,
                    marginVertical: 10,
                    width: '100%',
                  },
                ]}
              >
                <Text style={[globalStyle.btnTextCommon, globalFonts.poppins_700, { color: themeColors.white }]}>
                  Pick Image
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={pickPDF}
                style={[
                  globalStyle.commonBtn,
                  {
                    backgroundColor: themeColors.secondaryVibrantPink,
                    width: '100%',
                  },
                ]}
              >
                <Text style={[globalStyle.btnTextCommon, globalFonts.poppins_700, { color: themeColors.white }]}>
                  Pick PDF
                </Text>
              </TouchableOpacity>
            </>
          )}
        </View>
      </View>
    </Modal>
  );
};

export default FileUpload;
