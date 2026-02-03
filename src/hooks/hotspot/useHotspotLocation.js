import useNearbyPlaces from "@/hooks/hotspot/nearByPlace";
import * as Location from "expo-location";
import { useEffect, useRef, useState } from "react";

export const useHotspotLocation = () => {
  const [location, setLocation] = useState(null);
  const [isError, setIsError] = useState(null);
  const [places, fetchPlaces] = useNearbyPlaces();
  const mapRef = useRef(null);

  useEffect(() => {
    let active = true;
    const controller = new AbortController();

    (async () => {
      try {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== "granted") return;

        const loc = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.High });
        if (!active) return;

        setLocation(loc);
        const { latitude, longitude } = loc.coords;

        await fetchPlaces({
          latitude,
          longitude,
          signal: controller.signal,
        });

        mapRef.current?.animateToRegion(
          {
            latitude,
            longitude,
            latitudeDelta: 0.150,
            longitudeDelta: 0.150,
          },
          800
        );
      } catch {
        setIsError("Failed to get your location.");
      }
    })();

    return () => {
      active = false;
      controller.abort();
    };
  }, []);

  return { mapRef, location, isError, setIsError, places };
};
