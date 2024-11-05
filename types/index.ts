import { MaterialCommunityIcons } from '@expo/vector-icons';

export type TransactionType =
  | "food"
  | "transport"
  | "shopping"
  | "entertainment"
  | "bills"
  | "salary"
  | "investment"
  | "other";

export const TRANSACTION_TYPES: Record<TransactionType, {
  label: string;
  icon: keyof typeof MaterialCommunityIcons.glyphMap;
  color: string;
}> = {
  food: {
    label: '餐飲',
    icon: 'food',
    color: '#EF4444' // red-500
  },
  transport: {
    label: '交通',
    icon: 'train-car',
    color: '#3B82F6' // blue-500
  },
  shopping: {
    label: '購物',
    icon: 'shopping',
    color: '#F59E0B' // amber-500
  },
  entertainment: {
    label: '娛樂',
    icon: 'gamepad-variant',
    color: '#10B981' // emerald-500
  },
  bills: {
    label: '帳單',
    icon: 'file-document-outline',
    color: '#6366F1' // indigo-500
  },
  salary: {
    label: '薪資',
    icon: 'cash',
    color: '#059669' // emerald-600
  },
  investment: {
    label: '投資',
    icon: 'chart-line',
    color: '#7C3AED' // violet-600
  },
  other: {
    label: '其他',
    icon: 'dots-horizontal',
    color: '#6B7280' // gray-500
  }
};

export type AccountType = "cash" | "bank" | "credit" | "investment";

export const ACCOUNT_TYPES: Record<AccountType, {
  label: string;
}> = {
  cash: {
    label: '現金',
  },
  bank: {
		label: '銀行',
	},
	credit: {
		label: '信用卡'
	},
	investment: {
		label: '投資'
	}
};

export type TransactionMode = "expense" | "income" | "transfer";

export interface Transaction {
  id: string;
  amount: number;
  type: TransactionType;
  account: AccountType;
  mode: TransactionMode;
  date: string;
  note?: string;
}

export interface Account {
  id: string;
  name: string;
  type: AccountType;
  balance: number;
}
