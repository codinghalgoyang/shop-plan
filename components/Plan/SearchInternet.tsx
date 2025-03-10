import { Colors } from "@/utils/Colors";
import { View } from "react-native";
import ThemedTextInput from "../Common/ThemedTextInput";
import ThemedTextButton from "../Common/ThemedTextButton";

interface SearchInternetProps {
  searchTerm: string;
  setSearchTerm: React.Dispatch<React.SetStateAction<string>>;
}

export default function SearchInternet({
  searchTerm,
  setSearchTerm,
}: SearchInternetProps) {
  return (
    <View
      style={{
        backgroundColor: Colors.background.lightGray,
        flexDirection: "row",
        alignItems: "center",
        paddingHorizontal: 8,
        paddingTop: 8,
        gap: 8,
      }}
    >
      <ThemedTextInput
        style={{ flex: 1 }}
        placeholder="검색 항목 선택 또는 직접 입력"
        value={searchTerm}
        onChangeText={setSearchTerm}
        autoCapitalize="none" // 자동 대문자 막기
      ></ThemedTextInput>
      <ThemedTextButton
        color="blue"
        type="fill"
        onPress={() => {
          setSearchTerm("");
        }}
      >
        쿠팡 검색
      </ThemedTextButton>
    </View>
  );
}
