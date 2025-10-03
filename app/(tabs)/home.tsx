import { StyleSheet, Text, View, Image, TouchableOpacity, ScrollView, SafeAreaView } from "react-native";
import { FontAwesome5 } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

const medications = [
  {
    name: "Metformin",
    dosage: "500mg",
    time: "8:00 AM",
    status: "taken",
  },
  {
    name: "Lisinopril",
    dosage: "10mg",
    time: "8:00 AM",
    status: "taken",
  },
  {
    name: "Atorvastatin",
    dosage: "20mg",
    time: "8:00 PM",
    status: "pending",
  },
  {
    name: "Amlodipine",
    dosage: "5mg",
    time: "8:00 PM",
    status: "missed",
  },
];

export default function HomeScreen() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Dashboard</Text>
          <TouchableOpacity onPress={() => router.push('/settings')}>
            <Image
              source={{ uri: "https://i.imgur.com/8i2j8zL.png" }} // Placeholder image
              style={styles.profilePic}
            />
          </TouchableOpacity>
        </View>

        <TouchableOpacity onPress={() => router.push('/reports')}>
            <View style={styles.summaryCard}>
            <Text style={styles.summaryText}>Today's Progress</Text>
            <Text style={styles.summaryValue}>2 / 4 Taken</Text>
            <View style={styles.progressBar}>
                <View style={styles.progress} />
            </View>
            </View>
        </TouchableOpacity>

        <View style={styles.medicationSection}>
          <Text style={styles.sectionTitle}>Today's Medicines</Text>
          <TouchableOpacity onPress={() => router.push('/history')}>
            <Text style={styles.seeAll}>See All</Text>
          </TouchableOpacity>
        </View>

        {medications.map((med, index) => (
          <View key={index} style={styles.medicationCard}>
            <FontAwesome5 name={med.status === 'taken' ? 'check-circle' : med.status === 'missed' ? 'times-circle' : 'clock'} size={24} color={med.status === 'taken' ? '#22C55E' : med.status === 'missed' ? '#EF4444' : '#F59E0B'} />
            <View style={styles.medicationInfo}>
              <Text style={styles.medicationName}>{med.name}</Text>
              <Text style={styles.medicationDosage}>{med.dosage}</Text>
            </View>
            <Text style={styles.medicationTime}>{med.time}</Text>
          </View>
        ))}

      </ScrollView>

      <TouchableOpacity style={styles.fab} onPress={() => router.push('/add-medicine')}>
        <FontAwesome5 name="plus" size={24} color="#FFFFFF" />
      </TouchableOpacity>

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
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 10,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1E293B',
  },
  profilePic: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  summaryCard: {
    backgroundColor: '#3B82F6',
    borderRadius: 20,
    padding: 20,
    marginHorizontal: 20,
    marginTop: 10,
  },
  summaryText: {
    color: '#FFFFFF',
    fontSize: 16,
  },
  summaryValue: {
    color: '#FFFFFF',
    fontSize: 32,
    fontWeight: 'bold',
    marginTop: 5,
  },
  progressBar: {
    height: 6,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: 3,
    marginTop: 15,
  },
  progress: {
    width: '50%',
    height: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: 3,
  },
  medicationSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginTop: 30,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1E293B',
  },
  seeAll: {
    color: '#3B82F6',
    fontSize: 16,
  },
  medicationCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 15,
    padding: 15,
    marginHorizontal: 20,
    marginTop: 15,
    flexDirection: 'row',
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  medicationInfo: {
    flex: 1,
    marginLeft: 15,
  },
  medicationName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1E293B',
  },
  medicationDosage: {
    fontSize: 14,
    color: '#64748B',
    marginTop: 2,
  },
  medicationTime: {
    fontSize: 16,
    fontWeight: '500',
    color: '#1E293B',
  },
  fab: {
    position: 'absolute',
    right: 30,
    bottom: 30,
    backgroundColor: '#3B82F6',
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
  },
});
