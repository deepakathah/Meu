
// import imagePath from '@/constant/imagePath';
// import globalFonts from '@/theme/fontFamily';
// import React, { useEffect, useState } from 'react';
// import { Image, StyleSheet, Text, View } from 'react-native';
// import { scale, verticalScale } from 'react-native-size-matters';

// export default function DatingLoader() {
//   const [dots, setDots] = useState('');

//   useEffect(() => {
//     const interval = setInterval(() => {
//       setDots((prev) => (prev.length >= 3 ? '' : prev + '.'));
//     }, 500);
//     return () => clearInterval(interval);
//   }, []);


//   return (
//     <View style={styles.container}>
//       <View style={styles.card}>
//         <Image
//           source={imagePath.heartIcon}
//           style={styles.gif}
//         />
//         <Text style={[styles.title, globalFonts.poppins_600]}>Finding the best person for you{dots}</Text>
//       </View>
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     padding: scale(20),
//     width: '100%',
//   },
//   card: {
//     backgroundColor: '#fff',
//     padding: scale(40),
//     borderRadius: scale(20),
//     alignItems: 'center',
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 5 },
//     shadowOpacity: 0.1,
//     shadowRadius: 10,
//     elevation: 10,
//     width: '100%',
//   },
//   title: {
//     textAlign: 'center',
//   },
//   gif: {
//     width: 150,
//     height: 150,
//     marginVertical: verticalScale(10),
//   },
// });


import imagePath from '@/constant/imagePath';
import globalFonts from '@/theme/fontFamily';
import React, { useEffect, useRef } from 'react';
import { Animated, Image, StyleSheet, Text, View } from 'react-native';
import { scale, verticalScale } from 'react-native-size-matters';

export default function DatingLoader() {
  const dot1Opacity = useRef(new Animated.Value(0)).current;
  const dot2Opacity = useRef(new Animated.Value(0)).current;
  const dot3Opacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const animateDots = () => {
      Animated.sequence([
        Animated.timing(dot1Opacity, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(dot2Opacity, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(dot3Opacity, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(dot1Opacity, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(dot2Opacity, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(dot3Opacity, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start(() => animateDots());
    };

    animateDots();
  }, [dot1Opacity, dot2Opacity, dot3Opacity]);

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Image source={imagePath.heartIcon} style={styles.gif} />
        <View style={styles.textContainer}>
          <Text style={[styles.title, globalFonts.poppins_600]}>
            Finding the best person for you
            <View style={styles.dotsContainer}>
              <Animated.Text style={[styles.dot, { opacity: dot1Opacity }]}>.</Animated.Text>
              <Animated.Text style={[styles.dot, { opacity: dot2Opacity }]}>.</Animated.Text>
              <Animated.Text style={[styles.dot, { opacity: dot3Opacity }]}>.</Animated.Text>
            </View>
          </Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: scale(20),
    width: '100%',
  },
  card: {
    backgroundColor: '#fff',
    padding: scale(40),
    borderRadius: scale(20),
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 10,
    width: '100%',
  },
  title: {
    textAlign: 'center',
    fontSize: scale(16),
  },
  gif: {
    width: 150,
    height: 150,
    marginVertical: verticalScale(10),
  },
  textContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dotsContainer: {
    flexDirection: 'row',
    justifyContent: "flex-end",
    alignItems: "baseline",
  },
  dot: {
    marginBottom: scale(-8),
    fontSize: scale(16),
    color: '#000',
  },
});
