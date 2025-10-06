import { StyleSheet, Text, View, SafeAreaView, Dimensions, ScrollView } from "react-native";
import { LineChart } from "react-native-chart-kit";
import { FontAwesome5 } from '@expo/vector-icons';

const screenWidth = Dimensions.get("window").width;

const chartData = {
  labels: ["Jan", "Feb", "Mar", "Apr", "May"],
  datasets: [
    {
      data: [75, 88, 92, 85, 95],
      color: (opacity = 1) => `rgba(13, 110, 253, ${opacity})`, // optional
      strokeWidth: 2 // optional
    },
  ],
  legend: ["Adherence Rate"]
};

export default function ReportsScreen() {

  return (
    <SafeAreaView style={styles.container}>
        <View style={styles.header}>
            <Text style={styles.headerTitle}>Adherence Reports</Text>
        </View>
        <ScrollView>

            <View style={styles.chartCard}>
                <Text style={styles.cardTitle}>Monthly Adherence</Text>
                <LineChart
                    data={chartData}
                    width={screenWidth - 50}
                    height={220}
                    chartConfig={chartConfig}
                    bezier
                    style={styles.chart}
                />
            </View>

            <View style={styles.summarySection}>
                <Text style={styles.sectionTitle}>Adherence Summary</Text>
                <View style={styles.summaryBox}>
                    <View style={styles.summaryItem}>
                        <FontAwesome5 name="check-circle" size={24} color="#28A745" />
                        <Text style={styles.summaryValue}>92%</Text>
                        <Text style={styles.summaryLabel}>Overall Adherence</Text>
                    </View>
                    <View style={styles.summaryItem}>
                        <FontAwesome5 name="pills" size={24} color="#17A2B8" />
                        <Text style={styles.summaryValue}>15</Text>
                        <Text style={styles.summaryLabel}>Medications</Text>
                    </View>
                </View>
            </View>

        </ScrollView>
    </SafeAreaView>
  );
}

const chartConfig = {
    backgroundGradientFrom: "#FFFFFF",
    backgroundGradientTo: "#FFFFFF",
    color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
    strokeWidth: 2, // optional, default 3
    barPercentage: 0.5,
    useShadows: true,
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F4F6F8',
  },
  header: {
    backgroundColor: '#FFFFFF',
    padding: 20,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0'
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
  },
  chartCard: {
      backgroundColor: '#FFFFFF',
      borderRadius: 20,
      margin: 20,
      padding: 15,
      alignItems: 'center',
      elevation: 4,
      shadowColor: '#000',
      shadowOffset: {width: 0, height: 2},
      shadowOpacity: 0.1,
      shadowRadius: 4
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 10,
  },
  chart: {
      borderRadius: 16,
  },
  summarySection: {
      paddingHorizontal: 20,
  },
  sectionTitle: {
      fontSize: 20,
      fontWeight: 'bold',
      color: '#333',
      marginBottom: 15,
  },
  summaryBox: {
      flexDirection: 'row',
      justifyContent: 'space-between',
  },
  summaryItem: {
      backgroundColor: '#FFFFFF',
      borderRadius: 15,
      padding: 20,
      width: '48%',
      alignItems: 'center',
      elevation: 3,
      shadowColor: '#000',
      shadowOffset: {width: 0, height: 1},
      shadowOpacity: 0.1,
      shadowRadius: 2
  },
  summaryValue: {
      fontSize: 26,
      fontWeight: 'bold',
      color: '#007BFF',
      marginVertical: 8,
  },
  summaryLabel: {
      fontSize: 14,
      color: '#6C757D',
  }
});
