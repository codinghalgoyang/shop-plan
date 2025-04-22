import {
  FlatList,
  BackHandler,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import ThemedText from "../Common/ThemedText";
import { Colors } from "@/utils/Colors";
import { FONT_SIZE } from "@/utils/Shapes";
import ThemedIcon from "../Common/ThemedIcon";
import Octicons from "@expo/vector-icons/Octicons";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { Item, ItemGroup, Plan } from "@/utils/types";
import {
  firestoreAddItemGroup,
  firestoreChangeItemGroup,
  firestoreChangeItemLink,
  firestoreChangeItemTitle,
  firestoreEditCategory,
} from "@/utils/api";
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
import { userState } from "@/atoms/userAtom";
import { modalState } from "@/atoms/modalAtom";
import { Target } from "@/app/plan";
import { findItemGroup, findItem } from "@/utils/utils";
import { editTargetState } from "@/atoms/editTargetAtom";

interface EditItemInputProps {
  plan: Plan;
}

type EditMode = "ITEM" | "CATEGORY" | "LINK";

export default function EditItemGroupInput({ plan }: EditItemInputProps) {
  const setModal = useSetRecoilState(modalState);
  const [editTarget, setEditTarget] = useRecoilState(editTargetState);
  const user = useRecoilValue(userState);
  const [category, setCategory] = useState("");
  const editingItemGroup = findItemGroup(plan, editTarget?.itemGroupId || "");

  useEffect(() => {
    // init with current info
    if (editingItemGroup) {
      setCategory(editingItemGroup.category);
    }
  }, [editingItemGroup]);

  if (!editingItemGroup) {
    return null;
  }

  const canChangeCategory =
    category !== "" && category !== editingItemGroup.category;

  const changeCategory = async () => {
    if (!canChangeCategory) return;
    try {
      await firestoreEditCategory(plan, category, editingItemGroup.id);
      setEditTarget(null);
    } catch (error) {
      setModal({
        visible: true,
        title: "서버 통신 에러",
        message: `서버와 연결상태가 좋지 않습니다. (${error})`,
      });
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
          {editingItemGroup.category !== "" && (
            <ThemedText color={"orange"} style={{ marginTop: -2 }}>
              {editingItemGroup.category.length <= 4
                ? editingItemGroup.category
                : `${editingItemGroup.category.slice(0, 4)}...`}
            </ThemedText>
          )}
        </View>
        <TextInput
          style={styles.input}
          submitBehavior={"submit"}
          numberOfLines={1}
          placeholderTextColor={Colors.content.bgGray.gray}
          placeholder={"카테고리 이름 입력"}
          value={category}
          onChangeText={setCategory}
          onSubmitEditing={changeCategory}
        />
        <TouchableOpacity
          disabled={!canChangeCategory}
          onPress={changeCategory}
        >
          <View
            style={[
              styles.button,
              {
                marginRight: 1,
                paddingHorizontal: 11,
                backgroundColor: canChangeCategory
                  ? Colors.orange
                  : Colors.background.white,
              },
            ]}
          >
            <ThemedIcon
              color={canChangeCategory ? "white" : "gray"}
              IconComponent={Octicons}
              iconName={"check"}
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
