import Header from "@/components/Header";
import { router } from "expo-router";
import {
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import HeaderAction from "@/components/HeaderAction";
import ScreenView from "@/components/ScreenView";
import {
  BannerAd,
  BannerAdSize,
  TestIds,
  useForeground,
} from "react-native-google-mobile-ads";
import { useEffect, useRef } from "react";
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

const settingAction = (
  <HeaderAction
    key="setting-action"
    IconComponent={Ionicons}
    iconName="settings-outline"
    onPress={() => {
      router.push("/setting");
    }}
  />
);

const homeBannerAdUnitId = __DEV__
  ? TestIds.ADAPTIVE_BANNER
  : Platform.OS === "ios"
  ? "ca-app-pub-4328295791477402/2394678759" // ios ad unit id
  : "ca-app-pub-4328295791477402/6525495451"; // android ad unit id

export default function HomeScreen() {
  const bannerRef = useRef<BannerAd>(null);
  const [user, setUser] = useRecoilState(userState);
  const [plans, setPlans] = useRecoilState(plansState);
  const [invitedPlans, setInvitedPlans] = useRecoilState(invitedPlansState);

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

  useForeground(() => {
    Platform.OS === "ios" && bannerRef.current?.load();
  });

  return (
    <ScreenView>
      <Header title="ShopPlan" actions={[settingAction]} />
      <View style={styles.bannerContainer}>
        <View style={styles.banner}>
          <BannerAd
            ref={bannerRef}
            unitId={homeBannerAdUnitId}
            size={BannerAdSize.ANCHORED_ADAPTIVE_BANNER}
          />
        </View>
      </View>
      <Text>Home Screen</Text>
      <ScrollView>
        {plans?.map((plan, index) => (
          <HomePlanView key={plan.id} index={index} />
        ))}
        {invitedPlans?.map((invitedPlan, index) => (
          <HomePlanView key={invitedPlan.id} index={index} />
        ))}
      </ScrollView>
      <FloatingActionButtion
        onPress={() => {
          router.push("/add_plan");
        }}
      />
    </ScreenView>
  );
}

const styles = StyleSheet.create({
  bannerContainer: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    justifyContent: "center",
    alignItems: "center",
  },
  banner: {
    overflow: "hidden",
    borderRadius: 10,
  },
});
