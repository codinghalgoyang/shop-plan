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
import { ActivatedItemGroupId, Target } from "@/app/plan";
import { findItemGroup } from "@/utils/utils";
import { scrollTargetState } from "@/atoms/scrollTargetAtom";

interface EditItemGroupsAddCategoryInputProps {
  plan: Plan;
  setScrollTarget: Dispatch<SetStateAction<Target>>;
}

export default function EditItemGroupsAddCategoryInput({
  plan,
  setScrollTarget,
}: EditItemGroupsAddCategoryInputProps) {
  const setModal = useSetRecoilState(modalState);
  const user = useRecoilValue(userState);
  const [category, setCategory] = useState("");

  if (!plan) {
    return null;
  }

  const canSubmit = category !== "";
  const submitCategory = async () => {
    try {
      if (!canSubmit) return;
      const newItemGroupId = await firestoreAddItemGroup(
        plan,
        category,
        user.username
      );
      setScrollTarget({
        type: "ITEM_GROUP",
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

  return (
    <View style={styles.container}>
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          submitBehavior={"submit"}
          numberOfLines={1}
          placeholderTextColor={Colors.content.bgGray.gray}
          placeholder={"추가할 카테고리 입력"}
          value={category}
          onChangeText={setCategory}
          onSubmitEditing={submitCategory}
        />
        <TouchableOpacity disabled={!canSubmit} onPress={submitCategory}>
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
              iconName={"plus"}
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
