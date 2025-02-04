import { userState } from "@/atoms/userAtom";
import Container from "@/components/Container";
import Header from "@/components/Header";
import { GoogleSignin } from "@react-native-google-signin/google-signin";
import { router } from "expo-router";
import { Button, Text, TouchableOpacity } from "react-native";
import { useRecoilState } from "recoil";
import Ionicons from "@expo/vector-icons/Ionicons";
import HeaderAction from "@/components/HeaderAction";

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
  const [user, setUser] = useRecoilState(userState);

  const logout = () => {
    setUser(null);
    GoogleSignin.revokeAccess();
    GoogleSignin.signOut();
    router.replace("/login");
  };

  return (
    <Container>
      <Header title="ShopPlan" actions={[settingAction]} />
      {user && <Text>{JSON.stringify(user.user)}</Text>}
      <Text>Home Screen</Text>
      <Button title="Logout" onPress={logout} />
    </Container>
  );
}
