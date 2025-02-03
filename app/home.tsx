import { userState } from "@/atoms/userAtom";
import Container from "@/components/Container";
import Header from "@/components/Header";
import { GoogleSignin } from "@react-native-google-signin/google-signin";
import { router } from "expo-router";
import { Button, Text, TouchableOpacity } from "react-native";
import { useRecoilState } from "recoil";
import Ionicons from "@expo/vector-icons/Ionicons";

const settingButton = (
  <TouchableOpacity
    key="setting-button"
    onPress={() => {
      router.push("/setting");
    }}
  >
    <Ionicons name="settings-outline" size={24} color="black" />
  </TouchableOpacity>
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
      <Header title="ShopPlan" actions={[settingButton]} />
      {user && <Text>{JSON.stringify(user.user)}</Text>}
      <Text>Home Screen</Text>
      <Button title="Logout" onPress={logout} />
    </Container>
  );
}
