import { View, StyleSheet } from "react-native";
import ThemedIcon from "@/components/Common/ThemedIcon";
import ThemedText from "@/components/Common/ThemedText";
import ThemedTextButton from "@/components/Common/ThemedTextButton";
import PageIndicator from "@/components/Login/PageIndicator";
import { SetStateAction } from "react";

interface DescriptionViewProps {
  descriptions: React.JSX.Element[];
  currentPageIndex: number;
  setCurrentPageIndex: React.Dispatch<SetStateAction<number>>;
}

export default function DescriptionView({
  descriptions,
  currentPageIndex,
  setCurrentPageIndex,
}: DescriptionViewProps) {
  return (
    <View style={styles.container}>
      <View style={styles.contentContainer}>
        {descriptions[currentPageIndex]}
        <PageIndicator
          currentPageIndex={currentPageIndex}
          array={descriptions}
        />
      </View>
      <ThemedTextButton
        type="fill"
        size="big"
        onPress={() => {
          setCurrentPageIndex((prev) => prev + 1);
        }}
      >
        다음으로 넘어가기
      </ThemedTextButton>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    height: "50%",
    alignItems: "center",
  },
  contentContainer: {
    margin: "auto",
    alignItems: "center",
    gap: 24,
  },
});
