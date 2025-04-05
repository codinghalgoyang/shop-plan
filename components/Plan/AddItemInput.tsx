import {
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
import { firestoreAddItemGroup, firestoreAddPlanItem } from "@/utils/api";
import { useRecoilValue, useSetRecoilState } from "recoil";
import { userState } from "@/atoms/userAtom";
import { modalState } from "@/atoms/modalAtom";
import { PlanScreenMode } from "@/app/plan";

interface AddItemInputProps {
  plan: Plan;
  activatedItemGroup: ItemGroup | null;
  setActivatedItemGroup: Dispatch<SetStateAction<ItemGroup | null>>;
}

type InputMode = "ITEM" | "CATEGORY" | "LINK";

export default function AddItemInput({
  plan,
  activatedItemGroup,
  setActivatedItemGroup,
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
      if (!activatedItemGroup) return;
      if (category == "") return;

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
    setInputMode("ITEM");
  };

  const submitNewItem = async () => {
    try {
      if (!activatedItemGroup) return;
      if (itemTitle == "") return;

      await firestoreAddPlanItem(
        plan,
        activatedItemGroup.id,
        itemTitle,
        link,
        user.username
      );
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

  if (!activatedItemGroup) {
    return null;
  } else {
    return (
      <View style={styles.container}>
        {inputMode == "CATEGORY" && (
          <ScrollView
            style={{ maxHeight: 90 }}
            showsVerticalScrollIndicator={true}
          >
            <View style={styles.categorysContainer}>
              {plan.itemGroups.map((itemGroup) => {
                return (
                  <TouchableOpacity
                    key={itemGroup.id}
                    onPress={() => {
                      setActivatedItemGroup(itemGroup);
                      setInputMode("ITEM");
                    }}
                  >
                    <View style={styles.category}>
                      <ThemedText
                        color={
                          activatedItemGroup.id == itemGroup.id
                            ? "blue"
                            : "gray"
                        }
                      >
                        {itemGroup.category == ""
                          ? "카테고리없음"
                          : `#${itemGroup.category}`}
                      </ThemedText>
                    </View>
                  </TouchableOpacity>
                );
              })}
            </View>
          </ScrollView>
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
            blurOnSubmit={false}
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
