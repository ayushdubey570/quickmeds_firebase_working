import { StyleSheet, Text, View, TextInput, TouchableOpacity, Switch, ScrollView, SafeAreaView } from "react-native";
import { FontAwesome5 } from '@expo/vector-icons';
import { useState } from 'react';
import { useRouter } from 'expo-router';

export default function AddMedicineScreen() {
  const router = useRouter();
  const [isVoiceReminderEnabled, setIsVoiceReminderEnabled] = useState(false);
  const toggleSwitch = () => setIsVoiceReminderEnabled(previousState => !previousState);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
            <TouchableOpacity onPress={() => router.back()}>
                <FontAwesome5 name="arrow-left" size={24} color="#1E293B" />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Add Medicine</Text>
            <View style={{width: 24}}/>
        </View>

        <View style={styles.form}>
          <Text style={styles.label}>Medicine Name</Text>
          <TextInput
            style={styles.input}
            placeholder="e.g., Paracetamol"
            placeholderTextColor="#94A3B8"
          />

          <Text style={styles.label}>Dosage</Text>
          <TextInput
            style={styles.input}
            placeholder="e.g., 500mg"
            placeholderTextColor="#94A3B8"
          />

          <Text style={styles.label}>Frequency</Text>
          <View style={styles.chipContainer}>
            <TouchableOpacity style={[styles.chip, styles.chipSelected]}>
              <Text style={styles.chipTextSelected}>Once a Day</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.chip}>
              <Text style={styles.chipText}>Twice a Day</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.chip}>
              <Text style={styles.chipText}>Custom</Text>
            </TouchableOpacity>
          </View>

          <Text style={styles.label}>Time</Text>
          <TouchableOpacity style={styles.timePicker}>
            <FontAwesome5 name="clock" size={20} color="#3B82F6" />
            <Text style={styles.timeText}>9:00 AM</Text>
          </TouchableOpacity>

          <View style={styles.durationContainer}>
            <View style={{flex: 1}}>
              <Text style={styles.label}>Start Date</Text>
              <TouchableOpacity style={styles.datePicker}>
                <Text style={styles.dateText}>Jan 1, 2024</Text>
              </TouchableOpacity>
            </View>
            <View style={{width: 20}}/>
            <View style={{flex: 1}}>
              <Text style={styles.label}>End Date</Text>
              <TouchableOpacity style={styles.datePicker}>
                <Text style={styles.dateText}>Jan 31, 2024</Text>
              </TouchableOpacity>
            </View>
          </View>

          <Text style={styles.label}>Optional Notes</Text>
          <TextInput
            style={[styles.input, {height: 100}]}
            placeholder="e.g., Take with food"
            placeholderTextColor="#94A3B8"
            multiline
          />

          <View style={styles.reminderToggle}>
            <Text style={styles.toggleLabel}>Enable Voice Reminder</Text>
            <Switch
              trackColor={{ false: "#767577", true: "#81b0ff" }}
              thumbColor={isVoiceReminderEnabled ? "#3B82F6" : "#f4f3f4"}
              ios_backgroundColor="#3e3e3e"
              onValueChange={toggleSwitch}
              value={isVoiceReminderEnabled}
            />
          </View>
        </View>

      </ScrollView>

      <TouchableOpacity style={styles.fab} onPress={() => router.push('/home')}>
        <FontAwesome5 name="check" size={24} color="#FFFFFF" />
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
    paddingBottom: 20,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#1E293B',
  },
  form: {
    paddingHorizontal: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '500',
    color: '#475569',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    padding: 15,
    fontSize: 16,
    color: '#1E293B',
    marginBottom: 20,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 1,
  },
  chipContainer: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  chip: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    paddingVertical: 10,
    paddingHorizontal: 20,
    marginRight: 10,
    elevation: 1,
  },
  chipSelected: {
    backgroundColor: '#3B82F6',
  },
  chipText: {
    color: '#3B82F6',
    fontWeight: '600',
  },
  chipTextSelected: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
  timePicker: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    padding: 15,
    marginBottom: 20,
  },
  timeText: {
    fontSize: 16,
    color: '#1E293B',
    marginLeft: 15,
  },
  durationContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  datePicker: {
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    padding: 15,
  },
  dateText: {
    fontSize: 16,
    color: '#1E293B',
  },
  reminderToggle: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    padding: 15,
    marginBottom: 20,
  },
  toggleLabel: {
    fontSize: 16,
    color: '#1E293B',
  },
  fab: {
    position: 'absolute',
    right: 30,
    bottom: 30,
    backgroundColor: '#22C55E', // Green for save
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
  },
});
