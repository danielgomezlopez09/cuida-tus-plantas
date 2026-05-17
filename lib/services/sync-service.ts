/**
 * Servicio de sincronización con backend
 * Sincroniza diagnósticos entre dispositivos
 */

import AsyncStorage from '@react-native-async-storage/async-storage';
import { DiagnosisRecord } from './plantnet-service';

export interface SyncConfig {
  enabled: boolean;
  autoSync: boolean;
  syncInterval: number; // en minutos
  lastSync: number;
}

export interface SyncStatus {
  isSyncing: boolean;
  lastSyncTime: number;
  pendingChanges: number;
  error: string | null;
}

const DEFAULT_CONFIG: SyncConfig = {
  enabled: false,
  autoSync: true,
  syncInterval: 15,
  lastSync: 0,
};

/**
 * Obtener configuración de sincronización
 */
export async function getSyncConfig(): Promise<SyncConfig> {
  try {
    const config = await AsyncStorage.getItem('sync_config');
    return config ? JSON.parse(config) : DEFAULT_CONFIG;
  } catch (error) {
    console.error('Error obteniendo configuración de sync:', error);
    return DEFAULT_CONFIG;
  }
}

/**
 * Guardar configuración de sincronización
 */
export async function saveSyncConfig(config: Partial<SyncConfig>): Promise<void> {
  try {
    const current = await getSyncConfig();
    const updated = { ...current, ...config };
    await AsyncStorage.setItem('sync_config', JSON.stringify(updated));
  } catch (error) {
    console.error('Error guardando configuración de sync:', error);
    throw error;
  }
}

/**
 * Obtener estado de sincronización
 */
export async function getSyncStatus(): Promise<SyncStatus> {
  try {
    const config = await getSyncConfig();
    const status = await AsyncStorage.getItem('sync_status');
    
    if (status) {
      return JSON.parse(status);
    }

    return {
      isSyncing: false,
      lastSyncTime: config.lastSync,
      pendingChanges: 0,
      error: null,
    };
  } catch (error) {
    console.error('Error obteniendo estado de sync:', error);
    return {
      isSyncing: false,
      lastSyncTime: 0,
      pendingChanges: 0,
      error: 'Error obteniendo estado',
    };
  }
}

/**
 * Sincronizar diagnósticos con backend
 */
export async function syncDiagnoses(diagnoses: DiagnosisRecord[]): Promise<{
  success: boolean;
  synced: number;
  failed: number;
  error?: string;
}> {
  try {
    // Actualizar estado de sincronización
    const status: SyncStatus = {
      isSyncing: true,
      lastSyncTime: Date.now(),
      pendingChanges: diagnoses.length,
      error: null,
    };
    await AsyncStorage.setItem('sync_status', JSON.stringify(status));

    // Aquí iría la llamada real al backend
    // Por ahora, simulamos una sincronización exitosa
    const synced = diagnoses.length;
    const failed = 0;

    // Actualizar configuración
    const config = await getSyncConfig();
    await saveSyncConfig({
      lastSync: Date.now(),
    });

    // Actualizar estado final
    const finalStatus: SyncStatus = {
      isSyncing: false,
      lastSyncTime: Date.now(),
      pendingChanges: 0,
      error: null,
    };
    await AsyncStorage.setItem('sync_status', JSON.stringify(finalStatus));

    return {
      success: true,
      synced,
      failed,
    };
  } catch (error) {
    console.error('Error sincronizando diagnósticos:', error);
    
    const errorStatus: SyncStatus = {
      isSyncing: false,
      lastSyncTime: Date.now(),
      pendingChanges: diagnoses.length,
      error: error instanceof Error ? error.message : 'Error desconocido',
    };
    await AsyncStorage.setItem('sync_status', JSON.stringify(errorStatus));

    return {
      success: false,
      synced: 0,
      failed: diagnoses.length,
      error: error instanceof Error ? error.message : 'Error desconocido',
    };
  }
}

/**
 * Obtener diagnósticos del backend
 */
export async function fetchDiagnosesFromBackend(): Promise<DiagnosisRecord[]> {
  try {
    // Aquí iría la llamada real al backend
    // Por ahora, retornamos un array vacío
    return [];
  } catch (error) {
    console.error('Error obteniendo diagnósticos del backend:', error);
    throw error;
  }
}

/**
 * Habilitar sincronización automática
 */
export async function enableAutoSync(): Promise<void> {
  try {
    await saveSyncConfig({
      enabled: true,
      autoSync: true,
    });
  } catch (error) {
    console.error('Error habilitando auto sync:', error);
    throw error;
  }
}

/**
 * Deshabilitar sincronización automática
 */
export async function disableAutoSync(): Promise<void> {
  try {
    await saveSyncConfig({
      enabled: false,
      autoSync: false,
    });
  } catch (error) {
    console.error('Error deshabilitando auto sync:', error);
    throw error;
  }
}

/**
 * Forzar sincronización inmediata
 */
export async function forceSync(diagnoses: DiagnosisRecord[]): Promise<void> {
  try {
    const result = await syncDiagnoses(diagnoses);
    if (!result.success) {
      throw new Error(result.error || 'Error en sincronización');
    }
  } catch (error) {
    console.error('Error en sincronización forzada:', error);
    throw error;
  }
}

/**
 * Limpiar estado de sincronización
 */
export async function clearSyncStatus(): Promise<void> {
  try {
    await AsyncStorage.removeItem('sync_status');
  } catch (error) {
    console.error('Error limpiando estado de sync:', error);
    throw error;
  }
}

/**
 * Obtener información de sincronización para mostrar en UI
 */
export async function getSyncInfo(): Promise<{
  isEnabled: boolean;
  isAutoSyncEnabled: boolean;
  isSyncing: boolean;
  lastSyncTime: string;
  pendingChanges: number;
  error: string | null;
}> {
  try {
    const config = await getSyncConfig();
    const status = await getSyncStatus();

    const lastSyncTime = status.lastSyncTime > 0
      ? new Date(status.lastSyncTime).toLocaleDateString('es-ES', {
          year: 'numeric',
          month: 'short',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
        })
      : 'Nunca';

    return {
      isEnabled: config.enabled,
      isAutoSyncEnabled: config.autoSync,
      isSyncing: status.isSyncing,
      lastSyncTime,
      pendingChanges: status.pendingChanges,
      error: status.error,
    };
  } catch (error) {
    console.error('Error obteniendo información de sync:', error);
    return {
      isEnabled: false,
      isAutoSyncEnabled: false,
      isSyncing: false,
      lastSyncTime: 'Error',
      pendingChanges: 0,
      error: 'Error obteniendo información',
    };
  }
}
