import { StyleSheet, TouchableOpacity, View } from "react-native";
import ThemedText from "../Common/ThemedText";
import { Colors } from "@/utils/Colors";
import SimpleLineIcons from "@expo/vector-icons/SimpleLineIcons";
import ThemedIcon from "../Common/ThemedIcon";
import { router } from "expo-router";

export default function SettingItemTermsOfUse() {
  return (
    <TouchableOpacity
      onPress={() => {
        router.push("/terms_of_use");
      }}
    >
      <View style={styles.container}>
        <ThemedText>이용약관</ThemedText>
        <ThemedIcon IconComponent={SimpleLineIcons} iconName="arrow-right" />
      </View>
    </TouchableOpacity>
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
