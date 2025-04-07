import { Colors } from "@/utils/Colors";
import { StyleSheet, View } from "react-native";
import ThemedText from "../Common/ThemedText";

export default function EditGuide() {
  return (
    <View style={styles.container}>
      <ThemedText color="white">편집할 카테고리 또는 항목 선택</ThemedText>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    backgroundColor: Colors.orange,
    paddingHorizontal: 8,
    paddingVertical: 6,
    borderTopWidth: 0.5,
    borderColor: Colors.border,
    gap: 4,
  },
});
