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

interface PlanInputProps {
  onSubmit: (text: string) => void;
}

export default function PlanInput({ onSubmit }: PlanInputProps) {
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [link, setLink] = useState("");
  const [extraEnabled, setExtraEnabled] = useState(false);

  const handleSubmit = () => {
    onSubmit(title);
    setTitle(""); // 입력 필드 초기화
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
      <ExtraInputActivateButton
        enabled={extraEnabled}
        setEnabled={setExtraEnabled}
      />
      <TextInput
        style={styles.input}
        value={title}
        onChangeText={setTitle}
        placeholder="여기에 입력하세요"
        onSubmitEditing={handleSubmit}
      />
      <Button title="ADD" onPress={handleSubmit} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    position: "absolute",
    bottom: 0,
    paddingVertical: 5,
  },
  ativeButtonContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: 10,
    gap: 10,
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 4,
    padding: 8,
    marginRight: 8,
  },
});
