import { StyleSheet, Text, View, TextInput, TouchableOpacity, Alert, Switch, ScrollView, ImageBackground } from "react-native";
import { useState } from "react";
import { useFocusEffect, useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Feather } from '@expo/vector-icons';
import Header from "@/components/Header";
import Avatar from "@/components/Avatar"; // Import the new Avatar component

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
          source={{ uri: 'https://www.google.com/url?sa=i&url=https%3A%2F%2Fwww.freepik.com%2Ffree-vector%2Fflat-medical-twitter-header-design-template_17743570.htm&psig=AOvVaw2kBIIGOgsddp3_dDw3Iviu&ust=1759923569199000&source=images&cd=vfe&opi=89978449&ved=0CBUQjRxqFwoTCJjQqdSAkpADFQAAAAAdAAAAABAE' }} 
          style={styles.profileHeader}
          imageStyle={{ borderRadius: 15, opacity: 0.8 }}
      >
      </ImageBackground>
      <View style={styles.profileContent}>
          <Avatar name={name} size={80} />
          <View style={styles.profileInfo}>
              <Text style={styles.profileName}>{name || "User Name"}</Text>
              <Text style={styles.profileQuote}>{quote || '"Stay healthy, stay happy."'}</Text>
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

  useFocusEffect(() => {
    const fetchUserData = async () => {
      const storedName = await AsyncStorage.getItem("userName");
      const storedQuote = await AsyncStorage.getItem("userQuote");
      if (storedName) setName(storedName);
      if (storedQuote) setQuote(storedQuote);
    };
    fetchUserData();
  });

  const handleSave = async () => {
    if (name.trim()) {
      await AsyncStorage.setItem("userName", name.trim());
      await AsyncStorage.setItem("userQuote", quote.trim());
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
      <Header title="Settings" showProfile={true} name={name} />
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.profileSection}>
          <EditProfileSection name={name} quote={quote} onEdit={() => setIsEditing(true)} />
          {isEditing && (
            <View style={styles.editingControls}>
              <TextInput
                style={styles.input}
                value={name}
                onChangeText={setName}
                placeholder="Enter your name"
              />
              <TextInput
                style={styles.input}
                value={quote}
                onChangeText={setQuote}
                placeholder="Enter your quote"
              />
              <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
                <Text style={styles.saveButtonText}>Save Changes</Text>
              </TouchableOpacity>
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
    height: 120,
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    marginTop: -50,
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
  input: {
    width: "100%",
    height: 50,
    backgroundColor: "#F1F5F9",
    borderRadius: 10,
    paddingHorizontal: 15,
    fontSize: 16,
    marginBottom: 15,
  },
  saveButton: {
    backgroundColor: "#4c669f",
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: "center",
  },
  saveButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "bold",
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
