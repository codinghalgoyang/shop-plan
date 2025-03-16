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
import { modalState } from "@/atoms/modalAtom";

export default function SigninButton() {
  const setModal = useSetRecoilState(modalState);
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
        } else if (user == null) {
          router.replace(
            `/signup?uid=${googleUserInfo?.user.id}&email=${googleUserInfo?.user.email}&photo=${googleUserInfo?.user.photo}`
          );
        } else {
          setModal({
            visible: true,
            message: `서버와 연결상태가 좋지 않습니다. 인터넷 연결을 확인해주세요.`,
          });
        }
      }
    } catch (e) {
      setModal({
        visible: true,
        message: `서버와 연결상태가 좋지 않습니다. 인터넷 연결을 확인해주세요.`,
      });
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
