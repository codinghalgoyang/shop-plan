import Header from "@/components/Header";
import ScreenView from "@/components/ScreenView";
import { useEffect, useState } from "react";
import {
  Button,
  Text,
  TextInput,
  View,
  StyleSheet,
  ScrollView,
} from "react-native";
import { useRecoilState, useRecoilValue } from "recoil";
import { Plan, UserInfo } from "@/utils/types";
import { db } from "@/utils/firebaseConfig";
import { addDoc, collection, doc, setDoc, updateDoc } from "firebase/firestore";
import { router } from "expo-router";
import { userInfoState } from "@/atoms/userInfo";

export default function AddPlanScreen() {
  const [userInfo, setUserInfo] = useRecoilState(userInfoState);
  const [title, setTitle] = useState("");
  const [invitedUserInfos, setInvitedUserInfos] = useState<UserInfo[]>([]);

  const addPlan = async () => {
    if (!userInfo) return;

    const plan: Plan = {
      id: "",
      title: title,
      admins: [userInfo.uid],
      planUids: [userInfo.uid],
      planInvitedUids: invitedUserInfos.map((userInfo) => userInfo.uid), // TODO : make invitedUsers state & add!
      items: [],
    };

    try {
      const planDocRef = doc(collection(db, "Plans"));
      plan.id = planDocRef.id;
      setDoc(planDocRef, plan);
      console.log("문서 추가됨:", planDocRef.id);
      const usersDocRef = doc(db, "Users", userInfo.uid);
      const newUserInfo: UserInfo = {
        ...userInfo,
        userPlanIds: [...userInfo.userPlanIds, planDocRef.id],
      };

      await updateDoc(usersDocRef, newUserInfo);
      setUserInfo(newUserInfo);
      router.back();
    } catch (error) {
      console.error("Error saving user information: ", error);
    }
  };

  return (
    <ScreenView>
      <Header title="AddPlan" enableBackAction />
      <View>
        <Text>Title</Text>
        <TextInput
          style={styles.input}
          placeholder="title"
          value={title}
          onChangeText={setTitle}
          autoCapitalize="none" // 자동 대문자 막기
        />
      </View>
      <View>
        <Text>Users</Text>
        <ScrollView>
          {
            <View key={userInfo?.uid}>
              <Text>{userInfo?.username}</Text>
            </View>
          }
          {invitedUserInfos.map((userInfo) => {
            return (
              <View key={userInfo.uid}>
                <Text>{userInfo.username}</Text>
              </View>
            );
          })}
        </ScrollView>
      </View>
      <Button title="Add Plan" onPress={addPlan} />
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
