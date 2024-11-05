import { View, Text, ScrollView, TouchableOpacity } from "react-native";
import { useSelector } from "react-redux";
import { RootState } from "@/store";
import { useMemo } from "react";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { router } from 'expo-router';

export default function HomeScreen() {
  const transactions = useSelector((state: RootState) => state.transactions.transactions);

  const financialSummary = useMemo(() => {
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();

    return transactions.reduce((acc, transaction) => {
      const transactionDate = new Date(transaction.date);
      const amount = Number(transaction.amount);

      // 計算總餘額
      if (transaction.mode === "income") {
        acc.totalBalance += amount;
      } else if (transaction.mode === "expense") {
        acc.totalBalance -= amount;
      }

      // 計算當月收支
      if (
        transactionDate.getMonth() === currentMonth &&
        transactionDate.getFullYear() === currentYear
      ) {
        if (transaction.mode === "income") {
          acc.monthlyIncome += amount;
        } else if (transaction.mode === "expense") {
          acc.monthlyExpense += amount;
        }
      }

      return acc;
    }, {
      totalBalance: 0,
      monthlyIncome: 0,
      monthlyExpense: 0,
    });
  }, [transactions]);

  // 計算緊急度（支出/收入的比例）
  const emergencyLevel = useMemo(() => {
    if (financialSummary.monthlyIncome === 0) return 100;
    const ratio = (financialSummary.monthlyExpense / financialSummary.monthlyIncome) * 100;
    return Math.min(Math.max(ratio, 0), 100); // 確保在 0-100 之間
  }, [financialSummary]);

  // 根據緊急度返回顏色
  const getEmergencyColor = (level: number) => {
    if (level < 50) return "rgb(34, 197, 94)"; // green-500
    if (level < 75) return "rgb(234, 179, 8)";  // yellow-500
    return "rgb(239, 68, 68)"; // red-500
  };

  // 根據緊急度返回描述
  const getEmergencyDescription = (level: number) => {
    if (level < 50) return "狀態良好";
    if (level < 75) return "需要注意";
    return "請節制支出";
  };

  const currentMonth = new Date().toLocaleDateString('zh-TW', { month: 'long' });

  return (
    <ScrollView className="flex-1 bg-rain-50">
      {/* 總餘額卡片 */}
      <View className="bg-white m-4 p-6 rounded-2xl shadow-md">
        <Text className="text-gray-500 font-medium mb-2">總餘額</Text>
        <Text className="text-4xl font-bold">
          ${financialSummary.totalBalance.toLocaleString()}
        </Text>
      </View>

      {/* 月度收支卡片 */}
      <View className="flex-row mx-4 space-x-4">
        <View className="flex-1 bg-green-50 p-6 rounded-2xl shadow-md">
          <View className="flex-row items-center">
            <MaterialCommunityIcons name="arrow-down" size={24} color="rgb(34, 197, 94)" />
            <Text className="text-green-600 font-medium ml-2">{currentMonth}收入</Text>
          </View>
          <Text className="text-2xl font-bold text-green-700 mt-2">
            ${financialSummary.monthlyIncome.toLocaleString()}
          </Text>
        </View>

        <View className="flex-1 bg-red-50 p-6 rounded-2xl shadow-md">
          <View className="flex-row items-center">
            <MaterialCommunityIcons name="arrow-up" size={24} color="rgb(239, 68, 68)" />
            <Text className="text-red-600 font-medium ml-2">{currentMonth}支出</Text>
          </View>
          <Text className="text-2xl font-bold text-red-700 mt-2">
            ${financialSummary.monthlyExpense.toLocaleString()}
          </Text>
        </View>
      </View>

      {/* 水庫緊急度指標 */}
      <View className="bg-white mx-4 mt-4 p-6 rounded-2xl shadow-md">
        <Text className="text-gray-500 font-medium mb-4">本月預算水位</Text>
        
        {/* 進度條容器 */}
        <View className="h-4 bg-gray-200 rounded-full overflow-hidden">
          <View 
            className="h-full rounded-full transition-all duration-500 ease-out"
            style={{ 
              width: `${emergencyLevel}%`,
              backgroundColor: getEmergencyColor(emergencyLevel)
            }} 
          />
        </View>

        {/* 緊急度指標說明 */}
        <View className="flex-row justify-between items-center mt-4">
          <View className="flex-row items-center">
            <View 
              className="w-3 h-3 rounded-full mr-2"
              style={{ backgroundColor: getEmergencyColor(emergencyLevel) }}
            />
            <Text className="text-gray-600 font-medium">
              {getEmergencyDescription(emergencyLevel)}
            </Text>
          </View>
          <Text className="text-gray-500">
            {emergencyLevel.toFixed(1)}%
          </Text>
        </View>

        {/* 詳細說明 */}
        <View className="mt-4 p-4 bg-gray-50 rounded-xl">
          <Text className="text-sm text-gray-600">
            {emergencyLevel >= 75 ? (
              "您的支出已超過收入的 75%，建議檢視開支並適度節制。"
            ) : emergencyLevel >= 50 ? (
              "支出已達收入的一半以上，建議關注支出趨勢。"
            ) : (
              "您的支出控制得宜，繼續保持良好的理財習慣！"
            )}
          </Text>
        </View>
      </View>

      {/* 快捷功能區 */}
      <View className="flex-row mx-4 mt-4 mb-6 space-x-4">
        <TouchableOpacity 
          className="flex-1 bg-blue-50 p-4 rounded-xl shadow-sm items-center"
          onPress={() => router.push('/transaction')}
        >
          <MaterialCommunityIcons name="plus-circle" size={28} color="rgb(59, 130, 246)" />
          <Text className="text-blue-600 mt-2">記一筆</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          className="flex-1 bg-purple-50 p-4 rounded-xl shadow-sm items-center"
          onPress={() => router.push('/history')}
        >
          <MaterialCommunityIcons name="history" size={28} color="rgb(147, 51, 234)" />
          <Text className="text-purple-600 mt-2">查看記錄</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}