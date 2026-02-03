
import ProfileCardItem from "@/components/atoms/ProfileCardItem";
import ModelMessage from "@/components/molecules/ModelMessage";
import imagePath from "@/constant/imagePath";
import useTimeZone from "@/constant/timeZone";
import themeColors from '@/theme/themeColors';
import Constants from 'expo-constants';
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  Dimensions,
  Image,
  ImageBackground,
  StyleSheet,
  TouchableOpacity,
  View
} from "react-native";
import * as Animatable from 'react-native-animatable';
import { GestureHandlerRootView, } from "react-native-gesture-handler";
import Animated, {
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { moderateScale } from "react-native-size-matters";
import { useSelector } from 'react-redux';

const getApiUrl = () => {
  const apiURL = Constants?.expoConfig?.extra?.apiURL;
  if (!apiURL) throw new Error('API URL is not defined in expo-constants');
  return apiURL;
};


// const profiles = [
//   {
//     id: "1",
//     avatar: "https://i.pravatar.cc/150?img=1",
//     name: "Bindaas Bhow",
//     age: 27,
//     tagline: "Dabbang Hawabaaz",
//     personality:
//       "Passionate about sports and fitness. Loves spending weekends on the field and evenings at chill cafes.",
//     tags: [
//       "Personality",
//       "Hobbies & Passion",
//       "Work & Career",
//       "Love & Relationship",
//       "Beliefs & Philosophies",
//     ],
//   },
//   {
//     id: "2",
//     avatar: "https://i.pravatar.cc/150?img=2",
//     name: "Rohit Sharma",
//     age: 29,
//     tagline: "Cricket Enthusiast",
//     personality:
//       "Passionate about sports and fitness. Loves spending weekends on the field and evenings at chill cafes.",
//     tags: ["Personality", "Work & Career", "Love & Relationship"],
//   },
//   {
//     id: "3",
//     avatar: "https://i.pravatar.cc/150?img=3",
//     name: "Ayesha Khan",
//     age: 25,
//     tagline: "Bollywood Buff",
//     personality:
//       "Movie marathons, music jams, and deep late-night conversations. Looking for good vibes only.",
//     tags: [
//       "Hobbies & Passion",
//       "Work & Career",
//       "Love & Relationship",
//       "Beliefs & Philosophies",
//     ],
//     interests: ["Concerts", "Netflix nights"],
//   },
//   {
//     id: "4",
//     avatar: "https://i.pravatar.cc/150?img=4",
//     name: "Kunal Verma",
//     age: 31,
//     tagline: "Food Explorer",
//     personality:
//       "Love discovering new cafes and cuisines. Food is my love language.",
//     tags: [
//       "Personality",
//       "Hobbies & Passion",
//       "Work & Career",
//       "Love & Relationship",
//       "Beliefs & Philosophies",
//     ],
//   },
//   {
//     id: "5",
//     avatar: "https://i.pravatar.cc/150?img=5",
//     name: "Sneha Patel",
//     age: 26,
//     tagline: "Yoga Soul",
//     personality:
//       "Calm, centered, and spiritual. I believe in mindfulness, meditation, and good company.",
//     tags: [
//       "Personality",
//       "Hobbies & Passion",
//       "Love & Relationship",
//       "Beliefs & Philosophies",
//     ],
//   },
//   {
//     id: "6",
//     avatar: "https://i.pravatar.cc/150?img=6",
//     name: "Arjun Mehta",
//     age: 28,
//     tagline: "Startup Hustler",
//     personality:
//       "Always chasing the next big idea. Love building, learning, and late-night brainstorming sessions.",
//     tags: ["Work & Career", "Personality", "Hobbies & Passion"],
//   },
//   {
//     id: "7",
//     avatar: "https://i.pravatar.cc/150?img=7",
//     name: "Priya Sharma",
//     age: 24,
//     tagline: "Artistic Soul",
//     personality:
//       "Sketchbook always in hand. Love colors, creativity, and conversations that spark imagination.",
//     tags: ["Hobbies & Passion", "Beliefs & Philosophies"],
//     interests: ["Painting", "Poetry"],
//   },
//   {
//     id: "8",
//     avatar: "https://i.pravatar.cc/150?img=8",
//     name: "Vikram Singh",
//     age: 32,
//     tagline: "Tech Geek",
//     personality:
//       "From coding to gaming, technology excites me. Weekends = hackathons + Netflix binges.",
//     tags: ["Work & Career", "Hobbies & Passion", "Personality"],
//   },
//   {
//     id: "9",
//     avatar: "https://i.pravatar.cc/150?img=9",
//     name: "Ananya Iyer",
//     age: 27,
//     tagline: "Traveler at Heart",
//     personality:
//       "Mountains, beaches, or deserts — I live for new adventures and stories from different cultures.",
//     tags: [
//       "Hobbies & Passion",
//       "Love & Relationship",
//       "Beliefs & Philosophies",
//     ],
//     interests: ["Backpacking", "Photography"],
//   },
//   {
//     id: "10",
//     avatar: "https://i.pravatar.cc/150?img=10",
//     name: "Rahul Kapoor",
//     age: 30,
//     tagline: "Fitness Freak",
//     personality:
//       "Gym is my temple. Love motivating people to live healthier and fitter lives.",
//     tags: ["Personality", "Hobbies & Passion", "Work & Career"],
//   },
//   {
//     id: "11",
//     avatar: "https://i.pravatar.cc/150?img=11",
//     name: "Meera Joshi",
//     age: 23,
//     tagline: "Bookworm",
//     personality:
//       "You’ll always find me with a novel. Love libraries, coffee shops, and thoughtful discussions.",
//     tags: ["Hobbies & Passion", "Beliefs & Philosophies"],
//   },
//   {
//     id: "12",
//     avatar: "https://i.pravatar.cc/150?img=12",
//     name: "Kabir Malhotra",
//     age: 33,
//     tagline: "Musician by Night",
//     personality:
//       "Day job keeps me busy, but nights are for my guitar and soulful music.",
//     tags: ["Hobbies & Passion", "Love & Relationship"],
//     interests: ["Live music", "Open mics"],
//   },
//   {
//     id: "13",
//     avatar: "https://i.pravatar.cc/150?img=13",
//     name: "Simran Kaur",
//     age: 28,
//     tagline: "Social Butterfly",
//     personality:
//       "Life of the party! Love meeting new people, hosting gatherings, and spreading positivity.",
//     tags: [
//       "Personality",
//       "Hobbies & Passion",
//       "Love & Relationship",
//       "Beliefs & Philosophies",
//     ],
//   },
//   {
//     id: "14",
//     avatar: "https://i.pravatar.cc/150?img=14",
//     name: "Aditya Singh",
//     age: 29,
//     tagline: "History Buff",
//     personality:
//       "Fascinated by ancient civilizations and historical events. Always up for a documentary night or a trip to a heritage site.",
//     tags: ["Hobbies & Passion", "Beliefs & Philosophies"],
//     interests: ["Historical fiction", "Museums"],
//   },
//   {
//     id: "15",
//     avatar: "https://i.pravatar.cc/150?img=15",
//     name: "Nisha Varma",
//     age: 26,
//     tagline: "Nature Lover",
//     personality:
//       "Finds peace in the outdoors. Hiking, camping, and just being surrounded by nature is my ideal weekend.",
//     tags: ["Hobbies & Passion", "Personality", "Love & Relationship"],
//     interests: ["Hiking", "Camping", "Gardening"],
//   },
//   {
//     id: "16",
//     avatar: "https://i.pravatar.cc/150?img=16",
//     name: "Devika Rao",
//     age: 27,
//     tagline: "Dance is Life",
//     personality:
//       "Trained in classical and contemporary dance. Expressing emotions through rhythm and movement.",
//     tags: ["Hobbies & Passion", "Personality"],
//     interests: ["Bharatanatyam", "Contemporary dance"],
//   },
//   {
//     id: "17",
//     avatar: "https://i.pravatar.cc/150?img=17",
//     name: "Raj Malhotra",
//     age: 34,
//     tagline: "Adventurer",
//     personality:
//       "Skydiving, scuba diving, trekking — adrenaline rush is what I live for.",
//     tags: ["Hobbies & Passion", "Love & Relationship"],
//     interests: ["Adventure sports", "Travel"],
//   },
//   {
//     id: "18",
//     avatar: "https://i.pravatar.cc/150?img=18",
//     name: "Ishita Sen",
//     age: 25,
//     tagline: "Animal Lover",
//     personality:
//       "Volunteering at shelters and spending time with pets brings me peace.",
//     tags: ["Beliefs & Philosophies", "Hobbies & Passion"],
//     interests: ["Animal rescue", "Pet care"],
//   },
//   {
//     id: "19",
//     avatar: "https://i.pravatar.cc/150?img=19",
//     name: "Manish Gupta",
//     age: 29,
//     tagline: "Entrepreneurial Mindset",
//     personality:
//       "Running two startups and mentoring young entrepreneurs. Believe in hustling with purpose.",
//     tags: ["Work & Career", "Personality"],
//   },
//   {
//     id: "20",
//     avatar: "https://i.pravatar.cc/150?img=20",
//     name: "Tanya Kapoor",
//     age: 22,
//     tagline: "Fashion Enthusiast",
//     personality:
//       "Exploring trends, creating styles, and inspiring with fashion choices.",
//     tags: ["Hobbies & Passion", "Work & Career"],
//     interests: ["Fashion blogging", "Styling"],
//   },
// ];


const { width, height } = Dimensions.get('window');
const wheelWidth = width * 1.8

export default function SpinWheel() {
  const rotation = useSharedValue(0);
  const [winner, setWinner] = useState(null);
  const { token } = useSelector(state => state.auth);
  const [profiles, setProfiles] = useState([])
  const [baseUrl, setBaseUrl] = useState("");
  const router = useRouter();
  const [isCheckIn, setIsCheckIn] = useState(false);
  const [isError, setIsError] = useState('');
  const { userTimeZone } = useTimeZone();
  useEffect(() => {
    const getSpinMatch = async () => {
      try {
        const apiURL = getApiUrl();
        if (!apiURL) return;

        const response = await fetch(`${apiURL}/spinWheelMatch`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ timeZone: userTimeZone })
        });

        const obj = await response.json();

        if (!obj?.status) {
          setIsError(obj.message);
          setIsCheckIn(true)
          return
          // console.log(data);
        }

        const { data, baseUrl } = obj;
        if (data && baseUrl) {
          setProfiles(data);
          setBaseUrl(baseUrl);
        }

      } catch (error) {
        console.error("Error:", error);
        setIsError(error?.message)
        setIsCheckIn(true)
      }
    };

    getSpinMatch();
  }, []);


  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${rotation.value}deg` }],
  }));

  const detectWinner = (finalRotation) => {
    const numberOfSlices = profiles.length;
    const sliceAngle = 360 / numberOfSlices;

    const empiricalOffset = 90;

    const centerOfSliceAdjustment = sliceAngle / 2;

    const finalCorrection = empiricalOffset - centerOfSliceAdjustment;

    const winningAngle = (((-finalRotation + finalCorrection) % 360) + 360) % 360;


    const index = Math.floor(winningAngle / sliceAngle);

    const winnerProfile = profiles[index];
    setWinner(winnerProfile);
  };

  const spinTheWheel = () => {
    setWinner(null)
    const randomSpin = 360 * 2 + Math.floor(Math.random() * 360);
    const finalValue = rotation.value + randomSpin;

    rotation.value = withTiming(finalValue, { duration: 2000 }, (finished) => {
      if (finished) {
        runOnJS(detectWinner)(finalValue);
      }
    });
  };

  return (
    <GestureHandlerRootView style={styles.container}>
      <ImageBackground
        source={imagePath.circleBg}
        style={styles.banner}
        resizeMode="cover"
      >
        {/* Wheel */}
        <Animated.View style={[styles.wheel, animatedStyle]}>
          <View style={styles.shadow} />

          {profiles.map((item, index) => {
            const angle = (360 / profiles.length) * index;
            return (
              <View
                key={item.id}
                style={[
                  styles.slice,
                  {
                    transform: [
                      { rotate: `${angle}deg` },
                      { translateY: -100 },
                    ],
                  },
                ]}
              >
                <Image
                  source={{ uri: `${baseUrl}${item.selfie}` }}
                  style={styles.avatar}
                  resizeMode="cover"
                />
              </View>
            );
          })}

          <ImageBackground
            source={imagePath.spinCircle}
            style={styles.circle}
            resizeMode="cover"
          />

        </Animated.View>

        {/* Pointer */}
        <View style={styles.circleLayer}>

          <TouchableOpacity style={styles.spinArrowBtn} onPress={spinTheWheel}>
            <Image
              source={imagePath.spinArrow}
              resizeMode="contain"
              style={styles.spinArrowImage}
            />
          </TouchableOpacity>

        </View>


        {/* Winner Modal */}
        {winner && (
          <Animatable.View animation="fadeIn">
            <ProfileCardItem
              onPressFn={() => router.push({
                pathname: "/userprofile",
                params: {
                  uid: winner?.id,
                  token: token
                }
              })}
              item={winner}
              baseUrl={baseUrl}
            />
          </Animatable.View>
        )}

        {isError && (
          <ModelMessage
            message={isError}
            setIsError={setIsError}
            isCheckIn={isCheckIn}
            setIsCheckIn={setIsCheckIn}
          />
        )}
      </ImageBackground>

    </GestureHandlerRootView >
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  banner: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingBottom: wheelWidth / 3.5,
  },

  wheel: {
    position: "absolute",
    bottom: -wheelWidth / 1.55,
    alignSelf: "center",
    width: wheelWidth,
    height: wheelWidth,
    borderRadius: wheelWidth / 2,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: themeColors.warmYellow,
  },

  circleLayer: {
    position: "absolute",
    bottom: -wheelWidth / 1.55,
    alignSelf: "center",
    width: wheelWidth,
    height: wheelWidth,
    borderRadius: wheelWidth / 2,
    justifyContent: "center",
    alignItems: "center",
  },


  shadow: {
    position: 'absolute',
    // iOS shadow
    shadowColor: '#00000092',
    shadowOpacity: 0.2,
    shadowRadius: 10,
    // Android shadow
    elevation: 10,

    width: wheelWidth * 0.98,
    height: wheelWidth * 0.98,
    borderRadius: wheelWidth / 2,
    backgroundColor: themeColors.warmYellow,
  },

  circle: {
    position: 'absolute',
    width: wheelWidth * 0.71,
    height: wheelWidth * 0.71,
    borderRadius: wheelWidth * 0.71 / 2,
    backgroundColor: themeColors.black,
  },

  slice: {
    position: "absolute",
    width: wheelWidth * 0.93
  },

  avatar: {
    width: wheelWidth * 0.12,
    height: wheelWidth * 0.12,
    borderRadius: wheelWidth * 0.12 / 2,
    borderWidth: 2,
    borderColor: "#fff",
  },

  spinArrowBtn: {
    position: "absolute",
    top: wheelWidth * 0.13,
  },

  spinArrowImage: {
    width: wheelWidth * 0.17,
    height: wheelWidth * 0.17,
  },

  button: {
    marginTop: 50,
    backgroundColor: "tomato",
    paddingVertical: 15,
    paddingHorizontal: 40,
    borderRadius: 12,
  },

  buttonText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#fff",
  },

  GradientBox: {
    borderRadius: moderateScale(15),
  },

});