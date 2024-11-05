import { TouchableOpacity, View, Text } from "react-native";
import { ThemedView } from "../ThemedView";

interface CalculaterProps {
  value: string;
	onChange: (value: string) => void;
	onComplete?: (value: number) => void;
}

export function Calculator({ value, onChange, onComplete }: CalculaterProps) {
	const buttons = [
		['AC', '⌫', '+/-', '÷'],
    ['7', '8', '9', '×'],
    ['4', '5', '6', '-'],
    ['1', '2', '3', '+'],
    ['00', '0', '.', '=']
  ];

	const isCalculating = /[+\-×÷]/.test(value);

	const calculate = (expression: string): string => {
		const expr = expression.replace(/×/g, '*').replace(/÷/g, '/');
		try {
			return eval(expression);
		} catch (error) {
			return '0';
		}
	}

	const handlePress = (key: string) => {
    switch (key) {
			case 'AC':
				onChange('0');
				break;

      case '⌫':
        onChange(value.slice(0, -1) || '0');
        break;

			case '+/-':
				if (value === '0') return;
				if (value[0] === '-') {
					onChange(value.slice(1));
				} else {
					onChange('-' + value);
				}
				break;

      case '=':
				if (!isCalculating) return;
				const result = calculate(value);
				onChange(result.toString());
				break;

      case '✓':
				if (!isCalculating) return;
				const finalValue = parseFloat(value);
				onComplete?.(finalValue);
        break;

			case '+':
			case '-':
			case '×':
			case '÷':
				if (value.slice(-1).match(/[+\-×÷]/)) {
					onChange(value.slice(0, -1) + key);
				} else {
					onChange(value + key);
				}
				break;

      case '.':
        const numbers = value.split(/[+\-×÷]/);
				const currentNumber = numbers[numbers.length - 1];
				if (!currentNumber.includes('.')) {
          onChange(value + '.');
        }
        break;
				
      default:
        onChange(value === '0' ? key : value + key);
        break;
    }
  };

	return (
		<ThemedView className="w-full bg-rain-200 px-4 mb-2">
			{buttons.map((row, i) => (
				<View key={i} className="flex-row justify-around my-2">
					{row.map((button) => (
						<TouchableOpacity
							key={button}
							onPress={() => handlePress(button)}
							className={`w-16 h-16 rounded-3xl items-center justify-center shadow-md ${
								button === '=' || button === '✓'
									? 'bg-rain-500'
									: button === '⌫' || button === 'AC'
									? 'bg-red-200'
									: button === '+' || button === '-' || button === '×' || button === '÷' || button === '%'
									? 'bg-rain-300'
									: 'bg-white'
							}`}>
							<Text className={`text-2xl ${
								button === '=' || button === '✓'
                  ? 'text-white'
                  : 'text-gray-800'
							}`}>
								{button === '=' ? (isCalculating ? '=' : '✓') : button}
							</Text>
						</TouchableOpacity>
					))}
				</View>
			))}
		</ThemedView>
	);
}