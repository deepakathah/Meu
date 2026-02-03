import getApiUrl from '@/constant/apiUrl';
import Constants from 'expo-constants';
import { useCallback, useRef, useState } from 'react';
import { useSelector } from 'react-redux';


const useNearbyRestaurants = () => {
    const [restaurants, setRestaurants] = useState([]);
    const API_KEY = Constants?.expoConfig?.extra?.mapApi;
    const { token } = useSelector((state) => state.auth);
    const abortController = useRef(null);

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

    const fetchRestaurants = async ({ latitude, longitude }) => {
        try {
            if (!latitude || !longitude || !API_KEY) {
                setRestaurants([]);
                return;
            }

            const { shopsCoverArea, markerCategory } = await fetchSettings()
            if (!shopsCoverArea) {
                console.log("shopsCoverArea is not defined!")
                setRestaurants([])
                return
            }

            const radius = Math.max(shopsCoverArea, 500);

            const url = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${latitude},${longitude}&radius=${radius}&&type=restaurant|cafe&key=${API_KEY}`;

            const response = await fetch(url);
            const json = await response.json();
            if (json.results) {
                const formatted = json.results.map(restaurant => {
                    return {
                        name: restaurant.name,
                        address: restaurant.vicinity,
                        latitude: restaurant.geometry.location.lat,
                        longitude: restaurant.geometry.location.lng,
                        restaurantId: restaurant.place_id
                    }
                });

                setRestaurants(formatted);
            } else {
                setRestaurants([]);
            }
        } catch (error) {
            console.error('Error fetching restaurants:', error);
            setRestaurants([]);
        }
    };

    return [restaurants, fetchRestaurants];
};

export default useNearbyRestaurants;
