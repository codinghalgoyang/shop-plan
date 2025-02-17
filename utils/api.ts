import {
  collection,
  doc,
  getDoc,
  getDocs,
  onSnapshot,
  query,
  setDoc,
  Unsubscribe,
  updateDoc,
  where,
} from "firebase/firestore";
import { db } from "./firebaseConfig";
import { InvitedPlanUser, Plan, PlanItem, PlanUser, User } from "./types";

export async function firestoreGetUser(uid: string): Promise<User | null> {
  if (!uid) return null;

  try {
    const userDocRef = doc(db, "Users", uid);
    const userDoc = await getDoc(userDocRef);

    if (userDoc.exists()) {
      const user = userDoc.data() as User;
      return user;
    } else {
      return null;
    }
  } catch (error) {
    console.error(error);
    return null;
  }
}

export async function firestoreFindUser(
  username: string
): Promise<User | null> {
  try {
    const q = query(collection(db, "Users"), where("username", "==", username));
    const querySnapshot = await getDocs(q);
    if (!querySnapshot.empty) {
      const user = querySnapshot.docs[0].data() as User;
      return user;
    } else {
      return null;
    }
  } catch (error) {
    console.error(error);
    return null;
  }
}

export function firestoreSubscribeUser(
  uid: string,
  onChange: (user: User) => void
): Unsubscribe {
  const userDocRef = doc(db, "Users", uid);
  const unsubscribe = onSnapshot(
    userDocRef,
    (userDoc) => {
      if (userDoc.exists()) {
        const user = userDoc.data() as User;
        onChange(user);
      } else {
        console.log("No such user: ", uid);
      }
    },
    (error) => {
      console.log(error);
    }
  );

  return unsubscribe;
}

export async function firestoreAddUser(user: User): Promise<boolean> {
  try {
    const userDocRef = doc(db, "Users", user.uid);
    await setDoc(userDocRef, user);
    return true;
  } catch (error) {
    console.error(error);
    return false;
  }
}

export function firestoreSubscribePlans(
  uid: string,
  onChange: (plans: Plan[]) => void
): Unsubscribe {
  const q = query(
    collection(db, "Plans"),
    where("planUserUids", "array-contains", uid)
  );

  const unsubscribe = onSnapshot(q, (snapshot) => {
    const plans = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as Plan[];
    onChange(plans);
  });

  return unsubscribe;
}

export function firestoreSubscribeInvitedPlans(
  uid: string,
  onChange: (plans: Plan[]) => void
): Unsubscribe {
  const q = query(
    collection(db, "Plans"),
    where("invitedPlanUserUids", "array-contains", uid)
  );

  const unsubscribe = onSnapshot(q, (snapshot) => {
    const plans = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as Plan[];
    onChange(plans);
  });

  return unsubscribe;
}

export async function firestoreAddPlanItem(
  plan: Plan,
  title: string,
  category?: string,
  link?: string
) {
  try {
    const planDocRef = doc(db, "Plans", plan.id);
    const newPlan: Plan = { ...plan };
    newPlan.items = [
      ...newPlan.items,
      {
        checked: false,
        title: title,
        category: category,
        link: link,
      },
    ];
    await updateDoc(planDocRef, newPlan);
  } catch (error) {
    console.error("문서 수정 중 오류 발생:", error);
  }
}

export async function firestoreUpdatePlanItem(
  plan: Plan,
  itemIdx: number,
  newPlanItem: PlanItem
) {
  try {
    const planDocRef = doc(db, "Plans", plan.id);
    const newPlan: Plan = { ...plan };
    const newPlanItems = [...newPlan.items];
    newPlanItems[itemIdx] = newPlanItem;
    newPlan.items = newPlanItems;
    await updateDoc(planDocRef, newPlan);
  } catch (error) {
    console.error("문서 수정 중 오류 발생:", error);
  }
}

export async function firestoreAddPlan(
  title: string,
  planUsers: PlanUser[],
  invitedPlanUsers: InvitedPlanUser[]
): Promise<boolean> {
  try {
    const planDocRef = doc(collection(db, "Plans"));
    const newPlan: Plan = {
      id: planDocRef.id,
      title: title,
      planUserUids: planUsers.map((planUser) => planUser.uid),
      planUsers: planUsers,
      invitedPlanUserUids: invitedPlanUsers.map(
        (invitedPlanUser) => invitedPlanUser.uid
      ),
      invitedPlanUsers: invitedPlanUsers,
      items: [],
    };
    await setDoc(planDocRef, newPlan);
    return true;
  } catch (error) {
    console.error("문서 수정 중 오류 발생:", error);
    return false;
  }
}

export async function firestoreJoinPlan(user: User, plan: Plan) {
  try {
    console.log("1");
    const planDocRef = doc(db, "Plans", plan.id);
    console.log("2");
    const newPlan: Plan = { ...plan };
    console.log("3");

    // remove from invitedPlan
    newPlan.invitedPlanUserUids = newPlan.invitedPlanUserUids.filter(
      (invitedPlanUserUid) => invitedPlanUserUid != user.uid
    );
    newPlan.invitedPlanUsers = newPlan.invitedPlanUsers.filter(
      (invitedPlanUser) => invitedPlanUser.uid != user.uid
    );
    console.log("4");
    // push to planUser
    newPlan.planUserUids = [...newPlan.planUserUids, user.uid];
    newPlan.planUsers = [
      ...newPlan.planUsers,
      {
        uid: user.uid,
        username: user.username,
        isAdmin: false,
      },
    ];

    console.log("5");
    console.log(newPlan);

    await updateDoc(planDocRef, newPlan);
    console.log("6");
  } catch (error) {
    console.error("문서 수정 중 오류 발생:", error);
  }
}

export async function firestoreDenyPlan(user: User, plan: Plan) {
  try {
    const planDocRef = doc(db, "Plans", plan.id);
    const newPlan: Plan = { ...plan };

    // remove from invitedPlan
    newPlan.invitedPlanUserUids = newPlan.invitedPlanUserUids.filter(
      (invitedPlanUserUid) => invitedPlanUserUid != user.uid
    );
    newPlan.invitedPlanUsers = newPlan.invitedPlanUsers.filter(
      (invitedPlanUser) => invitedPlanUser.uid != user.uid
    );

    await updateDoc(planDocRef, newPlan);
  } catch (error) {
    console.error("문서 수정 중 오류 발생:", error);
  }
}
