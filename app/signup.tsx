import { userInfoState } from "@/atoms/userInfo";
import Header from "@/components/Header";
import ScreenView from "@/components/ScreenView";
import { db } from "@/utils/firebaseConfig";
import { UserInfo, UserPlanCustomInfo } from "@/utils/types";

import { router, useLocalSearchParams } from "expo-router";
import { doc, setDoc } from "firebase/firestore";
import { useState } from "react";
import { StyleSheet, Text, Button, TextInput } from "react-native";
import { useSetRecoilState } from "recoil";

export default function SignupScreen() {
  const setUserInfo = useSetRecoilState(userInfoState);
  const [username, setUsername] = useState("");
  const { id, email, photo } = useLocalSearchParams();

  const signup = async () => {
    if (!username) {
      console.log("Input username");
      return;
    }

    // TODO: username 검사

    const saveUserInfo = async () => {
      const userInfo: UserInfo = {
        uid: Array.isArray(id) ? id[0] : id,
        email: Array.isArray(email) ? email[0] : email,
        photo: Array.isArray(photo) ? photo[0] : photo || "",
        username: username,
        agreed: true,
        userPlanIds: [],
        userInvitedPlanIds: [],
        userPlanCustomInfos: {},
        notifications: [],
        defaultNotificationEnabled: {
          all: true,
          modifyItem: true,
          checkedItem: false,
          modifyUser: true,
          planInvite: true,
        },
        aodEnabled: false,
      };

      try {
        const uid = id as string;
        const docRef = doc(db, "Users", uid);
        await setDoc(docRef, userInfo);
        console.log("User information saved successfully!");
        setUserInfo(userInfo);
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
