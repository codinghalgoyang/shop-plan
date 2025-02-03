import { userState } from "@/atoms/userAtom";
import Container from "@/components/Container";
import Header from "@/components/Header";
import { GoogleSignin } from "@react-native-google-signin/google-signin";
import { router } from "expo-router";
import { Button, Text } from "react-native";
import { useRecoilState } from "recoil";

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
      <Header title="ShopPlan" />
      {user && <Text>{JSON.stringify(user.user)}</Text>}
      <Text>Home Screen</Text>
      <Button title="Logout" onPress={logout} />
    </Container>
  );
}
