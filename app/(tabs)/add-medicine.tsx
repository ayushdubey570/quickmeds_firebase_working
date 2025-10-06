import { useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, ScrollView, SafeAreaView } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import Header from '@/components/Header';

const daysOfWeek = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

export default function AddMedicineScreen() {
  const router = useRouter();
  const [medicineName, setMedicineName] = useState('');
  const [dosage, setDosage] = useState('');
  const [times, setTimes] = useState(['08:00']);
  const [frequency, setFrequency] = useState('Daily');
  const [selectedDays, setSelectedDays] = useState([]);

  const handleDaySelect = (dayIndex) => {
    if (selectedDays.includes(dayIndex)) {
      setSelectedDays(selectedDays.filter((i) => i !== dayIndex));
    } else {
      setSelectedDays([...selectedDays, dayIndex]);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
        <Header title="Add New Medicine" />
        <ScrollView>
            <View style={styles.form}>
                <View style={styles.inputGroup}>
                <Text style={styles.label}>Medicine Name</Text>
                <TextInput
                    style={styles.input}
                    value={medicineName}
                    onChangeText={setMedicineName}
                    placeholder="e.g., Paracetamol"
                />
                </View>

                <View style={styles.inputGroup}>
                <Text style={styles.label}>Dosage</Text>
                <TextInput
                    style={styles.input}
                    value={dosage}
                    onChangeText={setDosage}
                    placeholder="e.g., 500mg"
                />
                </View>

                <View style={styles.inputGroup}>
                <Text style={styles.label}>Time</Text>
                {times.map((time, index) => (
                    <View key={index} style={styles.timeInputContainer}>
                    <Text style={styles.timeText}>{time}</Text>
                    <TouchableOpacity onPress={() => { /* Handle time removal */ }}>
                        <Feather name="x" size={20} color="#64748B" />
                    </TouchableOpacity>
                    </View>
                ))}
                <TouchableOpacity style={styles.addTimeButton}>
                    <Feather name="plus" size={20} color="#4c669f" />
                    <Text style={styles.addTimeText}>Add Time</Text>
                </TouchableOpacity>
                </View>

                <View style={styles.inputGroup}>
                    <Text style={styles.label}>Frequency</Text>
                    <View style={styles.frequencyButtons}>
                        <TouchableOpacity 
                            style={[styles.frequencyButton, frequency === 'Daily' && styles.freqButtonActive]} 
                            onPress={() => setFrequency('Daily')}>
                            <Text style={[styles.frequencyButtonText, frequency === 'Daily' && styles.freqButtonTextActive]}>Daily</Text>
                        </TouchableOpacity>
                        <TouchableOpacity 
                            style={[styles.frequencyButton, frequency === 'Custom' && styles.freqButtonActive]} 
                            onPress={() => setFrequency('Custom')}>
                            <Text style={[styles.frequencyButtonText, frequency === 'Custom' && styles.freqButtonTextActive]}>Custom</Text>
                        </TouchableOpacity>
                    </View>
                </View>

                {frequency === 'Custom' && (
                    <View style={styles.daysContainer}>
                    {daysOfWeek.map((day, index) => (
                        <TouchableOpacity
                        key={index}
                        style={[styles.dayButton, selectedDays.includes(index) && styles.dayButtonActive]}
                        onPress={() => handleDaySelect(index)}
                        >
                        <Text style={[styles.dayText, selectedDays.includes(index) && styles.dayTextActive]}>{day}</Text>
                        </TouchableOpacity>
                    ))}
                    </View>
                )}

                <TouchableOpacity style={styles.saveButton}>
                <Text style={styles.saveButtonText}>Save Medication</Text>
                </TouchableOpacity>
            </View>
        </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F8F9FA',
    },
    form: {
        padding: 20,
    },
    inputGroup: {
        marginBottom: 25,
    },
    label: {
        fontSize: 16,
        fontWeight: '600',
        color: '#334155',
        marginBottom: 10,
    },
    input: {
        backgroundColor: '#FFFFFF',
        borderRadius: 10,
        padding: 15,
        fontSize: 16,
        color: '#1E293B',
        borderWidth: 1,
        borderColor: '#E2E8F0',
    },
    timeInputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: '#FFFFFF',
        borderRadius: 10,
        padding: 15,
        marginBottom: 10,
    },
    timeText: {
        fontSize: 16,
        color: '#1E293B',
    },
    addTimeButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 15,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: '#4c669f',
        borderStyle: 'dashed',
    },
    addTimeText: {
        fontSize: 16,
        color: '#4c669f',
        marginLeft: 10,
        fontWeight: '600',
    },
    frequencyButtons: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 10,
    },
    frequencyButton: {
        flex: 1,
        padding: 15,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: '#E2E8F0',
        alignItems: 'center',
    },
    freqButtonActive: {
        backgroundColor: '#4c669f',
        borderColor: '#4c669f',
    },
    frequencyButtonText: {
        fontSize: 16,
        fontWeight: '600',
        color: '#334155',
    },
    freqButtonTextActive: {
        color: '#FFFFFF',
    },
    daysContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 10,
    },
    dayButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#E2E8F0',
    },
    dayButtonActive: {
        backgroundColor: '#4c669f',
        borderColor: '#4c669f',
    },
    dayText: {
        fontSize: 16,
        fontWeight: '600',
        color: '#334155',
    },
    dayTextActive: {
        color: '#FFFFFF',
    },
    saveButton: {
        backgroundColor: '#4c669f',
        borderRadius: 15,
        padding: 20,
        alignItems: 'center',
        marginTop: 30,
    },
    saveButtonText: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#FFFFFF',
    },
});
