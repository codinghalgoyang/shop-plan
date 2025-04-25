import { Linking, TouchableOpacity, View } from "react-native";

import ThemedIcon from "../Common/ThemedIcon";
import AntDesign from "@expo/vector-icons/AntDesign";
import ThemedText from "../Common/ThemedText";
import { Colors } from "@/utils/Colors";
import { Target } from "@/app/plan";

async function openCoupangHome() {
  const coupangHomeLink = "https://link.coupang.com/a/cizNQT";
  const supported = await Linking.canOpenURL(coupangHomeLink);

  if (supported) {
    await Linking.openURL(coupangHomeLink);
  }
}

interface PlanCoupanButtonProps {
  editTarget: Target;
}

export default function PlanCoupangButton({
  editTarget,
}: PlanCoupanButtonProps) {
  return (
    <View
      style={{
        backgroundColor: Colors.background.lightGray,
        padding: 8,
      }}
    >
      <TouchableOpacity
        onPress={openCoupangHome}
        disabled={editTarget ? true : false}
        style={{
          flexDirection: "row",
          backgroundColor: editTarget ? Colors.background.gray : Colors.blue,
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
          style={{
            color: editTarget ? Colors.content.gray : Colors.content.white,
          }}
        />
        <ThemedText
          style={{
            color: editTarget ? Colors.content.gray : Colors.content.white,
            marginTop: -2,
          }}
        >
          쿠팡에서 상품 찾아보기
        </ThemedText>
      </TouchableOpacity>
    </View>
  );
}
