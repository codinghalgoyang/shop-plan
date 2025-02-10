import { doc, getDoc } from "firebase/firestore";
import { db } from "./firebaseConfig";
import { ShopPlanUser } from "./types";

export const getShopPlanUser = async (
  uid: string | undefined
): Promise<ShopPlanUser | null> => {
  if (!uid) return null;

  try {
    const userDocRef = doc(db, "Users", uid);
    const userDoc = await getDoc(userDocRef);

    if (userDoc.exists()) {
      const shopPlanUser = userDoc.data() as ShopPlanUser;
      console.log("User exists:", uid);
      return shopPlanUser; // 문서가 존재함
    } else {
      console.log("No such user!");
      return null; // 문서가 존재하지 않음
    }
  } catch (error) {
    console.error("Error checking user:", error);
    return null; // 오류 발생 시 false 반환
  }
};
