import { plansState } from "@/atoms/plansAtom";
import Header from "@/components/Common/Header";
import ScreenView from "@/components/Common/ScreenView";
import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { useRecoilValue, useSetRecoilState } from "recoil";
import { ItemGroup } from "@/utils/types";
import { StyleSheet, View } from "react-native";
import DraggableFlatList, {
  RenderItemParams,
} from "react-native-draggable-flatlist";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { Colors } from "@/utils/Colors";
import { Target } from "./plan";
import { firestoreChangeItemGroupOrder } from "@/utils/api";
import { modalState } from "@/atoms/modalAtom";
import EditItemGroupCategoryView from "@/components/EdiitItemGroup/EditItemGroupCategoryView";

export default function EditItemGroupScreen() {
  const setModal = useSetRecoilState(modalState);
  const { plan_id: planId } = useLocalSearchParams();
  const plans = useRecoilValue(plansState);
  const plan = plans.find((plan) => plan.id === planId);
  const [moveTarget, setMoveTarget] = useState<Target>(null);

  useEffect(() => {
    if (!plan) {
      router.back();
      return;
    }
  }, [plan]);

  if (!plan) {
    return null;
  }
  const data: ItemGroup[] = plan.itemGroups;

  return (
    <ScreenView>
      <Header title={`카테고리 관리`} color="orange" enableBackAction />
      <View style={styles.container}>
        <GestureHandlerRootView>
          <DraggableFlatList
            data={data}
            keyExtractor={(item) => item.id}
            renderItem={({
              item: itemGroup,
              drag,
            }: RenderItemParams<ItemGroup>) => {
              return (
                <EditItemGroupCategoryView
                  plan={plan}
                  itemGroup={itemGroup}
                  hasMultipleItemGroup={plan.itemGroups.length > 1}
                  drag={drag}
                  moveTarget={moveTarget}
                  setMoveTarget={setMoveTarget}
                />
              );
            }}
            onDragEnd={async (data) => {
              const itemGroups = data.data;
              setMoveTarget(null);
              if (itemGroups[itemGroups.length - 1].category === "") {
                try {
                  await firestoreChangeItemGroupOrder(plan, itemGroups);
                } catch (error) {
                  setModal({
                    visible: true,
                    title: "서버 통신 에러",
                    message: `서버와 연결상태가 좋지 않습니다. (${error})`,
                  });
                }
              }
            }}
          />
        </GestureHandlerRootView>
      </View>
    </ScreenView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background.lightGray,
  },
});
