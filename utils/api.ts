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
import {
  InvitedPlanUser,
  Item,
  ItemGroup,
  Plan,
  PlanUser,
  User,
} from "./types";
import { EditInfo } from "@/app/plan";
import { findItem, findItemGroup } from "./utils";

const unsubscribes: Unsubscribe[] = [];

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
  unsubscribes.forEach((unsubscribe) => {
    unsubscribe();
  });
  await deleteDoc(userDocRef);
}

export async function firestoreAddPlan(
  title: string,
  planUsers: PlanUser[],
  invitedPlanUsers: InvitedPlanUser[]
) {
  const planDocRef = doc(collection(db, "Plans"));
  const createdAt = Date.now();
  const newCategory = "";
  const newPlan: Plan = {
    id: planDocRef.id,
    title: title,
    planUserUids: planUsers.map((planUser) => planUser.uid),
    planUsers: planUsers,
    invitedPlanUserUids: invitedPlanUsers.map(
      (invitedPlanUser) => invitedPlanUser.uid
    ),
    invitedPlanUsers: invitedPlanUsers,
    itemGroups: [
      { id: `${createdAt}_${newCategory}`, category: newCategory, items: [] },
    ],
    createdAt: createdAt,
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
      createdAt: Date.now(),
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
    await firestoreUpdatePlan(newPlan);
  }
}

export async function firestoreAddItemGroup(
  plan: Plan,
  newCategory: string,
  username: string
) {
  const newItemGroups: ItemGroup[] = plan.itemGroups.map((itemGroup) => {
    return {
      id: itemGroup.id,
      category: itemGroup.category,
      items: [...itemGroup.items],
    };
  });

  const createdAt = Date.now();
  const itemGroupId = `${createdAt}_${newCategory}_${username}`;

  newItemGroups.push({
    id: itemGroupId,
    category: newCategory,
    items: [],
  });

  const newPlan: Plan = { ...plan };
  newPlan.itemGroups = newItemGroups;

  await firestoreUpdatePlan(newPlan);
  return itemGroupId;
}

export async function firestoreEditCategory(
  plan: Plan,
  newCategory: string,
  itemGroupId: string
) {
  const newItemGroups: ItemGroup[] = plan.itemGroups.map((itemGroup) => {
    if (itemGroup.id == itemGroupId) {
      return {
        id: itemGroup.id,
        category: newCategory,
        items: [...itemGroup.items],
      };
    } else {
      return {
        id: itemGroup.id,
        category: itemGroup.category,
        items: [...itemGroup.items],
      };
    }
  });

  const newPlan: Plan = { ...plan };
  newPlan.itemGroups = newItemGroups;

  await firestoreUpdatePlan(newPlan);
}

export async function firestoreDeleteItemGroup(
  plan: Plan,
  targetItemGroupId: string
) {
  const newItemGroups: ItemGroup[] = plan.itemGroups
    .map((itemGroup) => {
      return {
        id: itemGroup.id,
        category: itemGroup.category,
        items: [...itemGroup.items],
      };
    })
    .filter((itemGroup) => itemGroup.id !== targetItemGroupId);

  const newPlan: Plan = { ...plan };
  newPlan.itemGroups = newItemGroups;

  await firestoreUpdatePlan(newPlan);
}

export async function firestoreAddPlanItem(
  plan: Plan,
  itemGroupId: string,
  title: string,
  link: string,
  username: string
) {
  const newItemGroups: ItemGroup[] = plan.itemGroups.map((itemGroup) => {
    return {
      id: itemGroup.id,
      category: itemGroup.category,
      items: [...itemGroup.items],
    };
  });

  const targetItemGroup = newItemGroups.find(
    (itemGroup) => itemGroup.id == itemGroupId
  );

  if (!targetItemGroup) {
    throw new Error(`Can't find itemGroup (${itemGroupId})`);
  }

  const createdAt = Date.now();
  const itemId = `${createdAt}_${title}_${username}`;

  targetItemGroup.items.push({
    id: itemId,
    checked: false,
    title: title,
    link: link,
    createdAt: createdAt,
  });

  const newPlan: Plan = { ...plan };
  newPlan.itemGroups = newItemGroups;

  await firestoreUpdatePlan(newPlan);
}

export async function firestoreEditPlanItem(
  plan: Plan,
  editInfo: EditInfo,
  newItemGroupId: string,
  newLink: string,
  newItemTitle: string
) {
  if (editInfo?.target !== "ITEM") {
    throw new Error("Only can edit editInfo.target == 'ITEM'");
  }
  const originalItem = findItem(
    plan,
    editInfo.itemGroupId,
    editInfo.itemId || ""
  );
  if (!originalItem) {
    throw new Error("Can't find original Item");
  }

  // 기존 itemGroup에서 변경이 일어났을 때
  if (editInfo.itemGroupId == newItemGroupId) {
    if (originalItem) {
      await firestoreUpdatePlanItem(
        plan,
        editInfo.itemGroupId,
        originalItem.id,
        { ...originalItem, link: newLink, title: newItemTitle }
      );
    }
    // itemGroup이 변경되었을 때
  } else {
    const newItemGroups: ItemGroup[] = plan.itemGroups.map((itemGroup) => {
      return {
        id: itemGroup.id,
        category: itemGroup.category,
        items: [...itemGroup.items],
      };
    });

    // remove item from originalItemGroup
    const originalItemGroup = newItemGroups.find(
      (itemGroup) => itemGroup.id == editInfo.itemGroupId
    );
    if (!originalItemGroup) {
      throw new Error("Can't find originalItemGroup");
    }
    originalItemGroup.items = originalItemGroup.items.filter(
      (item) => item.id !== editInfo.itemId
    );

    // add item to newItemGroup
    const newItemGroup = newItemGroups.find(
      (itemGroup) => itemGroup.id == newItemGroupId
    );
    if (!newItemGroup) {
      throw new Error("Can't find newItemGroup");
    }
    newItemGroup.items.push({
      ...originalItem,
      link: newLink,
      title: newItemTitle,
    });

    const newPlan: Plan = { ...plan };
    newPlan.itemGroups = newItemGroups;

    await firestoreUpdatePlan(newPlan);
  }
}

// firestoreUpdatePlanItem doesn't support category change, if you want to change category too, use firestoreEditPlanItem
export async function firestoreUpdatePlanItem(
  plan: Plan,
  itemGruopId: string,
  itemId: string,
  newItem: Item
) {
  const newItemGroups: ItemGroup[] = plan.itemGroups.map((itemGroup) => {
    return {
      id: itemGroup.id,
      category: itemGroup.category,
      items: [...itemGroup.items],
    };
  });

  const targetItemGroup = newItemGroups.find(
    (itemGroup) => itemGroup.id == itemGruopId
  );

  if (!targetItemGroup) {
    throw new Error(`Can't find itemGroup (${itemGruopId})`);
  }

  const targetItemIdx = targetItemGroup.items.findIndex(
    (item) => item.id == itemId
  );

  if (targetItemIdx == -1) {
    throw new Error(`Can't find item (${itemId})`);
  }
  targetItemGroup.items[targetItemIdx] = newItem;

  const newPlan: Plan = { ...plan };
  newPlan.itemGroups = newItemGroups;

  await firestoreUpdatePlan(newPlan);
}

export async function firestoreRemoveSpecificPlanItem(
  plan: Plan,
  itemGroupId: string,
  itemId: string
) {
  const newItemGroups: ItemGroup[] = plan.itemGroups.map((itemGroup) => {
    return {
      id: itemGroup.id,
      category: itemGroup.category,
      items: [...itemGroup.items],
    };
  });
  const targetItemGroup = newItemGroups.find(
    (itemGroup) => itemGroup.id == itemGroupId
  );

  if (!targetItemGroup) {
    throw new Error(`Can't find itemGroupId (${itemGroupId})`);
  }

  targetItemGroup.items = targetItemGroup.items.filter(
    (item) => item.id != itemId
  );

  const newPlan: Plan = { ...plan };
  newPlan.itemGroups = newItemGroups;

  await firestoreUpdatePlan(newPlan);
}

export async function firestoreRemoveCheckedPlanItem(plan: Plan) {
  const newItemGroups: ItemGroup[] = plan.itemGroups.map((itemGroup) => {
    return {
      id: itemGroup.id,
      category: itemGroup.category,
      items: itemGroup.items.filter((item) => !item.checked),
    };
  });

  const newPlan: Plan = { ...plan };
  newPlan.itemGroups = newItemGroups;

  await firestoreUpdatePlan(newPlan);
}

export async function firestoreRemoveAllPlanItem(plan: Plan) {
  const newItemGroups: ItemGroup[] = plan.itemGroups.map((itemGroup) => {
    return {
      id: itemGroup.id,
      category: itemGroup.category,
      items: [],
    };
  });

  const newPlan: Plan = { ...plan };
  newPlan.itemGroups = newItemGroups;

  await firestoreUpdatePlan(newPlan);
}

export async function firestoreUncheckAllItems(plan: Plan) {
  const newItemGroups: ItemGroup[] = plan.itemGroups.map((itemGroup) => {
    return {
      id: itemGroup.id,
      category: itemGroup.category,
      items: itemGroup.items.map((item) => {
        return { ...item, checked: false };
      }),
    };
  });

  const newPlan: Plan = { ...plan };
  newPlan.itemGroups = newItemGroups;

  await firestoreUpdatePlan(newPlan);
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

  unsubscribes.push(unsubscribe);

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

  unsubscribes.push(unsubscribe);

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

  unsubscribes.push(unsubscribe);

  return unsubscribe;
}
