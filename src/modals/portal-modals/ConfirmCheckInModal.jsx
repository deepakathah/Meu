import imagePath from "@/constant/imagePath";
import globalFonts from "@/theme/fontFamily";
import globalStyle from "@/theme/globalStyle";
import styles from "@/theme/portal-modals/requestPortal.styles";
import themeColors from "@/theme/themeColors";
import React from "react";
import { Image, Modal, Text, TouchableOpacity, View } from "react-native";
import { scale, verticalScale } from "react-native-size-matters";

export default function ConfirmCheckInModal({
    confirmCheckIn,
    setConfirmCheckIn,
    socketData,
    handleConfirmCheckIn,
}) {
    return (
        <Modal visible={!!confirmCheckIn} transparent animationType="fade">
            <View style={[styles.overlay, globalStyle.bgLayer]}>
                <View style={[styles.card, { alignItems: "center" }]}>
                    <TouchableOpacity
                        style={styles.closeBtn}
                        onPress={() => setConfirmCheckIn(false)}
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
                        {socketData?.header}
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
                        {socketData?.content}
                    </Text>

                    <View style={styles.btnGrid}>
                        <TouchableOpacity
                            style={[
                                globalStyle.commonBtn,
                                {
                                    paddingHorizontal: scale(30),
                                    backgroundColor: themeColors.darkCharcoal,
                                },
                            ]}
                            onPress={() => handleConfirmCheckIn("yes")}
                        >
                            <Text
                                style={[
                                    globalStyle.commonText,
                                    globalFonts.poppins_600,
                                    { color: themeColors.white },
                                ]}
                            >
                                Yes
                            </Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={[
                                globalStyle.commonBtn,
                                {
                                    paddingHorizontal: scale(30),
                                    backgroundColor: themeColors.secondaryVibrantPink,
                                },
                            ]}
                            onPress={() => handleConfirmCheckIn("no")}
                        >
                            <Text
                                style={[
                                    globalStyle.commonText,
                                    globalFonts.poppins_600,
                                    { color: themeColors.white },
                                ]}
                            >
                                No
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </Modal>
    );
}
