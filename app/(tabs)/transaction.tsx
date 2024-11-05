import { View, Text, TextInput, Pressable, ScrollView } from "react-native";
import { Calculator } from "@/components/transaction/Calculator";
import { useEffect, useState } from "react";
import { Transaction, TransactionMode } from "@/types";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useSelector, useDispatch } from "react-redux";
import { addTransaction } from "@/store/transactionSlice";
import { getUUID } from "@/utils/uuid";
import { RootState } from "@/store";
import { format } from "date-fns";
import { zhTW } from "date-fns/locale";
import { DatePickerModal } from "@/components/DatePickerModal";
import { BarButtons } from "@/components/BarButton";
import { AccountPicker } from "@/components/transaction/AccountPicker";

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
  const [showDatePicker, setShowDatePicker] = useState(false);

  const numbers = amount.split(/[+\-×÷]/);
  const currentNumber =
    numbers[numbers.length - 1] == ""
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

  const getModeColor = (currentMode: TransactionMode) => {
    const colors = {
      expense: mode === "expense" ? "bg-red-500" : "bg-red-100",
      income: mode === "income" ? "bg-green-500" : "bg-green-100",
      transfer: mode === "transfer" ? "bg-blue-500" : "bg-blue-100",
    };
    return colors[currentMode];
  };

	const filteredTransactionTypes : typeof transactionTypes = 
	  Object.fromEntries(Object.entries(transactionTypes).filter(([_, value]) => value.mode.includes(mode)));

	useEffect(() => {
		setType(Object.keys(filteredTransactionTypes)[0]);
	}, [mode])

  return (
    <View className="flex-1 bg-rain-50">
      {/* Top Section */}
      <View className="bg-rain-50 shadow-sm">
        {/* Mode Selector */}
        <BarButtons
          buttons={[
            { label: "支出", value: "expense", color: getModeColor("expense") },
            { label: "轉帳", value: "transfer", color: getModeColor("transfer") },
            { label: "收入", value: "income", color: getModeColor("income") },
          ]}
          value={mode}
          onChange={(mode) => setMode(mode as TransactionMode)}
        />

        {/* Info Bar - Date & Account */}
        <View className="flex-row justify-between items-center px-4 py-2 border-b border-gray-100">
          <Pressable
            onPress={() => setShowDatePicker(true)}
            className="flex-row items-center space-x-2"
          >
            <MaterialCommunityIcons name="calendar" size={20} color="#6B7280" />
            <Text className="text-gray-600">
              {format(date, "M月d日 EEEE", { locale: zhTW })}
            </Text>
          </Pressable>

          <AccountPicker
            value={account}
            onChange={setAccount}
            options={accountTypes}
          />
					{mode === 'transfer' &&
						<AccountPicker
							value={toAccount}
							onChange={setToAccount}
							options={accountTypes}
						/>}
        </View>

        {/* Amount Display */}
        <View className="p-6 items-center">
          <Text className="text-6xl font-semibold">${amountToDisplay}</Text>
          <TextInput
            value={comment}
            onChangeText={setComment}
            placeholder="備註..."
            className="mt-2 text-center text-gray-500 w-full text-lg"
          />
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

      {/* Date Picker Modal */}
      {showDatePicker && (
        <DatePickerModal
          date={date}
          onConfirm={(newDate) => {
            setDate(newDate);
            setShowDatePicker(false);
          }}
          onCancel={() => setShowDatePicker(false)}
        />
      )}
    </View>
  );
}
