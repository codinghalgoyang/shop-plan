export type ShopPlanUser = {
  uid: string;
  email: string;
  photo?: string;
  username: string;
  agreed: boolean;
  plans: {
    planId: string;
    notificationEnabled: boolean;
    customTitle: string;
  }[];
  invitedPlanIds: string[];
  defaultNotificationEnabled: {
    all: boolean;
    modifyItem: boolean;
    checkedItem: boolean;
    modifyUser: boolean;
    planInvite: boolean;
  };
  notifications: string[];
  aodEnabled: boolean;
};

export type PlanItem = {
  checked: boolean;
  title: string;
  category?: string;
  link?: string;
};

export type Plan = {
  id: string;
  title: string;
  admins: string[];
  uids: string[];
  invitedUids: string[];
  items: PlanItem[];
};
