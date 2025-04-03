import {
  firestoreRemoveSpecificPlanItem,
  firestoreUpdatePlanItem,
} from "@/utils/api";
import { Item, Plan } from "@/utils/types";
import React, { Dispatch, SetStateAction } from "react";
import {
  StyleSheet,
  View,
  Linking,
  StyleProp,
  ViewStyle,
  TextStyle,
} from "react-native";
import ThemedText from "../Common/ThemedText";
import { Colors } from "@/utils/Colors";
import ThemedCheckbox from "../Common/ThemedCheckbox";
import ThemedTextButton from "../Common/ThemedTextButton";
import { modalState } from "@/atoms/modalAtom";
import { useRecoilState, useSetRecoilState } from "recoil";
import { planViewStatusState } from "@/atoms/planViewStatusAtom";

interface PlanItemViewProps {
  plan: Plan;
  category: string;
  item: Item;
}

export default function PlanItemView({
  plan,
  category,
  item,
}: PlanItemViewProps) {
  const setModal = useSetRecoilState(modalState);
  const [planViewStatus, setPlanViewStatus] =
    useRecoilState(planViewStatusState);
  const itemGroup = plan.itemGroups.find(
    (itemGroup) => itemGroup.category == category
  );
  if (!itemGroup) return null;

  const doIEditing = planViewStatus.editingItemInfo.item?.id == item.id;

  const onCheckedChange = async (checked: boolean) => {
    try {
      await firestoreUpdatePlanItem(plan, category, item.id, {
        ...item,
        checked: !item.checked,
      } as Item);
    } catch (error) {
      setModal({
        visible: true,
        title: "서버 통신 에러",
        message: `서버와 연결상태가 좋지 않습니다. (${error})`,
      });
    }
  };

  const onLinkPress = async () => {
    const url = item.link || ""; // 열고 싶은 URL
    const supported = await Linking.canOpenURL(url);

    if (supported) {
      await Linking.openURL(url);
    } else {
      setModal({
        visible: true,
        title: "유효하지 않은 주소",
        message: `${url}를 열 수 없습니다.`,
      });
    }
  };

  const onEditPress = () => {
    if (doIEditing) {
      setPlanViewStatus((prev) => {
        return {
          planViewMode: "ADD_ITEM",
          activatedItemGroupId: prev.activatedItemGroupId,
          editingItemInfo: { category: "", item: null },
          editingCategoryInfo: { category: "", itemGroupId: "" },
        };
      });
    } else {
      setPlanViewStatus((prev) => {
        return {
          planViewMode: "EDIT_ITEM",
          activatedItemGroupId: prev.activatedItemGroupId,
          editingItemInfo: { category: category, item: item },
          editingCategoryInfo: { category: "", itemGroupId: "" },
        };
      });
    }
  };

  const containerStyle: StyleProp<ViewStyle> = {
    flexDirection: "row",
    alignItems: "center",
    borderBottomWidth: 0.5,
    borderColor: Colors.border,
  };

  const titleStyle: StyleProp<TextStyle> = {
    flex: 1,
    textDecorationLine: item.checked ? "line-through" : "none",
  };

  return (
    <View style={containerStyle}>
      <ThemedCheckbox value={item.checked} onValueChange={onCheckedChange} />
      <View style={styles.contentContainer}>
        <ThemedText
          color={item.checked ? "gray" : "black"}
          style={titleStyle}
          numberOfLines={1}
        >
          {item.title}
        </ThemedText>
        {planViewStatus.planViewMode == "DELETE" ? (
          <ThemedTextButton
            color="orange"
            size="small"
            onPress={async () => {
              try {
                await firestoreRemoveSpecificPlanItem(plan, category, item.id);
              } catch (error) {
                setModal({
                  visible: true,
                  title: "서버 통신 에러",
                  message: `서버와 연결상태가 좋지 않습니다. (${error})`,
                });
              }
            }}
          >
            삭제
          </ThemedTextButton>
        ) : (
          <View style={styles.buttonContainer}>
            {item.link && (
              <ThemedTextButton color="blue" size="small" onPress={onLinkPress}>
                링크
              </ThemedTextButton>
            )}
            <ThemedTextButton
              color={doIEditing ? "blue" : "gray"}
              size="small"
              onPress={onEditPress}
            >
              {doIEditing ? "편집중" : "편집"}
            </ThemedTextButton>
          </View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  contentContainer: {
    flex: 1,
    paddingRight: 8,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  buttonContainer: {
    flexDirection: "row",
  },
});
