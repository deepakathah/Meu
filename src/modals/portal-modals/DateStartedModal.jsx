import globalFonts from "@/theme/fontFamily";
import globalStyle from "@/theme/globalStyle";
import styles from "@/theme/portal-modals/requestPortal.styles";
import themeColors from "@/theme/themeColors";
import React from "react";
import { Modal, Text, TouchableOpacity, View } from "react-native";
import { verticalScale } from "react-native-size-matters";

export default function DateStartedModal({ isEndDate, timer, endDateFn }) {
    return (
        <Modal visible={!!isEndDate} transparent animationType="fade">
            <View style={styles.overlay}>
                <View style={[styles.card, { alignItems: "center" }]}>
                    <Text
                        style={[
                            globalStyle.headingSmall,
                            globalFonts.poppins_600,
                            { textAlign: "center", marginBottom: verticalScale(10) },
                        ]}
                    >
                        Date Started
                    </Text>

                    <Text
                        style={[
                            globalStyle.largeText,
                            globalFonts.poppins_700,
                            { fontSize: 30, color: themeColors.darkCharcoal },
                        ]}
                    >
                        {`${String(Math.floor(timer / 60)).padStart(2, "0")}:${String(
                            timer % 60
                        ).padStart(2, "0")}`}
                    </Text>

                    <Text
                        style={[
                            globalStyle.smallText,
                            globalFonts.poppins_500,
                            {
                                textAlign: "center",
                                marginTop: verticalScale(5),
                                color: themeColors.darkGray,
                            },
                        ]}
                    >
                        Safety Tip: Let a friend know your plans
                    </Text>

                    <View
                        style={{
                            marginTop: verticalScale(20),
                            width: "100%",
                            alignItems: "center",
                        }}
                    >
                        {["I'm going home alone", "He / She dropping me", "End the Date"].map(
                            (label, idx) => (
                                <TouchableOpacity
                                    key={idx}
                                    style={[
                                        styles.optionButton,
                                        {
                                            backgroundColor:
                                                idx === 2 ? themeColors.secondaryVibrantPink : "#fff",
                                        },
                                    ]}
                                    onPress={() => endDateFn(label)}
                                >
                                    <Text
                                        style={[
                                            globalStyle.commonText,
                                            globalFonts.poppins_600,
                                            {
                                                color:
                                                    idx === 2 ? themeColors.white : themeColors.darkCharcoal,
                                            },
                                        ]}
                                    >
                                        {label}
                                    </Text>
                                </TouchableOpacity>
                            )
                        )}
                    </View>
                </View>
            </View>
        </Modal>
    );
}
