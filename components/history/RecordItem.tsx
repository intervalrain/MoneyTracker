import React, { useState, useCallback } from 'react';
import { View, Text, FlatList, TouchableOpacity, TextInput } from 'react-native';
import { format } from 'date-fns';
import { Transaction } from '@/types';

interface RecordItemProps {
  record: Transaction;
  onEdit: (record: Transaction) => void;
  onDelete: (id: string) => void;
}

const RecordItem: React.FC<RecordItemProps> = ({
	record, 
	onEdit, 
	onDelete 
}: RecordItemProps) => {
  return (
    <TouchableOpacity 
      onPress={() => onEdit(record)}
      className="flex-row items-center justify-between p-4 bg-white rounded-lg shadow-sm mb-2"
    >
      <View>
        <Text className="text-lg font-medium text-gray-800">
          {record.amount.toLocaleString()}
        </Text>
        {record.note && (
          <Text className="text-sm text-gray-500 mt-1">
            {record.note}
          </Text>
        )}
      </View>
      <View className="items-end">
        <Text className="text-sm text-gray-500">
          {format(record.account, 'yyyy/MM/dd HH:mm')}
        </Text>
        <TouchableOpacity 
          onPress={() => onDelete(record.id)}
          className="mt-2"
        >
          <Text className="text-red-500">刪除</Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
};
