
import imagePath from '@/constant/imagePath';
import globalFonts from "@/theme/fontFamily";
import themeColors from '@/theme/themeColors';
import {
  ActivityIndicator,
  Dimensions,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import { scale, verticalScale } from 'react-native-size-matters';

const { width } = Dimensions.get('window');

const SinglePlace = ({
  place,
  onPress,
  isLoading,
  activeHotspotShopId,
  activeScheduleShopId
}) => {

  const isActive =
    place?.restaurantId === activeHotspotShopId ||
    place?.restaurantId === activeScheduleShopId;

  const isActiveHotspot = place?.restaurantId === activeHotspotShopId

  const limitedName = place?.name?.includes('-')
    ? place.name.split('-')[0].trim()
    : place?.name?.split(',')[0];

  const limitedAddress = place?.address
    ? place.address.split(',').slice(0, 2).join(', ')
    : '';

  return (
    <TouchableOpacity onPress={onPress} disabled={!!isLoading} activeOpacity={0.85}>
      <View style={[styles.card, isActive && styles.activeCard]}>

        <View style={styles.info}>
          <Image source={imagePath.place} style={styles.cardImage} />
          <View style={styles.location}>
            <Text style={[styles.placeName, globalFonts.poppins_500]}>
              {limitedName}
            </Text>
            <Text style={[styles.placeDes, globalFonts.poppins_500]}>
              {limitedAddress}
            </Text>
          </View>
        </View>

        <View style={styles.count}>
          {isLoading ? (
            <ActivityIndicator size="small" color={themeColors.white} />
          ) : (
            <Text style={[styles.countText, globalFonts.poppins_500]}>
              {place?.userCount}
            </Text>
          )}
        </View>

        {isActive && (
          <View style={styles.activeBadge}>
            <Text style={[styles.activeBadgeText, globalFonts.poppins_500]}>
              {isActiveHotspot ? "Hotspot Checked In" : "Schedule Checked In"}
            </Text>
          </View>

          // <Text style={styles.activeBadge}>{isActiveHotspot ? "Hotspot Checked In": "Schedule Checked In"}</Text>
        )}

      </View>
    </TouchableOpacity>
  );
};

export default SinglePlace;

/* ---------------- STYLES ---------------- */
const styles = StyleSheet.create({
  card: {
    backgroundColor: themeColors.white,
    borderRadius: 10,
    marginBottom: 20,
    padding: scale(10),
    elevation: 5,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  
  activeCard: {
    borderWidth: 2,
    borderColor: themeColors.secondaryVibrantPink,
    backgroundColor: '#fff0f6',
  },

  info: {
    flexDirection: "row",
    gap: scale(10),
  },

  location: {
    maxWidth: width * 0.55,
  },

  cardImage: {
    width: scale(40),
    height: scale(40),
  },
  placeName: {
    fontSize: verticalScale(11),
    fontWeight: "bold",
  },

  placeDes: {
    fontSize: verticalScale(10),
    marginTop: 4,
  },

  count: {
    backgroundColor: themeColors.secondaryVibrantPink,
    paddingHorizontal: scale(15),
    paddingVertical: scale(8),
    borderRadius: scale(20),
  },

  countText: {
    fontSize: verticalScale(12),
    color: themeColors.white,
  },

  activeBadge: {
    position: 'absolute',
    top: scale(-10),
    alignSelf: 'center',
    backgroundColor: themeColors.secondaryVibrantPink,
    paddingHorizontal: scale(10),
    paddingVertical: scale(4),
    borderRadius: scale(20),
  },

  activeBadgeText: {
    color: themeColors.white,
    fontSize: verticalScale(6),
  },
});
