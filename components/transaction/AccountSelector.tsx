import { ACCOUNT_TYPES, AccountType } from "@/types";
import { ScrollView, TouchableOpacity } from "react-native";
import { Text } from "react-native"; 

export const AccountSelector = ({ 
    selectedAccount, 
    onSelectAccount,
    className 
  }: {
    selectedAccount: AccountType;
    onSelectAccount: (type: AccountType) => void;
      className?: string;
  }) => (
    <ScrollView 
      horizontal 
      className={className}
      showsHorizontalScrollIndicator={false}
    >
      {(Object.entries(ACCOUNT_TYPES) as [AccountType, typeof ACCOUNT_TYPES[AccountType]][])
        .map(([key, { label }]) => (
          <TouchableOpacity
            key={key}
            onPress={() => onSelectAccount(key)}
            className={`px-4 h-8 rounded-lg mx-1 flex-row items-center border-2 text-center ${
              selectedAccount === key ? 'bg-blue-500 border-rain-600' : 'bg-white border-rain-200'
            }`}
          >
            <Text 
              className={`${selectedAccount === key ? 'text-black' : 'text-gray-500'}`}
            >
              {label}
            </Text>
          </TouchableOpacity>
      ))}
    </ScrollView>
  );