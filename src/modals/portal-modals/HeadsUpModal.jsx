import imagePath from "@/constant/imagePath";
import globalFonts from "@/theme/fontFamily";
import globalStyle from "@/theme/globalStyle";
import styles from "@/theme/portal-modals/requestPortal.styles";
import themeColors from "@/theme/themeColors";
import React from "react";
import { Image, Modal, Text, TouchableOpacity, View } from "react-native";
import QRCode from "react-native-qrcode-svg";
import { scale, verticalScale } from "react-native-size-matters";

export default function HeadsUpModal({
  isHeadsUp,
  headsUpData,
  setIsOpenCamera,
  handleCancelRequest,
  isDisabled,
}) {
  return (
    <Modal visible={!!isHeadsUp} transparent animationType="fade">
      <View style={styles.overlay}>
        <View style={styles.card}>
          {headsUpData?.status === "sender" ? (
            <View style={styles.scannerContainer}>
              <Text
                style={[
                  globalStyle.normalFontSize,
                  globalFonts.poppins_600,
                  { textAlign: "center" },
                ]}
              >
                Scan QR to Start Date
              </Text>

              <TouchableOpacity
                style={styles.scannerBox}
                onPress={() => setIsOpenCamera(true)}
              >
                <Image source={imagePath.scanner} style={styles.scannerImage} />
              </TouchableOpacity>
            </View>
          ) : (
            <View style={styles.QrContainer}>
              <Text
                style={[
                  globalStyle.normalFontSize,
                  globalFonts.poppins_600,
                  {
                    textAlign: "center",
                    marginBottom: verticalScale(10),
                  },
                ]}
              >
                Date starts after your partner scans the QR
              </Text>

              {headsUpData?.data?.requestId ? (
                <QRCode
                  value={headsUpData.data.requestId}
                  size={100}
                  color="black"
                  backgroundColor="white"
                />
              ) : (
                <Text
                  style={{
                    textAlign: "center",
                    color: themeColors.darkCharcoal,
                  }}
                >
                  Waiting for request ID...
                </Text>
              )}
            </View>
          )}

          <Text
            style={[
              globalStyle.normalFontSize,
              globalFonts.poppins_600,
              {
                textAlign: "center",
                marginTop: verticalScale(5),
              },
            ]}
          >
            Heads Up! Before You Meet
          </Text>

          <View
            style={[
              globalStyle.grid,
              { justifyContent: "center", gap: scale(30) },
            ]}
          >
            <View style={styles.venueTimeBx}>
              <View style={styles.iconBx}>
                <Image source={imagePath.venue} />
              </View>
              <Text
                style={[
                  globalStyle.commonText,
                  globalFonts.poppins_600,
                  { textAlign: "center" },
                ]}
              >
                {headsUpData?.data?.venue}
              </Text>
            </View>

            <View style={styles.venueTimeBx}>
              <View style={styles.iconBx}>
                <Image source={imagePath.dateTime} />
              </View>
              <Text
                style={[
                  globalStyle.commonText,
                  globalFonts.poppins_600,
                  { textAlign: "center" },
                ]}
              >
                {headsUpData?.data?.time}
              </Text>
            </View>
          </View>

          {["datePerspective", "pageAbout"].map((key, idx) => (
            <View key={idx}>
              <Text
                style={[
                  globalStyle.commonText,
                  globalFonts.poppins_600,
                  {
                    marginTop: verticalScale(10),
                    marginBottom: verticalScale(5),
                  },
                ]}
              >
                {key === "datePerspective"
                  ? "Your Date’s Perspective"
                  : "🔁 You're Both On the Same Page About:"}
              </Text>

              {headsUpData?.data?.[key]?.map((str, i) => (
                <Text
                  key={i}
                  style={[
                    globalStyle.smallText,
                    globalFonts.poppins_500,
                    styles.listItem,
                  ]}
                >
                  {str}
                </Text>
              ))}
            </View>
          ))}

          <Text
            style={[
              globalStyle.commonText,
              globalFonts.poppins_600,
              {
                marginTop: verticalScale(10),
                marginBottom: verticalScale(5),
              },
            ]}
          >
            ✅ Pro Tip:
          </Text>

          <Text style={[globalStyle.smallText, globalFonts.poppins_500]}>
            If something’s awkward — say it with kindness, not silence.
          </Text>

          <TouchableOpacity
            onPress={() => handleCancelRequest("cancelRequest")}
            style={[
              globalStyle.commonBtn,
              globalStyle.MarginTop15,
              {
                backgroundColor: themeColors.secondaryVibrantPink,
                opacity: isDisabled ? 0.5 : 1,
              },
            ]}
            activeOpacity={isDisabled ? 1 : 0.7}
            pointerEvents={isDisabled ? "none" : "auto"}
          >
            <Text
              style={[
                globalStyle.commonText,
                globalFonts.poppins_700,
                { color: themeColors.white },
              ]}
            >
              Cancel Date Request
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}
