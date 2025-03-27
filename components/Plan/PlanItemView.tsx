import {
  firestoreRemoveSpecificPlanItem,
  firestoreUpdatePlanItem,
} from "@/utils/api";
import { Plan, PlanItem } from "@/utils/types";
import React from "react";
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
import { useSetRecoilState } from "recoil";

interface PlanItemViewProps {
  plan: Plan;
  itemIdx: number;
  needTopBorder?: boolean;
  editItemIdx: number;
  setEditItemIdx: React.Dispatch<React.SetStateAction<number>>;
  isDeleteMode: boolean;
}

export default function PlanItemView({
  plan,
  itemIdx,
  needTopBorder = false,
  editItemIdx,
  setEditItemIdx,
  isDeleteMode,
}: PlanItemViewProps) {
  const setModal = useSetRecoilState(modalState);
  const planItem = plan.items[itemIdx];
  const onCheckedChange = async (checked: boolean) => {
    const originItem = plan.items[itemIdx];
    try {
      await firestoreUpdatePlanItem(plan, itemIdx, {
        ...originItem,
        checked: !originItem.checked,
      } as PlanItem);
    } catch (error) {
      setModal({
        visible: true,
        title: "서버 통신 에러",
        message: `서버와 연결상태가 좋지 않습니다. (${error})`,
      });
    }
  };

  const onLinkPress = async () => {
    const url = planItem.link || ""; // 열고 싶은 URL
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
    if (editItemIdx == itemIdx) {
      // 편집중인 목록이 다시 눌렸을 때,
      setEditItemIdx(-1);
    } else {
      setEditItemIdx(itemIdx);
    }
  };

  const containerStyle: StyleProp<ViewStyle> = {
    flexDirection: "row",
    alignItems: "center",
    borderBottomWidth: 0.5,
    borderColor: Colors.border,
    borderTopWidth: needTopBorder ? 0.5 : 0,
  };

  const titleStyle: StyleProp<TextStyle> = {
    flex: 1,
    textDecorationLine: planItem.checked ? "line-through" : "none",
  };

  return (
    <View style={containerStyle}>
      <ThemedCheckbox
        value={planItem.checked}
        onValueChange={onCheckedChange}
      />
      <View style={styles.contentContainer}>
        <ThemedText
          color={planItem.checked ? "gray" : "black"}
          style={titleStyle}
          numberOfLines={1}
        >
          {planItem.title}
        </ThemedText>
        {isDeleteMode ? (
          <ThemedTextButton
            color="orange"
            size="small"
            onPress={() => {
              try {
                const result = firestoreRemoveSpecificPlanItem(plan, itemIdx);
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
            {planItem.link && (
              <ThemedTextButton color="blue" size="small" onPress={onLinkPress}>
                링크
              </ThemedTextButton>
            )}
            <ThemedTextButton
              color={editItemIdx == itemIdx ? "blue" : "gray"}
              size="small"
              onPress={onEditPress}
            >
              {editItemIdx == itemIdx ? "편집중" : "편집"}
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
