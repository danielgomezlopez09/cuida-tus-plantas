import React, { createContext, useContext, useEffect, useState } from 'react';
import * as Notifications from 'expo-notifications';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface Reminder {
  id: string;
  plantId: string;
  plantName: string;
  type: 'watering' | 'fertilizing' | 'pruning';
  frequency: number; // días
  lastNotified: string;
  enabled: boolean;
}

export interface NotificationContextType {
  reminders: Reminder[];
  addReminder: (reminder: Omit<Reminder, 'id' | 'lastNotified'>) => Promise<void>;
  removeReminder: (id: string) => Promise<void>;
  updateReminder: (id: string, reminder: Partial<Reminder>) => Promise<void>;
  scheduleReminder: (reminder: Reminder) => Promise<void>;
  cancelReminder: (id: string) => Promise<void>;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export function NotificationProvider({ children }: { children: React.ReactNode }) {
  const [reminders, setReminders] = useState<Reminder[]>([]);

  // Cargar recordatorios al iniciar
  useEffect(() => {
    loadReminders();
    setupNotifications();
  }, []);

  // Configurar notificaciones
  const setupNotifications = async () => {
    // Solicitar permisos
    const { status } = await Notifications.requestPermissionsAsync();
    if (status !== 'granted') {
      console.log('Permisos de notificación denegados');
      return;
    }

    // Configurar manejador de notificaciones recibidas
    Notifications.setNotificationHandler({
      handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: true,
        shouldSetBadge: true,
        shouldShowBanner: true,
        shouldShowList: true,
      }),
    });
  };

  // Cargar recordatorios del almacenamiento
  const loadReminders = async () => {
    try {
      const stored = await AsyncStorage.getItem('plant_reminders');
      if (stored) {
        const loadedReminders = JSON.parse(stored);
        setReminders(loadedReminders);
        
        // Reprogramar recordatorios activos
        loadedReminders.forEach((reminder: Reminder) => {
          if (reminder.enabled) {
            scheduleReminder(reminder);
          }
        });
      }
    } catch (error) {
      console.error('Error cargando recordatorios:', error);
    }
  };

  // Guardar recordatorios en almacenamiento
  const saveReminders = async (updatedReminders: Reminder[]) => {
    try {
      await AsyncStorage.setItem('plant_reminders', JSON.stringify(updatedReminders));
      setReminders(updatedReminders);
    } catch (error) {
      console.error('Error guardando recordatorios:', error);
    }
  };

  // Agregar nuevo recordatorio
  const addReminder = async (reminder: Omit<Reminder, 'id' | 'lastNotified'>) => {
    const newReminder: Reminder = {
      ...reminder,
      id: Date.now().toString(),
      lastNotified: new Date().toISOString(),
    };

    const updated = [...reminders, newReminder];
    await saveReminders(updated);

    if (newReminder.enabled) {
      await scheduleReminder(newReminder);
    }
  };

  // Eliminar recordatorio
  const removeReminder = async (id: string) => {
    await cancelReminder(id);
    const updated = reminders.filter(r => r.id !== id);
    await saveReminders(updated);
  };

  // Actualizar recordatorio
  const updateReminder = async (id: string, updates: Partial<Reminder>) => {
    const updated = reminders.map(r =>
      r.id === id ? { ...r, ...updates } : r
    );
    await saveReminders(updated);

    const reminder = updated.find(r => r.id === id);
    if (reminder && reminder.enabled) {
      await scheduleReminder(reminder);
    }
  };

  // Programar notificación
  const scheduleReminder = async (reminder: Reminder) => {
    try {
      // Cancelar notificación anterior si existe
      await Notifications.cancelScheduledNotificationAsync(reminder.id);

      const messages: Record<string, string> = {
        watering: `🌱 Es hora de regar ${reminder.plantName}`,
        fertilizing: `🌿 Es hora de fertilizar ${reminder.plantName}`,
        pruning: `✂️ Es hora de podar ${reminder.plantName}`,
      };

      const descriptions: Record<string, string> = {
        watering: 'Verifica la humedad del sustrato y riega si es necesario',
        fertilizing: 'Aplica fertilizante según las instrucciones',
        pruning: 'Realiza la poda de mantenimiento',
      };

      // Programar notificación recurrente
      await Notifications.scheduleNotificationAsync({
        // @ts-ignore - Tipo de trigger compatible con expo-notifications
        identifier: reminder.id,
        content: {
          title: 'Cuida tus Plantas',
          body: messages[reminder.type],
          subtitle: descriptions[reminder.type],
          data: {
            plantId: reminder.plantId,
            type: reminder.type,
          },
          sound: true,
          badge: 1,
        },
        trigger: {
          seconds: reminder.frequency * 24 * 60 * 60, // Convertir días a segundos
          repeats: true,
        } as any,
      });

      console.log(`Recordatorio programado: ${reminder.id}`);
    } catch (error) {
      console.error('Error programando recordatorio:', error);
    }
  };

  // Cancelar notificación
  const cancelReminder = async (id: string) => {
    try {
      await Notifications.cancelScheduledNotificationAsync(id);
      console.log(`Recordatorio cancelado: ${id}`);
    } catch (error) {
      console.error('Error cancelando recordatorio:', error);
    }
  };

  return (
    <NotificationContext.Provider
      value={{
        reminders,
        addReminder,
        removeReminder,
        updateReminder,
        scheduleReminder,
        cancelReminder,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
}

export function useNotifications() {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotifications debe usarse dentro de NotificationProvider');
  }
  return context;
}
