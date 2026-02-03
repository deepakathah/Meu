import globalFonts from "@/theme/fontFamily";
import globalStyle from '@/theme/globalStyle';
import themeColors from "@/theme/themeColors";
import { StyleSheet, Text, TouchableOpacity } from "react-native";

const TimeSlot = ({ slot, selectedSlot, onSelect }) => {
  const isSelected = selectedSlot === slot;

  return (
    <TouchableOpacity
      style={[styles.slot, isSelected && styles.activeSlot]}
      onPress={() => onSelect(slot)}
    >
      <Text style={[styles.slotText, globalStyle.commonText , globalFonts.poppins_500, isSelected && styles.activeText]}>
        {slot}
      </Text>
    </TouchableOpacity>
  );
};

export default TimeSlot;

const styles = StyleSheet.create({
  slot: {
    borderRadius: 25,
    borderWidth: 1,
    borderColor: "#ccc",
    paddingVertical: 10,
    paddingHorizontal: 18,
    backgroundColor: "#fff",
  },
  activeSlot: {
    backgroundColor: themeColors.secondaryVibrantPink,
    borderColor: themeColors.secondaryVibrantPink,
  },
  slotText: {
    color: "#333",
  },
  activeText: {
    color: themeColors.white,
  },
});
