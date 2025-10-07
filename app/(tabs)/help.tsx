import { StyleSheet, Text, View, SafeAreaView, ScrollView } from 'react-native';
import Header from '@/components/Header';

export default function HelpScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <Header title="Help & Feedback" />
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.title}>Help & Feedback</Text>
        <Text style={styles.subtitle}>Frequently Asked Questions</Text>
        <Text style={styles.question}>How do I add a new medicine?</Text>
        <Text style={styles.answer}>
          To add a new medicine, go to the Home screen and tap the "+" button. You will be prompted to enter the medicine's name, dosage, and schedule.
        </Text>
        <Text style={styles.question}>How can I track my medication history?</Text>
        <Text style={styles.answer}>
          The History screen shows a log of your medication intake. You can filter this history by status, date, medicine name, and time.
        </Text>
        <Text style={styles.subtitle}>Feedback</Text>
        <Text style={styles.paragraph}>
          We would love to hear your feedback! Please email us at feedback@quickmeds.com with your suggestions.
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  content: {
    padding: 20,
    paddingBottom: 120,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  subtitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 20,
    marginBottom: 10,
  },
  question: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 10,
  },
  answer: {
    fontSize: 16,
    lineHeight: 24,
    marginBottom: 10,
  },
  paragraph: {
    fontSize: 16,
    lineHeight: 24,
  },
});
