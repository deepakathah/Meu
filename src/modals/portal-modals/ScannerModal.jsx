import ScanQr from "@/components/molecules/ScanQr";
import styles from "@/theme/portal-modals/requestPortal.styles";
import React from "react";
import { Modal, View } from "react-native";

export default function ScannerModal({
  isOpenCamera,
  setIsOpenCamera,
  sendMessageToSocket,
  socketData,
}) {
  return (
    <Modal visible={!!isOpenCamera} transparent animationType="fade">
      <View style={styles.overlay}>
        <ScanQr
          setIsOpenCamera={setIsOpenCamera}
          sendMessageToSocket={sendMessageToSocket}
          socketData={socketData}
        />
      </View>
    </Modal>
  );
}
