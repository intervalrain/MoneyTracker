import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { TRANSACTION_TYPES, ACCOUNT_TYPES, TransactionMode } from "@/types";

interface CustomTypesState {
  transactionTypes: typeof TRANSACTION_TYPES;
  accountTypes: typeof ACCOUNT_TYPES;
}

const initialState: CustomTypesState = {
  transactionTypes: TRANSACTION_TYPES,
  accountTypes: ACCOUNT_TYPES,
};

const customTypesSlice = createSlice({
  name: "customTypes",
  initialState,
  reducers: {
    addTransactionType: (
      state,
      action: PayloadAction<{
        key: string;
        value: {
          label: string;
          icon: string;
          mode: TransactionMode[];
        };
      }>
    ) => {
      state.transactionTypes[action.payload.key as string] = action.payload.value;
    },
    removeTransactionType: (state, action: PayloadAction<string>) => {
      const { [action.payload]: _, ...rest } = state.transactionTypes;
      state.transactionTypes = rest as typeof TRANSACTION_TYPES;
    },
    addAccountType: (
      state,
      action: PayloadAction<{
        key: string;
        value: {
          label: string;
        };
      }>
    ) => {
      state.accountTypes[action.payload.key as string] = action.payload.value;
    },
    removeAccountType: (state, action: PayloadAction<string>) => {
      const { [action.payload]: _, ...rest } = state.accountTypes;
      state.accountTypes = rest as typeof ACCOUNT_TYPES;
    },
    resetToDefault: (state) => {
      state.transactionTypes = TRANSACTION_TYPES;
      state.accountTypes = ACCOUNT_TYPES;
    },
  },
});

export const {
  addTransactionType,
  removeTransactionType,
  addAccountType,
  removeAccountType,
  resetToDefault,
} = customTypesSlice.actions;

export default customTypesSlice.reducer;