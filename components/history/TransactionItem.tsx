import { View, Text, TouchableOpacity, ScrollView } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Transaction, TransactionMode } from "@/types";

// TransactionItem 組件
interface TransactionItemProps {
  transaction: Transaction;
  onPress?: (transaction: Transaction) => void;
}

export function TransactionItem({ transaction, onPress }: TransactionItemProps) {
  const getTypeIcon = (type: string) => {
    switch (type) {
      case "food":
        return "food";
      case "transport":
        return "car";
      case "shopping":
        return "cart";
      case "entertainment":
        return "movie";
      default:
        return "cash";
    }
  };

  const getModeColor = (mode: TransactionMode) => {
    switch (mode) {
      case "expense":
        return "text-red-500";
      case "income":
        return "text-green-500";
      case "transfer":
        return "text-blue-500";
    }
  };

  return (
    <TouchableOpacity
      onPress={() => onPress?.(transaction)}
      className="flex-row items-center bg-white p-4 rounded-lg shadow-sm"
    >
      <View className="bg-rain-100 p-2 rounded-full">
        <MaterialCommunityIcons
          name={getTypeIcon(transaction.type)}
          size={24}
          color="#666666"
        />
      </View>

      <View className="flex-1 ml-4">
        <Text className="text-base font-medium">{transaction.type}</Text>
        {transaction.note && (
          <Text className="text-sm text-gray-500">{transaction.note}</Text>
        )}
      </View>

      <View className="items-end">
        <Text
          className={`text-lg font-semibold ${getModeColor(transaction.mode)}`}
        >
          {transaction.mode === "expense" ? "-" : "+"}$
          {Number(transaction.amount).toLocaleString()}
        </Text>
        <Text className="text-xs text-gray-500">
          {new Date(transaction.date).toLocaleTimeString("zh-TW", {
            hour: "2-digit",
            minute: "2-digit",
          })}
        </Text>
      </View>
    </TouchableOpacity>
  );
}
