import { View, Text, TouchableOpacity, ScrollView } from "react-native";
import { useSelector } from "react-redux";
import * as store from "@/store";
import { Calculator } from "@/components/transaction/Calculator";
import { useState } from "react";
import {
  AccountType,
  TRANSACTION_TYPES,
  TransactionMode,
  TransactionType,
} from "@/types";
import { TypeSelector } from "@/components/transaction/TypeSelector";
import { AccountSelector } from "@/components/transaction/AccountSelector";
import { HorizontalSelector } from "@/components/transaction/HorizontalSelector";

export default function TransactionScreen() {
  const { currentMonthTotal, accounts } = useSelector(
    (state: store.RootState) => state.finance
  );
  const [amount, setAmount] = useState("0");
  const [mode, setMode] = useState<TransactionMode>("expense");
  const [type, setType] = useState<TransactionType>("food");
  const [account, setAccount] = useState<AccountType>("cash");


	const numbers = amount.split(/[+\-×÷]/);
	const currentNumber = numbers[numbers.length - 1] == "" ? numbers[numbers.length - 2] : numbers[numbers.length - 1];
  const amountToDisplay = Number(currentNumber).toLocaleString();

  return (
    <View className="flex-1 h-screen bg-rain-200 gap-y-2">
      {/* display */}
      <View className="flex bg-rain-200 px-4 pt-4 pb-2">
        <View className="bg-white p-6 rounded-xl items-end">
          <Text className="text-4xl font-semibold text-center">
            ${amountToDisplay}
          </Text>
        </View>
      </View>

      {/* income or expense  */}
      <View className="flex-row p-2 bg-rain-200">
        <TouchableOpacity
          onPress={() => setMode("expense")}
          className={`flex-1 p-3 rounded-l-full shadow-md ${
            mode === "expense" ? "bg-red-500" : "bg-rain-400"
          }`}
        >
          <Text className="text-white text-center font-semibold">支出</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => setMode("income")}
          className={`flex-1 p-3 rounded-r-full shadow-md ${
            mode === "income" ? "bg-green-500" : "bg-rain-400"
          }`}
        >
          <Text className="text-white text-center font-semibold">收入</Text>
        </TouchableOpacity>
      </View>

      {/* type selector */}
      <View className="ml-2">
        <TypeSelector selectedType={type} onSelectType={setType} />
      </View>

      {/* Account Selector */}
      <View className="ml-2">
        <AccountSelector
          selectedAccount={account}
          onSelectAccount={setAccount}
        />
      </View>
      {/* Calculater */}
      <View className="flex-1 items-center justify-center">
        <Calculator value={amount} onChange={setAmount} />
      </View>
    </View>
  );
}
