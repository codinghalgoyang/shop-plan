import {
  firestoreRemoveSpecificPlanItem,
  firestoreUpdatePlanItem,
} from "@/utils/api";
import { Item, ItemGroup, Plan } from "@/utils/types";
import React, { Dispatch, SetStateAction } from "react";
import {
  StyleSheet,
  View,
  Linking,
  StyleProp,
  ViewStyle,
  TextStyle,
  TouchableOpacity,
} from "react-native";
import ThemedText from "../Common/ThemedText";
import { Colors } from "@/utils/Colors";
import ThemedCheckbox from "../Common/ThemedCheckbox";
import ThemedTextButton from "../Common/ThemedTextButton";
import { modalState } from "@/atoms/modalAtom";
import { useRecoilState, useSetRecoilState } from "recoil";
import { Target, PlanScreenMode } from "@/app/plan";
import { isItemType } from "@/utils/types";
import { ITEM_HEIGHT } from "@/utils/Shapes";
import Paper from "../Common/Paper";
import ThemedIconButton from "../Common/ThemedIconButton";
import Feather from "@expo/vector-icons/Feather";

interface PlanItemViewProps {
  plan: Plan;
  item: Item;
  planScreenMode: PlanScreenMode;
  editTarget: Target;
  setEditTarget: Dispatch<SetStateAction<Target>>;
  moreTarget: Target;
  setMoreTarget: Dispatch<SetStateAction<Target>>;
}

export default function PlanItemView({
  plan,
  item,
  planScreenMode,
  editTarget,
  setEditTarget,
  moreTarget,
  setMoreTarget,
}: PlanItemViewProps) {
  const setModal = useSetRecoilState(modalState);
  const doIEditing = editTarget?.type == "ITEM" && editTarget.itemId == item.id;

  const onItemEditPress = () => {
    if (doIEditing) return;
    setEditTarget({
      type: "ITEM",
      itemGroupId: item.itemGroupId,
      itemId: item.id,
    });
  };

  const toggleChecked = async (checked: boolean) => {
    try {
      await firestoreUpdatePlanItem(plan, item.itemGroupId, item.id, {
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

  const onDeletePress = async () => {
    try {
      await firestoreRemoveSpecificPlanItem(plan, item.itemGroupId, item.id);
    } catch (error) {
      setModal({
        visible: true,
        title: "서버 통신 에러",
        message: `서버와 연결상태가 좋지 않습니다. (${error})`,
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
  const amIMoreTarget =
    moreTarget?.type === "ITEM" &&
    moreTarget.itemGroupId === item.itemGroupId &&
    moreTarget.itemId === item.id;

  // return null
  if (!item) {
    return null;
  } else {
    return (
      <TouchableOpacity
        onPress={onItemEditPress}
        disabled={planScreenMode !== "EDIT"}
      >
        <Paper>
          <View style={containerStyle}>
            <ThemedCheckbox
              value={item.checked}
              onValueChange={toggleChecked}
            />
            <View style={styles.contentContainer}>
              <ThemedText
                color={
                  planScreenMode == "EDIT" && doIEditing
                    ? "orange"
                    : item.checked
                    ? "gray"
                    : "black"
                }
                style={titleStyle}
                numberOfLines={1}
              >
                {planScreenMode == "EDIT" && doIEditing
                  ? item.title + "(편집중)"
                  : item.title}
              </ThemedText>
              {item.link && (
                <ThemedTextButton
                  onPress={onLinkPress}
                  size="small"
                  color={planScreenMode !== "ADD_ITEM" ? "gray" : "blue"}
                  disabled={planScreenMode !== "ADD_ITEM"}
                >
                  링크
                </ThemedTextButton>
              )}
              {planScreenMode == "DELETE" && (
                <ThemedTextButton onPress={onDeletePress} color="orange">
                  삭제
                </ThemedTextButton>
              )}
              <ThemedIconButton
                IconComponent={Feather}
                iconName="more-vertical"
                color={amIMoreTarget ? "orange" : "gray"}
                onPress={() => {
                  if (amIMoreTarget) {
                    setMoreTarget(null);
                  } else {
                    setMoreTarget({
                      type: "ITEM",
                      itemGroupId: item.itemGroupId,
                      itemId: item.id,
                    });
                  }
                }}
              />
            </View>
          </View>
        </Paper>
      </TouchableOpacity>
    );
  }
}

const styles = StyleSheet.create({
  contentContainer: {
    flex: 1,
    paddingRight: 8,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    height: ITEM_HEIGHT,
  },
  buttonContainer: {
    flexDirection: "row",
  },
});
