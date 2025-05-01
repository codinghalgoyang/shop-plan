import { Colors } from "@/utils/Colors";
import { FONT_SIZE, ITEM_HEIGHT } from "@/utils/Shapes";
import { useEffect, useState } from "react";
import { Platform, Image, Text, StyleSheet, View, Button } from "react-native";
import {
  NativeAd,
  NativeAdView,
  NativeAsset,
  NativeAssetType,
  NativeMediaAspectRatio,
  TestIds,
} from "react-native-google-mobile-ads";

const nativeAdUnitId = __DEV__
  ? TestIds.NATIVE
  : Platform.OS === "ios"
  ? "ca-app-pub-4328295791477402/8500726959" // ios ad unit id
  : "ca-app-pub-4328295791477402/7414283099"; // android ad unit id

interface NativeAdComponentProps {
  visible?: boolean;
}

export default function NativeAdComponent({
  visible = true,
}: NativeAdComponentProps) {
  const [nativeAd, setNativeAd] = useState<NativeAd>();

  useEffect(() => {
    NativeAd.createForAdRequest(nativeAdUnitId, {
      aspectRatio: NativeMediaAspectRatio.LANDSCAPE,
    })
      .then(setNativeAd)
      .catch(console.error);
  }, []);

  if (!nativeAd || !visible) {
    return <View style={styles.container} />;
  }

  return (
    <NativeAdView nativeAd={nativeAd}>
      <View style={styles.container}>
        <View style={styles.textContainer}>
          <NativeAsset assetType={NativeAssetType.HEADLINE}>
            <Text style={styles.headline}>{nativeAd.headline}</Text>
          </NativeAsset>
          <NativeAsset assetType={NativeAssetType.BODY}>
            <Text style={styles.body} numberOfLines={2}>
              {nativeAd.body}
            </Text>
          </NativeAsset>
        </View>
        {nativeAd.icon ? (
          <NativeAsset assetType={NativeAssetType.ICON}>
            <Image source={{ uri: nativeAd.icon.url }} style={styles.icon} />
          </NativeAsset>
        ) : (
          <View style={styles.callToActionContainer}>
            <NativeAsset assetType={NativeAssetType.HEADLINE}>
              <Text style={styles.callToAction}>{nativeAd.callToAction}</Text>
            </NativeAsset>
          </View>
        )}
      </View>
    </NativeAdView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.background.lightGray,
    height: 80,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderBottomColor: Colors.border,
    borderBottomWidth: 0.5,
  },
  textContainer: {
    width: "75%",
    gap: 2,
  },
  headline: {
    fontSize: FONT_SIZE.normal,
    fontWeight: "700",
    color: Colors.content.black,
  },
  body: {
    fontSize: 13,
    fontWeight: "300",
    color: Colors.content.gray,
  },
  icon: {
    width: 60,
    height: 60,
    borderRadius: 5,
    backgroundColor: Colors.background.white,
  },
  callToActionContainer: {
    width: 60,
    height: 60,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: Colors.blue,
    borderRadius: 5,
  },
  callToAction: {
    fontSize: FONT_SIZE.normal,
    color: Colors.content.white,
  },
});
