import "dotenv/config";

export default {
  expo: {
    name: process.env.APP_NAME,
    slug: "shop-plan",
    version: "1.0.0",
    orientation: "portrait",
    icon: "./assets/images/icon.png",
    scheme: "myapp",
    userInterfaceStyle: "automatic",
    newArchEnabled: true,
    ios: {
      supportsTablet: true,
      bundleIdentifier: process.env.APP_PACKAGE_NAME,
      infoPlist: {
        ITSAppUsesNonExemptEncryption: false,
      },
      googleServiceFile: env.GOOGLE_SERVICES_INFOPLIST,
    },
    android: {
      // adaptiveIcon: {
      //   foregroundImage: "./assets/images/adaptive-icon.png",
      //   backgroundColor: "#ffffff",
      // },
      package: process.env.APP_PACKAGE_NAME,
      googleServiceFile: process.env.GOOGLE_SERVICES_JSON,
    },
    web: {
      bundler: "metro",
      output: "static",
      favicon: "./assets/images/favicon.png",
    },
    plugins: [
      "expo-router",
      "@react-native-google-signin/google-signin",
      [
        "expo-splash-screen",
        {
          image: "./assets/images/splash-icon.png",
          imageWidth: 200,
          resizeMode: "contain",
          backgroundColor: "#ffffff",
        },
      ],
      [
        "react-native-google-mobile-ads",
        {
          androidAppId: process.env.ADMOB_ANDROID_APP_ID,
          iosAppId: process.env.ADMOB_IOS_APP_ID,
        },
      ],
    ],
    experiments: {
      typedRoutes: true,
    },
    extra: {
      router: {
        origin: false,
      },
      eas: {
        projectId: "d71e023d-ed5e-4348-9443-b5a0ec3ee4b3",
      },
      googleSignInClientId: process.env.GOOGLE_SIGN_IN_CLIENT_ID,
    },
    owner: "codinghalgoyang",
  },
};
