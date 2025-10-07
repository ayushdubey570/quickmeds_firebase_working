import * as SQLite from 'expo-sqlite';

const db = SQLite.openDatabaseSync('medicines.db');

// Function to initialize the database
const init = () => {
  try {
    // Create the medicines table if it doesn't exist
    db.execSync(`
      CREATE TABLE IF NOT EXISTS medicines (
        id INTEGER PRIMARY KEY NOT NULL,
        name TEXT NOT NULL,
        dosage TEXT NOT NULL,
        times TEXT NOT NULL,
        frequency TEXT NOT NULL,
        selectedDays TEXT
      );
    `);

    // Create the history table if it doesn't exist
    db.execSync(`
      CREATE TABLE IF NOT EXISTS history (
        id INTEGER PRIMARY KEY NOT NULL,
        medicine_id INTEGER NOT NULL,
        status TEXT NOT NULL,
        date TEXT NOT NULL,
        time TEXT NOT NULL,
        UNIQUE(medicine_id, date, time),
        FOREIGN KEY (medicine_id) REFERENCES medicines (id)
      );
    `);
    console.log('Database initialized.');
  } catch (error) {
    console.error('Database initialization failed', error);
  }
};

// Initialize the database when the module is loaded
init();

// Function to insert a new medicine
export const insertMedicine = (name, dosage, times, frequency, selectedDays) => {
    try {
        return db.runSync(
            'INSERT INTO medicines (name, dosage, times, frequency, selectedDays) VALUES (?, ?, ?, ?, ?)',
            [name, dosage, JSON.stringify(times), frequency, JSON.stringify(selectedDays)]
        );
    } catch (error) {
        console.error('Failed to insert medicine', error);
        throw error;
    }
};

// Function to fetch all medicines
export const fetchMedicines = () => {
    try {
        return db.getAllSync('SELECT * FROM medicines');
    } catch (error) {
        console.error('Failed to fetch medicines', error);
        return [];
    }
};

// Function to delete a medicine
export const deleteMedicine = (id) => {
    try {
        return db.runSync('DELETE FROM medicines WHERE id = ?', [id]);
    } catch (error) {
        console.error('Failed to delete medicine', error);
        throw error;
    }
};

// Function to update a history event
export const updateHistoryEvent = (medicine_id, status, date, time) => {
    try {
        return db.runSync(
            'INSERT INTO history (medicine_id, status, date, time) VALUES (?, ?, ?, ?) ON CONFLICT(medicine_id, date, time) DO UPDATE SET status = excluded.status',
            [medicine_id, status, date, time]
        );
    } catch (error) {
        console.error('Failed to update history event', error);
        throw error;
    }
};

// Function to fetch the entire medication history
export const fetchHistory = () => {
    try {
        return db.getAllSync(`
            SELECT h.id, COALESCE(m.name, 'Deleted Medicine') as name, m.frequency, h.status, h.date, h.time
            FROM history h
            LEFT JOIN medicines m ON h.medicine_id = m.id
            ORDER BY h.date DESC, h.time DESC
        `);
    } catch (error) {
        console.error('Failed to fetch history', error);
        return [];
    }
};

// Function to get today's medicines with their status
export const getTodaysMedicinesWithStatus = (date) => {
    try {
        const dayOfWeek = new Date(date).getDay();
        const allMedicines = fetchMedicines();
        const historyToday = db.getAllSync('SELECT * FROM history WHERE date = ?', [date]);

        const statusMap = historyToday.reduce((acc, item) => {
            acc[`${item.medicine_id}-${item.time}`] = item.status;
            return acc;
        }, {});

        const allOccurrences = [];
        allMedicines.forEach(med => {
            const isToday = med.frequency === 'Daily' || (med.frequency === 'Custom' && JSON.parse(med.selectedDays).includes(dayOfWeek));
            if (isToday) {
                const times = JSON.parse(med.times);
                times.forEach(time => {
                    const status = statusMap[`${med.id}-${time}`] || 'pending';
                    allOccurrences.push({ ...med, time, status });
                });
            }
        });
        return allOccurrences;
    } catch (error) {
        console.error("Failed to load medicines with status:", error);
        return [];
    }
};

// Function to get dashboard statistics for a given date
export const getDashboardStats = (date) => {
    try {
        const todaysMedicines = getTodaysMedicinesWithStatus(date);

        const taken = todaysMedicines.filter(med => med.status === 'taken').length;
        const missed = todaysMedicines.filter(med => med.status === 'missed').length;
        const pending = todaysMedicines.filter(med => med.status === 'pending' || med.status === 'snoozed').length;

        return {
            taken,
            missed,
            pending,
        };
    } catch (error) {
        console.error('Failed to get dashboard stats', error);
        return { taken: 0, missed: 0, pending: 0 };
    }
};

// Function to get adherence statistics
export const getAdherenceStats = () => {
    try {
        const history = db.getAllSync('SELECT * FROM history');

        const taken = history.filter(h => h.status === 'taken').length;
        const missed = history.filter(h => h.status === 'missed').length;
        const snoozed = history.filter(h => h.status === 'snoozed').length;

        return {
            taken,
            missed,
            snoozed,
        };
    } catch (error) {
        console.error('Failed to get adherence stats', error);
        return { taken: 0, missed: 0, snoozed: 0 };
    }
};

// Function to get adherence data for reports
export const getAdherenceData = () => {
    try {
        const history = db.getAllSync('SELECT * FROM history');
        const medicines = db.getAllSync('SELECT * FROM medicines');

        if (history.length === 0) {
            return {
                pieChartData: [],
                weekly: { labels: [], data: [] },
                monthly: { labels: [], data: [] },
                overallAdherence: 0,
                totalMedicines: medicines.length,
            };
        }

        const taken = history.filter(h => h.status === 'taken').length;
        const missed = history.filter(h => h.status === 'missed').length;
        const pending = history.filter(h => h.status === 'pending' || h.status === 'snoozed').length;

        const overallAdherence = (taken + missed) > 0 ? Math.round((taken / (taken + missed)) * 100) : 0;

        // Weekly Adherence Chart
        const weeklyLabels = [];
        const weeklyData = [];
        const today = new Date();
        for (let i = 6; i >= 0; i--) {
            const date = new Date(today);
            date.setDate(today.getDate() - i);
            const dateString = date.toISOString().split('T')[0];
            
            const dayHistory = history.filter(h => h.date === dateString);
            const takenDay = dayHistory.filter(h => h.status === 'taken').length;
            const missedDay = dayHistory.filter(h => h.status === 'missed').length;

            const dayAdherence = (takenDay + missedDay) > 0
                ? Math.round((takenDay / (takenDay + missedDay)) * 100)
                : 0;
            
            weeklyLabels.push(date.toLocaleDateString('en-US', { weekday: 'short' }));
            weeklyData.push(dayAdherence);
        }

        // Monthly Adherence Chart
        const monthlyLabels = [];
        const monthlyData = [];
        const currentMonth = new Date(today.getFullYear(), today.getMonth(), 1);
        for (let i = 5; i >= 0; i--) {
            const monthDate = new Date(currentMonth);
            monthDate.setMonth(currentMonth.getMonth() - i);
            const year = monthDate.getFullYear();
            const month = monthDate.getMonth();

            const monthHistory = history.filter(h => {
                const hDate = new Date(h.date);
                return hDate.getFullYear() === year && hDate.getMonth() === month;
            });

            const takenMonth = monthHistory.filter(h => h.status === 'taken').length;
            const missedMonth = monthHistory.filter(h => h.status === 'missed').length;

            const monthAdherence = (takenMonth + missedMonth) > 0
                ? Math.round((takenMonth / (takenMonth + missedMonth)) * 100)
                : 0;
            
            monthlyLabels.push(monthDate.toLocaleDateString('en-US', { month: 'short' }));
            monthlyData.push(monthAdherence);
        }

        return {
            pieChartData: [
                { name: "Taken", count: taken, color: "#22C55E", legendFontColor: "#7F7F7F", legendFontSize: 15 },
                { name: "Missed", count: missed, color: "#EF4444", legendFontColor: "#7F7F7F", legendFontSize: 15 },
                { name: "Pending", count: pending, color: "#F59E0B", legendFontColor: "#7F7F7F", legendFontSize: 15 },
            ],
            weekly: { labels: weeklyLabels, data: weeklyData },
            monthly: { labels: monthlyLabels, data: monthlyData },
            overallAdherence,
            totalMedicines: medicines.length,
        };

    } catch (error) {
        console.error('Failed to get adherence data', error);
        return {
            pieChartData: [],
            weekly: { labels: [], data: [] },
            monthly: { labels: [], data: [] },
            overallAdherence: 0,
            totalMedicines: 0,
        };
    }
};
