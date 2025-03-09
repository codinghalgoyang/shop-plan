import { firestoreUpdatePlanItem } from "@/utils/api";
import { Plan, PlanItem } from "@/utils/types";
import React from "react";
import {
  StyleSheet,
  View,
  Text,
  Linking,
  TouchableOpacity,
} from "react-native";
import ThemedText from "../Common/ThemedText";
import { Colors } from "@/utils/Colors";
import ThemedCheckbox from "../Common/ThemedCheckbox";

interface PlanItemViewProps {
  plan: Plan;
  itemIdx: number;
}

export default function PlanItemView({ plan, itemIdx }: PlanItemViewProps) {
  const planItem = plan.items[itemIdx];
  const onCheckedChange = async (checked: boolean) => {
    const originItem = plan.items[itemIdx];
    await firestoreUpdatePlanItem(plan, itemIdx, {
      ...originItem,
      checked: !originItem.checked,
    } as PlanItem);
  };

  const onLinkPress = async () => {
    const url = planItem.link || ""; // 열고 싶은 URL
    const supported = await Linking.canOpenURL(url);

    if (supported) {
      await Linking.openURL(url);
    } else {
      console.log("Unsupported URL: " + url);
    }
  };

  return (
    <View style={styles.container}>
      <ThemedCheckbox
        value={planItem.checked}
        onValueChange={onCheckedChange}
      />
      <View>
        {planItem.link ? (
          <TouchableOpacity onPress={onLinkPress}>
            <ThemedText style={[styles.title, styles.linked]}>
              {planItem.title}
            </ThemedText>
          </TouchableOpacity>
        ) : (
          <Text style={styles.title}>{planItem.title}</Text>
        )}
        {planItem.category && (
          <Text style={styles.category}># {planItem.category}</Text>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    marginVertical: 10,
    gap: 10,
  },
  title: {
    fontSize: 18,
  },
  linked: {
    color: Colors.blue,
  },
  category: {
    fontSize: 12,
  },
});
