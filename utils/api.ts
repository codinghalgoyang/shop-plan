import { doc, getDoc } from "firebase/firestore";
import { db } from "./firebaseConfig";

export const checkUserExists = async (
  uid: string | undefined
): Promise<boolean> => {
  if (!uid) return false;

  try {
    const userDocRef = doc(db, "Users", uid);
    const userDoc = await getDoc(userDocRef);

    if (userDoc.exists()) {
      console.log("User exists:", uid);
      return true; // 문서가 존재함
    } else {
      console.log("No such user!");
      return false; // 문서가 존재하지 않음
    }
  } catch (error) {
    console.error("Error checking user:", error);
    return false; // 오류 발생 시 false 반환
  }
};
