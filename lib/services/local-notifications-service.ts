/**
 * Servicio de notificaciones locales
 * Maneja recordatorios para riego, fertilización y cambio de maceta
 */

import * as Notifications from 'expo-notifications';
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface NotificationSchedule {
  enabled: boolean;
  wateringInterval: number;
  fertilizingInterval: number;
  repottingInterval: number;
  lastWatering: number;
  lastFertilizing: number;
  lastRepotting: number;
}

const DEFAULT_SCHEDULE: NotificationSchedule = {
  enabled: true,
  wateringInterval: 8,
  fertilizingInterval: 14,
  repottingInterval: 168,
  lastWatering: Date.now(),
  lastFertilizing: Date.now(),
  lastRepotting: Date.now(),
};

export async function initializeNotifications(): Promise<void> {
  try {
    Notifications.setNotificationHandler({
      handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: true,
        shouldSetBadge: true,
        shouldShowBanner: true,
        shouldShowList: true,
      }),
    });

    const { status } = await Notifications.requestPermissionsAsync();
    if (status !== 'granted') {
      console.warn('Permisos de notificación no otorgados');
    }
  } catch (error) {
    console.error('Error inicializando notificaciones:', error);
  }
}

export async function getNotificationSchedule(): Promise<NotificationSchedule> {
  try {
    const schedule = await AsyncStorage.getItem('notification_schedule');
    return schedule ? JSON.parse(schedule) : DEFAULT_SCHEDULE;
  } catch (error) {
    console.error('Error obteniendo configuración de notificaciones:', error);
    return DEFAULT_SCHEDULE;
  }
}

export async function saveNotificationSchedule(
  schedule: Partial<NotificationSchedule>
): Promise<void> {
  try {
    const current = await getNotificationSchedule();
    const updated = { ...current, ...schedule };
    await AsyncStorage.setItem('notification_schedule', JSON.stringify(updated));
  } catch (error) {
    console.error('Error guardando configuración de notificaciones:', error);
    throw error;
  }
}

export async function scheduleWateringNotification(plantName: string): Promise<void> {
  try {
    const schedule = await getNotificationSchedule();
    if (!schedule.enabled) return;

    await Notifications.cancelAllScheduledNotificationsAsync();

    await Notifications.scheduleNotificationAsync({
      content: {
        title: '💧 Hora de Riego',
        body: `Es hora de regar ${plantName}. ¡Mantén tus plantas saludables!`,
        data: { type: 'watering', plantName },
        sound: 'default',
        badge: 1,
      },
      trigger: {
        seconds: schedule.wateringInterval * 3600,
        repeats: true,
      } as any,
    });

    await saveNotificationSchedule({ lastWatering: Date.now() });
  } catch (error) {
    console.error('Error programando notificación de riego:', error);
  }
}

export async function scheduleFertilizingNotification(plantName: string): Promise<void> {
  try {
    const schedule = await getNotificationSchedule();
    if (!schedule.enabled) return;

    await Notifications.scheduleNotificationAsync({
      content: {
        title: '🌱 Hora de Fertilizar',
        body: `Es hora de fertilizar ${plantName}. Dale nutrientes para crecer fuerte.`,
        data: { type: 'fertilizing', plantName },
        sound: 'default',
        badge: 1,
      },
      trigger: {
        seconds: schedule.fertilizingInterval * 3600,
        repeats: true,
      } as any,
    });

    await saveNotificationSchedule({ lastFertilizing: Date.now() });
  } catch (error) {
    console.error('Error programando notificación de fertilización:', error);
  }
}

export async function scheduleRepottingNotification(plantName: string): Promise<void> {
  try {
    const schedule = await getNotificationSchedule();
    if (!schedule.enabled) return;

    await Notifications.scheduleNotificationAsync({
      content: {
        title: '🪴 Hora de Trasplantar',
        body: `Es hora de trasplantar ${plantName} a una maceta más grande.`,
        data: { type: 'repotting', plantName },
        sound: 'default',
        badge: 1,
      },
      trigger: {
        seconds: schedule.repottingInterval * 3600,
        repeats: true,
      } as any,
    });

    await saveNotificationSchedule({ lastRepotting: Date.now() });
  } catch (error) {
    console.error('Error programando notificación de trasplante:', error);
  }
}

export async function scheduleAllNotifications(plantName: string): Promise<void> {
  try {
    const schedule = await getNotificationSchedule();
    if (!schedule.enabled) return;

    await Notifications.cancelAllScheduledNotificationsAsync();

    await Notifications.scheduleNotificationAsync({
      content: {
        title: '💧 Hora de Riego',
        body: `Es hora de regar ${plantName}. ¡Mantén tus plantas saludables!`,
        data: { type: 'watering', plantName },
        sound: 'default',
        badge: 1,
      },
      trigger: {
        seconds: schedule.wateringInterval * 3600,
        repeats: true,
      } as any,
    });

    await Notifications.scheduleNotificationAsync({
      content: {
        title: '🌱 Hora de Fertilizar',
        body: `Es hora de fertilizar ${plantName}. Dale nutrientes para crecer fuerte.`,
        data: { type: 'fertilizing', plantName },
        sound: 'default',
        badge: 1,
      },
      trigger: {
        seconds: schedule.fertilizingInterval * 3600,
        repeats: true,
      } as any,
    });

    await Notifications.scheduleNotificationAsync({
      content: {
        title: '🪴 Hora de Trasplantar',
        body: `Es hora de trasplantar ${plantName} a una maceta más grande.`,
        data: { type: 'repotting', plantName },
        sound: 'default',
        badge: 1,
      },
      trigger: {
        seconds: schedule.repottingInterval * 3600,
        repeats: true,
      } as any,
    });
  } catch (error) {
    console.error('Error programando notificaciones:', error);
  }
}

export async function cancelAllNotifications(): Promise<void> {
  try {
    await Notifications.cancelAllScheduledNotificationsAsync();
  } catch (error) {
    console.error('Error cancelando notificaciones:', error);
  }
}

export async function setNotificationsEnabled(enabled: boolean): Promise<void> {
  try {
    await saveNotificationSchedule({ enabled });
    if (!enabled) {
      await cancelAllNotifications();
    }
  } catch (error) {
    console.error('Error configurando notificaciones:', error);
    throw error;
  }
}

export async function getNextNotification(): Promise<{
  type: string;
  plantName: string;
  timeUntil: string;
} | null> {
  try {
    const notifications = await Notifications.getPresentedNotificationsAsync();
    if (notifications.length === 0) return null;

    const next = notifications[0];
    return {
      type: (next.request.content.data?.type as string) || 'unknown',
      plantName: (next.request.content.data?.plantName as string) || 'Planta',
      timeUntil: 'Próximamente',
    };
  } catch (error) {
    console.error('Error obteniendo próxima notificación:', error);
    return null;
  }
}

export async function sendTestNotification(): Promise<void> {
  try {
    await Notifications.scheduleNotificationAsync({
      content: {
        title: '✅ Notificación de Prueba',
        body: 'Las notificaciones están funcionando correctamente.',
        data: { type: 'test' },
        sound: 'default',
        badge: 1,
      },
      trigger: {
        seconds: 3,
        repeats: false,
      } as any,
    });
  } catch (error) {
    console.error('Error enviando notificación de prueba:', error);
    throw error;
  }
}
