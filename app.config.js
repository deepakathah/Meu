import 'dotenv/config';

export default {
  expo: {
    name: 'Meu',
    slug: 'Meu',
    version: '1.0.0',
    orientation: 'portrait',
    icon: './src/assets/images/icons/icon.png',
    scheme: process.env.SCHEME || 'meu',
    userInterfaceStyle: 'automatic',
    newArchEnabled: true,

    ios: {
      supportsTablet: true,
      infoPlist: {
        ITSAppUsesNonExemptEncryption: false,
      },
      bundleIdentifier: process.env.ANDROID_PACKAGE || 'com.atthah.Meu',
      config: {
        googleMapsApiKey: process.env.GOOGLE_MAPS_API_KEY,
      },
      icon: {
        dark: './src/assets/images/icons/ios-dark.png',
        light: './src/assets/images/icons/ios-light.png',
        tinted: './src/assets/images/icons/ios-tinted.png',
      },
    },

    android: {
      adaptiveIcon: {
        foregroundImage: './src/assets/images/icons/adaptive-icon.png',
        monoChromeImage: './src/assets/images/icons/adaptive-icon.png',
        backgroundImage: './src/assets/images/icons/adaptive-icon.png',
        backgroundColor: '#6A0DAD',
      },
      edgeToEdgeEnabled: true,
      package: process.env.ANDROID_PACKAGE || 'com.atthah.Meu',
      googleServicesFile: "./google-services.json",
      softwareKeyboardLayoutMode: 'pan',
      config: {
        googleMaps: {
          apiKey: process.env.GOOGLE_MAPS_API_KEY,
        },
      },
    },

    notification: {
      icon: './src/assets/images/icons/notification-icon.png',
      // White transparent PNG (96x96 or 256x256)
      color: '#6A0DAD', // Optional accent color for notification icon
      iosDisplayInForeground: true, // iOS: show alert while app is open
      sound: true, // enable default notification sound
    },

    web: {
      bundler: 'metro',
      output: 'static',
      favicon: './src/assets/images/favicon.png',
    },

    plugins: [
      'expo-router',
      [
        'expo-splash-screen',
        {
          image: './src/assets/images/icons/splash-icon.png',
          imageWidth: 200,
          resizeMode: 'contain',
          backgroundColor: '#6A0DAD',
        },
      ],
      'expo-font',
      [
        'expo-camera',
        {
          cameraPermission: 'Allow $(PRODUCT_NAME) to access your camera',
          microphonePermission: 'Allow $(PRODUCT_NAME) to access your microphone',
          recordAudioAndroid: true,
        },
      ],
      [
        'expo-video',
        {
          supportsBackgroundPlayback: true,
          supportsPictureInPicture: true,
        },
      ],
      [
        "expo-location",
        {
          "locationAlwaysAndWhenInUsePermission": "Allow $(PRODUCT_NAME) to use your location."
        }
      ],
      [
        "expo-sqlite",
        {
          "enableFTS": true,
          "useSQLCipher": true,
          "android": {
            "enableFTS": false,
            "useSQLCipher": false
          },
          "ios": {
           
            "customBuildFlags": ["-DSQLITE_ENABLE_DBSTAT_VTAB=1 -DSQLITE_ENABLE_SNAPSHOT=1"]
          }
        }
      ],
    ],

    experiments: {
      typedRoutes: true,
    },

    extra: {
      wsUrl: process.env.WS_URL,
      apiURL: process.env.API_URL,
      appEnv: process.env.APP_ENV,
      mapApi: process.env.GOOGLE_MAPS_API_KEY,
      eas: {
        projectId: "b92afe57-c709-42a5-852f-0500997c7490",
      },
    },
  },
};
