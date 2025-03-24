import { router } from "expo-router";
import { StyleSheet, View } from "react-native";
import ThemedText from "../Common/ThemedText";
import { PlanUser } from "@/utils/types";
import ThemedTextButton from "../Common/ThemedTextButton";
import { plansState } from "@/atoms/plansAtom";
import { useRecoilValue } from "recoil";

interface HomePlanTitleProps {
  title: string;
  users: PlanUser[];
  index?: number;
}

export default function HomePlanTitle({
  title,
  users,
  index,
}: HomePlanTitleProps) {
  const plans = useRecoilValue(plansState);

  return (
    <View style={styles.container}>
      <View style={{ flexDirection: "row" }}>
        <ThemedText weight="bold" numberOfLines={1} style={{ flex: 1 }}>
          {title}
        </ThemedText>
        {index !== undefined && (
          <ThemedTextButton
            size="small"
            color="gray"
            buttonStyle={styles.editButton}
            onPress={() => {
              router.push(`/edit_plan?plan_id=${plans[index].id}`);
            }}
          >
            편집
          </ThemedTextButton>
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
