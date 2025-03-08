import { View, TextInput, ScrollView, StyleSheet } from "react-native";
import { useState } from "react";
import { InvitedPlanUser, PlanUser } from "@/utils/types";
import { firestoreFindUser } from "@/utils/api";
import ThemedText from "../Common/ThemedText";
import ThemedTextButton from "@/components/Common/ThemedTextButton";
import ThemedTextInput from "../Common/ThemedTextInput";
import NewPlanMemberView from "./NewPlanMemberView";

interface NewPlanMembersViewProps {
  myPlanUser: PlanUser;
  invitedPlanUsers: InvitedPlanUser[];
  setInvitedPlanUsers: React.Dispatch<React.SetStateAction<InvitedPlanUser[]>>;
}

export default function NewPlanMembersView({
  myPlanUser,
  invitedPlanUsers,
  setInvitedPlanUsers,
}: NewPlanMembersViewProps) {
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

  const removeInvitedPlanUser = (index: number) => {
    const newInvitedPlanUsers: InvitedPlanUser[] = invitedPlanUsers.filter(
      (_, idx) => idx != index
    );
    setInvitedPlanUsers(newInvitedPlanUsers);
  };

  return (
    <View style={styles.container}>
      <View style={styles.userSearchContainer}>
        <ThemedTextInput
          style={styles.userSearchInput}
          placeholder="사용자 검색"
          value={newUsername}
          onChangeText={setNewUsername}
          autoCapitalize="none"
        />
        <ThemedTextButton
          onPress={addInvitedPlanUser}
          color={newUsername == "" ? "gray" : "blue"}
          type="fill"
        >
          초대
        </ThemedTextButton>
      </View>
      <ScrollView contentContainerStyle={{ gap: 4 }}>
        <ThemedText size="small" color="gray">
          관리자
        </ThemedText>
        <NewPlanMemberView userInfo={myPlanUser} />
        {invitedPlanUsers.length !== 0 && (
          <ThemedText size="small" color="gray">
            초대중인 사용자
          </ThemedText>
        )}
        {invitedPlanUsers.map((invitedPlanUser, index) => {
          return (
            <NewPlanMemberView
              key={invitedPlanUser.uid}
              userInfo={invitedPlanUser}
              index={index}
              onRemoveInvitedPlanUser={removeInvitedPlanUser}
            />
          );
        })}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    gap: 8,
  },
  userSearchContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  userSearchInput: {
    flex: 1,
  },
  userAddButton: {},
  headerTitle: {
    fontSize: 24,
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
