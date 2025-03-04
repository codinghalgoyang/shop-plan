import { View, TextInput, ScrollView, StyleSheet } from "react-native";
import Feather from "@expo/vector-icons/Feather";
import Fontisto from "@expo/vector-icons/Fontisto";
import { useState } from "react";
import { InvitedPlanUser, PlanUser } from "@/utils/types";
import { firestoreFindUser } from "@/utils/api";
import ThemedText from "../Common/ThemedText";
import ThemedTextButton from "@/components/Common/ThemedTextButton";
import ThemedIcon from "../Common/ThemedIcon";

interface AddPlanMembersViewProps {
  planUsers: PlanUser[];
  invitedPlanUsers: InvitedPlanUser[];
  setInvitedPlanUsers: React.Dispatch<React.SetStateAction<InvitedPlanUser[]>>;
}

export default function AddPlanMembersView({
  planUsers,
  invitedPlanUsers,
  setInvitedPlanUsers,
}: AddPlanMembersViewProps) {
  const [newUsername, setNewUsername] = useState("");

  const addInvitedPlanUser = async () => {
    const user = await firestoreFindUser(newUsername);
    setNewUsername("");
    if (user) {
      setInvitedPlanUsers((prev) => {
        return [...prev, { uid: user.uid, username: user.username }];
      });
    } else {
      console.log("can't find username : ", newUsername);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <ThemedText style={styles.headerTitle}>Members</ThemedText>
        <View style={styles.userSearchContainer}>
          <ThemedIcon
            IconComponent={Feather}
            iconName="user-plus"
            style={{ fontSize: 24 }}
          />
          <TextInput
            style={styles.userSearchInput}
            placeholder="new username"
            value={newUsername}
            onChangeText={setNewUsername}
            autoCapitalize="none"
          />
          <ThemedTextButton onPress={addInvitedPlanUser}>추가</ThemedTextButton>
        </View>
      </View>
      <ScrollView style={styles.scrollView}>
        {planUsers.map((planUser) => {
          return (
            <View key={planUser.uid} style={styles.userContainer}>
              <ThemedText style={styles.username}>
                {planUser.username}
              </ThemedText>
              {planUser.isAdmin && (
                <Fontisto name="star" size={20} color="green" />
              )}
            </View>
          );
        })}
        {invitedPlanUsers.map((invitedPlanUser) => {
          return (
            <View key={invitedPlanUser.uid} style={styles.userContainer}>
              <ThemedText style={styles.username}>
                {invitedPlanUser.username}
              </ThemedText>
              <ThemedText>초대중</ThemedText>
            </View>
          );
        })}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {},
  headerContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 5,
    alignItems: "center",
  },
  userSearchContainer: {
    flexDirection: "row",
    flex: 1,
    alignItems: "center",
    justifyContent: "flex-end",
    gap: 5,
  },
  userSearchInput: {
    borderColor: "gray",
    borderWidth: 1,
    paddingHorizontal: 8,
    width: "50%",
  },
  userAddButton: {},
  headerTitle: {
    fontSize: 24,
  },
  scrollView: {
    padding: 5,
  },
  userContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
  },
  username: {
    fontSize: 20,
  },
});
