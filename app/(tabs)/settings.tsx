import { StyleSheet, Text, View, SafeAreaView, TouchableOpacity, Switch } from "react-native";
import { FontAwesome5 } from '@expo/vector-icons';
import { useState } from "react";

export default function SettingsScreen() {
    const [isDarkMode, setIsDarkMode] = useState(false);
    const [isVoicePrompts, setIsVoicePrompts] = useState(true);

    const toggleDarkMode = () => setIsDarkMode(previousState => !previousState);
    const toggleVoicePrompts = () => setIsVoicePrompts(previousState => !previousState);

  return (
    <SafeAreaView style={styles.container}>
        <View style={styles.header}>
            <Text style={styles.headerTitle}>Settings</Text>
        </View>

        <View style={styles.settingItem}>
            <Text style={styles.settingLabel}>Dark Mode</Text>
            <Switch
                trackColor={{ false: "#767577", true: "#81b0ff" }}
                thumbColor={isDarkMode ? "#3B82F6" : "#f4f3f4"}
                onValueChange={toggleDarkMode}
                value={isDarkMode}
            />
        </View>

        <View style={styles.settingItem}>
            <Text style={styles.settingLabel}>Voice Prompts</Text>
            <Switch
                trackColor={{ false: "#767577", true: "#81b0ff" }}
                thumbColor={isVoicePrompts ? "#3B82F6" : "#f4f3f4"}
                onValueChange={toggleVoicePrompts}
                value={isVoicePrompts}
            />
        </View>

        <TouchableOpacity style={styles.settingItem}>
            <Text style={styles.settingLabel}>Reset Data</Text>
            <FontAwesome5 name="trash-alt" size={22} color="#EF4444" />
        </TouchableOpacity>

        <View style={styles.appInfo}>
            <Text style={styles.appName}>QuickMeds</Text>
            <Text style={styles.appVersion}>Version 1.0.0</Text>
        </View>

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
    justifyContent: 'center',
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
  settingItem: {
      backgroundColor: '#FFFFFF',
      borderRadius: 10,
      padding: 20,
      marginHorizontal: 20,
      marginTop: 15,
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      elevation: 2,
  },
  settingLabel: {
      fontSize: 18,
      color: '#1E293B',
  },
  appInfo: {
      marginTop: 40,
      alignItems: 'center',
  },
  appName: {
      fontSize: 20,
      fontWeight: 'bold',
      color: '#1E3A8A',
  },
  appVersion: {
      fontSize: 16,
      color: '#6B7280',
      marginTop: 5,
  }
});
