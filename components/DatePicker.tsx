import { View, TouchableOpacity, Text, Platform } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import DateTimePicker, { DateTimePickerEvent } from "@react-native-community/datetimepicker";

interface DatePickerProps {
  value: Date;
  onChange: (date: Date) => void;
  className?: string;
  locale?: string;
  formatOptions?: Intl.DateTimeFormatOptions;
  arrowColor?: string;
  arrowSize?: number;
}

export function DatePicker({ 
  value, 
  onChange, 
  className = "",
  locale = "zh-TW",
  formatOptions = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    weekday: 'long',
  },
  arrowColor = "#666666",
  arrowSize = 24
}: DatePickerProps) {
  const adjustDate = (days: number) => {
    const newDate = new Date(value);
    newDate.setDate(newDate.getDate() + days);
    onChange(newDate);
  };

  const handleDateChange = (event: DateTimePickerEvent, selectedDate?: Date) => {
    if (selectedDate) {
      onChange(selectedDate);
    }
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString(locale, formatOptions);
  };

  return (
    <View className={`flex-row items-center justify-between bg-rain-200 rounded-lg mx-4 ${className}`}>
      <TouchableOpacity 
        onPress={() => adjustDate(-1)} 
        className="p-2"
      >
        <MaterialCommunityIcons
          name="chevron-left"
          size={arrowSize}
          color={arrowColor}
        />
      </TouchableOpacity>

      {Platform.OS === 'ios' ? (
        <View className="flex-1 justify-center items-center">
          <DateTimePicker
            value={value}
            mode="date"
            display="default"
            locale={locale}
            onChange={handleDateChange}
          />
        </View>
      ) : (
        <TouchableOpacity 
          className="flex-1 py-3"
          onPress={() => {
            if (Platform.OS === 'android') {
              handleDateChange({ type: 'set' } as DateTimePickerEvent, value);
            }
          }}
        >
          <Text className="text-center text-base">
            {formatDate(value)}
          </Text>
        </TouchableOpacity>
      )}

      <TouchableOpacity 
        onPress={() => adjustDate(1)} 
        className="p-2"
      >
        <MaterialCommunityIcons
          name="chevron-right"
          size={arrowSize}
          color={arrowColor}
        />
      </TouchableOpacity>

      {Platform.OS === 'android' && (
        <DateTimePicker
          value={value}
          mode="date"
          display="default"
          locale={locale}
          onChange={handleDateChange}
        />
      )}
    </View>
  );
}