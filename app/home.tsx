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
import { collection, doc, getDoc, getDocs } from "firebase/firestore";
import { db } from "@/utils/firebaseConfig";
import FloatingActionButtion from "@/components/Home/FloatingActionButton";
import { useRecoilValue } from "recoil";
import { useState } from "react";
import { Plan } from "@/utils/types";
import { userInfoState } from "@/atoms/userInfo";

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
  const userInfo = useRecoilValue(userInfoState);
  const [myPlans, setMyPlans] = useState<Plan[]>();

  useEffect(() => {
    async function getPlans() {
      try {
        const plans: Plan[] = [];
        userInfo?.userPlanIds.forEach(async (userPlanId) => {
          const myPlan: Plan = (await getDoc(
            doc(db, "Plans", userPlanId)
          )) as unknown as Plan;
          plans.push(myPlan);
        });
        setMyPlans(plans);
      } catch (error) {
        console.error("Error fetching documents: ", error);
      }
    }

    getPlans();
  }, [userInfo?.userPlanIds]);

  useEffect(() => {
    const fetchData = async () => {
      console.log("FetchData!!!");
      const querySnapshot = await getDocs(collection(db, "Users"));
      console.log(querySnapshot);
      console.log("hello");
      querySnapshot.forEach((doc) => {
        console.log(doc.id);
        console.log(doc.data);
      });
    };
    fetchData();
  }, []);

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
        {myPlans?.map((plan) => {
          return (
            <TouchableOpacity
              onPress={() => {
                router.push(`/plan?planId=${plan.id}`);
              }}
            >
              <View>
                <Text>{plan.title}</Text>
              </View>
            </TouchableOpacity>
          );
        })}
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
