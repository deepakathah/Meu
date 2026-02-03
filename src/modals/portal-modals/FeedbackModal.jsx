import imagePath from "@/constant/imagePath";
import globalFonts from "@/theme/fontFamily";
import globalStyle from "@/theme/globalStyle";
import styles from "@/theme/portal-modals/requestPortal.styles";
import themeColors from "@/theme/themeColors";
import Slider from "@react-native-community/slider";
import React from "react";
import { Image, Modal, Text, TextInput, TouchableOpacity, View } from "react-native";
import { feedbackPoints, ratingEmojis } from "../constants/feedbackConstants";

export default function FeedbackModal({
    feedbackModal,
    feedbacks,
    setFeedbacks,
    handleFeedback,
}) {
    return (
        <Modal transparent visible={!!feedbackModal}>
            <View style={[styles.overlay, globalStyle.bgLayer]}>
                <View style={styles.feedbackCard}>
                    <Text
                        style={[
                            globalStyle.headingMedium,
                            globalFonts.poppins_700,
                            { color: themeColors.warmYellow },
                        ]}
                    >
                        Feedback
                    </Text>

                    <Text
                        style={[
                            globalStyle.commonText,
                            globalFonts.poppins_500,
                            {
                                textAlign: "center",
                                paddingHorizontal: 30,
                                marginTop: -5,
                            },
                        ]}
                    >
                        Provide your valuable feedback, and tell us How it went ?
                    </Text>

                    <View style={[styles.emojiContainer, globalStyle.MarginTop15]}>
                        <Text style={[globalStyle.normalFontSize, globalFonts.poppins_600]}>
                            Select your rating
                        </Text>

                        <View style={styles.emojiBx}>
                            {Object.entries(ratingEmojis).map(([key, item]) => {
                                const isActive = feedbacks.emoji === item.label;

                                return (
                                    <TouchableOpacity
                                        key={key}
                                        onPress={() =>
                                            setFeedbacks((prev) => ({ ...prev, emoji: item.label }))
                                        }
                                        activeOpacity={0.9}
                                        style={styles.emojiItem}
                                    >
                                        <Image
                                            source={imagePath[isActive ? item.active : item.inactive]}
                                            style={styles.emoji}
                                        />
                                        <Text
                                            style={[
                                                globalStyle.commonText,
                                                globalFonts.poppins_500,
                                                {
                                                    color: isActive ? themeColors.warmYellow : "#858585",
                                                },
                                            ]}
                                        >
                                            {item.label}
                                        </Text>
                                    </TouchableOpacity>
                                );
                            })}
                        </View>
                    </View>

                    <View style={[styles.ratingContainer, globalStyle.MarginTop15]}>
                        <Text style={[globalStyle.normalFontSize, globalFonts.poppins_600]}>
                            Select your experience
                        </Text>

                        {feedbackPoints.map((item) => (
                            <View key={item} style={styles.feedbackRow}>
                                <Text style={[globalStyle.commonText, globalFonts.poppins_500]}>
                                    {item.replace(/([A-Z])/g, " $1")}
                                </Text>

                                <View style={styles.sliderRow}>
                                    {[1, 2, 3, 4, 5].map((val) => (
                                        <TouchableOpacity
                                            key={val}
                                            activeOpacity={0.9}
                                            onPress={() =>
                                                setFeedbacks((prev) => ({
                                                    ...prev,
                                                    categories: {
                                                        ...prev.categories,
                                                        [item]: val,
                                                    },
                                                }))
                                            }
                                            style={[
                                                styles.dot,
                                                {
                                                    backgroundColor:
                                                        val <= feedbacks.categories[item]
                                                            ? themeColors.warmYellow
                                                            : "#ddd",
                                                },
                                            ]}
                                        />
                                    ))}
                                </View>
                            </View>
                        ))}
                    </View>

                    <View style={[styles.ratingContainer, globalStyle.MarginTop15]}>
                        <Text style={[globalStyle.normalFontSize, globalFonts.poppins_600]}>
                            Select your flag
                        </Text>

                        <View style={[styles.flagGrid, globalStyle.MarginTop10]}>
                            <View style={[styles.itemGrid]}>
                                <Image style={styles.flagItemImage} source={imagePath.redflag} />
                                <Image style={styles.flagItemImage} source={imagePath.redflag} />
                            </View>

                            <View style={[styles.itemGrid]}>
                                <Image style={styles.flagItemImage} source={imagePath.redflag} />
                            </View>

                            <View style={[styles.itemGrid]}>
                                <Image style={styles.flagItemImage} source={imagePath.grayflag} />
                            </View>

                            <View style={[styles.itemGrid]}>
                                <Image style={styles.flagItemImage} source={imagePath.greenflag} />
                            </View>

                            <View style={[styles.itemGrid]}>
                                <Image style={styles.flagItemImage} source={imagePath.greenflag} />
                                <Image style={styles.flagItemImage} source={imagePath.greenflag} />
                            </View>

                            <View style={[styles.itemGrid]}>
                                <Image style={styles.flagItemImage} source={imagePath.treeflag} />
                            </View>
                        </View>

                        <View style={styles.flagGrid}>
                            <Slider
                                style={{
                                    width: "100%",
                                    borderRadius: 10,
                                    height: 4,
                                    backgroundColor: themeColors.warmYellow,
                                    marginTop: 20,
                                }}
                                minimumValue={1}
                                maximumValue={6}
                                step={1}
                                value={feedbacks.flag}
                                onValueChange={(val) =>
                                    setFeedbacks((prev) => ({ ...prev, flag: val }))
                                }
                                minimumTrackTintColor={themeColors.warmYellow}
                                maximumTrackTintColor="#E6D8B8"
                                thumbImage={imagePath.sliderThump}
                            />
                        </View>
                    </View>

                    <View style={[styles.ratingContainer, globalStyle.MarginTop15]}>
                        <Text style={[globalStyle.normalFontSize, globalFonts.poppins_600]}>
                            Type your experience
                        </Text>

                        <TextInput
                            placeholder="Tell us what went well?"
                            value={feedbacks.query}
                            onChangeText={(text) =>
                                setFeedbacks((prev) => ({ ...prev, query: text }))
                            }
                            multiline
                            numberOfLines={4}
                            textAlignVertical="top"
                            style={styles.input}
                        />
                    </View>

                    <TouchableOpacity
                        style={[globalStyle.button, globalStyle.MarginTop20]}
                        onPress={handleFeedback}
                    >
                        <Text style={[globalFonts.poppins_600, globalStyle.buttonText]}>
                            Submit
                        </Text>
                    </TouchableOpacity>
                </View>
            </View>
        </Modal>
    );
}
