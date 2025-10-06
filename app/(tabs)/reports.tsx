import { StyleSheet, Text, View, SafeAreaView, Dimensions, ScrollView } from "react-native";
import { LineChart } from "react-native-chart-kit";
import { FontAwesome5 } from '@expo/vector-icons';
import Header from "@/components/Header";

const screenWidth = Dimensions.get("window").width;

const chartData = {
  labels: ["Jan", "Feb", "Mar", "Apr", "May"],
  datasets: [
    {
      data: [75, 88, 92, 85, 95],
      color: (opacity = 1) => `rgba(76, 102, 159, ${opacity})`, // optional
      strokeWidth: 3 // optional
    },
  ],
  legend: ["Adherence Rate"]
};

export default function ReportsScreen() {

  return (
    <SafeAreaView style={styles.container}>
        <Header title="Adherence Reports" />
        <ScrollView contentContainerStyle={{paddingBottom: 20}}>

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
                        <FontAwesome5 name="check-circle" size={30} color="#4CAF50" />
                        <Text style={styles.summaryValue}>92%</Text>
                        <Text style={styles.summaryLabel}>Overall Adherence</Text>
                    </View>
                    <View style={styles.summaryItem}>
                        <FontAwesome5 name="pills" size={30} color="#2196F3" />
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
    useShadows: false,
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
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
    color: '#333',
    marginBottom: 10,
  },
  chart: {
      borderRadius: 16,
  },
  summarySection: {
      paddingHorizontal: 20,
      paddingTop: 10
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
      shadowOffset: {width: 0, height: 2},
      shadowOpacity: 0.08,
      shadowRadius: 4
  },
  summaryValue: {
      fontSize: 28,
      fontWeight: 'bold',
      color: '#4c669f',
      marginVertical: 8,
  },
  summaryLabel: {
      fontSize: 14,
      color: '#6C757D',
      fontWeight: '500'
  }
});
