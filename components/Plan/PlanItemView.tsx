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
} from "react-native";
import ThemedText from "../Common/ThemedText";
import { Colors } from "@/utils/Colors";
import ThemedCheckbox from "../Common/ThemedCheckbox";
import ThemedTextButton from "../Common/ThemedTextButton";
import { modalState } from "@/atoms/modalAtom";
import { useRecoilState, useSetRecoilState } from "recoil";
import { EditInfo, PlanScreenMode } from "@/app/plan";
import { isItemType } from "@/utils/types";

interface PlanItemViewProps {
  plan: Plan;
  itemGroup: ItemGroup;
  item: Item;
  planScreenMode: PlanScreenMode;
  editInfo: EditInfo;
  setEditInfo: Dispatch<SetStateAction<EditInfo>>;
}

export default function PlanItemView({
  plan,
  itemGroup,
  item,
  planScreenMode,
  editInfo,
  setEditInfo,
}: PlanItemViewProps) {
  const setModal = useSetRecoilState(modalState);
  const isAlreadyEditing =
    editInfo?.target == "ITEM" && editInfo.itemId == item.id;

  const onItemEditPress = () => {
    if (isAlreadyEditing) return;
    setEditInfo({
      target: "ITEM",
      itemGroupId: itemGroup.id,
      itemId: item.id,
    });
  };

  const toggleChecked = async (checked: boolean) => {
    try {
      await firestoreUpdatePlanItem(plan, itemGroup.id, item.id, {
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
      await firestoreRemoveSpecificPlanItem(plan, itemGroup.id, item.id);
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

  // return null
  if (!itemGroup || !item) {
    return null;
  } else {
    return (
      <View style={containerStyle}>
        <ThemedCheckbox value={item.checked} onValueChange={toggleChecked} />
        <View style={styles.contentContainer}>
          <ThemedText
            color={item.checked ? "gray" : "black"}
            style={titleStyle}
            numberOfLines={1}
          >
            {item.title}
          </ThemedText>
          {planScreenMode == "ADD_ITEM" && item.link && (
            <ThemedTextButton onPress={onLinkPress} size="small" color="blue">
              링크
            </ThemedTextButton>
          )}
          {planScreenMode == "EDIT" && (
            <ThemedTextButton
              color={isAlreadyEditing ? "orange" : "gray"}
              onPress={onItemEditPress}
            >
              {isAlreadyEditing ? "편집중" : "편집"}
            </ThemedTextButton>
          )}
          {planScreenMode == "DELETE" && (
            <ThemedTextButton
              onPress={onDeletePress}
              size="small"
              color="orange"
            >
              삭제
            </ThemedTextButton>
          )}
        </View>
      </View>
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
  },
  buttonContainer: {
    flexDirection: "row",
  },
});
