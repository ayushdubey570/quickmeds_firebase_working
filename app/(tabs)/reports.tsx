import { StyleSheet, Text, View, Dimensions, ScrollView, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { BarChart, PieChart } from "react-native-chart-kit";
import { Feather } from '@expo/vector-icons';
import Header from "@/components/Header";
import { getAdherenceData } from "../../lib/database";
import { useFocusEffect, useRouter } from "expo-router";
import React, { useState, useCallback } from "react";

const screenWidth = Dimensions.get("window").width;

const getIconForStatus = (status) => {
    switch (status) {
        case 'Taken':
            return 'check-circle';
        case 'Missed':
            return 'x-circle';
        case 'Pending':
            return 'clock';
        default:
            return 'help-circle';
    }
};

export default function ReportsScreen() {
  const [adherenceData, setAdherenceData] = useState(null);
  const router = useRouter();

  const loadAdherenceData = useCallback(() => {
    const data = getAdherenceData();
    setAdherenceData(data);
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadAdherenceData();
    }, [loadAdherenceData])
  );

  if (!adherenceData) {
    return <View style={styles.centered}><Text>Loading...</Text></View>;
  }

  const { pieChartData, weekly, monthly, overallAdherence, totalMedicines } = adherenceData;

  // Ensure specific colors for pie chart items
  const coloredPieChartData = pieChartData.map(item => {
      let color;
      switch(item.name) {
          case 'Taken': color = '#22C55E'; break;
          case 'Missed': color = '#EF4444'; break;
          case 'Pending': color = '#F59E0B'; break;
          default: color = '#64748B';
      }
      return {...item, color };
  });

  const weeklyChartData = {
    labels: weekly.labels,
    datasets: [
      {
        data: weekly.data,
      },
    ],
  };

  const monthlyChartData = {
    labels: monthly.labels,
    datasets: [
      {
        data: monthly.data,
      },
    ],
  };

  return (
    <SafeAreaView style={styles.container}>
        <Header title="Adherence Reports" />
        <ScrollView contentContainerStyle={{paddingBottom: 120}}>

            <View style={styles.summaryGrid}>
              <View style={[styles.summaryCard, {backgroundColor: '#E0F2FE'}]}>
                <Feather name="trending-up" size={28} color="#0284C7" />
                <Text style={styles.summaryValue}>{`${overallAdherence}%`}</Text>
                <Text style={styles.summaryLabel}>Overall Adherence</Text>
              </View>
              <TouchableOpacity style={[styles.summaryCard, {backgroundColor: '#E0E7FF'}]} onPress={() => router.push('/manage-medicines')}>
                <Feather name="check-circle" size={28} color="#4338CA" />
                <Text style={styles.summaryValue}>{totalMedicines}</Text>
                <Text style={styles.summaryLabel}>Total Medicines</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.chartCard}>
                <Text style={styles.cardTitle}>Adherence Breakdown</Text>
                <View style={styles.breakdownSection}>
                    <View style={styles.pieContainer}>
                        <PieChart
                            data={coloredPieChartData}
                            width={screenWidth * 0.45}
                            height={160}
                            chartConfig={chartConfig}
                            accessor={"count"}
                            backgroundColor={"transparent"}
                            paddingLeft={"0"}
                            center={[screenWidth * 0.1, 0]}
                            absolute
                            hasLegend={false}
                        />
                    </View>
                    <View style={styles.breakdownContainer}>
                        {coloredPieChartData.map((item, index) => (
                        <View key={index} style={styles.breakdownItem}>
                            <Feather name={getIconForStatus(item.name)} size={20} color={item.color} />
                            <Text style={[styles.breakdownLabel, { color: item.color }]}>{item.name}</Text>
                            <Text style={styles.breakdownCount}>{item.count}</Text>
                        </View>
                        ))}
                    </View>
                </View>
            </View>

            <View style={styles.chartCard}>
                <Text style={styles.cardTitle}>Last 7 Days</Text>
                <BarChart
                    data={weeklyChartData}
                    width={screenWidth - 50}
                    height={220}
                    chartConfig={barChartConfig}
                    style={styles.chart}
                    fromZero
                    showValuesOnTopOfBars
                />
            </View>

            <View style={styles.chartCard}>
                <Text style={styles.cardTitle}>Monthly Adherence</Text>
                <BarChart
                    data={monthlyChartData}
                    width={screenWidth - 50}
                    height={220}
                    chartConfig={barChartConfig}
                    style={styles.chart}
                    fromZero
                    showValuesOnTopOfBars
                />
            </View>

        </ScrollView>
    </SafeAreaView>
  );
}

const chartConfig = {
    color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
};

const barChartConfig = {
    backgroundGradientFrom: "#FFFFFF",
    backgroundGradientTo: "#FFFFFF",
    color: (opacity = 1) => `rgba(76, 102, 159, ${opacity})`,
    strokeWidth: 2,
    barPercentage: 0.8,
    useShadows: false,
    decimalPlaces: 0,
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  summaryGrid: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginHorizontal: 20,
    marginTop: 20,
  },
  summaryCard: {
    borderRadius: 15,
    padding: 20,
    alignItems: 'center',
    width: '48%',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4
  },
  summaryValue: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1E293B',
    marginVertical: 8,
  },
  summaryLabel: {
      fontSize: 14,
      color: '#64748B',
      fontWeight: '500'
  },
  chartCard: {
      backgroundColor: '#FFFFFF',
      borderRadius: 20,
      margin: 20,
      padding: 15,
      alignItems: 'center',
      elevation: 4,
      shadowColor: '#000',
      shadowOffset: {width: 0, height: 4},
      shadowOpacity: 0.1,
      shadowRadius: 8
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#334155',
    marginBottom: 15,
    alignSelf: 'flex-start'
  },
  chart: {
      borderRadius: 16,
  },
  breakdownSection: {
    flexDirection: 'row',
    width: '100%',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  pieContainer: {
    flex: 4.5,
  },
  breakdownContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  breakdownItem: {
      flexDirection: 'row',
      alignItems: 'center',
      marginVertical: 8,
  },
  breakdownLabel: {
      fontSize: 16,
      fontWeight: 'bold',
      marginLeft: 10,
      flex: 1,
  },
  breakdownCount: {
      fontSize: 16,
      fontWeight: 'bold',
      color: '#334155',
      minWidth: 30,
      textAlign: 'right',
  },
});
