import { settingState } from "@/atoms/settingAtom";
import { useRecoilState } from "recoil";
import Entypo from "@expo/vector-icons/Entypo";
import { Switch, StyleSheet, View } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Setting } from "@/utils/types";
import ThemedText from "../Common/ThemedText";
import { Colors } from "@/utils/Colors";

export default function SettingItemAOD() {
  const [setting, setSetting] = useRecoilState(settingState);

  const toggleAODEnabled = async () => {
    const saveToggleSetting = async (newSetting: Setting) => {
      try {
        await AsyncStorage.setItem("setting", JSON.stringify(newSetting));
      } catch (error) {
        console.log(error);
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
      <ThemedText>항상 화면 켜기</ThemedText>
      <Switch
        trackColor={{ false: Colors.content.gray, true: Colors.orange }}
        thumbColor={Colors.content.white}
        ios_backgroundColor="#3e3e3e"
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
