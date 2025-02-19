import { User } from "@/utils/types";
import { atom } from "recoil";

export const defaultUser: User = {
  uid: "",
  email: "",
  photo: undefined,
  username: "",
};

export const userState = atom<User>({
  key: "user",
  default: defaultUser,
});
