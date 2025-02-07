import Header from "@/components/Header";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import ScreenView from "@/components/ScreenView";
import SettingGeneral from "@/components/Setting/SettingGeneral";
import SettingAlarm from "@/components/Setting/SettingAlarm";

export default function SettingScreen() {
  return (
    <ScreenView>
      <Header title="Setting" enableBackAction={true} />
      <ScrollView>
        <SettingGeneral />
        <SettingAlarm />
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
