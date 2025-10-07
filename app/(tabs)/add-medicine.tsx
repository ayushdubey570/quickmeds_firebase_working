import { useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, ScrollView, SafeAreaView, Alert, Platform } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import Header from '@/components/Header';
import { insertMedicine } from '../../lib/database';
import DateTimePicker from '@react-native-community/datetimepicker';

const daysOfWeek = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

// Function to format Date object to a time string (e.g., 08:00 AM)
const formatTime = (date) => {
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
};

export default function AddMedicineScreen() {
  const router = useRouter();
  const [medicineName, setMedicineName] = useState('');
  const [dosage, setDosage] = useState('');
  const [times, setTimes] = useState([new Date()]); // Store times as Date objects
  const [frequency, setFrequency] = useState('Daily');
  const [selectedDays, setSelectedDays] = useState([]);
  
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [timePickerIndex, setTimePickerIndex] = useState(0);

  const handleDaySelect = (dayIndex) => {
    if (selectedDays.includes(dayIndex)) {
      setSelectedDays(selectedDays.filter((i) => i !== dayIndex));
    } else {
      setSelectedDays([...selectedDays, dayIndex]);
    }
  };

  const onTimeChange = (event, selectedTime) => {
    setShowTimePicker(Platform.OS === 'ios');
    if (selectedTime) {
        const newTimes = [...times];
        newTimes[timePickerIndex] = selectedTime;
        setTimes(newTimes);
    }
  };

  const showPicker = (index) => {
    setTimePickerIndex(index);
    setShowTimePicker(true);
  };

  const handleAddTime = () => {
    const newTimeIndex = times.length;
    setTimes([...times, new Date()]);
    setTimePickerIndex(newTimeIndex);
    setShowTimePicker(true);
  };

  const handleRemoveTime = (index) => {
      const newTimes = times.filter((_, i) => i !== index);
      setTimes(newTimes);
  };

  const saveMedicineHandler = () => {
    if (!medicineName.trim() || !dosage.trim() || times.length === 0) {
      Alert.alert('Error', 'Please fill in all fields and add at least one time.');
      return;
    }
    try {
      // Format times to strings before saving
      const formattedTimes = times.map(time => formatTime(time));
      insertMedicine(medicineName, dosage, formattedTimes, frequency, selectedDays);
      Alert.alert('Success', 'Medicine saved successfully');
      router.push('/(tabs)/home');
    } catch (err) {
      Alert.alert('Error', 'Failed to save medicine');
      console.log(err);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
        <Header title="Add New Medicine" />
        <ScrollView 
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.scrollViewContent}
        >
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
                            <TouchableOpacity onPress={() => showPicker(index)} style={{flex: 1}}>
                                <Text style={styles.timeText}>{formatTime(time)}</Text>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => handleRemoveTime(index)}>
                                <Feather name="x" size={20} color="#64748B" />
                            </TouchableOpacity>
                        </View>
                    ))}
                    <TouchableOpacity style={styles.addTimeButton} onPress={handleAddTime}>
                        <Feather name="plus" size={20} color="#4c669f" />
                        <Text style={styles.addTimeText}>Add Time</Text>
                    </TouchableOpacity>
                </View>

                {showTimePicker && (
                    <DateTimePicker
                        testID="dateTimePicker"
                        value={times[timePickerIndex]}
                        mode="time"
                        is24Hour={false}
                        display="default"
                        onChange={onTimeChange}
                    />
                )}

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

                <TouchableOpacity style={styles.saveButton} onPress={saveMedicineHandler}>
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
    scrollViewContent: {
        paddingBottom: 100, // Ensures the button is not hidden by the tab bar
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
        fontWeight: '500',
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
        marginHorizontal: 5,
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