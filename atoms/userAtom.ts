import { User } from "@/utils/types";
import { atom } from "recoil";

export const userState = atom<User | null>({
  key: "user",
  default: null,
});
