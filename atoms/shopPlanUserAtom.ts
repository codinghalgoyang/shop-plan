import { ShopPlanUser } from "@/utils/types";
import { atom } from "recoil";

export const shopPlanUserState = atom<ShopPlanUser | null>({
  key: "shop-plan-user",
  default: null,
});
