import { StyleSheet, Text, View, SafeAreaView, ScrollView } from "react-native";
import { FontAwesome5 } from '@expo/vector-icons';

const historyData = [
  { day: 'Mon', total: 6, taken: 6, missed: 0 },
  { day: 'Tue', total: 6, taken: 5, missed: 1 },
  { day: 'Wed', total: 6, taken: 6, missed: 0 },
  { day: 'Thu', total: 6, taken: 4, missed: 2 },
  { day: 'Fri', total: 6, taken: 6, missed: 0 },
  { day: 'Sat', total: 6, taken: 5, missed: 1 },
  { day: 'Sun', total: 6, taken: 6, missed: 0 },
];

export default function HistoryScreen() {
  return (
    <SafeAreaView style={styles.container}>
       <View style={styles.header}>
            <Text style={styles.headerTitle}>7-Day History</Text>
        </View>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.gridContainer}>
          {historyData.map((item, index) => (
            <View key={index} style={styles.dayCard}>
              <Text style={styles.dayText}>{item.day}</Text>
              <View style={styles.statusContainer}>
                <View style={styles.statusItem}>
                    <FontAwesome5 name="check-circle" size={20} color="#22C55E" />
                    <Text style={styles.statusText}>{item.taken}</Text>
                </View>
                <View style={styles.statusItem}>
                    <FontAwesome5 name="times-circle" size={20} color="#EF4444" />
                    <Text style={styles.statusText}>{item.missed}</Text>
                </View>
              </View>
              <Text style={styles.totalText}>Total: {item.total}</Text>
            </View>
          ))}
        </View>
      </ScrollView>
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
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    padding: 10,
  },
  dayCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 15,
    padding: 15,
    margin: 10,
    width: '40%',
    alignItems: 'center',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  dayText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1E3A8A',
    marginBottom: 15,
  },
  statusContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginBottom: 15,
  },
  statusItem: {
    alignItems: 'center',
  },
  statusText: {
      fontSize: 16,
      fontWeight: '600',
      color: '#475569',
      marginTop: 5,
  },
  totalText: {
      fontSize: 14,
      color: '#6B7280',
  }
});
