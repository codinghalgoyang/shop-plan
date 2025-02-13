import { googleUserState } from "@/atoms/googleUserAtom";
import { shopPlanUserState } from "@/atoms/shopPlanUserAtom";
import Header from "@/components/Header";
import ScreenView from "@/components/ScreenView";
import { db } from "@/utils/firebaseConfig";
import { ShopPlanUser } from "@/utils/types";
import { router } from "expo-router";
import { doc, setDoc } from "firebase/firestore";
import { useState } from "react";
import { StyleSheet, Text, Button, TextInput } from "react-native";
import { useRecoilValue, useSetRecoilState } from "recoil";

export default function SignupScreen() {
  const googleUser = useRecoilValue(googleUserState);
  const setShopPlanUser = useSetRecoilState(shopPlanUserState);
  const [username, setUsername] = useState("");

  const signup = async () => {
    if (!username) {
      console.log("Input username");
      return;
    }

    if (!googleUser?.user) {
      return;
    }

    // TODO: username 검사

    const saveUserInfo = async () => {
      const shopPlanUser: ShopPlanUser = {
        uid: googleUser.user.id,
        email: googleUser.user.email,
        photo: googleUser.user.photo || "",
        username: username,
        agreed: true,
        plans: [],
        invitedPlanIds: [],
        defaultNotificationEnabled: {
          all: true,
          modifyItem: true,
          checkedItem: false,
          modifyUser: true,
          planInvite: true,
        },
        notifications: [],
        aodEnabled: false,
      };

      try {
        const uid = googleUser?.user.id as string;
        const docRef = doc(db, "Users", uid);
        await setDoc(docRef, shopPlanUser);
        console.log("User information saved successfully!");
        setShopPlanUser(shopPlanUser);
        router.replace("/home");
      } catch (error) {
        console.error("Error saving user information: ", error);
      }
    };
    await saveUserInfo();
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
