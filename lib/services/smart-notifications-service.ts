/**
 * Servicio de notificaciones push inteligentes
 * Aprende patrones de usuario y envía recordatorios personalizados
 */

import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Notifications from 'expo-notifications';

export interface NotificationPreferences {
  enabled: boolean;
  wateringReminders: boolean;
  fertilizingReminders: boolean;
  repottingReminders: boolean;
  achievementNotifications: boolean;
  dailyTips: boolean;
  specialEvents: boolean;
  quietHoursStart: number; // hora (0-23)
  quietHoursEnd: number; // hora (0-23)
}

export interface UserPattern {
  averageWateringHour: number; // hora del día que más riega
  averageFertilizingDay: number; // día de la semana que más fertiliza
  preferredNotificationTime: number; // hora preferida para notificaciones
  engagementLevel: 'bajo' | 'medio' | 'alto'; // basado en frecuencia de uso
  lastNotificationTime: number; // timestamp del último recordatorio
}

const STORAGE_KEY_PREFERENCES = 'notification_preferences';
const STORAGE_KEY_PATTERNS = 'user_patterns';

const DEFAULT_PREFERENCES: NotificationPreferences = {
  enabled: true,
  wateringReminders: true,
  fertilizingReminders: true,
  repottingReminders: true,
  achievementNotifications: true,
  dailyTips: true,
  specialEvents: true,
  quietHoursStart: 22,
  quietHoursEnd: 8,
};

/**
 * Obtener preferencias de notificaciones
 */
export async function getNotificationPreferences(): Promise<NotificationPreferences> {
  try {
    const stored = await AsyncStorage.getItem(STORAGE_KEY_PREFERENCES);
    if (stored) {
      return JSON.parse(stored);
    }
    return DEFAULT_PREFERENCES;
  } catch (error) {
    console.error('Error obteniendo preferencias:', error);
    return DEFAULT_PREFERENCES;
  }
}

/**
 * Guardar preferencias de notificaciones
 */
export async function saveNotificationPreferences(
  preferences: NotificationPreferences
): Promise<void> {
  try {
    await AsyncStorage.setItem(STORAGE_KEY_PREFERENCES, JSON.stringify(preferences));
  } catch (error) {
    console.error('Error guardando preferencias:', error);
  }
}

/**
 * Obtener patrón de usuario
 */
export async function getUserPattern(): Promise<UserPattern> {
  try {
    const stored = await AsyncStorage.getItem(STORAGE_KEY_PATTERNS);
    if (stored) {
      return JSON.parse(stored);
    }
    return {
      averageWateringHour: 9, // Por defecto, mañana
      averageFertilizingDay: 2, // Por defecto, miércoles
      preferredNotificationTime: 9,
      engagementLevel: 'medio',
      lastNotificationTime: 0,
    };
  } catch (error) {
    console.error('Error obteniendo patrón:', error);
    return {
      averageWateringHour: 9,
      averageFertilizingDay: 2,
      preferredNotificationTime: 9,
      engagementLevel: 'medio',
      lastNotificationTime: 0,
    };
  }
}

/**
 * Actualizar patrón de usuario basado en comportamiento
 */
export async function updateUserPattern(action: 'watering' | 'fertilizing' | 'repotting'): Promise<void> {
  try {
    const pattern = await getUserPattern();
    const now = new Date();
    const hour = now.getHours();
    const day = now.getDay();

    if (action === 'watering') {
      // Actualizar hora promedio de riego (media móvil)
      pattern.averageWateringHour = Math.round((pattern.averageWateringHour + hour) / 2);
    } else if (action === 'fertilizing') {
      // Actualizar día promedio de fertilización
      pattern.averageFertilizingDay = Math.round((pattern.averageFertilizingDay + day) / 2);
    }

    // Actualizar hora preferida de notificación (1 hora antes del promedio)
    pattern.preferredNotificationTime = Math.max(0, pattern.averageWateringHour - 1);

    await AsyncStorage.setItem(STORAGE_KEY_PATTERNS, JSON.stringify(pattern));
  } catch (error) {
    console.error('Error actualizando patrón:', error);
  }
}

/**
 * Verificar si es hora de enviar notificación de riego
 */
export function shouldSendWateringReminder(lastWateredAt: number, pattern: UserPattern): boolean {
  const now = Date.now();
  const hoursSinceWatering = (now - lastWateredAt) / (1000 * 60 * 60);
  const currentHour = new Date().getHours();

  // Enviar recordatorio si:
  // 1. Han pasado 7 horas desde el último riego
  // 2. Es la hora preferida del usuario
  // 3. No es hora silenciosa
  return (
    hoursSinceWatering >= 7 &&
    currentHour === pattern.preferredNotificationTime &&
    !isQuietHours(currentHour)
  );
}

/**
 * Verificar si es hora de enviar notificación de fertilización
 */
export function shouldSendFertilizingReminder(
  lastFertilizedAt: number,
  pattern: UserPattern
): boolean {
  const now = Date.now();
  const hoursSinceFertilizing = (now - lastFertilizedAt) / (1000 * 60 * 60);
  const currentDay = new Date().getDay();
  const currentHour = new Date().getHours();

  // Enviar recordatorio si:
  // 1. Han pasado 47 horas desde la última fertilización
  // 2. Es el día preferido del usuario
  // 3. Es la hora preferida
  return (
    hoursSinceFertilizing >= 47 &&
    currentDay === pattern.averageFertilizingDay &&
    currentHour === pattern.preferredNotificationTime &&
    !isQuietHours(currentHour)
  );
}

/**
 * Verificar si es hora silenciosa
 */
export async function isQuietHoursActive(): Promise<boolean> {
  const preferences = await getNotificationPreferences();
  const currentHour = new Date().getHours();

  if (preferences.quietHoursStart < preferences.quietHoursEnd) {
    // Rango normal (ej: 22-8 = 22, 23, 0, 1, 2, 3, 4, 5, 6, 7)
    return currentHour >= preferences.quietHoursStart || currentHour < preferences.quietHoursEnd;
  } else {
    // Rango que cruza medianoche
    return currentHour >= preferences.quietHoursStart && currentHour < preferences.quietHoursEnd;
  }
}

/**
 * Verificar si es hora silenciosa (versión síncrona)
 */
function isQuietHours(hour: number, quietStart = 22, quietEnd = 8): boolean {
  if (quietStart < quietEnd) {
    return hour >= quietStart || hour < quietEnd;
  } else {
    return hour >= quietStart && hour < quietEnd;
  }
}

/**
 * Enviar notificación de riego
 */
export async function sendWateringNotification(plantName: string): Promise<void> {
  const preferences = await getNotificationPreferences();

  if (!preferences.enabled || !preferences.wateringReminders) return;

  await Notifications.scheduleNotificationAsync({
    content: {
      title: '💧 Hora de Regar',
      body: `${plantName} necesita agua. ¡Riégala ahora!`,
      data: { type: 'watering', plantName },
      sound: 'default',
    },
    trigger: null,
  });
}

/**
 * Enviar notificación de fertilización
 */
export async function sendFertilizingNotification(plantName: string): Promise<void> {
  const preferences = await getNotificationPreferences();

  if (!preferences.enabled || !preferences.fertilizingReminders) return;

  await Notifications.scheduleNotificationAsync({
    content: {
      title: '🌱 Hora de Fertilizar',
      body: `${plantName} necesita fertilizante. ¡Fertilízala ahora!`,
      data: { type: 'fertilizing', plantName },
      sound: 'default',
    },
    trigger: null,
  });
}

/**
 * Enviar notificación de logro desbloqueado
 */
export async function sendAchievementNotification(achievementName: string): Promise<void> {
  const preferences = await getNotificationPreferences();

  if (!preferences.enabled || !preferences.achievementNotifications) return;

  await Notifications.scheduleNotificationAsync({
    content: {
      title: '🏆 ¡Logro Desbloqueado!',
      body: `¡Felicidades! Desbloqueaste: ${achievementName}`,
      data: { type: 'achievement', achievementName },
      sound: 'default',
    },
    trigger: null,
  });
}

/**
 * Enviar consejo diario
 */
export async function sendDailyTip(tip: string): Promise<void> {
  const preferences = await getNotificationPreferences();

  if (!preferences.enabled || !preferences.dailyTips) return;

  await Notifications.scheduleNotificationAsync({
    content: {
      title: '💡 Consejo del Día',
      body: tip,
      data: { type: 'tip' },
      sound: 'default',
    },
    trigger: null,
  });
}

/**
 * Enviar notificación de evento especial
 */
export async function sendSpecialEventNotification(
  title: string,
  message: string
): Promise<void> {
  const preferences = await getNotificationPreferences();

  if (!preferences.enabled || !preferences.specialEvents) return;

  await Notifications.scheduleNotificationAsync({
    content: {
      title,
      body: message,
      data: { type: 'event' },
      sound: 'default',
    },
    trigger: null,
  });
}

/**
 * Calcular puntuación de engagement
 */
export function calculateEngagementLevel(
  lastActiveTime: number,
  totalActions: number
): 'bajo' | 'medio' | 'alto' {
  const hoursSinceActive = (Date.now() - lastActiveTime) / (1000 * 60 * 60);

  if (hoursSinceActive > 48) return 'bajo';
  if (totalActions < 5) return 'bajo';
  if (hoursSinceActive > 24) return 'medio';
  if (totalActions < 15) return 'medio';
  return 'alto';
}

/**
 * Obtener hora óptima para notificación basada en engagement
 */
export function getOptimalNotificationTime(engagementLevel: 'bajo' | 'medio' | 'alto'): number {
  switch (engagementLevel) {
    case 'bajo':
      return 10; // Mañana temprano
    case 'medio':
      return 14; // Tarde
    case 'alto':
      return 9; // Mañana
    default:
      return 9;
  }
}
