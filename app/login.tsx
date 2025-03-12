import Paper from "@/components/Common/Paper";
import ScreenView from "@/components/Common/ScreenView";
import ThemedText from "@/components/Common/ThemedText";
import ThemedTextButton from "@/components/Common/ThemedTextButton";
import { Colors } from "@/utils/Colors";
import { FONT_SIZE } from "@/utils/Shapes";
import { StyleSheet, View } from "react-native";
import { useState } from "react";
import PageIndicator from "@/components/Login/PageIndicator";
import DescriptionView, {
  descriptions,
} from "@/components/Login/DescriptionView";
import SigninButton from "@/components/Login/SigninButton";

export default function LoginScreen() {
  const [currentPageIndex, setCurrentPageIndex] = useState(0);
  const isDescriptionPage = currentPageIndex !== descriptions.length;

  return (
    <ScreenView>
      {isDescriptionPage ? (
        <View style={styles.container}>
          <DescriptionView currentPageIndex={currentPageIndex} />
          <PageIndicator
            currentPageIndex={currentPageIndex}
            array={descriptions}
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
      ) : (
        <View style={styles.container}>
          <Paper style={styles.startContainer}>
            <View
              style={{ gap: 4, justifyContent: "center", alignItems: "center" }}
            >
              <ThemedText color="gray" style={{ fontSize: FONT_SIZE.big }}>
                우리들의 쇼핑 계획
              </ThemedText>
              <ThemedText weight="bold" style={{ fontSize: FONT_SIZE.big * 2 }}>
                ShopPlan
              </ThemedText>
            </View>
            <SigninButton />
          </Paper>
        </View>
      )}
    </ScreenView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background.white,
    justifyContent: "center",
    alignItems: "center",
    gap: 20,
  },
  descriptionContainer: {
    width: "100%",
    height: "50%",
    alignItems: "center",
    justifyContent: "center",
    gap: 16,
  },
  startContainer: {
    width: "100%",
    height: "50%",
    alignItems: "center",
    justifyContent: "center",
    gap: 88,
  },
});
