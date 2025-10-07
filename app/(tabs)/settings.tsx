import { StyleSheet, Text, View, TextInput, TouchableOpacity, Alert } from "react-native";
import { useState } from "react";
import { useFocusEffect } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Header from "@/components/Header";

export default function SettingsScreen() {
  const [name, setName] = useState("");

  useFocusEffect(() => {
    const fetchUserName = async () => {
      const storedName = await AsyncStorage.getItem("userName");
      if (storedName) {
        setName(storedName);
      }
    };
    fetchUserName();
  });

  const handleSave = async () => {
    if (name.trim()) {
      await AsyncStorage.setItem("userName", name.trim());
      Alert.alert("Success", "Your name has been updated.");
    } else {
      Alert.alert("Error", "Name cannot be empty.");
    }
  };

  return (
    <View style={styles.container}>
      <Header title="Settings" />
      <View style={styles.content}>
        <Text style={styles.label}>Your Name</Text>
        <TextInput
          style={styles.input}
          value={name}
          onChangeText={setName}
          placeholder="Enter your name"
        />
        <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
          <Text style={styles.saveButtonText}>Save Changes</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8F9FA",
  },
  content: {
    flex: 1,
    padding: 20,
  },
  label: {
    fontSize: 18,
    fontWeight: "600",
    color: "#334155",
    marginBottom: 10,
  },
  input: {
    width: "100%",
    height: 50,
    backgroundColor: "#FFFFFF",
    borderRadius: 10,
    paddingHorizontal: 15,
    fontSize: 16,
    borderColor: "#E2E8F0",
    borderWidth: 1,
    marginBottom: 20,
  },
  saveButton: {
    backgroundColor: "#4c669f",
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 10,
    alignItems: "center",
  },
  saveButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "bold",
  },
});
