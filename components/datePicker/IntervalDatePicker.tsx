import React, { useState } from 'react';
import { View, Text, Pressable } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { format, addDays, addWeeks, addMonths, addYears, getWeek, getYear, setWeek, startOfWeek, endOfWeek, startOfMonth, endOfMonth } from 'date-fns';
import { zhTW } from 'date-fns/locale';
import { DatePickerModal } from '@/components/datePicker/DatePickerModal';

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
  const [showDatePicker, setShowDatePicker] = useState(false);

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

  const handleDateSelect = (selectedDate: Date) => {
    switch (mode) {
      case "day":
        onChange(selectedDate);
        break;
      case "week":
        // 确保选择的日期是该周的开始
        onChange(startOfWeek(selectedDate, { locale: zhTW }));
        break;
      case "month":
        // 确保选择的日期是该月的开始
        onChange(startOfMonth(selectedDate));
        break;
      case "year":
        // 设置为该年的1月1日
        onChange(new Date(selectedDate.getFullYear(), 0, 1));
        break;
    }
    setShowDatePicker(false);
  };

  return (
    <View className="flex-row items-center justify-between bg-rain-50 px-4 py-3">
      <Pressable
        onPress={handlePrevious}
        className="w-10 h-10 items-center justify-center rounded-full active:bg-gray-100"
      >
        <MaterialCommunityIcons name="chevron-left" size={24} color="#374151" />
      </Pressable>
      
      <Pressable 
        onPress={() => setShowDatePicker(true)}
        className="flex-1 mx-4 items-center"
      >
        <Text className="text-lg font-medium text-gray-800">
          {getDisplayText()}
        </Text>
      </Pressable>

      <Pressable
        onPress={handleNext}
        className="w-10 h-10 items-center justify-center rounded-full active:bg-gray-100"
      >
        <MaterialCommunityIcons name="chevron-right" size={24} color="#374151" />
      </Pressable>

      {showDatePicker && (
        <DatePickerModal
          date={date}
          onConfirm={handleDateSelect}
          onCancel={() => setShowDatePicker(false)}
          mode={mode}
          minDate={new Date(2000, 0, 1)}
          maxDate={new Date(2100, 11, 31)}
        />
      )}
    </View>
  );
};