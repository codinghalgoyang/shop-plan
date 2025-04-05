import { StyleSheet, TextInput, TouchableOpacity, View } from "react-native";
import ThemedText from "../Common/ThemedText";
import { Colors } from "@/utils/Colors";
import { FONT_SIZE } from "@/utils/Shapes";
import ThemedIcon from "../Common/ThemedIcon";
import Octicons from "@expo/vector-icons/Octicons";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { ItemGroup, Plan } from "@/utils/types";
import { firestoreAddPlanItem } from "@/utils/api";
import { useRecoilValue, useSetRecoilState } from "recoil";
import { userState } from "@/atoms/userAtom";
import { modalState } from "@/atoms/modalAtom";

interface AddItemInputProps {
  plan: Plan;
  targetItemGroup: ItemGroup | null;
  setTargetItemGroup: Dispatch<SetStateAction<ItemGroup | null>>;
}

type InputMode = "ITEM" | "CATEGORY" | "LINK";

export default function AddItemInput({
  plan,
  targetItemGroup,
  setTargetItemGroup,
}: AddItemInputProps) {
  const setModal = useSetRecoilState(modalState);
  const user = useRecoilValue(userState);
  const [inputMode, setInputMode] = useState<InputMode>("ITEM");
  const [category, setCategory] = useState("");
  const [link, setLink] = useState("");
  const [itemTitle, setItemTitle] = useState("");

  const onPressCategoryButton = () => {
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
  const onPressLinkButton = () => {
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

  const submitLink = () => {
    setInputMode("ITEM");
  };

  const submitNewItem = async () => {
    try {
      if (!targetItemGroup) return;
      if (itemTitle == "") return;

      await firestoreAddPlanItem(
        plan,
        targetItemGroup.id,
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

  if (!targetItemGroup) {
    return null;
  } else {
    return (
      <View style={styles.container}>
        <View style={styles.inputContainer}>
          {(inputMode == "CATEGORY" || inputMode == "ITEM") && (
            <TouchableOpacity onPress={onPressCategoryButton}>
              <View style={styles.button}>
                <ThemedIcon
                  color={
                    inputMode == "CATEGORY"
                      ? "orange"
                      : targetItemGroup.category !== ""
                      ? "blue"
                      : "gray"
                  }
                  IconComponent={Octicons}
                  iconName={"hash"}
                />
              </View>
            </TouchableOpacity>
          )}
          {(inputMode == "LINK" || inputMode == "ITEM") && (
            <TouchableOpacity onPress={onPressLinkButton}>
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
                ? () => {}
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
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.background.white,
    paddingHorizontal: 8,
    paddingVertical: 6,
    borderTopWidth: 0.5,
    borderColor: Colors.border,
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
