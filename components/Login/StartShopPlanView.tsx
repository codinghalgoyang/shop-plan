import { View, StyleSheet } from "react-native";
import ThemedText from "@/components/Common/ThemedText";
import { FONT_SIZE } from "@/utils/Shapes";
import SigninButton from "@/components/Login/SigninButton";

export default function StartShopPlanView() {
  return (
    <View style={styles.container}>
      <View style={styles.contentContainer}>
        <ThemedText color="gray" style={{ fontSize: FONT_SIZE.big }}>
          우리들의 쇼핑 계획
        </ThemedText>
        <ThemedText weight="bold" style={{ fontSize: FONT_SIZE.big * 2 }}>
          ShopPlan
        </ThemedText>
      </View>
      <SigninButton />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    height: "50%",
    alignItems: "center",
  },
  contentContainer: {
    gap: 4,
    alignItems: "center",
    margin: "auto",
  },
});
