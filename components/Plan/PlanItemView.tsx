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
import { modalState } from "@/atoms/modalAtom";
import { useRecoilState, useSetRecoilState } from "recoil";
import { ITEM_HEIGHT } from "@/utils/Shapes";
import Paper from "../Common/Paper";
import ThemedIconButton from "../Common/ThemedIconButton";
import { editTargetState } from "@/atoms/editTargetAtom";
import { AntDesign } from "@expo/vector-icons";
import Ionicons from "@expo/vector-icons/Ionicons";
import { Target } from "@/app/plan";

interface PlanItemViewProps {
  plan: Plan;
  item: Item;
  drag: () => void;
  moveTarget: Target;
  setMoveTarget: Dispatch<SetStateAction<Target>>;
}

export default function PlanItemView({
  plan,
  item,
  drag,
  moveTarget,
  setMoveTarget,
}: PlanItemViewProps) {
  const setModal = useSetRecoilState(modalState);
  const [editTarget, setEditTarget] = useRecoilState(editTargetState);
  const amIEditTarget =
    editTarget?.type === "ITEM" && editTarget?.itemId === item.id;
  const amIMoveTarget =
    moveTarget?.type === "ITEM" && moveTarget.itemId === item.id;

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
    setEditTarget({
      type: "ITEM",
      itemGroupId: item.itemGroupId,
      itemId: item.id,
    });
  };

  const onPressDelete = async () => {
    setModal({
      visible: true,
      title: "항목 삭제",
      message: `'${item.title}'을 삭제합니다`,
      onConfirm: async () => {
        try {
          await firestoreRemoveSpecificPlanItem(
            plan,
            item.itemGroupId,
            item.id
          );
        } catch (error) {
          setModal({
            visible: true,
            title: "서버 통신 에러",
            message: `서버와 연결상태가 좋지 않습니다. (${error})`,
          });
        }
      },
      onCancel: () => {},
    });
  };

  const onPressInMove = () => {
    drag();
    setMoveTarget({
      type: "ITEM",
      itemGroupId: item.itemGroupId,
      itemId: item.id,
    });
  };

  const containerStyle: StyleProp<ViewStyle> = {
    flexDirection: "row",
    alignItems: "center",
    borderBottomWidth: 0.5,
    borderColor: Colors.border,
  };

  const titleStyle: StyleProp<TextStyle> = {
    flex: 1,
    textDecorationLine: item.checked
      ? "line-through"
      : item.link
      ? "underline"
      : "none",
  };

  if (!item) {
    return null;
  }
  return (
    <Paper>
      <View
        style={[
          containerStyle,
          {
            backgroundColor: amIMoveTarget
              ? Colors.orange
              : Colors.background.white,
          },
        ]}
      >
        <ThemedCheckbox value={item.checked} onValueChange={toggleChecked} />
        <View style={styles.contentContainer}>
          <TouchableOpacity
            onPress={onLinkPress}
            disabled={editTarget ? true : false}
            style={{ flex: 1 }}
          >
            <View style={styles.contentContainer}>
              <ThemedText
                color={
                  editTarget
                    ? amIEditTarget
                      ? "orange"
                      : "gray"
                    : amIMoveTarget
                    ? "white"
                    : item.checked
                    ? "gray"
                    : item.link
                    ? "blue"
                    : "black"
                }
                style={titleStyle}
                numberOfLines={1}
              >
                {amIEditTarget ? `${item.title} (수정중)` : item.title}
              </ThemedText>
            </View>
          </TouchableOpacity>
          {!editTarget && !moveTarget && (
            <View style={styles.buttonContainer}>
              <ThemedIconButton
                IconComponent={AntDesign}
                iconName="delete"
                onPress={onPressDelete}
                color="black"
                style={{
                  padding: 12,
                }}
              />
              <ThemedIconButton
                IconComponent={AntDesign}
                iconName="form"
                onPress={onPressEdit}
                color="black"
                style={{
                  padding: 12,
                }}
              />
              <ThemedIconButton
                IconComponent={Ionicons}
                iconName="swap-vertical"
                onPressIn={onPressInMove}
                color="black"
                style={{
                  padding: 12,
                }}
              />
            </View>
          )}
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
