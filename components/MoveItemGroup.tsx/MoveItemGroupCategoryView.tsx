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

interface MoveItemGroupCategoryViewProps {
  plan: Plan;
  itemGroup: ItemGroup;
  movingItemGroup: ItemGroup;
  hasMultipleItemGroup: boolean;
}

export default function MoveItemGroupCategoryView({
  plan,
  itemGroup,
  movingItemGroup,
  hasMultipleItemGroup,
}: MoveItemGroupCategoryViewProps) {
  const setModal = useSetRecoilState(modalState);

  if (!hasMultipleItemGroup) {
    return (
      <View style={{ borderColor: Colors.border, borderBottomWidth: 0.5 }} />
    );
  }
  const amICategoryNoneGroup = itemGroup.category === "";
  const amIMoving = itemGroup.id === movingItemGroup.id;

  return (
    <View style={styles.container}>
      <ThemedText
        color={amIMoving ? "orange" : "gray"}
        style={{ marginLeft: 16 }}
      >
        {amICategoryNoneGroup ? "카테고리없음" : `#${itemGroup.category}`}
      </ThemedText>
    </View>
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
