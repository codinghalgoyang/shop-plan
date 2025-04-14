import {
  FlatList,
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
import { Plan } from "@/utils/types";
import { firestoreAddItemGroup, firestoreAddPlanItem } from "@/utils/api";
import { useRecoilValue, useSetRecoilState } from "recoil";
import { userState } from "@/atoms/userAtom";
import { modalState } from "@/atoms/modalAtom";
import { ActivatedItemGroupId, ScrollInfo } from "@/app/plan";
import { findItemGroup } from "@/utils/utils";

interface AddItemInputProps {
  plan: Plan;
  activatedItemGroupId: ActivatedItemGroupId;
  setActivatedItemGroupId: Dispatch<SetStateAction<ActivatedItemGroupId>>;
  setScrollInfo: Dispatch<SetStateAction<ScrollInfo>>;
}

type InputMode = "ITEM" | "CATEGORY" | "LINK";

export default function AddItemInput({
  plan,
  activatedItemGroupId,
  setActivatedItemGroupId,
  setScrollInfo,
}: AddItemInputProps) {
  const setModal = useSetRecoilState(modalState);
  const user = useRecoilValue(userState);
  const [inputMode, setInputMode] = useState<InputMode>("ITEM");
  const [category, setCategory] = useState("");
  const [link, setLink] = useState("");
  const [itemTitle, setItemTitle] = useState("");

  const onPressCategoryIcon = () => {
    setInputMode((prev) => {
      if (prev == "CATEGORY") {
        // cancel category
        setCategory("");
        // 카테고리는 itemGroups 안에 있는 내용을 사용하고, 단순 입력용도이기 때문에 초기화 해도 문제 없음
        return "ITEM";
      }
      return "CATEGORY";
    });
  };

  const onPressLinkIcon = () => {
    setInputMode((prev) => {
      if (prev == "LINK") {
        // cancel link
        // setLink("");
        // 키보드의 완료를 누르지 않고 선택한 상황이라면 입력중이던 링크를 없앰?
        // 링크를 확인해보고 싶은 경우, 삭제되버리는 상황이 발생함.
        return "ITEM";
      }
      return "LINK";
    });
  };

  const submitCategory = async () => {
    try {
      if (!activatedItemGroupId) return;
      if (category == "") {
        setInputMode("ITEM");
        return;
      }

      const newItemGroupId = await firestoreAddItemGroup(
        plan,
        category,
        user.username
      );
      setScrollInfo({
        target: "ITEM_GROUP",
        itemGroupId: newItemGroupId,
        itemId: null,
      });
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
    setInputMode("ITEM");
  };

  const activatedItemGroup = findItemGroup(plan, activatedItemGroupId || "");
  if (!activatedItemGroupId || !activatedItemGroup) {
    return null;
  } else {
    const canSubmit =
      (inputMode == "CATEGORY" && category != "") ||
      inputMode == "LINK" ||
      (inputMode == "ITEM" && itemTitle != "");

    const submitNewItem = async () => {
      if (!canSubmit) return;
      try {
        if (!activatedItemGroupId) return;
        if (itemTitle == "") return;

        const newItemId = await firestoreAddPlanItem(
          plan,
          activatedItemGroupId,
          itemTitle,
          link,
          user.username
        );
        setScrollInfo({
          target: "ITEM",
          itemGroupId: activatedItemGroupId,
          itemId: newItemId,
        });

        setItemTitle("");
        setLink("");
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
        {inputMode == "CATEGORY" && (
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
                    setActivatedItemGroupId(item.id);
                    setInputMode("ITEM");
                    setScrollInfo({
                      target: "ITEM_GROUP",
                      itemGroupId: item.id,
                      itemId: null,
                    });
                  }}
                >
                  <View style={styles.category}>
                    <ThemedText
                      color={activatedItemGroupId == item.id ? "blue" : "gray"}
                    >
                      {item.category == ""
                        ? "카테고리없음"
                        : `#${item.category}`}
                    </ThemedText>
                  </View>
                </TouchableOpacity>
              );
            }}
          />
        )}
        <View style={styles.inputContainer}>
          {(inputMode == "CATEGORY" || inputMode == "ITEM") && (
            <TouchableOpacity onPress={onPressCategoryIcon}>
              <View style={styles.button}>
                <ThemedIcon
                  color={
                    inputMode == "CATEGORY"
                      ? "orange"
                      : activatedItemGroup.category !== ""
                      ? "blue"
                      : "gray"
                  }
                  IconComponent={Octicons}
                  iconName={"hash"}
                />
                {activatedItemGroup.category !== "" &&
                  inputMode !== "CATEGORY" && (
                    <ThemedText color="blue" style={{ marginTop: -2 }}>
                      {activatedItemGroup.category.length <= 4
                        ? activatedItemGroup.category
                        : `${activatedItemGroup.category.slice(0, 4)}...`}
                    </ThemedText>
                  )}
              </View>
            </TouchableOpacity>
          )}
          {(inputMode == "LINK" || inputMode == "ITEM") && (
            <TouchableOpacity onPress={onPressLinkIcon}>
              <View style={styles.button}>
                <ThemedIcon
                  color={
                    inputMode == "LINK" && link == ""
                      ? "orange"
                      : link
                      ? "blue"
                      : "gray"
                  }
                  IconComponent={MaterialCommunityIcons}
                  iconName={link ? "link-variant" : "link-variant-plus"}
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
              inputMode == "CATEGORY"
                ? "추가할 카테고리 입력"
                : inputMode == "LINK"
                ? "링크 입력"
                : "추가할 항목 입력"
            }
            value={
              inputMode == "CATEGORY"
                ? category
                : inputMode == "LINK"
                ? link
                : itemTitle
            }
            onChangeText={
              inputMode == "CATEGORY"
                ? setCategory
                : inputMode == "LINK"
                ? setLink
                : setItemTitle
            }
            onSubmitEditing={
              inputMode == "CATEGORY"
                ? submitCategory
                : inputMode == "LINK"
                ? submitLink
                : submitNewItem
            }
          />
          <TouchableOpacity
            disabled={!canSubmit}
            onPress={
              inputMode == "CATEGORY"
                ? submitCategory
                : inputMode == "LINK"
                ? submitLink
                : submitNewItem
            }
          >
            <View
              style={[
                styles.button,
                {
                  marginRight: 1,
                  paddingHorizontal: 11,
                  backgroundColor: canSubmit
                    ? Colors.blue
                    : Colors.background.white,
                },
              ]}
            >
              <ThemedIcon
                color={canSubmit ? "white" : "gray"}
                IconComponent={Octicons}
                iconName={inputMode == "LINK" ? "check" : "plus"}
              />
            </View>
          </TouchableOpacity>
        </View>
      </View>
    );
  }
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
    paddingHorizontal: 9,
    paddingVertical: 8,
  },
  input: {
    fontSize: FONT_SIZE.normal,
    flex: 1,
    color: Colors.content.bgGray.black,
    textAlign: "center",
  },
});
