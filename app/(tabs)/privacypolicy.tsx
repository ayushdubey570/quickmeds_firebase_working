import { StyleSheet, Text, View, SafeAreaView, ScrollView } from 'react-native';
import Header from '@/components/Header';

export default function PrivacyPolicyScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <Header title="Privacy Policy" />
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.title}>Privacy Policy</Text>
        <Text style={styles.paragraph}>
          Your privacy is important to us. It is our policy to respect your privacy regarding any information we may collect from you across our app.
        </Text>
        <Text style={styles.subtitle}>Information We Collect</Text>
        <Text style={styles.paragraph}>
          We only ask for personal information when we truly need it to provide a service to you. We collect it by fair and lawful means, with your knowledge and consent. We also let you know why we’re collecting it and how it will be used.
        </Text>
        <Text style={styles.subtitle}>How We Use Your Information</Text>
        <Text style={styles.paragraph}>
          We may use the information we collect from you to personalize your experience, to improve our app, and to send periodic emails. Your information, whether public or private, will not be sold, exchanged, transferred, or given to any other company for any reason whatsoever, without your consent.
        </Text>
        <Text style={styles.subtitle}>Security</Text>
        <Text style={styles.paragraph}>
          We value your trust in providing us your Personal Information, thus we are striving to use commercially acceptable means of protecting it. But remember that no method of transmission over the internet, or method of electronic storage is 100% secure and reliable, and we cannot guarantee its absolute security.
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
  paragraph: {
    fontSize: 16,
    lineHeight: 24,
  },
});
