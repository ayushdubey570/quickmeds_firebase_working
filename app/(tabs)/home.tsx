import { StyleSheet, Text, View, TouchableOpacity, ScrollView, SafeAreaView, Animated, Dimensions, Modal, Alert } from "react-native";
import { Feather, FontAwesome5 } from '@expo/vector-icons';
import { useRouter, useFocusEffect } from 'expo-router';
import React, { useEffect, useRef, useState, useCallback } from 'react';
import Header from '@/components/Header';
import { getDashboardStats, getTodaysMedicinesWithStatus, updateHistoryEvent } from '../../lib/database';
import AsyncStorage from "@react-native-async-storage/async-storage";

const { width } = Dimensions.get('window');
const cardPadding = 25;
const statCardWidth = (width - cardPadding * 4) / 3;

const getStatusStyle = (status) => {
    switch (status) {
        case 'taken':
            return { color: '#22C55E', icon: 'check' };
        case 'missed':
            return { color: '#EF4444', icon: 'times' };
        case 'snoozed':
            return { color: '#F59E0B', icon: 'clock' };
        default:
            return { color: '#64748B', icon: 'clock' }; // Pending
    }
};

export default function HomeScreen() {
  const router = useRouter();
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedMed, setSelectedMed] = useState(null);
  const [medicines, setMedicines] = useState([]);
  const [stats, setStats] = useState({ taken: 0, missed: 0, pending: 0 });
  const statsAnim = useRef(new Animated.Value(0)).current;
  const listAnim = useRef(new Animated.Value(0)).current;
  const [userName, setUserName] = useState('User');

  const loadData = useCallback(() => {
    try {
      const today = new Date().toISOString().split('T')[0];
      const todaysMedicines = getTodaysMedicinesWithStatus(today);
      const todayStats = getDashboardStats(today);
      setMedicines(todaysMedicines);
      setStats(todayStats);
    } catch (error) {
      console.error("Failed to load data:", error);
      Alert.alert("Error", "Could not load data.");
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      const fetchUserName = async () => {
        const name = await AsyncStorage.getItem('userName');
        setUserName(name || 'User');
      };
      fetchUserName();
      loadData();
      listAnim.setValue(0);
      Animated.timing(listAnim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }).start();
    }, [loadData])
  );

  useEffect(() => {
    Animated.timing(statsAnim, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start();
  }, []);

  const handleHistoryEvent = (status) => {
    if (!selectedMed) return;

    try {
      const today = new Date().toISOString().split('T')[0];
      updateHistoryEvent(selectedMed.id, status, today, selectedMed.time);
      setModalVisible(false);
      loadData();
    } catch (error) {
      console.error(`Failed to mark as ${status}:`, error);
      Alert.alert("Error", `Could not mark as ${status}.`);
    }
  };

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

  const listAnimationStyle = {
    opacity: listAnim,
    transform: [
        {
            translateY: listAnim.interpolate({
                inputRange: [0, 1],
                outputRange: [30, 0],
            })
        },
    ],
  };

  return (
    <SafeAreaView style={styles.container}>
        <Header title={`Hello, ${userName}`} showProfile={true} name={userName} />

        <View style={styles.statsContainer}>
            <Animated.View style={[styles.statCard, {backgroundColor: '#FFDDC1'}, statCardAnimationStyle]}>
                <Text style={styles.statValue}>{stats.taken}</Text>
                <Text style={styles.statLabel}>Taken</Text>
            </Animated.View>
            <Animated.View style={[styles.statCard, {backgroundColor: '#C2E9FB'}, statCardAnimationStyle, {transitionDelay: '100ms'}]}>
                <Text style={styles.statValue}>{stats.missed}</Text>
                <Text style={styles.statLabel}>Missed</Text>
            </Animated.View>
            <Animated.View style={[styles.statCard, {backgroundColor: '#D4FFEA'}, statCardAnimationStyle, {transitionDelay: '200ms'}]}>
                <Text style={styles.statValue}>{stats.pending}</Text>
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

            <Animated.View style={listAnimationStyle}>
                {medicines.length > 0 ? medicines.map((med, index) => {
                    const statusStyle = getStatusStyle(med.status);
                    return (
                        <TouchableOpacity key={`${med.id}-${index}`} onPress={() => openModal(med)}>
                            <View style={styles.medicationCard}>
                                <View style={[styles.statusIndicator, {backgroundColor: statusStyle.color}]}>
                                    <FontAwesome5 name={statusStyle.icon} size={16} color="#FFFFFF" />
                                </View>
                                <View style={styles.medicationInfo}>
                                    <Text style={styles.medicationName}>{med.name}</Text>
                                    <Text style={styles.medicationDosage}>{med.dosage}</Text>
                                </View>
                                <Text style={styles.medicationTime}>{med.time}</Text>
                            </View>
                        </TouchableOpacity>
                    );
                }) : (
                    <View style={styles.noMedicationContainer}>
                        <Text style={styles.noMedicationText}>No medicines for today.</Text>
                    </View>
                )}
            </Animated.View>
        </ScrollView>

        <Modal
            animationType="slide"
            transparent={true}
            visible={modalVisible}
            onRequestClose={() => setModalVisible(!modalVisible)}
        >
            <View style={styles.centeredView}>
                <View style={styles.modalView}>
                    <Text style={styles.modalText}>{selectedMed?.name}</Text>
                    <View style={styles.modalButtons}>
                        <TouchableOpacity style={[styles.modalButton, {backgroundColor: '#22C55E'}]} onPress={() => handleHistoryEvent('taken')}>
                            <Feather name="check" size={24} color="#FFFFFF" />
                            <Text style={styles.modalButtonText}>Taken</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={[styles.modalButton, {backgroundColor: '#EF4444'}]} onPress={() => handleHistoryEvent('missed')}>
                            <Feather name="x" size={24} color="#FFFFFF" />
                            <Text style={styles.modalButtonText}>Missed</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={[styles.modalButton, {backgroundColor: '#F59E0B'}]} onPress={() => handleHistoryEvent('snoozed')}>
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
    avatarContainer: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#E2E8F0',
        justifyContent: 'center',
        alignItems: 'center',
      },
      avatarText: {
        fontSize: 18,
        color: '#4c669f',
        fontWeight: 'bold',
      },
    statsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: cardPadding,
        marginTop: 5,
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
    noMedicationContainer: {
        alignItems: 'center',
        marginTop: 50,
        paddingHorizontal: 20,
    },
    noMedicationText: {
        fontSize: 16,
        color: '#64748B',
        textAlign: 'center',
    },
});