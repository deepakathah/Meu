
import ProfilePercentage from "@/components/atoms/ProfilePercentage";
import imagePath from '@/constant/imagePath';
import globalFonts from "@/theme/fontFamily";
import globalStyle from "@/theme/globalStyle";
import themeColors from '@/theme/themeColors';
import { useRef, useState } from 'react';
import { Animated, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { scale, verticalScale } from 'react-native-size-matters';

const SinglePerson = ({ user, onPress }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const animatedHeight = useRef(new Animated.Value(0)).current;

  const toggleExpand = () => {
    if (isExpanded) {
      Animated.timing(animatedHeight, {
        toValue: 0,
        duration: 300,
        useNativeDriver: false,
      }).start(() => setIsExpanded(false));
    } else {
      setIsExpanded(true);
      Animated.timing(animatedHeight, {
        toValue: 280,
        duration: 300,
        useNativeDriver: false,
      }).start();
    }
  };


  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.8}>
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <View style={styles.info}>
            <ProfilePercentage
              percentage={user?.matchPercentage}
              imageSource={`${user?.baseUrl}${user?.selfie}`}
            />
            <View>
              <Text style={[globalStyle.commonHeading, globalFonts.poppins_700, { color: themeColors.darkCharcoal, lineHeight: 17 }]}>
                {user?.name}
              </Text>
              <Text style={[globalStyle.commonText, globalFonts.poppins_500, { color: themeColors.darkCharcoal, opacity: 0.6 }]}>
                {user?.profession}
              </Text>
            </View>
          </View>

          <TouchableOpacity onPress={toggleExpand} activeOpacity={1}>
            <Image
              source={imagePath.downArrow}
              resizeMode='contain'
              style={[
                styles.downArrow,
                isExpanded && { transform: [{ rotate: "180deg" }] },
              ]}
            />
          </TouchableOpacity>
        </View>

        <Animated.View style={[styles.animatedContainer, { height: animatedHeight }]}>
          <View style={styles.cardContent}>
            <Text style={[globalStyle.commonText, globalFonts.poppins_500]}>
              {user?.bio}
            </Text>

            <Text style={[
              globalStyle.commonText,
              globalFonts.poppins_500,
              {
                color: themeColors.darkCharcoal,
                opacity: 0.6,
                marginTop: verticalScale(10),
                marginBottom: verticalScale(5),
              },
            ]}>
              Match Details
            </Text>

            <View style={[globalStyle.grid, { justifyContent: "flex-start", gap: 10 }]}>
              {(user?.matchDetails ? Object.entries(user.matchDetails) : []).map(([label, value]) => (
                <View key={label} style={styles.progressRow}>
                  <Text style={[
                    globalStyle.smallText,
                    globalFonts.poppins_500,
                    styles.categoryText,
                  ]}>
                    {label}
                  </Text>

                  <View style={styles.progressBarBackground}>
                    <View style={[styles.progressBarFill, {
                      width: `${value}%`,
                      backgroundColor:
                        label === "Personality" ? themeColors.primaryRichPurple :
                          label === "Hobbies & Passion" ? themeColors.secondaryVibrantPink :
                            label === "Work & Career" ? themeColors.warmYellow :
                              label === "Love & Relationship" ? themeColors.warmYellowDark : themeColors.darkCharcoal,
                    }]} />
                  </View>
                </View>
              ))}
            </View>
          </View>
        </Animated.View>
      </View>
    </TouchableOpacity>
  );
};

export default SinglePerson;

const styles = StyleSheet.create({
  card: {
    backgroundColor: themeColors.white,
    borderRadius: 10,
    marginBottom: 20,
    padding: scale(10),
    shadowColor: themeColors.black,
    shadowOffset: { width: 2, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  info: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
    gap: scale(10),
  },
  downArrow: {
    width: scale(25),
    height: scale(25),
  },
  animatedContainer: {
    overflow: "hidden",
  },
  cardContent: {
    borderTopColor: "#2b2d4221",
    borderTopWidth: 1,
    paddingTop: verticalScale(10),
    marginTop: verticalScale(10),
  },
  progressRow: {
    width: "30%",
  },
  categoryText: {
    color: themeColors.darkCharcoal,
  },
  progressBarBackground: {
    height: verticalScale(10),
    borderRadius: 3,
    backgroundColor: "#eee",
    overflow: "hidden",
  },
  progressBarFill: {
    height: "100%",
    borderRadius: 3,
  },
});