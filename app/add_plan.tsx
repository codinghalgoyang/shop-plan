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
import { Plan, PlanUserInfos, UserInfo } from "@/utils/types";
import { db } from "@/utils/firebaseConfig";
import { addDoc, collection, doc, setDoc, updateDoc } from "firebase/firestore";
import { router } from "expo-router";
import { userInfoState } from "@/atoms/userInfo";
import ModifyMemberView from "@/components/ModifyMemberView";

export default function AddPlanScreen() {
  const [userInfo, setUserInfo] = useRecoilState(userInfoState);
  const [title, setTitle] = useState("");
  const [newPlanUserInfos, setNewPlanUserInfos] = useState<PlanUserInfos>();

  useEffect(() => {
    if (!userInfo) return;

    setNewPlanUserInfos({
      admins: [userInfo.uid],
      planUsers: [{ uid: userInfo.uid, username: userInfo.username }],
      planInvitedUsers: [],
    });
  }, []);

  const addPlan = async () => {
    if (!userInfo) return;

    try {
      const planDocRef = doc(collection(db, "Plans"));
      const plan: Plan = {
        id: planDocRef.id,
        title: title,
        ...newPlanUserInfos,
      } as Plan;

      setDoc(planDocRef, plan);
      console.log("문서 추가됨:", planDocRef.id);

      const usersDocRef = doc(db, "Users", userInfo.uid);
      const newUserInfo: UserInfo = {
        ...userInfo,
        userPlanIds: [...userInfo.userPlanIds, planDocRef.id],
      };
      await updateDoc(usersDocRef, newUserInfo);
      setUserInfo(newUserInfo);

      // TODO : newInvitedUser doc update
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
      <ModifyMemberView
        userInfo={userInfo}
        newPlan={newPlan}
        setNewPlan={setNewPlan}
      />
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
