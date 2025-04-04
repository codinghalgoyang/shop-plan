import { TextInput, View, StyleSheet } from "react-native";
import Feather from "@expo/vector-icons/Feather"; // "tag" | "link";
import ThemedText from "../Common/ThemedText";
import ThemedTextInput from "../Common/ThemedTextInput";
import ThemedTextButton from "../Common/ThemedTextButton";

export type ExtraInputType = "category" | "link";

interface ExtraInputProps {
  type: ExtraInputType;
  text: string;
  setText: (text: string) => void;
  categoryFix?: boolean;
  setCategoryFix?: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function ExtraInput({
  type,
  text,
  setText,
  categoryFix,
  setCategoryFix,
}: ExtraInputProps) {
  return (
    <View style={styles.container}>
      <ThemedText size="small" color="gray" style={styles.title}>
        {type == "category" ? "분류" : "링크"}
      </ThemedText>
      <ThemedTextInput
        style={styles.input}
        value={text}
        onChangeText={setText}
        placeholder="미입력 가능"
        caretHidden={false}
        onFocus={() => {
          console.log(`[ExtraInput][${type}] is focused`);
        }}
        onBlur={() => {
          console.log(`[ExtraInput][${type}] is blured`);
        }}
      />
      {type == "category" && setCategoryFix && (
        <ThemedTextButton
          color={categoryFix ? "orange" : "gray"}
          type="fill"
          onPress={() => {
            if (setCategoryFix) {
              setCategoryFix((prev) => {
                const newCategoryFix = !prev;
                if (newCategoryFix == false) {
                  setText("");
                }
                return newCategoryFix;
              });
            }
          }}
        >
          고정
        </ThemedTextButton>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    paddingLeft: 8,
    gap: 8,
  },
  title: {
    paddingHorizontal: 1,
  },
  input: {
    flex: 1,
  },
});
