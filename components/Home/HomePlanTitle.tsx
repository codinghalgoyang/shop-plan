import { router } from "expo-router";
import { StyleSheet, View } from "react-native";
import ThemedText from "../Common/ThemedText";
import { PlanUser } from "@/utils/types";
import { plansState } from "@/atoms/plansAtom";
import { useRecoilValue } from "recoil";
import ThemedIconButton from "../Common/ThemedIconButton";
import Feather from "@expo/vector-icons/Feather";

interface HomePlanTitleProps {
  title: string;
  users: PlanUser[];
  planId?: string;
}

export default function HomePlanTitle({
  title,
  users,
  planId,
}: HomePlanTitleProps) {
  const plans = useRecoilValue(plansState);

  return (
    <View style={styles.container}>
      <View style={{ flexDirection: "row" }}>
        <ThemedText weight="bold" numberOfLines={1} style={{ flex: 1 }}>
          {title}
        </ThemedText>
        {planId !== undefined && (
          <ThemedIconButton
            IconComponent={Feather}
            iconName="more-horizontal"
            color={"gray"}
            style={{ marginRight: -8, marginTop: -8 }}
            onPress={() => {
              router.push(`/edit_plan?plan_id=${planId}`);
            }}
          />
        )}
      </View>
      <View style={styles.usersContainer}>
        <ThemedText size="small" color="gray">
          with
        </ThemedText>
        {users.map((planUser, i) => {
          if (i == 0) {
            return (
              <ThemedText key={planUser.uid} color="gray" size="small">
                {planUser.username}
              </ThemedText>
            );
          } else if (i == 1) {
            return (
              <ThemedText key={planUser.uid} color="gray" size="small">
                {`외 ${users.length - 1}명`}
              </ThemedText>
            );
          } else {
            return null;
          }
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { gap: 0, flex: 1 },
  usersContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    marginLeft: 1,
  },
  editButton: {
    marginTop: -4,
    marginRight: -8,
  },
});
