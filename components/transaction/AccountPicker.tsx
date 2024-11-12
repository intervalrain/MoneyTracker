import React, { useState } from 'react';
import { View, Text, Pressable } from 'react-native';
import Modal from 'react-native-modal';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { AddAccountModal } from '../AddAccountModal';
import { AccountType } from '@/types';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/store';

interface AccountPickerProps {
  value: string;
  onChange: (value: string) => void;
  options: Record<string, AccountType>;
  onAddAccount: (accountName: string, initialBalance: number) => void;
}

export const AccountPicker: React.FC<AccountPickerProps> = ({
  value,
  onChange,
  options,
  onAddAccount
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isAddAccountVisible, setIsAddAccountVisible] = useState(false);
  
  const transactions = useSelector((state: RootState) => state.transactions.transactions);
  const accountTypes = useSelector((state: RootState) => state.customTypes.accountTypes);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('zh-TW', {
      style: 'currency',
      currency: 'TWD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const totalBalance = (key: string) => {
    let balance = accountTypes[key]?.initialBalance || 0;
    for (const transaction of transactions) {
      if (transaction.account === key) {
        if (transaction.mode === 'income') {
          balance += transaction.amount;
        } else {
          balance -= transaction.amount;
        }
      }
      if (transaction.toAccount === key) {
        balance += transaction.amount;
      }
    }
    return balance;
  };

  const getTotalAssets = () => {
    return Object.keys(accountTypes).reduce((sum, key) => sum + totalBalance(key), 0);
  };

  return (
    <>
      {/* 當前帳戶顯示 */}
      <Pressable 
        onPress={() => setIsVisible(true)}
        className="flex-row items-center justify-between bg-gray-100 px-3 py-2 rounded-lg"
      >
        <View className="flex-row items-center space-x-2">
          <MaterialCommunityIcons name="bank" size={20} color="#6B7280" />
          <Text className="text-gray-700">{options[value]?.label}</Text>
        </View>
        <View className="flex-row items-center space-x-2">
          <Text className="text-gray-700 font-medium">
            {formatCurrency(totalBalance(value))}
          </Text>
          <MaterialCommunityIcons name="chevron-down" size={20} color="#6B7280" />
        </View>
      </Pressable>

      <Modal
        isVisible={isVisible}
        onBackdropPress={() => setIsVisible(false)}
        style={{ margin: 0, justifyContent: 'flex-end' }}
      >
        <View className="bg-white rounded-t-3xl">
          {/* Modal 標題與總資產 */}
          <View className="p-4 border-b border-gray-100">
            <Text className="text-lg font-medium text-center">選擇帳戶</Text>
            <View className="mt-2">
              <Text className="text-gray-500 text-center">總資產</Text>
              <Text className="text-xl font-semibold text-center mt-1">
                {formatCurrency(getTotalAssets())}
              </Text>
            </View>
          </View>
          
          {/* 帳戶列表 */}
          {Object.entries(options).map(([key, { label }]) => (
            <Pressable
              key={key}
              onPress={() => {
                onChange(key);
                setIsVisible(false);
              }}
              className={`p-4 flex-row items-center justify-between border-b border-gray-50 
                ${key === value ? 'bg-blue-50' : ''}`}
            >
              <View className="flex-row items-center space-x-3">
                <MaterialCommunityIcons 
                  name="bank" 
                  size={24} 
                  color={key === value ? "#3B82F6" : "#6B7280"}
                />
                <View>
                  <Text className={`text-lg ${
                    key === value ? 'text-blue-500 font-medium' : 'text-gray-700'
                  }`}>
                    {label}
                  </Text>
                  <Text className="text-gray-500 text-sm">
                    {formatCurrency(totalBalance(key))}
                  </Text>
                </View>
              </View>
              {key === value && (
                <MaterialCommunityIcons 
                  name="check" 
                  size={24} 
                  color="#3B82F6"
                />
              )}
            </Pressable>
          ))}
          
          {/* 新增帳戶按鈕 */}
          <Pressable
            onPress={() => setIsAddAccountVisible(true)}
            className="p-4 border-t border-gray-100 flex-row items-center justify-center space-x-2"
          >
            <MaterialCommunityIcons name="plus-circle" size={24} color="#3B82F6" />
            <Text className="text-blue-500 text-lg">新增帳戶</Text>
          </Pressable>
        </View>
      </Modal>

      {/* 新增帳戶 Modal */}
      {/* <AddAccountModal
        visible={isAddAccountVisible}
        onClose={() => setIsAddAccountVisible(false)}
        onSubmit={onAddAccount}
      /> */}
    </>
  );
};