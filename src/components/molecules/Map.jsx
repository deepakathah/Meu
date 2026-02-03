import imagePath from '@/constant/imagePath';
import useNearbyRestaurants from '@/customHooks/nearByRestaurants';
import globalFonts from "@/theme/fontFamily";
import * as Location from 'expo-location';
import { useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Image,
  StyleSheet,
  Text,
  View
} from 'react-native';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';

const Map = () => {
  const [location, setLocation] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);
  const [restaurants, fetchRestaurants] = useNearbyRestaurants();
  const mapRef = useRef(null);

  useEffect(() => {
    const requestLocation = async () => {
      try {
        let { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
          setErrorMsg('Permission to access location was denied');
          return;
        }

        let loc = await Location.getCurrentPositionAsync({});
        setLocation(loc);

        const { latitude, longitude } = loc.coords;
        await fetchRestaurants({ latitude, longitude });

        // 👇 Animate map to user's region (1500m radius)
        const region = {
          latitude,
          longitude,
          latitudeDelta: 0.0200,
          longitudeDelta: 0.0200,
        };

        mapRef.current?.animateToRegion(region, 1000); // animate over 1 second
      } catch (error) {
        setErrorMsg('Error fetching location');
      }
    };

    requestLocation();
  }, []);


  if (!location) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="blue" />
        <Text style={[globalFonts.poppins_500]}>Fetching your location...</Text>
        {errorMsg && <Text style={{ color: 'red' }}>{errorMsg}</Text>}
      </View>
    );
  }


  return (
    <MapView
      ref={mapRef}
      style={styles.map}
      provider={PROVIDER_GOOGLE}
      showsUserLocation={true}
    >
      {restaurants.map((place, index) => (
        <Marker
          key={index}
          coordinate={{ latitude: place.latitude, longitude: place.longitude }}
          title={place.name}
          // onPress={() => alert(`You clicked on ${place.name}`)}
        >
          <Image
            source={imagePath.marker}
            style={styles.marker}
            resizeMode="contain"
          /></Marker>
      ))}
    </MapView>
  );
};

export default Map;

const styles = StyleSheet.create({
  map: {
    flex: 1,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

  marker: {
    width: 35,
    height: 35,
  },

});
