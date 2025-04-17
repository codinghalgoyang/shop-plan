import {
  FlatList,
  ScrollView,
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
import { ItemGroup, Plan } from "@/utils/types";
import { firestoreAddItemGroup, firestoreEditPlanItem } from "@/utils/api";
import { useRecoilValue, useSetRecoilState } from "recoil";
import { userState } from "@/atoms/userAtom";
import { modalState } from "@/atoms/modalAtom";
import { Target } from "@/app/plan";
import { findItemGroup, findItem } from "@/utils/utils";

interface EditItemInputProps {
  plan: Plan;
  editTarget: Target;
  setEditTarget: Dispatch<SetStateAction<Target>>;
}

type EditMode = "ITEM" | "CATEGORY" | "LINK";

export default function EditItemInput({
  plan,
  editTarget,
  setEditTarget,
}: EditItemInputProps) {
  const setModal = useSetRecoilState(modalState);
  const user = useRecoilValue(userState);
  const [editMode, setEditMode] = useState<EditMode>("ITEM");
  const [category, setCategory] = useState(""); // category는 변경할 정보가 아닌, 새로운 카테고리 추가용

  const editItemGroup = findItemGroup(plan, editTarget?.itemGroupId || "");
  const editItem = findItem(
    plan,
    editTarget?.itemGroupId || "",
    editTarget?.itemId || ""
  );

  const [newItemGroup, setNewItemGroup] = useState<ItemGroup>({
    id: "",
    category: "",
    items: [],
  });
  const [newLink, setNewLink] = useState<string>("");
  const [newItemTitle, setNewItemTitle] = useState<string>("");

  useEffect(() => {
    if (!editItemGroup || !editItem) return;

    // init with current info
    setNewItemGroup({ ...editItemGroup });
    setNewLink(editItem.link);
    setNewItemTitle(editItem.title);
  }, [editTarget]);

  const onPressCategoryIcon = () => {
    setEditMode((prev) => {
      if (prev == "CATEGORY") {
        return "ITEM";
      }
      return "CATEGORY";
    });
  };

  const onPressLinkIcon = () => {
    setEditMode((prev) => {
      if (prev == "LINK") {
        return "ITEM";
      }
      return "LINK";
    });
  };

  if (!editTarget || !editTarget.itemId) return null;
  if (!editItemGroup || !editItem) return null;

  const canSubmit =
    (editMode == "CATEGORY" && category !== "") ||
    (editMode == "LINK" && newLink !== editItem.link) ||
    (editMode == "ITEM" && newItemGroup.id !== editItemGroup.id) ||
    (editMode == "ITEM" && newLink !== editItem.link) ||
    (editMode == "ITEM" &&
      newItemTitle !== "" &&
      newItemTitle !== editItem.title);

  const submitCategory = async () => {
    if (!canSubmit) return;
    try {
      await firestoreAddItemGroup(plan, category, user.username);
      setCategory("");
    } catch (error) {
      setModal({
        visible: true,
        title: "서버 통신 에러",
        message: `서버와 연결상태가 좋지 않습니다. (${error})`,
      });
    }
  };

  const submitLink = () => {
    if (!canSubmit) return;
    setEditMode("ITEM");
  };

  const submitEditItem = async () => {
    if (!canSubmit) return;
    try {
      if (newItemTitle == "") return;
      await firestoreEditPlanItem(
        plan,
        editTarget,
        newItemGroup.id,
        newLink,
        newItemTitle
      );
      setEditTarget(null);
    } catch (error) {
      setModal({
        visible: true,
        title: "서버 통신 에러",
        message: `서버와 연결상태가 좋지 않습니다. (${error})`,
      });
    }
  };

  const isChangeItemGroup = newItemGroup.id !== editItemGroup.id;

  return (
    <View style={styles.container}>
      {editMode == "CATEGORY" && (
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
                  setNewItemGroup(item);
                  setEditMode("ITEM");
                }}
              >
                <View style={styles.category}>
                  <ThemedText
                    color={
                      isChangeItemGroup
                        ? item.id == newItemGroup.id
                          ? "orange"
                          : "gray"
                        : item.id == editItemGroup.id
                        ? "black"
                        : "gray"
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
        {(editMode == "CATEGORY" || editMode == "ITEM") && (
          <TouchableOpacity onPress={onPressCategoryIcon}>
            <View style={styles.button}>
              <ThemedIcon
                color={editItemGroup.id == newItemGroup.id ? "gray" : "orange"}
                IconComponent={Octicons}
                iconName={"hash"}
              />
              {newItemGroup.category !== "" && (
                <ThemedText
                  color={
                    editItemGroup.id == newItemGroup.id ? "gray" : "orange"
                  }
                  style={{ marginTop: -2 }}
                >
                  {newItemGroup.category.length <= 4
                    ? newItemGroup.category
                    : `${newItemGroup.category.slice(0, 4)}...`}
                </ThemedText>
              )}
            </View>
          </TouchableOpacity>
        )}
        {(editMode == "LINK" || editMode == "ITEM") && (
          <TouchableOpacity onPress={onPressLinkIcon}>
            <View style={styles.button}>
              <ThemedIcon
                color={
                  editItem.link !== newLink
                    ? "orange"
                    : editItem.link !== ""
                    ? "blue"
                    : "gray"
                }
                IconComponent={MaterialCommunityIcons}
                iconName={newLink ? "link-variant" : "link-variant-plus"}
              />
            </View>
          </TouchableOpacity>
        )}
        <TextInput
          style={styles.input}
          submitBehavior={"submit"}
          numberOfLines={1}
          placeholderTextColor={Colors.content.bgGray.gray}
          placeholder={
            editMode == "CATEGORY"
              ? "추가할 카테고리 입력"
              : editMode == "LINK"
              ? "변경할 링크 입력"
              : "변경할 항목 입력"
          }
          value={
            editMode == "CATEGORY"
              ? category
              : editMode == "LINK"
              ? newLink
              : newItemTitle
          }
          onChangeText={
            editMode == "CATEGORY"
              ? setCategory
              : editMode == "LINK"
              ? setNewLink
              : setNewItemTitle
          }
          onSubmitEditing={
            editMode == "CATEGORY"
              ? submitCategory
              : editMode == "LINK"
              ? submitLink
              : submitEditItem
          }
        />
        <TouchableOpacity
          disabled={!canSubmit}
          onPress={
            editMode == "CATEGORY"
              ? submitCategory
              : editMode == "LINK"
              ? submitLink
              : submitEditItem
          }
        >
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
