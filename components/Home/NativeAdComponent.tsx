import { useEffect, useState } from "react";
import { Platform } from "react-native";
import {
  NativeAd,
  NativeAdView,
  NativeMediaView,
  TestIds,
} from "react-native-google-mobile-ads";

const nativeAdUnitId = __DEV__
  ? TestIds.ADAPTIVE_BANNER
  : Platform.OS === "ios"
  ? "ca-app-pub-4328295791477402/8500726959" // ios ad unit id
  : "ca-app-pub-4328295791477402/7414283099"; // android ad unit id

export default function NativeAdComponent() {
  const [nativeAd, setNativeAd] = useState<NativeAd>();

  useEffect(() => {
    NativeAd.createForAdRequest(nativeAdUnitId)
      .then(setNativeAd)
      .catch(console.error);
  }, []);

  if (!nativeAd) {
    return null;
  }

  return (
    <NativeAdView nativeAd={nativeAd}>
      <NativeMediaView />
      // Other assets..
    </NativeAdView>
  );
}
