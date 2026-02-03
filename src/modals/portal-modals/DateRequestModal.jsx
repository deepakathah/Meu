import imagePath from "@/constant/imagePath";
import globalFonts from "@/theme/fontFamily";
import globalStyle from "@/theme/globalStyle";
import styles from "@/theme/portal-modals/requestPortal.styles";
import themeColors from "@/theme/themeColors";
import React, { useCallback } from "react";
import { Image, Modal, Text, TouchableOpacity, View } from "react-native";

export default function DateRequestModal({
  portalData,
  hidePortal,
  user,
  acceptRequest,
  rejectRequest,
}) {
  const capitalize = useCallback(
    (str) =>
      str
        ? str
          .split(" ")
          .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
          .join(" ")
        : "",
    []
  );

  return (
    <Modal visible={!!portalData} transparent animationType="fade">
      <View style={styles.overlay}>
        <View style={styles.card}>
          <TouchableOpacity style={styles.closeBtn} onPress={hidePortal}>
            <Image source={imagePath.close} style={styles.closeIcon} />
          </TouchableOpacity>

          <Text style={[globalStyle.headingSmall, globalFonts.poppins_600]}>
            Date Request
          </Text>

          <View style={[globalStyle.grid, styles.profileBx]}>
            <View style={styles.profileBox}>
              <Image
                source={{
                  uri:
                    user?.selfie && user?.baseUrl
                      ? `${user.baseUrl}${user.selfie}`
                      : "https://i.pravatar.cc/150?img=4",
                }}
                style={styles.profileImage}
              />
            </View>

            <View>
              <Text style={[globalStyle.headingSmall, globalFonts.poppins_600]}>
                {capitalize(user?.name || "Guest")}, {user?.age || 18}
              </Text>
              <Text style={[globalStyle.commonText, globalFonts.poppins_500]}>
                {capitalize(user?.profession || "Developer")} |{" "}
                {capitalize(user?.characteristic || "Coder")}
              </Text>
            </View>
          </View>

          <Text style={[styles.requestMessage, globalFonts.poppins_500]}>
            {portalData?.body ||
              "Lorem Ipsum is simply dummy text of the printing and typesetting industry."}
          </Text>

          <View style={styles.btnContainer}>
            <TouchableOpacity
              onPress={rejectRequest}
              style={[
                globalStyle.commonBtn,
                {
                  backgroundColor: themeColors.darkCharcoal,
                  width: "48%",
                },
              ]}
            >
              <Text
                style={[
                  globalStyle.btnTextCommon,
                  globalFonts.poppins_700,
                  { color: themeColors.white },
                ]}
              >
                Reject
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={acceptRequest}
              style={[
                globalStyle.commonBtn,
                {
                  backgroundColor: themeColors.secondaryVibrantPink,
                  width: "48%",
                },
              ]}
            >
              <Text
                style={[
                  globalStyle.btnTextCommon,
                  globalFonts.poppins_700,
                  { color: themeColors.white },
                ]}
              >
                Accept
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}
