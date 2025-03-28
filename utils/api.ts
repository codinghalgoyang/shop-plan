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

export async function firestoreAddUser(newUser: User) {
  const userDocRef = doc(db, "Users", newUser.uid);
  await setDoc(userDocRef, newUser);
}

export async function firestoreGetUser(uid: string): Promise<User | null> {
  if (!uid) return null;

  const userDocRef = doc(db, "Users", uid);
  const userDoc = await getDoc(userDocRef);

  if (userDoc.exists()) {
    const user = userDoc.data() as User;
    return user;
  } else {
    return null;
  }
}

export async function firestoreFindUser(
  username: string
): Promise<User | null> {
  const q = query(collection(db, "Users"), where("username", "==", username));
  const querySnapshot = await getDocs(q);
  if (!querySnapshot.empty) {
    const user = querySnapshot.docs[0].data() as User;
    return user;
  } else {
    return null;
  }
}

export async function firestoreDeleteUser(user: User) {
  const userDocRef = doc(db, "Users", user.uid);
  await deleteDoc(userDocRef);
}

export async function firestoreAddPlan(
  title: string,
  planUsers: PlanUser[],
  invitedPlanUsers: InvitedPlanUser[]
) {
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
}

export async function firestoreUpdatePlan(plan: Plan) {
  const planDocRef = doc(db, "Plans", plan.id);
  await updateDoc(planDocRef, plan);
}

export async function firestoreRemovePlan(planId: string) {
  const planDocRef = doc(db, "Plans", planId);
  await deleteDoc(planDocRef);
}

export async function firestoreJoinPlan(user: User, plan: Plan) {
  const planDocRef = doc(db, "Plans", plan.id);
  const newPlan: Plan = { ...plan };

  // remove from invitedPlan
  newPlan.invitedPlanUserUids = newPlan.invitedPlanUserUids.filter(
    (invitedPlanUserUid) => invitedPlanUserUid != user.uid
  );
  newPlan.invitedPlanUsers = newPlan.invitedPlanUsers.filter(
    (invitedPlanUser) => invitedPlanUser.uid != user.uid
  );
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

  await updateDoc(planDocRef, newPlan);
}

export async function firestoreDenyPlan(user: User, plan: Plan) {
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
}

export async function firestoreEscapePlan(plan: Plan, user: User) {
  const myPlanUser = plan.planUsers.find(
    (planUser) => planUser.uid === user.uid
  ) ?? { uid: "", username: "Unknown user", isAdmin: false };
  const admins = plan.planUsers.filter((planUser) => planUser.isAdmin);

  if (plan.planUserUids.length == 1) {
    // 나 혼자만 있을 때
    await firestoreRemovePlan(plan.id);
  } else {
    // 다른 유저도 있을때
    const myPlanUserIndex = plan.planUserUids.findIndex(
      (uid) => uid === myPlanUser.uid
    );
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

export async function firestoreAddPlanItem(
  plan: Plan,
  title: string,
  category?: string,
  link?: string
) {
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
}

export async function firestoreUpdatePlanItem(
  plan: Plan,
  itemIdx: number,
  newPlanItem: PlanItem
) {
  const planDocRef = doc(db, "Plans", plan.id);
  const newPlan: Plan = { ...plan };
  const newPlanItems = [...newPlan.items];
  newPlanItems[itemIdx] = newPlanItem;
  newPlan.items = newPlanItems;
  await updateDoc(planDocRef, newPlan);
}

export async function firestoreRemoveSpecificPlanItem(
  plan: Plan,
  itemIdx: number
) {
  const planDocRef = doc(db, "Plans", plan.id);
  const newPlan: Plan = { ...plan };
  const newPlanItems = plan.items.filter((_, idx) => idx != itemIdx);
  newPlan.items = newPlanItems;
  await updateDoc(planDocRef, newPlan);
}

export async function firestoreRemoveCheckedPlanItem(plan: Plan) {
  const planDocRef = doc(db, "Plans", plan.id);
  const newPlan: Plan = { ...plan };
  const newPlanItems = plan.items.filter((item) => !item.checked);
  newPlan.items = newPlanItems;
  await updateDoc(planDocRef, newPlan);
}

export async function firestoreRemoveAllPlanItem(plan: Plan) {
  const planDocRef = doc(db, "Plans", plan.id);
  const newPlan: Plan = { ...plan };
  newPlan.items = [];
  await updateDoc(planDocRef, newPlan);
}

export async function firestoreUncheckAllItems(plan: Plan) {
  const planDocRef = doc(db, "Plans", plan.id);
  const newPlan: Plan = { ...plan };
  const newPlanItems = plan.items.map((item) => {
    return { ...item, checked: false };
  });
  newPlan.items = newPlanItems;
  await updateDoc(planDocRef, newPlan);
}

export function firestoreSubscribeUser(
  uid: string,
  onChange: (user: User) => void
): Unsubscribe {
  const userDocRef = doc(db, "Users", uid);
  const unsubscribe = onSnapshot(userDocRef, (userDoc) => {
    if (userDoc.exists()) {
      const user = userDoc.data() as User;
      onChange(user);
    } else {
      throw new Error(`No user, Can't subscribe user(${uid})`);
    }
  });

  return unsubscribe;
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
