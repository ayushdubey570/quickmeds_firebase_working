import { StyleSheet, Text, View, TouchableOpacity, ScrollView, SafeAreaView, Animated, Dimensions, Modal } from "react-native";
import { Feather, FontAwesome5 } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useEffect, useRef, useState } from 'react';
import Header from '@/components/Header';

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
const cardPadding = 25;
const statCardWidth = (width - cardPadding * 4) / 3;

export default function HomeScreen() {
  const router = useRouter();
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedMed, setSelectedMed] = useState(null);
  const statsAnim = useRef(new Animated.Value(0)).current;
  const medicationAnims = useRef(medications.map(() => new Animated.Value(0))).current;

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

  const openModal = (med) => {
      setSelectedMed(med);
      setModalVisible(true);
  }

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

  return (
    <SafeAreaView style={styles.container}>
        <Header title="Hello, Ayush" showProfile={true} />

        <View style={styles.statsContainer}>
            <Animated.View style={[styles.statCard, styles.statCard1, statCardAnimationStyle]}>
                <Text style={styles.statValue}>10</Text>
                <Text style={styles.statLabel}>Taken</Text>
            </Animated.View>
            <Animated.View style={[styles.statCard, styles.statCard2, statCardAnimationStyle, {transitionDelay: '100ms'}]}>
                <Text style={styles.statValue}>2</Text>
                <Text style={styles.statLabel}>Missed</Text>
            </Animated.View>
            <Animated.View style={[styles.statCard, styles.statCard3, statCardAnimationStyle, {transitionDelay: '200ms'}]}>
                <Text style={styles.statValue}>3</Text>
                <Text style={styles.statLabel}>Pending</Text>
            </Animated.View>
        </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{paddingBottom: 100}}>

        <View style={styles.medicationSection}>
          <Text style={styles.sectionTitle}>Today's Medicines</Text>
          <TouchableOpacity onPress={() => router.push('/history')}>
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
                <TouchableOpacity onPress={() => openModal(med)}>
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
                </TouchableOpacity>
            </Animated.View>
        ))}

      </ScrollView>

        <Modal
            animationType="slide"
            transparent={true}
            visible={modalVisible}
            onRequestClose={() => {
                setModalVisible(!modalVisible);
            }}
        >
            <View style={styles.centeredView}>
                <View style={styles.modalView}>
                    <Text style={styles.modalText}>{selectedMed?.name}</Text>
                    <View style={styles.modalButtons}>
                        <TouchableOpacity style={[styles.modalButton, {backgroundColor: '#22C55E'}]} onPress={() => setModalVisible(false)}>
                            <Feather name="check" size={24} color="#FFFFFF" />
                            <Text style={styles.modalButtonText}>Taken</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={[styles.modalButton, {backgroundColor: '#EF4444'}]} onPress={() => setModalVisible(false)}>
                            <Feather name="x" size={24} color="#FFFFFF" />
                            <Text style={styles.modalButtonText}>Missed</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={[styles.modalButton, {backgroundColor: '#F59E0B'}]} onPress={() => setModalVisible(false)}>
                            <Feather name="clock" size={24} color="#FFFFFF" />
                            <Text style={styles.modalButtonText}>Take Later</Text>
                        </TouchableOpacity>
                    </View>
                    <TouchableOpacity
                        style={styles.closeButton}
                        onPress={() => setModalVisible(!modalVisible)}
                    >
                        <Text style={styles.textStyle}>Close</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </Modal>

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  statsContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      paddingHorizontal: cardPadding,
      marginTop: -25,
  },
  statCard: {
      borderRadius: 20,
      paddingVertical: 20,
      paddingHorizontal: 10,
      alignItems: 'center',
      width: statCardWidth,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 10 },
      shadowOpacity: 0.1,
      shadowRadius: 20,
      elevation: 10
  },
  statCard1: {
      backgroundColor: '#FFDDC1',
  },
  statCard2: {
      backgroundColor: '#C2E9FB',
  },
  statCard3: {
      backgroundColor: '#D4FFEA',
  },
  statValue: {
      fontSize: 28,
      fontWeight: 'bold',
      color: '#333333',
  },
  statLabel: {
      fontSize: 14,
      color: '#555555',
      marginTop: 6,
      fontWeight: '600',
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
    fontSize: 22,
    fontWeight: 'bold',
    color: '#1E293B',
  },
  seeAll: {
    color: '#4c669f',
    fontSize: 16,
    fontWeight: '700',
  },
  medicationCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 18,
    marginHorizontal: 20,
    marginTop: 15,
    flexDirection: 'row',
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
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
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalView: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 35,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5
  },
  modalText: {
    marginBottom: 15,
    textAlign: "center",
    fontSize: 20,
    fontWeight: 'bold',
  },
  modalButtons: {
      flexDirection: 'row',
      justifyContent: 'space-around',
      width: '100%',
  },
  modalButton: {
      borderRadius: 10,
      padding: 10,
      elevation: 2,
      flexDirection: 'row',
      alignItems: 'center',
  },
    modalButtonText: {
        color: 'white',
        fontWeight: 'bold',
        textAlign: 'center',
        marginLeft: 10,
    },
  closeButton: {
      marginTop: 20,
  },
  textStyle: {
      color: '#4c669f',
      fontWeight: 'bold',
      textAlign: 'center',
  },
});
