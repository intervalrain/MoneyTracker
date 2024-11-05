import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Transaction } from "@/types";

interface TransactionState {
  transactions: Transaction[];
  loading: boolean;
  error: string | null;
}

const initialState: TransactionState = {
  transactions: [],
  loading: false,
  error: null,
};

const transactionSlice = createSlice({
  name: "transactions",
  initialState,
  reducers: {
    addTransaction: {
      reducer: (state, action: PayloadAction<Transaction>) => {
        state.transactions.unshift(action.payload);
      },
      prepare: (transaction: Transaction) => ({
        payload: {
          ...transaction
        },
      }),
    },
    updateTransaction: (state, action: PayloadAction<Transaction>) => {
      const index = state.transactions.findIndex(t => t.id === action.payload.id);
      if (index !== -1) {
        state.transactions[index] = action.payload;
      }
    },
    deleteTransaction: (state, action: PayloadAction<string>) => {
      state.transactions = state.transactions.filter(t => t.id !== action.payload);
    },
    setTransactions: (state, action: PayloadAction<Transaction[]>) => {
      state.transactions = action.payload;
    },
  },
});

export const {
  addTransaction,
  updateTransaction,
  deleteTransaction,
  setTransactions,
} = transactionSlice.actions;

export default transactionSlice.reducer;
