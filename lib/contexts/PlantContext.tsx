import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { UserPlant, CareHistory, Reminder } from '@/lib/types/plants';

interface PlantContextType {
  userPlants: UserPlant[];
  addPlant: (plant: UserPlant) => Promise<void>;
  removePlant: (id: string) => Promise<void>;
  updatePlant: (id: string, updates: Partial<UserPlant>) => Promise<void>;
  getCareHistory: (userPlantId: string) => Promise<CareHistory[]>;
  addCareRecord: (record: CareHistory) => Promise<void>;
  getReminders: (userPlantId: string) => Promise<Reminder[]>;
  addReminder: (reminder: Reminder) => Promise<void>;
  updateReminder: (id: string, updates: Partial<Reminder>) => Promise<void>;
  loading: boolean;
}

const PlantContext = createContext<PlantContextType | undefined>(undefined);

export const PlantProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [userPlants, setUserPlants] = useState<UserPlant[]>([]);
  const [loading, setLoading] = useState(true);

  // Load plants from AsyncStorage on mount
  useEffect(() => {
    loadPlants();
  }, []);

  const loadPlants = async () => {
    try {
      setLoading(true);
      const data = await AsyncStorage.getItem('userPlants');
      if (data) {
        setUserPlants(JSON.parse(data));
      }
    } catch (error) {
      console.error('Error loading plants:', error);
    } finally {
      setLoading(false);
    }
  };

  const savePlants = async (plants: UserPlant[]) => {
    try {
      await AsyncStorage.setItem('userPlants', JSON.stringify(plants));
      setUserPlants(plants);
    } catch (error) {
      console.error('Error saving plants:', error);
    }
  };

  const addPlant = async (plant: UserPlant) => {
    const newPlants = [...userPlants, plant];
    await savePlants(newPlants);
  };

  const removePlant = async (id: string) => {
    const newPlants = userPlants.filter(p => p.id !== id);
    await savePlants(newPlants);
  };

  const updatePlant = async (id: string, updates: Partial<UserPlant>) => {
    const newPlants = userPlants.map(p =>
      p.id === id ? { ...p, ...updates } : p
    );
    await savePlants(newPlants);
  };

  const getCareHistory = async (userPlantId: string): Promise<CareHistory[]> => {
    try {
      const data = await AsyncStorage.getItem(`careHistory_${userPlantId}`);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Error getting care history:', error);
      return [];
    }
  };

  const addCareRecord = async (record: CareHistory) => {
    try {
      const history = await getCareHistory(record.userPlantId);
      history.push(record);
      await AsyncStorage.setItem(
        `careHistory_${record.userPlantId}`,
        JSON.stringify(history)
      );
    } catch (error) {
      console.error('Error adding care record:', error);
    }
  };

  const getReminders = async (userPlantId: string): Promise<Reminder[]> => {
    try {
      const data = await AsyncStorage.getItem(`reminders_${userPlantId}`);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Error getting reminders:', error);
      return [];
    }
  };

  const addReminder = async (reminder: Reminder) => {
    try {
      const reminders = await getReminders(reminder.userPlantId);
      reminders.push(reminder);
      await AsyncStorage.setItem(
        `reminders_${reminder.userPlantId}`,
        JSON.stringify(reminders)
      );
    } catch (error) {
      console.error('Error adding reminder:', error);
    }
  };

  const updateReminder = async (id: string, updates: Partial<Reminder>) => {
    try {
      // This would need to be implemented with proper tracking
      console.log('Update reminder:', id, updates);
    } catch (error) {
      console.error('Error updating reminder:', error);
    }
  };

  return (
    <PlantContext.Provider
      value={{
        userPlants,
        addPlant,
        removePlant,
        updatePlant,
        getCareHistory,
        addCareRecord,
        getReminders,
        addReminder,
        updateReminder,
        loading,
      }}
    >
      {children}
    </PlantContext.Provider>
  );
};

export const usePlants = () => {
  const context = useContext(PlantContext);
  if (!context) {
    throw new Error('usePlants must be used within PlantProvider');
  }
  return context;
};
