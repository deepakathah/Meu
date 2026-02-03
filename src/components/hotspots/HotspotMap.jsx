import imagePath from "@/constant/imagePath";
import { Image, StyleSheet } from "react-native";
import MapView, { Marker, PROVIDER_GOOGLE } from "react-native-maps";

export default function HotspotMap({ mapRef, location, places, onMarkerPress }) {
  const region = {
    latitude: location.coords.latitude,
    longitude: location.coords.longitude,
    latitudeDelta: 0.150,
    longitudeDelta: 0.150,
  };

  return (
    <MapView
      ref={mapRef}
      style={styles.map}
      provider={PROVIDER_GOOGLE}
      showsUserLocation
      followsUserLocation
      region={region}
    >
      {places.map((place) => (
        <Marker
          key={place.placeId}
          coordinate={{ latitude: place.latitude, longitude: place.longitude }}
          onPress={() => onMarkerPress(place)}
        >
          <Image source={imagePath.marker} style={styles.marker} resizeMode="contain" />
        </Marker>
      ))}
    </MapView>
  );
}

const styles = StyleSheet.create({
  map: { flex: 1 },
  marker: { width: 30, height: 30 },
});
