import React, { useState, useMemo } from 'react';
import { View, Text, ScrollView, Dimensions } from 'react-native';
import { useSelector } from 'react-redux';
import { 
  format, 
  eachDayOfInterval, 
  startOfWeek, 
  endOfWeek, 
  startOfMonth, 
  endOfMonth, 
  startOfYear, 
  endOfYear,
  eachMonthOfInterval,
	eachWeekOfInterval
} from 'date-fns';
import { zhTW } from 'date-fns/locale';
import { LineChart, PieChart } from 'react-native-chart-kit';
import { IntervalType, Transaction } from '@/types';
import { generateColor } from '@/utils/colorGenerator';
import { BarButtons } from '@/components/BarButton';
import { IntervalDatePicker } from '@/components/datePicker/IntervalDatePicker';
import { RootState } from '@/store';

const screenWidth = Dimensions.get('window').width;

interface DateRange {
  from: Date;
  to: Date;
}

interface LineChartData {
  labels: string[];
  datasets: {
    data: number[];
    color?: (opacity: number) => string;
    strokeWidth?: number;
  }[];
  legend: string[];
}

const StatisticsScreen: React.FC = () => {
  const [mode, setMode] = useState<IntervalType>("month");
  const [date, setDate] = useState(new Date());
  const transactions = useSelector((state: RootState) => state.transactions.transactions);
  const { transactionTypes } = useSelector(
    (state: RootState) => state.customTypes
  );

  const chartWidth = screenWidth - 48;

  const intervalTypeButtons = [
    { label: "週", value: "week" },
    { label: "月", value: "month" },
    { label: "年", value: "year" },
  ];

  const dateRange = useMemo<DateRange>(() => {
    switch (mode) {
      case 'day':
        return { from: date, to: date };
      case 'week':
        return { 
          from: startOfWeek(date, { locale: zhTW }), 
          to: endOfWeek(date, { locale: zhTW }) 
        };
      case 'month':
        return { 
          from: startOfMonth(date), 
          to: endOfMonth(date) 
        };
      case 'year':
        return { 
          from: startOfYear(date), 
          to: endOfYear(date) 
        };
    }
  }, [date, mode]);

  const filteredTransactions = useMemo(() => {
    return transactions.filter((transaction: Transaction) => {
      const transDate = new Date(transaction.date);
      return transDate >= dateRange.from && transDate <= dateRange.to;
    });
  }, [transactions, dateRange]);

  const lineChartData = useMemo<LineChartData>(() => {
    let labels: string[] = [];
    let dataPoints: { [key: string]: { income: number; expense: number } } = {};

		switch (mode) {
			case 'week': {
				const days = eachDayOfInterval({ start: dateRange.from, end: dateRange.to });
				days.forEach(day => {
					const key = format(day, 'yyyy-MM-dd');
					labels.push(format(day, 'd'));
					dataPoints[key] = { income: 0, expense: 0 };
				});
				break;
			}
			case 'month': {
				const weeks = eachWeekOfInterval({ start: dateRange.from, end: dateRange.to });
				weeks.forEach(week => {
					const key = format(week, 'yyyy-MM-dd');
					labels.push('W' + format(week, 'w'));
					dataPoints[key] = { income: 0, expense: 0 };
				});
				break;
			}
			
			default: {
				const months = eachMonthOfInterval({ start: dateRange.from, end: dateRange.to });
				months.forEach(month => {
					const key = format(month, 'yyyy-MM');
					labels.push(format(month, 'M') + '月');
					dataPoints[key] = { income: 0, expense: 0 };
				});
				break;
			}
		}

    filteredTransactions.forEach((transaction: Transaction) => {
      const date = new Date(transaction.date);
      const key = mode === 'year' 
        ? format(date, 'yyyy-MM')
        : format(date, 'yyyy-MM-dd');
      
      if (dataPoints[key]) {
        if (transaction.mode === 'income') {
          dataPoints[key].income += transaction.amount;
        } else if (transaction.mode === 'expense') {
          dataPoints[key].expense += transaction.amount;
        }
      }
    });

    const incomeData = Object.values(dataPoints).map(d => d.income);
    const expenseData = Object.values(dataPoints).map(d => d.expense);

    return {
      labels,
      datasets: [
        {
          data: incomeData,
          color: (opacity = 1) => `rgba(75, 192, 75, ${opacity})`, // 綠色收入
          strokeWidth: 2,
        },
        {
          data: expenseData,
          color: (opacity = 1) => `rgba(255, 99, 99, ${opacity})`, // 紅色支出
          strokeWidth: 2,
        }
      ],
      legend: ["收入", "支出"]
    };
  }, [filteredTransactions, dateRange, mode]);

  const CustomPieChart: React.FC<{ data: any[], title: string }> = ({ data, title }) => {
    if (data.length === 0) return null;
    
    return (
      <View className="bg-white rounded-xl p-4 shadow mb-4">
        <Text className="text-lg font-semibold mb-4">{title}</Text>
        <View className="flex-row justify-between">
          <View style={{ width: screenWidth * 0.45 }}>
            <PieChart
              data={data}
              width={screenWidth * 0.45}
              height={180}
              chartConfig={{
                color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
              }}
              accessor="amount"
              backgroundColor="transparent"
              paddingLeft="0"
              hasLegend={false}
              center={[screenWidth * 0.11, 0]}
              absolute
            />
          </View>
          <View className="flex-1 pl-4">
            <ScrollView style={{ maxHeight: 180 }}>
              {data.map((item, index) => (
                <View key={index} className="flex-row items-center mb-2">
                  <View 
                    style={{ 
                      width: 12, 
                      height: 12, 
                      backgroundColor: item.color,
                      borderRadius: 6,
                      marginRight: 8
                    }} 
                  />
                  <Text className="text-sm flex-1" numberOfLines={1}>{transactionTypes[item.name].label}</Text>
                  <Text className="text-right text-sm ml-2">
                    {item.amount.toLocaleString()}
                  </Text>
                </View>
              ))}
            </ScrollView>
          </View>
        </View>
      </View>
    );
  };

  const pieChartData = useMemo(() => {
    const processCategory = (transactions: Transaction[], mode: 'income' | 'expense'): any[] => {
      const categoryData: Record<string, number> = {};
      
      transactions
        .filter(t => t.mode === mode)
        .forEach(t => {
          categoryData[t.type] = (categoryData[t.type] || 0) + t.amount;
        });

      const colors = generateColor(Object.keys(categoryData).length);
      
      return Object.entries(categoryData)
        .sort(([, a], [, b]) => b - a)
        .map(([name, amount], index) => ({
          name,
          amount,
          color: colors[index],
          legendFontColor: '#7F7F7F',
          legendFontSize: 12,
        }));
    };

    return {
      income: processCategory(filteredTransactions, 'income'),
      expense: processCategory(filteredTransactions, 'expense')
    };
  }, [filteredTransactions]);

  return (
    <ScrollView className="flex-1 bg-gray-50">
      <View>
        <BarButtons
          buttons={intervalTypeButtons}
          value={mode}
          onChange={(value) => setMode(value as IntervalType)}
        />

        <IntervalDatePicker
          mode={mode}
          date={date}
          onChange={setDate}
        />

        <View className="bg-white rounded-xl p-6 shadow mb-4">
          <Text className="text-lg font-semibold mb-4">收支趨勢</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <LineChart
              data={lineChartData}
              width={chartWidth}
              height={220}
              yAxisLabel=""
              chartConfig={{
                backgroundColor: '#ffffff',
                backgroundGradientFrom: '#ffffff',
                backgroundGradientTo: '#ffffff',
                decimalPlaces: 0,
                color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                propsForLabels: {
                  fontSize: 8,
									
                },
                propsForDots: {
                  r: '2',
                  strokeWidth: '12',
                },
              }}
              bezier
              style={{
                marginVertical: 8,
                borderRadius: 16,
              }}
              fromZero
              yAxisSuffix=""
            />
          </ScrollView>
        </View>

        <CustomPieChart data={pieChartData.income} title="收入分類" />
        <CustomPieChart data={pieChartData.expense} title="支出分類" />
      </View>
    </ScrollView>
  );
};

export default StatisticsScreen;