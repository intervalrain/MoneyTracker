import React, { useState } from "react";
import {
  View,
  Text,
  Pressable,
  TextInput,
  ScrollView,
  Alert,
} from "react-native";
import Modal from "react-native-modal";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Transaction, TransactionMode } from "@/types";
import { useSelector } from "react-redux";
import { RootState } from "@/store";
import { format } from "date-fns";
import { zhTW } from "date-fns/locale";
import { Calculator } from "@/components/transaction/Calculator";
import { DatePickerModal } from "../datePicker/DatePickerModal";
import { AddTypeModal } from "../AddTypeModal";

interface TransactionEditModalProps {
  transaction: Transaction;
  onUpdate: (transaction: Transaction) => void;
  onDelete: (id: string) => void;
  onClose: () => void;
}

export const TransactionEditModal: React.FC<TransactionEditModalProps> = ({
  transaction,
  onUpdate,
  onDelete,
  onClose,
}) => {
  const { transactionTypes, accountTypes } = useSelector(
    (state: RootState) => state.customTypes
  );

  // 初始化所有狀態
  const [amount, setAmount] = useState(transaction.amount.toString());
  const [mode, setMode] = useState<TransactionMode>(transaction.mode);
  const [type, setType] = useState(transaction.type);
  const [account, setAccount] = useState(transaction.account);
	const [toAccount, setToAccount] = useState(transaction.toAccount);
  const [note, setNote] = useState(transaction.note || "");
  const [date, setDate] = useState(new Date(transaction.date));
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showCalculator, setShowCalculator] = useState(false);
  const [showAddTypeModal, setShowAddTypeModal] = useState(false);

  // 模式選擇按鈕
  const modeButtons = [
    { mode: "expense" as TransactionMode, label: "支出", color: "red" },
    { mode: "income" as TransactionMode, label: "收入", color: "green" },
    { mode: "transfer" as TransactionMode, label: "轉帳", color: "blue" },
  ];

  // 確認更新
  const handleUpdate = () => {
    const updatedTransaction: Transaction = {
      ...transaction,
      amount: Number(amount),
      mode,
      type,
      account,
      note,
      date: date.toISOString(),
    };
    onUpdate(updatedTransaction);
  };

  // 確認刪除
  const handleDelete = () => {
    Alert.alert("刪除交易", "確定要刪除這筆交易嗎？此操作無法復原。", [
      { text: "取消", style: "cancel" },
      {
        text: "刪除",
        onPress: () => onDelete(transaction.id),
        style: "destructive",
      },
    ]);
  };

  return (
    <Modal
      isVisible={true}
      onBackdropPress={onClose}
      style={{ margin: 0, justifyContent: "flex-end" }}
      propagateSwipe={true}
    >
      <View className="bg-white rounded-t-3xl max-h-[90%]">
        {/* Header */}
        <View className="flex-row justify-between items-center p-4 border-b border-gray-100">
          <Pressable onPress={onClose} className="p-2 -m-2">
            <Text className="text-gray-500">取消</Text>
          </Pressable>
          <Text className="text-lg font-medium">編輯交易</Text>
          <Pressable onPress={handleDelete} className="p-2 -m-2">
            <Text className="text-red-500">刪除</Text>
          </Pressable>
        </View>

        <ScrollView className="max-h-[70vh]">
          {/* Mode Selection */}
          <View className="flex-row justify-around p-4">
            {modeButtons.map(({ mode: modeType, label, color }) => (
              <Pressable
                key={modeType}
                onPress={() => setMode(modeType)}
                className={`px-6 py-2 rounded-full ${
                  mode === modeType ? `bg-${color}-500` : `bg-${color}-100`
                }`}
              >
                <Text
                  className={`font-medium ${
                    mode === modeType ? "text-white" : `text-${color}-700`
                  }`}
                >
                  {label}
                </Text>
              </Pressable>
            ))}
          </View>

          {/* Amount */}
          <Pressable
            onPress={() => setShowCalculator(true)}
            className="px-6 py-4 border-t border-gray-100"
          >
            <Text className="text-sm text-gray-500 mb-1">金額</Text>
            <Text className="text-3xl font-semibold">
              ${Number(amount).toLocaleString()}
            </Text>
          </Pressable>

          {/* Date */}
          <Pressable
            onPress={() => setShowDatePicker(true)}
            className="flex-row justify-between items-center px-6 py-4 border-t border-gray-100"
          >
            <Text className="text-gray-500">日期</Text>
            <Text className="text-gray-700">
              {format(date, "yyyy年MM月dd日 EEEE", { locale: zhTW })}
            </Text>
          </Pressable>

          {/* Account Selection */}
          <View className="px-6 py-4 border-t border-gray-100">
            <Text className="text-gray-500 mb-2">帳戶</Text>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              className="space-x-2"
            >
              {Object.entries(accountTypes).map(([key, value]) => (
                <Pressable
                  key={key}
                  onPress={() => setAccount(key as string)}
                  className={`px-4 py-2 rounded-full ${
                    account === key ? "bg-blue-500" : "bg-gray-100"
                  }`}
                >
                  <Text
                    className={account === key ? "text-white" : "text-gray-700"}
                  >
                    {value.label}
                  </Text>
                </Pressable>
              ))}
            </ScrollView>
          </View>

          {/* Type Selection */}
          <View className="px-6 py-4 border-t border-gray-100">
            <Text className="text-gray-500 mb-2">類型</Text>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              className="space-x-3"
            >
              {Object.entries(transactionTypes).map(([key, value]) => (
                <Pressable
                  key={key}
                  onPress={() => setType(key as string)}
                  className={`items-center px-4 py-3 rounded-xl ${
                    type === key ? `bg-rain-500` : "bg-gray-100"
                  }`}
                  style={{ minWidth: 80 }}
                >
                  <MaterialCommunityIcons
                    name={
                      value.icon as keyof typeof MaterialCommunityIcons.glyphMap
                    }
                    size={28}
                    color={type === key ? "white" : "#374151"}
                  />
                  <Text
                    className={`mt-2 ${
                      type === key ? "text-white" : "text-gray-700"
                    }`}
                  >
                    {value.label}
                  </Text>
                </Pressable>
              ))}
              {mode !== "transfer" && (
                <Pressable
                  onPress={() => setShowAddTypeModal(true)}
                  className="items-center px-4 py-2 rounded-xl bg-gray-100"
                  style={{ minWidth: 80 }}
                >
                  <MaterialCommunityIcons
                    name="plus"
                    size={28}
                    color="#6B7280"
                  />
                  <Text className={`mt-2 text-gray-500}`}>新增</Text>
                </Pressable>
              )}
            </ScrollView>
          </View>

          {/* Note */}
          <View className="px-6 py-4 border-t border-gray-100">
            <Text className="text-gray-500 mb-2">備註</Text>
            <TextInput
              value={note}
              onChangeText={setNote}
              placeholder="添加備註..."
              multiline
              className="bg-gray-100 rounded-lg p-3 min-h-[100px] text-gray-700"
            />
          </View>
        </ScrollView>

        {/* Action Buttons */}
        <View className="p-4 border-t border-gray-100">
          <Pressable
            onPress={handleUpdate}
            className="bg-blue-500 py-3 rounded-lg"
          >
            <Text className="text-white text-center font-medium text-lg">
              更新
            </Text>
          </Pressable>
        </View>

        {/* Calculator Modal */}
        <Modal
          isVisible={showCalculator}
          onBackdropPress={() => setShowCalculator(false)}
          style={{ margin: 0, justifyContent: "flex-end" }}
        >
          <View className="bg-white rounded-t-3xl">
            <View className="p-4 border-b border-gray-100">
              <Text className="text-lg font-medium text-center">輸入金額</Text>
            </View>
            <Calculator
              value={amount}
              onChange={setAmount}
              onComplete={() => setShowCalculator(false)}
            />
          </View>
        </Modal>

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

        {/* Add Type Modal */}
        {showAddTypeModal && (
          <AddTypeModal
            onClose={() => setShowAddTypeModal(false)}
            initialMode={mode}
          />
        )}
      </View>
    </Modal>
  );
};
