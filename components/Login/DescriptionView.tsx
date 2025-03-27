import { View, StyleSheet } from "react-native";
import ThemedTextButton from "@/components/Common/ThemedTextButton";
import PageIndicator from "@/components/Login/PageIndicator";
import { SetStateAction } from "react";

import ThemedIcon from "../Common/ThemedIcon";
import ThemedText from "../Common/ThemedText";
import { DescriptionContent } from "@/app/login";

interface DescriptionViewProps {
  display: "none" | "flex";
  descriptionContents: DescriptionContent[];
  currentPageIndex: number;
  setCurrentPageIndex: React.Dispatch<SetStateAction<number>>;
}

export default function DescriptionView({
  display,
  descriptionContents,
  currentPageIndex,
  setCurrentPageIndex,
}: DescriptionViewProps) {
  return (
    <View style={[styles.container, { display: display }]}>
      <View style={styles.contentContainer}>
        {descriptionContents.map((descriptonContent, index) => {
          return (
            <View
              style={{
                gap: 16,
                alignItems: "center",
                display: currentPageIndex === index ? "flex" : "none",
              }}
              key={descriptonContent.title}
            >
              <ThemedIcon
                IconComponent={descriptonContent.IconComponent}
                iconName={descriptonContent.iconName}
                color="orange"
                style={{ fontSize: 56 }}
              />
              <ThemedText size="big" weight="bold">
                {descriptonContent.title}
              </ThemedText>
              <View style={{ alignItems: "center" }}>
                <ThemedText color="gray">
                  {descriptonContent.subtitle[0]}
                </ThemedText>
                <ThemedText color="gray">
                  {descriptonContent.subtitle[1]}
                </ThemedText>
              </View>
            </View>
          );
        })}
        <PageIndicator
          currentPageIndex={currentPageIndex}
          array={descriptionContents}
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
