import Header from "@/components/Common/Header";
import { router } from "expo-router";
import { ScrollView, StyleSheet, View } from "react-native";
import ScreenView from "@/components/Common/ScreenView";
import { useEffect } from "react";
import FloatingActionButtion from "@/components/Home/FloatingActionButton";
import { useRecoilState, useSetRecoilState } from "recoil";
import { userState } from "@/atoms/userAtom";
import HomePlanView from "@/components/Home/HomePlanView";
import {
  firestoreSubscribeInvitedPlans,
  firestoreSubscribePlans,
  firestoreSubscribeUser,
} from "@/utils/api";
import { plansState } from "@/atoms/plansAtom";
import { invitedPlansState } from "@/atoms/invitedPlanAtom";
import HomeInvitedPlanView from "@/components/Home/HomeInvitedPlanView";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Setting, settingState } from "@/atoms/settingAtom";
import { Colors } from "@/utils/Colors";
import AntDesign from "@expo/vector-icons/AntDesign";
import ThemedText from "@/components/Common/ThemedText";
import ThemedIconButton from "@/components/Common/ThemedIconButton";
import { modalState } from "@/atoms/modalAtom";
import { Plan } from "@/utils/types";
import HomeNativeAd from "@/components/Home/HomeNativeAd";

export default function HomeScreen() {
  // const bannerRef = useRef<BannerAd>(null);
  const setModal = useSetRecoilState(modalState);
  const [user, setUser] = useRecoilState(userState);
  const [plans, setPlans] = useRecoilState(plansState);
  const [invitedPlans, setInvitedPlans] = useRecoilState(invitedPlansState);
  const [setting, setSetting] = useRecoilState(settingState);

  const setPlansByOrder = (plans: Plan[]) => {
    const orderedPlans: Plan[] = plans.sort((planA, planB) => {
      const planAJoinedAt = planA.planUsers.find(
        (planUser) => planUser.uid === user.uid
      )?.createdAt;
      const planBJoinedAt = planB.planUsers.find(
        (planUser) => planUser.uid === user.uid
      )?.createdAt;
      if (planAJoinedAt && planBJoinedAt) {
        return planAJoinedAt - planBJoinedAt;
      }
      return 0;
    });
    setPlans(orderedPlans);
  };

  // Subscribe User, Plan
  useEffect(() => {
    if (!user) return;

    try {
      const unsubscribeUser = firestoreSubscribeUser(user.uid, setUser);
      const unsubscribePlans = firestoreSubscribePlans(
        user.uid,
        setPlansByOrder
      );
      const unsubscribeInvitedPlans = firestoreSubscribeInvitedPlans(
        user.uid,
        setInvitedPlans
      );

      return () => {
        unsubscribeUser();
        unsubscribePlans();
        unsubscribeInvitedPlans();
      };
    } catch (error) {
      setModal({
        visible: true,
        title: "서버 통신 에러",
        message: `서버와 연결상태가 좋지 않습니다. (${error})`,
      });
    }
  }, [user?.uid]);

  useEffect(() => {
    const loadSetting = async () => {
      try {
        const strSavedSetting = await AsyncStorage.getItem("setting");
        if (strSavedSetting) {
          const savedSetting = JSON.parse(strSavedSetting);
          setSetting(savedSetting);
        } else {
          const defaultSetting: Setting = {
            aodEnabled: false,
          };
          await AsyncStorage.setItem("setting", JSON.stringify(defaultSetting));
          setSetting(defaultSetting);
        }
      } catch (error) {
        setModal({
          visible: true,
          title: "서버 통신 에러",
          message: `사용자 설정정보를 불러올 수 없습니다. 문제가 계속되면 스토어에 문의 부탁드립니다.`,
        });
      }
    };

    loadSetting();
  }, []);

  return (
    <ScreenView>
      <Header title="플랜 리스트">
        <ThemedIconButton
          key="setting-action"
          IconComponent={AntDesign}
          iconName="setting"
          onPress={() => {
            router.push("/setting");
          }}
          size="big"
        />
      </Header>
      <View style={styles.container}>
        <HomeNativeAd />
        {plans.length == 0 && invitedPlans.length == 0 ? (
          <View
            style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
          >
            <ThemedText color="gray">'+' 버튼을 눌러</ThemedText>
            <ThemedText color="gray">새로운 플랜을 추가하세요</ThemedText>
          </View>
        ) : (
          <ScrollView contentContainerStyle={{ gap: 12 }}>
            <View style={styles.listContainer}>
              {plans.length != 0 && <ThemedText>나의 플랜</ThemedText>}
              {plans?.map((plan, index) => (
                <HomePlanView key={plan.id} planId={plan.id} />
              ))}
            </View>
            <View style={styles.listContainer}>
              {invitedPlans.length != 0 && (
                <ThemedText>초대받은 플랜</ThemedText>
              )}
              {user &&
                invitedPlans?.map((invitedPlan, index) => (
                  <HomeInvitedPlanView
                    key={invitedPlan.id}
                    index={index}
                    user={user}
                  />
                ))}
            </View>
            <View style={styles.emptyContainer} />
          </ScrollView>
        )}
        <FloatingActionButtion
          onPress={() => {
            router.push("/new_plan");
          }}
        />
      </View>
    </ScreenView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background.lightGray,
    padding: 12,
    gap: 12,
  },
  listContainer: {
    gap: 12,
  },
  emptyContainer: {
    height: 75,
  },
});
