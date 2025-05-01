import { Colors } from "@/utils/Colors";
import { FONT_SIZE, ITEM_HEIGHT } from "@/utils/Shapes";
import { useEffect, useState } from "react";
import {
  Platform,
  Image,
  Text,
  StyleSheet,
  View,
  Button,
  ActivityIndicator,
} from "react-native";
import {
  NativeAd,
  NativeAdView,
  NativeAsset,
  NativeAssetType,
  NativeMediaAspectRatio,
  TestIds,
  useForeground,
} from "react-native-google-mobile-ads";

const nativeAdUnitId = __DEV__
  ? TestIds.NATIVE
  : Platform.OS === "ios"
  ? "ca-app-pub-4328295791477402/3323296160" // ios ad unit id
  : "ca-app-pub-4328295791477402/4181916415"; // android ad unit id

export default function PlanNativeAd() {
  const [nativeAd, setNativeAd] = useState<NativeAd>();

  useEffect(() => {
    NativeAd.createForAdRequest(nativeAdUnitId, {
      aspectRatio: NativeMediaAspectRatio.SQUARE,
    })
      .then(setNativeAd)
      .catch(console.error);
  }, []);

  useForeground(async () => {
    NativeAd.createForAdRequest(nativeAdUnitId, {
      aspectRatio: NativeMediaAspectRatio.SQUARE,
    })
      .then(setNativeAd)
      .catch(console.error);
  });

  if (!nativeAd) {
    if (Platform.OS === "ios") {
      return null;
    }

    return (
      <View style={[styles.container, { justifyContent: "center" }]}>
        <ActivityIndicator color={Colors.content.gray} />
      </View>
    );
  }

  return (
    <NativeAdView nativeAd={nativeAd}>
      <View style={styles.container}>
        {nativeAd.icon ? (
          <NativeAsset assetType={NativeAssetType.ICON}>
            <Image source={{ uri: nativeAd.icon.url }} style={styles.icon} />
          </NativeAsset>
        ) : null}

        <NativeAsset assetType={NativeAssetType.HEADLINE}>
          <Text style={styles.headline} numberOfLines={1}>
            {nativeAd.headline}
          </Text>
        </NativeAsset>
      </View>
    </NativeAdView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.background.white,
    height: ITEM_HEIGHT,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingHorizontal: 12,
    borderBottomWidth: 0.5,
    borderColor: Colors.border,
  },
  headline: {
    fontSize: FONT_SIZE.normal,
    fontWeight: "700",
    color: Colors.content.black,
  },
  icon: {
    width: 28,
    height: 28,
    borderRadius: 2.5,
    backgroundColor: Colors.background.white,
  },
});
