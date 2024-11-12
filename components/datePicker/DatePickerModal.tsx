import React from 'react';
import { View, Text, Pressable } from 'react-native';
import Modal from 'react-native-modal';
import { Calendar } from 'react-native-calendars';
import { format, startOfWeek, endOfWeek, startOfMonth, endOfMonth } from 'date-fns';
import { zhTW } from 'date-fns/locale';

interface DatePickerModalProps {
  date: Date;
  onConfirm: (date: Date) => void;
  onCancel: () => void;
  mode?: "day" | "week" | "month" | "year";
  minDate?: Date;
  maxDate?: Date;
}

export const DatePickerModal: React.FC<DatePickerModalProps> = ({
  date,
  onConfirm,
  onCancel,
  mode = "day",
  minDate,
  maxDate,
}) => {
  const [selectedDate, setSelectedDate] = React.useState(
    format(date, 'yyyy-MM-dd')
  );

  // 根據模式取得要標記的日期範圍
  const getMarkedDates = () => {
    const baseDate = new Date(selectedDate);
    const marks: { [key: string]: any } = {};

    switch (mode) {
      case 'day':
        marks[selectedDate] = {
          selected: true,
          selectedColor: '#3B82F6',
        };
        break;
      
      case 'week': {
        const weekStart = startOfWeek(baseDate, { locale: zhTW });
        const weekEnd = endOfWeek(baseDate, { locale: zhTW });
        let current = weekStart;
        while (current <= weekEnd) {
          marks[format(current, 'yyyy-MM-dd')] = {
            selected: true,
            selectedColor: '#3B82F6',
          };
          current = new Date(current.setDate(current.getDate() + 1));
        }
        break;
      }

      case 'month': {
        const monthStart = startOfMonth(baseDate);
        const monthEnd = endOfMonth(baseDate);
        let current = monthStart;
        while (current <= monthEnd) {
          marks[format(current, 'yyyy-MM-dd')] = {
            selected: true,
            selectedColor: '#3B82F6',
          };
          current = new Date(current.setDate(current.getDate() + 1));
        }
        break;
      }

      case 'year': {
        // 標記整年的第一天
        const yearStart = new Date(baseDate.getFullYear(), 0, 1);
        marks[format(yearStart, 'yyyy-MM-dd')] = {
          selected: true,
          selectedColor: '#3B82F6',
        };
        break;
      }
    }

    return marks;
  };

  // 格式化顯示文字
  const getDisplayText = () => {
    const baseDate = new Date(selectedDate);
    switch (mode) {
      case 'day':
        return format(baseDate, 'yyyy年M月d日 EEEE', { locale: zhTW });
      case 'week': {
        const weekStart = format(startOfWeek(baseDate, { locale: zhTW }), 'M月d日');
        const weekEnd = format(endOfWeek(baseDate, { locale: zhTW }), 'M月d日');
        const weekNumber = format(baseDate, 'w', { locale: zhTW });
        return `${format(baseDate, 'yyyy年')}第${weekNumber}週 (${weekStart}-${weekEnd})`;
      }
      case 'month':
        return format(baseDate, 'yyyy年M月', { locale: zhTW });
      case 'year':
        return format(baseDate, 'yyyy年', { locale: zhTW });
    }
  };

  // 處理日期選擇
  const handleDayPress = (day: { dateString: string }) => {
    setSelectedDate(day.dateString);
  };

  // 處理確認
  const handleConfirm = () => {
    const selectedDateTime = new Date(selectedDate);
    switch (mode) {
      case 'day':
        onConfirm(selectedDateTime);
        break;
      case 'week':
        onConfirm(startOfWeek(selectedDateTime, { locale: zhTW }));
        break;
      case 'month':
        onConfirm(startOfMonth(selectedDateTime));
        break;
      case 'year':
        onConfirm(new Date(selectedDateTime.getFullYear(), 0, 1));
        break;
    }
  };

  return (
    <Modal
      isVisible={true}
      onBackdropPress={onCancel}
      style={{ margin: 0, justifyContent: 'flex-end' }}
      backdropTransitionOutTiming={0}
    >
      <View className="bg-white rounded-t-3xl">
        {/* Header */}
        <View className="flex-row justify-between items-center p-4 border-b border-gray-100">
          <Text className="text-lg font-medium">
            {mode === 'week' ? '選擇週數' :
             mode === 'month' ? '選擇月份' :
             mode === 'year' ? '選擇年份' : '選擇日期'}
          </Text>
          <View className="flex-row space-x-4">
            <Pressable onPress={onCancel}>
              <Text className="text-gray-500">取消</Text>
            </Pressable>
            <Pressable onPress={handleConfirm}>
              <Text className="text-blue-500 font-medium">確定</Text>
            </Pressable>
          </View>
        </View>

        {/* Calendar */}
        <Calendar
          current={selectedDate}
          onDayPress={handleDayPress}
          markedDates={getMarkedDates()}
          minDate={minDate ? format(minDate, 'yyyy-MM-dd') : undefined}
          maxDate={maxDate ? format(maxDate, 'yyyy-MM-dd') : undefined}
          theme={{
            backgroundColor: '#ffffff',
            calendarBackground: '#ffffff',
            textSectionTitleColor: '#6B7280',
            selectedDayBackgroundColor: '#3B82F6',
            selectedDayTextColor: '#ffffff',
            todayTextColor: '#3B82F6',
            dayTextColor: '#1F2937',
            textDisabledColor: '#D1D5DB',
            dotColor: '#3B82F6',
            selectedDotColor: '#ffffff',
            arrowColor: '#3B82F6',
            monthTextColor: '#1F2937',
            textMonthFontWeight: '600',
            textDayFontSize: 16,
            textMonthFontSize: 16,
            textDayHeaderFontSize: 14,
          }}
          monthNames={[
            '1月', '2月', '3月', '4月', '5月', '6月',
            '7月', '8月', '9月', '10月', '11月', '12月'
          ]}
          dayNames={['日', '一', '二', '三', '四', '五', '六']}
          dayNamesShort={['日', '一', '二', '三', '四', '五', '六']}
        />

        {/* Selected Date Display */}
        <View className="p-4 bg-rain-50">
          <Text className="text-center text-gray-600">
            已選擇：{getDisplayText()}
          </Text>
        </View>
      </View>
    </Modal>
  );
};