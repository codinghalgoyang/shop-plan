import { Colors } from "@/utils/Colors";
import { StyleSheet, View } from "react-native";
import ThemedText from "../Common/ThemedText";
import { ItemGroup } from "@/utils/types";
import { modalState } from "@/atoms/modalAtom";
import { useSetRecoilState } from "recoil";
import { ITEM_HEIGHT } from "@/utils/Shapes";
import { Dispatch, SetStateAction } from "react";
import { Target } from "@/app/plan";
import ThemedIconButton from "../Common/ThemedIconButton";
import Ionicons from "@expo/vector-icons/Ionicons";

interface MoveItemGroupCategoryViewProps {
  itemGroup: ItemGroup;
  hasMultipleItemGroup: boolean;
  drag: () => void;
  moveTarget: Target;
  setMoveTarget: Dispatch<SetStateAction<Target>>;
}

export default function MoveItemGroupCategoryView({
  itemGroup,
  hasMultipleItemGroup,
  drag,
  moveTarget,
  setMoveTarget,
}: MoveItemGroupCategoryViewProps) {
  const setModal = useSetRecoilState(modalState);
  const amIMoving = moveTarget?.itemGroupId === itemGroup.id;

  if (!hasMultipleItemGroup) {
    return (
      <View style={{ borderColor: Colors.border, borderBottomWidth: 0.5 }} />
    );
  }
  const amICategoryNoneGroup = itemGroup.category === "";

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: amIMoving ? Colors.orange : Colors.background.white,
        },
      ]}
    >
      <ThemedText
        color={amIMoving ? "white" : "gray"}
        style={{ marginLeft: 16 }}
      >
        {amICategoryNoneGroup ? "카테고리없음" : `#${itemGroup.category}`}
      </ThemedText>
      {!amICategoryNoneGroup && (
        <ThemedIconButton
          IconComponent={Ionicons}
          iconName="swap-vertical"
          onPressIn={() => {
            setMoveTarget({
              type: "ITEM_GROUP",
              itemGroupId: itemGroup.id,
              itemId: null,
            });
            drag();
          }}
          disabled={amICategoryNoneGroup}
          color="gray"
          style={{
            padding: 10,
            marginRight: 8,
          }}
        />
      )}
    </View>
  );
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
});
