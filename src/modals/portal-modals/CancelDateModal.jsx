import imagePath from "@/constant/imagePath";
import globalFonts from "@/theme/fontFamily";
import globalStyle from "@/theme/globalStyle";
import styles from "@/theme/portal-modals/requestPortal.styles";
import themeColors from "@/theme/themeColors";
import React from "react";
import { Image, Modal, Text, TouchableOpacity, View } from "react-native";

export default function CancelDateModal({
    socketData,
    cancelDate,
    hidePortal,
    handleCancelRequest,
}) {
    return (
        socketData.status === "receiver" && (
            <Modal visible={!!cancelDate} transparent animationType="fade">
                <View style={[styles.overlay, globalStyle.bgLayer]}>
                    <View style={styles.card}>
                        <TouchableOpacity style={styles.closeBtn} onPress={hidePortal}>
                            <Image source={imagePath.close} style={styles.closeIcon} />
                        </TouchableOpacity>

                        <Text style={[globalStyle.headingSmall, globalFonts.poppins_600]}>
                            Cancel Date Request
                        </Text>

                        <Text style={[styles.requestMessage, globalFonts.poppins_500]}>
                            {socketData?.message ||
                                "Lorem Ipsum is simply dummy text of the printing and typesetting industry."}
                        </Text>

                        <View style={styles.btnContainer}>
                            <TouchableOpacity
                                onPress={() => handleCancelRequest("reject")}
                                style={[
                                    globalStyle.commonBtn,
                                    {
                                        backgroundColor: themeColors.darkCharcoal,
                                        width: "48%",
                                    },
                                ]}
                            >
                                <Text
                                    style={[
                                        globalStyle.btnTextCommon,
                                        globalFonts.poppins_700,
                                        { color: themeColors.white },
                                    ]}
                                >
                                    Reject
                                </Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                                onPress={() => handleCancelRequest("confirm")}
                                style={[
                                    globalStyle.commonBtn,
                                    {
                                        backgroundColor: themeColors.secondaryVibrantPink,
                                        width: "48%",
                                    },
                                ]}
                            >
                                <Text
                                    style={[
                                        globalStyle.btnTextCommon,
                                        globalFonts.poppins_700,
                                        { color: themeColors.white },
                                    ]}
                                >
                                    Confirm
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>
        )
    );
}
