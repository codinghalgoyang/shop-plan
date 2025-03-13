import { StyleSheet, View, ViewStyle } from "react-native";
import Octicons from "@expo/vector-icons/Octicons";
import ThemedIcon from "@/components/Common/ThemedIcon";

interface PageIndicatorProps {
  currentPageIndex: number;
  array: any[];
  style: ViewStyle | ViewStyle[];
}

export default function PageIndicator({
  currentPageIndex,
  array,
}: PageIndicatorProps) {
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
