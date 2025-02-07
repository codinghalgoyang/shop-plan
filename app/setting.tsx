import Header from "@/components/Header";
import { StyleSheet, Text } from "react-native";
import ScreenView from "@/components/ScreenView";

export default function SettingScreen() {
  return (
    <ScreenView>
      <Header title="Setting" enableBackAction={true} />
      <Text>Setting Screen</Text>
    </ScreenView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
