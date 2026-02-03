import CheckInCard from "@/components/molecules/CheckInCard";
import { useLocalSearchParams } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import { Dimensions, TouchableOpacity, View } from "react-native";
import { verticalScale } from "react-native-size-matters";

const { width, height } = Dimensions.get("window");

export const useHotspotParams = () => {
  const { checkInType } = useLocalSearchParams();
  const [isCheckIn, setIsCheckIn] = useState(false);

  useEffect(() => {
    if (checkInType === "checkIn") {
      setIsCheckIn(true);
    } 
  }, [checkInType]);

  const renderCheckInSelector = useCallback((handleCheckInType) => {
    if (!isCheckIn) return null;

    return (
      <View style={{
        position: "absolute",
        width,
        height,
        justifyContent: "center",
        alignItems: "center",
        rowGap: verticalScale(10),
        backgroundColor: "#00000075",
      }}>
        <TouchableOpacity onPress={() => handleCheckInType("hotspot")}>
          <CheckInCard heading="Hotspot Check In" text="If you are on the location..." imageName="hostspotCheckIn" bgColor="primaryRichPurple" />
        </TouchableOpacity>

        <TouchableOpacity onPress={() => handleCheckInType("schedule")}>
          <CheckInCard heading="Find & Confirm Schedule" text="Schedule your Date..." imageName="findCheckIn" bgColor="warmYellow" />
        </TouchableOpacity>
      </View>
    );
  }, [isCheckIn]);

  return { isCheckIn, setIsCheckIn, renderCheckInSelector };
};
