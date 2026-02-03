// import globalFonts from "@/theme/fontFamily";
// import { ActivityIndicator, StyleSheet, Text, View } from "react-native";
// import { useSelector } from "react-redux";

// import HotspotMap from "@/components/hotspots/HotspotMap";
// import { useCheckInFlow } from "@/hooks/hotspot/useCheckInFlow";
// import { useHotspotLocation } from "@/hooks/hotspot/useHotspotLocation";
// import { useHotspotMap } from "@/hooks/hotspot/useHotspotMap";
// import { useHotspotParams } from "@/hooks/hotspot/useHotspotParams";

// export default function HotspotsScreen() {
//   const { token, user_id } = useSelector((state) => state.auth ?? {});

//   const locationState = useHotspotLocation();
//   const mapState = useHotspotMap(locationState.places);
//   const paramsState = useHotspotParams();
//   const checkIn = useCheckInFlow({ token, user_id, locationState, paramsState });

//   if (!locationState.location) {
//     return (
//       <View style={styles.center}>
//         <ActivityIndicator size="large" color="#5D3FD3" />
//         <Text style={[globalFonts.poppins_500, { marginTop: 10 }]}>
//           Fetching your location...
//         </Text>
//       </View>
//     );
//   }

//   return (
//     <>
//       <HotspotMap {...mapState} location={locationState.location} onMarkerPress={checkIn.handleMarkerPress} />
//       {checkIn.renderUI()}
//       {paramsState.isCheckIn && paramsState.renderCheckInSelector(checkIn.handleCheckInType)}
//     </>
//   );
// }

// const styles = StyleSheet.create({
//   center: { flex: 1, justifyContent: "center", alignItems: "center" },
// });

import globalFonts from "@/theme/fontFamily";
import { ActivityIndicator, StyleSheet, Text, View } from "react-native";
import { useSelector } from "react-redux";

import HotspotMap from "@/components/hotspots/HotspotMap";
import { useCheckInFlow } from "@/hooks/hotspot/useCheckInFlow";
import { useHotspotLocation } from "@/hooks/hotspot/useHotspotLocation";
import { useHotspotMap } from "@/hooks/hotspot/useHotspotMap";
import { useHotspotParams } from "@/hooks/hotspot/useHotspotParams";

export default function HotspotsScreen() {
  const { token, user_id } = useSelector((state) => state.auth ?? {});

  const locationState = useHotspotLocation();
  const mapState = useHotspotMap(locationState.places);
  const paramsState = useHotspotParams();

  const checkIn = useCheckInFlow({
    token,
    user_id,
    locationState,
    paramsState,
  });

  if (!locationState.location) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#5D3FD3" />
        <Text style={[globalFonts.poppins_500, { marginTop: 10 }]}>
          Fetching your location...
        </Text>
      </View>
    );
  }

  return (
    <>
      <HotspotMap
        {...mapState}
        mapRef={locationState.mapRef}
        location={locationState.location}
        onMarkerPress={checkIn.handleMarkerPress}
      />
      {checkIn.renderUI()}
      {paramsState.isCheckIn &&
        paramsState.renderCheckInSelector(checkIn.handleCheckInType)}
    </>
  );
}
const styles = StyleSheet.create({
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
});