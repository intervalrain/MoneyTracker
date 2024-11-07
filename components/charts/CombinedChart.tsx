import React from 'react';
import { View } from 'react-native';
import { BarChart, LineChart } from 'react-native-chart-kit';
import { Path } from 'react-native-svg';

interface CombinedChartProps {
  data: {
    labels: string[];
    income: number[];
    expense: number[];
    balance: number[];
  };
  width: number;
  height: number;
}

export const CombinedChart: React.FC<CombinedChartProps> = ({
  data,
  width,
  height,
}) => {
  const chartConfig = {
    backgroundColor: '#ffffff',
    backgroundGradientFrom: '#ffffff',
    backgroundGradientTo: '#ffffff',
    decimalPlaces: 0,
    color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
    labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
    style: {
      borderRadius: 16,
    },
    propsForLabels: {
      fontSize: 12,
    },
    barPercentage: 0.7,
  };

  const chartData = {
    labels: data.labels,
    datasets: [
      {
        data: data.income,
        color: (opacity = 1) => `rgba(76, 175, 80, ${opacity})`, // 綠色，收入
        strokeWidth: 2,
      },
      {
        data: data.expense,
        color: (opacity = 1) => `rgba(244, 67, 54, ${opacity})`, // 紅色，支出
        strokeWidth: 2,
      },
      {
        data: data.balance,
        color: (opacity = 1) => `rgba(33, 150, 243, ${opacity})`, // 藍色，餘額
        strokeWidth: 2,
      },
    ],
  };

  return (
    <View>
      <BarChart
        data={chartData}
        width={width}
        height={height}
        chartConfig={chartConfig}
        style={{
          borderRadius: 16,
          paddingRight: 0,
        }}
        showBarTops={false}
        fromZero
        withInnerLines={true}
        withCustomBarColorFromData={true}
        flatColor={true}
        yAxisLabel=""
        yAxisSuffix=""
      />
      <LineChart
        data={{
          labels: data.labels,
          datasets: [{
            data: data.balance,
            color: (opacity = 1) => `rgba(33, 150, 243, ${opacity})`,
            strokeWidth: 2,
          }],
        }}
        width={width}
        height={height}
        chartConfig={chartConfig}
        style={{
          position: 'absolute',
          top: 0,
        }}
        withDots={false}
        withInnerLines={false}
        withOuterLines={false}
        withHorizontalLabels={false}
        withVerticalLabels={false}
        withShadow={false}
      />
    </View>
  );
};