import { StyleSheet, Text, View, SafeAreaView, ScrollView } from 'react-native';
import Header from '@/components/Header';

export default function TermsAndConditionsScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <Header title="Terms & Conditions" />
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.title}>Terms & Conditions</Text>
        <Text style={styles.paragraph}>
          By downloading or using the app, these terms will automatically apply to you – you should make sure therefore that you read them carefully before using the app.
        </Text>
        <Text style={styles.subtitle}>License</Text>
        <Text style={styles.paragraph}>
          We are offering you this app to use for your own personal use without cost, but you should be aware that you cannot send it on to anyone else, and you’re not allowed to copy, or modify the app, any part of the app, or our trademarks in any way.
        </Text>
        <Text style={styles.subtitle}>Updates</Text>
        <Text style={styles.paragraph}>
          We may update our Terms and Conditions from time to time. Thus, you are advised to review this page periodically for any changes. We will notify you of any changes by posting the new Terms and Conditions on this page.
        </Text>
        <Text style={styles.subtitle}>Contact Us</Text>
        <Text style={styles.paragraph}>
          If you have any questions or suggestions about our Terms and Conditions, do not hesitate to contact us.
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
