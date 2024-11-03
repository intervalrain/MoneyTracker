import { View, Text } from "react-native";
import { useSelector } from "react-redux";
import { ThemedText } from "@/components/ThemedText";
import { RootState } from "@/store";

export default function HomeScreen() {
  const { currentMonthTotal, accounts } = useSelector(
    (state: RootState) => state.finance
  );

  return (
    <View className="flex-1 items-center justify-center">
      <Text>主頁</Text>
    </View>
  );
}
