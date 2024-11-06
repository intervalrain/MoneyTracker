import { MaterialCommunityIcons } from '@expo/vector-icons';

export const TRANSACTION_TYPES: Record<string, {
  label: string;
  icon: string; 
  mode: TransactionMode[];
}> = {
  food: {
    label: '餐飲',
    icon: 'food',
    mode: ['expense']
  },
  transport: {
    label: '交通',
    icon: 'train-car',
    mode: ['expense']
  },
  shopping: {
    label: '購物',
    icon: 'shopping',
    mode: ['expense']
  },
  entertainment: {
    label: '娛樂',
    icon: 'gamepad-variant',
    mode: ['expense']
  },
  bills: {
    label: '帳單',
    icon: 'file-document-outline',
    mode: ['expense']
  },
  salary: {
    label: '薪資',
    icon: 'cash',
    mode: ['income']
  },
  investment: {
    label: '投資',
    icon: 'chart-line',
    mode: ['income', 'expense']
  },
	transfer: {
		label: '轉帳',
		icon: 'transfer',
    mode: ['transfer']
	},
  other: {
    label: '其他',
    icon: 'dots-horizontal',
    mode: ['income', 'expense']
  }
};

export const ACCOUNT_TYPES: Record<string, {
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
  type: string;
  account: string;
  mode: TransactionMode;
  date: string;
  note?: string;
}

export interface Account {
  id: string;
  name: string;
  type: string;
  balance: number;
}

export interface DateRange {
  from: Date;
  to: Date;
}

export interface TimeSeriesData {
  date: string;
  income: number;
  expense: number;
}

export interface CategoryData {
  name: string;
  value: number;
}

export interface CategoryDataSet {
  income: CategoryData[];
  expense: CategoryData[];
}