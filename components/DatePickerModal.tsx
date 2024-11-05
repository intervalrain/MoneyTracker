import React from 'react';
import { View, Text, Pressable } from 'react-native';
import Modal from 'react-native-modal';
import { Calendar } from 'react-native-calendars';
import { format } from 'date-fns';
import { zhTW } from 'date-fns/locale';

interface DatePickerModalProps {
  date: Date;
  onConfirm: (date: Date) => void;
  onCancel: () => void;
}

export const DatePickerModal: React.FC<DatePickerModalProps> = ({
  date,
  onConfirm,
  onCancel,
}) => {
  const [selectedDate, setSelectedDate] = React.useState(
    format(date, 'yyyy-MM-dd')
  );

  const markedDates = {
    [selectedDate]: {
      selected: true,
      selectedColor: '#3B82F6',
    },
  };

  const handleDayPress = (day: { dateString: string }) => {
    setSelectedDate(day.dateString);
  };

  const handleConfirm = () => {
    onConfirm(new Date(selectedDate));
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
          <Text className="text-lg font-medium">選擇日期</Text>
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
          markedDates={markedDates}
          // Customize theme
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
          // Localization
          monthNames={[
            '1月',
            '2月',
            '3月',
            '4月',
            '5月',
            '6月',
            '7月',
            '8月',
            '9月',
            '10月',
            '11月',
            '12月',
          ]}
          dayNames={['日', '一', '二', '三', '四', '五', '六']}
          dayNamesShort={['日', '一', '二', '三', '四', '五', '六']}
        />

        {/* Selected Date Display */}
        <View className="p-4 bg-gray-50">
          <Text className="text-center text-gray-600">
            已選擇：{format(new Date(selectedDate), 'yyyy年M月d日 EEEE', { locale: zhTW })}
          </Text>
        </View>
      </View>
    </Modal>
  );
};