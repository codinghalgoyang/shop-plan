import {
  firestoreRemoveSpecificPlanItem,
  firestoreUpdatePlanItem,
} from "@/utils/api";
import { Plan, PlanItem } from "@/utils/types";
import React from "react";
import {
  StyleSheet,
  View,
  Text,
  Linking,
  TouchableOpacity,
  StyleProp,
  ViewStyle,
  TextStyle,
} from "react-native";
import ThemedText from "../Common/ThemedText";
import { Colors } from "@/utils/Colors";
import ThemedCheckbox from "../Common/ThemedCheckbox";
import Paper from "../Common/Paper";
import ThemedTextButton from "../Common/ThemedTextButton";

interface PlanItemViewProps {
  plan: Plan;
  itemIdx: number;
  isFirstItem?: boolean;
  setIsPlanItemEdit: React.Dispatch<React.SetStateAction<boolean>>;
  setEditItemIdx: React.Dispatch<React.SetStateAction<number>>;
  isDeleteMode: boolean;
}

export default function PlanItemView({
  plan,
  itemIdx,
  isFirstItem = false,
  setIsPlanItemEdit,
  setEditItemIdx,
  isDeleteMode,
}: PlanItemViewProps) {
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

  const onEditPress = () => {
    setIsPlanItemEdit(true);
    setEditItemIdx(itemIdx);
  };

  const containerStyle: StyleProp<ViewStyle> = {
    flexDirection: "row",
    alignItems: "center",
    borderBottomWidth: 0.5,
    borderColor: Colors.border,
    borderTopWidth: isFirstItem ? 0.5 : 0,
  };

  const titleStyle: StyleProp<TextStyle> = {
    textDecorationLine: planItem.checked ? "line-through" : "none",
  };

  return (
    <View style={containerStyle}>
      <ThemedCheckbox
        value={planItem.checked}
        onValueChange={onCheckedChange}
      />
      <View style={styles.contentContainer}>
        <ThemedText
          color={planItem.checked ? "gray" : "black"}
          style={titleStyle}
        >
          {planItem.title}
        </ThemedText>
        {isDeleteMode ? (
          <ThemedTextButton
            color="orange"
            size="small"
            onPress={() => {
              firestoreRemoveSpecificPlanItem(plan, itemIdx);
            }}
          >
            삭제
          </ThemedTextButton>
        ) : (
          <View style={styles.buttonContainer}>
            {planItem.link && (
              <ThemedTextButton color="blue" size="small" onPress={onLinkPress}>
                링크
              </ThemedTextButton>
            )}
            <ThemedTextButton color="gray" size="small" onPress={onEditPress}>
              편집
            </ThemedTextButton>
          </View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  contentContainer: {
    flex: 1,
    paddingRight: 8,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  buttonContainer: {
    flexDirection: "row",
  },
});
