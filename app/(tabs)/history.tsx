import { StyleSheet, Text, View, ScrollView, SafeAreaView, TouchableOpacity, Animated, TextInput, Modal } from 'react-native';
import React, { useState, useRef, useCallback } from 'react';
import Header from '@/components/Header';
import { FontAwesome5 } from '@expo/vector-icons';
import { useFocusEffect } from 'expo-router';
import { fetchHistory } from '../../lib/database';

const HistoryScreen = () => {
  const [history, setHistory] = useState({});
  const [statusFilter, setStatusFilter] = useState('all');
  const [dateFilter, setDateFilter] = useState('');
  const [nameFilter, setNameFilter] = useState('');
  const [timeFilter, setTimeFilter] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const fadeAnim = useRef(new Animated.Value(0)).current;

  const loadHistory = useCallback(() => {
    try {
      const loadedHistory = fetchHistory();
      const grouped = loadedHistory.reduce((acc, item) => {
        const date = item.date;
        if (!acc[date]) {
          acc[date] = [];
        }
        acc[date].push(item);
        return acc;
      }, {});
      setHistory(grouped);
    } catch (error) {
      console.error("Failed to load history:", error);
      setHistory({});
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadHistory();
      fadeAnim.setValue(0);
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }).start();
    }, [loadHistory])
  );

  const getStatusStyle = (status) => {
    switch (status) {
      case 'taken':
        return { backgroundColor: '#22C55E', icon: 'check' };
      case 'missed':
        return { backgroundColor: '#EF4444', icon: 'times' };
      case 'snoozed':
        return { backgroundColor: '#F59E0B', icon: 'clock' };
      default:
        return { backgroundColor: '#64748B', icon: 'question' };
    }
  };

  const clearFilters = () => {
    setStatusFilter('all');
    setDateFilter('');
    setNameFilter('');
    setTimeFilter('');
  };

  const renderHistory = () => {
    const filteredHistory = Object.keys(history).reduce((acc, date) => {
      const items = history[date].filter(item => {
        const statusMatch = statusFilter === 'all' || item.status === statusFilter;
        const dateMatch = dateFilter === '' || date.includes(dateFilter);
        const nameMatch = nameFilter === '' || item.name.toLowerCase().includes(nameFilter.toLowerCase());
        const timeMatch = timeFilter === '' || item.time.includes(timeFilter);
        return statusMatch && dateMatch && nameMatch && timeMatch;
      });

      if (items.length > 0) {
        acc[date] = items;
      }
      return acc;
    }, {});

    if (Object.keys(filteredHistory).length === 0) {
      return <Text style={styles.noHistoryText}>No history records found.</Text>;
    }

    return Object.keys(filteredHistory).map(date => (
      <View key={date}>
        <Text style={styles.dateHeader}>{new Date(date).toDateString()}</Text>
        {filteredHistory[date].map((item) => (
          <Animated.View key={item.id} style={{ opacity: fadeAnim, transform: [{ translateY: fadeAnim.interpolate({ inputRange: [0, 1], outputRange: [20, 0] }) }] }}>
            <View style={styles.historyItem}>
              <View style={[styles.statusIcon, { backgroundColor: getStatusStyle(item.status).backgroundColor }]}>
                <FontAwesome5 name={getStatusStyle(item.status).icon} size={16} color="#FFFFFF" />
              </View>
              <View style={styles.historyDetails}>
                <Text style={styles.medicationName}>{item.name}</Text>
                <Text style={styles.medicationTime}>{`${item.frequency} at ${item.time}`}</Text>
              </View>
              <Text style={styles.statusText}>{item.status.charAt(0).toUpperCase() + item.status.slice(1)}</Text>
            </View>
          </Animated.View>
        ))}
      </View>
    ));
  };

  return (
    <SafeAreaView style={styles.container}>
      <Header title="Medication History" />
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search by medicine name..."
          value={nameFilter}
          onChangeText={setNameFilter}
        />
        <TouchableOpacity style={styles.filterBtn} onPress={() => setModalVisible(true)}>
          <FontAwesome5 name="filter" size={20} color="#4c669f" />
        </TouchableOpacity>
      </View>

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Filter Options</Text>
            <TextInput
              style={styles.input}
              placeholder="Filter by Date (YYYY-MM-DD)"
              value={dateFilter}
              onChangeText={setDateFilter}
            />
            <TextInput
              style={styles.input}
              placeholder="Filter by Time (HH:MM)"
              value={timeFilter}
              onChangeText={setTimeFilter}
            />
            <TouchableOpacity style={styles.applyButton} onPress={() => setModalVisible(false)}>
              <Text style={styles.applyButtonText}>Apply</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <View style={styles.filterContainer}>
        <TouchableOpacity style={[styles.filterButton, statusFilter === 'all' && styles.activeFilter]} onPress={() => setStatusFilter('all')}>
          <Text style={[styles.filterText, statusFilter === 'all' && styles.activeFilterText]}>All</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.filterButton, statusFilter === 'taken' && styles.activeFilter]} onPress={() => setStatusFilter('taken')}>
          <Text style={[styles.filterText, statusFilter === 'taken' && styles.activeFilterText]}>Taken</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.filterButton, statusFilter === 'missed' && styles.activeFilter]} onPress={() => setStatusFilter('missed')}>
          <Text style={[styles.filterText, statusFilter === 'missed' && styles.activeFilterText]}>Missed</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.filterButton, statusFilter === 'snoozed' && styles.activeFilter]} onPress={() => setStatusFilter('snoozed')}>
          <Text style={[styles.filterText, statusFilter === 'snoozed' && styles.activeFilterText]}>Snoozed</Text>
        </TouchableOpacity>
      </View>
      <TouchableOpacity style={styles.clearButton} onPress={clearFilters}>
          <Text style={styles.clearButtonText}>Clear Filters</Text>
        </TouchableOpacity>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.historyList}>
        {renderHistory()}
      </ScrollView>
    </SafeAreaView>
  );
};

export default HistoryScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  searchContainer: {
    flexDirection: 'row',
    padding: 10,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
  },
  searchInput: {
    flex: 1,
    height: 40,
    borderColor: '#E2E8F0',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    backgroundColor: '#F8F9FA',
  },
  filterBtn: {
    padding: 10,
    marginLeft: 10,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    padding: 20,
    borderRadius: 10,
    width: '80%',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  input: {
    height: 40,
    borderColor: '#E2E8F0',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    backgroundColor: '#F8F9FA',
    marginBottom: 10,
  },
  applyButton: {
    backgroundColor: '#4c669f',
    padding: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
  applyButtonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  filterContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 10,
    backgroundColor: '#FFFFFF',
  },
  filterButton: {
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 20,
    backgroundColor: '#F1F5F9',
  },
  activeFilter: {
    backgroundColor: '#4c669f',
  },
  filterText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#334155',
  },
  activeFilterText: {
    color: '#FFFFFF',
  },
  clearButton: {
    padding: 10,
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
  },
  clearButtonText: {
    color: '#4c669f',
    fontWeight: 'bold',
  },
  historyList: {
    padding: 20,
    paddingBottom: 100,
  },
  dateHeader: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#334155',
    marginBottom: 10,
    marginTop: 10,
  },
  historyItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 15,
    padding: 15,
    marginBottom: 15,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
  },
  statusIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  historyDetails: {
    flex: 1,
    marginLeft: 15,
  },
  medicationName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1E293B',
  },
  medicationTime: {
    fontSize: 14,
    color: '#64748B',
    marginTop: 4,
  },
  statusText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#334155',
  },
  noHistoryText: {
    textAlign: 'center',
    marginTop: 50,
    fontSize: 16,
    color: '#64748B',
  },
});
