import globalStyle from "@/theme/globalStyle";
import { default as globalFonts, default as themeColors } from "@/theme/themeColors";
import { LinearGradient } from 'expo-linear-gradient';
import { Dimensions, Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { scale } from "react-native-size-matters";

const { width } = Dimensions.get("window")
export const sliderWidth = width;
export const itemWidth = Math.round(sliderWidth * 0.85);
export const itemHeight = Math.round(Dimensions.get("window").height * 0.50);

const ProfileCardItem = ({onPressFn, item, baseUrl }) => {

  return (
    <TouchableOpacity
      style={[styles.container]}
      onPress={onPressFn}
      activeOpacity={0.9}>

      <View style={styles.modalBox}>
        <View style={styles.winnerImageBx}>
          <Image source={{ uri: `${baseUrl}${item.selfie}` || "https://i.pravatar.cc/150?img=4" }} style={styles.winnerImage} />
        </View>

        <View>
          <Text style={[globalStyle.headingSmall, globalFonts.poppins_600, { textAlign: "center" }]}>{item.name}, {item.age}</Text>
          <Text style={[globalStyle.normalFontSize, globalFonts.poppins_500, { textAlign: "center" }]}>{item.characteristic}</Text>
        </View>

        <View style={[globalStyle.grid, globalStyle.MarginTop15, { gap: scale(5), rowGap: scale(5), justifyContent: "center" }]}>
          {Object.keys(item?.bookOfLife || {}).map((key, index) => (
            <TouchableOpacity style={styles.categoryBtn} key={index}>
              <Text style={[globalStyle.commonText, globalFonts.poppins_500, { color: themeColors.white }]}>
                {key}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <View style={[globalStyle.grid, globalStyle.MarginTop15, { gap: scale(5), rowGap: scale(5), justifyContent: "center" }]}>
          <TouchableOpacity>
            <LinearGradient style={styles.categoryBtn} colors={[themeColors.warmYellow, themeColors.warmYellowDark]}>
              <Text style={[globalStyle.commonText, globalFonts.poppins_700, { color: themeColors.white }]}>Adventurous 🌍</Text>
            </LinearGradient>
          </TouchableOpacity>
          <TouchableOpacity>
            <LinearGradient style={styles.categoryBtn} colors={[themeColors.warmYellow, themeColors.warmYellowDark]}>
              <Text style={[globalStyle.commonText, globalFonts.poppins_700, { color: themeColors.white }]}>Chill meet ups 🔥</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>

  );
};

export default ProfileCardItem;

const styles = StyleSheet.create({

  container: {
    padding: 25,
    borderRadius: 16,
    width: itemWidth,
    height: itemHeight,
    backgroundColor: themeColors.lightPink,
    flexDirection: "column",
    justifyContent: "space-between",
    overflow: "hidden",

    shadowColor: '#00000092',
    shadowOpacity: 0.2,
    shadowRadius: 10,
    // Android shadow
    elevation: 10,
  },

  modalBox: {
    alignItems: "center",
    width: "100%",
    elevation: 10,
  },

  winnerImageBx: {
    width: scale(124),
    height: scale(124),
    borderRadius: scale(62),
    backgroundColor: themeColors.warmYellow,
    marginBottom: 15,

  },

  winnerImage: {
    width: scale(120),
    height: scale(120),
    borderRadius: scale(60),
    alignItems: "center"

  },

  categoryBtn: {
    backgroundColor: themeColors.darkCharcoal,
    paddingHorizontal: scale(10),
    paddingVertical: scale(5),
    borderRadius: scale(5),
  },

  buttonsRow: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: "100%",
    marginTop: 10,
  },

  actionBtn: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
  },
});
