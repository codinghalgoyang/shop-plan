import { TextInput, View, StyleSheet } from "react-native";
import Feather from "@expo/vector-icons/Feather"; // "tag" | "link";

export enum ExtraInputType {
  CATEGORY,
  LINK,
}

interface ExtraInputProps {
  type: ExtraInputType;
  text: string;
  setText: (text: string) => void;
}

export default function ExtraInput({ type, text, setText }: ExtraInputProps) {
  return (
    <View
      style={[
        styles.container,
        type == ExtraInputType.CATEGORY ? styles.category : styles.link,
      ]}
    >
      <View style={styles.iconContainer}>
        {type == ExtraInputType.CATEGORY && (
          <Feather name="tag" style={styles.icon} />
        )}
        {type == ExtraInputType.LINK && (
          <Feather name="link" style={styles.icon} />
        )}
      </View>
      <TextInput
        style={styles.input}
        value={text}
        onChangeText={setText}
        placeholder="여기에 입력하세요"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
  },
  iconContainer: {
    paddingHorizontal: 8,
  },
  icon: {
    fontSize: 26,
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
