import { Colors } from "@/utils/Colors";
import { StyleSheet, View } from "react-native";
import ThemedText from "../Common/ThemedText";
import { ItemGroup } from "@/utils/types";

interface PlanCategoryViewProps {
  itemGroup: ItemGroup;
  hasMultipleItemGroup: boolean;
}

export default function PlanCategoryView({
  itemGroup,
  hasMultipleItemGroup,
}: PlanCategoryViewProps) {
  // just return border
  if (!hasMultipleItemGroup) {
    return (
      <View style={{ borderColor: Colors.border, borderBottomWidth: 0.5 }} />
    );
  } else {
    const isCategoryNoneItemGroup = itemGroup.category == "";

    // TODO : Do not display delete/edit button if it's isCategoryNoneItemGroup
    return (
      <View style={styles.container}>
        <ThemedText color={"gray"} style={{ marginLeft: 16 }}>
          {isCategoryNoneItemGroup ? "분류없음" : `#${itemGroup.category}`}
        </ThemedText>
        {/* {planViewStatus.planViewMode == "DELETE" ? (
                <ThemedTextButton
                  color="orange"
                  size="small"
                  onPress={async () => {
                    setModal({
                      visible: true,
                      title: "삭제 확인",
                      message: `${itemGroup.category} 안에 있는 항목도 모두 삭제됩니다.`,
                      onConfirm: async () => {
                        try {
                          await firestoreDeleteItemGroup(plan, itemGroup.id);
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
                  }}
                >
                  삭제
                </ThemedTextButton>
              ) : (
                <ThemedTextButton
                  color={
                    itemGroup.id ==
                    planViewStatus.editingCategoryInfo.itemGroupId
                      ? "blue"
                      : "gray"
                  }
                  size="small"
                  onPress={() => {
                    onItemGroupEditPress(itemGroup.category, itemGroup.id);
                  }}
                  buttonStyle={{ marginRight: 8 }}
                >
                  {itemGroup.id ==
                  planViewStatus.editingCategoryInfo.itemGroupId
                    ? "편집중"
                    : "편집"}
                </ThemedTextButton>
              )} */}
      </View>
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
    paddingVertical: 8,
  },
});
