import { doc, getDoc } from "firebase/firestore";
import { db } from "./firebaseConfig";
import { UserInfo } from "./types";

export const getUserInfo = async (
  uid: string | undefined
): Promise<UserInfo | null> => {
  if (!uid) return null;

  try {
    const userDocRef = doc(db, "Users", uid);
    const userDoc = await getDoc(userDocRef);

    if (userDoc.exists()) {
      const userInfo = userDoc.data() as UserInfo;
      console.log("User exists:", uid);
      return userInfo; // 문서가 존재함
    } else {
      console.log("No such user!");
      return null; // 문서가 존재하지 않음
    }
  } catch (error) {
    console.error("Error checking user:", error);
    return null; // 오류 발생 시 false 반환
  }
};
