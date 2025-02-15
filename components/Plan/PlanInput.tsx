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
import Feather from "@expo/vector-icons/Feather";

interface PlanInputProps {
  onSubmit: (text: string) => void;
}

export default function PlanInput({ onSubmit }: PlanInputProps) {
  const [text, setText] = useState("");
  const handleInputChange = (input: string) => {
    setText(input);
  };

  const handleSubmit = () => {
    console.log("입력한 텍스트:", text);
    onSubmit(text);
    setText(""); // 입력 필드 초기화
  };

  return (
    <View style={styles.container}>
      <View style={styles.ativeButtonContainer}>
        <ExtraInputActivateButton iconName="tag" />
        <ExtraInputActivateButton iconName="link" />
      </View>
      <TextInput
        style={styles.input}
        value={text}
        onChangeText={handleInputChange}
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
