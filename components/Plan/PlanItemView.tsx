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
import { useSetRecoilState } from "recoil";
import { Target } from "@/app/plan";
import { ITEM_HEIGHT } from "@/utils/Shapes";
import Paper from "../Common/Paper";
import ThemedIconButton from "../Common/ThemedIconButton";
import Feather from "@expo/vector-icons/Feather";
import { scrollTargetState } from "@/atoms/scrollTargetAtom";
import { router } from "expo-router";

interface PlanItemViewProps {
  plan: Plan;
  item: Item;
  moreTarget: Target;
  setMoreTarget: Dispatch<SetStateAction<Target>>;
}

export default function PlanItemView({
  plan,
  item,
  moreTarget,
  setMoreTarget,
}: PlanItemViewProps) {
  const setModal = useSetRecoilState(modalState);
  const amIMoreTarget =
    moreTarget?.type === "ITEM" && moreTarget.itemId === item.id;

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

  const onPressEdit = () => {
    router.push(`/edit_item?plan_id=${plan.id}&item_id=${item.id}`);
  };

  const onPressDelete = async () => {
    try {
      router.back();
      await firestoreRemoveSpecificPlanItem(plan, item.itemGroupId, item.id);
    } catch (error) {
      setModal({
        visible: true,
        title: "서버 통신 에러",
        message: `서버와 연결상태가 좋지 않습니다. (${error})`,
      });
    }
  };

  const onPressMore = () => {
    if (amIMoreTarget) {
      setMoreTarget(null);
    } else {
      setMoreTarget({
        type: "ITEM",
        itemGroupId: item.itemGroupId,
        itemId: item.id,
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
  if (!item) {
    return null;
  }
  return (
    <Paper>
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
          <View style={styles.buttonContainer}>
            {item.link && (
              <ThemedTextButton onPress={onLinkPress} color={"blue"}>
                링크
              </ThemedTextButton>
            )}
            <ThemedTextButton color="blue" onPress={onPressEdit}>
              수정
            </ThemedTextButton>
            <ThemedTextButton color="orange" onPress={onPressDelete}>
              삭제
            </ThemedTextButton>
            <ThemedIconButton
              IconComponent={Feather}
              iconName={amIMoreTarget ? "chevron-right" : "chevron-left"}
              color={amIMoreTarget ? "black" : "gray"}
              style={{ marginRight: 8 }}
              onPress={onPressMore}
            />
          </View>
        </View>
      </View>
    </Paper>
  );
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
    alignItems: "center",
  },
});
