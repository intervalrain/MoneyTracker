import React from 'react';
import { View, Text, Pressable } from 'react-native';
import Modal from 'react-native-modal';
import { MaterialCommunityIcons } from '@expo/vector-icons';

interface AccountPickerProps {
  value: string;
  onChange: (value: string) => void;
  options: Record<string, { label: string }>;
}

export const AccountPicker: React.FC<AccountPickerProps> = ({
  value,
  onChange,
  options,
}) => {
  const [isVisible, setIsVisible] = React.useState(false);

  return (
    <>
      <Pressable 
        onPress={() => setIsVisible(true)}
        className="flex-row items-center space-x-2 bg-gray-100 px-3 py-2 rounded-lg"
      >
        <MaterialCommunityIcons name="bank" size={20} color="#6B7280" />
        <Text className="text-gray-700">{options[value].label}</Text>
        <MaterialCommunityIcons name="chevron-down" size={20} color="#6B7280" />
      </Pressable>

      <Modal
        isVisible={isVisible}
        onBackdropPress={() => setIsVisible(false)}
        style={{ margin: 0, justifyContent: 'flex-end' }}
      >
        <View className="bg-white rounded-t-3xl">
          <View className="p-4 border-b border-gray-100">
            <Text className="text-lg font-medium text-center">選擇帳戶</Text>
          </View>
          
          {Object.entries(options).map(([key, { label }]) => (
            <Pressable
              key={key}
              onPress={() => {
                onChange(key);
                setIsVisible(false);
              }}
              className={`p-4 flex-row justify-between items-center ${
                key === value ? 'bg-blue-50' : ''
              }`}
            >
              <Text className={`text-lg ${
                key === value ? 'text-blue-500 font-medium' : 'text-gray-700'
              }`}>
                {label}
              </Text>
              {key === value && (
                <MaterialCommunityIcons 
                  name="check" 
                  size={24} 
                  color="#3B82F6"
                />
              )}
            </Pressable>
          ))}
          
          <Pressable
            onPress={() => setIsVisible(false)}
            className="p-4 border-t border-gray-100"
          >
            <Text className="text-center text-gray-500">取消</Text>
          </Pressable>
        </View>
      </Modal>
    </>
  );
};