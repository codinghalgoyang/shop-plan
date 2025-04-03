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

interface PlanItemDeleteButtonViewProps {
  plan: Plan;
}

export default function PlanItemDeleteButtonView({
  plan,
}: PlanItemDeleteButtonViewProps) {
  const setModal = useSetRecoilState(modalState);
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
          if (plan?.items.filter((item) => item.checked).length !== 0) {
            setModal({
              visible: true,
              title: "삭제 확인",
              message: "완료된 항목을 삭제하시겠습니까?",
              onConfirm: () => {
                try {
                  firestoreRemoveCheckedPlanItem(plan);
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
          } else {
            setModal({
              visible: true,
              message: `삭제할 완료항목이 없습니다.`,
            });
          }
        }}
      >
        완료 항목 삭제
      </ThemedTextButton>
      <ThemedTextButton
        type="fill"
        color="orange"
        buttonStyle={{ width: "100%" }}
        onPress={() => {
          if (plan?.items.length !== 0) {
            setModal({
              visible: true,
              title: "삭제 확인",
              message: "전체 항목을 삭제하시겠습니까?",
              onConfirm: () => {
                try {
                  firestoreRemoveAllPlanItem(plan);
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
          } else {
            setModal({
              visible: true,
              message: `삭제할 항목이 없습니다.`,
            });
          }
        }}
      >
        전체 항목 삭제
      </ThemedTextButton>
    </View>
  );
}
