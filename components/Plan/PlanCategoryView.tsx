import { Colors } from "@/utils/Colors";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import ThemedText from "../Common/ThemedText";
import { isItemGroupType, Plan, ItemGroup } from "@/utils/types";
import { Dispatch, SetStateAction } from "react";
import { ActivatedItemGroupId, Target } from "@/app/plan";
import ThemedTextButton from "../Common/ThemedTextButton";
import { modalState } from "@/atoms/modalAtom";
import { useSetRecoilState } from "recoil";
import { firestoreDeleteItemGroup, firestoreEditPlanItem } from "@/utils/api";
import { ITEM_HEIGHT } from "@/utils/Shapes";
import ThemedIconButton from "../Common/ThemedIconButton";
import Feather from "@expo/vector-icons/Feather";
import ThemedIcon from "../Common/ThemedIcon";
import { findItem, findItemGroup } from "@/utils/utils";

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

    // const deleteCategory = async () => {
    //   setModal({
    //     visible: true,
    //     title: "삭제 확인",
    //     message:
    //       itemGroup.category == ""
    //         ? "'미분류' 안에 있는 모든 항목도 함께 삭제 됩니다."
    //         : `'${itemGroup.category}' 카테고리 안에 있는 모든 항목도 함께 삭제됩니다.`,
    //     onConfirm: async () => {
    //       try {
    //         await firestoreDeleteItemGroup(plan, itemGroup.id);
    //       } catch (error) {
    //         setModal({
    //           visible: true,
    //           title: "서버 통신 에러",
    //           message: `서버와 연결상태가 좋지 않습니다. (${error})`,
    //         });
    //       }
    //     },
    //     onCancel: () => {},
    //   });
    // };

    // TODO : Do not display delete/edit button if it's isCategoryNoneItemGroup
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
            {amICategoryNoneGroup ? "미분류" : `#${itemGroup.category}`}
          </ThemedText>

          <View style={styles.buttonContainer}>
            {itemGroup.category !== "" && (
              <ThemedIconButton
                IconComponent={Feather}
                iconName="more-vertical"
                color={"gray"}
                style={{ marginRight: 8 }}
                onPress={() => {
                  // TODO : edit_item_group
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
