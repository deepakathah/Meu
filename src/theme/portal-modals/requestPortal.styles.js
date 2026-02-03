import themeColors from "@/theme/themeColors";
import { Dimensions, StyleSheet } from "react-native";
import { scale, verticalScale } from "react-native-size-matters";

const { width } = Dimensions.get("window");

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: themeColors.white,
  },

  card: {
    position: "relative",
    backgroundColor: themeColors.lightPink,
    padding: scale(15),
    borderRadius: scale(10),
    width: width * 0.9,
    shadowColor: "#000000bb",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 1,
    elevation: 5,
  },

  closeBtn: {
    position: "absolute",
    top: scale(5),
    right: scale(5),
    width: scale(20),
    height: scale(20),
    borderRadius: scale(20),
    backgroundColor: themeColors.darkCharcoal,
    justifyContent: "center",
    alignItems: "center",
  },

  closeIcon: {
    width: scale(15),
    height: scale(15),
    resizeMode: "contain",
  },

  profileBx: {
    justifyContent: "flex-start",
    gap: scale(15),
    marginBottom: verticalScale(10),
    paddingBottom: verticalScale(10),
    borderBottomWidth: 1,
    borderBottomColor: themeColors.lightGray,
  },

  profileBox: {
    width: scale(80),
    height: scale(80),
    borderRadius: scale(40),
    backgroundColor: themeColors.warmYellow,
    justifyContent: "center",
    alignItems: "center",
  },

  requestMessage: {
    marginBottom: verticalScale(20),
  },

  btnContainer: {
    flexDirection: "row",
    justifyContent: "flex-start",
    gap: scale(15),
  },

  scannerContainer: {
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
  },

  scannerBox: {
    marginTop: verticalScale(10),
    alignSelf: "center",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    width: scale(90),
    height: scale(90),
    borderRadius: scale(20),
    borderColor: themeColors.darkCharcoal,
    borderWidth: 2,
    marginBottom: 15,
  },

  QrContainer: {
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: verticalScale(10),
  },

  venueTimeBx: {
    width: "30%",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: verticalScale(10),
  },

  iconBx: {
    alignSelf: "center",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    width: scale(60),
    height: scale(60),
    borderRadius: scale(15),
    borderColor: themeColors.lightGray,
    borderWidth: 2,
    marginBottom: verticalScale(5),
  },

  listItem: {
    backgroundColor: "#f1ace5ff",
    color: themeColors.white,
    alignSelf: "flex-start",
    paddingHorizontal: scale(10),
    paddingVertical: verticalScale(2),
    borderRadius: 30,
    marginBottom: verticalScale(5),
  },

  optionButton: {
    width: "90%",
    paddingVertical: verticalScale(10),
    borderRadius: scale(25),
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: themeColors.lightGray,
    marginBottom: verticalScale(10),
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 1,
    elevation: 2,
  },

  btnGrid: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: scale(15),
  },

  feedbackCard: {
    width: "90%",
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 20,
    alignItems: "center",
  },

  emojiContainer: {
    width: "100%",
  },

  emojiBx: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: scale(5),
  },

  emoji: {
    width: scale(30),
    height: scale(30),
    alignSelf: "center",
  },

  ratingContainer: {
    width: "100%",
  },

  sliderRow: {
    flexDirection: "row",
    marginVertical: 5,
  },

  flagGrid: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: scale(5),
  },

  itemGrid: {
    flexDirection: "column",
    gap: scale(2),
  },

  flagItemImage: {
    width: scale(20),
    height: scale(20),
  },

  dot: {
    width: 14,
    height: 14,
    borderRadius: 7,
    marginHorizontal: 6,
  },

  feedbackRow: {
    width: "100%",
    marginBottom: verticalScale(2),
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: scale(5),
  },

  input: {
    width: "100%",
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: scale(10),
    paddingHorizontal: scale(10),
    paddingVertical: scale(10),
    marginTop: scale(5),
    minHeight: verticalScale(60),
  },

  profileImage: {
    width: "100%",
    height: "100%",
    borderRadius: scale(40),
  },
});

export default styles;
