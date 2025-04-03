import { Plan } from "@/utils/types";
import Header from "../Common/Header";
import ThemedIconTextButton from "../Common/ThemedIconTextButton";
import AntDesign from "@expo/vector-icons/AntDesign";
import Octicons from "@expo/vector-icons/Octicons";
import { modalState } from "@/atoms/modalAtom";
import { firestoreUncheckAllItems } from "@/utils/api";
import { useRecoilState, useSetRecoilState } from "recoil";
import { planViewStatusState } from "@/atoms/planViewStatusAtom";

interface PlanHeaderProps {
  plan: Plan;
}

export default function PlanHeader({ plan }: PlanHeaderProps) {
  const setModal = useSetRecoilState(modalState);
  const [planViewStatus, setPlanViewStatus] =
    useRecoilState(planViewStatusState);

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
        color={planViewStatus.planViewMode == "DELETE" ? "orange" : "black"}
        onPress={() => {
          setPlanViewStatus((prev) => {
            return {
              planViewMode:
                prev.planViewMode == "DELETE" ? "ADD_ITEM" : "DELETE",
              activatedItemGroupId: prev.activatedItemGroupId,
              editItemInfo: { category: "", item: null },
            };
          });
        }}
      />
      <ThemedIconTextButton
        IconComponent={Octicons}
        iconName={"hash"}
        title={"분류추가"}
        color={
          planViewStatus.planViewMode == "ADD_CATEGORY" ? "orange" : "black"
        }
        onPress={() => {
          setPlanViewStatus((prev) => {
            return {
              planViewMode:
                prev.planViewMode == "ADD_CATEGORY"
                  ? "ADD_ITEM"
                  : "ADD_CATEGORY",
              activatedItemGroupId: prev.activatedItemGroupId,
              editItemInfo: { category: "", item: null },
            };
          });
        }}
        style={{ marginRight: 8 }}
      />
    </Header>
  );
}
