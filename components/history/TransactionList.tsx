import { Transaction } from "@/types";
import { ScrollView, View, Text } from "react-native";
import { TransactionItem } from "./TransactionItem"

// TransactionList 組件
interface TransactionListProps {
  transactions: Transaction[];
  onTransactionPress?: (transaction: Transaction) => void;
}

export function TransactionList({
  transactions,
  onTransactionPress,
}: TransactionListProps) {
  const groupTransactionsByDate = (transactions: Transaction[]) => {
    const groups = transactions.reduce((acc, transaction) => {
      const date = new Date(transaction.date).toLocaleDateString("zh-TW");
      if (!acc[date]) {
        acc[date] = [];
      }
      acc[date].push(transaction);
      return acc;
    }, {} as Record<string, Transaction[]>);

    return Object.entries(groups).sort(
      (a, b) => new Date(b[0]).getTime() - new Date(a[0]).getTime()
    );
  };

  const groupedTransactions = groupTransactionsByDate(transactions);

  const getDaySummary = (transactions: Transaction[]) => {
    return transactions.reduce(
      (acc, t) => {
        const amount = Number(t.amount);
        if (t.mode === "expense") {
          acc.expense += amount;
        } else if (t.mode === "income") {
          acc.income += amount;
        }
        return acc;
      },
      { expense: 0, income: 0 }
    );
  };

  return (
    <ScrollView className="flex-1">
      {groupedTransactions.map(([date, dayTransactions]) => {
        const { expense, income } = getDaySummary(dayTransactions);

        return (
          <View key={date} className="mb-4">
            <View className="flex-row justify-between items-center px-4 py-2 bg-rain-50">
              <Text className="text-sm text-gray-600">{date}</Text>
              <View className="flex-row space-x-4">
                <Text className="text-sm text-red-500">
                  支出 ${expense.toLocaleString()}
                </Text>
                <Text className="text-sm text-green-500">
                  收入 ${income.toLocaleString()}
                </Text>
              </View>
            </View>

            <View className="space-y-2 px-4 mt-2">
              {dayTransactions.map((transaction) => (
                <TransactionItem
                  key={transaction.id}
                  transaction={transaction}
                  onPress={onTransactionPress}
                />
              ))}
            </View>
          </View>
        );
      })}
    </ScrollView>
  );
}
