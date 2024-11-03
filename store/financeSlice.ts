import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Transaction, AccountType, Account } from "../types";

interface FinanceState {
  transactions: Transaction[];
  accounts: Account[];
  currentMonthTotal: {
    income: number;
    expense: number;
    balance: number;
  };
}

const initialState: FinanceState = {
	transactions: [],
	accounts: [
		{ id: '1', name: '現金', type: 'cash', balance: 0 },
		{ id: '2', name: '銀行', type: 'bank', balance: 0 }
	],
  currentMonthTotal: {
		income: 0,
    expense: 0,
    balance: 0
	}
};

const financeSlice = createSlice({
	name: 'finance',
	initialState,
  reducers: {
		addTransaction: (state, action: PayloadAction<Transaction>) => {
			state.transactions.unshift(action.payload);
			const account = state.accounts.find(a => a.id === action.payload.account);
			if (account) {
				account.balance += action.payload.mode === 'income'
					? action.payload.amount
					: -action.payload.amount; 
			}
		}
	}
});

export const { addTransaction } = financeSlice.actions;
export default financeSlice.reducer;