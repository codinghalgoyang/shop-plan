import { Colors } from "@/utils/Colors";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import ThemedText from "../Common/ThemedText";
import { Plan, ItemGroup, Item } from "@/utils/types";
import { modalState } from "@/atoms/modalAtom";
import { useSetRecoilState } from "recoil";
import {
  firestoreChangeItemGroup,
  firestoreDeleteItemGroup,
} from "@/utils/api";
import { ITEM_HEIGHT } from "@/utils/Shapes";
import ThemedTextButton from "../Common/ThemedTextButton";
import { router } from "expo-router";
import { Dispatch, SetStateAction, useState } from "react";
import { Target } from "@/app/plan";

interface MoveItemGroupCategoryViewProps {
  itemGroup: ItemGroup;
  hasMultipleItemGroup: boolean;
  drag: () => void;
  moveTarget: Target;
  setMoveTarget: Dispatch<SetStateAction<Target>>;
}

export default function MoveItemGroupCategoryView({
  itemGroup,
  hasMultipleItemGroup,
  drag,
  moveTarget,
  setMoveTarget,
}: MoveItemGroupCategoryViewProps) {
  const setModal = useSetRecoilState(modalState);
  const amIMoving = moveTarget?.itemGroupId === itemGroup.id;

  if (!hasMultipleItemGroup) {
    return (
      <View style={{ borderColor: Colors.border, borderBottomWidth: 0.5 }} />
    );
  }
  const amICategoryNoneGroup = itemGroup.category === "";

  return (
    <TouchableOpacity
      onLongPress={() => {
        setMoveTarget({
          type: "ITEM_GROUP",
          itemGroupId: itemGroup.id,
          itemId: null,
        });
        drag();
      }}
      disabled={amICategoryNoneGroup}
    >
      <View
        style={[
          styles.container,
          {
            backgroundColor: amIMoving
              ? Colors.orange
              : Colors.background.white,
          },
        ]}
      >
        <ThemedText
          color={amIMoving ? "white" : "gray"}
          style={{ marginLeft: 16 }}
        >
          {amICategoryNoneGroup ? "카테고리없음" : `#${itemGroup.category}`}
        </ThemedText>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderBottomWidth: 0.5,
    borderColor: Colors.border,
    height: ITEM_HEIGHT,
  },
});
