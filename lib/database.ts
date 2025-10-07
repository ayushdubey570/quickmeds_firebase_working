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

// Function to get dashboard statistics for a given date
export const getDashboardStats = (date) => {
    try {
        const taken = db.getFirstSync(
            "SELECT COUNT(*) as count FROM history h JOIN medicines m ON h.medicine_id = m.id WHERE h.status = 'taken' AND h.date = ?",
            [date]
        )?.count || 0;
        const missed = db.getFirstSync(
            "SELECT COUNT(*) as count FROM history h JOIN medicines m ON h.medicine_id = m.id WHERE h.status = 'missed' AND h.date = ?",
            [date]
        )?.count || 0;
        const snoozed = db.getFirstSync(
            "SELECT COUNT(*) as count FROM history h JOIN medicines m ON h.medicine_id = m.id WHERE h.status = 'snoozed' AND h.date = ?",
            [date]
        )?.count || 0;

        const allMedicines = fetchMedicines();
        const today = new Date(date).getDay();
        let totalScheduled = 0;

        allMedicines.forEach(med => {
            const isToday = med.frequency === 'Daily' || (med.frequency === 'Custom' && JSON.parse(med.selectedDays).includes(today));
            if (isToday) {
                totalScheduled += JSON.parse(med.times).length;
            }
        });

        const handledCount = taken + missed + snoozed;
        const pending = totalScheduled - handledCount + snoozed;

        return {
            taken,
            missed,
            pending: pending > 0 ? pending : 0,
        };
    } catch (error) {
        console.error('Failed to get dashboard stats', error);
        return { taken: 0, missed: 0, pending: 0 };
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
