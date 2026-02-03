
import { useFocusEffect } from "@react-navigation/native";
import React, { useCallback, useState } from "react";
import {
  ActivityIndicator,
  Dimensions,
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { scale, verticalScale } from "react-native-size-matters";
import { useSelector } from "react-redux";

import PersonRequest from "@/components/atoms/PersonRequest";
import getApiUrl from "@/constant/apiUrl";
import imagePath from "@/constant/imagePath";
import globalFonts from "@/theme/fontFamily";
import globalStyle from "@/theme/globalStyle";
import themeColors from "@/theme/themeColors";

const { width, height } = Dimensions.get("window");

const History = ({ navigation }) => {
  const { token } = useSelector((state) => state.auth);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchRequestHistory = useCallback(async () => {
    if (!token) return;
    try {
      setLoading(true);
      const apiURL = getApiUrl();
      const response = await fetch(`${apiURL}/getRequestHistory`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      const obj = await response.json();

      if (!obj?.status) {
        console.warn("API Error:", obj?.message || "Unknown error occurred.");
        setUsers([]);
        return;
      }

      setUsers(obj.data || []);
    } catch (error) {
      console.error("Network Error:", error);
    } finally {
      setLoading(false);
    }
  }, [token]);

  useFocusEffect(
    useCallback(() => {
      fetchRequestHistory();
    }, [fetchRequestHistory])
  );

  const renderItem = useCallback(
    ({ item }) => (
      <PersonRequest user={item} getUsersrRequests={fetchRequestHistory} />
    ),
    [fetchRequestHistory]
  );

  const renderEmptyList = () =>
    !loading && (
      <Text style={styles.emptyText}>No activity found.</Text>
    );

  const renderFooter = () =>
    loading && (
      <ActivityIndicator
        size="small"
        color={themeColors.primary}
        style={{ marginVertical: verticalScale(20) }}
      />
    );

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={[globalStyle.grid, styles.header]}>
        <TouchableOpacity onPress={() => navigation?.goBack?.()}>
          <Image source={imagePath.backIcon} style={styles.backIcon} />
        </TouchableOpacity>
        <Text style={[globalStyle.headingTitle, globalFonts.poppins_600]}>
          Activity
        </Text>
        {/* spacer for symmetry */}
        <View style={{ width: 24 }} /> 
      </View>

      {/* Content */}
      <FlatList
        data={users}
        keyExtractor={(item, index) => item?._id ?? `${index}`}
        renderItem={renderItem}
        contentContainerStyle={styles.listContainer}
        ListEmptyComponent={renderEmptyList}
        ListFooterComponent={renderFooter}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};

export default History;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: themeColors.lightGray,
  },
  header: {
    alignItems: "center",
    justifyContent: "space-between",
    flexDirection: "row",
    paddingHorizontal: scale(20),
    paddingVertical: scale(10),
    backgroundColor: themeColors.white,
    borderBottomColor: themeColors.lightGray,
    borderBottomWidth: 1,
  },
  backIcon: {
    width: scale(20),
    height: scale(20),
    resizeMode: "contain",
  },
  listContainer: {
    padding: scale(20),
    paddingBottom: verticalScale(65),
    flexGrow: 1,
  },
  emptyText: {
    textAlign: "center",
    color: themeColors.darkGray,
    marginTop: verticalScale(30),
  },
});

