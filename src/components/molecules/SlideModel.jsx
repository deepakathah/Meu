
import getApiUrl from "@/constant/apiUrl";
import imagePath from "@/constant/imagePath";
import useTimeZone from "@/constant/timeZone";
import globalFonts from "@/theme/fontFamily";
import globalStyle from "@/theme/globalStyle";
import themeColors from "@/theme/themeColors";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import React, { useEffect, useRef, useState } from "react";
import {
  Animated,
  Dimensions,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { moderateScale, scale } from "react-native-size-matters";

const { width: screenWidth } = Dimensions.get("window");

const SlideModel = ({
  type,
  visible = true,
  onHide,
  token,
  checkInType,
  handleMarkerPress,
  places = [],
}) => {
  const { userTimeZone } = useTimeZone();
  const slideAnim = useRef(new Animated.Value(-500)).current;

  const [checkInDetails, setCheckInDetails] = useState(null);
  const [place, setPlace] = useState(null);

  /* Slide-in animation */
  useEffect(() => {
    if (visible) {
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 500,
        useNativeDriver: true,
      }).start();
    }
  }, [visible, slideAnim]);

  /* Fetch check-in details */
  useEffect(() => {
    if (!token) return;
    const getCheckInDetails = async () => {
      try {
        const apiURL = getApiUrl();
        const response = await fetch(`${apiURL}/getUserCheckInDetails`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ timeZone: userTimeZone }),
        });

        const obj = await response.json();
        if (!obj?.status) return;

        const { hotspotCheckIn, scheduleCheckIn } = obj.checkInData || {};
        const selectedCheckIn =
          checkInType === "hotspot" ? hotspotCheckIn : scheduleCheckIn;

        if (!selectedCheckIn) return;

        setCheckInDetails(selectedCheckIn);

        const placeDetails = places.find(
          (p) => p.placeId === selectedCheckIn.areaId
        );
        if (placeDetails) {
          setPlace(placeDetails);
        }
      } catch (err) {
        console.log("Check-in error:", err);
      }
    };

    getCheckInDetails();
  }, [token, userTimeZone, checkInType, places]);

  /* Hide animation */
  const hideAnimation = () => {
    Animated.timing(slideAnim, {
      toValue: -500,
      duration: 400,
      useNativeDriver: true,
    }).start(() => onHide?.());
  };

  return (
    <Animated.View
      style={[
        styles.container,
        { transform: [{ translateX: slideAnim }] },
      ]}
    >
      <LinearGradient
        style={styles.GradientBox}
        colors={[
          themeColors.primaryRichPurple,
          themeColors.secondaryVibrantPink,
        ]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
      >
        <View style={styles.row}>
          {checkInDetails ? (
            <TouchableOpacity
              activeOpacity={0.9}
              onPress={() => handleMarkerPress(place)}
              style={styles.textRow}
            >
              <Text
                style={[
                  globalStyle.commonText,
                  globalFonts.poppins_500,
                  { color: themeColors.white },
                ]}
                numberOfLines={2}
              >
                You have checked in {checkInDetails.area} •{" "}
                {checkInDetails.shop} — Tap to View
              </Text>
            </TouchableOpacity>
          ) : (
            <View style={styles.textRow}>
              <Text
                style={[
                  globalStyle.commonText,
                  globalFonts.poppins_500,
                  { color: themeColors.white },
                ]}
              >
                Tap the
              </Text>
              <Image
                source={imagePath.marker}
                style={styles.marker}
                resizeMode="contain"
              />
              <Text
                style={[
                  globalStyle.commonText,
                  globalFonts.poppins_500,
                  { color: themeColors.white },
                ]}
              >
                to {type}
              </Text>
            </View>
          )}

          <TouchableOpacity activeOpacity={0.7} onPress={hideAnimation}>
            <Ionicons name="close" size={22} color="#fff" />
          </TouchableOpacity>
        </View>
      </LinearGradient>
    </Animated.View>
  );
};

export default SlideModel;

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    top: 0,
    left: 0,
    width: screenWidth * 0.8,
    borderBottomEndRadius: moderateScale(8),
    borderTopEndRadius: moderateScale(8),
    zIndex: 1000,
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    overflow: "hidden",
  },

  GradientBox: {
    paddingVertical: moderateScale(10),
    paddingHorizontal: moderateScale(15),
  },

  row: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
  },

  textRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: scale(8),
    width: "85%",
  },

  marker: {
    width: scale(30),
    height: scale(30),
  },
});

