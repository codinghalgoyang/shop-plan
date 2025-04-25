import { Plan } from "@/utils/types";
import Header from "../Common/Header";
import ThemedIconTextButton from "../Common/ThemedIconTextButton";
import AntDesign from "@expo/vector-icons/AntDesign";
import { modalState } from "@/atoms/modalAtom";
import {
  firestoreUncheckAllItems,
  firestoreCheckAllItems,
  firestoreRemoveCheckedPlanItem,
  firestoreInitializePlanItems,
} from "@/utils/api";
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
import { Item } from "@/utils/types";
import { editTargetState } from "@/atoms/editTargetAtom";
import { findItem, findItemGroup } from "@/utils/utils";
import { router } from "expo-router";

interface PlanHeaderProps {
  plan: Plan;
}

export default function PlanHeader({ plan }: PlanHeaderProps) {
  const setModal = useSetRecoilState(modalState);
  const [editTarget, setEditTarget] = useRecoilState(editTargetState);

  const allItems: Item[] = plan.itemGroups.flatMap(
    (itemGroup) => itemGroup.items
  );
  const isAllItemChecked = allItems.filter((item) => !item.checked).length == 0;
  const areButtonsDisabled = allItems.length == 0;
  const editingItem =
    editTarget?.type === "ITEM"
      ? findItem(plan, editTarget.itemId || "")
      : null;
  const edtingItemGroup =
    editTarget?.type === "ITEM_GROUP"
      ? findItemGroup(plan, editTarget.itemGroupId)
      : null;

  const title = !editTarget
    ? plan?.title
    : editTarget.type === "ITEM"
    ? `항목 수정`
    : `카테고리 수정`;

  const onBack = () => {
    if (editTarget) {
      setEditTarget(null);
    } else {
      router.back();
    }
  };

  return (
    <Header
      color={editTarget ? "orange" : "white"}
      title={title}
      enableBackAction
      onBack={onBack}
    >
      {!editTarget && (
        <ThemedIconTextButton
          IconComponent={AntDesign}
          iconName={"retweet"}
          title={"초기화"}
          disabled={areButtonsDisabled && plan.itemGroups.length === 1}
          color={
            areButtonsDisabled && plan.itemGroups.length === 1
              ? "gray"
              : "black"
          }
          onPress={() => {
            setModal({
              visible: true,
              title: "플랜 초기화",
              message: "모든 카테고리와 항목들이 삭제됩니다",
              onConfirm: async () => {
                try {
                  await firestoreInitializePlanItems(plan);
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
          }}
        />
      )}
      {!editTarget && (
        <ThemedIconTextButton
          IconComponent={AntDesign}
          iconName={"check"}
          disabled={areButtonsDisabled}
          color={
            areButtonsDisabled ? "gray" : isAllItemChecked ? "orange" : "black"
          }
          title={
            areButtonsDisabled
              ? "모두완료"
              : isAllItemChecked
              ? "모두해제"
              : "모두완료"
          }
          onPress={async () => {
            try {
              if (isAllItemChecked) {
                await firestoreUncheckAllItems(plan);
              } else {
                await firestoreCheckAllItems(plan);
              }
            } catch (error) {
              setModal({
                visible: true,
                title: "서버 통신 에러",
                message: `서버와 연결상태가 좋지 않습니다. (${error})`,
              });
            }
          }}
        />
      )}
      {!editTarget && (
        <ThemedIconTextButton
          IconComponent={AntDesign}
          iconName={"delete"}
          title={"완료삭제"}
          disabled={areButtonsDisabled}
          color={areButtonsDisabled ? "gray" : "black"}
          onPress={() => {
            setModal({
              visible: true,
              title: "모든 완료 항목 삭제",
              message: "완료된 항목들 모두 삭제됩니다",
              onConfirm: async () => {
                try {
                  await firestoreRemoveCheckedPlanItem(plan);
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
          }}
        />
      )}
    </Header>
  );
}
