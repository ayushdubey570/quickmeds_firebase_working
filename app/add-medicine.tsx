import { StyleSheet, Text, View, TextInput, TouchableOpacity, Switch, ScrollView, SafeAreaView } from "react-native";
import { FontAwesome5 } from '@expo/vector-icons';
import { useState } from 'react';
import { useRouter } from 'expo-router';

export default function AddMedicineScreen() {
  const router = useRouter();
  const [frequency, setFrequency] = useState('daily'); // daily, weekly, custom

  return (
    <SafeAreaView style={styles.container}>
        <View style={styles.header}>
            <TouchableOpacity onPress={() => router.back()}>
                <FontAwesome5 name="times" size={24} color="#343A40" />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Add New Medicine</Text>
            <View style={{width: 24}}/>
        </View>

        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{paddingBottom: 100}}>
            <View style={styles.card}>
                <Text style={styles.cardTitle}>Medicine Details</Text>
                <TextInput style={styles.input} placeholder="Medicine Name" placeholderTextColor="#ADB5BD" />
                <TextInput style={styles.input} placeholder="Dosage (e.g., 500mg)" placeholderTextColor="#ADB5BD" />
            </View>

            <View style={styles.card}>
                <Text style={styles.cardTitle}>Frequency</Text>
                <View style={styles.chipContainer}>
                    <TouchableOpacity 
                        style={[styles.chip, frequency === 'daily' && styles.chipSelected]}
                        onPress={() => setFrequency('daily')}> 
                        <Text style={[styles.chipText, frequency === 'daily' && styles.chipTextSelected]}>Daily</Text>
                    </TouchableOpacity>
                    <TouchableOpacity 
                        style={[styles.chip, frequency === 'weekly' && styles.chipSelected]} 
                        onPress={() => setFrequency('weekly')}>
                        <Text style={[styles.chipText, frequency === 'weekly' && styles.chipTextSelected]}>Weekly</Text>
                    </TouchableOpacity>
                    <TouchableOpacity 
                        style={[styles.chip, frequency === 'custom' && styles.chipSelected]} 
                        onPress={() => setFrequency('custom')}>
                        <Text style={[styles.chipText, frequency === 'custom' && styles.chipTextSelected]}>Custom</Text>
                    </TouchableOpacity>
                </View>
            </View>

            <View style={styles.card}>
                <Text style={styles.cardTitle}>Set Reminder</Text>
                <TouchableOpacity style={styles.timeRow}>
                    <FontAwesome5 name="clock" size={20} color="#495057" />
                    <Text style={styles.timeText}>9:00 AM</Text>
                    <FontAwesome5 name="chevron-right" size={16} color="#ADB5BD" />
                </TouchableOpacity>
            </View>

        </ScrollView>

        <TouchableOpacity style={styles.saveButton} onPress={() => router.push('/(tabs)/home')}>
            <Text style={styles.saveButtonText}>Save Medicine</Text>
        </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E9ECEF'
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#212529',
  },
  card: {
      backgroundColor: '#FFFFFF',
      borderRadius: 12,
      marginHorizontal: 20,
      marginTop: 20,
      padding: 20,
      elevation: 2,
  },
  cardTitle: {
      fontSize: 18,
      fontWeight: '600',
      color: '#343A40',
      marginBottom: 15,
  },
  input: {
    backgroundColor: '#F1F3F5',
    borderRadius: 8,
    padding: 15,
    fontSize: 16,
    color: '#212529',
    marginBottom: 15,
  },
  chipContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  chip: {
    borderRadius: 20,
    paddingVertical: 10,
    paddingHorizontal: 25,
    borderWidth: 1,
    borderColor: '#CED4DA',
  },
  chipSelected: {
    backgroundColor: '#3B82F6',
    borderColor: '#3B82F6',
  },
  chipText: {
    color: '#495057',
    fontWeight: '500',
  },
  chipTextSelected: {
    color: '#FFFFFF',
  },
  timeRow: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: '#F1F3F5',
      borderRadius: 8,
      padding: 15,
  },
  timeText: {
      flex: 1,
      fontSize: 16,
      color: '#212529',
      marginLeft: 15,
  },
  saveButton: {
      position: 'absolute',
      bottom: 20,
      left: 20,
      right: 20,
      backgroundColor: '#3B82F6',
      borderRadius: 12,
      padding: 18,
      alignItems: 'center',
      elevation: 3,
  },
  saveButtonText: {
      color: '#FFFFFF',
      fontSize: 18,
      fontWeight: 'bold',
  },
});
