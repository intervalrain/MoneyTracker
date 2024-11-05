import { View, Text, TouchableOpacity } from "react-native";
import { useMemo } from "react";

interface BarButtonProp {
  label: string;
  value: string;
  color?: string;
}

interface BarButtonsProps {
  buttons: BarButtonProp[];
  value: string;
  onChange: (value: string) => void;
  className?: string;
}

export function BarButtons({ buttons, value, onChange, className = "" }: BarButtonsProps) {
  const getButtonStyle = useMemo(() => {
    return (index: number, isActive: boolean, customColor?: string) => {
      const baseStyle = "flex-1 p-3 shadow-md";
      const activeColor = customColor || "bg-rain-600";
      const inactiveColor = "bg-rain-400";
      
      const positions = {
        first: "rounded-l-full",
        middle: "",
        last: "rounded-r-full"
      };

      const position = index === 0 
        ? positions.first 
        : index === buttons.length - 1 
          ? positions.last 
          : positions.middle;

      return `${baseStyle} ${position} ${isActive ? activeColor : inactiveColor}`;
    };
  }, [buttons.length]);

  return (
    <View className={`flex-row px-4 py-2 bg-rain-50 ${className}`}>
      {buttons.map((button, index) => (
        <TouchableOpacity
          key={button.value}
          onPress={() => onChange(button.value)}
          className={getButtonStyle(
            index,
            value === button.value,
            button.color
          )}
        >
          <Text className="text-white text-center font-semibold">
            {button.label}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}