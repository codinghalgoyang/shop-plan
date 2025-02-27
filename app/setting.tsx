import Header from "@/components/Common/Header";
import { ScrollView, StyleSheet, View } from "react-native";
import ScreenView from "@/components/Common/ScreenView";
import SettingItemUser from "@/components/Setting/SettingItemUser";
import SettingItemAOD from "@/components/Setting/SettingItemAOD";

export default function SettingScreen() {
  return (
    <ScreenView>
      <Header title="Setting" enableBackAction={true} />
      <ScrollView>
        <SettingItemUser />
        <SettingItemAOD />
      </ScrollView>
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
