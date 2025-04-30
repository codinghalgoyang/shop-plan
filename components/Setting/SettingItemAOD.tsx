import { Setting, settingState } from "@/atoms/settingAtom";
import { useRecoilState, useSetRecoilState } from "recoil";
import Entypo from "@expo/vector-icons/Entypo";
import { Switch, StyleSheet, View } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import ThemedText from "../Common/ThemedText";
import { Colors } from "@/utils/Colors";
import { modalState } from "@/atoms/modalAtom";

export default function SettingItemAOD() {
  const setModal = useSetRecoilState(modalState);
  const [setting, setSetting] = useRecoilState(settingState);

  const toggleAODEnabled = async () => {
    const saveToggleSetting = async (newSetting: Setting) => {
      try {
        await AsyncStorage.setItem("setting", JSON.stringify(newSetting));
      } catch (error) {
        setModal({
          visible: true,
          title: "안내",
          message: "설정 내용을 저장할 수 없습니다.",
        });
        return;
      }
    };
    setSetting((prev) => {
      const newSetting = {
        ...prev,
        aodEnabled: !prev.aodEnabled,
      };
      saveToggleSetting(newSetting);

      return newSetting;
    });
  };

  return (
    <View style={styles.container}>
      <ThemedText>화면을 켠 상태로 유지</ThemedText>
      <Switch
        trackColor={{ false: Colors.content.gray, true: Colors.orange }}
        thumbColor={Colors.content.white}
        onValueChange={toggleAODEnabled}
        value={setting.aodEnabled}
        style={{ padding: 8 }}
      />
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
