import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { StyleSheet, TextInput, View } from "react-native";
import ExtraInputActivateButton from "./ExtraInputActivateButton";
import ExtraInput from "./ExtraInput";
import { firestoreAddPlanItem } from "@/utils/api";
import { Plan } from "@/utils/types";
import ThemedTextButton from "@/components/Common/ThemedTextButton";
import ThemedTextInput from "../Common/ThemedTextInput";
import { Colors } from "@/utils/Colors";
import { modalState } from "@/atoms/modalAtom";
import { useSetRecoilState } from "recoil";

interface PlanItemInputProps {
  plan: Plan;
  category: string;
  setCategory: Dispatch<SetStateAction<string>>;
  extraEnabled: boolean;
  setExtraEnabled: Dispatch<SetStateAction<boolean>>;
}

export default function PlanItemInput({
  plan,
  category,
  setCategory,
  extraEnabled,
  setExtraEnabled,
}: PlanItemInputProps) {
  const setModal = useSetRecoilState(modalState);
  const [title, setTitle] = useState("");
  const [link, setLink] = useState("");
  const [categoryFix, setCategoryFix] = useState(true);

  const handleSubmit = async () => {
    if (!title) {
      setModal({ visible: true, message: "아이템 항목 이름을 입력해주세요" });
      return;
    }
    try {
      await firestoreAddPlanItem(plan, title, category, link);
      // 입력 필드 초기화
      setTitle("");
      setLink("");
      if (!categoryFix) {
        setCategory("");
      }
    } catch (error) {
      setModal({
        visible: true,
        title: "서버 통신 에러",
        message: `서버와 연결상태가 좋지 않습니다. (${error})`,
      });
    }
  };

  useEffect(() => {
    if (!extraEnabled) {
      setCategory("");
    }
  }, [extraEnabled]);

  return (
    <View style={styles.container}>
      {extraEnabled && (
        <ExtraInput
          type="category"
          text={category}
          setText={setCategory}
          categoryFix={categoryFix}
          setCategoryFix={setCategoryFix}
        />
      )}
      {extraEnabled && <ExtraInput type="link" text={link} setText={setLink} />}
      <View style={styles.mainInputContainer}>
        <ExtraInputActivateButton
          enabled={extraEnabled}
          setEnabled={setExtraEnabled}
        />
        <ThemedTextInput
          style={styles.input}
          value={title}
          onChangeText={setTitle}
          placeholder="새로운 항목 입력"
          onFocus={() => {
            console.log(`[itemInput] is focused`);
          }}
          onBlur={() => {
            console.log(`[itemInput] is blured`);
          }}
        />
        <ThemedTextButton
          onPress={handleSubmit}
          type="fill"
          color={title == "" ? "gray" : "blue"}
        >
          등록
        </ThemedTextButton>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    backgroundColor: Colors.background.white,
    paddingRight: 8,
    paddingVertical: 8,
    gap: 8,
    borderTopWidth: 0.5,
    borderColor: Colors.border,
  },
  mainInputContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  input: {
    flex: 1,
    marginRight: 8,
  },
});
