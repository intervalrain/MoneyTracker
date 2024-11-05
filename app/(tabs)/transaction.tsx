import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  Platform,
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import DateTimePicker from "@react-native-community/datetimepicker";
import { Calculator } from "@/components/transaction/Calculator";
import { useState } from "react";
import { AccountType, TransactionMode, TransactionType } from "@/types";
import { TypeSelector } from "@/components/transaction/TypeSelector";
import { AccountSelector } from "@/components/transaction/AccountSelector";

export default function TransactionScreen() {
  const [amount, setAmount] = useState("0");
  const [mode, setMode] = useState<TransactionMode>("expense");
  const [type, setType] = useState<TransactionType>("food");
  const [account, setAccount] = useState<AccountType>("cash");
  const [comment, setComment] = useState("");
  const [date, setDate] = useState(new Date());

  const numbers = amount.split(/[+\-×÷]/);
  const currentNumber =
    numbers[numbers.length - 1] == ""
      ? numbers[numbers.length - 2]
      : numbers[numbers.length - 1];
  const amountToDisplay = Number(currentNumber).toLocaleString();

  const barColor = (mode: TransactionMode, isActive: boolean) => {
    if (!isActive) {
      return "bg-rain-400";
    }
    switch (mode) {
      case "expense":
        return "bg-red-500";
      case "transfer":
        return "bg-blue-500";
      default:
        return "bg-green-500";
    }
  };

  const onDateChange = (event: any, selectedDate?: Date) => {
    if (selectedDate) {
      setDate(selectedDate);
    }
  };

  const adjustDate = (days: number) => {
    const newDate = new Date(date);
    newDate.setDate(newDate.getDate() + days);
    setDate(newDate);
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString("zh-tw", {
      year: "numeric",
      month: "long",
      day: "numeric",
      weekday: "long",
    });
  };

  return (
    <View className="flex-1 h-screen bg-rain-200 space-y-2">

      {/* income or expense  */}
      <View className="flex-row px-4 pt-4 bg-rain-200">
        <TouchableOpacity
          onPress={() => setMode("expense")}
          className={`flex-1 p-3 rounded-l-full shadow-md ${barColor(
            "expense",
            mode === "expense"
          )}`}
        >
          <Text className="text-white text-center font-semibold">支出</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => setMode("transfer")}
          className={`flex-1 p-3 shadow-md ${barColor(
            "transfer",
            mode === "transfer"
          )}`}
        >
          <Text className="text-white text-center font-semibold">支出</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => setMode("income")}
          className={`flex-1 p-3 rounded-r-full shadow-md ${barColor(
            "income",
            mode === "income"
          )}`}
        >
          <Text className="text-white text-center font-semibold">收入</Text>
        </TouchableOpacity>
      </View>

      {/* display */}
      <View className="flex bg-rain-200 px-4">
        <View className="bg-white p-6 rounded-xl items-end">
          <Text className="text-4xl font-semibold text-center">
            ${amountToDisplay}
          </Text>
        </View>
      </View>

      {/* date picker */}
      <View className="flex-row items-center justify-between bg-rain-200 rounded-lg mx-4">
        <TouchableOpacity onPress={() => adjustDate(-1)} className="p-2">
          <MaterialCommunityIcons
            name="chevron-left"
            size={24}
            color="#666666"
          />
        </TouchableOpacity>

        <View className="flex-1 justify-center items-center">
          <DateTimePicker
            value={date}
            mode="date"
            display="default"
						locale="zh-tw"
            onChange={onDateChange}
          />
        </View>

        <TouchableOpacity onPress={() => adjustDate(1)} className="p-2">
          <MaterialCommunityIcons
            name="chevron-right"
            size={24}
            color="#666666"
          />
        </TouchableOpacity>
      </View>

      {/* comment */}
      <View className="flex-row items-center bg-rain-50 rounded-lg mx-4">
        <TextInput
          value={comment}
          onChangeText={setComment}
          placeholder="備註..."
          className="flex-1 text-base p-4 bg-rain-100 rounded-lg"
        />
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
