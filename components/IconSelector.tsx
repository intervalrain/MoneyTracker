import React, { useState } from 'react';
import { View, Text, TextInput, ScrollView, Pressable } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

// MaterialCommunityIcons 的圖標類型
type IconName = keyof typeof MaterialCommunityIcons.glyphMap;

// 組件的 Props 類型定義
interface IconSelectorProps {
  onSelect: (iconName: IconName) => void;
  currentIcon?: IconName;
  onClose: () => void;
}

// 常用圖標列表 - 確保所有值都是有效的 IconName
const COMMON_ICONS: IconName[] = [
  'food',
  'shopping',
  'cart',
  'cash',
  'wallet',
  'car',
  'home',
  'office-building',
  'medical-bag',
  'school',
  'train',
  'airplane',
  'basketball',
  'music',
  'gift',
  'camera',
  'phone',
] as IconName[];

const IconSelector: React.FC<IconSelectorProps> = ({
  onSelect,
  currentIcon,
  onClose,
}) => {
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [icons] = useState<IconName[]>(COMMON_ICONS);

  const filteredIcons = icons.filter((icon) =>
    icon.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // 處理圖標選擇
  const handleIconSelect = (icon: IconName) => {
    onSelect(icon);
    onClose();
  };

  return (
    <View className="bg-white rounded-2xl p-4 w-full max-w-md">
      <View className="flex-row items-center justify-between mb-4">
        <Text className="text-xl font-bold">選擇圖標</Text>
        <Pressable onPress={onClose} className="p-2">
          <MaterialCommunityIcons name="close" size={24} />
        </Pressable>
      </View>

      <View className="mb-4">
        <TextInput
          className="border border-gray-200 rounded-lg px-4 py-2"
          placeholder="搜尋圖標..."
          value={searchTerm}
          onChangeText={setSearchTerm}
        />
      </View>

      <ScrollView className="max-h-64" showsVerticalScrollIndicator={false}>
        <View className="flex-row flex-wrap justify-start gap-4">
          {filteredIcons.map((icon) => (
            <Pressable
              key={icon}
              onPress={() => handleIconSelect(icon)}
              className={`w-16 h-16 items-center justify-center rounded-lg ${
                currentIcon === icon ? 'bg-rain-300 border' : 'bg-gray-100'
              }`}
            >
              <MaterialCommunityIcons
                name={icon}
                size={28}
                color={currentIcon === icon ? 'black' : '#666'}
              />
              <Text className="text-xs mt-1 text-center">{icon}</Text>
            </Pressable>
          ))}
        </View>
      </ScrollView>
    </View>
  );
};

export default IconSelector;