import React, { useState } from "react";
import { View, Text, TextInput, Pressable, Modal } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { TransactionMode } from "@/types";
import IconSelector from "@/components/IconSelector";
import { useDispatch } from "react-redux";
import { addTransactionType } from "@/store/customTypesSlice";
import { getUUID } from "@/utils/uuid";

interface AddTypeModalProps {
	onClose: () => void;
  initialMode?: TransactionMode;
}

export const AddTypeModal: React.FC<AddTypeModalProps> = ({
  onClose,
  initialMode = "expense",
}) => {
  const dispatch = useDispatch();
  const [showIconSelector, setShowIconSelector] = useState(false);
  const [typeData, setTypeData] = useState<{
    label: string;
    icon: string;
    mode: TransactionMode[];
  }>({
    label: "",
    icon: "plus",
    mode: [initialMode],
  });

  const handleModeToggle = (mode: TransactionMode) => {
    setTypeData((prev) => ({
      ...prev,
      mode: prev.mode.includes(mode)
        ? prev.mode.filter((m) => m !== mode)
        : [...prev.mode, mode],
    }));
  };

  const handleSubmit = () => {
    if (typeData.label) {
      dispatch(
        addTransactionType({
          key: getUUID(),
          value: {
            label: typeData.label,
            icon: typeData.icon,
            mode: typeData.mode,
          },
        })
      );
      onClose();
    }
  };

  return (
		<View className="absolute top-0 left-0 right-0 bottom-0 bg-black/50 justify-center items-center z-50">
			<View className="bg-white p-4 rounded-2xl w-80">
				<Text className="text-xl font-bold mb-4">新增交易類型</Text>

				<TextInput
					className="border border-gray-200 rounded-lg px-4 py-2 mb-4"
					placeholder="顯示名稱"
					value={typeData.label}
					onChangeText={(text) =>
						setTypeData((prev) => ({ ...prev, label: text }))
					}
				/>

				<Pressable
					onPress={() => setShowIconSelector(true)}
					className="flex-row items-center space-x-2 border border-gray-200 rounded-lg px-4 py-2 mb-4"
				>
					<MaterialCommunityIcons
						name={
							typeData.icon as keyof typeof MaterialCommunityIcons.glyphMap
						}
						size={24}
						color="black"
					/>
					<Text>選擇圖標</Text>
				</Pressable>

				<View className="mb-4">
					<Text className="text-gray-500 mb-2">可用於：</Text>
					<View className="flex-row space-x-2">
						<Pressable
							onPress={() => handleModeToggle("expense")}
							className={`px-4 py-2 rounded-lg ${
								typeData.mode.includes("expense")
									? "bg-rain-500"
									: "bg-rain-100"
							}`}
						>
							<Text
								className={`${
									typeData.mode.includes("expense")
										? "text-white"
										: "text-black"
								}`}
							>
								支出
							</Text>
						</Pressable>
						<Pressable
							onPress={() => handleModeToggle("income")}
							className={`px-4 py-2 rounded-lg ${
								typeData.mode.includes("income")
									? "bg-rain-500"
									: "bg-rain-100"
							}`}
						>
							<Text
								className={`${
									typeData.mode.includes("income")
										? "text-white"
										: "text-black"
								}`}
							>
								收入
							</Text>
						</Pressable>
					</View>
				</View>

				<View className="flex-row justify-end space-x-2">
					<Pressable
						onPress={onClose}
						className="px-4 py-2 rounded-lg bg-gray-200"
					>
						<Text>取消</Text>
					</Pressable>
					<Pressable
						onPress={handleSubmit}
						className="px-4 py-2 rounded-lg bg-green-500"
					>
						<Text className="text-white">確定</Text>
					</Pressable>
				</View>
			</View>

			{showIconSelector && (
				<IconSelector
					currentIcon={
						typeData.icon as keyof typeof MaterialCommunityIcons.glyphMap
					}
					onSelect={(icon) => {
						setTypeData((prev) => ({ ...prev, icon }));
						setShowIconSelector(false);
					}}
					onClose={() => setShowIconSelector(false)}
				/>
			)}
		</View>
  );
};
