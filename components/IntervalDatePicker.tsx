import React from 'react';
import { View, Text, Pressable } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { format, addDays, addWeeks, addMonths, addYears, getWeek, getYear, setWeek } from 'date-fns';
import { zhTW } from 'date-fns/locale';

interface IntervalDatePickerProps {
  mode: "day" | "week" | "month" | "year";
  date: Date;
  onChange: (date: Date) => void;
}

export const IntervalDatePicker: React.FC<IntervalDatePickerProps> = ({
  mode,
  date,
  onChange,
}) => {
  const handlePrevious = () => {
    switch (mode) {
      case "day":
        onChange(addDays(date, -1));
        break;
      case "week":
        onChange(addWeeks(date, -1));
        break;
      case "month":
        onChange(addMonths(date, -1));
        break;
      case "year":
        onChange(addYears(date, -1));
        break;
    }
  };

  const handleNext = () => {
    switch (mode) {
      case "day":
        onChange(addDays(date, 1));
        break;
      case "week":
        onChange(addWeeks(date, 1));
        break;
      case "month":
        onChange(addMonths(date, 1));
        break;
      case "year":
        onChange(addYears(date, 1));
        break;
    }
  };

  const getDisplayText = () => {
    switch (mode) {
      case "day":
        return format(date, 'yyyy年MM月dd日 EEEE', { locale: zhTW });
      case "week": {
        const weekNumber = getWeek(date, { locale: zhTW });
        const yearNumber = getYear(date);
        const weekStart = format(date, 'MM/dd', { locale: zhTW });
        const weekEnd = format(addDays(date, 6), 'MM/dd', { locale: zhTW });
        return `${yearNumber}年第${weekNumber}週 (${weekStart}-${weekEnd})`;
      }
      case "month":
        return format(date, 'yyyy年MM月', { locale: zhTW });
      case "year":
        return format(date, 'yyyy年', { locale: zhTW });
    }
  };

  return (
    <View className="flex-row items-center justify-between bg-white px-4 py-3">
      <Pressable
        onPress={handlePrevious}
        className="w-10 h-10 items-center justify-center rounded-full active:bg-gray-100"
      >
        <MaterialCommunityIcons name="chevron-left" size={24} color="#374151" />
      </Pressable>
      
      <Text className="text-lg font-medium text-gray-800">
        {getDisplayText()}
      </Text>

      <Pressable
        onPress={handleNext}
        className="w-10 h-10 items-center justify-center rounded-full active:bg-gray-100"
      >
        <MaterialCommunityIcons name="chevron-right" size={24} color="#374151" />
      </Pressable>
    </View>
  );
};