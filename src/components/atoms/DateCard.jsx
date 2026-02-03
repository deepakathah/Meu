
import globalFonts from "@/theme/fontFamily";
import globalStyle from '@/theme/globalStyle';
import themeColors from "@/theme/themeColors";
import moment from "moment";
import { StyleSheet, Text, TouchableOpacity } from "react-native";

const DateCard = ({ date, onSelectDate, selected }) => {
  const day =
    moment(date).format("YYYY-MM-DD") === moment().format("YYYY-MM-DD")
      ? "Today"
      : moment(date).format("ddd");
  const dayNumber = moment(date).format("D");
  const fullDate = moment(date).format("YYYY-MM-DD");

  const isSelected = selected === fullDate;


  return (
    <TouchableOpacity
      onPress={() => onSelectDate(fullDate)}
      style={[styles.card, isSelected && styles.activeCard]}
    >
      <Text style={[styles.day, globalStyle.smallText, globalFonts.poppins_700, isSelected && styles.activeText]}>{day}</Text>
      <Text style={[globalStyle.normalFontSize, globalFonts.poppins_700, isSelected && styles.activeNumber]}>
        {dayNumber}
      </Text>
    </TouchableOpacity>
  );
};

export default DateCard;

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#F2F2F2",
    borderRadius: 12,
    paddingVertical: 10,
    paddingHorizontal: 15,
    marginHorizontal: 5,
    alignItems: "center",
    justifyContent: "center",
    width: 70,
  },

  activeCard: {
    backgroundColor: themeColors.secondaryVibrantPink,
  },

  day: {
    color: "#555",
  },

  number: {
    marginTop: 5,
    color: "#333",
  },

  activeText: {
    color: "#fff",
  },

  activeNumber: {
    color: "#fff",
  },

});
