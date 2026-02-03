import getApiUrl from "@/constant/apiUrl";
import imagePath from "@/constant/imagePath";
import globalFonts from "@/theme/fontFamily";
import globalStyle from "@/theme/globalStyle";
import themeColors from "@/theme/themeColors";
import { useRouter } from "expo-router";
import React, { useCallback, useState } from "react";
import {
  Alert,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from "react-native";
import { scale, verticalScale } from "react-native-size-matters";
import { useSelector } from "react-redux";

const PersonRequest = ({ user = {}, getUsersrRequests }) => {
  const router = useRouter();
  const { token } = useSelector((state) => state.auth);
  const [loading, setLoading] = useState(false);

  const getTimeAgo = (timestamp) => {
    if (!timestamp) return "";
    const past = new Date(timestamp);
    if (isNaN(past)) return "";

    const now = new Date();
    const diffMs = now - past;
    const seconds = Math.floor(diffMs / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (seconds < 60) return "Just now";
    if (minutes < 60) return `${minutes} min ago`;
    if (hours < 24) return `${hours} hour${hours > 1 ? "s" : ""} ago`;
    return `${days} day${days > 1 ? "s" : ""} ago`;
  };

  const handleRequest = async (status) => {
    if (loading) return;
    try {
      setLoading(true);
      const apiURL = getApiUrl();

      const payload = {
        requestId: user?._id,
        status,
      }

      const response = await fetch(`${apiURL}/updateRequestStatus`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      const obj = await response.json();

      getUsersrRequests?.();
      if (!obj.status) {
        Alert.alert("Error", obj.message || "Unknown error.");
        return;
      }


    } catch (error) {
      console.error("Update status error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleProfile = useCallback(() => {
    router.push({
      pathname: "/userprofile",
      params: {
        uid: user?.uid,
        token: token
      }
    })
  }, [])

  const capitalize = useCallback((str) => {
    if (!str) return "";
    return str
      .split(" ")
      .map((item) => item.charAt(0).toUpperCase() + item.slice(1))
      .join(" ");
  }, []);

  const status = user?.status?.toLowerCase?.() || "pending";
  const statusColor =
    status === "accepted"
      ? themeColors.green
      : status === "rejected"
        ? themeColors.secondaryVibrantPink
        : themeColors.warmYellow;



  return (
    <TouchableOpacity onPress={handleProfile} style={styles.card}>
      <View style={styles.cardHeader}>
        <View style={styles.info}>
          <Image
            source={
              user?.baseUrl && user?.selfie
                ? { uri: `${user.baseUrl}${user.selfie}` }
                : imagePath.person
            }
            style={styles.image}
            resizeMode="cover"
          />
          <View>
            <Text
              style={[
                globalStyle.commonHeading,
                globalFonts.poppins_700,
                { color: themeColors.darkCharcoal, lineHeight: 17 },
              ]}
            >
              {user?.name || "Unknown User"}
            </Text>
            <Text
              style={[
                globalStyle.commonText,
                globalFonts.poppins_500,
                { color: themeColors.darkCharcoal, opacity: 0.6 },
              ]}
            >
              {user?.profession || "N/A"} | {user?.characteristic || "N/A"}
            </Text>
          </View>
        </View>

        <View style={styles.grid}>
          <Text
            style={[
              globalStyle.smallText,
              globalFonts.poppins_500,
              { color: themeColors.darkGray },
            ]}
          >
            {getTimeAgo(user?.createdAt)}
          </Text>
          <Text
            style={[
              globalStyle.smallText,
              globalFonts.poppins_700,
              { color: themeColors.darkGray },
            ]}
          >
            {capitalize(user?.requestType)}
          </Text>
          <Text
            style={[
              globalStyle.smallText,
              globalFonts.poppins_500,
              {
                backgroundColor: statusColor,
                color: themeColors.white,
                paddingHorizontal: scale(8),
                borderRadius: 15,
                textTransform: "capitalize",
              },
            ]}
          >
            {status}
          </Text>
        </View>
      </View>

      <View style={styles.cardContent}>
        <Text style={[globalStyle.commonText, globalFonts.poppins_500]}>
          {user?.summary || "No summary provided."}
        </Text>

        {status === "pending" && user?.requestType == "Received" &&(
          <View style={styles.btnContainer}>
            <TouchableOpacity
              disabled={loading}
              onPress={() => handleRequest("rejected")}
              style={[
                globalStyle.commonBtn,
                {
                  backgroundColor: themeColors.darkCharcoal,
                  width: "45%",
                  opacity: loading ? 0.7 : 1,
                },
              ]}
            >
              <Text
                style={[
                  globalStyle.commonHeading,
                  globalFonts.poppins_700,
                  { color: themeColors.white },
                ]}
              >
                Reject
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              disabled={loading}
              onPress={() => handleRequest("accepted")}
              style={[
                globalStyle.commonBtn,
                {
                  backgroundColor: themeColors.secondaryVibrantPink,
                  width: "45%",
                  opacity: loading ? 0.7 : 1,
                },
              ]}
            >
              <Text
                style={[
                  globalStyle.commonHeading,
                  globalFonts.poppins_700,
                  { color: themeColors.white },
                ]}
              >
                Accept
              </Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
};

export default PersonRequest;

const styles = StyleSheet.create({
  card: {
    backgroundColor: themeColors.white,
    borderRadius: 10,
    marginBottom: 20,
    padding: scale(10),
    shadowColor: themeColors.black,
    shadowOffset: { width: 2, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  info: {
    flexDirection: "row",
    alignItems: "center",
    gap: scale(10),
  },
  image: {
    width: scale(50),
    height: scale(50),
    borderRadius: scale(25),
  },
  grid: {
    flexDirection: "column",
    alignItems: "flex-end",
    gap: 5,
  },
  cardContent: {
    borderTopColor: "#2b2d4221",
    borderTopWidth: 1,
    paddingTop: verticalScale(10),
    marginTop: verticalScale(10),
  },
  btnContainer: {
    flexDirection: "row",
    justifyContent: "flex-start",
    gap: scale(15),
    marginTop: verticalScale(10),
  },
});
