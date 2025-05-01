import { StyleSheet, View } from "react-native";
import ThemedText from "../Common/ThemedText";
import { Colors } from "@/utils/Colors";
import Constants from "expo-constants";

export default function SettingItemAppVersion() {
  const appVersion = Constants.expoConfig?.version;

  return (
    <View style={styles.container}>
      <ThemedText>앱 버전</ThemedText>
      <ThemedText color="gray">{`v${appVersion}`}</ThemedText>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderBottomWidth: 0.5,
    backgroundColor: Colors.background.white,
    borderColor: Colors.border,
  },
});
