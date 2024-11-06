import { BarButtons } from "@/components/BarButton";
import { IntervalDatePicker } from "@/components/IntervalDatePicker";
import { TransactionList } from "@/components/history/TransactionList";
import { RootState } from "@/store";
import { deleteTransaction, updateTransaction } from "@/store/transactionSlice";
import { Transaction } from "@/types";
import { useCallback, useMemo, useState } from "react";
import { View, Text } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { startOfDay, endOfDay, startOfWeek, endOfWeek, startOfMonth, endOfMonth, startOfYear, endOfYear } from 'date-fns';
import { TransactionEditModal } from "@/components/history/TransactionEditModal";

export default function HistoryScreen() {
  const dispatch = useDispatch();
  const transactions = useSelector((state: RootState) => state.transactions.transactions);
  const [editingRecord, setEditingRecord] = useState<Transaction | undefined>();
  const [mode, setMode] = useState<"day" | "week" | "month" | "year">("month");
  const [date, setDate] = useState(new Date());

  const intervalTypeButtons = [
    { label: "日", value: "day" },
    { label: "週", value: "week" },
    { label: "月", value: "month" },
    { label: "年", value: "year" },
  ];

  const getDateRange = useCallback(() => {
    switch (mode) {
      case "day":
        return {
          start: startOfDay(date),
          end: endOfDay(date)
        };
      case "week":
        return {
          start: startOfWeek(date, { weekStartsOn: 0 }),
          end: endOfWeek(date, { weekStartsOn: 0 })
        };
      case "month":
        return {
          start: startOfMonth(date),
          end: endOfMonth(date)
        };
      case "year":
        return {
          start: startOfYear(date),
          end: endOfYear(date)
        };
    }
  }, [date, mode]);

  const filteredTransactions = useMemo(() => {
    const { start, end } = getDateRange();
    return transactions.filter(t => {
      const transactionDate = new Date(t.date);
      return transactionDate >= start && transactionDate <= end;
    }).sort((a, b) => a.date.localeCompare(b.date));
  }, [transactions, getDateRange]);

  // 計算總收支
  const summary = useMemo(() => {
    return filteredTransactions.reduce(
      (acc, t) => {
        const amount = Number(t.amount);
        if (t.mode === "expense") {
          acc.totalExpense += amount;
        } else if (t.mode === "income") {
          acc.totalIncome += amount;
        }
        return acc;
      },
      { totalExpense: 0, totalIncome: 0 }
    );
  }, [filteredTransactions]);

  const handleTransactionPress = useCallback((transaction: Transaction) => {
    setEditingRecord(transaction);
  }, []);

  const handleTransactionUpdate = useCallback((transaction: Transaction) => {
    dispatch(updateTransaction(transaction));
    setEditingRecord(undefined);
  }, [dispatch]);

  const handleTransactionDelete = useCallback((transactionId: string) => {
    dispatch(deleteTransaction(transactionId));
  }, [dispatch]);

  return (
    <View className="flex-1 bg-gray-100">
      {/* 時間範圍選擇 */}
      <View className="space-y-2">
        <BarButtons
          buttons={intervalTypeButtons}
          value={mode}
          onChange={(value) => setMode(value as "day" | "week" | "month" | "year")}
        />

        <IntervalDatePicker
          mode={mode}
          date={date}
          onChange={setDate}
        />

        {/* 總收支摘要 */}
        <View className="flex-row justify-between bg-white px-6 py-4">
          <View>
            <Text className="text-sm text-gray-500 mb-1">總支出</Text>
            <Text className="text-xl font-medium text-red-500">
              ${summary.totalExpense.toLocaleString()}
            </Text>
          </View>
          <View>
            <Text className="text-sm text-gray-500 mb-1">總收入</Text>
            <Text className="text-xl font-medium text-green-500">
              ${summary.totalIncome.toLocaleString()}
            </Text>
          </View>
          <View>
            <Text className="text-sm text-gray-500 mb-1">淨收入</Text>
            <Text className={`text-xl font-medium ${
              summary.totalIncome - summary.totalExpense >= 0
                ? "text-green-500"
                : "text-red-500"
            }`}>
              ${(summary.totalIncome - summary.totalExpense).toLocaleString()}
            </Text>
          </View>
        </View>
      </View>

      {/* 交易列表 */}
      <View className="flex-1 mt-2">
        <TransactionList
          transactions={filteredTransactions}
          onTransactionPress={handleTransactionPress}
        />
      </View>

      {/* 編輯 Modal */}
      {editingRecord && (
        <TransactionEditModal
          transaction={editingRecord}
          onUpdate={handleTransactionUpdate}
          onDelete={handleTransactionDelete}
          onClose={() => setEditingRecord(undefined)}
        />
      )}
    </View>
  );
}