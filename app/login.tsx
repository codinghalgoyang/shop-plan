import { userState } from "@/atoms/userAtom";
import Paper from "@/components/Common/Paper";
import ScreenView from "@/components/Common/ScreenView";
import ThemedText from "@/components/Common/ThemedText";
import ThemedTextButton from "@/components/Common/ThemedTextButton";
import { firestoreGetUser } from "@/utils/api";
import { Colors } from "@/utils/Colors";
import { FONT_SIZE } from "@/utils/Shapes";
import { GoogleSignin } from "@react-native-google-signin/google-signin";
import { router } from "expo-router";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import { useSetRecoilState } from "recoil";
import AntDesign from "@expo/vector-icons/AntDesign";
import Entypo from "@expo/vector-icons/Entypo";
import { useState } from "react";
import ThemedIcon from "@/components/Common/ThemedIcon";
import PageIndicator from "@/components/Login/PageIndicator";

type Description = {
  IconComponent: React.ComponentType<any>;
  iconName: string;
  title: string;
  subtitle: string[];
};

const descriptions: Description[] = [
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
  const setUser = useSetRecoilState(userState);
  const [currentPage, setCurrentPage] = useState(0);

  const signin = async () => {
    try {
      await GoogleSignin.hasPlayServices();
      const response = await GoogleSignin.signIn();
      const googleUserInfo = response.data;
      if (googleUserInfo) {
        const user = await firestoreGetUser(googleUserInfo?.user.id);
        if (user) {
          setUser(user);
          router.replace("/home");
        } else {
          router.replace(
            `/signup?uid=${googleUserInfo?.user.id}&email=${googleUserInfo?.user.email}&photo=${googleUserInfo?.user.photo}`
          );
        }
      }
    } catch (e) {
      router.replace("/error");
    }
  };

  return (
    <ScreenView>
      <View style={styles.container}>
        {currentPage !== descriptions.length ? (
          <Paper style={styles.descriptionContainer}>
            <ThemedIcon
              IconComponent={descriptions[currentPage].IconComponent}
              iconName={descriptions[currentPage].iconName}
              color="orange"
              style={{ fontSize: 56 }}
            />
            <ThemedText size="big" weight="bold">
              {descriptions[currentPage].title}
            </ThemedText>
            <View style={{ alignItems: "center" }}>
              <ThemedText color="gray">
                {descriptions[currentPage].subtitle[0]}
              </ThemedText>
              <ThemedText color="gray">
                {descriptions[currentPage].subtitle[1]}
              </ThemedText>
            </View>
            <PageIndicator
              currentPageIndex={currentPage}
              array={descriptions}
            />
          </Paper>
        ) : (
          <Paper style={styles.startContainer}>
            <ThemedText color="gray" style={{ fontSize: FONT_SIZE.big }}>
              우리들의 쇼핑 계획
            </ThemedText>
            <ThemedText weight="bold" style={{ fontSize: FONT_SIZE.big * 2 }}>
              ShopPlan
            </ThemedText>
          </Paper>
        )}
        {currentPage !== descriptions.length ? (
          <ThemedTextButton
            type="fill"
            size="big"
            onPress={() => {
              setCurrentPage((prev) => prev + 1);
            }}
          >
            다음으로 넘어가기
          </ThemedTextButton>
        ) : (
          <TouchableOpacity onPress={signin}>
            <View
              style={{
                paddingVertical: 12,
                paddingHorizontal: 16,
                borderRadius: 5,
                backgroundColor: Colors.orange,
                flexDirection: "row",
                alignItems: "center",
                gap: 8,
              }}
            >
              <ThemedIcon
                IconComponent={AntDesign}
                iconName="google"
                style={{ color: Colors.content.white }}
              />
              <ThemedText
                style={{ color: Colors.content.white, marginTop: -4 }}
                size="big"
              >
                구글 계정으로 로그인
              </ThemedText>
            </View>
          </TouchableOpacity>
        )}
      </View>
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
    gap: 4,
  },
});
