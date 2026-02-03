

import registerForPushNotificationsAsync from '@/notifications/usePushNotification';
import * as Notifications from 'expo-notifications';
import { useRouter } from 'expo-router';
import { createContext, useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';

export const NotificationContext = createContext();

const NotificationProvider = ({ children }) => {
  const [expoPushToken, setExpoPushToken] = useState(null);
  const notificationListener = useRef();
  const responseListener = useRef();
  const router = useRouter();
  const { token } = useSelector(state => state.auth);

  useEffect(() => {
    // 1️⃣ Register for push notifications
    registerForPushNotificationsAsync().then((pushToken) => {
      if (pushToken) {
        setExpoPushToken(pushToken);
      }
    });

    // 2️⃣ Foreground notification listener
    notificationListener.current = Notifications.addNotificationReceivedListener(
      (notification) => {
        console.log('📩 Foreground notification:', notification);
      }
    );

    // 3️⃣ Handle when user taps notification
    responseListener.current = Notifications.addNotificationResponseReceivedListener(
      (response) => {
        console.log('🛎 Notification tapped:', response);

        // Redirect based on Redux token
        if (token) {
          router.push('/(main)/(tabs)/history');
        } else {
          router.push('/(auth)/index');
        }
      }
    );

    // 4️⃣ Cleanup on unmount
    return () => {
      notificationListener.current?.remove();
      responseListener.current?.remove();
    };
  }, [router, token]);

  return (
    <NotificationContext.Provider value={{ expoPushToken }}>
      {children}
    </NotificationContext.Provider>
  );
};

export default NotificationProvider;
