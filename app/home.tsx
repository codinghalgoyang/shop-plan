import Header from "@/components/Common/Header";
import { router } from "expo-router";
import { ScrollView, StyleSheet, View } from "react-native";
import ScreenView from "@/components/Common/ScreenView";
import { useEffect } from "react";
import FloatingActionButtion from "@/components/Home/FloatingActionButton";
import { useRecoilState } from "recoil";
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
import { settingState } from "@/atoms/settingAtom";
import { Setting } from "@/utils/types";
import { Colors } from "@/utils/Colors";
import Ionicons from "@expo/vector-icons/Ionicons";
import ThemedText from "@/components/Common/ThemedText";
import ThemedIcon from "@/components/Common/ThemedIcon";
import ThemedIconButton from "@/components/Common/ThemedIconButton";

// const homeBannerAdUnitId = __DEV__
//   ? TestIds.ADAPTIVE_BANNER
//   : Platform.OS === "ios"
//   ? "ca-app-pub-4328295791477402/2394678759" // ios ad unit id
//   : "ca-app-pub-4328295791477402/6525495451"; // android ad unit id

export default function HomeScreen() {
  // const bannerRef = useRef<BannerAd>(null);
  const [user, setUser] = useRecoilState(userState);
  const [plans, setPlans] = useRecoilState(plansState);
  const [invitedPlans, setInvitedPlans] = useRecoilState(invitedPlansState);
  const [setting, setSetting] = useRecoilState(settingState);

  // Subscribe User, Plan
  useEffect(() => {
    if (!user) return;
    const unsubscribeUser = firestoreSubscribeUser(user.uid, setUser);
    const unsubscribePlans = firestoreSubscribePlans(user.uid, setPlans);
    const unsubscribeInvitedPlans = firestoreSubscribeInvitedPlans(
      user.uid,
      setInvitedPlans
    );

    return () => {
      unsubscribeUser();
      unsubscribePlans();
      unsubscribeInvitedPlans();
    };
  }, [user?.uid]);

  useEffect(() => {
    const loadSetting = async () => {
      try {
        const strSavedSetting = await AsyncStorage.getItem("setting");
        console.log("strSavedSetting : ", strSavedSetting);
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
        console.log(error);
      }
    };

    loadSetting();
  }, []);

  return (
    <ScreenView>
      <Header title="홈">
        <ThemedIconButton
          key="setting-action"
          IconComponent={Ionicons}
          iconName="settings-outline"
          onPress={() => {
            router.push("/setting");
          }}
          size="big"
        />
      </Header>
      <View style={styles.container}>
        <ScrollView contentContainerStyle={{ gap: 12 }}>
          <View style={styles.listContainer}>
            {plans.length != 0 && <ThemedText>나의 플랜</ThemedText>}
            {plans?.map((plan, index) => (
              <HomePlanView key={plan.id} index={index} />
            ))}
          </View>
          <View style={styles.listContainer}>
            {invitedPlans.length != 0 && <ThemedText>초대받은 플랜</ThemedText>}
            {user &&
              invitedPlans?.map((invitedPlan, index) => (
                <HomeInvitedPlanView
                  key={invitedPlan.id}
                  index={index}
                  user={user}
                />
              ))}
          </View>
        </ScrollView>
        <FloatingActionButtion
          onPress={() => {
            router.push("/add_plan");
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
});
