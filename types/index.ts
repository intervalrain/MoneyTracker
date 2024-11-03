export type TransactionType = 'food' | 'transport' | 'shopping' | 'entertainment' | 'bills' | 'salary' | 'investment' | 'other';

export type AccountType = 'cash' | 'bank' | 'credit' | 'investment';

export type TransactionMode = 'expense' | 'income';

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