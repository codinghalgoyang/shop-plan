import { Plan } from "@/utils/types";
import Header from "../Common/Header";
import ThemedIconTextButton from "../Common/ThemedIconTextButton";
import AntDesign from "@expo/vector-icons/AntDesign";
import { modalState } from "@/atoms/modalAtom";
import { firestoreUncheckAllItems } from "@/utils/api";
import { useSetRecoilState } from "recoil";
import { Dispatch, SetStateAction } from "react";

interface PlanHeaderProps {
  plan: Plan;
  isDeleteMode: boolean;
  setIsDeleteMode: Dispatch<SetStateAction<boolean>>;
}

export default function PlanHeader({
  plan,
  isDeleteMode,
  setIsDeleteMode,
}: PlanHeaderProps) {
  const setModal = useSetRecoilState(modalState);

  return (
    <Header title={plan ? plan.title : "Loading..."} enableBackAction>
      <ThemedIconTextButton
        IconComponent={AntDesign}
        iconName={"check"}
        title={"모두해제"}
        onPress={async () => {
          try {
            await firestoreUncheckAllItems(plan);
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
        title={"삭제모드"}
        color={isDeleteMode ? "orange" : "black"}
        onPress={() => {
          if (plan?.items.length !== 0 || isDeleteMode) {
            setIsDeleteMode((prev) => !prev);
          } else {
            setModal({
              visible: true,
              title: "삭제 모드 활성화 실패",
              message: `삭제할 항목이 없습니다.`,
            });
          }
        }}
        style={{ marginRight: 8 }}
      />
    </Header>
  );
}
