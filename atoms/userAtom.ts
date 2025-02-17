import { User } from "@/utils/types";
import { atom } from "recoil";

export const userState = atom<User>({
  key: "user",
  default: {
    uid: "",
    email: "",
    photo: undefined,
    username: "",
  },
});
