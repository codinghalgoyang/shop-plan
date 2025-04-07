import { Plan } from "@/utils/types";
import Header from "../Common/Header";
import ThemedIconTextButton from "../Common/ThemedIconTextButton";
import AntDesign from "@expo/vector-icons/AntDesign";
import { modalState } from "@/atoms/modalAtom";
import { firestoreUncheckAllItems } from "@/utils/api";
import { useSetRecoilState } from "recoil";
import { EditInfo, PlanScreenMode } from "@/app/plan";
import { Dispatch, SetStateAction } from "react";

interface PlanHeaderProps {
  plan: Plan;
  planScreenMode: PlanScreenMode;
  setPlanScreenMode: Dispatch<SetStateAction<PlanScreenMode>>;
  setEditInfo: Dispatch<SetStateAction<EditInfo>>;
}

export default function PlanHeader({
  plan,
  planScreenMode,
  setPlanScreenMode,
  setEditInfo,
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
        iconName={"edit"}
        title={"편집모드"}
        color={planScreenMode == "EDIT" ? "orange" : "black"}
        onPress={() => {
          setPlanScreenMode((prev) => {
            if (prev == "EDIT") {
              setEditInfo(null);
              return "ADD_ITEM";
            } else {
              return "EDIT";
            }
          });
        }}
      />
      <ThemedIconTextButton
        IconComponent={AntDesign}
        iconName={"delete"}
        title={"삭제모드"}
        color={planScreenMode == "DELETE" ? "orange" : "black"}
        onPress={() => {
          setPlanScreenMode((prev) => {
            if (prev == "DELETE") {
              return "ADD_ITEM";
            } else {
              return "DELETE";
            }
          });
        }}
      />
    </Header>
  );
}
