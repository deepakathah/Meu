import globalFonts from "@/theme/fontFamily";
import globalStyle from "@/theme/globalStyle";
import themeColors from "@/theme/themeColors";
import { FontAwesome } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { scale, verticalScale } from "react-native-size-matters";

const CategoryCard = ({ data, isOpen, onPress }) => {
  if (!data) return null;

  const { category, essay, keypoints = [], questions = [] } = data;

  return (
    <View style={styles.card}>
      {/* Header (Always Visible) */}
      <TouchableOpacity
        style={styles.header}
        onPress={onPress}
        activeOpacity={0.8}
      > 
        
        <Text style={[globalStyle.commonText, globalFonts.poppins_700]}>
          {category}
        </Text>
        <FontAwesome
          name={isOpen ? "angle-up" : "angle-down"}
          size={22}
          color="#555"
        />
      </TouchableOpacity>

      {/* Expanded Content */}
      {isOpen && (
        <>
          <Text style={[globalStyle.smallText, globalFonts.poppins_500, globalStyle.MarginTop10]}>
            {essay}
          </Text>

          {/* Tags */}
          <View style={[styles.tagsContainer, globalStyle.MarginTop10]}>
            {keypoints.map((item, index) => (
              <View key={index} style={styles.tag}>
                <Text style={[styles.tagText, globalFonts.poppins_500, globalStyle.smallText]}>
                  {item}
                </Text>
              </View>
            ))}
          </View>

          {/* Q&A */}
          {questions.length > 0 && (
            <View style={styles.qaBox}>
              <Text style={[styles.qaHeading, globalFonts.poppins_600, globalStyle.commonText]}>
                Questions & Answers:
              </Text>

              {questions.map((qa, index) => (
                <View key={index} style={styles.qaItem}>
                  <Text style={[styles.question, globalFonts.poppins_600, globalStyle.smallText]}>
                    Q: {qa.question}
                  </Text>
                  <Text style={[styles.answer, globalFonts.poppins_500, globalStyle.smallText]}>
                    A: {qa.answer}
                  </Text>
                </View>
              ))}
            </View>
          )}
        </>
      )}
    </View>
  );
};

export default CategoryCard;

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#f6f6f6",
    borderRadius: scale(16),
    padding: scale(16),
    marginBottom: verticalScale(16),
  },

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  title: {
    fontSize: scale(18),
    color: themeColors.primaryRichPurple,
  },

  description: {
    fontSize: scale(13),
    color: "#555",
    lineHeight: 18,
    marginVertical: verticalScale(12),
  },

  tagsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: scale(8),
    marginBottom: verticalScale(14),
  },

  tag: {
    backgroundColor: "#E8D9FF",
    paddingHorizontal: scale(10),
    paddingVertical: scale(5),
    borderRadius: scale(20),
  },

  tagText: {
    color: themeColors.primaryRichPurple,
  },

  qaBox: {
    backgroundColor: "#FFFFFF",
    borderRadius: scale(12),
    padding: scale(12),
  },

  qaHeading: {
    marginBottom: verticalScale(8),
    color: "#333",
  },

  qaItem: {
    marginBottom: verticalScale(8),
  },

  question: {
    fontSize: scale(12),
    color: "#222",
  },

  answer: {
    fontSize: scale(12),
    color: "#666",
    marginTop: 2,
  },
});
