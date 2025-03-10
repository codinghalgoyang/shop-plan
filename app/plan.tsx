import Header from "@/components/Common/Header";
import ScreenView from "@/components/Common/ScreenView";
import { useLocalSearchParams } from "expo-router";
import { ScrollView, StyleSheet, View } from "react-native";
import PlanItemView from "@/components/Plan/PlanItemView";
import { param2string } from "@/utils/utils";
import { useRecoilValue } from "recoil";
import { plansState } from "@/atoms/plansAtom";
import { settingState } from "@/atoms/settingAtom";
import { useKeepAwake } from "expo-keep-awake";
import { Colors } from "@/utils/Colors";
import PlanItemInput from "@/components/Plan/PlanItemInput";
import { Plan } from "@/utils/types";
import ThemedText from "@/components/Common/ThemedText";
import Paper from "@/components/Common/Paper";
import { SetStateAction, useState } from "react";
import PlanItemEdit from "@/components/Plan/PlanItemEdit";
import ThemedTextButton from "@/components/Common/ThemedTextButton";
import { firestoreRemoveCheckedPlanItem } from "@/utils/api";

function getCategories(plan: Plan) {
  const allCategories = plan?.items.map((item) => item.category);
  const uniqueCategories = [...new Set(allCategories)].sort();
  if (uniqueCategories.includes("")) {
    const categories = uniqueCategories.filter((category) => category !== ""); // remove ""
    categories.push(""); // add "" at the end
    return categories;
  } else {
    return uniqueCategories;
  }
}

export default function PlanScreen() {
  const { index: paramIndex } = useLocalSearchParams();
  const index = parseInt(param2string(paramIndex));
  const plans = useRecoilValue(plansState);
  const plan = plans[index];
  const setting = useRecoilValue(settingState);
  const categories = getCategories(plan);
  const [isPlanItemEdit, setIsPlanItemEdit] = useState(false);
  const [editItemIdx, setEditItemIdx] = useState(0);

  if (setting.aodEnabled) {
    console.log("aod on");
    useKeepAwake();
  } else {
    console.log("aod off");
  }

  return (
    <ScreenView>
      <Header title={plan ? plan.title : "Loading..."} enableBackAction>
        <ThemedTextButton
          size="small"
          color="orange"
          onPress={() => {
            console.log("완료된 항목을 삭제하시겠습니까?");
            firestoreRemoveCheckedPlanItem(plan);
          }}
        >
          완료삭제
        </ThemedTextButton>
      </Header>
      <View style={styles.container}>
        <ScrollView contentContainerStyle={{ gap: 8 }}>
          {categories.map((category) => {
            return (
              <View key={category} style={{ gap: 8 }}>
                <ThemedText
                  size="small"
                  color="gray"
                  style={{ marginLeft: 12 }}
                >
                  {categories.length == 1
                    ? "구매 항목"
                    : category == ""
                    ? "분류 없음"
                    : category}
                </ThemedText>
                <Paper>
                  {plan?.items.map((planItem, itemIdx) => {
                    if (planItem.checked) return null;
                    if (planItem.category !== category) return null;
                    return (
                      <PlanItemView
                        key={planItem.title}
                        plan={plan}
                        itemIdx={itemIdx}
                        isFirstItem={itemIdx == 0}
                        setIsPlanItemEdit={setIsPlanItemEdit}
                        setEditItemIdx={setEditItemIdx}
                      />
                    );
                  })}
                  {plan?.items.map((planItem, itemIdx) => {
                    if (!planItem.checked) return null;
                    if (planItem.category !== category) return null;
                    return (
                      <PlanItemView
                        key={planItem.title}
                        plan={plan}
                        itemIdx={itemIdx}
                        setIsPlanItemEdit={setIsPlanItemEdit}
                        setEditItemIdx={setEditItemIdx}
                      />
                    );
                  })}
                </Paper>
              </View>
            );
          })}
        </ScrollView>
      </View>
      {isPlanItemEdit ? (
        <PlanItemEdit
          plan={plan}
          itemIdx={editItemIdx}
          setIsPlanItemEdit={setIsPlanItemEdit}
        />
      ) : (
        <PlanItemInput plan={plan} />
      )}
    </ScreenView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background.lightGray,
    paddingVertical: 8,
  },
});
