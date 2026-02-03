import Camera from '@/components/atoms/Camera';
import { useEffect, useState } from 'react';

const FileUpload = ({ setIsSelfieImage, sendMessage, socket, returnData, s3UploadData, color, setModals }) => {
  const [fileData, setFileData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSelfie, setIsSelfie] = useState(false)

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
        setIsSelfieImage(false);
      } else {
        socket.send(JSON.stringify(payload));
        console.error('Upload failed with status:', uploadRes.status);
      }
    } catch (err) {
      console.error('Upload error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const pickSelfie = async (url) => {
    try {
      if (url) {
        const filename = `img-${Date.now()}.jpg`;
        const file = {
          uri: url,
          filename,
          type: 'image/jpeg',
        };

        setFileData(file);
        setIsLoading(true);

        const payload = {
          ...returnData,
          [returnData?.key || 'file']: { name: filename },
        };
        socket.send(JSON.stringify(payload));
        console.log('Sending:', payload);
      }
    } catch (err) {
      console.error('Image picking error:', err);
    }
  };


  return <Camera setModals={setModals} color={color} setIsSelfie={setIsSelfie} pickSelfie={pickSelfie} />
};

export default FileUpload;
