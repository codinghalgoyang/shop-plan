import { googleUserState } from "@/atoms/googleUserAtom";
import Header from "@/components/Header";
import ScreenView from "@/components/ScreenView";
import { useState } from "react";
import { StyleSheet, Text, Button, TextInput } from "react-native";
import { useRecoilValue } from "recoil";

export default function SignupScreen() {
  const googleUser = useRecoilValue(googleUserState);
  const [username, setUsername] = useState("");

  const signup = () => {
    if (!username) {
      console.log("Input username");
      return;
    }
    console.log("sign up with ", username);
  };

  return (
    <ScreenView>
      <Header title="SignUp" />
      <Text>username</Text>
      <TextInput
        style={styles.input}
        placeholder="username"
        value={username}
        onChangeText={setUsername}
        autoCapitalize="none" // 자동 대문자 막기
      />
      <Button title={"Sign Up"} onPress={signup} />
    </ScreenView>
  );
}

const styles = StyleSheet.create({
  input: {
    height: 40,
    borderColor: "gray",
    borderWidth: 1,
    marginBottom: 12,
    paddingHorizontal: 8,
  },
});
