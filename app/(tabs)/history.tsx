import { StyleSheet, Text, View, SafeAreaView, ScrollView, FlatList } from "react-native";
import { FontAwesome5 } from '@expo/vector-icons';

const historyData = [
  { date: '2024-05-20', day: 'Monday', medications: [
    { name: 'Metformin', time: '8:00 AM', status: 'taken' },
    { name: 'Lisinopril', time: '8:00 AM', status: 'taken' },
    { name: 'Atorvastatin', time: '8:00 PM', status: 'missed' },
  ]},
  { date: '2024-05-19', day: 'Sunday', medications: [
    { name: 'Metformin', time: '8:00 AM', status: 'taken' },
    { name: 'Lisinopril', time: '8:00 AM', status: 'taken' },
    { name: 'Atorvastatin', time: '8:00 PM', status: 'taken' },
  ]},
  // Add more daily data here
];

export default function HistoryScreen() {

    const renderItem = ({ item }) => (
        <View style={styles.dayContainer}>
            <Text style={styles.dateText}>{`${item.day}, ${item.date}`}</Text>
            {item.medications.map((med, index) => (
                <View key={index} style={styles.medicationCard}>
                    <FontAwesome5 name={med.status === 'taken' ? 'check-circle' : 'times-circle'} size={24} color={med.status === 'taken' ? '#22C55E' : '#EF4444'} />
                    <View style={styles.medicationInfo}>
                        <Text style={styles.medicationName}>{med.name}</Text>
                        <Text style={styles.medicationTime}>{med.time}</Text>
                    </View>
                    <Text style={[styles.statusText, {color: med.status === 'taken' ? '#22C55E' : '#EF4444'}]}>{med.status}</Text>
                </View>
            ))}
        </View>
    );

  return (
    <SafeAreaView style={styles.container}>
       <View style={styles.header}>
            <Text style={styles.headerTitle}>Medication History</Text>
        </View>
        <FlatList
            data={historyData}
            renderItem={renderItem}
            keyExtractor={item => item.date}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{paddingBottom: 20}}
        />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F0F4F8',
  },
  header: {
    backgroundColor: '#FFFFFF',
    paddingVertical: 20,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#1E293B',
  },
  dayContainer: {
      marginVertical: 10,
  },
  dateText: {
      fontSize: 18,
      fontWeight: 'bold',
      color: '#374151',
      paddingHorizontal: 20,
      marginBottom: 10,
  },
  medicationCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    padding: 15,
    marginHorizontal: 20,
    marginBottom: 10,
    flexDirection: 'row',
    alignItems: 'center',
    elevation: 2,
  },
  medicationInfo: {
      flex: 1,
      marginHorizontal: 15,
  },
  medicationName: {
      fontSize: 16,
      fontWeight: '600',
      color: '#111827',
  },
  medicationTime: {
      fontSize: 14,
      color: '#6B7280',
      marginTop: 2,
  },
  statusText: {
      fontSize: 14,
      fontWeight: 'bold',
      textTransform: 'capitalize',
  }
});
