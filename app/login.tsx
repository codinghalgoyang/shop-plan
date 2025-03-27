import ScreenView from "@/components/Common/ScreenView";

import { Colors } from "@/utils/Colors";
import { StyleSheet, View } from "react-native";
import { useState } from "react";
import DescriptionView from "@/components/Login/DescriptionView";
import StartShopPlanView from "@/components/Login/StartShopPlanView";
import AntDesign from "@expo/vector-icons/AntDesign";
import Entypo from "@expo/vector-icons/Entypo";

export type DescriptionContent = {
  IconComponent: React.ComponentType<any>;
  iconName: string;
  title: string;
  subtitle: string[];
};

const descriptionContents: DescriptionContent[] = [
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

export default function LoginScreen() {
  const [currentPageIndex, setCurrentPageIndex] = useState(0);
  const isDescriptionPage = currentPageIndex !== descriptionContents.length;

  return (
    <ScreenView>
      <View style={styles.container}>
        <DescriptionView
          display={isDescriptionPage ? "flex" : "none"}
          descriptionContents={descriptionContents}
          currentPageIndex={currentPageIndex}
          setCurrentPageIndex={setCurrentPageIndex}
        />
        <StartShopPlanView display={!isDescriptionPage ? "flex" : "none"} />
      </View>
    </ScreenView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background.white,
    justifyContent: "center",
  },
});
