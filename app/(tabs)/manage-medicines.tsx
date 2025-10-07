import { StyleSheet, Text, View, FlatList, TouchableOpacity, Alert } from "react-native";
import { useEffect, useState } from "react";
import { useFocusEffect, useRouter } from "expo-router";
import { Feather } from '@expo/vector-icons';
import { deleteMedicine, fetchMedicines } from "@/lib/database";
import Header from "@/components/Header";

const MedicineItem = ({ item, onDelete }) => (
  <View style={styles.medicineItem}>
    <View style={styles.medicineInfo}>
      <Text style={styles.medicineName}>{item.name}</Text>
      <Text style={styles.medicineDosage}>{item.dosage}</Text>
    </View>
    <TouchableOpacity onPress={() => onDelete(item.id)} style={styles.deleteButton}>
      <Feather name="trash-2" size={24} color="#EF4444" />
    </TouchableOpacity>
  </View>
);

export default function ManageMedicinesScreen() {
  const [medicines, setMedicines] = useState([]);
  const router = useRouter();

  const loadMedicines = () => {
    const allMedicines = fetchMedicines();
    setMedicines(allMedicines);
  };

  useFocusEffect(() => {
    loadMedicines();
  });

  const handleDelete = (id) => {
    Alert.alert(
      "Delete Medicine",
      "Are you sure you want to delete this medicine? This action cannot be undone.",
      [
        { text: "Cancel", style: "cancel" },
        { 
          text: "Delete", 
          style: "destructive", 
          onPress: () => {
            deleteMedicine(id);
            loadMedicines();
          }
        },
      ]
    );
  };

  return (
    <View style={styles.container}>
      <Header title="Manage Medicines" />
      <FlatList
        data={medicines}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => <MedicineItem item={item} onDelete={handleDelete} />}
        contentContainerStyle={styles.list}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8F9FA",
  },
  list: {
    padding: 20,
  },
  medicineItem: {
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    padding: 15,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  medicineInfo: {
    flex: 1,
  },
  medicineName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1E293B',
  },
  medicineDosage: {
    fontSize: 14,
    color: '#64748B',
    marginTop: 3,
  },
  deleteButton: {
    padding: 10,
  },
});
