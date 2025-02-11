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
import { useRecoilValue } from "recoil";

export default function AddPlanScreen() {
  const shopPlanUser = useRecoilValue(shopPlanUserState);
  const [title, setTitle] = useState("");
  const [users, setUsers] = useState<ShopPlanUser[]>([]);

  useEffect(() => {
    if (shopPlanUser) {
      setUsers([shopPlanUser]);
    }
  }, []);

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
          {users.map((user) => {
            return (
              <View key={user.uid}>
                <Text>{user.username}</Text>
              </View>
            );
          })}
        </ScrollView>
      </View>
      <Button title="Add Plan" />
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
