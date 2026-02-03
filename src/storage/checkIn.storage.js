import AsyncStorage from "@react-native-async-storage/async-storage";

const KEY = "check-in-details";

export const saveCheckIn = (data) =>
  AsyncStorage.setItem(KEY, JSON.stringify(data));

export const getStoredCheckIn = async () => {
  const str = await AsyncStorage.getItem(KEY);
  return str ? JSON.parse(str) : null;
};
