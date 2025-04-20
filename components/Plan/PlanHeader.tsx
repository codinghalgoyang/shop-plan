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
import { useSetRecoilState } from "recoil";
import { Item } from "@/utils/types";
import { Target } from "@/app/plan";
import { findItem, findItemGroup } from "@/utils/utils";
import { Dispatch, SetStateAction } from "react";

interface PlanHeaderProps {
  plan: Plan;
}

export default function PlanHeader({ plan }: PlanHeaderProps) {
  const setModal = useSetRecoilState(modalState);
  const allItems: Item[] = plan.itemGroups.flatMap(
    (itemGroup) => itemGroup.items
  );
  const isAllItemChecked = allItems.filter((item) => !item.checked).length == 0;
  const areButtonsDisabled = allItems.length == 0;

  return (
    <Header title={!plan ? "Loading..." : plan.title} enableBackAction>
      <ThemedIconTextButton
        IconComponent={AntDesign}
        iconName={"retweet"}
        title={"초기화"}
        disabled={areButtonsDisabled}
        color={areButtonsDisabled ? "gray" : "black"}
        onPress={() => {
          setModal({
            visible: true,
            title: "초기화",
            message: "모든 분류와 항목들이 삭제됩니다",
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
      <ThemedIconTextButton
        IconComponent={AntDesign}
        iconName={"delete"}
        title={"완료삭제"}
        disabled={areButtonsDisabled}
        color={areButtonsDisabled ? "gray" : "black"}
        onPress={() => {
          setModal({
            visible: true,
            title: "완료삭제",
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
    </Header>
  );
}
