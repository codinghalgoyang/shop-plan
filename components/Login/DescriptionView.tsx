import { View, StyleSheet } from "react-native";
import ThemedIcon from "@/components/Common/ThemedIcon";
import ThemedText from "@/components/Common/ThemedText";
import AntDesign from "@expo/vector-icons/AntDesign";
import Entypo from "@expo/vector-icons/Entypo";
import ThemedTextButton from "@/components/Common/ThemedTextButton";
import PageIndicator from "@/components/Login/PageIndicator";
import { SetStateAction } from "react";

type Description = {
  IconComponent: React.ComponentType<any>;
  iconName: string;
  title: string;
  subtitle: string[];
};

export const descriptions: Description[] = [
  {
    IconComponent: AntDesign,
    iconName: "check",
    title: "빠짐없이 구매하세요",
    subtitle: ["쇼핑 목록을 확인해서", "잊지 말고 구매하세요"],
  },
  {
    IconComponent: AntDesign,
    iconName: "clockcircleo",
    title: "시간과 돈을 절약하세요",
    subtitle: ["쇼핑 목록을 작성하면", "장볼 때 시간과 돈을 아낄 수 있어요"],
  },
  {
    IconComponent: Entypo,
    iconName: "slideshare",
    title: "친구 또는 가족과 함께 하세요",
    subtitle: ["목록 추가, 삭제, 완료가", "실시간으로 공유됩니다"],
  },
];

interface DescriptionViewProps {
  currentPageIndex: number;
  setCurrentPageIndex: React.Dispatch<SetStateAction<number>>;
}

export default function DescriptionView({
  currentPageIndex,
  setCurrentPageIndex,
}: DescriptionViewProps) {
  return (
    <View style={styles.container}>
      <View style={styles.contentContainer}>
        <ThemedIcon
          IconComponent={descriptions[currentPageIndex].IconComponent}
          iconName={descriptions[currentPageIndex].iconName}
          color="orange"
          style={{ fontSize: 56 }}
        />
        <ThemedText size="big" weight="bold">
          {descriptions[currentPageIndex].title}
        </ThemedText>
        <View style={{ alignItems: "center" }}>
          <ThemedText color="gray">
            {descriptions[currentPageIndex].subtitle[0]}
          </ThemedText>
          <ThemedText color="gray">
            {descriptions[currentPageIndex].subtitle[1]}
          </ThemedText>
        </View>
      </View>
      <PageIndicator
        currentPageIndex={currentPageIndex}
        array={descriptions}
        style={styles.pageIndicator}
      />
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
    alignItems: "center",
  },
  contentContainer: {
    gap: 16,
    margin: "auto",
  },
  pageIndicator: {
    margin: "auto",
  },
});
