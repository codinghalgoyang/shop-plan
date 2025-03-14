import { User } from "@/utils/types";
import { atom } from "recoil";

export const defaultUser: User = {
  uid: "",
  email: "",
  photo: undefined,
  username: "",
  isAgreed: false,
};

export const userState = atom<User>({
  key: "user",
  default: defaultUser,
});
