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
} from "@/utils/api";
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
import { userState } from "@/atoms/userAtom";
import { modalState } from "@/atoms/modalAtom";
import { Target } from "@/app/plan";
import { findItemGroup, findItem } from "@/utils/utils";
import { editTargetState } from "@/atoms/editTargetAtom";
import { scrollTargetState } from "@/atoms/scrollTargetAtom";

interface EditItemInputProps {
  plan: Plan;
}

type EditMode = "ITEM" | "CATEGORY" | "LINK";

export default function EditItemInput({ plan }: EditItemInputProps) {
  const setModal = useSetRecoilState(modalState);
  const [editTarget, setEditTarget] = useRecoilState(editTargetState);
  const setScrollTarget = useSetRecoilState(scrollTargetState);
  const user = useRecoilValue(userState);
  const [editMode, setEditMode] = useState<EditMode>("ITEM");
  const [newCategory, setNewCategory] = useState("");
  const [title, setTitle] = useState<string>("");
  const [link, setLink] = useState<string>("");
  const editingItem = findItem(plan, editTarget?.itemId || "");
  const editingItemGroup = findItemGroup(plan, editTarget?.itemGroupId || "");

  useEffect(() => {
    // init with current info
    if (editingItem) {
      setLink(editingItem.link);
      setTitle(editingItem.title);
    }
  }, [editingItem]);

  useEffect(() => {
    const backAction = () => {
      if (editMode === "CATEGORY" || editMode === "LINK") {
        setEditMode("ITEM");
        return true; // 이벤트 전파를 막음
      }
      return false;
    };

    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      backAction
    );

    return () => backHandler.remove(); // 컴포넌트 언마운트 시 이벤트 리스너 제거
  }, [editMode]);

  if (!editingItemGroup || !editingItem) {
    return null;
  }

  const canAddNewItemGroup = editMode === "CATEGORY" && newCategory !== "";
  const canChangeLink = editMode === "LINK" && link !== editingItem.link;
  const canChangeTitle =
    editMode === "ITEM" && title !== "" && title !== editingItem.title;
  const canSubmit =
    editMode === "ITEM"
      ? canChangeTitle
      : editMode === "CATEGORY"
      ? canAddNewItemGroup
      : canChangeLink;

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

  const addNewItemGroup = async () => {
    if (!canAddNewItemGroup) return;
    try {
      await firestoreAddItemGroup(plan, newCategory, user.username);
      setEditTarget(null);
    } catch (error) {
      setModal({
        visible: true,
        title: "서버 통신 에러",
        message: `서버와 연결상태가 좋지 않습니다. (${error})`,
      });
    }
  };

  const changeItemGroup = async (newItemGroupId: string) => {
    if (editingItemGroup?.id === newItemGroupId) {
      return;
    }

    try {
      await firestoreChangeItemGroup(plan, editingItem.id, newItemGroupId);
      setEditTarget(null);
      setScrollTarget({
        type: "ITEM",
        itemGroupId: newItemGroupId,
        itemId: editingItem.id,
      });
    } catch (error) {
      setModal({
        visible: true,
        title: "서버 통신 에러",
        message: `서버와 연결상태가 좋지 않습니다. (${error})`,
      });
    }
  };

  const changeLink = async () => {
    if (!canChangeLink) return;
    try {
      await firestoreChangeItemLink(
        plan,
        editingItem.itemGroupId,
        editingItem.id,
        link
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

  const changeTitle = async () => {
    if (!canChangeTitle) return;
    try {
      await firestoreChangeItemTitle(
        plan,
        editingItem.itemGroupId,
        editingItem.id,
        title
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
            const amIEditing = editingItemGroup.id === item.id;
            return (
              <TouchableOpacity
                key={item.id}
                onPress={() => {
                  changeItemGroup(item.id);
                }}
              >
                <View style={styles.category}>
                  <ThemedText color={amIEditing ? "orange" : "gray"}>
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
          </TouchableOpacity>
        )}
        {(editMode == "LINK" || editMode == "ITEM") && (
          <TouchableOpacity onPress={onPressLinkIcon}>
            <View style={styles.button}>
              <ThemedIcon
                color={editingItem.link !== "" ? "orange" : "gray"}
                IconComponent={MaterialCommunityIcons}
                iconName={
                  editingItem.link ? "link-variant" : "link-variant-plus"
                }
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
              ? newCategory
              : editMode == "LINK"
              ? link
              : title
          }
          onChangeText={
            editMode == "CATEGORY"
              ? setNewCategory
              : editMode == "LINK"
              ? setLink
              : setTitle
          }
          onSubmitEditing={
            editMode == "CATEGORY"
              ? addNewItemGroup
              : editMode == "LINK"
              ? changeLink
              : changeTitle
          }
        />
        <TouchableOpacity
          disabled={!canSubmit}
          onPress={
            editMode == "CATEGORY"
              ? addNewItemGroup
              : editMode == "LINK"
              ? changeLink
              : changeTitle
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
