import { StyleSheet, View } from "react-native";
import ThemedTextInput from "../Common/ThemedTextInput";
import { Colors } from "@/utils/Colors";
import ThemedTextButton from "../Common/ThemedTextButton";
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
import { planViewStatusState } from "@/atoms/planViewStatusAtom";
import { useEffect, useState } from "react";
import { firestoreAddPlanItem, firestoreUpdatePlanItem } from "@/utils/api";
import { Plan } from "@/utils/types";
import { modalState } from "@/atoms/modalAtom";
import { userState } from "@/atoms/userAtom";

interface PlanInputProps {
  plan: Plan;
}

// 편집모드의 경우, onCancel가 존재해야함.
// category 추가, 이름 편집
// item title 추가, 이름 편집
// link 추가, 링크 편집 (빈것 가능)
// item의 category 및 순서 변경은 드래그앤드랍으로 변경
export default function PlanInput({ plan }: PlanInputProps) {
  const setModal = useSetRecoilState(modalState);
  const [planViewStatus, setPlanViewStatus] =
    useRecoilState(planViewStatusState);
  const user = useRecoilValue(userState);
  const [newItemTitle, setNewItemTitle] = useState("");

  const addNewItem = async () => {
    try {
      await firestoreAddPlanItem(
        plan,
        planViewStatus.activatedCategory,
        newItemTitle,
        user.username
      );
      setNewItemTitle("");
    } catch (error) {
      setModal({
        visible: true,
        title: "서버 통신 에러",
        message: `서버와 연결상태가 좋지 않습니다. (${error})`,
      });
    }
  };

  const cancelEditItem = async () => {
    setPlanViewStatus((prev) => {
      return {
        planViewMode: "ADD_ITEM",
        activatedCategory: prev.activatedCategory,
        editItemInfo: { category: "", item: null },
      };
    });
  };

  const submitEditItem = async () => {
    if (!planViewStatus.editItemInfo.item) return;

    try {
      await firestoreUpdatePlanItem(
        plan,
        planViewStatus.editItemInfo.category,
        planViewStatus.editItemInfo.item.id || "",
        { ...planViewStatus.editItemInfo.item, title: newItemTitle }
      );
      setNewItemTitle("");
      await cancelEditItem();
    } catch (error) {
      setModal({
        visible: true,
        title: "서버 통신 에러",
        message: `서버와 연결상태가 좋지 않습니다. (${error})`,
      });
    }
  };

  useEffect(() => {
    if (planViewStatus.planViewMode == "ADD_ITEM") {
      setNewItemTitle("");
    } else if (planViewStatus.planViewMode == "EDIT_ITEM") {
      const editItemInfo = planViewStatus.editItemInfo;
      const targetItemGroup = plan.itemGroups.find(
        (itemGroup) => itemGroup.category == editItemInfo.category
      );
      if (targetItemGroup) {
        const targetItem = targetItemGroup?.items.find(
          (item) => item.id == editItemInfo.item?.id
        );
        if (targetItem) {
          setNewItemTitle(targetItem.title);
        }
      }
    }
  }, [planViewStatus.planViewMode]);

  return planViewStatus.planViewMode == "ADD_ITEM" ? (
    <View style={styles.container}>
      <ThemedTextInput
        style={styles.input}
        value={newItemTitle}
        onChangeText={setNewItemTitle}
        placeholder={`'#${planViewStatus.activatedCategory}' 항목 입력`}
      />
      <ThemedTextButton
        onPress={addNewItem}
        type="fill"
        color={newItemTitle !== "" ? "orange" : "gray"}
        disabled={newItemTitle == ""}
        buttonStyle={{ marginRight: 8 }}
      >
        추가
      </ThemedTextButton>
    </View>
  ) : planViewStatus.planViewMode == "EDIT_ITEM" ? (
    <View style={styles.container}>
      <ThemedTextInput
        style={styles.input}
        value={newItemTitle}
        onChangeText={setNewItemTitle}
        placeholder={`'${planViewStatus.activatedCategory}' 입력`}
      />
      <ThemedTextButton
        onPress={submitEditItem}
        type="fill"
        color={
          newItemTitle !== "" &&
          newItemTitle !== planViewStatus.editItemInfo.item?.title
            ? "orange"
            : "gray"
        }
        disabled={
          newItemTitle !== "" &&
          newItemTitle == planViewStatus.editItemInfo.item?.title
        }
        buttonStyle={{ marginRight: 6 }}
      >
        변경
      </ThemedTextButton>
      <ThemedTextButton
        onPress={cancelEditItem}
        type="fill"
        color="gray"
        buttonStyle={{ marginRight: 8 }}
      >
        취소
      </ThemedTextButton>
    </View>
  ) : null;
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.background.white,
    paddingLeft: 8,
    paddingVertical: 6,
    gap: 0,
    borderTopWidth: 0.5,
    borderColor: Colors.border,
  },
  input: {
    flex: 1,
    marginRight: 8,
  },
});
