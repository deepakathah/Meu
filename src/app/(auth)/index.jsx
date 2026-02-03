import AnimateGif from "@/components/atoms/AnimateGif";
import ModelMessage from "@/components/molecules/ModelMessage";
import imagePath from "@/constant/imagePath";
import { phoneLengthByCountry } from "@/constant/phoneLengthByCountry";
import useTimeZone from "@/constant/timeZone";
import { NotificationContext } from "@/context/NotificationContext";
import { logout, sendOtpRequest, verifyOtpRequest } from "@/redux/slices/authSlice";
import globalFonts from "@/theme/fontFamily";
import globalStyle from "@/theme/globalStyle";
import themeColors from "@/theme/themeColors";
import { useFocusEffect, useRouter } from "expo-router";
import { useCallback, useContext, useEffect, useRef, useState } from "react";
import {
  Image,
  Keyboard,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";

import CountrySelect from "react-native-country-select";
import { OtpInput } from "react-native-otp-entry";
import { SafeAreaView } from "react-native-safe-area-context";
import { moderateScale, verticalScale } from "react-native-size-matters";

import { useDispatch, useSelector } from "react-redux";

const Login = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const { expoPushToken } = useContext(NotificationContext);

  const { loading, error, otpSent, otpVerified, action, user_id } = useSelector(
    (state) => state.auth
  );

  const [inputNum, setInputNum] = useState("");
  const [otp, setOTP] = useState("");
  const [isError, setIsError] = useState("");

  const btnPressed = useRef(false);

  // COUNTRY PICKER STATES
  const [showPicker, setShowPicker] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState(null);
  const [countryCode, setCountryCode] = useState("IN");
  const { userTimeZone } = useTimeZone();
  // --------------------------------------
  // DEFAULT SELECT INDIA 🇮🇳 +91
  // --------------------------------------
  useEffect(() => {
    setSelectedCountry({
      cca2: "IN",
      idd: {
        root: "+91",
      },
      flag: "🇮🇳",
    });
  }, []);

  useEffect(() => {
    if (error) setIsError(error);
  }, [error]);

  useFocusEffect(
    useCallback(() => {
      dispatch(logout());
      setInputNum("");
      setOTP("");
      setIsError("");
    }, [dispatch])
  );

  useEffect(() => {
    if (!otpVerified || !action || !user_id || !btnPressed.current) return;

    router.replace(action === "completed" ? "/(main)/" : "/(auth)/register");
  }, [otpVerified, action, user_id]);

  const handlePress = () => {
    if (!selectedCountry) {
      setIsError("Please select a country.");
      return;
    }
    if (!inputNum) {
      setIsError("Please enter a phone number.");
      return;
    }

    const callingCode = selectedCountry?.idd?.root;

    if (!otpSent) {
      dispatch(sendOtpRequest({ countryCode: `${callingCode}`, phone: inputNum, timeZone: userTimeZone }));
    }
    else {
      btnPressed.current = true;
      dispatch(
        verifyOtpRequest({
          countryCode: `${callingCode}`,
          phone: inputNum,
          otp,
          fcmToken: expoPushToken,
          timeZone: userTimeZone
        })
      );
    }
  };

  const handleMobileValidation = useCallback((val) => {
    const expected = phoneLengthByCountry[countryCode] || phoneLengthByCountry.DEFAULT;
    const value = val.replace(/\D/g, '');

    if (value.length <= expected.length) setInputNum(value);
    if (value.length === expected.length) Keyboard.dismiss();
  }, [countryCode]);


  const handleOtpChange = (val) => {
    if (val.length <= 6) setOTP(val);
    if (val.length === 6) Keyboard.dismiss();
  };

  const handleCountrySelect = (country) => {
    setCountryCode(country?.cca2 ?? "IN");
    setSelectedCountry(country);
    setShowPicker(false);
    setInputNum("")
  };

  return (
    <SafeAreaView style={styles.container}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={{ flex: 1 }}>
          <StatusBar barStyle="light-content" />

          {isError ? <ModelMessage message={isError} setIsError={setIsError} /> : null}

          {/* TOP LOGO SECTION */}
          <View style={[globalStyle.topSection, { height: verticalScale(200) }]}>
            <View style={globalStyle.logoWrapper}>
              <Image source={imagePath.logo} style={globalStyle.logo} />
            </View>
          </View>

          {/* CONTENT SECTION */}
          <View style={styles.middleSection}>
            <Text style={[globalStyle.heading, globalFonts.poppins_700]}>Welcome back</Text>
            <Text style={[globalStyle.description, globalFonts.poppins_500]}>
              Please Enter Your Details To Login
            </Text>

            {!otpSent ? (
              <View style={globalStyle.MarginTop40}>
                <Text style={[globalFonts.poppins_600, styles.label]}>
                  Enter Your Mobile Number
                </Text>

                {/* PHONE + COUNTRY CODE */}
                <View style={styles.phoneContainer}>
                  <TouchableOpacity onPress={() => setShowPicker(true)}>
                    {selectedCountry ? (
                      <Text style={{ fontSize: verticalScale(16) }}>
                        {selectedCountry.flag}  {selectedCountry?.idd?.root}
                      </Text>
                    ) : (
                      <Text>Select</Text>
                    )}
                  </TouchableOpacity>

                  <CountrySelect
                    visible={showPicker}
                    onClose={() => setShowPicker(false)}
                    onSelect={handleCountrySelect}
                  />

                  <TextInput
                    placeholder="9999999999"
                    keyboardType="phone-pad"
                    value={inputNum}
                    onChangeText={handleMobileValidation}
                    style={[globalStyle.inputField]}
                    placeholderTextColor="#616161"
                  />
                </View>
              </View>
            ) : (
              <View style={globalStyle.MarginTop40}>
                <Text style={[globalFonts.poppins_600, styles.label]}>Submit The OTP</Text>

                <OtpInput
                  numberOfDigits={6}
                  onTextChange={handleOtpChange}
                  theme={{
                    pinCodeContainerStyle: styles.otpInput,
                    pinCodeTextStyle: styles.textColor,
                  }}
                />
              </View>
            )}

            {/* BUTTON */}
            <TouchableOpacity
              style={[globalStyle.button, globalStyle.MarginTop30]}
              activeOpacity={0.9}
              onPress={handlePress}
            >
              {!loading ? (
                <Text style={[globalFonts.poppins_600, globalStyle.buttonText]}>
                  {otpSent ? "Verify OTP" : "Send OTP"}
                </Text>
              ) : (
                <AnimateGif width={30} height={30} />
              )}
            </TouchableOpacity>

            <View style={[globalStyle.flexCenter, globalStyle.MarginTop20]}>
              <TouchableOpacity onPress={() => router.push("/(auth)/register")}>
                <Text
                  style={[
                    globalStyle.commonText,
                    globalFonts.poppins_500,
                    { color: themeColors.warmYellow },
                  ]}
                >
                  New here?
                </Text>
              </TouchableOpacity>
              <Text
                style={[
                  globalStyle.commonText,
                  globalFonts.poppins_500,
                  { color: themeColors.white },
                ]}
              >
                {" "}Create an account to get started!
              </Text>
            </View>
          </View>
        </View>
      </TouchableWithoutFeedback>
    </SafeAreaView>
  );
};

export default Login;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: themeColors.primaryRichPurple,
    padding: moderateScale(20),
  },

  middleSection: {
    flex: 1,
    paddingHorizontal: moderateScale(10),
    marginTop: verticalScale(30),
  },

  label: {
    color: themeColors.white,
    fontSize: verticalScale(16),
    marginBottom: 5,
  },

  phoneContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: themeColors.white,
    borderRadius: 10,
    paddingHorizontal: 10,
    height: 50,
    gap: 10,
  },

  numberInput: {
    flex: 1,
    fontSize: 16,
    color: themeColors.primaryRichPurple,
  },

  otpInput: {
    width: 45,
    height: 45,
  },

  textColor: {
    color: themeColors.white,
    fontSize: 20,
  },
});
