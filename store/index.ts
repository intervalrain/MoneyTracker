import { configureStore } from '@reduxjs/toolkit';
import transactionReducer from './transactionSlice';
import customTypeReducer from './customTypesSlice';

export const store = configureStore({
	reducer: {
    transactions: transactionReducer,
		customTypes: customTypeReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;