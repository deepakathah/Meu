
import getApiUrl from "@/constant/apiUrl";
import Constants from "expo-constants";
import * as SQLite from "expo-sqlite";
import { useCallback, useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";

let meuDB;

const useNearbyPlaces = () => {
  const [places, setPlaces] = useState([]);
  const [dbReady, setDbReady] = useState(false);
  const isMounted = useRef(true);
  const abortController = useRef(null);
  const lastLocationRef = useRef(null);
  const { token } = useSelector((state) => state.auth);
  const API_KEY = Constants?.expoConfig?.extra?.mapApi;

  useEffect(() => {
    let cancelled = false;

    const initDB = async () => {
      try {
        meuDB = await SQLite.openDatabaseAsync("meuDB.db");
        await meuDB.execAsync(`
          CREATE TABLE IF NOT EXISTS places (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT
          );
        `);
        if (!cancelled) setDbReady(true);
      } catch (error) {
        console.error("Database init error:", error);
      }
    };

    initDB();

    return () => {
      cancelled = true;
      isMounted.current = false;
      if (abortController.current) {
        abortController.current.abort();
      }
    };

  }, []);

  const getLocalPlaces = useCallback(async () => {
    if (!dbReady) return [];
    try {
      const result = await meuDB.getAllAsync("SELECT * FROM places;");
      return result.map((r) => r.name);
    } catch (e) {
      console.error("Error reading local places:", e);
      return [];
    }
  }, [dbReady]);


  const savePlacesToLocal = useCallback(
    async (placesList) => {
      if (!dbReady) return;
      try {
        await meuDB.execAsync("DELETE FROM places;");
        for (const place of placesList) {
          await meuDB.runAsync("INSERT INTO places (name) VALUES (?);", [place]);
        }
      } catch (e) {
        console.error("Error saving places to local DB:", e);
      }
    },
    [dbReady]
  );

  const hasDataChanged = useCallback((localList, apiList) => {
    if (localList.length !== apiList.length) return true;
    return apiList.some((item, i) => item !== localList[i]);
  }, []);

  const fetchCustomePlaces = useCallback(async () => {
    const apiURL = getApiUrl();
    if (abortController.current) abortController.current.abort();
    abortController.current = new AbortController();

    try {
      const response = await fetch(`${apiURL}/getMeuLocation`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        signal: abortController.current.signal,
      });

      const obj = await response.json();
      const { location } = obj;
      const localPlaces = await getLocalPlaces();

      if (isMounted.current && hasDataChanged(localPlaces, location)) {
        await savePlacesToLocal(location);
        return location;
      } else {
        return localPlaces;
      }
    } catch (err) {
      if (err.name !== "AbortError") console.error("Error fetching custom places:", err);
      return [];
    }
  }, [token, getLocalPlaces, savePlacesToLocal, hasDataChanged]);

  const fetchSettings = useCallback(async () => {
    const apiURL = getApiUrl();
    if (abortController.current) abortController.current.abort();
    abortController.current = new AbortController();

    try {
      const response = await fetch(`${apiURL}/getMarkerDetails`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        signal: abortController.current.signal,
      });

      const obj = await response.json();

      if (!obj.status) {
        console.error(obj.message)
        return null
      }

      return obj.markerDetails


    } catch (err) {
      if (err.name !== "AbortError") console.error("Error fetching custom places:", err);
      return null;
    }
  }, [token]);

  const getDistanceKm = useCallback((lat1, lon1, lat2, lon2) => {
    const toRad = (x) => (x * Math.PI) / 180;
    const R = 6371;
    const dLat = toRad(lat2 - lat1);
    const dLon = toRad(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) ** 2 +
      Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2;
    return 2 * R * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  }, []);

  const fetchPlaces = useCallback(
    async ({ latitude, longitude }) => {
      if (!latitude || !longitude || !API_KEY) return;

      try {
        const last = lastLocationRef.current;
        if (last) {
          const distance = getDistanceKm(last.lat, last.lng, latitude, longitude);
          if (distance < 5) {
            return;
          }
        }

        lastLocationRef.current = { lat: latitude, lng: longitude };
        const { categories, markerRadius, markerCount, markerDistance } = await fetchSettings()

        if (!categories || !markerRadius || !markerCount || !markerDistance) {
          console.log("categories || markerRadius || markerCount || markerDistance is not defined!")
          setPlaces([])
          return
        }

        const pointDistance = Math.max(markerDistance, 500) / 1000
        const markerCategory = categories.join("|")

        // const areas =
        //   "office|business|corporate|coworking|office building|food hub|food plaza|restaurant complex|dining hub|mall|nightlife area|pub cluster";


        const response = await fetch(
          `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${latitude},${longitude}&radius=${markerRadius}&keyword=${encodeURIComponent(
            markerCategory
          )}&key=${API_KEY}`
        );

        const json = await response.json();
        if (!json.results) {
          return;
        }

        // const formatted = json.results.slice(0, markerCount).map((place) => ({
        //   name: place.name,
        //   latitude: place.geometry.location.lat,
        //   longitude: place.geometry.location.lng,
        //   placeId: place.place_id,
        // }));

        const formatted = [];

        json.results.slice(0, markerCount).forEach((place) => {
          const newPlace = {
            name: place.name,
            latitude: place.geometry.location.lat,
            longitude: place.geometry.location.lng,
            placeId: place.place_id,
          };


          const tooClose = formatted.some((f) => {
            const dist = getDistanceKm(f.latitude, f.longitude, newPlace.latitude, newPlace.longitude);
            return dist <= pointDistance;
          });

          if (!tooClose) {
            formatted.push(newPlace);
          }
        });


        const customPlaces = await fetchCustomePlaces();
        customPlaces?.forEach((custom) => {
          const tooClose = formatted.some((f) => {
            const dist = getDistanceKm(
              f.latitude,
              f.longitude,
              custom.latitude,
              custom.longitude
            );
            return dist <= pointDistance;
          });

          if (!tooClose) {
            formatted.push({...custom, placeId: custom["_id"]});
          }

        });


        if (isMounted.current) {
          setPlaces(formatted);
        }
      } catch (error) {
        if (isMounted.current) {
          console.error("Error fetching places:", error);
          setPlaces([]);
        }
      }
    },
    [API_KEY, getDistanceKm, fetchCustomePlaces]
  );

  return [places, fetchPlaces];
};

export default useNearbyPlaces;

