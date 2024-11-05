import { TRANSACTION_TYPES, TransactionType } from "@/types";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { ScrollView, TouchableOpacity } from "react-native";
import { Text } from "react-native"; 

export const TypeSelector = ({ 
    selectedType, 
    onSelectType,
    className 
  }: {
      selectedType: TransactionType;
      onSelectType: (type: TransactionType) => void;
      className?: string;
  }) => (
    <ScrollView 
      horizontal 
      className={className}
      showsHorizontalScrollIndicator={false}
    >
      {(Object.entries(TRANSACTION_TYPES) as [TransactionType, typeof TRANSACTION_TYPES[TransactionType]][])
        .map(([key, { label, icon, color }]) => (
          <TouchableOpacity
            key={key}
            onPress={() => onSelectType(key)}
            className={`px-4 h-8 rounded-full mx-1 flex-row items-center border-2 ${
              selectedType === key ? 'bg-rain-100' : 'bg-white'
            }`}
            style={{
              borderWidth: 1,
              borderColor: selectedType === key ? color : '#E5E7EB'
            }}
          >
            <MaterialCommunityIcons 
              name={icon} 
              size={20} 
              color={color}
            />
            <Text 
              className="ml-2"
              style={{ color: selectedType === key ? color : '#374151' }}
            >
              {label}
            </Text>
          </TouchableOpacity>
      ))}
    </ScrollView>
  );