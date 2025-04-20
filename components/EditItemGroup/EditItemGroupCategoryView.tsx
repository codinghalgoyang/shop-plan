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

interface PlanCategoryViewProps {
  plan: Plan;
  itemGroup: ItemGroup;
  editingItemGroup: ItemGroup;
  hasMultipleItemGroup: boolean;
}

export default function PlanCategoryView({
  plan,
  itemGroup,
  editingItemGroup,
  hasMultipleItemGroup,
}: PlanCategoryViewProps) {
  const setModal = useSetRecoilState(modalState);

  if (!hasMultipleItemGroup) {
    return (
      <View style={{ borderColor: Colors.border, borderBottomWidth: 0.5 }} />
    );
  }
  const amICategoryNoneGroup = itemGroup.category === "";
  const amIEditing = itemGroup.id === editingItemGroup.id;

  const onDeletePress = () => {
    setModal({
      visible: true,
      title: "카테고리 삭제 확인",
      message: `'${editingItemGroup.category}' 카테고리 안에 있는 모든 항목도 함께 삭제됩니다.`,
      onConfirm: async () => {
        try {
          router.back();
          await firestoreDeleteItemGroup(plan, editingItemGroup.id);
        } catch (error) {
          setModal({
            visible: true,
            title: "서버 통신 에러",
            message: `서버와 연결상태가 좋지 않습니다. (${error})`,
          });
        }
      },
      onCancel: () => {},
    });
  };

  return (
    <View style={styles.container}>
      <ThemedText
        color={amIEditing ? "orange" : "gray"}
        style={{ marginLeft: 16 }}
      >
        {amICategoryNoneGroup
          ? "카테고리없음"
          : amIEditing
          ? `#${itemGroup.category} (수정중)`
          : `#${itemGroup.category}`}
      </ThemedText>
      {amIEditing && (
        <ThemedTextButton color={"orange"} onPress={onDeletePress}>
          삭제
        </ThemedTextButton>
      )}
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
