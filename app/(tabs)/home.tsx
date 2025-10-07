import { StyleSheet, Text, View, TouchableOpacity, ScrollView, Animated, Dimensions, Modal, Alert, ImageBackground } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Feather } from '@expo/vector-icons';
import { useRouter, useFocusEffect } from 'expo-router';
import React, { useEffect, useRef, useState, useCallback } from 'react';
import Header from '@/components/Header';
import { getDashboardStats, getTodaysMedicinesWithStatus, updateHistoryEvent } from '../../lib/database';
import AsyncStorage from "@react-native-async-storage/async-storage";

const { width } = Dimensions.get('window');

const healthQuotes = [
  "The greatest wealth is health.",
  "A healthy outside starts from the inside.",
  "To keep the body in good health is a duty, otherwise we shall not be able to keep our mind strong and clear.",
  "He who has health has hope; and he who has hope, has everything.",
  "Take care of your body. It’s the only place you have to live."
];

const getStatusStyle = (status) => {
    switch (status) {
        case 'taken':
            return { color: '#22C55E', icon: 'check-circle' };
        case 'missed':
            return { color: '#EF4444', icon: 'x-circle' };
        case 'snoozed':
            return { color: '#F59E0B', icon: 'clock' };
        default:
            return { color: '#64748B', icon: 'help-circle' }; // Pending
    }
};

export default function HomeScreen() {
  const router = useRouter();
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedMed, setSelectedMed] = useState(null);
  const [medicines, setMedicines] = useState([]);
  const [stats, setStats] = useState({ taken: 0, missed: 0, pending: 0 });
  const [userName, setUserName] = useState('User');
  const [quoteIndex, setQuoteIndex] = useState(0);

  const animations = {
    stats: useRef(new Animated.Value(0)).current,
    list: useRef(new Animated.Value(0)).current,
  }

  useEffect(() => {
    const updateQuote = async () => {
      const lastUpdated = await AsyncStorage.getItem('quoteLastUpdated');
      const now = new Date();

      if (lastUpdated) {
        const lastUpdatedDate = new Date(lastUpdated);
        const diffInHours = (now - lastUpdatedDate) / (1000 * 60 * 60);
        if (diffInHours < 24) {
          const storedQuoteIndex = await AsyncStorage.getItem('quoteIndex');
          if (storedQuoteIndex) {
            setQuoteIndex(parseInt(storedQuoteIndex, 10));
          }
          return;
        }
      }

      const newIndex = Math.floor(Math.random() * healthQuotes.length);
      setQuoteIndex(newIndex);
      await AsyncStorage.setItem('quoteIndex', newIndex.toString());
      await AsyncStorage.setItem('quoteLastUpdated', now.toISOString());
    };

    updateQuote();
  }, []);

  const loadData = useCallback(() => {
    try {
      const today = new Date().toISOString().split('T')[0];
      setMedicines(getTodaysMedicinesWithStatus(today));
      setStats(getDashboardStats(today));
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
      Animated.parallel([
        Animated.timing(animations.stats, {
          toValue: 1,
          duration: 600,
          useNativeDriver: true,
        }),
        Animated.timing(animations.list, {
          toValue: 1,
          duration: 600,
          delay: 200, // Stagger the animation
          useNativeDriver: true,
        }),
      ]).start();
    }, [loadData])
  );

  const handleHistoryEvent = (status) => {
    if (!selectedMed) return;

    try {
      const today = new Date().toISOString().split('T')[0];
      updateHistoryEvent(selectedMed.id, selectedMed.name, status, today, selectedMed.time);
      setModalVisible(false);
      loadData(); // Refresh data
    } catch (error) {
      console.error(`Failed to mark as ${status}:`, error);
      Alert.alert("Error", `Could not mark as ${status}.`);
    }
  };

  const openModal = (med) => {
    setSelectedMed(med);
    setModalVisible(true);
  }

  const animatedStyles = {
    statCard: (index) => ({
        opacity: animations.stats,
        transform: [
            {
                translateY: animations.stats.interpolate({
                    inputRange: [0, 1],
                    outputRange: [50, 0],
                })
            },
        ],
        transitionDelay: `${index * 100}ms`,
    }),
    list: {
        opacity: animations.list,
    },
  };

  return (
    <SafeAreaView style={styles.container}>
        <Header title={`Hello, ${userName}`} showProfile={true} name={userName} />
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{paddingBottom: 100}}>
            
            <View style={styles.quoteCarousel}>
                <Feather name="heart" size={24} color="#D66E5A" />
                <Text style={styles.quoteText}>{healthQuotes[quoteIndex]}</Text>
            </View>

            <View style={styles.statsContainer}>
                <Animated.View style={[styles.statCard, {backgroundColor: '#D4FFEA'}, animatedStyles.statCard(0)]}>
                    <Feather name="check-circle" size={24} color="#10B981" />
                    <Text style={styles.statValue}>{stats.taken}</Text>
                    <Text style={styles.statLabel}>Taken</Text>
                </Animated.View>
                <Animated.View style={[styles.statCard, {backgroundColor: '#FFDDC1'}, animatedStyles.statCard(1)]}>
                    <Feather name="x-circle" size={24} color="#F97316" />
                    <Text style={styles.statValue}>{stats.missed}</Text>
                    <Text style={styles.statLabel}>Missed</Text>
                </Animated.View>
                <Animated.View style={[styles.statCard, {backgroundColor: '#C2E9FB'}, animatedStyles.statCard(2)]}>
                    <Feather name="clock" size={24} color="#0284C7" />
                    <Text style={styles.statValue}>{stats.pending}</Text>
                    <Text style={styles.statLabel}>Pending</Text>
                </Animated.View>
            </View>

            <View style={styles.medicationSection}>
                <Text style={styles.sectionTitle}>Today's Medicines</Text>
                <TouchableOpacity onPress={() => router.push('/history')}>
                    <Text style={styles.seeAll}>See All</Text>
                </TouchableOpacity>
            </View>

            <Animated.View style={animatedStyles.list}>
                {medicines.length > 0 ? medicines.map((med, index) => {
                    const statusStyle = getStatusStyle(med.status);
                    return (
                        <TouchableOpacity key={index} onPress={() => openModal(med)} style={styles.medicationCard}>
                          <View style={[styles.statusIndicator, {borderColor: statusStyle.color}]}>
                              <Feather name={statusStyle.icon} size={22} color={statusStyle.color} />
                          </View>
                          <View style={styles.medicationInfo}>
                              <Text style={styles.medicationName}>{med.name}</Text>
                              <Text style={styles.medicationDosage}>{med.dosage}</Text>
                          </View>
                          <Text style={styles.medicationTime}>{med.time}</Text>
                        </TouchableOpacity>
                    );
                }) : (
                    <View style={styles.noMedicationContainer}>
                        <Feather name="info" size={24} color="#64748B" />
                        <Text style={styles.noMedicationText}>No medicines for today.</Text>
                    </View>
                )}
            </Animated.View>
        </ScrollView>

        <Modal
            animationType="fade"
            transparent={true}
            visible={modalVisible}
            onRequestClose={() => setModalVisible(false)}
        >
            <View style={styles.centeredView}>
                <View style={styles.modalView}>
                    <Text style={styles.modalText}>{selectedMed?.name}</Text>
                    <Text style={styles.modalSubText}>{selectedMed?.dosage} - {selectedMed?.time}</Text>
                    <View style={styles.modalButtons}>
                        <TouchableOpacity style={[styles.modalButton, {backgroundColor: '#22C55E'}]} onPress={() => handleHistoryEvent('taken')}>
                            <Feather name="check" size={20} color="#FFFFFF" />
                            <Text style={styles.modalButtonText}>Taken</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={[styles.modalButton, {backgroundColor: '#EF4444'}]} onPress={() => handleHistoryEvent('missed')}>
                            <Feather name="x" size={20} color="#FFFFFF" />
                            <Text style={styles.modalButtonText}>Missed</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={[styles.modalButton, {backgroundColor: '#F59E0B'}]} onPress={() => handleHistoryEvent('snoozed')}>
                            <Feather name="clock" size={20} color="#FFFFFF" />
                            <Text style={styles.modalButtonText}>Snooze</Text>
                        </TouchableOpacity>
                    </View>
                    <TouchableOpacity
                        style={styles.closeButton}
                        onPress={() => setModalVisible(false)}
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
        backgroundColor: '#F0F4F8',
    },
    quoteCarousel: {
        backgroundColor: '#FFFFFF',
        borderRadius: 20,
        padding: 20,
        marginHorizontal: 20,
        marginVertical: 15,
        elevation: 3,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        flexDirection: 'row',
        alignItems: 'center',
    },
    quoteText: {
        fontSize: 15,
        fontStyle: 'italic',
        color: '#4A5568',
        textAlign: 'center',
        flex: 1,
        marginLeft: 15,
    },
    statsContainer: {
        flexDirection: 'row',
        gap: 15,
        paddingHorizontal: 20,
        marginBottom: 20,
    },
    statCard: {
        flex: 1,
        borderRadius: 20,
        paddingVertical: 20,
        paddingHorizontal: 10,
        alignItems: 'center',
        justifyContent: 'center',
        elevation: 4,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
    },
    statValue: {
        fontSize: 26,
        fontWeight: 'bold',
        color: '#1E293B',
        marginTop: 8,
    },
    statLabel: {
        fontSize: 13,
        color: '#475569',
        marginTop: 4,
        fontWeight: '500',
    },
    medicationSection: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 25,
        marginBottom: 10,
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#1E293B',
    },
    seeAll: {
        color: '#D66E5A',
        fontSize: 15,
        fontWeight: '700',
    },
    medicationCard: {
        backgroundColor: '#FFFFFF',
        borderRadius: 15,
        padding: 20,
        marginHorizontal: 20,
        marginTop: 10,
        flexDirection: 'row',
        alignItems: 'center',
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
    },
    statusIndicator: {
        width: 44,
        height: 44,
        borderRadius: 22,
        borderWidth: 2,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 15,
    },
    medicationInfo: {
        flex: 1,
    },
    medicationName: {
        fontSize: 17,
        fontWeight: 'bold',
        color: '#2D3748',
    },
    medicationDosage: {
        fontSize: 14,
        color: '#718096',
        marginTop: 4,
    },
    medicationTime: {
        fontSize: 16,
        fontWeight: '600',
        color: '#4A5568',
    },
    centeredView: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: 'rgba(0,0,0,0.6)',
    },
    modalView: {
        width: '85%',
        backgroundColor: 'white',
        borderRadius: 20,
        padding: 30,
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
        fontSize: 22,
        fontWeight: 'bold',
        color: '#2D3748',
        textAlign: "center",
    },
    modalSubText: {
        fontSize: 16,
        color: '#4A5568',
        marginBottom: 25,
        textAlign: 'center',
    },
    modalButtons: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
        marginBottom: 20,
    },
    modalButton: {
        borderRadius: 15,
        paddingVertical: 12,
        paddingHorizontal: 15,
        flexDirection: 'row',
        alignItems: 'center',
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
    },
    modalButtonText: {
        color: 'white',
        fontWeight: 'bold',
        textAlign: 'center',
        marginLeft: 8,
    },
    closeButton: {
        marginTop: 10,
    },
    textStyle: {
        color: '#D66E5A',
        fontWeight: 'bold',
        textAlign: 'center',
        fontSize: 16,
    },
    noMedicationContainer: {
        alignItems: 'center',
        marginTop: 40,
        paddingHorizontal: 20,
    },
    noMedicationText: {
        fontSize: 16,
        color: '#64748B',
        textAlign: 'center',
        marginTop: 10,
    },
});
