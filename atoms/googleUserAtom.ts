import { User } from "@react-native-google-signin/google-signin";
import { atom } from "recoil";

export const googleUserState = atom<User | null>({
  key: "user",
  default: null,
});
