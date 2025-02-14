import { PlanItem } from "@/utils/types";
import Checkbox from "expo-checkbox";

import React from "react";
import { StyleSheet, View, Text, Switch } from "react-native";

interface PlanItemViewProps {
  planItem: PlanItem;
}

export default function PlanItemView({ planItem }: PlanItemViewProps) {
  return (
    <View style={styles.container}>
      <Checkbox value={planItem.checked} onValueChange={() => {}} />
      <Text style={styles.title}>{planItem.title}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    gap: 10,
  },
  title: {
    fontSize: 18,
  },
});
