import { StyleSheet, TextInput, TouchableOpacity, View } from "react-native";
import ThemedText from "../Common/ThemedText";
import { ItemGroup, Plan } from "@/utils/types";
import { Colors } from "@/utils/Colors";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { EditInfo, PlanScreenMode } from "@/app/plan";
import ThemedIcon from "../Common/ThemedIcon";
import Octicons from "@expo/vector-icons/Octicons";
import { FONT_SIZE } from "@/utils/Shapes";
import { firestoreEditCategory } from "@/utils/api";
import { findItemGroup } from "@/utils/utils";

interface EditItemGroupInputProps {
  plan: Plan;
  setPlanScreenMode: Dispatch<SetStateAction<PlanScreenMode>>;
  editInfo: EditInfo;
}

export default function EditItemGroupInput({
  plan,
  setPlanScreenMode,
  editInfo,
}: EditItemGroupInputProps) {
  const [category, setCategory] = useState("");
  const itemGroup = findItemGroup(plan, editInfo?.itemGroupId || "");
  if (!itemGroup) return null;

  useEffect(() => {
    setCategory(itemGroup.category);
  }, [editInfo]);

  const onSubmit = async () => {
    if (category !== itemGroup.category) {
      await firestoreEditCategory(plan, category, itemGroup.id);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.inputContainer}>
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

        <TextInput
          style={styles.input}
          blurOnSubmit={false}
          numberOfLines={1}
          placeholderTextColor={Colors.content.bgGray.gray}
          placeholder={"변경할 카테고리 입력"}
          value={category}
          onChangeText={setCategory}
          onSubmitEditing={onSubmit}
        />
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
