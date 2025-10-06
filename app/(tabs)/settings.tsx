import { StyleSheet, Text, View, SafeAreaView, TouchableOpacity, Switch, Image, ScrollView } from "react-native";
import { FontAwesome5 } from '@expo/vector-icons';
import { useState } from "react";
import Header from "@/components/Header";

export default function SettingsScreen() {
    const [isNotifications, setIsNotifications] = useState(true);
    const [isDarkMode, setIsDarkMode] = useState(false);

    const toggleNotifications = () => setIsNotifications(previousState => !previousState);
    const toggleDarkMode = () => setIsDarkMode(previousState => !previousState);

  return (
    <SafeAreaView style={styles.container}>
        <Header title="Settings" />
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{paddingBottom: 20}}>
            <View style={styles.profileSection}>
                <Image 
                    source={{uri: 'https://i.imgur.com/8i2j8zL.png'}}
                    style={styles.profileImage}
                />
                <Text style={styles.profileName}>Ayush Kumar</Text>
                <Text style={styles.profileEmail}>ayush.kumar@example.com</Text>
            </View>

            <View style={styles.settingsSection}>
                <Text style={styles.sectionTitle}>Preferences</Text>
                <View style={styles.settingRow}>
                    <FontAwesome5 name="bell" size={20} color="#495057" />
                    <Text style={styles.settingLabel}>Notifications</Text>
                    <Switch
                        trackColor={{ false: "#CED4DA", true: "#a8c4ff" }}
                        thumbColor={isNotifications ? "#4c669f" : "#f4f3f4"}
                        onValueChange={toggleNotifications}
                        value={isNotifications}
                    />
                </View>
                <View style={styles.settingRow}>
                    <FontAwesome5 name="moon" size={20} color="#495057" />
                    <Text style={styles.settingLabel}>Dark Mode</Text>
                    <Switch
                        trackColor={{ false: "#CED4DA", true: "#a8c4ff" }}
                        thumbColor={isDarkMode ? "#4c669f" : "#f4f3f4"}
                        onValueChange={toggleDarkMode}
                        value={isDarkMode}
                    />
                </View>
            </View>

            <View style={styles.settingsSection}>
                <Text style={styles.sectionTitle}>Support</Text>
                <TouchableOpacity style={styles.settingRow}>
                    <FontAwesome5 name="question-circle" size={20} color="#495057" />
                    <Text style={styles.settingLabel}>Help & Feedback</Text>
                    <FontAwesome5 name="chevron-right" size={16} color="#ADB5BD" />
                </TouchableOpacity>
                <TouchableOpacity style={styles.settingRow}>
                    <FontAwesome5 name="info-circle" size={20} color="#495057" />
                    <Text style={styles.settingLabel}>About Us</Text>
                    <FontAwesome5 name="chevron-right" size={16} color="#ADB5BD" />
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
  profileSection: {
      alignItems: 'center',
      paddingVertical: 30,
      marginHorizontal: 20,
      borderBottomWidth: 1,
      borderBottomColor: '#E9ECEF'
  },
  profileImage: {
      width: 100,
      height: 100,
      borderRadius: 50,
      marginBottom: 15,
      borderWidth: 3,
      borderColor: '#4c669f'
  },
  profileName: {
      fontSize: 24,
      fontWeight: 'bold',
      color: '#212529'
  },
  profileEmail: {
      fontSize: 16,
      color: '#6C757D',
      marginTop: 4
  },
  settingsSection: {
      marginTop: 25,
  },
  sectionTitle: {
      fontSize: 16,
      fontWeight: '600',
      color: '#6C757D',
      paddingHorizontal: 20,
      marginBottom: 10,
  },
  settingRow: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: '#FFFFFF',
      paddingVertical: 15,
      paddingHorizontal: 20,
      borderTopWidth: 1,
      borderBottomWidth: 1,
      borderColor: '#E9ECEF'
  },
  settingLabel: {
      flex: 1,
      fontSize: 18,
      color: '#343A40',
      marginLeft: 20,
  }
});
