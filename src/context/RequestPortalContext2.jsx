
import ScanQr from "@/components/molecules/ScanQr";
import getApiUrl from "@/constant/apiUrl";
import imagePath from '@/constant/imagePath';
import globalFonts from "@/theme/fontFamily";
import globalStyle from "@/theme/globalStyle";
import themeColors from "@/theme/themeColors";
import Slider from "@react-native-community/slider";
import React, { createContext, useCallback, useContext, useEffect, useState } from "react";
import { Alert, Dimensions, Image, Modal, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import QRCode from "react-native-qrcode-svg";
import { scale, verticalScale } from "react-native-size-matters";
import { useSelector } from "react-redux";
const RequestPortalContext = createContext();
const { width } = Dimensions.get("window");

const ratingEmojis = {
  1: { label: "Worst", active: "WorstActive", inactive: "WorstInActive" },
  2: { label: "Not Good", active: "NotGoodActive", inactive: "NotGoodInActive" },
  3: { label: "Fine", active: "FineActive", inactive: "FineInActive" },
  4: { label: "Good", active: "GoodActive", inactive: "GoodInActive" },
  5: { label: "Very Good", active: "VeryGoodActive", inactive: "VeryGoodInActive" },
};

const feedbackPoints = [
  "Behaviour",
  "Communication",
  "Punctuality",
  "OverallExperience",
];


export function RequestPortalProvider({ children }) {
  const { user_id, user, token } = useSelector(state => state.auth);
  const [apiStartTime, setApiStartTime] = useState(null)
  const [portalData, setPortalData] = useState(null);
  const [portalSocket, setPortalSocket] = useState(null);
  const [socketData, setSocketData] = useState({});

  const [isOpenCamera, setIsOpenCamera] = useState(false);
  const [isHeadsUp, setIsHeadsUp] = useState(false);
  const [headsUpData, setHeadsUpData] = useState(null)
  const [isEndDate, setIsEndDate] = useState(false);
  const [cancelDate, setCancelDate] = useState(false);
  const [canceledDate, setCanceledDate] = useState(false);
  const [confirmCheckIn, setConfirmCheckIn] = useState(false);
  const [commonPopVisible, setCommonPopVisible] = useState(false);
  const [feedbackModal, setFeedbackModal] = useState(false);

  const [timer, setTimer] = useState(0);

  const [feedbacks, setFeedbacks] = useState({
    emoji: "Fine",
    categories: {
      Behaviour: 3,
      Communication: 3,
      Punctuality: 3,
      OverallExperience: 3,
    },
    flag: 3,
    query: "",
  });


  const [isDisabled, setIsDisabled] = useState(false);

  const hidePortal = useCallback(() => setPortalData(null), []);

  const capitalize = useCallback(str => str ? str.split(" ").map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(" ") : "", []);

  const getSocketData = useCallback((data) => {
    setSocketData(data);
  }, []);

  const getSocket = useCallback((socket) => {
    setPortalSocket(socket);
  }, []);

  useEffect(() => {
    if (!socketData?.action) return;
    console.log("Getting through :: ", socketData)

    switch (socketData.action) {
      case "updateRequestStatus":
        setPortalData(socketData.data);
        break;

      case "startDate":
        setPortalData(null);
        setIsHeadsUp(true);
        setHeadsUpData(socketData)
        break;

      case "endDate":
        setIsHeadsUp(false)
        setIsDisabled(false)
        setIsEndDate(true);
        setApiStartTime(socketData?.data["startTime"])
        break;

      case "CompleteDate":
        setIsEndDate(false);
        setFeedbackModal(true)
        break;

      case "cancelDate":
        setCancelDate(true)
        break;

      case "dateCanceled":
        setIsHeadsUp(false);
        setIsDisabled(false)
        setCancelDate(false)
        setCanceledDate(true)
        break;

      case "confirmCheckIn":
        setConfirmCheckIn(true);
        break;

      case "popupShow":
        setCommonPopVisible(true);
        break;
    }

  }, [socketData]);


  /* ---------------- SEND FEEDBACK ---------------- */
  const handleFeedback = useCallback(async () => {
    try {
      const apiURL = getApiUrl();

      const response = await fetch(`${apiURL}/setDateFeedback`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ ...feedbacks, dateRequestId: socketData?.data?._id }),
      });

      if (!response.ok) {
        throw new Error(`Request failed with status ${response.status}`);
      }

      const obj = await response.json();
      if (!obj.status) {
        console.log(obj.message);
        return
      }
      setFeedbackModal(false)

    }
    catch (error) {
      console.error("Error submitting feedback:", error);
    }
  }, [feedbacks, token, getApiUrl]);


  const sendRequestStatus = useCallback((status) => {
    if (!portalSocket || !portalData?._id || !user_id) return;
    const payload = { action: socketData.action, userId: user_id, requestId: portalData._id, status };
    try {
      portalSocket.send(JSON.stringify(payload));
      if (status === "rejected") Alert.alert(`Request ${status}`);
      hidePortal();
    } catch (err) {
      console.error("WebSocket send error:", err);
    }
  }, [portalSocket, portalData, socketData, user_id, hidePortal]);


  const rejectRequest = () => sendRequestStatus("rejected");
  const acceptRequest = () => sendRequestStatus("accepted");


  const sendMessageToSocket = useCallback(payload => {
    portalSocket?.send(JSON.stringify(payload));
    console.log("Sent via socket:", JSON.stringify(payload));
  }, [portalSocket]);


  const endDateFn = useCallback(type => {
    sendMessageToSocket({ ...socketData, userMessage: type })
  }, [socketData])

  const handleCancelRequest = useCallback((request) => {
    const payload = { ...socketData, userId: user_id, status: request }
    portalSocket.send(JSON.stringify(payload));
    setIsDisabled(true)

  }, [portalSocket, user_id, socketData])

  // Timer for End Date
  useEffect(() => {
    let interval;

    if (isEndDate && apiStartTime) {
      const startTimestamp = new Date(apiStartTime).getTime();

      // Convert current UTC time to IST
      const istOffsetInMilliseconds = 5.5 * 60 * 60 * 1000;
      const getISTNow = () => Date.now() + istOffsetInMilliseconds;

      const updateTimer = () => {
        const nowIST = getISTNow();
        const elapsedSeconds = Math.max(0, Math.floor((nowIST - startTimestamp) / 1000));
        setTimer(elapsedSeconds);
      };

      updateTimer();

      interval = setInterval(updateTimer, 1000);
    } else {
      setTimer(0);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isEndDate, apiStartTime]);

  const handleConfirmCheckIn = useCallback((value) => {
    const payload = { ...socketData, answer: value }
    portalSocket.send(JSON.stringify(payload));
    console.log(JSON.stringify(payload))
    setConfirmCheckIn(false)
  })

  /** -------------------- MODAL COMPONENTS -------------------- **/
  return (
    <RequestPortalContext.Provider value={{ getSocketData, getSocket, portalSocket, socketData }}>
      {children}

      {/* ////////// Date Request PopUp ////////////////// */}
      <Modal visible={!!portalData} transparent animationType="fade">
        <View style={styles.overlay}>
          <View style={styles.card}>
            <TouchableOpacity style={styles.closeBtn} onPress={hidePortal}>
              <Image source={imagePath.close} style={styles.closeIcon} />
            </TouchableOpacity>
            <Text style={[globalStyle.headingSmall, globalFonts.poppins_600]}>Date Request</Text>

            <View style={[globalStyle.grid, styles.profileBx]}>
              <View style={styles.profileBox}>
                <Image
                  source={{ uri: user?.selfie && user?.baseUrl ? `${user.baseUrl}${user.selfie}` : "https://i.pravatar.cc/150?img=4" }}
                  style={styles.profileImage}
                />
              </View>
              <View>
                <Text style={[globalStyle.headingSmall, globalFonts.poppins_600]}>
                  {capitalize(user?.name || "Guest")}, {user?.age || 18}
                </Text>
                <Text style={[globalStyle.commonText, globalFonts.poppins_500]}>
                  {capitalize(user?.profession || "Developer")} | {capitalize(user?.characteristic || "Coder")}
                </Text>
              </View>
            </View>

            <Text style={[styles.requestMessage, globalFonts.poppins_500]}>
              {portalData?.body || "Lorem Ipsum is simply dummy text of the printing and typesetting industry."}
            </Text>

            <View style={styles.btnContainer}>
              <TouchableOpacity onPress={rejectRequest} style={[globalStyle.commonBtn, { backgroundColor: themeColors.darkCharcoal, width: "48%" }]}>
                <Text style={[globalStyle.btnTextCommon, globalFonts.poppins_700, { color: themeColors.white }]}>Reject</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={acceptRequest} style={[globalStyle.commonBtn, { backgroundColor: themeColors.secondaryVibrantPink, width: "48%" }]}>
                <Text style={[globalStyle.btnTextCommon, globalFonts.poppins_700, { color: themeColors.white }]}>Accept</Text>
              </TouchableOpacity>
            </View>

          </View>
        </View>
      </Modal>


      {/* ////////// Scan QR to Start Date ////////////////// */}
      <Modal visible={!!isHeadsUp} transparent animationType="fade">
        <View style={styles.overlay}>
          <View style={styles.card}>
            {headsUpData?.status === "sender" ? (
              <View style={styles.scannerContainer}>
                <Text style={[globalStyle.normalFontSize, globalFonts.poppins_600, { textAlign: "center" }]}>
                  Scan QR to Start Date
                </Text>
                <TouchableOpacity style={styles.scannerBox} onPress={() => setIsOpenCamera(true)}>
                  <Image source={imagePath.scanner} style={styles.scannerImage} />
                </TouchableOpacity>
              </View>
            ) : (
              <View style={styles.QrContainer}>
                <Text style={[globalStyle.normalFontSize, globalFonts.poppins_600, { textAlign: "center", marginBottom: verticalScale(10) }]}>
                  Date starts after your partner scans the QR
                </Text>
                {/* <QRCode value={socketData?.data?.requestId || ""} size={100} color="black" backgroundColor="white" /> */}
                {headsUpData?.data?.requestId ? (
                  <QRCode
                    value={headsUpData.data.requestId}
                    size={100}
                    color="black"
                    backgroundColor="white"
                  />
                ) : (
                  <Text style={{ textAlign: "center", color: themeColors.darkCharcoal }}>
                    Waiting for request ID...
                  </Text>
                )}
              </View>
            )}

            <Text style={[globalStyle.normalFontSize, globalFonts.poppins_600, { textAlign: "center", marginTop: verticalScale(5) }]}>
              Heads Up! Before You Meet
            </Text>

            <View style={[globalStyle.grid, { justifyContent: "center", gap: scale(30) }]}>
              <View style={styles.venueTimeBx}>
                <View style={styles.iconBx}><Image source={imagePath.venue} /></View>
                <Text style={[globalStyle.commonText, globalFonts.poppins_600, {
                  textAlign: "center"
                }]}>{headsUpData?.data?.venue}</Text>
              </View>
              <View style={styles.venueTimeBx}>
                <View style={styles.iconBx}><Image source={imagePath.dateTime} /></View>
                <Text style={[globalStyle.commonText, globalFonts.poppins_600, {
                  textAlign: "center"
                }]}>{headsUpData?.data?.time}</Text>
              </View>

            </View>

            {["datePerspective", "pageAbout"].map((key, idx) => (
              <View key={idx}>
                <Text style={[globalStyle.commonText, globalFonts.poppins_600, { marginTop: verticalScale(10), marginBottom: verticalScale(5) }]}>
                  {key === "datePerspective" ? "Your Date’s Perspective" : "🔁 You're Both On the Same Page About:"}
                </Text>
                {headsUpData?.data?.[key]?.map((str, i) => (
                  <Text key={i} style={[globalStyle.smallText, globalFonts.poppins_500, styles.listItem]}>{str}</Text>
                ))}
              </View>
            ))}

            <Text style={[globalStyle.commonText, globalFonts.poppins_600, { marginTop: verticalScale(10), marginBottom: verticalScale(5) }]}>✅ Pro Tip:</Text>
            <Text style={[globalStyle.smallText, globalFonts.poppins_500]}>If something’s awkward — say it with kindness, not silence.</Text>

            <TouchableOpacity onPress={() => handleCancelRequest("cancelRequest")} style={[
              globalStyle.commonBtn,
              globalStyle.MarginTop15, {
                backgroundColor: themeColors.secondaryVibrantPink,
                opacity: isDisabled ? 0.5 : 1,
              }]}
              activeOpacity={isDisabled ? 1 : 0.7}
              pointerEvents={isDisabled ? "none" : "auto"}
            >
              <Text style={[globalStyle.commonText, globalFonts.poppins_700, { color: themeColors.white }]}>Cancel Date Request</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>


      {/* ////////// Scanner Popup ////////////////// */}
      <Modal visible={!!isOpenCamera} transparent animationType="fade">
        <View style={styles.overlay}>
          <ScanQr
            setIsOpenCamera={setIsOpenCamera}
            sendMessageToSocket={sendMessageToSocket}
            socketData={socketData}
          />
        </View>
      </Modal>


      {/* ////////// Date Started Popup ////////////////// */}
      <Modal visible={!!isEndDate} transparent animationType="fade">
        <View style={styles.overlay}>
          <View style={[styles.card, { alignItems: "center" }]}>
            {/* <TouchableOpacity style={styles.closeBtn} onPress={() => setIsEndDate(false)}>
                            <Image source={imagePath.close} style={styles.closeIcon} />
                        </TouchableOpacity> */}

            <Text style={[globalStyle.headingSmall, globalFonts.poppins_600, { textAlign: "center", marginBottom: verticalScale(10) }]}>Date Started</Text>

            <Text style={[globalStyle.largeText, globalFonts.poppins_700, { fontSize: scale(30), color: themeColors.darkCharcoal }]}>
              {`${String(Math.floor(timer / 60)).padStart(2, "0")}:${String(timer % 60).padStart(2, "0")}`}
            </Text>

            <Text style={[globalStyle.smallText, globalFonts.poppins_500, { textAlign: "center", marginTop: verticalScale(5), color: themeColors.darkGray }]}>
              Safety Tip: Let a friend know your plans
            </Text>

            <View style={{ marginTop: verticalScale(20), width: "100%", alignItems: "center" }}>
              {["I'm going home alone", "He / She dropping me", "End the Date"].map((label, idx) => (
                <TouchableOpacity
                  key={idx}
                  style={[styles.optionButton, { backgroundColor: idx === 2 ? themeColors.secondaryVibrantPink : "#fff" }]}
                  onPress={() => endDateFn(label)}
                >
                  <Text style={[globalStyle.commonText, globalFonts.poppins_600, { color: idx === 2 ? themeColors.white : themeColors.darkCharcoal }]}>
                    {label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </View>
      </Modal>


      {/* ////////// Cancel Date Request Popup ////////////////// */}
      {socketData.status === "receiver" &&
        <Modal visible={!!cancelDate} transparent animationType="fade">
          <View style={[styles.overlay, globalStyle.bgLayer]}>
            <View style={styles.card}>
              <TouchableOpacity style={styles.closeBtn} onPress={hidePortal}>
                <Image source={imagePath.close} style={styles.closeIcon} />
              </TouchableOpacity>
              <Text style={[globalStyle.headingSmall, globalFonts.poppins_600]}>
                Cancel Date Request
              </Text>

              <Text style={[styles.requestMessage, globalFonts.poppins_500]}>
                {socketData?.message || "Lorem Ipsum is simply dummy text of the printing and typesetting industry."}
              </Text>
              <View style={styles.btnContainer}>
                <TouchableOpacity onPress={() => handleCancelRequest("reject")} style={[globalStyle.commonBtn, { backgroundColor: themeColors.darkCharcoal, width: "48%" }]}>
                  <Text style={[globalStyle.btnTextCommon, globalFonts.poppins_700, { color: themeColors.white }]}>Reject</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => handleCancelRequest("confirm")} style={[globalStyle.commonBtn, { backgroundColor: themeColors.secondaryVibrantPink, width: "48%" }]}>
                  <Text style={[globalStyle.btnTextCommon, globalFonts.poppins_700, { color: themeColors.white }]}>Confirm</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      }

      {/* ////////// Date Canceled Popup ////////////////// */}
      <Modal visible={!!canceledDate} transparent animationType="fade">
        <View style={[styles.overlay, globalStyle.bgLayer]}>
          <View style={styles.card}>
            <TouchableOpacity style={styles.closeBtn} onPress={() => setCanceledDate(false)}>
              <Image source={imagePath.close} style={styles.closeIcon} />
            </TouchableOpacity>
            <Text style={[globalStyle.headingSmall, globalFonts.poppins_600]}>
              Date Canceled!
            </Text>
            {socketData?.status === "receiver" ?
              <Text style={[styles.requestMessage, globalFonts.poppins_500]}>
                {socketData.message}
              </Text> :
              <Text style={[styles.requestMessage, globalFonts.poppins_500]}>
                {socketData.message}
              </Text>
            }
          </View>
        </View>
      </Modal>


      {/* ////////// Confirm Checked In Popup ////////////////// */}
      <Modal visible={!!confirmCheckIn} transparent animationType="fade">
        <View style={[styles.overlay, globalStyle.bgLayer]}>
          <View style={[styles.card, { alignItems: "center" }]}>
            <TouchableOpacity style={styles.closeBtn} onPress={() => setConfirmCheckIn(false)}>
              <Image source={imagePath.close} style={styles.closeIcon} />
            </TouchableOpacity>

            <Text style={[globalStyle.headingSmall, globalFonts.poppins_600,
            {
              textAlign: "center"

            }]}>
              {socketData?.header}
            </Text>

            <Text style={[globalStyle.normalFontSize, globalFonts.poppins_500, {
              textAlign: "center",
              marginBottom: verticalScale(10),
              color: themeColors.darkGray
            }]}>
              {socketData?.content}
            </Text>

            <View style={styles.btnGrid}>
              <TouchableOpacity
                style={[globalStyle.commonBtn, {
                  paddingHorizontal: scale(30),
                  backgroundColor: themeColors.darkCharcoal
                }]}
                onPress={() => handleConfirmCheckIn("yes")}
              >
                <Text style={[globalStyle.commonText, globalFonts.poppins_600, {
                  color: themeColors.white
                }]}>
                  Yes
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[globalStyle.commonBtn, {
                  paddingHorizontal: scale(30),
                  backgroundColor: themeColors.secondaryVibrantPink
                }]}
                onPress={() => handleConfirmCheckIn("no")}
              >
                <Text style={[globalStyle.commonText, globalFonts.poppins_600, {
                  color: themeColors.white
                }]}>
                  No
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* ////////// Common Popup ////////////////// */}
      <Modal visible={!!commonPopVisible} transparent animationType="fade">
        <View style={[styles.overlay, globalStyle.bgLayer]}>
          <View style={[styles.card, { alignItems: "center" }]}>
            <TouchableOpacity style={styles.closeBtn} onPress={() => setCommonPopVisible(false)}>
              <Image source={imagePath.close} style={styles.closeIcon} />
            </TouchableOpacity>

            <Text style={[globalStyle.headingSmall, globalFonts.poppins_600,
            {
              textAlign: "center"

            }]}>
              {socketData?.title}
            </Text>

            <Text style={[globalStyle.normalFontSize, globalFonts.poppins_500, {
              textAlign: "center",
              marginBottom: verticalScale(10),
              color: themeColors.darkGray
            }]}>
              {socketData?.message}
            </Text>

          </View>
        </View>
      </Modal>

      {/* ---------- FEEDBACK POPUP ---------- */}
      <Modal transparent visible={!!feedbackModal}>
        <View style={[styles.overlay, globalStyle.bgLayer]}>
          <View style={styles.feedbackCard}>
            <Text style={[globalStyle.headingMedium, globalFonts.poppins_700, { color: themeColors.warmYellow }]}>Feedback</Text>
            <Text style={[globalStyle.commonText, globalFonts.poppins_500, {
              textAlign: "center",
              paddingHorizontal: 30,
              marginTop: -5
            }]}>
              Provide your valuable feedback, and tell us How it went ?
            </Text>

            <View style={[styles.emojiContainer, globalStyle.MarginTop15]}>
              <Text style={[globalStyle.normalFontSize, globalFonts.poppins_600]}>Select your rating</Text>
              <View style={styles.emojiBx}>
                {Object.entries(ratingEmojis).map(([key, item]) => {
                  const value = Number(key);
                  const isActive = feedbacks.emoji === item.label;

                  return (
                    <TouchableOpacity
                      key={key}
                      onPress={() =>
                        setFeedbacks(prev => ({ ...prev, emoji: item.label }))
                      }
                      activeOpacity={0.9}
                      style={styles.emojiItem}
                    >
                      <Image
                        source={imagePath[isActive ? item.active : item.inactive]}
                        style={styles.emoji}
                      />
                      <Text
                        style={[
                          globalStyle.commonText,
                          globalFonts.poppins_500,
                          { color: isActive ? themeColors.warmYellow : "#858585" },
                        ]}
                      >
                        {item.label}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>

            </View>

            <View style={[styles.ratingContainer, globalStyle.MarginTop15]}>
              <Text style={[globalStyle.normalFontSize, globalFonts.poppins_600]}>Select your experience</Text>
              {feedbackPoints.map(item => (
                <View key={item} style={styles.feedbackRow}>
                  <Text style={[globalStyle.commonText, globalFonts.poppins_500]}>
                    {item.replace(/([A-Z])/g, " $1")}
                  </Text>

                  <View style={styles.sliderRow}>
                    {[1, 2, 3, 4, 5].map(val => (
                      <TouchableOpacity
                        key={val}
                        activeOpacity={0.9}
                        onPress={() =>
                          setFeedbacks(prev => ({
                            ...prev,
                            categories: {
                              ...prev.categories,
                              [item]: val,
                            },
                          }))
                        }
                        style={[
                          styles.dot,
                          {
                            backgroundColor:
                              val <= feedbacks.categories[item]
                                ? themeColors.warmYellow
                                : "#ddd",
                          },
                        ]}
                      />
                    ))}
                  </View>
                </View>
              ))}

            </View>

            <View style={[styles.ratingContainer, globalStyle.MarginTop15]}>
              <Text style={[globalStyle.normalFontSize, globalFonts.poppins_600]}>Select your flag</Text>
              <View style={[styles.flagGrid, globalStyle.MarginTop10]}>
                <View style={[styles.itemGrid]}>
                  <Image style={styles.flagItemImage} source={imagePath.redflag} />
                  <Image style={styles.flagItemImage} source={imagePath.redflag} />
                </View>

                <View style={[styles.itemGrid]}>
                  <Image style={styles.flagItemImage} source={imagePath.redflag} />
                </View>

                <View style={[styles.itemGrid]}>
                  <Image style={styles.flagItemImage} source={imagePath.grayflag} />
                </View>

                <View style={[styles.itemGrid]}>
                  <Image style={styles.flagItemImage} source={imagePath.greenflag} />
                </View>

                <View style={[styles.itemGrid]}>
                  <Image style={styles.flagItemImage} source={imagePath.greenflag} />
                  <Image style={styles.flagItemImage} source={imagePath.greenflag} />
                </View>

                <View style={[styles.itemGrid]}>
                  <Image style={styles.flagItemImage} source={imagePath.treeflag} />
                </View>
              </View>

              <View style={styles.flagGrid}>
                <Slider style={{
                  width: "100%",
                  borderRadius: 10,
                  height: verticalScale(4),
                  backgroundColor: themeColors.warmYellow,
                  marginTop: 20,
                }}
                  minimumValue={1}
                  maximumValue={6}
                  step={1}
                  value={feedbacks.flag}
                  onValueChange={val =>
                    setFeedbacks(prev => ({ ...prev, flag: val }))
                  }
                  minimumTrackTintColor={themeColors.warmYellow}
                  maximumTrackTintColor="#E6D8B8"
                  thumbImage={imagePath.sliderThump} />
              </View>
            </View>

            <View style={[styles.ratingContainer, globalStyle.MarginTop15]}>
              <Text style={[globalStyle.normalFontSize, globalFonts.poppins_600]}>Type your experience</Text>
              <TextInput
                placeholder="Tell us what went well?"
                value={feedbacks.query}
                onChangeText={text =>
                  setFeedbacks(prev => ({ ...prev, query: text }))
                }
                multiline
                numberOfLines={4}
                textAlignVertical="top"
                style={styles.input}
              />
            </View>

            <TouchableOpacity
              style={[[globalStyle.button, globalStyle.MarginTop20]]}
              onPress={handleFeedback}
            >
              <Text style={[globalFonts.poppins_600, globalStyle.buttonText]}>Submit</Text>
            </TouchableOpacity>

          </View>
        </View>
      </Modal>

    </RequestPortalContext.Provider>
  );
}

export const useRequestPortal = () => useContext(RequestPortalContext);

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: themeColors.white,
  },

  card: {
    position: "relative",
    backgroundColor: themeColors.lightPink,
    padding: scale(15),
    borderRadius: scale(10),
    width: width * 0.9,
    shadowColor: "#000000bb",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 1,
    elevation: 5
  },

  closeBtn: {
    position: "absolute",
    top: scale(5),
    right: scale(5),
    width: scale(20),
    height: scale(20),
    borderRadius: scale(20),
    backgroundColor: themeColors.darkCharcoal,
    justifyContent: "center",
    alignItems: "center"
  },

  closeIcon: {
    width: scale(15),
    height: scale(15),
    resizeMode: "contain"
  },

  profileBx: {
    justifyContent: "flex-start",
    gap: scale(15),
    marginBottom: verticalScale(10),
    paddingBottom: verticalScale(10),
    borderBottomWidth: 1,
    borderBottomColor: themeColors.lightGray
  },

  profileBox: {
    width: scale(80),
    height: scale(80),
    borderRadius: scale(40),
    backgroundColor: themeColors.warmYellow,
    justifyContent: "center",
    alignItems: "center"
  },

  requestMessage: {
    marginBottom: verticalScale(20)
  },

  btnContainer: {
    flexDirection: "row",
    justifyContent: "flex-start",
    gap: scale(15)
  },

  scannerContainer: {
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center"
  },

  scannerBox: {
    marginTop: verticalScale(10),
    alignSelf: "center",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    width: scale(90),
    height: scale(90),
    borderRadius: scale(20),
    borderColor: themeColors.darkCharcoal,
    borderWidth: 2,
    marginBottom: 15
  },

  QrContainer: {
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: verticalScale(10)
  },

  venueTimeBx: {
    width: "30%",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: verticalScale(10)
  },

  iconBx: {
    alignSelf: "center",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    width: scale(60),
    height: scale(60),
    borderRadius: scale(15),
    borderColor: themeColors.lightGray,
    borderWidth: 2,
    marginBottom: verticalScale(5)
  },

  listItem: {
    backgroundColor: "#f1ace5ff",
    color: themeColors.white,
    alignSelf: "flex-start",
    paddingHorizontal: scale(10),
    paddingVertical: verticalScale(2),
    borderRadius: 30,
    marginBottom: verticalScale(5)
  },

  optionButton: {
    width: "90%",
    paddingVertical: verticalScale(10),
    borderRadius: scale(25),
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: themeColors.lightGray,
    marginBottom: verticalScale(10),
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 1,
    elevation: 2
  },

  btnGrid: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: scale(15)
  },

  feedbackCard: {
    width: "90%",
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 20,
    alignItems: "center",
  },

  emojiContainer: {
    width: "100%",
  },

  emojiBx: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: scale(5)
  },

  emoji: {
    width: scale(30),
    height: scale(30),
    alignSelf: "center"
  },

  ratingContainer: {
    width: "100%",
  },

  sliderRow: {
    flexDirection: "row",
    marginVertical: 5,
  },

  flagGrid: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: scale(5)
  },

  itemGrid: {
    flexDirection: "column",
    gap: scale(2)
  },

  flagItemImage: {
    width: scale(20),
    height: scale(20),
  },

  dot: {
    width: 14,
    height: 14,
    borderRadius: 7,
    marginHorizontal: 6,
  },

  feedbackRow: {
    width: "100%",
    marginBottom: verticalScale(2),
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: scale(5)
  },

  input: {
    width: "100%",
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: scale(10),
    paddingHorizontal: scale(10),
    paddingVertical: scale(10),
    marginTop: scale(5),
    minHeight: verticalScale(60),
  },

});

