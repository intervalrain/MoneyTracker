import { View, Text, TextInput, Pressable, ScrollView, Modal } from "react-native";
import { Calculator } from "@/components/transaction/Calculator";
import { useEffect, useState } from "react";
import { AccountType, Transaction, TransactionMode } from "@/types";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useSelector, useDispatch } from "react-redux";
import { addTransaction } from "@/store/transactionSlice";
import { getUUID } from "@/utils/uuid";
import { RootState } from "@/store";
import { BarButtons } from "@/components/BarButton";
import { AccountPicker } from "@/components/transaction/AccountPicker";
import { AddTypeModal } from "@/components/AddTypeModal";
import { IntervalDatePicker } from "@/components/datePicker/IntervalDatePicker";

export default function TransactionScreen() {
  const dispatch = useDispatch();
  const { transactionTypes, accountTypes } = useSelector(
    (state: RootState) => state.customTypes
  );

  const [amount, setAmount] = useState("0");
  const [mode, setMode] = useState<TransactionMode>("expense");
  const [type, setType] = useState("food");
  const [account, setAccount] = useState("cash");
  const [toAccount, setToAccount] = useState("bank");
  const [comment, setComment] = useState("");
  const [date, setDate] = useState(new Date());
  const [showAddTypeModal, setShowAddTypeModal] = useState(false);

  const numbers = amount.split(/[+\-×÷]/);
  const currentNumber = numbers[numbers.length - 1] == ""
    ? numbers[numbers.length - 2]
    : numbers[numbers.length - 1];
  const amountToDisplay = Number(currentNumber).toLocaleString();

  const handleComplete = () => {
    const transaction: Transaction = {
      id: getUUID(),
      amount: Number(amount),
      type,
      account,
      mode,
      date: date.toISOString(),
      note: comment,
    };
    dispatch(addTransaction(transaction));
  };

  const handleAddAccount = (label: string, initialBalance: number) => {
    const account: AccountType = {
      label,
      initialBalance,
    }
    accountTypes[getUUID()] = account;
  }
  
  const getModeColor = (currentMode: TransactionMode) => {
    const colors = {
      expense: mode === "expense" ? "bg-red-500" : "bg-red-100",
      income: mode === "income" ? "bg-green-500" : "bg-green-100",
      transfer: mode === "transfer" ? "bg-blue-500" : "bg-blue-100",
    };
    return colors[currentMode];
  };

  const filteredTransactionTypes: typeof transactionTypes = Object.fromEntries(
    Object.entries(transactionTypes).filter(([_, value]) =>
      value.mode.includes(mode)
    )
  );

  useEffect(() => {
    setType(Object.keys(filteredTransactionTypes)[0]);
  }, [mode]);

  return (
    <View className="flex-1 bg-rain-50">
      {/* Top Section */}
      <View>
        {/* Mode Selector */}
        <BarButtons
          buttons={[
            { label: "支出", value: "expense", color: getModeColor("expense") },
            {
              label: "轉帳",
              value: "transfer",
              color: getModeColor("transfer"),
            },
            { label: "收入", value: "income", color: getModeColor("income") },
          ]}
          value={mode}
          onChange={(mode) => setMode(mode as TransactionMode)}
        />

        {/* Info Bar - Date & Account */}
        <IntervalDatePicker mode={"day"} date={date} onChange={setDate} />

        {/* Amount Display and Input Section */}
        <View className="p-6 items-center">

          {/* Amount */}
          <Text className="text-6xl font-semibold">${amountToDisplay}</Text>
          
          {/* Account and Note Row */}
          <View className="flex-row items-center space-x-3">
            <View className="flex-1">
              <TextInput
                value={comment}
                onChangeText={setComment}
                placeholder="備註..."
                className="px-4 py-2 bg-gray-100 rounded-xl text-gray-700"
              />
            </View>

            <View className="flex-row items-center space-x-2">
              <AccountPicker
                value={account}
                onChange={setAccount}
                options={accountTypes}
                onAddAccount={handleAddAccount}
              />
              {mode === "transfer" && (
                <>
                  <MaterialCommunityIcons 
                    name="arrow-right" 
                    size={20} 
                    color="#6B7280" 
                  />
                  <AccountPicker
                    value={toAccount}
                    onChange={setToAccount}
                    options={accountTypes}
                    onAddAccount={handleAddAccount}
                  />
                </>
              )}
            </View>
          </View>
        </View>


        {/* Transaction Types */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          className="px-4 pb-4"
          contentContainerStyle={{ paddingRight: 16 }} // 確保最後一個項目不會貼邊
        >
          <View className="flex-row space-x-4">
            {Object.entries(filteredTransactionTypes).map(([key, value]) => (
              <Pressable
                key={key}
                onPress={() => setType(key as string)}
                className={`items-center px-4 py-2 rounded-xl ${
                  type === key ? `bg-rain-300 shadow-2xl border` : `bg-gray-100`
                }`}
                style={{ minWidth: 80 }} // 確保每個項目有最小寬度
              >
                <MaterialCommunityIcons
                  name={
                    value.icon as keyof typeof MaterialCommunityIcons.glyphMap
                  }
                  size={28}
                  color="black"
                />
                <Text
                  className={`mt-2 ${
                    type === key ? "text-black" : "text-gray-500"
                  }`}
                >
                  {value.label}
                </Text>
              </Pressable>
            ))}

            {/* add new type button */}
            {mode !== "transfer" && (
              <Pressable
                onPress={() => setShowAddTypeModal(true)}
                className="items-center px-4 py-2 rounded-xl bg-gray-100"
                style={{ minWidth: 80 }}
              >
                <MaterialCommunityIcons name="plus" size={28} color="#6B7280" />
                <Text className={`mt-2 text-gray-500}`}>新增</Text>
              </Pressable>
            )}
          </View>
        </ScrollView>
      </View>

      {/* Bottom Section - Calculator */}
      <View className="flex-1 mt-auto">
        <Calculator
          value={amount}
          onChange={setAmount}
          onComplete={handleComplete}
        />
      </View>

      {/* Add Type Modal */}
      {showAddTypeModal &&  
        <AddTypeModal
          onClose={() => setShowAddTypeModal(false)}
          initialMode={mode}
        />
      }
    </View>
  );
}
