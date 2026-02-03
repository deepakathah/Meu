
import TimeZone from "@/constant/timeZone";
import {
  checkInApi,
  getUsersListApi
} from "@/services/hotspotApi";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useCallback, useEffect, useRef, useState } from "react";

import BeforeCheckInConfirm from "@/components/molecules/BeforeCheckInConfirm";
import CheckInConfirm from "@/components/molecules/CheckInConfirm";
import CheckInSchedule from "@/components/molecules/CheckInSchedule";
import ModelMessage from "@/components/molecules/ModelMessage";
import PersonCards from "@/components/molecules/PersonCards";
import PlaceCards from "@/components/molecules/PlaceCards";
import SlideModel from "@/components/molecules/SlideModel";
import { useFocusEffect, useLocalSearchParams, useRouter } from "expo-router";

export const useCheckInFlow = ({ token, user_id, locationState, paramsState }) => {
  const { userTime, userTimeZone } = TimeZone();
  const isMounted = useRef(true);
  const { checkInType } = useLocalSearchParams();
  const router = useRouter();
  // const { setIsCheckIn, isHotspotMode } = paramsState;
  const { setIsCheckIn } = paramsState;

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

  // useEffect(()=>{console.log(locationState)},[locationState])

  const [selectedRestaurant, setSelectedRestaurant] = useState(null);
  const [selectedPlace, setSelectedPlace] = useState(null);
  const [usersData, setUsersData] = useState([]);
  const [isError, setIsError] = useState(null);
  const [loadingRestaurantId, setLoadingRestaurantId] = useState(null);

  const [isOpenCard, setIsOpenCard] = useState(false);
  const [isOpenPersonList, setIsOpenPersonList] = useState(false);
  const [isSchedule, setIsSchedule] = useState(false);
  const [beforeCheckIn, setBeforeCheckIn] = useState(false);
  const [confirmCheckIn, setConfirmCheckIn] = useState(false);
  const [confirmScheduleCheckIn, setConfirmScheduleCheckIn] = useState(false);
  const [showSideModal, setShowSideModal] = useState(false);
  const [checkInDetails, setCheckInDetails] = useState(null);
  const controllerRef = useRef(null);
  const [isHotspotMode, setIsHotspotMode] = useState(true);
  useEffect(() => () => {
    isMounted.current = false;
    return () => controllerRef.current?.abort();
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

  const handleMarkerPress = useCallback((place) => {
    setSelectedPlace(place);
    setScheduleData(prev => ({ ...prev, area: place.name, areaId: place.placeId }));
    setIsOpenCard(true);
  }, []);


  const getUsersList = async (restaurantId) => {
    controllerRef.current?.abort();
    controllerRef.current = new AbortController();

    try {
      setLoadingRestaurantId(restaurantId);

      const obj = await getUsersListApi(
        token,
        restaurantId,
        userTimeZone,
        controllerRef.current.signal
      );

      if (!isMounted.current) return;

      setLoadingRestaurantId(null);
      if (!obj.status) return setIsError(obj.message);

      setUsersData(obj.data || []);
      setIsOpenPersonList(true);
    } catch (e) {
      if (e.name !== "AbortError") {
        setIsError("Network error.");
      }
    }
  };

  const checkInApiCall = async (restaurant, isGettingUser = false) => {
    const newData = {
      ...scheduleData,
      shop: restaurant.name,
      shopId: restaurant.restaurantId,
      lat: locationState?.location?.coords.latitude,
      long: locationState?.location.coords.longitude,
    };
    // console.log(newData)

    if (isGettingUser) setLoadingRestaurantId(restaurant?.restaurantId);

    const obj = await checkInApi(token, newData);
    setLoadingRestaurantId(null);

    if (!obj.status) return setIsError(obj.message);
    setCheckInDetails(obj.checkInData);
    await AsyncStorage.setItem("check-in-details", JSON.stringify(obj.checkInData));
    setScheduleData(newData);
    return true;
  };

  const handleCheckInType = (type) => {
    setIsCheckIn(false)
    setShowSideModal(true);
    setScheduleData(prev => ({ ...prev, type }));
  };

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


  const handleConfirmedCheckIn = useCallback(async () => {
    setBeforeCheckIn(false);

    if (scheduleData.type === "schedule" && !isHotspotMode) {
      setIsSchedule(true);
      return;
    }

    const success = await checkInApiCall(selectedRestaurant, true);
    if (success) setConfirmCheckIn(true);
  }, [scheduleData.type, isHotspotMode, selectedRestaurant]);


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


  const renderUI = () => (
    <>
      {isError && <ModelMessage message={isError} setIsError={setIsError} />}

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

      {isOpenPersonList && (
        <PersonCards setIsOpenPersonList={setIsOpenPersonList} restaurant={selectedRestaurant} usersData={usersData} />
      )}

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

      {beforeCheckIn && (
        <BeforeCheckInConfirm
          setBeforeCheckIn={setBeforeCheckIn}
          place={selectedPlace}
          heading={`Check In Confirm at ${selectedRestaurant?.name || ""}`}
          description="All checked in—let the fun begin! Wishing you the best vibes for your date."
          handleConfirmedCheckIn={handleConfirmedCheckIn}
        />
      )}

      {confirmCheckIn && (
        <CheckInConfirm
          closeModel={closeModel}
          hotspotName={selectedPlace}
          heading={`Check In Confirmed at ${selectedRestaurant?.name || ""}`}
          description="All checked in—let the fun begin! Wishing you the best vibes for your date"
        />
      )}
      {confirmScheduleCheckIn && (
        <CheckInConfirm
          closeModel={closeModel}
          hotspotName={selectedPlace}
          heading={`Schedule Check In Confirm at ${selectedRestaurant?.name || ""}`}
          description="Don’t forget to check in at your scheduled place on time"
        />
      )}

      {showSideModal && (
        <SlideModel
          type={scheduleData.type ? `check in ${scheduleData.type}` : "find people"}
          visible={showSideModal}
          onHide={() => setShowSideModal(false)}
          token={token}
          checkInType={scheduleData.type}
          handleMarkerPress={handleMarkerPress}
          places={locationState.places}
        />
      )}
    </>
  );

  return { handleMarkerPress, handleCheckInType, renderUI, setScheduleData };
};
