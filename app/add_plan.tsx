import { shopPlanUserState } from "@/atoms/shopPlanUserAtom";
import Header from "@/components/Header";
import ScreenView from "@/components/ScreenView";
import { ShopPlanUser } from "@/utils/types";
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
import { Plan } from "@/utils/types";
import { db } from "@/utils/firebaseConfig";
import { addDoc, collection, doc, updateDoc } from "firebase/firestore";
import { router } from "expo-router";

export default function AddPlanScreen() {
  const [shopPlanUser, setShopPlanUser] = useRecoilState(shopPlanUserState);
  const [title, setTitle] = useState("");
  const [invitedUsers, setInvitedUsers] = useState<ShopPlanUser[]>([]);

  const addPlan = async () => {
    if (!shopPlanUser) return;

    const plan: Plan = {
      title: title,
      admins: [shopPlanUser.uid],
      uids: [shopPlanUser.uid],
      invitedUids: invitedUsers.map((user) => user.uid), // TODO : make invitedUsers state & add!
      items: [],
    };

    try {
      const plansDocRef = await addDoc(collection(db, "Plans"), plan);
      console.log("문서 추가됨:", plansDocRef.id);
      const usersDocRef = doc(db, "Users", shopPlanUser.uid);
      const newShopPlanUser: ShopPlanUser = {
        ...shopPlanUser,
        plans: [
          ...shopPlanUser.plans,
          {
            planId: plansDocRef.id,
            notificationEnabled: true,
            customTitle: "",
          },
        ],
      };

      await updateDoc(usersDocRef, newShopPlanUser);
      setShopPlanUser(newShopPlanUser);
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
            <View key={shopPlanUser?.uid}>
              <Text>{shopPlanUser?.username}</Text>
            </View>
          }
          {invitedUsers.map((user) => {
            return (
              <View key={user.uid}>
                <Text>{user.username}</Text>
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
