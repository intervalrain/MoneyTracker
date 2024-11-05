// import { Transaction } from "@/types";

// interface RecordFormProps {
//     record?: Transaction;
//     onSubmit: (data: RecordFormData) => void;
//     onCancel: () => void;
//   }
  
//   const RecordForm = ({ record, onSubmit, onCancel }: RecordFormProps) => {
//     const [note, setNote] = useState(record?.note || '');
  
//     const handleSubmit = () => {
//       onSubmit({
//         value: record?.value || 0,
//         note
//       });
//       setNote('');
//     };
  
//     return (
//       <View className="bg-white p-4 rounded-lg shadow-sm mb-4">
//         <Text className="text-lg font-medium mb-2">
//           {record ? '編輯記錄' : '新增記錄'}
//         </Text>
//         <TextInput
//           value={note}
//           onChangeText={setNote}
//           placeholder="備註"
//           className="border border-gray-200 rounded-lg p-2 mb-4"
//         />
//         <View className="flex-row justify-end">
//           <TouchableOpacity 
//             onPress={onCancel}
//             className="px-4 py-2 mr-2"
//           >
//             <Text className="text-gray-500">取消</Text>
//           </TouchableOpacity>
//           <TouchableOpacity 
//             onPress={handleSubmit}
//             className="bg-rain-500 px-4 py-2 rounded-lg"
//           >
//             <Text className="text-white">確定</Text>
//           </TouchableOpacity>
//         </View>
//       </View>
//     );
//   };
  