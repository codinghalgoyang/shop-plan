import { Linking, TouchableOpacity, View } from "react-native";

import ThemedIcon from "../Common/ThemedIcon";
import AntDesign from "@expo/vector-icons/AntDesign";
import ThemedText from "../Common/ThemedText";
import { Colors } from "@/utils/Colors";

async function openCoupangHome() {
  const coupangHomeLink = "https://link.coupang.com/a/cizNQT";
  const supported = await Linking.canOpenURL(coupangHomeLink);

  if (supported) {
    await Linking.openURL(coupangHomeLink);
  }
}

export default function PlanCoupangButton() {
  return (
    <View
      style={{
        backgroundColor: Colors.background.lightGray,
        padding: 8,
      }}
    >
      <TouchableOpacity
        onPress={openCoupangHome}
        style={{
          flexDirection: "row",
          backgroundColor: Colors.blue,
          width: "100%",
          paddingVertical: 12,
          justifyContent: "center",
          alignItems: "center",
          gap: 8,
          borderRadius: 5,
        }}
      >
        <ThemedIcon
          IconComponent={AntDesign}
          iconName="search1"
          color="white"
        />
        <ThemedText style={{ color: Colors.content.white, marginTop: -2 }}>
          쿠팡에서 상품 찾아보기
        </ThemedText>
      </TouchableOpacity>
    </View>
  );
}
