import {
  FlatList,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
  BackHandler,
} from "react-native";
import ThemedText from "../Common/ThemedText";
import { ItemGroup, Plan } from "@/utils/types";
import { Colors } from "@/utils/Colors";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { Target } from "@/app/plan";
import ThemedIcon from "../Common/ThemedIcon";
import Octicons from "@expo/vector-icons/Octicons";
import { FONT_SIZE } from "@/utils/Shapes";
import { firestoreEditCategory } from "@/utils/api";
import { findItemGroup } from "@/utils/utils";

interface EditItemGroupInputProps {
  plan: Plan;
  editTarget: Target;
  setEditTarget: Dispatch<SetStateAction<Target>>;
}

export default function EditItemGroupInput({
  plan,
  editTarget,
  setEditTarget,
}: EditItemGroupInputProps) {
  const [category, setCategory] = useState("");
  const itemGroup = findItemGroup(plan, editTarget?.itemGroupId || "");
  const [showItemGroup, setShowItemGroup] = useState(false);
  if (!itemGroup) return null;

  useEffect(() => {
    setCategory(itemGroup.category);
  }, [editTarget]);

  const onCategoryButtonClick = () => {
    setShowItemGroup((prev) => !prev);
  };

  const canSubmit =
    editTarget && category !== "" && itemGroup.category !== category;

  const submit = async () => {
    if (canSubmit) {
      await firestoreEditCategory(plan, category, itemGroup.id);
      setEditTarget(null);
    }
  };

  const cancel = () => {
    setEditTarget(null);
  };

  useEffect(() => {
    const backAction = () => {
      if (editTarget) {
        setEditTarget(null);
        return true; // 이벤트 전파를 막음
      }
      return false;
    };

    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      backAction
    );

    return () => backHandler.remove(); // 컴포넌트 언마운트 시 이벤트 리스너 제거
  }, [editTarget]);

  return (
    <View style={styles.container}>
      {showItemGroup && (
        <FlatList
          horizontal={true}
          contentContainerStyle={{ gap: 4 }}
          keyboardShouldPersistTaps="handled"
          data={plan.itemGroups}
          keyExtractor={(item) => item.id}
          style={{ paddingTop: 4, paddingBottom: 8 }}
          renderItem={({ item }) => {
            return (
              <TouchableOpacity
                key={item.id}
                onPress={() => {
                  if (item.category == "") return null;
                  setEditTarget({
                    type: "ITEM_GROUP",
                    itemGroupId: item.id,
                    itemId: null,
                  });
                }}
              >
                <View style={styles.category}>
                  <ThemedText
                    color={
                      editTarget?.itemGroupId == item.id ? "orange" : "gray"
                    }
                  >
                    {item.category == "" ? "카테고리없음" : `#${item.category}`}
                  </ThemedText>
                </View>
              </TouchableOpacity>
            );
          }}
        />
      )}
      <View style={styles.inputContainer}>
        <TouchableOpacity onPress={onCategoryButtonClick}>
          <View style={styles.button}>
            <ThemedIcon
              color="orange"
              IconComponent={Octicons}
              iconName={"hash"}
            />
            {itemGroup.category !== "" && (
              <ThemedText color="orange" style={{ marginTop: -2 }}>
                {itemGroup.category.length <= 4
                  ? itemGroup.category
                  : `${itemGroup.category.slice(0, 4)}...`}
              </ThemedText>
            )}
          </View>
        </TouchableOpacity>

        <TextInput
          style={styles.input}
          submitBehavior={"submit"}
          numberOfLines={1}
          placeholderTextColor={Colors.content.bgGray.gray}
          placeholder={"변경할 카테고리 입력"}
          value={category}
          onChangeText={setCategory}
          onSubmitEditing={submit}
        />
        <TouchableOpacity disabled={!canSubmit} onPress={submit}>
          <View
            style={[
              styles.button,
              {
                marginRight: 1,
                paddingHorizontal: 11,
                backgroundColor: canSubmit
                  ? Colors.orange
                  : Colors.background.white,
              },
            ]}
          >
            <ThemedIcon
              color={canSubmit ? "white" : "gray"}
              IconComponent={Octicons}
              iconName={"check"}
            />
          </View>
        </TouchableOpacity>
        <TouchableOpacity onPress={cancel}>
          <View
            style={[
              styles.button,
              {
                marginRight: 1,
                paddingHorizontal: 11,
                backgroundColor: Colors.background.black,
              },
            ]}
          >
            <ThemedIcon
              color={"white"}
              IconComponent={Octicons}
              iconName={"x"}
            />
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.background.white,
    paddingHorizontal: 8,
    paddingVertical: 6,
    borderTopWidth: 0.5,
    borderColor: Colors.border,
    gap: 4,
  },
  categorysContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginBottom: 4,
    gap: 4,
  },
  category: {
    backgroundColor: Colors.background.gray,
    paddingVertical: 4,
    paddingHorizontal: 12,
    borderRadius: 25,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: Colors.background.gray,
    paddingHorizontal: 6,
    paddingVertical: 6,
    borderRadius: 25,
  },
  button: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: Colors.background.white,
    borderRadius: 25,
    paddingHorizontal: 8,
    paddingVertical: 8,
  },
  input: {
    fontSize: FONT_SIZE.normal,
    flex: 1,
    color: Colors.content.bgGray.black,
    textAlign: "center",
  },
});
