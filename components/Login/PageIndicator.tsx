import { StyleSheet, View, ViewStyle } from "react-native";
import Octicons from "@expo/vector-icons/Octicons";
import ThemedIcon from "@/components/Common/ThemedIcon";

interface PageIndicatorProps {
  currentPageIndex: number;
  totalCount: number;
}

export default function PageIndicator({
  currentPageIndex,
  totalCount,
}: PageIndicatorProps) {
  const array = Array.from({ length: totalCount }, (_, index) => index + 1);

  return (
    <View style={styles.container}>
      {array.map((_, index) => (
        <ThemedIcon
          key={index}
          IconComponent={Octicons}
          iconName="dot-fill"
          size="big"
          color={currentPageIndex == index ? "orange" : "gray"}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flexDirection: "row", gap: 16 },
});
