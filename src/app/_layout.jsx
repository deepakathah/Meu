import GlobalListeners from '@/components/molecules/GlobalListeners';
import NotificationProvider from '@/context/NotificationContext';
import { RequestPortalProvider } from '@/context/RequestPortalContext2';
import store from "@/redux/store";
import { Poppins_500Medium, Poppins_600SemiBold, Poppins_700Bold, useFonts } from '@expo-google-fonts/poppins';
import { Slot, useRouter } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import { Provider } from "react-redux";
SplashScreen.preventAutoHideAsync();

const RootLayout = () => {

  const router = useRouter();

  const [fontsLoaded] = useFonts({
    Poppins_500Medium,
    Poppins_600SemiBold,
    Poppins_700Bold,
  });

  useEffect(() => {
    if (fontsLoaded) {
      let timeOut = setTimeout(() => {
        SplashScreen.hideAsync();

        // router.push("/(main)/(tabs)/history");

      }, 2000);
      return () => clearTimeout(timeOut)
    }

  }, [fontsLoaded])


  return (
    <Provider store={store}>
      <NotificationProvider>
        <RequestPortalProvider>
          <GlobalListeners />
          <Slot />

          {/* <Stack screenOptions={{ headerShown: false }}
          initialRouteName="index">
          <Stack.Screen name="index" />
          <Stack.Screen name="(initial)" />
          <Stack.Screen name="(auth)" />
          <Stack.Screen name="(main)" />
        </Stack> */}

        </RequestPortalProvider>
      </NotificationProvider>
    </Provider>
  );
};

export default RootLayout;

