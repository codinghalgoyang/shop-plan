import { StyleSheet, View } from "react-native";
import ThemedTextInput from "../Common/ThemedTextInput";
import { Colors } from "@/utils/Colors";
import ThemedTextButton from "../Common/ThemedTextButton";
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
import { planViewStatusState } from "@/atoms/planViewStatusAtom";
import { useEffect, useState } from "react";
import {
  firestoreAddPlanItem,
  firestoreUpdatePlanItem,
  firestoreAddCategory,
  firestoreEditCategory,
} from "@/utils/api";
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
  const [text, setText] = useState("");
  const activatedItemGroup = plan.itemGroups.find(
    (itemGroup) => itemGroup.id == planViewStatus.activatedItemGroupId
  );
  if (!activatedItemGroup) {
    return null;
  }

  const addNewItem = async () => {
    try {
      const targetItemGroup = plan.itemGroups.find(
        (itemGroup) => itemGroup.id == planViewStatus.activatedItemGroupId
      );
      if (!targetItemGroup)
        throw new Error(
          `Can't find targetItemGroup: ${planViewStatus.activatedItemGroupId}`
        );

      await firestoreAddPlanItem(
        plan,
        targetItemGroup.category,
        text,
        user.username
      );
      setText("");
    } catch (error) {
      setModal({
        visible: true,
        title: "서버 통신 에러",
        message: `서버와 연결상태가 좋지 않습니다. (${error})`,
      });
    }
  };

  const backToAddItemMode = () => {
    setPlanViewStatus((prev) => {
      return {
        planViewMode: "ADD_ITEM",
        activatedItemGroupId: prev.activatedItemGroupId,
        editingItemInfo: { category: "", item: null },
        editingCategoryInfo: { category: "", itemGroupId: "" },
      };
    });
    setText("");
  };

  const submitEditItem = async () => {
    if (!planViewStatus.editingItemInfo.item) return;

    try {
      await firestoreUpdatePlanItem(
        plan,
        planViewStatus.editingItemInfo.category,
        planViewStatus.editingItemInfo.item.id || "",
        { ...planViewStatus.editingItemInfo.item, title: text }
      );
      backToAddItemMode();
    } catch (error) {
      setModal({
        visible: true,
        title: "서버 통신 에러",
        message: `서버와 연결상태가 좋지 않습니다. (${error})`,
      });
    }
  };

  const submitAddCategory = async () => {
    try {
      const itemGroupId = await firestoreAddCategory(plan, text);
      setPlanViewStatus((prev) => {
        return {
          planViewMode: "ADD_ITEM",
          activatedItemGroupId: itemGroupId,
          editingItemInfo: { category: "", item: null },
          editingCategoryInfo: { category: "", itemGroupId: "" },
        };
      });
      setText("");
    } catch (error) {
      setModal({
        visible: true,
        title: "서버 통신 에러",
        message: `서버와 연결상태가 좋지 않습니다. (${error})`,
      });
    }
  };

  const submitEditCategory = async () => {
    try {
      await firestoreEditCategory(
        plan,
        text,
        planViewStatus.editingCategoryInfo.itemGroupId
      );
      setPlanViewStatus((prev) => {
        return {
          planViewMode: "ADD_ITEM",
          activatedItemGroupId: prev.activatedItemGroupId,
          editingItemInfo: { category: "", item: null },
          editingCategoryInfo: { category: "", itemGroupId: "" },
        };
      });
      setText("");
    } catch (error) {
      setModal({
        visible: true,
        title: "서버 통신 에러",
        message: `서버와 연결상태가 좋지 않습니다. (${error})`,
      });
    }
  };

  useEffect(() => {
    // planViewMode가 변경되면 mode에 따라 text를 초기화
    if (planViewStatus.planViewMode == "EDIT_ITEM") {
      const editingItemInfo = planViewStatus.editingItemInfo;
      const targetItemGroup = plan.itemGroups.find(
        (itemGroup) => itemGroup.category == editingItemInfo.category
      );
      if (targetItemGroup) {
        const targetItem = targetItemGroup?.items.find(
          (item) => item.id == editingItemInfo.item?.id
        );
        if (targetItem) {
          setText(targetItem.title);
        }
      }
    } else if (planViewStatus.planViewMode == "EDIT_CATEGORY") {
      setText(planViewStatus.editingCategoryInfo.category);
    } else {
      setText("");
    }
  }, [planViewStatus.planViewMode]);

  return planViewStatus.planViewMode == "ADD_ITEM" ? (
    <View style={styles.container}>
      <ThemedTextInput
        style={styles.input}
        value={text}
        onChangeText={setText}
        placeholder={`'#${activatedItemGroup.category}' 항목 입력`}
      />
      <ThemedTextButton
        onPress={addNewItem}
        type="fill"
        color={text !== "" ? "orange" : "gray"}
        disabled={text == ""}
        buttonStyle={{ marginRight: 8 }}
      >
        추가
      </ThemedTextButton>
    </View>
  ) : planViewStatus.planViewMode == "EDIT_ITEM" ? (
    <View style={styles.container}>
      <ThemedTextInput
        style={styles.input}
        value={text}
        onChangeText={setText}
        placeholder={`'#${activatedItemGroup.category}' 항목 입력`}
      />
      <ThemedTextButton
        onPress={submitEditItem}
        type="fill"
        color={
          text !== "" && text !== planViewStatus.editingItemInfo.item?.title
            ? "orange"
            : "gray"
        }
        disabled={
          text !== "" && text == planViewStatus.editingItemInfo.item?.title
        }
        buttonStyle={{ marginRight: 6 }}
      >
        변경
      </ThemedTextButton>
      <ThemedTextButton
        onPress={backToAddItemMode}
        type="fill"
        color="gray"
        buttonStyle={{ marginRight: 8 }}
      >
        취소
      </ThemedTextButton>
    </View>
  ) : planViewStatus.planViewMode == "ADD_CATEGORY" ? (
    <View style={styles.container}>
      <ThemedTextInput
        style={styles.input}
        value={text}
        onChangeText={setText}
        placeholder={`새로 추가할 분류(카테고리) 입력`}
      />
      <ThemedTextButton
        onPress={submitAddCategory}
        type="fill"
        color={text !== "" ? "orange" : "gray"}
        disabled={text !== ""}
        buttonStyle={{ marginRight: 6 }}
      >
        추가
      </ThemedTextButton>
      <ThemedTextButton
        onPress={backToAddItemMode}
        type="fill"
        color="gray"
        buttonStyle={{ marginRight: 8 }}
      >
        취소
      </ThemedTextButton>
    </View>
  ) : planViewStatus.planViewMode == "EDIT_CATEGORY" ? (
    <View style={styles.container}>
      <ThemedTextInput
        style={styles.input}
        value={text}
        onChangeText={setText}
        placeholder={`변경될 분류(카테고리) 입력`}
      />
      <ThemedTextButton
        onPress={submitEditCategory}
        type="fill"
        color={
          text !== "" && text !== planViewStatus.editingCategoryInfo.category
            ? "orange"
            : "gray"
        }
        disabled={
          text !== "" && text !== planViewStatus.editingCategoryInfo.category
        }
        buttonStyle={{ marginRight: 6 }}
      >
        변경
      </ThemedTextButton>
      <ThemedTextButton
        onPress={backToAddItemMode}
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
