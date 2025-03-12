import { TouchableOpacity, View } from "react-native";
import ThemedIcon from "@/components/Common/ThemedIcon";
import ThemedText from "@/components/Common/ThemedText";
import { useSetRecoilState } from "recoil";
import { userState } from "@/atoms/userAtom";
import { firestoreGetUser } from "@/utils/api";
import { GoogleSignin } from "@react-native-google-signin/google-signin";
import { router } from "expo-router";
import AntDesign from "@expo/vector-icons/AntDesign";
import { Colors } from "@/utils/Colors";

export default function SigninButton() {
  const setUser = useSetRecoilState(userState);
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
  );
}
