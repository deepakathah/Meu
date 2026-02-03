import imagePath from "@/constant/imagePath";
import globalFonts from "@/theme/fontFamily";
import globalStyle from "@/theme/globalStyle";
import styles from "@/theme/portal-modals/requestPortal.styles";
import themeColors from "@/theme/themeColors";
import React from "react";
import { Image, Modal, Text, TouchableOpacity, View } from "react-native";
import { verticalScale } from "react-native-size-matters";

export default function CommonPopupModal({
    commonPopVisible,
    setCommonPopVisible,
    socketData,
}) {
    return (
        <Modal visible={!!commonPopVisible} transparent animationType="fade">
            <View style={[styles.overlay, globalStyle.bgLayer]}>
                <View style={[styles.card, { alignItems: "center" }]}>
                    <TouchableOpacity
                        style={styles.closeBtn}
                        onPress={() => setCommonPopVisible(false)}
                    >
                        <Image source={imagePath.close} style={styles.closeIcon} />
                    </TouchableOpacity>

                    <Text
                        style={[
                            globalStyle.headingSmall,
                            globalFonts.poppins_600,
                            { textAlign: "center" },
                        ]}
                    >
                        {socketData?.title}
                    </Text>

                    <Text
                        style={[
                            globalStyle.normalFontSize,
                            globalFonts.poppins_500,
                            {
                                textAlign: "center",
                                marginBottom: verticalScale(10),
                                color: themeColors.darkGray,
                            },
                        ]}
                    >
                        {socketData?.message}
                    </Text>
                </View>
            </View>
        </Modal>
    );
}
