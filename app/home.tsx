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
import HomeInvitedPlanView from "@/components/Home/HomeInvitedPlanView";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { settingState } from "@/atoms/settingAtom";
import { Setting } from "@/utils/types";
import { activateKeepAwake } from "expo-keep-awake";
import { Colors } from "@/utils/Colors";

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

  useForeground(() => {
    Platform.OS === "ios" && bannerRef.current?.load();
  });

  return (
    <ScreenView>
      <Header title="home" actions={[settingAction]} />
      <View style={styles.container}>
        {/* <View style={styles.bannerContainer}>
          <View style={styles.banner}>
            <BannerAd
              ref={bannerRef}
              unitId={homeBannerAdUnitId}
              size={BannerAdSize.ANCHORED_ADAPTIVE_BANNER}
            />
          </View>
        </View> */}
        <ScrollView>
          {plans?.map((plan, index) => (
            <HomePlanView key={plan.id} index={index} />
          ))}
          {user &&
            invitedPlans?.map((invitedPlan, index) => (
              <HomeInvitedPlanView
                key={invitedPlan.id}
                index={index}
                user={user}
              />
            ))}
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
    backgroundColor: Colors.background.lightGray,
    paddingVertical: 8,
    paddingHorizontal: 8,
    flex: 1,
  },
  // bannerContainer: {
  //   paddingHorizontal: 10,
  //   paddingVertical: 5,
  //   justifyContent: "center",
  //   alignItems: "center",
  // },
  // banner: {
  //   overflow: "hidden",
  //   borderRadius: 10,
  // },
});
