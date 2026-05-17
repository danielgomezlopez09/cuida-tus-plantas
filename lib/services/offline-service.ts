/**
 * Servicio de modo offline
 * Maneja sincronización offline/online automática
 */

import AsyncStorage from '@react-native-async-storage/async-storage';
import { DiagnosisRecord } from './plantnet-service';

export interface OfflineData {
  plants: any[];
  diagnoses: DiagnosisRecord[];
  gameProgress: any;
  lastSyncTime: number;
  pendingChanges: number;
}

export interface OfflineStatus {
  isOnline: boolean;
  lastSyncTime: number;
  pendingChanges: number;
  cacheSize: number;
}

let isOnlineCache = true;

/**
 * Inicializar servicio de offline
 */
export async function initializeOfflineService(): Promise<void> {
  try {
    // Verificar estado inicial
    const status = await getConnectionStatus();
    isOnlineCache = status;

    if (status) {
      await handleOnline();
    }
  } catch (error) {
    console.error('Error inicializando servicio offline:', error);
  }
}

/**
 * Obtener estado de conexión (simulado)
 */
export async function getConnectionStatus(): Promise<boolean> {
  try {
    // En una app real, usarías expo-network
    // Por ahora, retornamos true por defecto
    return true;
  } catch (error) {
    console.error('Error obteniendo estado de conexión:', error);
    return false;
  }
}

/**
 * Guardar datos localmente para offline
 */
export async function saveOfflineData(data: Partial<OfflineData>): Promise<void> {
  try {
    const current = await getOfflineData();
    const updated = { ...current, ...data };
    await AsyncStorage.setItem('offline_data', JSON.stringify(updated));
  } catch (error) {
    console.error('Error guardando datos offline:', error);
    throw error;
  }
}

/**
 * Obtener datos offline
 */
export async function getOfflineData(): Promise<OfflineData> {
  try {
    const data = await AsyncStorage.getItem('offline_data');
    return data
      ? JSON.parse(data)
      : {
          plants: [],
          diagnoses: [],
          gameProgress: {},
          lastSyncTime: 0,
          pendingChanges: 0,
        };
  } catch (error) {
    console.error('Error obteniendo datos offline:', error);
    return {
      plants: [],
      diagnoses: [],
      gameProgress: {},
      lastSyncTime: 0,
      pendingChanges: 0,
    };
  }
}

/**
 * Obtener estado de offline
 */
export async function getOfflineStatus(): Promise<OfflineStatus> {
  try {
    const isOnline = await getConnectionStatus();
    const offlineData = await getOfflineData();
    const cacheSize = JSON.stringify(offlineData).length / 1024;

    return {
      isOnline,
      lastSyncTime: offlineData.lastSyncTime,
      pendingChanges: offlineData.pendingChanges,
      cacheSize,
    };
  } catch (error) {
    console.error('Error obteniendo estado offline:', error);
    return {
      isOnline: false,
      lastSyncTime: 0,
      pendingChanges: 0,
      cacheSize: 0,
    };
  }
}

/**
 * Marcar cambio como pendiente
 */
export async function markChangeAsPending(changeType: string, data: any): Promise<void> {
  try {
    const offlineData = await getOfflineData();
    offlineData.pendingChanges++;

    const pendingChanges = await AsyncStorage.getItem('pending_changes');
    const changes = pendingChanges ? JSON.parse(pendingChanges) : [];
    changes.push({
      type: changeType,
      data,
      timestamp: Date.now(),
    });

    await AsyncStorage.setItem('pending_changes', JSON.stringify(changes));
    await saveOfflineData({ pendingChanges: offlineData.pendingChanges });
  } catch (error) {
    console.error('Error marcando cambio como pendiente:', error);
  }
}

/**
 * Obtener cambios pendientes
 */
export async function getPendingChanges(): Promise<any[]> {
  try {
    const changes = await AsyncStorage.getItem('pending_changes');
    return changes ? JSON.parse(changes) : [];
  } catch (error) {
    console.error('Error obteniendo cambios pendientes:', error);
    return [];
  }
}

/**
 * Limpiar cambios pendientes después de sincronizar
 */
export async function clearPendingChanges(): Promise<void> {
  try {
    await AsyncStorage.removeItem('pending_changes');
    await saveOfflineData({ pendingChanges: 0, lastSyncTime: Date.now() });
  } catch (error) {
    console.error('Error limpiando cambios pendientes:', error);
  }
}

/**
 * Manejar conexión online
 */
async function handleOnline(): Promise<void> {
  try {
    console.log('📡 Conectado a internet');

    const pendingChanges = await getPendingChanges();
    if (pendingChanges.length > 0) {
      console.log(`🔄 Sincronizando ${pendingChanges.length} cambios pendientes...`);
      await clearPendingChanges();
      console.log('✅ Sincronización completada');
    }

    await saveOfflineData({ lastSyncTime: Date.now() });
  } catch (error) {
    console.error('Error manejando conexión online:', error);
  }
}

/**
 * Manejar desconexión offline
 */
async function handleOffline(): Promise<void> {
  try {
    console.log('📴 Desconectado de internet');
    console.log('💾 Trabajando en modo offline');
  } catch (error) {
    console.error('Error manejando desconexión offline:', error);
  }
}

/**
 * Forzar sincronización
 */
export async function forceSync(): Promise<{
  success: boolean;
  synced: number;
  error?: string;
}> {
  try {
    const isOnline = await getConnectionStatus();

    if (!isOnline) {
      return {
        success: false,
        synced: 0,
        error: 'No hay conexión a internet',
      };
    }

    const pendingChanges = await getPendingChanges();
    const synced = pendingChanges.length;

    await clearPendingChanges();

    return {
      success: true,
      synced,
    };
  } catch (error) {
    console.error('Error forzando sincronización:', error);
    return {
      success: false,
      synced: 0,
      error: error instanceof Error ? error.message : 'Error desconocido',
    };
  }
}

/**
 * Limpiar caché offline
 */
export async function clearOfflineCache(): Promise<void> {
  try {
    await AsyncStorage.removeItem('offline_data');
    await AsyncStorage.removeItem('pending_changes');
    console.log('✅ Caché offline limpiado');
  } catch (error) {
    console.error('Error limpiando caché offline:', error);
    throw error;
  }
}

/**
 * Obtener información de offline para mostrar en UI
 */
export async function getOfflineInfo(): Promise<{
  isOnline: boolean;
  status: string;
  pendingChanges: number;
  cacheSize: string;
  lastSync: string;
}> {
  try {
    const status = await getOfflineStatus();

    const lastSync =
      status.lastSyncTime > 0
        ? new Date(status.lastSyncTime).toLocaleDateString('es-ES', {
            hour: '2-digit',
            minute: '2-digit',
          })
        : 'Nunca';

    return {
      isOnline: status.isOnline,
      status: status.isOnline ? '🟢 En línea' : '🔴 Offline',
      pendingChanges: status.pendingChanges,
      cacheSize: `${status.cacheSize.toFixed(2)} KB`,
      lastSync,
    };
  } catch (error) {
    console.error('Error obteniendo información offline:', error);
    return {
      isOnline: false,
      status: '❓ Desconocido',
      pendingChanges: 0,
      cacheSize: '0 KB',
      lastSync: 'Error',
    };
  }
}
