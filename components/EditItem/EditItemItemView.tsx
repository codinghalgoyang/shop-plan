import { firestoreRemoveSpecificPlanItem } from "@/utils/api";
import { Item, Plan } from "@/utils/types";
import React from "react";
import { StyleSheet, View, StyleProp, TextStyle } from "react-native";
import ThemedText from "../Common/ThemedText";
import { Colors } from "@/utils/Colors";
import ThemedCheckbox from "../Common/ThemedCheckbox";
import ThemedTextButton from "../Common/ThemedTextButton";
import { modalState } from "@/atoms/modalAtom";
import { useSetRecoilState } from "recoil";
import { ITEM_HEIGHT } from "@/utils/Shapes";
import Paper from "../Common/Paper";
import { router } from "expo-router";

interface EditItemItemViewProps {
  plan: Plan;
  item: Item;
  editingItem: Item;
}

export default function EditItemItemView({
  plan,
  item,
  editingItem,
}: EditItemItemViewProps) {
  const setModal = useSetRecoilState(modalState);
  const amIEditing = item.id === editingItem.id;

  const onDeletePress = async () => {
    try {
      router.back();
      await firestoreRemoveSpecificPlanItem(plan, item.itemGroupId, item.id);
    } catch (error) {
      setModal({
        visible: true,
        title: "서버 통신 에러",
        message: `서버와 연결상태가 좋지 않습니다. (${error})`,
      });
    }
  };

  const titleStyle: StyleProp<TextStyle> = {
    flex: 1,
    textDecorationLine: item.checked ? "line-through" : "none",
  };

  // return null
  if (!item) {
    return null;
  }
  return (
    <Paper>
      <View style={styles.container}>
        <ThemedCheckbox
          value={item.checked}
          disabled={true}
          onValueChange={() => {}}
        />
        <View style={styles.contentContainer}>
          <ThemedText
            color={amIEditing ? "orange" : "gray"}
            style={titleStyle}
            numberOfLines={1}
          >
            {amIEditing ? `${item.title} (수정중)` : item.title}
          </ThemedText>
          <View style={styles.buttonContainer}>
            {item.link && (
              <ThemedTextButton color={"gray"} disabled={true}>
                링크
              </ThemedTextButton>
            )}
            {amIEditing && (
              <ThemedTextButton color={"orange"} onPress={onDeletePress}>
                삭제
              </ThemedTextButton>
            )}
          </View>
        </View>
      </View>
    </Paper>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    borderBottomWidth: 0.5,
    borderColor: Colors.border,
  },
  contentContainer: {
    flex: 1,
    paddingRight: 8,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    height: ITEM_HEIGHT,
  },
  buttonContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
});
