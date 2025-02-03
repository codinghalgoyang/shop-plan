import { userState } from "@/atoms/userAtom";
import { GoogleSignin } from "@react-native-google-signin/google-signin";
import { router } from "expo-router";
import { Button, StyleSheet, Text, View } from "react-native";
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
    <View style={styles.container}>
      {user && <Text>{JSON.stringify(user.user)}</Text>}
      <Text>Home Screen</Text>
      <Button title="Logout" onPress={logout} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
