import { StyleSheet, Text, View, Image, TouchableOpacity, SafeAreaView } from "react-native";
import { useRouter } from 'expo-router';

export default function OnboardingScreen() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Image
          source={{ uri: "https://i.imgur.com/M9J7aW4.png" }} // A more medical-themed logo
          style={styles.logo}
        />
        <Text style={styles.title}>QuickMeds</Text>
        <Text style={styles.subtitle}>Your Personal Medication Assistant</Text>
      </View>
      <TouchableOpacity style={styles.button} onPress={() => router.push('/home')}>
        <Text style={styles.buttonText}>Get Started</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F0F8FF', // Light blue background
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logo: {
    width: 150,
    height: 150,
    marginBottom: 30,
  },
  title: {
    fontSize: 40,
    fontWeight: 'bold',
    color: '#1E3A8A', // Dark blue color
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 18,
    color: '#5A677D', // Muted text color
    textAlign: 'center',
    paddingHorizontal: 20,
  },
  button: {
    backgroundColor: '#3B82F6', // Vibrant blue
    paddingVertical: 18,
    paddingHorizontal: 100,
    borderRadius: 50,
    marginBottom: 40,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: 'bold',
  },
});
