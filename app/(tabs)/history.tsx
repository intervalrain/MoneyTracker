import { View, Text, TouchableOpacity } from "react-native";
import { useSelector } from "react-redux";
import { RootState } from "@/store";
import { Transaction } from "@/types";
import { useCallback, useState } from "react";
import { ThemedView } from "@/components/ThemedView";

const HistoryScreen = () => {
  const [records, setRecords] = useState<Transaction[]>([]);
  const [editingRecord, setEditingRecord] = useState<Transaction | undefined>();

  // const handleAdd = useCallback((data: RecordFormData) => {
  //   const newRecord: Transaction = {
  //     id: Date.now().toString(),
  //     ...data,
  //     createdAt: new Date()
  //   };
  //   setRecords(prev => [newRecord, ...prev]);
  // }, []);

  // const handleEdit = useCallback((data: RecordFormData) => {
  //   if (!editingRecord) return;
    
  //   setRecords(prev => prev.map(record => 
  //     record.id === editingRecord.id
  //       ? { ...record, ...data, updatedAt: new Date() }
  //       : record
  //   ));
  //   setEditingRecord(undefined);
  // }, [editingRecord]);

  const handleDelete = useCallback((id: string) => {
    setRecords(prev => prev.filter(record => record.id !== id));
  }, []);

  return (
    <ThemedView className="flex-1 bg-rain-100 p-4">
      {/* {(editingRecord) && (
        <RecordForm
          record={editingRecord}
          onSubmit={handleEdit}
          onCancel={() => setEditingRecord(undefined)}
        />
      )}
      
      <FlatList
        data={records}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <RecordItem
            record={item}
            onEdit={setEditingRecord}
            onDelete={handleDelete}
          />
        )}
        ListEmptyComponent={() => (
          <View className="items-center justify-center py-8">
            <Text className="text-gray-500">尚無記錄</Text>
          </View>
        )}
      /> */}
    </ThemedView>
  );
};

export default HistoryScreen;