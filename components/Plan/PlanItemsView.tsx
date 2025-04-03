import { Plan } from "@/utils/types";
import { ScrollView, TouchableOpacity, View } from "react-native";
import ThemedText from "../Common/ThemedText";
import Paper from "../Common/Paper";
import PlanItemView from "./PlanItemView";
import { Colors } from "@/utils/Colors";

interface PlanItemsViewProps {
  plan: Plan;
}

export default function PlanItemsView({ plan }: PlanItemsViewProps) {
  return (
    <ScrollView contentContainerStyle={{ gap: 8 }}>
      {plan.itemGroups.map((itemGroup) => {
        return (
          <View key={itemGroup.category}>
            <TouchableOpacity onPress={() => {}}>
              <View
                style={{
                  borderBottomWidth: 0.5,
                  borderColor: Colors.border,
                  paddingVertical: 8,
                }}
              >
                <ThemedText color="gray" style={{ marginLeft: 12 }}>
                  {`#${itemGroup.category}`}
                </ThemedText>
              </View>
            </TouchableOpacity>
            <Paper>
              {itemGroup.items.map((item) => {
                if (item.checked) return null;
                return (
                  <PlanItemView
                    key={item.title + item.createdAt}
                    plan={plan}
                    category={itemGroup.category}
                    item={item}
                  />
                );
              })}
              {itemGroup.items.map((item) => {
                if (!item.checked) return null;
                return (
                  <PlanItemView
                    key={item.title + item.createdAt}
                    plan={plan}
                    category={itemGroup.category}
                    item={item}
                  />
                );
              })}
            </Paper>
          </View>
        );
      })}
    </ScrollView>
  );
}
