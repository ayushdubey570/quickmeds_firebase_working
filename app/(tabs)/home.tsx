import { StyleSheet, Text, View, Image, TouchableOpacity, ScrollView, SafeAreaView, Animated, Dimensions } from "react-native";
import { FontAwesome5 } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useEffect, useRef } from 'react';

const medications = [
  {
    name: "Metformin",
    dosage: "500mg",
    time: "8:00 AM",
    status: "taken",
  },
  {
    name: "Lisinopril",
    dosage: "10mg",
    time: "8:00 AM",
    status: "taken",
  },
  {
    name: "Atorvastatin",
    dosage: "20mg",
    time: "8:00 PM",
    status: "pending",
  },
  {
    name: "Amlodipine",
    dosage: "5mg",
    time: "8:00 PM",
    status: "missed",
  },
];

const { width } = Dimensions.get('window');
const cardPadding = 20;
const statCardWidth = (width - cardPadding * 4) / 3;

export default function HomeScreen() {
  const router = useRouter();
  const statsAnim = useRef(new Animated.Value(0)).current;
  const medicationAnims = useRef(medications.map(() => new Animated.Value(0))).current;
  const fabAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.timing(statsAnim, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start();

    const animations = medicationAnims.map((anim) => {
        return Animated.timing(anim, {
            toValue: 1,
            duration: 400,
            useNativeDriver: true,
        });
    });
    Animated.stagger(100, animations).start();
  }, []);

  const statCardAnimationStyle = {
      opacity: statsAnim,
      transform: [
          {
              translateY: statsAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [50, 0],
              })
          },
      ],
  };

  const onPressInFab = () => {
    Animated.spring(fabAnim, {
        toValue: 0.95,
        useNativeDriver: true,
    }).start();
  };

  const onPressOutFab = () => {
    Animated.spring(fabAnim, {
        toValue: 1,
        friction: 3,
        tension: 40,
        useNativeDriver: true,
    }).start();
  };

  return (
    <SafeAreaView style={styles.container}>
        <View style={styles.header}>
            <View>
                <Text style={styles.headerGreeting}>Hello,</Text>
                <Text style={styles.headerName}>Ayush Kumar</Text>
            </View>
            <TouchableOpacity onPress={() => router.push('/(tabs)/settings')}>
                <Image
                source={{ uri: "https://i.imgur.com/8i2j8zL.png" }}
                style={styles.profilePic}
                />
            </TouchableOpacity>
        </View>

        <View style={styles.statsContainer}>
            <Animated.View style={[styles.statCard, statCardAnimationStyle]}>
                <Text style={styles.statValue}>10</Text>
                <Text style={styles.statLabel}>Taken</Text>
            </Animated.View>
            <Animated.View style={[styles.statCard, statCardAnimationStyle, {transitionDelay: '100ms'}]}>
                <Text style={styles.statValue}>2</Text>
                <Text style={styles.statLabel}>Missed</Text>
            </Animated.View>
            <Animated.View style={[styles.statCard, statCardAnimationStyle, {transitionDelay: '200ms'}]}>
                <Text style={styles.statValue}>3</Text>
                <Text style={styles.statLabel}>Pending</Text>
            </Animated.View>
        </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{paddingBottom: 100}}>

        <View style={styles.medicationSection}>
          <Text style={styles.sectionTitle}>Today's Medicines</Text>
          <TouchableOpacity onPress={() => router.push('/(tabs)/history')}>
            <Text style={styles.seeAll}>See All</Text>
          </TouchableOpacity>
        </View>

        {medications.map((med, index) => (
            <Animated.View key={index} style={{
                opacity: medicationAnims[index],
                transform: [{
                    translateY: medicationAnims[index].interpolate({
                        inputRange: [0, 1],
                        outputRange: [20, 0]
                    })
                }]
            }}>
              <View style={styles.medicationCard}>
                <View style={[styles.statusIndicator, {backgroundColor: med.status === 'taken' ? '#22C55E' : med.status === 'missed' ? '#EF4444' : '#F59E0B'}]}>
                    <FontAwesome5 name={med.status === 'taken' ? 'check' : med.status === 'missed' ? 'times' : 'clock'} size={16} color="#FFFFFF" />
                </View>
                <View style={styles.medicationInfo}>
                  <Text style={styles.medicationName}>{med.name}</Text>
                  <Text style={styles.medicationDosage}>{med.dosage}</Text>
                </View>
                <Text style={styles.medicationTime}>{med.time}</Text>
              </View>
            </Animated.View>
        ))}

      </ScrollView>

      <TouchableOpacity 
        activeOpacity={1}
        onPressIn={onPressInFab}
        onPressOut={onPressOutFab}
        onPress={() => router.push('/add-medicine')}
        style={styles.fabContainer}
      >
        <Animated.View style={[styles.fab, {transform: [{scale: fabAnim}]}]}>
            <FontAwesome5 name="plus" size={22} color="#FFFFFF" />
        </Animated.View>
      </TouchableOpacity>

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 40,
    backgroundColor: '#FFFFFF',
    borderBottomLeftRadius: 25,
    borderBottomRightRadius: 25,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
  },
  headerGreeting: {
      fontSize: 16,
      color: '#6C757D',
      fontWeight: '500',
  },
  headerName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#212529',
  },
  profilePic: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  statsContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      paddingHorizontal: cardPadding,
      marginTop: -25,
  },
  statCard: {
      backgroundColor: '#FFFFFF',
      borderRadius: 18,
      paddingVertical: 15,
      paddingHorizontal: 10,
      alignItems: 'center',
      width: statCardWidth,
      elevation: 6,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.15,
      shadowRadius: 8,
  },
  statValue: {
      fontSize: 22,
      fontWeight: 'bold',
      color: '#3B82F6',
  },
  statLabel: {
      fontSize: 13,
      color: '#495057',
      marginTop: 6,
      fontWeight: '500',
  },
  medicationSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginTop: 25,
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1E293B',
  },
  seeAll: {
    color: '#3B82F6',
    fontSize: 16,
    fontWeight: '600',
  },
  medicationCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 18,
    marginHorizontal: 20,
    marginTop: 15,
    flexDirection: 'row',
    alignItems: 'center',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
  },
  statusIndicator: {
      width: 32,
      height: 32,
      borderRadius: 16,
      justifyContent: 'center',
      alignItems: 'center',
  },
  medicationInfo: {
    flex: 1,
    marginLeft: 15,
  },
  medicationName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1E293B',
  },
  medicationDosage: {
    fontSize: 14,
    color: '#64748B',
    marginTop: 3,
  },
  medicationTime: {
    fontSize: 16,
    fontWeight: '500',
    color: '#1E293B',
  },
  fabContainer: {
    position: 'absolute',
    right: 25,
    bottom: 25,
  },
  fab: {
    backgroundColor: '#3B82F6',
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 6,
  },
});
