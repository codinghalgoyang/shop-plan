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
import {
  collection,
  doc,
  getDoc,
  getDocs,
  onSnapshot,
} from "firebase/firestore";
import { db } from "@/utils/firebaseConfig";
import FloatingActionButtion from "@/components/Home/FloatingActionButton";
import { useRecoilState, useRecoilValue } from "recoil";
import { useState } from "react";
import { Plan, UserInfo } from "@/utils/types";
import { userInfoState } from "@/atoms/userInfo";
import HomePlanView from "@/components/Home/HomePlanView";

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
  const [userInfo, setUserInfo] = useRecoilState(userInfoState);

  // subscribe userInfoDoc
  useEffect(() => {
    if (!userInfo) return;

    const userInfoDocRef = doc(db, "Users", userInfo.uid);
    const unsubscribe = onSnapshot(
      userInfoDocRef,
      (userInfoDoc) => {
        if (userInfoDoc.exists()) {
          const newUserInfo = userInfoDoc.data() as UserInfo;
          setUserInfo(newUserInfo);
        } else {
          console.log("No such userInfo : ", userInfo.uid);
        }
      },
      (error) => {
        console.log(error);
      }
    );

    return unsubscribe;
  }, []);

  useEffect(() => {
    async function getPlans() {
      try {
        userInfo?.userPlanIds.forEach(async (userPlanId) => {
          console.log(`Try to get Plan (${userPlanId})`);
          const plan = (
            await getDoc(doc(db, "Plans", userPlanId))
          ).data() as Plan;
          setPlans((prev) => {
            return [...prev, plan];
          });

          console.log("got Plan : ", plan);
        });
      } catch (error) {
        console.error("Error fetching documents: ", error);
      }
    }

    getPlans();
  }, [userInfo?.userPlanIds]);

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
        {userInfo?.userPlanIds.map((planId) => (
          <HomePlanView key={planId} planId={planId} />
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
