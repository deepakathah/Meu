
// import getApiUrl from "@/constant/apiUrl";
// import TimeZone from "@/constant/timeZone";
// import { logout } from "@/redux/slices/authSlice";
// import globalFonts from "@/theme/fontFamily";
// import globalStyle from "@/theme/globalStyle";
// import themeColors from "@/theme/themeColors";
// import { AntDesign, FontAwesome, MaterialIcons } from "@expo/vector-icons";
// import { LinearGradient } from "expo-linear-gradient";
// import * as Linking from 'expo-linking';
// import { useFocusEffect, useRouter } from "expo-router";
// import React, { useCallback, useEffect, useRef, useState } from "react";
// import {
//   Dimensions,
//   Image,
//   ScrollView,
//   StatusBar,
//   StyleSheet,
//   Text,
//   TouchableOpacity,
//   View
// } from "react-native";
// import { moderateScale, scale, verticalScale } from "react-native-size-matters";
// import { useDispatch, useSelector } from "react-redux";

// const { width, height } = Dimensions.get("window");

// const Profile = () => {
//   const [activeIndex, setActiveIndex] = useState(null);
//   const { user, token } = useSelector((state) => state.auth);
//   const abortController = useRef(null);
//   const { userTimeZone } = TimeZone();
//   const book = user?.bookOfLife ?? {};
//   const { Personality, ...bookWithoutPersonality } = book;
//   const [hotspotCheckIn, setHotspotCheckIn] = useState(null);
//   const [scheduleCheckIn, setScheduleCheckIn] = useState(null);

//   useFocusEffect(
//     useCallback(() => {
//       const getCheckInDetials = async () => {
//         const apiURL = getApiUrl();
//         abortController.current = new AbortController();

//         try {
//           const response = await fetch(`${apiURL}/getUserCheckInDetails`, {
//             method: "POST",
//             headers: {
//               "Content-Type": "application/json",
//               Authorization: `Bearer ${token}`,
//             },
//             signal: abortController.current.signal,
//             body: JSON.stringify({ timeZone: userTimeZone }),
//           });

//           const obj = await response.json();

//           if (!obj.status) {
//             console.log(obj.message);
//             return;
//           }

//           const { hotspotCheckIn, scheduleCheckIn } = obj.checkInData || {};
//           if (hotspotCheckIn) {
//             setHotspotCheckIn(hotspotCheckIn);
//           }

//           if (scheduleCheckIn) {
//             setScheduleCheckIn(scheduleCheckIn);
//           }

//         } catch (err) {
//           if (err.name !== "AbortError") {
//             console.log("Error message :: ", err.message);
//           }
//         }
//       };

//       getCheckInDetials();

//       return () => abortController.current?.abort();
//     }, [userTimeZone, token])
//   );


//   useEffect(()=>{
//     console.log(user)
//   },[user])

//   const router = useRouter();
//   const dispatch = useDispatch();

//   const handleLogout = () => {
//     dispatch(logout());
//     router.replace("(initial)");
//   };


//   const handleDeleteRequest = () => {
//     Linking.openURL('https://theroundrectangle.com/MeuDatingApp/');
//   };


//   const toggleSection = (index) => {
//     setActiveIndex((prev) => (prev === index ? null : index));
//   };


//   const capitalize = useCallback((str) => {
//     if (!str) return "";
//     return str
//       .split(" ")
//       .map((item) => item.charAt(0).toUpperCase() + item.slice(1))
//       .join(" ");
//   }, []);


//   return (
//     <LinearGradient
//       style={styles.GradientBox}
//       // colors={[themeColors.secondaryVibrantPink, themeColors.primaryRichPurple]}
//       colors={[themeColors.darkCharcoal, themeColors.darkCharcoal]}
//       start={{ x: 0, y: 0 }}
//       end={{ x: 1, y: 0 }}
//     >

//       <StatusBar barStyle={"default"} />

//       <View style={styles.profileHeader}>
//         {/* <Text style={[globalStyle.headingTitle, globalFonts.poppins_700, { color: themeColors.white, textAlign: "center" }]}>
//           Profile
//         </Text> */}
//       </View>

//       {/* White rounded panel that holds the scrollable content */}
//       <View style={styles.whitePanel}>
//         <View style={[styles.profileBx]}>
//           <View style={styles.profileBox}>
//             <Image
//               source={{
//                 uri:
//                   user?.selfie && user?.baseUrl
//                     ? `${user.baseUrl}${user.selfie}`
//                     : "https://i.pravatar.cc/150?img=4",
//               }}
//               style={styles.profileImage}
//             />
//           </View>

//           <View style={{ flexDirection: "column", justifyContent: "center", alignItems: "center", }}>
//             <Text style={[globalStyle.headingMedium, globalFonts.poppins_600]}>
//               {capitalize(user?.name)}, {user?.age || 18}
//             </Text>
//             <Text style={[globalStyle.normalFontSize, globalFonts.poppins_500]}>
//               {capitalize(user?.profession)} | {capitalize(user?.characteristic)}
//             </Text>
//           </View>
//         </View>
//         <ScrollView
//           style={styles.scroll}
//           contentContainerStyle={styles.scrollContent}
//           showsVerticalScrollIndicator={false}
//           keyboardShouldPersistTaps="handled"
//         >

//           {hotspotCheckIn && (
//             <View style={styles.headerDescription}>
//               <Text style={[globalStyle.headingSmall, globalFonts.poppins_600]}>
//                 Hotspot Checked In
//               </Text>
//               <Text style={[globalStyle.commonText, globalFonts.poppins_500, { color: "#797979ff" }]}>
//                 {hotspotCheckIn.area} • {hotspotCheckIn.shop}
//               </Text>
//             </View>
//           )}

//           {scheduleCheckIn && (
//             <View style={styles.headerDescription}>
//               <Text style={[globalStyle.headingSmall, globalFonts.poppins_600]}>
//                 Scheduled Check In
//               </Text>
//               <Text style={[globalStyle.commonText, globalFonts.poppins_500, { color: "#797979ff" }]}>
//                 {scheduleCheckIn.area} • {scheduleCheckIn.shop}
//               </Text>
//             </View>
//           )}


//           <View style={styles.headerDescription}>
//             <Text style={[globalStyle.headingSmall, globalFonts.poppins_600]}>
//               Personality
//             </Text>
//             <Text style={[
//               globalStyle.commonText,
//               globalFonts.poppins_500, {
//                 color: "#797979ff",
//               }
//             ]}>
//               {Personality ?? ''}
//             </Text>
//           </View>

//           {Object.entries(bookWithoutPersonality ?? {})?.map(([title, content], index) => {
//             const isActive = activeIndex === index;
//             return (
//               <View key={title} style={styles.accordionBx}>
//                 <TouchableOpacity
//                   style={[styles.header]}
//                   onPress={() => toggleSection(index)}
//                   activeOpacity={0.9}
//                 >
//                   <Text style={[styles.title, globalStyle.commonHeading, globalFonts.poppins_600]}>
//                     {title}
//                   </Text>
//                   <FontAwesome name={isActive ? "angle-up" : "angle-down"} size={24} color="#333" />
//                 </TouchableOpacity>

//                 {isActive && (
//                   <View style={styles.contentWrap}>
//                     <Text style={[styles.content, globalStyle.smallText, globalFonts.poppins_500]}>
//                       {content}
//                     </Text>
//                   </View>
//                 )}
//               </View>
//             );
//           })}

//           <View style={styles.accordionBx}>
//             <TouchableOpacity style={[styles.header]} onPress={() => console.log("Edit profile")} activeOpacity={0.9}>
//               <Text style={[styles.title, globalStyle.commonHeading, globalFonts.poppins_600]}>Edit Profile</Text>
//               <AntDesign name="profile" size={20} color="#333" />
//             </TouchableOpacity>
//           </View>

//           <View style={styles.accordionBx}>
//             <TouchableOpacity style={[styles.header]} onPress={handleLogout} activeOpacity={0.9}>
//               <Text style={[styles.title, globalStyle.commonHeading, globalFonts.poppins_600]}>Logout</Text>
//               <MaterialIcons name="logout" size={20} color="#333" />
//             </TouchableOpacity>
//           </View>

//           <View style={styles.accordionBx}>
//             <TouchableOpacity style={[styles.header]} onPress={handleDeleteRequest} activeOpacity={0.9}>
//               <Text style={[styles.title, globalStyle.commonHeading, globalFonts.poppins_600]}>Delete Account</Text>
//               <MaterialIcons name="delete-outline" size={22} color="#333" />
//             </TouchableOpacity>
//           </View>
//         </ScrollView>
//       </View>

//     </LinearGradient>
//   );
// };

// export default Profile;

// const styles = StyleSheet.create({

//   GradientBox: {
//     flex: 1,
//     backgroundColor: "red",
//   },

//   profileHeader: {
//     width,
//     height: height * 0.15,
//     flexDirection: "row",
//     justifyContent: "center",
//     alignItems: "center",
//   },

//   headerDescription: {
//     width: "100%",
//     marginBottom: verticalScale(20),
//     paddingHorizontal: scale(5)
//   },

//   whitePanel: {
//     flex: 1,
//     backgroundColor: themeColors.white,
//     borderTopLeftRadius: 20,
//     borderTopRightRadius: 20,
//     // overflow: "hidden",
//   },

//   scroll: {
//     flex: 1,
//   },

//   scrollContent: {
//     flexGrow: 1,
//     padding: scale(20),
//     paddingBottom: height * 0.12,
//   },

//   profileBox: {
//     width: scale(104),
//     height: scale(104),
//     borderRadius: scale(51),
//     backgroundColor: themeColors.warmYellow,
//     justifyContent: "center",
//     marginTop: scale(-51),
//   },

//   profileImage: {
//     width: scale(100),
//     height: scale(100),
//     borderRadius: scale(50),
//   },

//   profileBx: {
//     flexDirection: "column",
//     justifyContent: "center",
//     alignItems: "center",
//     gap: scale(11),
//     marginBottom: verticalScale(10),
//   },

//   accordionBx: {
//     marginBottom: verticalScale(10),
//     borderWidth: 1,
//     borderColor: "#fff",
//     borderRadius: 10,
//     backgroundColor: "#f6f6f6",
//     overflow: "hidden",
//   },

//   header: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     padding: moderateScale(14),
//     backgroundColor: "#f6f6f6",
//   },

//   title: {
//     fontWeight: "600",
//     color: "#333",
//   },

//   contentWrap: {
//     overflow: "hidden",
//     paddingHorizontal: moderateScale(14),
//     paddingBottom: verticalScale(14),
//   },

//   content: {
//     lineHeight: 16,
//     color: "#797979ff",
//   },
// });




import CategoryCard from "@/components/profile/CategoryCard";
import getApiUrl from "@/constant/apiUrl";
import TimeZone from "@/constant/timeZone";
import { logout } from "@/redux/slices/authSlice";
import globalFonts from "@/theme/fontFamily";
import globalStyle from "@/theme/globalStyle";
import themeColors from "@/theme/themeColors";
import { AntDesign, MaterialIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import * as Linking from "expo-linking";
import { useFocusEffect, useRouter } from "expo-router";
import React, { useCallback, useRef, useState } from "react";
import {
  Dimensions,
  Image,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { moderateScale, scale, verticalScale } from "react-native-size-matters";
import { useDispatch, useSelector } from "react-redux";

const { width, height } = Dimensions.get("window");

const Profile = () => {
  const { user, token } = useSelector((state) => state.auth);
  const abortController = useRef(null);
  const { userTimeZone } = TimeZone();
  const router = useRouter();
  const dispatch = useDispatch();
  const [activeCategoryIndex, setActiveCategoryIndex] = useState(0);
  const [hotspotCheckIn, setHotspotCheckIn] = useState(null);
  const [scheduleCheckIn, setScheduleCheckIn] = useState(null);

  useFocusEffect(
    useCallback(() => {
      const fetchCheckIn = async () => {
        const apiURL = getApiUrl();
        abortController.current = new AbortController();

        try {
          const response = await fetch(`${apiURL}/getUserCheckInDetails`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ timeZone: userTimeZone }),
            signal: abortController.current.signal,
          });

          const obj = await response.json();
          if (!obj.status) return;

          setHotspotCheckIn(obj?.checkInData?.hotspotCheckIn || null);
          setScheduleCheckIn(obj?.checkInData?.scheduleCheckIn || null);
        } catch (e) {
          if (e.name !== "AbortError") console.log(e);
        }
      };

      fetchCheckIn();
      return () => abortController.current?.abort();
    }, [token, userTimeZone])
  );

  // useEffect(()=>{console.log(user.categoryWiseProfile)}, [user])

  const handleLogout = () => {
    dispatch(logout());
    router.replace("(initial)");
  };

  const handleDeleteRequest = () => {
    Linking.openURL("https://theroundrectangle.com/MeuDatingApp/");
  };

  const capitalize = (str = "") =>
    str
      .split(" ")
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
      .join(" ");

  return (
    <LinearGradient
      style={{ flex: 1 }}
      colors={[themeColors.darkCharcoal, themeColors.darkCharcoal]}
    >
      <StatusBar barStyle="light-content" />

      {/* Header */}
      <View style={styles.profileHeader} />

      {/* White Panel */}
      <View style={styles.whitePanel}>
        {/* Profile Image */}
        <View style={styles.profileBx}>
          <View style={styles.profileBox}>
            <Image
              source={{
                uri:
                  user?.selfie && user?.baseUrl
                    ? `${user.baseUrl}${user.selfie}`
                    : "https://i.pravatar.cc/150",
              }}
              style={styles.profileImage}
            />
          </View>

          <Text style={[globalStyle.headingMedium, globalFonts.poppins_600]}>
            {capitalize(user?.name)}, {user?.age || 18}
          </Text>

          <Text style={[globalStyle.normalFontSize, globalFonts.poppins_500]}>
            {capitalize(user?.profession)} | {capitalize(user?.characteristic)}
          </Text>

          <View style={{width: "90%"}}>
            {hotspotCheckIn && (
              <Text style={[globalStyle.smallText, globalFonts.poppins_600]}>
                📍 Hotspot: {hotspotCheckIn.area} • {hotspotCheckIn.shop}
              </Text>
            )}

            {scheduleCheckIn && (
              <Text style={[globalStyle.smallText, globalFonts.poppins_600]}>
                🗓 Schedule:  {scheduleCheckIn.area} • {scheduleCheckIn.shop}
              </Text>
            )}
          </View>

        </View>

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >


          {Array.isArray(user?.categoryWiseProfile) &&
            user.categoryWiseProfile.map((item, index) => (
              <CategoryCard
                key={index}
                data={item}
                isOpen={activeCategoryIndex === index}
                onPress={() =>
                  setActiveCategoryIndex(
                    activeCategoryIndex === index ? null : index
                  )
                }
              />
            ))}

          {/* Actions */}
          <TouchableOpacity style={styles.actionBtn}>
            <Text style={[globalStyle.commonText, globalFonts.poppins_700]}>Edit Profile</Text>
            <AntDesign name="profile" size={18} />
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionBtn} onPress={handleLogout}>
            <Text style={[globalStyle.commonText, globalFonts.poppins_700]}>Logout</Text>
            <MaterialIcons name="logout" size={18} />
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionBtn} onPress={handleDeleteRequest}>
            <Text style={[globalStyle.commonText, globalFonts.poppins_700]}>Delete Account</Text>
            <MaterialIcons name="delete-outline" size={18} />
          </TouchableOpacity>
        </ScrollView>
      </View>
    </LinearGradient>
  );
};

export default Profile;

const styles = StyleSheet.create({
  profileHeader: {
    height: height * 0.1,
  },

  whitePanel: {
    flex: 1,
    backgroundColor: "#fff",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
  },

  profileBx: {
    alignItems: "center",
    marginTop: -50,
    marginBottom: verticalScale(10),
  },

  profileBox: {
    width: scale(104),
    height: scale(104),
    borderRadius: scale(52),
    backgroundColor: themeColors.warmYellow,
    justifyContent: "center",
    alignItems: "center",
  },

  profileImage: {
    width: scale(100),
    height: scale(100),
    borderRadius: scale(50),
  },

  scrollContent: {
    padding: scale(20),
    paddingBottom: height * 0.12,
  },

  actionBtn: {
    gap: scale(10),
    padding: moderateScale(14),
    backgroundColor: "#f6f6f6",
    borderRadius: 10,
    marginBottom: verticalScale(10),

    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
});
