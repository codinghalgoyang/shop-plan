import {
  collection,
  deleteDoc,
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

export async function firestoreRemoveCheckedPlanItem(plan: Plan) {
  try {
    const planDocRef = doc(db, "Plans", plan.id);
    const newPlan: Plan = { ...plan };
    const newPlanItems = plan.items.filter((item) => !item.checked);
    newPlan.items = newPlanItems;
    await updateDoc(planDocRef, newPlan);
  } catch (error) {
    console.error("문서 수정 중 오류 발생:", error);
  }
}

export async function firestoreRemoveAllPlanItem(plan: Plan) {
  try {
    const planDocRef = doc(db, "Plans", plan.id);
    const newPlan: Plan = { ...plan };
    newPlan.items = [];
    await updateDoc(planDocRef, newPlan);
  } catch (error) {
    console.error("문서 수정 중 오류 발생:", error);
  }
}

export async function firestoreUpdatePlan(plan: Plan) {
  try {
    const planDocRef = doc(db, "Plans", plan.id);
    await updateDoc(planDocRef, plan);
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

export async function firestoreRemovePlan(planId: string) {
  try {
    const planDocRef = doc(db, "Plans", planId);
    await deleteDoc(planDocRef);
    console.log(`문서 ${planId} 삭제 완료`);
  } catch (error) {
    console.error("문서 삭제 중 오류 발생:", error);
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

const _withdrawPlan = async (plan: Plan, user: User) => {
  // 나 혼자만 있을 때
  if (plan.planUserUids.length == 1) {
    firestoreRemovePlan(plan.id);
  } else {
    // 다른 유저들도 있는데
    const admins = plan.planUsers.filter((planUser) => planUser.isAdmin);
    const myPlanUser = plan.planUsers.find(
      (planUser) => planUser.uid === user.uid
    ) ?? { uid: "", username: "Unknown user", isAdmin: false };

    // 나만 admin 일때
    if (admins.length == 1 && myPlanUser.isAdmin) {
      firestoreRemovePlan(plan.id);
    } else {
      const myPlanUserIndex = plan.planUserUids.findIndex(
        (uid) => uid === myPlanUser.uid
      );

      console.log("myPlanUserIndex : ", myPlanUserIndex);

      const newPlanUserUids: string[] = plan.planUserUids.filter(
        (_, idx) => idx != myPlanUserIndex
      );
      const newPlanUsers: PlanUser[] = plan.planUsers.filter(
        (_, idx) => idx != myPlanUserIndex
      );

      const newPlan: Plan = { ...plan };
      newPlan.planUserUids = newPlanUserUids;
      newPlan.planUsers = newPlanUsers;
      firestoreUpdatePlan(newPlan);
    }
  }
};

export async function firestoreDeleteUser(user: User): Promise<boolean> {
  // remove user first
  try {
    const userDocRef = doc(db, "Users", user.uid);
    await deleteDoc(userDocRef);
  } catch (error) {
    console.error(error);
    return false;
  }

  // remove invited, plan
  // get User Plans
  try {
    const plansRef = collection(db, "Plans");
    const q = query(
      plansRef,
      where("planUserUids", "array-contains", user.uid)
    );

    const querySnapshot = await getDocs(q);
    const userPlans = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    userPlans.map((plan) => {
      _withdrawPlan(plan, user);
    });
  } catch (error) {
    console.error("Error fetching user plans: ", error);
    return false;
  }
  return true;
}
