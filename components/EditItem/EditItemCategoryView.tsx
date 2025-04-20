import { Colors } from "@/utils/Colors";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import ThemedText from "../Common/ThemedText";
import { Plan, ItemGroup, Item } from "@/utils/types";
import { modalState } from "@/atoms/modalAtom";
import { useSetRecoilState } from "recoil";
import { firestoreChangeItemGroup } from "@/utils/api";
import { ITEM_HEIGHT } from "@/utils/Shapes";

interface PlanCategoryViewProps {
  plan: Plan;
  itemGroup: ItemGroup;
  editingItem: Item;
  hasMultipleItemGroup: boolean;
}

export default function PlanCategoryView({
  plan,
  itemGroup,
  editingItem,
  hasMultipleItemGroup,
}: PlanCategoryViewProps) {
  const setModal = useSetRecoilState(modalState);

  if (!hasMultipleItemGroup) {
    return (
      <View style={{ borderColor: Colors.border, borderBottomWidth: 0.5 }} />
    );
  }
  const amICategoryNoneGroup = itemGroup.category === "";
  const amIEditingTarget = itemGroup.id === editingItem.itemGroupId;

  return (
    <TouchableOpacity
      onPress={async () => {
        if (editingItem.itemGroupId !== itemGroup.id) {
          try {
            await firestoreChangeItemGroup(plan, editingItem.id, itemGroup.id);
            // TODO : Scroll to item?
          } catch (error) {
            setModal({
              visible: true,
              title: "카테고리 변경 실패",
              message: `서버와 연결상태가 좋지 않습니다. (${error})`,
            });
          }
        }
      }}
    >
      <View style={styles.container}>
        <ThemedText
          color={amIEditingTarget ? "orange" : "gray"}
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
