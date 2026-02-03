import imagePath from "@/constant/imagePath";
import globalFonts from "@/theme/fontFamily";
import globalStyle from "@/theme/globalStyle";
import styles from "@/theme/portal-modals/requestPortal.styles";
import React from "react";
import { Image, Modal, Text, TouchableOpacity, View } from "react-native";

export default function DateCanceledModal({
    canceledDate,
    setCanceledDate,
    socketData,
}) {
    return (
        <Modal visible={!!canceledDate} transparent animationType="fade">
            <View style={[styles.overlay, globalStyle.bgLayer]}>
                <View style={styles.card}>
                    <TouchableOpacity
                        style={styles.closeBtn}
                        onPress={() => setCanceledDate(false)}
                    >
                        <Image source={imagePath.close} style={styles.closeIcon} />
                    </TouchableOpacity>

                    <Text style={[globalStyle.headingSmall, globalFonts.poppins_600]}>
                        Date Canceled!
                    </Text>

                    <Text style={[styles.requestMessage, globalFonts.poppins_500]}>
                        {socketData?.message}
                    </Text>
                </View>
            </View>
        </Modal>
    );
}
