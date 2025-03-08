import { useState } from "react";
import { StyleSheet, TextInput, View } from "react-native";
import ExtraInputActivateButton from "./ExtraInputActivateButton";
import ExtraInput, { ExtraInputType } from "./ExtraInput";
import { firestoreAddPlanItem } from "@/utils/api";
import { Plan } from "@/utils/types";
import ThemedTextButton from "@/components/Common/ThemedTextButton";
import ThemedTextInput from "../Common/ThemedTextInput";
import { Colors } from "@/utils/Colors";

interface PlanInputProps {
  plan: Plan;
}

export default function PlanItemInput({ plan }: PlanInputProps) {
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [link, setLink] = useState("");
  const [extraEnabled, setExtraEnabled] = useState(false);

  const handleSubmit = () => {
    if (!title) {
      console.log("Input title first");
      return;
    }
    firestoreAddPlanItem(plan, title, category, link);

    // 입력 필드 초기화
    setTitle("");
    setLink("");
  };

  return (
    <View style={styles.container}>
      {extraEnabled && (
        <ExtraInput
          type={ExtraInputType.CATEGORY}
          text={category}
          setText={setCategory}
        />
      )}
      {extraEnabled && (
        <ExtraInput type={ExtraInputType.LINK} text={link} setText={setLink} />
      )}
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
