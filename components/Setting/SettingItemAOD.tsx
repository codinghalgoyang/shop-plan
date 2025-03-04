import { settingState } from "@/atoms/settingAtom";
import { useRecoilState } from "recoil";
import SettingItem from "./SettingItem";
import Entypo from "@expo/vector-icons/Entypo";
import { Switch, StyleSheet } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Setting } from "@/utils/types";

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
    <SettingItem
      icon={<Entypo name="light-bulb" size={24} color="black" />}
      title={"Always on Display"}
      action={
        <Switch
          trackColor={{ false: "#767577", true: "#81b0ff" }}
          thumbColor={setting.aodEnabled ? "#f5dd4b" : "#f4f3f4"}
          ios_backgroundColor="#3e3e3e"
          onValueChange={toggleAODEnabled}
          value={setting.aodEnabled}
        />
      }
    ></SettingItem>
  );
}

const styles = StyleSheet.create({
  profile: {
    width: 36,
    height: 36,
    borderRadius: 18,
    borderWidth: 1,
  },
  logoutAction: {
    flexDirection: "row",
    gap: 1,
    alignItems: "center",
  },
  logoutText: {},
});
