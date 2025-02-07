import Header from "@/components/Header";
import { GoogleSignin } from "@react-native-google-signin/google-signin";
import { router } from "expo-router";
import { Text, TouchableOpacity } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import HeaderAction from "@/components/HeaderAction";
import ScreenView from "@/components/ScreenView";

const settingAction = (
  <HeaderAction
    key="setting-action"
    IconComponent={Ionicons}
    iconName="settings-outline"
    onPress={() => {
      router.push("/setting");
    }}
  />
);

export default function HomeScreen() {
  return (
    <ScreenView>
      <Header title="ShopPlan" actions={[settingAction]} />
      <Text>Home Screen</Text>
    </ScreenView>
  );
}
