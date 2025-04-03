import { modalState } from "@/atoms/modalAtom";
import { Colors } from "@/utils/Colors";
import { View } from "react-native";
import { useSetRecoilState } from "recoil";
import ThemedTextButton from "../Common/ThemedTextButton";
import { Plan } from "@/utils/types";
import {
  firestoreRemoveAllPlanItem,
  firestoreRemoveCheckedPlanItem,
} from "@/utils/api";
import { planViewStatusState } from "@/atoms/planViewStatusAtom";

interface PlanItemDeleteButtonViewProps {
  plan: Plan;
}

export default function PlanItemDeleteButtonView({
  plan,
}: PlanItemDeleteButtonViewProps) {
  const setModal = useSetRecoilState(modalState);
  const setPlanViewStatus = useSetRecoilState(planViewStatusState);

  return (
    <View
      style={{
        backgroundColor: Colors.background.lightGray,
        padding: 12,
        gap: 8,
      }}
    >
      <ThemedTextButton
        type="outline"
        color="orange"
        buttonStyle={{ width: "100%" }}
        onPress={() => {
          setModal({
            visible: true,
            title: "삭제 확인",
            message: "완료된 항목을 삭제하시겠습니까?",
            onConfirm: async () => {
              try {
                await firestoreRemoveCheckedPlanItem(plan);
                setPlanViewStatus((prev) => {
                  return {
                    planViewMode: "ADD_ITEM",
                    activatedCategory: prev.activatedCategory,
                    editItemInfo: { category: "", item: null },
                  };
                });
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
      >
        완료 항목 삭제
      </ThemedTextButton>
      <ThemedTextButton
        type="fill"
        color="orange"
        buttonStyle={{ width: "100%" }}
        onPress={() => {
          setModal({
            visible: true,
            title: "삭제 확인",
            message: "전체 항목을 삭제하시겠습니까?",
            onConfirm: async () => {
              try {
                await firestoreRemoveAllPlanItem(plan);
                setPlanViewStatus((prev) => {
                  return {
                    planViewMode: "ADD_ITEM",
                    activatedCategory: prev.activatedCategory,
                    editItemInfo: { category: "", item: null },
                  };
                });
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
      >
        전체 항목 삭제
      </ThemedTextButton>
    </View>
  );
}
