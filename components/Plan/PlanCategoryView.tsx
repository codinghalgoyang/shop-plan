import { Colors } from "@/utils/Colors";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import ThemedText from "../Common/ThemedText";
import { Plan, ItemGroup } from "@/utils/types";
import { Dispatch, SetStateAction } from "react";
import { ActivatedItemGroupId, Target } from "@/app/plan";
import { modalState } from "@/atoms/modalAtom";
import { useSetRecoilState } from "recoil";
import { ITEM_HEIGHT } from "@/utils/Shapes";
import ThemedIconButton from "../Common/ThemedIconButton";
import Feather from "@expo/vector-icons/Feather";
import { router } from "expo-router";

interface PlanCategoryViewProps {
  plan: Plan;
  itemGroup: ItemGroup;
  hasMultipleItemGroup: boolean;
  activatedItemGroupId: ActivatedItemGroupId;
  setActivatedItemGroupId: Dispatch<SetStateAction<ActivatedItemGroupId>>;
}

export default function PlanCategoryView({
  plan,
  itemGroup,
  hasMultipleItemGroup,
  activatedItemGroupId,
  setActivatedItemGroupId,
}: PlanCategoryViewProps) {
  const setModal = useSetRecoilState(modalState);

  if (!hasMultipleItemGroup || !activatedItemGroupId) {
    return (
      <View style={{ borderColor: Colors.border, borderBottomWidth: 0.5 }} />
    );
  } else {
    const amICategoryNoneGroup = itemGroup.category === "";
    const amIActivated = itemGroup.id == activatedItemGroupId;

    return (
      <TouchableOpacity
        onPress={async () => {
          setActivatedItemGroupId(itemGroup.id);
        }}
      >
        <View style={styles.container}>
          <ThemedText
            color={amIActivated ? "blue" : "gray"}
            style={{ marginLeft: 16 }}
          >
            {amICategoryNoneGroup ? "카테고리없음" : `#${itemGroup.category}`}
          </ThemedText>

          <View style={styles.buttonContainer}>
            {itemGroup.category !== "" && (
              <ThemedIconButton
                IconComponent={Feather}
                iconName="more-horizontal"
                color={"gray"}
                style={{ marginRight: 8 }}
                onPress={() => {
                  router.push(
                    `/edit_item_group?plan_id=${plan.id}&item_group_id=${itemGroup.id}`
                  );
                }}
              />
            )}
          </View>
        </View>
      </TouchableOpacity>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderBottomWidth: 0.5,
    borderColor: Colors.border,
    height: ITEM_HEIGHT,
  },
  buttonContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
});
