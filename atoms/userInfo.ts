import { UserInfo } from "@/utils/types";
import { atom } from "recoil";

export const userInfoState = atom<UserInfo | null>({
  key: "user-info",
  default: null,
});
