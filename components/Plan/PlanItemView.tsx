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

interface PlanItemViewProps {
  plan: Plan;
  item: Item;
}

export default function PlanItemView({ plan, item }: PlanItemViewProps) {
  const setModal = useSetRecoilState(modalState);

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

  const onEditPress = () => {
    // TODO : goto edit_item
  };

  // const onDeletePress = async () => {
  //   try {
  //     await firestoreRemoveSpecificPlanItem(plan, item.itemGroupId, item.id);
  //   } catch (error) {
  //     setModal({
  //       visible: true,
  //       title: "서버 통신 에러",
  //       message: `서버와 연결상태가 좋지 않습니다. (${error})`,
  //     });
  //   }
  // };

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
            <ThemedIconButton
              IconComponent={Feather}
              iconName="more-vertical"
              color={"gray"}
              onPress={onEditPress}
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
