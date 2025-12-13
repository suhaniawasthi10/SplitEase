export interface Group {
  _id: string;
  name: string;
  description?: string;
  groupImage?: string;
  members: Array<{
    userId: {
      _id: string;
      name: string;
      username: string;
    };
    role: 'owner' | 'admin' | 'member';
    joinedAt: string;
  }>;
  createdBy: string;
  totalExpenses?: number;
  balance?: number;
  createdAt: string;
}

export interface Friend {
  _id: string;
  userId?: {
    _id: string;
    name: string;
    username: string;
    email: string;
  };
  friendId?: {
    _id: string;
    name: string;
    username: string;
    email: string;
  };
  from?: {
    _id: string;
    name: string;
    username: string;
    email: string;
  };
  status?: 'pending' | 'accepted';
  balance?: number;
  createdAt: string;
}

export interface Activity {
  _id: string;
  userId: string;
  activityType: 'expense_added' | 'expense_updated' | 'expense_deleted' | 'settlement' | 'group_created';
  description: string;
  groupId?: string;
  expenseId?: string;
  amount?: number;
  createdAt: string;
}

export interface User {
  _id: string;
  name: string;
  username: string;
  email: string;
  preferredCurrency?: string;
  upiId?: string;
  profileImage?: {
    url: string | null;
    publicId: string | null;
  };
  createdAt?: string;
  updatedAt?: string;
}

export interface GroupMember {
  userId: {
    _id: string;
    username: string;
    name: string;
    email: string;
    profileImage?: {
      url: string | null;
      publicId: string | null;
    };
  };
  role: 'owner' | 'admin' | 'member';
  joinedAt: string;
}

export interface GroupDetails {
  _id: string;
  name: string;
  description?: string;
  category?: 'trip' | 'home' | 'couple' | 'other';
  members: GroupMember[];
  memberInvitesAllowed: boolean;
  createdBy: string;
  createdAt: string;
}

export interface GroupStats {
  totalExpenses: number;
  expenseCount: number;
  totalSettlements: number;
  settlementCount: number;
}

export interface BalanceDetail {
  type: 'owes' | 'owed';
  user: {
    _id: string;
    username: string;
    name: string;
  };
  amount: number;
}

export interface UserBalance {
  youOwe: number;
  youreOwed: number;
  netBalance: number;
  balanceDetails: BalanceDetail[];
}

export interface Expense {
  _id: string;
  description: string;
  amount: number;
  paidBy: {
    _id: string;
    username: string;
    name: string;
  };
  splitType: 'equal' | 'exact' | 'percentage';
  participants: Array<{
    userId: {
      _id: string;
      username: string;
      name: string;
    };
    share: number;
    owes: number;
  }>;
  groupId?: string;
  category?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}
