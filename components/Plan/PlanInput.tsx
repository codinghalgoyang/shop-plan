import { useState } from "react";
import {
  Button,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
  Text,
} from "react-native";
import ExtraInputActivateButton from "./ExtraInputActivateButton";
import ExtraInput, { ExtraInputType } from "./ExtraInput";
import { firestoreAddPlanItem } from "@/utils/api";
import { Plan } from "@/utils/types";

interface PlanInputProps {
  plan: Plan;
}

export default function PlanInput({ plan }: PlanInputProps) {
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
        <TextInput
          style={styles.input}
          value={title}
          onChangeText={setTitle}
          placeholder="여기에 입력하세요"
        />
        <Button title="ADD" onPress={handleSubmit} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
  },
  mainInputContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 4,
    padding: 8,
  },
});
