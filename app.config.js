const IS_DEV = process.env.EXPO_PUBLIC_APP_VARIANT === "development";

export default {
  expo: {
    name: IS_DEV ? "Shop Plan (dev)" : "Shop Plan",
    slug: "shop-plan",
    version: "1.0.3",
    orientation: "portrait",
    icon: "./assets/images/icon.png",
    scheme: "myapp",
    userInterfaceStyle: "automatic",
    newArchEnabled: true,
    ios: {
      supportsTablet: true,
      bundleIdentifier: IS_DEV
        ? "com.codinghalgoyang.shopplan.dev"
        : "com.codinghalgoyang.shopplan",
      infoPlist: {
        ITSAppUsesNonExemptEncryption: false,
      },
      googleServicesFile: process.env.GOOGLE_SERVICES_INFOPLIST,
    },
    android: {
      // adaptiveIcon: {
      //   foregroundImage: "./assets/images/adaptive-icon.png",
      //   backgroundColor: "#ffffff",
      // },
      package: IS_DEV
        ? "com.codinghalgoyang.shopplan.dev"
        : "com.codinghalgoyang.shopplan",
      googleServicesFile: process.env.GOOGLE_SERVICES_JSON,
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
          image: "./assets/images/icon.png",
          imageWidth: 200,
          resizeMode: "contain",
          backgroundColor: "#ffffff",
        },
      ],
      [
        "react-native-google-mobile-ads",
        {
          androidAppId: "ca-app-pub-4328295791477402~8564161975",
          iosAppId: "ca-app-pub-4328295791477402~7004841757",
        },
      ],
      [
        "expo-build-properties",
        {
          ios: {
            useFrameworks: "static",
          },
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
    },
    owner: "codinghalgoyang",
  },
};
