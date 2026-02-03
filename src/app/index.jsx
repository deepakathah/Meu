
import imagePath from '@/constant/imagePath';
import { NotificationContext } from '@/context/NotificationContext';
import { verifyOtpSuccess } from '@/redux/slices/authSlice';
import themeColors from '@/theme/themeColors';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';
import Constants from 'expo-constants';
import { useRouter } from 'expo-router';
import React, { useContext, useState } from 'react';
import { Image, StatusBar, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useDispatch } from 'react-redux';

const HomeScreen = () => {
  const [loading, setLoading] = useState(true);
  const { expoPushToken } = useContext(NotificationContext);
  const router = useRouter();
  const dispatch = useDispatch();
  const apiURL = Constants?.expoConfig?.extra?.apiURL;

  useFocusEffect(
    React.useCallback(() => {
      let isActive = true;

      const initialize = async () => {
        try {
          const token = await AsyncStorage.getItem('token');

          if (!token) {
            if (isActive) router.replace('/(initial)/');
            return;
          }

          if (!apiURL) return;

          const response = await fetch(`${apiURL}/verifyToken`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ token, fcmToken: expoPushToken }),
          });

          const data = await response.json();
          if (!isActive) return; // Prevent state updates if unmounted

          if (data?.status) {
            dispatch(
              verifyOtpSuccess({
                token,
                action: data.action,
                user_id: data.user_id,
                user: data.user,
              })
            );

            router.replace(data.action === 'completed' ? '/(main)/' : '/(initial)/');
          } else {
            router.replace('/(initial)/');
          }
        } catch (error) {
          console.error('Error verifying token:', error);
          if (isActive) router.replace('/(initial)/');
        } finally {
          if (isActive) setLoading(false);
        }
      };

      initialize();

      // cleanup to avoid memory leaks
      return () => {
        isActive = false;
      };
    }, [apiURL, expoPushToken])
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />
      <View style={styles.container}>
        <Image source={imagePath.logo} style={styles.image} />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: themeColors.primaryRichPurple,
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: 200,
    height: 200,
  },
});

export default HomeScreen;

