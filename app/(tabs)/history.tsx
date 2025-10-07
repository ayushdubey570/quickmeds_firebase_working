import { StyleSheet, Text, View, ScrollView, SafeAreaView, TouchableOpacity, Animated, TextInput, Modal, Alert } from 'react-native';
import React, { useState, useRef, useCallback } from 'react';
import Header from '@/components/Header';
import { Feather } from '@expo/vector-icons';
import { useFocusEffect } from 'expo-router';
import { fetchHistory, clearHistory } from '../../lib/database';

const HistoryScreen = () => {
  const [history, setHistory] = useState({});
  const [statusFilter, setStatusFilter] = useState('all');
  const [dateFilter, setDateFilter] = useState('all');
  const [nameFilter, setNameFilter] = useState('');
  const [filterModalVisible, setFilterModalVisible] = useState(false);
  const [infoModalVisible, setInfoModalVisible] = useState(false);
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

  const handleDeleteAll = () => {
    Alert.alert(
      "Delete History",
      "Are you sure you want to delete all medication history? This action cannot be undone.",
      [
        { text: "Cancel", style: "cancel" },
        { 
          text: "Delete", 
          style: "destructive", 
          onPress: () => {
            try {
              clearHistory();
              loadHistory();
              Alert.alert("Success", "Medication history has been cleared.");
            } catch (error) {
              Alert.alert("Error", "Failed to clear medication history.");
            }
          }
        }
      ]
    );
  };

  const getStatusStyle = (status) => {
    switch (status) {
      case 'taken':
        return { backgroundColor: '#E8F5E9', color: '#4CAF50', icon: 'check-circle' };
      case 'missed':
        return { backgroundColor: '#FFEBEE', color: '#F44336', icon: 'x-circle' };
      case 'snoozed':
        return { backgroundColor: '#FFFDE7', color: '#FFC107', icon: 'clock' };
      default:
        return { backgroundColor: '#F5F5F5', color: '#9E9E9E', icon: 'help-circle' };
    }
  };

  const clearFilters = () => {
    setStatusFilter('all');
    setDateFilter('all');
    setNameFilter('');
    setFilterModalVisible(false);
  };

  const renderHistory = () => {
    const filteredHistory = Object.keys(history).reduce((acc, date) => {
      const items = history[date].filter(item => {
        const statusMatch = statusFilter === 'all' || item.status === statusFilter;
        const nameMatch = nameFilter === '' || item.name.toLowerCase().includes(nameFilter.toLowerCase());
        
        let dateMatch = false;
        if (dateFilter === 'all') {
          dateMatch = true;
        } else {
          const today = new Date();
          const itemDate = new Date(date);
          if (dateFilter === 'today') {
            dateMatch = itemDate.toDateString() === today.toDateString();
          } else if (dateFilter === 'yesterday') {
            const yesterday = new Date();
            yesterday.setDate(today.getDate() - 1);
            dateMatch = itemDate.toDateString() === yesterday.toDateString();
          } else if (dateFilter === 'last7days') {
            const last7days = new Date();
            last7days.setDate(today.getDate() - 7);
            dateMatch = itemDate >= last7days;
          }
        }
        
        return statusMatch && nameMatch && dateMatch;
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
        {filteredHistory[date].map((item) => {
            const statusStyle = getStatusStyle(item.status)
            return (
              <Animated.View key={item.id} style={{ opacity: fadeAnim, transform: [{ translateY: fadeAnim.interpolate({ inputRange: [0, 1], outputRange: [20, 0] }) }] }}>
                <View style={styles.historyItem}>
                  <View style={[styles.statusIcon, { backgroundColor: statusStyle.backgroundColor }]}>
                    <Feather name={statusStyle.icon} size={20} color={statusStyle.color} />
                  </View>
                  <View style={styles.historyDetails}>
                    <Text style={styles.medicationName}>{item.name}</Text>
                    <Text style={styles.medicationTime}>{`at ${item.time}`}</Text>
                  </View>
                  <Text style={[styles.statusText, {color: statusStyle.color}]}>{item.status.charAt(0).toUpperCase() + item.status.slice(1)}</Text>
                </View>
              </Animated.View>
            )
        })}
      </View>
    ));
  };

  const FilterOption = ({value, label, icon, currentFilter, setFilter}) => (
    <TouchableOpacity 
        style={[styles.filterOption, currentFilter === value && styles.activeFilterOption]} 
        onPress={() => setFilter(value)}>
        <Feather name={icon} size={20} color={currentFilter === value ? '#FFFFFF' : '#4c669f'} />
        <Text style={[styles.filterOptionText, currentFilter === value && styles.activeFilterOptionText]}>{label}</Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <Header title="Medication History" />
      <View style={styles.searchContainer}>
        <View style={styles.searchInputWrapper}>
          <Feather name="search" size={20} color="#9E9E9E" style={{marginLeft: 10}} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search by medicine name..."
            value={nameFilter}
            onChangeText={setNameFilter}
            placeholderTextColor="#9E9E9E"
          />
        </View>
        <View style={styles.headerActions}>
          <TouchableOpacity style={styles.toolButton} onPress={() => setInfoModalVisible(true)}>
              <Feather name="help-circle" size={22} color="#4c669f" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.toolButton} onPress={handleDeleteAll}>
              <Feather name="trash-2" size={22} color="#EF4444" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.toolButton} onPress={() => setFilterModalVisible(true)}>
            <Feather name="filter" size={22} color="#4c669f" />
          </TouchableOpacity>
        </View>
      </View>

      <Modal
        animationType="fade"
        transparent={true}
        visible={filterModalVisible}
        onRequestClose={() => setFilterModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Filter Options</Text>
            <View style={styles.filterGroup}>
                <Text style={styles.filterLabel}>Status</Text>
                <View style={styles.filterOptionsContainer}>
                    <FilterOption value="all" label="All" icon="list" currentFilter={statusFilter} setFilter={setStatusFilter} />
                    <FilterOption value="taken" label="Taken" icon="check-circle" currentFilter={statusFilter} setFilter={setStatusFilter} />
                    <FilterOption value="missed" label="Missed" icon="x-circle" currentFilter={statusFilter} setFilter={setStatusFilter} />
                    <FilterOption value="snoozed" label="Snoozed" icon="clock" currentFilter={statusFilter} setFilter={setStatusFilter} />
                </View>
            </View>
            <View style={styles.filterGroup}>
                <Text style={styles.filterLabel}>Date</Text>
                <View style={styles.filterOptionsContainer}>
                    <FilterOption value="all" label="All Time" icon="calendar" currentFilter={dateFilter} setFilter={setDateFilter} />
                    <FilterOption value="today" label="Today" icon="sun" currentFilter={dateFilter} setFilter={setDateFilter} />
                    <FilterOption value="yesterday" label="Yesterday" icon="arrow-left" currentFilter={dateFilter} setFilter={setDateFilter} />
                    <FilterOption value="last7days" label="Last 7 Days" icon="bar-chart-2" currentFilter={dateFilter} setFilter={setDateFilter} />
                </View>
            </View>
            <View style={styles.modalActions}>
              <TouchableOpacity style={styles.clearButton} onPress={clearFilters}>
                <Text style={styles.clearButtonText}>Clear Filters</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.applyButton} onPress={() => setFilterModalVisible(false)}>
                <Text style={styles.applyButtonText}>Apply</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
      <Modal
        animationType="fade"
        transparent={true}
        visible={infoModalVisible}
        onRequestClose={() => setInfoModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.infoModalContent}>
            <TouchableOpacity style={styles.infoModalCloseButton} onPress={() => setInfoModalVisible(false)}>
              <Feather name="x" size={24} color="#334155" />
            </TouchableOpacity>
            <Feather name="info" size={40} color="#4c669f" style={{alignSelf: 'center', marginBottom: 15}}/>
            <Text style={styles.infoText}>
              Even after deleting medicines from the \"Manage Your Medicine\" screen, they remain visible in the history for your convenience.
            </Text>
          </View>
        </View>
      </Modal>

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
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 10,
  },
  toolButton: {
    padding: 10,
  },
  searchContainer: {
    flexDirection: 'row',
    paddingHorizontal: 15,
    paddingVertical: 10,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0'
  },
  searchInputWrapper: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F1F5F9',
    borderRadius: 12,
  },
  searchInput: {
    flex: 1,
    height: 45,
    paddingHorizontal: 10,
    fontSize: 16,
    color: '#334155'
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 25,
    width: '90%',
  },
  infoModalContent: {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: 20,
    padding: 30,
    paddingTop: 40,
    width: '90%',
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    position: 'relative',
  },
  infoModalCloseButton: {
    position: 'absolute',
    top: 15,
    right: 15,
    zIndex: 1,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#334155',
    textAlign: 'center'
  },
  filterGroup: {
      marginBottom: 20,
  },
  filterLabel: {
      fontSize: 18,
      fontWeight: '600',
      color: '#475569',
      marginBottom: 15,
  },
  filterOptionsContainer: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: 10,
  },
  filterOption: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: 10,
      paddingHorizontal: 15,
      backgroundColor: '#F1F5F9',
      borderRadius: 20,
      borderWidth: 1,
      borderColor: '#E2E8F0'
  },
  activeFilterOption: {
      backgroundColor: '#4c669f',
      borderColor: '#4c669f'
  },
  filterOptionText: {
      marginLeft: 8,
      fontSize: 14,
      fontWeight: '600',
      color: '#4c669f'
  },
  activeFilterOptionText: {
      color: '#FFFFFF'
  },
  modalActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  applyButton: {
    backgroundColor: '#4c669f',
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
    flex: 1,
  },
  applyButtonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 16
  },
  clearButton: {
    backgroundColor: '#F1F5F9',
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center
    flex: 1,
    marginRight: 10,
  },
  clearButtonText: {
    color: '#4c669f',
    fontWeight: 'bold',
    fontSize: 16
  },
  historyList: {
    padding: 20,
    paddingBottom: 100,
  },
  dateHeader: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#334155',
    marginBottom: 15,
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
    width: 45,
    height: 45,
    borderRadius: 22.5,
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
  },
  noHistoryText: {
    textAlign: 'center',
    marginTop: 50,
    fontSize: 16,
    color: '#64748B',
  },
  infoText: {
    fontSize: 16,
    fontStyle: 'italic',
    color: '#4A5568',
    textAlign: 'center',
    marginBottom: 15,
    lineHeight: 24,
  },
});
