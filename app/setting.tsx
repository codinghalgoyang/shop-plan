import Header from "@/components/Common/Header";
import { ScrollView, StyleSheet } from "react-native";
import ScreenView from "@/components/Common/ScreenView";
import SettingItemUser from "@/components/Setting/SettingItemUser";
import SettingItemAOD from "@/components/Setting/SettingItemAOD";
import { Colors } from "@/utils/Colors";
import SettingItemTermsOfUse from "@/components/Setting/SettingItemTermsOfUse";
import SettingItemDeleteUser from "@/components/Setting/SettingItemDeleteUser";
import ThemedText from "@/components/Common/ThemedText";
import SettingItemAppVersion from "@/components/Setting/SettingItemAppVersion";

export default function SettingScreen() {
  return (
    <ScreenView>
      <Header title="설정" enableBackAction={true} />
      <ScrollView style={styles.container}>
        <ThemedText color="gray" style={{ marginLeft: 8, marginVertical: 8 }}>
          회원 정보
        </ThemedText>
        <SettingItemUser />
        <SettingItemDeleteUser />
        <ThemedText color="gray" style={{ marginLeft: 8, marginVertical: 8 }}>
          기타
        </ThemedText>
        <SettingItemAOD />
        <SettingItemTermsOfUse />
        <SettingItemAppVersion />
      </ScrollView>
    </ScreenView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background.lightGray,
  },
});
