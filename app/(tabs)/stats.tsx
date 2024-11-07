// StatisticsScreen.tsx
import React, { useState, useMemo } from 'react';
import { 
  View, 
  Text, 
  TouchableOpacity, 
  ScrollView, 
  StyleSheet,
  Dimensions
} from 'react-native';
import { useSelector } from 'react-redux';
import { 
  format, 
  eachDayOfInterval,
  eachWeekOfInterval,
  eachMonthOfInterval,
  startOfWeek,
  endOfWeek,
  startOfMonth,
  endOfMonth,
  startOfYear,
  endOfYear,
  addWeeks,
  addMonths,
  addYears,
  subWeeks,
  subMonths,
  subYears
} from 'date-fns';
import { zhTW } from 'date-fns/locale';
import { LineChart, PieChart } from 'react-native-chart-kit';
import { BarButtons } from '@/components/BarButton';

const screenWidth = Dimensions.get('window').width;

interface Transaction {
  id: string;
  date: string;
  amount: number;
  mode: 'income' | 'expense';
  type: string;
}

interface DateRange {
  from: Date;
  to: Date;
}

type RangeType = 'week' | 'month' | 'year';

interface ChartData {
  labels: string[];
  datasets: {
    data: number[];
    color?: (opacity: number) => string;
    strokeWidth?: number;
  }[];
}

interface PieChartData {
  name: string;
  amount: number;
  color: string;
  legendFontColor: string;
}

const COLORS: string[] = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

const StatisticsScreen: React.FC = () => {
  const [dateRange, setDateRange] = useState<DateRange>({
    from: startOfMonth(new Date()),
    to: endOfMonth(new Date())
  });
  
  const [selectedRange, setSelectedRange] = useState<RangeType>('month');
  
  const transactions = useSelector((state: any) => state.transactions.transactions);

  // 過濾交易數據
  const filteredTransactions = useMemo(() => {
    return transactions.filter((transaction: Transaction) => {
      const date = new Date(transaction.date);
      return date >= dateRange.from && date <= dateRange.to;
    });
  }, [transactions, dateRange]);

  // 生成時間區間的標題
  const rangeTitle = useMemo(() => {
    switch (selectedRange) {
      case 'week':
        return format(dateRange.from, 'M月d日', { locale: zhTW }) + 
               ' - ' + 
               format(dateRange.to, 'M月d日', { locale: zhTW });
      case 'month':
        return format(dateRange.from, 'yyyy年M月', { locale: zhTW });
      case 'year':
        return format(dateRange.from, 'yyyy年', { locale: zhTW });
    }
  }, [dateRange, selectedRange]);

  // 生成時間軸標籤
  const generateTimeLabels = (start: Date, end: Date, rangeType: RangeType): Date[] => {
    switch (rangeType) {
      case 'week':
        return eachDayOfInterval({ start, end });
      case 'month':
        return eachWeekOfInterval(
          { start: startOfMonth(start), end: endOfMonth(end) },
          { weekStartsOn: 1 }
        );
      case 'year':
        return eachMonthOfInterval({ start: startOfYear(start), end: endOfYear(end) });
    }
  };

  // 格式化時間軸標籤
  const formatTimeLabel = (date: Date, rangeType: RangeType): string => {
    switch (rangeType) {
      case 'week':
        return format(date, 'd', { locale: zhTW });
      case 'month':
        return format(date, 'wo', { locale: zhTW }).replace('週', '');
      case 'year':
        return format(date, 'M', { locale: zhTW });
    }
  };

  // 生成折線圖數據
  const lineChartData = useMemo<ChartData>(() => {
    const timeLabels = generateTimeLabels(dateRange.from, dateRange.to, selectedRange);
    const dataMap: Record<string, { income: number; expense: number }> = {};
    
    // 初始化所有時間點的數據
    timeLabels.forEach(date => {
      const key = format(date, 'yyyy-MM-dd');
      dataMap[key] = { income: 0, expense: 0 };
    });

    // 將交易數據填入對應的時間點
    filteredTransactions.forEach((transaction: Transaction) => {
      const date = new Date(transaction.date);
      let key = format(date, 'yyyy-MM-dd');
      
      if (selectedRange === 'month') {
        key = format(startOfWeek(date, { weekStartsOn: 1 }), 'yyyy-MM-dd');
      } else if (selectedRange === 'year') {
        key = format(startOfMonth(date), 'yyyy-MM-dd');
      }

      if (dataMap[key]) {
        if (transaction.mode === 'income') {
          dataMap[key].income += transaction.amount;
        } else {
          dataMap[key].expense += transaction.amount;
        }
      }
    });

    const labels = timeLabels.map(date => formatTimeLabel(date, selectedRange));
    const incomeData = timeLabels.map(date => 
      dataMap[format(date, 'yyyy-MM-dd')]?.income || 0
    );
    const expenseData = timeLabels.map(date => 
      dataMap[format(date, 'yyyy-MM-dd')]?.expense || 0
    );

    return {
      labels,
      datasets: [
        {
          data: incomeData,
          color: (opacity = 1) => `rgba(76, 175, 80, ${opacity})`,
          strokeWidth: 2
        },
        {
          data: expenseData,
          color: (opacity = 1) => `rgba(244, 67, 54, ${opacity})`,
          strokeWidth: 2
        }
      ]
    };
  }, [filteredTransactions, selectedRange, dateRange]);

  // 生成餅圖數據
  const pieChartData = useMemo(() => {
    const incomeByCategory: Record<string, number> = {};
    const expenseByCategory: Record<string, number> = {};

    filteredTransactions.forEach((transaction: Transaction) => {
      const target = transaction.mode === 'income' ? incomeByCategory : expenseByCategory;
      if (!target[transaction.type]) {
        target[transaction.type] = 0;
      }
      target[transaction.type] += transaction.amount;
    });

    const formatPieData = (data: Record<string, number>): PieChartData[] => {
      return Object.entries(data).map(([name, amount], index) => ({
        name: name.length > 4 ? name.substring(0, 4) + '...' : name,
        amount,
        color: COLORS[index % COLORS.length],
        legendFontColor: '#7F7F7F'
      }));
    };

    return {
      income: formatPieData(incomeByCategory),
      expense: formatPieData(expenseByCategory)
    };
  }, [filteredTransactions]);

  // 處理時間範圍選擇
  const handleRangeSelect = (range: RangeType): void => {
    setSelectedRange(range);
    const today = new Date();
    
    switch (range) {
      case 'week':
        setDateRange({
          from: startOfWeek(today, { weekStartsOn: 1 }),
          to: endOfWeek(today, { weekStartsOn: 1 })
        });
        break;
      case 'month':
        setDateRange({
          from: startOfMonth(today),
          to: endOfMonth(today)
        });
        break;
      case 'year':
        setDateRange({
          from: startOfYear(today),
          to: endOfYear(today)
        });
        break;
    }
  };

  // 處理時間範圍導航
  const handleNavigate = (direction: 'prev' | 'next') => {
    const { from, to } = dateRange;
    let newFrom: Date, newTo: Date;

    switch (selectedRange) {
      case 'week':
        if (direction === 'prev') {
          newFrom = subWeeks(from, 1);
          newTo = endOfWeek(subWeeks(to, 1), { weekStartsOn: 1 });
        } else {
          newFrom = addWeeks(from, 1);
          newTo = endOfWeek(addWeeks(to, 1), { weekStartsOn: 1 });
        }
        break;
      case 'month':
        if (direction === 'prev') {
          newFrom = startOfMonth(subMonths(from, 1));
          newTo = endOfMonth(subMonths(to, 1));
        } else {
          newFrom = startOfMonth(addMonths(from, 1));
          newTo = endOfMonth(addMonths(to, 1));
        }
        break;
      case 'year':
        if (direction === 'prev') {
          newFrom = startOfYear(subYears(from, 1));
          newTo = endOfYear(subYears(to, 1));
        } else {
          newFrom = startOfYear(addYears(from, 1));
          newTo = endOfYear(addYears(to, 1));
        }
        break;
    }

    setDateRange({ from: newFrom, to: newTo });
  };

  const chartConfig = {
    backgroundColor: '#ffffff',
    backgroundGradientFrom: '#ffffff',
    backgroundGradientTo: '#ffffff',
    decimalPlaces: 0,
    color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
    style: {
      borderRadius: 16
    },
    propsForLabels: {
      fontSize: 12
    }
  };

  const RangeButton: React.FC<{
    range: RangeType;
    label: string;
  }> = ({ range, label }) => (
    <TouchableOpacity
      style={[
        styles.rangeButton,
        selectedRange === range && styles.rangeButtonActive
      ]}
      onPress={() => handleRangeSelect(range)}
    >
      <Text style={[
        styles.rangeButtonText,
        selectedRange === range && styles.rangeButtonTextActive
      ]}>
        {label}
      </Text>
    </TouchableOpacity>
  );

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.rangeButtons}>
          <RangeButton range="week" label="週" />
          <RangeButton range="month" label="月" />
          <RangeButton range="year" label="年" />
        </View>
        
        <View style={styles.navigationHeader}>
          <TouchableOpacity 
            style={styles.navigationButton}
            onPress={() => handleNavigate('prev')}
          >
            <Text style={styles.navigationButtonText}>{'<'}</Text>
          </TouchableOpacity>
          
          <Text style={styles.rangeTitle}>{rangeTitle}</Text>
          
          <TouchableOpacity 
            style={styles.navigationButton}
            onPress={() => handleNavigate('next')}
          >
            <Text style={styles.navigationButtonText}>{'>'}</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>收支趨勢</Text>
        <LineChart
          data={lineChartData}
          width={screenWidth - 32}
          height={220}
          chartConfig={chartConfig}
          style={styles.chart}
          withDots={false}
        />
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>收入分類</Text>
        <PieChart
          data={pieChartData.income}
          width={screenWidth - 32}
          height={220}
          chartConfig={chartConfig}
          accessor="amount"
          backgroundColor="transparent"
          paddingLeft="15"
          absolute
        />
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>支出分類</Text>
        <PieChart
          data={pieChartData.expense}
          width={screenWidth - 32}
          height={220}
          chartConfig={chartConfig}
          accessor="amount"
          backgroundColor="transparent"
          paddingLeft="15"
          absolute
        />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    padding: 16,
  },
  rangeButtons: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 16,
  },
  rangeButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    backgroundColor: '#e0e0e0',
    marginHorizontal: 4,
  },
  rangeButtonActive: {
    backgroundColor: '#2196F3',
  },
  rangeButtonText: {
    color: '#000000',
  },
  rangeButtonTextActive: {
    color: '#ffffff',
  },
  navigationHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
  },
  navigationButton: {
    padding: 8,
    width: 40,
    alignItems: 'center',
  },
  navigationButtonText: {
    fontSize: 18,
    color: '#2196F3',
  },
  rangeTitle: {
    fontSize: 16,
    fontWeight: '500',
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    marginHorizontal: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
  },
  chart: {
    marginVertical: 8,
    borderRadius: 16,
  }
});

export default StatisticsScreen;