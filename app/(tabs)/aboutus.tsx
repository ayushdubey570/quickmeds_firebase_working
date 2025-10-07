import { StyleSheet, Text, View, SafeAreaView, ScrollView, Image } from 'react-native';
import Header from '@/components/Header';

export default function AboutUsScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <Header title="About Us" />
      <ScrollView contentContainerStyle={styles.content}>
        <Image 
            source={{uri: 'https://i.imgur.com/8i2j8zL.png'}}
            style={styles.logo}
        />
        <Text style={styles.title}>About QuickMeds</Text>
        <Text style={styles.paragraph}>
          QuickMeds is a mobile application designed to help you manage your medications effectively. Our mission is to provide an easy-to-use tool that helps you stay on track with your medication schedule, ensuring you never miss a dose.
        </Text>
        <Text style={styles.subtitle}>Our Team</Text>
        <Text style={styles.paragraph}>
          We are a team of passionate developers and healthcare enthusiasts dedicated to improving the lives of individuals by leveraging technology.
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
    alignItems: 'center',
    paddingBottom: 120,
  },
  logo: {
    width: 150,
    height: 150,
    borderRadius: 75,
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
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
    textAlign: 'center',
  },
});
