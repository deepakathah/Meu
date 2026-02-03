

import BeforeCheckInConfirm from "@/components/molecules/BeforeCheckInConfirm";
import CheckInCard from "@/components/molecules/CheckInCard";
import CheckInConfirm from "@/components/molecules/CheckInConfirm";
import CheckInSchedule from "@/components/molecules/CheckInSchedule";
import ModelMessage from "@/components/molecules/ModelMessage";
import PersonCards from "@/components/molecules/PersonCards";
import PlaceCards from "@/components/molecules/PlaceCards";
import SlideModel from "@/components/molecules/SlideModel";
import getApiUrl from "@/constant/apiUrl";
import imagePath from "@/constant/imagePath";
import TimeZone from "@/constant/timeZone";
import useNearbyPlaces from "@/hooks/hotspot/nearByPlace";
import globalFonts from "@/theme/fontFamily";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Location from "expo-location";
import { useFocusEffect, useLocalSearchParams, useRouter } from "expo-router";
import { useCallback, useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Dimensions,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from "react-native";
import MapView, { Marker, PROVIDER_GOOGLE } from "react-native-maps";
import { scale, verticalScale } from "react-native-size-matters";
import { useSelector } from "react-redux";
const { width, height } = Dimensions.get("window");

const Hotspots = () => {
  const { token, user_id } = useSelector((state) => state.auth ?? {});

  const { checkInType } = useLocalSearchParams();
  const router = useRouter();
  const mapRef = useRef(null);
  const isMounted = useRef(true);

  const [isHotspotMode, setIsHotspotMode] = useState(true);
  const { userTime, userTimeZone } = TimeZone();

  const [scheduleData, setScheduleData] = useState({
    uid: user_id || null,
    type: "",
    area: "",
    shop: "",
    time: userTime,
    timeZone: userTimeZone,
    lat: null,
    long: null,
    areaId: null,
    shopId: null,
  });

  const [isCheckIn, setIsCheckIn] = useState(false);
  const [isOpenCard, setIsOpenCard] = useState(false);
  const [isOpenPersonList, setIsOpenPersonList] = useState(false);
  const [selectedRestaurant, setSelectedRestaurant] = useState(null);
  const [selectedPlace, setSelectedPlace] = useState(null);
  const [location, setLocation] = useState(null);
  const [isError, setIsError] = useState(null);
  const [places, fetchPlaces] = useNearbyPlaces();
  const [isSchedule, setIsSchedule] = useState(false);
  const [beforeCheckIn, setBeforeCheckIn] = useState(false);
  const [confirmCheckIn, setConfirmCheckIn] = useState(false);
  const [confirmScheduleCheckIn, setConfirmScheduleCheckIn] = useState(false);
  const [loadingRestaurantId, setLoadingRestaurantId] = useState(null);
  const [usersData, setUsersData] = useState([]);
  const [showSideModal, setShowSideModal] = useState(false);
  const [checkInDetails, setCheckInDetails] = useState(null);

  // Track component mount status
  useEffect(() => {
    isMounted.current = true;
    return () => {
      isMounted.current = false;
    };
  }, []);

  // Reset UI on focus
  useFocusEffect(
    useCallback(() => {
      setIsOpenCard(false);
      setIsOpenPersonList(false);
      setIsSchedule(false);
      setShowSideModal(false)
      setScheduleData((prev) => ({
        ...prev, type: "",
        time: userTime,
        timeZone: userTimeZone,
      }));
    }, [userTime, userTimeZone])
  );

  // Handle checkInType param
  useEffect(() => {
    if (checkInType === "checkIn") {
      setIsOpenCard(false);
      setIsOpenPersonList(false);
      setIsSchedule(false);
      setIsCheckIn(true);
      setIsHotspotMode(false);
    }
    else if (checkInType === "hotspots") {
      setIsCheckIn(false);
      setIsHotspotMode(true);

    }
    const timeout = setTimeout(() => {
      if (checkInType === "hotspots") {
        setShowSideModal(true)
      }
      router.setParams({ checkInType: null });
    }, 100);

    return () => clearTimeout(timeout);
  }, [checkInType, router]);

  // Get user location and nearby places
  useEffect(() => {
    let isActive = true;
    const controller = new AbortController();

    (async () => {
      try {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (!isActive || status !== "granted") return;

        const loc = await Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.High,
        });

        if (!isActive) return;

        const { latitude, longitude } = loc.coords;

        setLocation(loc);
        setScheduleData(prev => ({
          ...prev,
          lat: latitude,
          long: longitude,
        }));

        await fetchPlaces({ latitude, longitude, signal: controller.signal });
      } catch (err) {
        if (isActive) {
          setIsError("Failed to get your location.");
        }
      }
    })();

    return () => {
      isActive = false;
      controller.abort();
    };
  }, [fetchPlaces]);


  useEffect(() => {
    if (!places.length || !mapRef.current) return;

    const timeout = setTimeout(() => {
      mapRef.current?.fitToCoordinates(
        places.map(p => ({
          latitude: p.latitude,
          longitude: p.longitude,
        })),
        {
          edgePadding: { top: 100, right: 100, bottom: 100, left: 100 },
          animated: true,
        }
      );
    }, 250);

    return () => clearTimeout(timeout);
  }, [places]);


  const handleCheckInType = useCallback((type) => {
    setIsCheckIn(false);
    setShowSideModal(true)
    setScheduleData((prev) => ({ ...prev, type }));
  }, []);

  const handleConfirmedCheckIn = useCallback(async () => {
    setBeforeCheckIn(false);

    if (scheduleData.type === "schedule" && !isHotspotMode) {
      setIsSchedule(true);
      return;
    }

    const success = await checkInApiCall(selectedRestaurant, true);
    if (success) setConfirmCheckIn(true);
  }, [scheduleData.type, isHotspotMode, selectedRestaurant]);

  const handleMarkerPress = useCallback((place) => {
    setSelectedPlace(place);
    setScheduleData((prev) => ({
      ...prev,
      area: place?.name || "",
      areaId: place?.placeId || null,
    }));
    setIsOpenCard(true);
  }, []);

  const getUsersList = async (restaurantId) => {
    if (!restaurantId) return;
    try {
      setLoadingRestaurantId(restaurantId);
      const apiURL = getApiUrl();
      const response = await fetch(`${apiURL}/getAreaUsers`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ shopId: restaurantId, timeZone: userTimeZone }),
      });

      const obj = await response.json();
      setLoadingRestaurantId(null);

      if (!obj.status) {
        setIsError(obj.message || "Failed to load users.");
        return;
      }

      setUsersData(obj.data || []);
      setIsOpenPersonList(true);
    } catch (error) {
      console.error("getUsersList error:", error);
      setLoadingRestaurantId(null);
      setIsError("Network error. Please try again.");
    }
  };

  const checkInApiCall = useCallback(
    async (restaurant, isGettingUser = false) => {
      if (!token || !restaurant) return false;

      const controller = new AbortController();

      const newData = {
        ...scheduleData,
        shop: restaurant?.name ?? "",
        shopId: restaurant?.restaurantId ?? null,
      };

      try {
        if (isGettingUser) setLoadingRestaurantId(restaurant?.restaurantId);

        const apiURL = getApiUrl();
        const res = await fetch(`${apiURL}/setCheckIn`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(newData),
          signal: controller.signal,
        });

        const obj = await res.json();

        if (!isMounted.current) return false;

        if (obj?.message === "Internal Server Error") {
          setIsError(obj.message);
          return false;
        }

        if (!obj?.status) {
          setIsError(obj.message);
          return false;
        }

        const { checkInData } = obj;

        if (checkInData) {
          setCheckInDetails(checkInData)
          await AsyncStorage.setItem(
            "check-in-details",
            JSON.stringify(checkInData)
          );
        }

        setScheduleData(newData);
        return true;
      }
      catch (error) {
        if (isMounted.current) {
          setIsError("Check-in failed. Please try again.");
        }
        return false;
      }
      finally {
        if (isMounted.current) {
          setLoadingRestaurantId(null);
          setBeforeCheckIn(false);
        }
      }
    },
    [token, scheduleData]
  );

  const handlePlacePress = useCallback(
    async (restaurant) => {

      if (!restaurant?.restaurantId) return;

      setSelectedRestaurant(restaurant);

      const storedString = await AsyncStorage.getItem("check-in-details");
      const stored = storedString ? JSON.parse(storedString) : null;

      if (
        stored &&
        stored.shopId === restaurant.restaurantId &&
        stored.isCheck === "in"
      ) {
        await getUsersList(restaurant.restaurantId);
        return;
      }
      if (!isHotspotMode) {
        setBeforeCheckIn(true);
        return;
      }

      await getUsersList(restaurant?.restaurantId);
    },
    [isHotspotMode, getUsersList]
  );

  const handleConfirmSchedule = useCallback(async () => {
    if (!selectedRestaurant) return;

    const success = await checkInApiCall(selectedRestaurant, true);
    if (success && isMounted.current) {
      setConfirmScheduleCheckIn(true);
      setIsOpenCard(false);
      setIsSchedule(false);
    }
  }, [checkInApiCall, selectedRestaurant]);

  const closeModel = useCallback(() => {
    setConfirmCheckIn(false);
    setConfirmScheduleCheckIn(false);
  }, []);

  // Show loading until location is ready
  if (!location) {
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
      {/* Error Modal */}
      {isError && (
        <ModelMessage
          heading={isHotspotMode ? selectedRestaurant?.name : null}
          message={isError}
          setIsError={setIsError}
        />
      )}

      {/* Map */}
      <MapView
        ref={mapRef}
        style={styles.map}
        provider={PROVIDER_GOOGLE}
        showsUserLocation
        initialRegion={{
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
          latitudeDelta: 0.1,
          longitudeDelta: 0.1,
        }}
      >
        {places.map((place, idx) => (
          <Marker
            key={place.placeId}
            coordinate={{
              latitude: place.latitude,
              longitude: place.longitude,
            }}
            title={place.name}
            onPress={() => handleMarkerPress(place)}
          >
            <Image
              source={imagePath.marker}
              style={styles.marker}
              resizeMode="contain"
            />
          </Marker>
        ))}
      </MapView>

      {/* Place Card */}
      {isOpenCard && (
        <PlaceCards
          isOpenCard={isOpenCard}
          setIsOpenCard={setIsOpenCard}
          place={selectedPlace}
          onPlacePress={handlePlacePress}
          token={token}
          loadingRestaurantId={loadingRestaurantId}
          checkInDetails={checkInDetails}
        />
      )}

      {/* People List */}
      {isOpenPersonList && (
        <PersonCards
          setIsOpenPersonList={setIsOpenPersonList}
          restaurant={selectedRestaurant}
          token={token}
          setLoadingRestaurantId={setLoadingRestaurantId}
          usersData={usersData}
        />
      )}

      {/* Schedule Modal */}
      {isSchedule && (
        <CheckInSchedule
          isLoading={loadingRestaurantId}
          isSchedule={isSchedule}
          place={selectedPlace}
          setIsSchedule={setIsSchedule}
          selectedRestaurant={selectedRestaurant}
          setScheduleData={setScheduleData}
          onSchedulePress={handleConfirmSchedule}
        />
      )}

      {/* Before Check-in Confirmation */}
      {beforeCheckIn && (
        <BeforeCheckInConfirm
          setBeforeCheckIn={setBeforeCheckIn}
          place={selectedPlace}
          heading={`Check In Confirm at ${selectedRestaurant?.name || ""}`}
          description="All checked in—let the fun begin! Wishing you the best vibes for your date."
          handleConfirmedCheckIn={handleConfirmedCheckIn}
        />
      )}

      {/* Check-in Success */}
      {confirmCheckIn && (
        <CheckInConfirm
          closeModel={closeModel}
          heading={`Check In Confirmed at ${selectedRestaurant?.name || ""}`}
          description="All checked in—let the fun begin! Wishing you the best vibes for your date"
        />
      )}

      {/* Schedule Success */}
      {confirmScheduleCheckIn && (
        <CheckInConfirm
          closeModel={closeModel}
          heading={`Schedule Check In Confirm at ${selectedRestaurant?.name || ""}`}
          description="Don’t forget to check in at your scheduled place on time"
        />
      )}

      {/* Check-in Type Selector */}
      {isCheckIn && (
        <View style={styles.checkInGrid}>
          <TouchableOpacity onPress={() => handleCheckInType("hotspot")}>
            <CheckInCard
              heading="Hotspot Check In"
              text="If you are on the location, then check in please..."
              imageName="hostspotCheckIn"
              bgColor="primaryRichPurple"
            />
          </TouchableOpacity>

          <TouchableOpacity onPress={() => handleCheckInType("schedule")}>
            <CheckInCard
              heading="Find & Confirm Schedule"
              text="Schedule your Date time and location..."
              imageName="findCheckIn"
              bgColor="warmYellow"
            />
          </TouchableOpacity>
        </View>
      )}

      {showSideModal && (
        <SlideModel
          type={scheduleData.type ? `check in ${scheduleData.type}` : "find people"}
          visible={showSideModal}
          onHide={() => setShowSideModal(false)}
          token={token}
          checkInType={scheduleData.type}
          handleMarkerPress={handleMarkerPress}
          places={places}
        />
      )}
    </>
  );
};

export default Hotspots;

const styles = StyleSheet.create({
  map: {
    flex: 1
  },

  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center"
  },

  marker:
  {
    width: scale(30),
    height: scale(30)
  },

  checkInGrid: {
    position: "absolute",
    width,
    height,
    justifyContent: "center",
    alignItems: "center",
    rowGap: verticalScale(10),
    backgroundColor: "#00000075",
  },
});

