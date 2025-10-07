import { StyleSheet, Text, View, TextInput, TouchableOpacity, Alert, Switch, ScrollView, ImageBackground } from "react-native";
import { useState, useEffect } from "react";
import { useFocusEffect, useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Feather } from '@expo/vector-icons';
import Header from "@/components/Header";
import Avatar from "@/components/Avatar";

const healthQuotes = [
  "The greatest wealth is health.",
  "A healthy outside starts from the inside.",
  "To keep the body in good health is a duty, otherwise we shall not be able to keep our mind strong and clear.",
  "He who has health has hope; and he who has hope, has everything.",
  "Take care of your body. It’s the only place you have to live."
];

const SettingsItem = ({ icon, label, onPress, isSwitch, switchValue, onSwitchChange }) => (
  <TouchableOpacity onPress={onPress} style={styles.settingItem}>
    <View style={styles.settingItemContent}>
      <Feather name={icon} size={24} color="#4B5563" />
      <Text style={styles.settingText}>{label}</Text>
    </View>
    {isSwitch && <Switch value={switchValue} onValueChange={onSwitchChange} />}
  </TouchableOpacity>
);

const EditProfileSection = ({ name, quote, onEdit }) => (
  <View style={styles.editProfileContainer}>
      <ImageBackground 
          source={require('../../assets/images/header.png')} 
          style={styles.profileHeader}
          imageStyle={{ borderRadius: 15, opacity: 0.8 }}
      >
      </ImageBackground>
      <View style={styles.profileContent}>
          <Avatar name={name} size={80} />
          <View style={styles.profileInfo}>
              <Text style={styles.profileName}>{name || "User Name"}</Text>
              <Text style={styles.profileQuote}>{quote}</Text>
          </View>
          <TouchableOpacity onPress={onEdit} style={styles.editButton}>
              <Feather name="edit-2" size={20} color="#FFFFFF" />
          </TouchableOpacity>
      </View>
  </View>
);

export default function SettingsScreen() {
  const [name, setName] = useState("");
  const [quote, setQuote] = useState("");
  const [darkMode, setDarkMode] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const randomQuote = healthQuotes[Math.floor(Math.random() * healthQuotes.length)];
    setQuote(randomQuote);
  }, []);

  useFocusEffect(() => {
    const fetchUserData = async () => {
      const storedName = await AsyncStorage.getItem("userName");
      if (storedName) setName(storedName);
    };
    fetchUserData();
  });

  const handleSave = async () => {
    if (name.trim()) {
      await AsyncStorage.setItem("userName", name.trim());
      Alert.alert("Success", "Your profile has been updated.");
      setIsEditing(false);
    } else {
      Alert.alert("Error", "Name cannot be empty.");
    }
  };

  const navigateTo = (screen) => {
    router.push(`/(tabs)/${screen}`);
  };

  return (
    <View style={styles.container}>
      <Header title="Settings" showProfile={false} />
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.profileSection}>
          <EditProfileSection name={name} quote={quote} onEdit={() => setIsEditing(true)} />
          {isEditing && (
            <View style={styles.editingControls}>
              <View style={styles.inputContainer}>
                <TextInput
                  style={styles.input}
                  value={name}
                  onChangeText={setName}
                  placeholder="Enter your name"
                />
                <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
                  <Feather name="check" size={24} color="#FFFFFF" />
                </TouchableOpacity>
              </View>
            </View>
          )}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Preferences</Text>
          <SettingsItem 
            icon="moon" 
            label="Dark Mode" 
            isSwitch 
            switchValue={darkMode} 
            onSwitchChange={setDarkMode} 
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Manage</Text>
          <SettingsItem icon="plus-circle" label="Manage Your Medicine" onPress={() => navigateTo('manage-medicines')} />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Support</Text>
          <SettingsItem icon="file-text" label="Terms and Conditions" onPress={() => navigateTo('termsandconditions')} />
          <SettingsItem icon="shield" label="Privacy Policy" onPress={() => navigateTo('privacypolicy')} />
          <SettingsItem icon="help-circle" label="Help & Support" onPress={() => navigateTo('help')} />
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8F9FA",
  },
  content: {
    padding: 20,
    paddingBottom: 120,
  },
  profileSection: {
    marginBottom: 30,
  },
  editProfileContainer: {
    borderRadius: 15,
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.1,
    shadowRadius: 15,
    elevation: 10,
  },
  profileHeader: {
    height: 100,
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    marginTop: -40,
  },
  profileInfo: {
    flex: 1,
    marginLeft: 20,
  },
  profileName: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#1E293B',
  },
  profileQuote: {
    fontSize: 14,
    color: '#64748B',
    fontStyle: 'italic',
    marginTop: 5,
  },
  editButton: {
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    borderRadius: 20,
    padding: 10,
  },
  editingControls: {
    marginTop: 20,
    backgroundColor: '#FFFFFF',
    borderRadius: 15,
    padding: 20,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  input: {
    flex: 1,
    height: 50,
    backgroundColor: "#F1F5F9",
    borderRadius: 10,
    paddingHorizontal: 15,
    fontSize: 16,
  },
  saveButton: {
    backgroundColor: "#4c669f",
    padding: 12,
    borderRadius: 10,
    marginLeft: 10,
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#334155',
    marginBottom: 10,
    paddingLeft: 5,
  },
  settingItem: {
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    padding: 15,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  settingItemContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  settingText: {
    fontSize: 16,
    color: '#4B5563',
    marginLeft: 15,
  },
});