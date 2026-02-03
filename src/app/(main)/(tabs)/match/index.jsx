

import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import React, { memo, useCallback } from "react";
import { Dimensions, Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { moderateScale, scale, verticalScale } from "react-native-size-matters";

import imagePath from "@/constant/imagePath";
import globalFonts from "@/theme/fontFamily";
import globalStyle from "@/theme/globalStyle";
import themeColors from "@/theme/themeColors";

const { width } = Dimensions.get("window");

const Match = () => {
  const router = useRouter();

  // ✅ Use useCallback to avoid unnecessary re-renders & event leaks
  const goToAutoMatch = useCallback(() => {
    router.push("/match/automatch");
  }, [router]);

  const goToCheckIn = useCallback(() => {
    router.push({
      pathname: "/hotspots",
      params: { checkInType: "checkIn" },
    });
  }, [router]);

  const goToHotspots = useCallback(() => {
    router.push({
      pathname: "/hotspots",
      params: { checkInType: "hotspots" },
    });
  }, [router]);

  const goToWheel = useCallback(() => {
    router.push("/wheel");
  }, [router]);

  return (
    <View style={styles.container}>
      <View style={styles.textContainer}>
        <Text style={[globalStyle.headingTitle, globalFonts.poppins_600]}>
          Find Your Match
        </Text>
        <Text style={[globalStyle.headingSmall, globalFonts.poppins_500]}>
          Based on your mood and vibe of the day
        </Text>
      </View>

      {/* First Row */}
      <View style={globalStyle.grid}>
        <GradientCard
          title="Auto Match"
          description="Best matches suggested by MeU's algorithm"
          onPress={goToAutoMatch}
          colors={[themeColors.secondaryVibrantPink, themeColors.primaryRichPurple]}
          image={imagePath.matchCard}
        />
        <GradientCard
          title="Check In"
          description="You can check in now, and schedule for later also"
          onPress={goToCheckIn}
          colors={[themeColors.secondaryVibrantPink, themeColors.darkCharcoal]}
          image={imagePath.checkinCard}
        />
      </View>

      {/* Second Row */}
      <View style={globalStyle.grid}>
        <GradientCard
          title="Go to Hotspots"
          description="Discover popular places and meet new people"
          onPress={goToHotspots}
          colors={[themeColors.secondaryVibrantPink, themeColors.warmYellow]}
          image={imagePath.goHotspots}
        />
        {/* Disabled spin option */}
        <GradientCard
          title="Spin the Wheel"
          description="Feeling lucky? Find a random match and meet new people"
          onPress={goToWheel}
          colors={[themeColors.secondaryVibrantPink, themeColors.warmYellowDark]}
          image={imagePath.spinMatch}
        />
      </View>
    </View>
  );
};

// ✅ Memoized reusable card component
const GradientCard = memo(({ title, description, onPress, colors, image, disabled }) => (
  <TouchableOpacity
    style={{ width: "49%", opacity: disabled ? 0.5 : 1 }}
    activeOpacity={0.8}
    onPress={!disabled ? onPress : undefined}
  >
    <LinearGradient
      style={[styles.GradientBox]}
      colors={colors}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 0 }}
    >
      <Text style={[globalStyle.headingSmall, globalFonts.poppins_600, { color: themeColors.white }]}>
        {title}
      </Text>
      <View style={[globalStyle.grid, { alignItems: "center" }]}>
        <View style={[styles.box, { width: "55%" }]}>
          <Text
            style={[globalStyle.commonText, globalFonts.poppins_500, { color: themeColors.white }]}
            numberOfLines={3}
          >
            {description}
          </Text>
        </View>
        <Image
          source={image}
          resizeMode="contain"
          style={styles.gridImg}
        />
      </View>
    </LinearGradient>
  </TouchableOpacity>
));

export default memo(Match);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    backgroundColor: themeColors.lightGray,
    padding: moderateScale(10),
  },
  textContainer: {
    paddingRight: scale(40),
    paddingLeft: scale(10),
    marginBottom: verticalScale(10),
  },
  GradientBox: {
    borderRadius: moderateScale(15),
    paddingHorizontal: moderateScale(20),
    paddingVertical: moderateScale(30),
    marginBottom: verticalScale(10),
  },
  box: {
    width: "60%",
  },
  gridImg: {
    width: moderateScale(50),
    height: moderateScale(50),
  },
});

