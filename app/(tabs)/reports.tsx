import { StyleSheet, Text, View, SafeAreaView, Dimensions } from "react-native";
import { BarChart } from "react-native-chart-kit";

const screenWidth = Dimensions.get("window").width;

const chartData = {
  labels: ["Week 1", "Week 2", "Week 3", "Week 4"],
  datasets: [
    {
      data: [85, 92, 78, 95],
    },
  ],
};

export default function ReportsScreen() {

  return (
    <SafeAreaView style={styles.container}>
        <View style={styles.header}>
            <Text style={styles.headerTitle}>Monthly Reports</Text>
        </View>

        <View style={styles.chartContainer}>
            <Text style={styles.chartTitle}>Compliance Rate (%)</Text>
            <BarChart
                data={chartData}
                width={screenWidth - 40}
                height={220}
                yAxisLabel=""
                yAxisSuffix="%"
                chartConfig={{
                    backgroundColor: "#FFFFFF",
                    backgroundGradientFrom: "#FFFFFF",
                    backgroundGradientTo: "#FFFFFF",
                    decimalPlaces: 0,
                    color: (opacity = 1) => `rgba(59, 130, 246, ${opacity})`,
                    labelColor: (opacity = 1) => `rgba(29, 41, 59, ${opacity})`,
                    style: {
                        borderRadius: 16,
                    },
                    propsForDots: {
                        r: "6",
                        strokeWidth: "2",
                        stroke: "#3B82F6",
                    },
                }}
                style={{
                    marginVertical: 8,
                    borderRadius: 16,
                }}
            />
        </View>

        <View style={styles.statsContainer}>
            <View style={styles.statCard}>
                <Text style={styles.statLabel}>Total Taken</Text>
                <Text style={styles.statValue}>124</Text>
            </View>
            <View style={styles.statCard}>
                <Text style={styles.statLabel}>Total Missed</Text>
                <Text style={styles.statValue}>12</Text>
            </View>
        </View>

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F0F4F8',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 20,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#1E293B',
  },
  chartContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    marginHorizontal: 20,
    alignItems: 'center',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  chartTitle: {
      fontSize: 18,
      fontWeight: '600',
      color: '#1E293B',
      marginBottom: 10,
  },
  statsContainer: {
      flexDirection: 'row',
      justifyContent: 'space-around',
      marginTop: 30,
      marginHorizontal: 20,
  },
  statCard: {
      backgroundColor: '#FFFFFF',
      borderRadius: 16,
      padding: 20,
      width: '45%',
      alignItems: 'center',
      elevation: 3,
  },
  statLabel: {
      fontSize: 16,
      color: '#475569',
      fontWeight: '500',
  },
  statValue: {
      fontSize: 28,
      fontWeight: 'bold',
      color: '#3B82F6',
      marginTop: 8,
  }
});
