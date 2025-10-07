import { StyleSheet, Text, View, FlatList, TouchableOpacity, Alert, SafeAreaView } from "react-native";
import { useEffect, useState } from "react";
import { useFocusEffect, useRouter } from "expo-router";
import { Feather } from '@expo/vector-icons';
import { deleteMedicine, fetchMedicines } from "@/lib/database";
import Header from "@/components/Header";

const MedicineItem = ({ item, onDelete }) => {
    let displayTimes = 'Not specified';
    if (typeof item.times === 'string') {
        try {
            const parsedTimes = JSON.parse(item.times);
            if (Array.isArray(parsedTimes)) {
                displayTimes = parsedTimes.join(', ');
            }
        } catch (e) {
            // Not a valid JSON string, do nothing and keep default value
        }
    } else if (Array.isArray(item.times)) {
        displayTimes = item.times.join(', ');
    }

    return (
        <View style={styles.card}>
            <View style={styles.cardHeader}>
                <Text style={styles.medicineName}>{item.name}</Text>
                <TouchableOpacity onPress={() => onDelete(item.allIds)} style={styles.deleteButton}>
                    <Feather name="trash-2" size={22} color="#EF4444" />
                </TouchableOpacity>
            </View>
            <View style={styles.cardBody}>
                <View style={styles.detailItem}>
                    <Feather name="clipboard" size={16} color="#4A5568" />
                    <Text style={styles.detailText}>{item.dosage}</Text>
                </View>
                <View style={styles.detailItem}>
                    <Feather name="clock" size={16} color="#4A5568" />
                    <Text style={styles.detailText}>{displayTimes}</Text>
                </View>
                <View style={styles.detailItem}>
                    <Feather name="repeat" size={16} color="#4A5568" />
                    <Text style={styles.detailText}>{item.frequency}</Text>
                </View>
            </View>
        </View>
    );
};

export default function ManageMedicinesScreen() {
  const [medicines, setMedicines] = useState([]);
  const router = useRouter();

  const loadMedicines = () => {
    const allMedicines = fetchMedicines();
    const groupedMedicines = allMedicines.reduce((acc, medicine) => {
      if (!acc[medicine.name]) {
        acc[medicine.name] = {
          ...medicine,
          allIds: [medicine.id]
        };
      } else {
        try {
            const existingTimes = JSON.parse(acc[medicine.name].times);
            const newTimes = JSON.parse(medicine.times);
            const mergedTimes = [...new Set([...existingTimes, ...newTimes])];
            acc[medicine.name].times = JSON.stringify(mergedTimes);
            acc[medicine.name].allIds.push(medicine.id);
        } catch (e) {
            console.error("Error parsing times for grouping", e);
        }
      }
      return acc;
    }, {});

    const processedMedicines = Object.values(groupedMedicines);
    setMedicines(processedMedicines);
  };

  useFocusEffect(() => {
    loadMedicines();
  });

  const handleDelete = (ids) => {
    Alert.alert(
      "Delete Medicine",
      "Are you sure you want to delete this medicine and all its associated times? This action cannot be undone.",
      [
        { text: "Cancel", style: "cancel" },
        { 
          text: "Delete", 
          style: "destructive", 
          onPress: () => {
            ids.forEach(id => {
                deleteMedicine(id);
            });
            loadMedicines();
          }
        },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <Header title="Manage Medicines" />
      {medicines.length > 0 ? (
        <FlatList
            data={medicines}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => <MedicineItem item={item} onDelete={handleDelete} />}
            contentContainerStyle={styles.list}
        />
      ) : (
        <View style={styles.emptyContainer}>
            <Feather name="info" size={48} color="#CBD5E0" />
            <Text style={styles.emptyText}>No Medicines Found</Text>
            <Text style={styles.emptySubText}>Tap the 'Add Medicine' tab to add your first medicine.</Text>
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8F9FA",
  },
  list: {
    padding: 20,
    paddingBottom: 80, // Added padding to the bottom
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 20,
    marginBottom: 15,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    borderBottomWidth: 1,
    borderBottomColor: '#EDF2F7',
    paddingBottom: 15,
    marginBottom: 15,
  },
  medicineName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2D3748',
    flex: 1,
    marginRight: 10,
  },
  deleteButton: {
    padding: 5, // Make it easier to press
  },
  cardBody: {},
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  detailText: {
    fontSize: 16,
    color: '#4A5568',
    marginLeft: 12,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#4A5568',
    marginTop: 20,
  },
  emptySubText: {
    fontSize: 14,
    color: '#A0AEC0',
    marginTop: 8,
    textAlign: 'center',
  },
});
