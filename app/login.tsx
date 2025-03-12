import Paper from "@/components/Common/Paper";
import ScreenView from "@/components/Common/ScreenView";

import { Colors } from "@/utils/Colors";
import { StyleSheet, View } from "react-native";
import { useState } from "react";
import DescriptionView, {
  descriptions,
} from "@/components/Login/DescriptionView";
import StartShopPlanView from "@/components/Login/StartShopPlanView";

export default function LoginScreen() {
  const [currentPageIndex, setCurrentPageIndex] = useState(0);
  const isDescriptionPage = currentPageIndex !== descriptions.length;

  return (
    <ScreenView>
      <View style={styles.container}>
        {isDescriptionPage ? (
          <DescriptionView
            currentPageIndex={currentPageIndex}
            setCurrentPageIndex={setCurrentPageIndex}
          />
        ) : (
          <StartShopPlanView />
        )}
      </View>
    </ScreenView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background.white,
  },
});
