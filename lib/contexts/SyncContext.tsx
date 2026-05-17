import React, { createContext, useContext, useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface SyncUser {
  id: string;
  email: string;
  name: string;
  token: string;
}

interface SyncData {
  plants: any[];
  photos: any[];
  reminders: any[];
  lastSync: string;
}

interface SyncContextType {
  user: SyncUser | null;
  isLoggedIn: boolean;
  isSyncing: boolean;
  lastSyncTime: string | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  syncData: () => Promise<void>;
  uploadPlant: (plant: any) => Promise<void>;
  downloadPlants: () => Promise<any[]>;
  isOnline: boolean;
}

const SyncContext = createContext<SyncContextType | undefined>(undefined);

export function SyncProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<SyncUser | null>(null);
  const [isSyncing, setIsSyncing] = useState(false);
  const [lastSyncTime, setLastSyncTime] = useState<string | null>(null);
  const [isOnline, setIsOnline] = useState(true);

  // Cargar usuario al iniciar
  useEffect(() => {
    loadUser();
    setupAutoSync();
  }, []);

  // Cargar usuario del almacenamiento
  const loadUser = async () => {
    try {
      const stored = await AsyncStorage.getItem('sync_user');
      if (stored) {
        setUser(JSON.parse(stored));
      }
      const lastSync = await AsyncStorage.getItem('last_sync_time');
      if (lastSync) {
        setLastSyncTime(lastSync);
      }
    } catch (error) {
      console.error('Error cargando usuario:', error);
    }
  };

  // Configurar sincronización automática
  const setupAutoSync = () => {
    // Sincronizar cada 30 minutos si está conectado
    const interval = setInterval(() => {
      if (user && isOnline) {
        syncData();
      }
    }, 30 * 60 * 1000);

    return () => clearInterval(interval);
  };

  // Login
  const login = async (email: string, password: string) => {
    try {
      const response = await fetch('http://localhost:3000/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        throw new Error('Error en login');
      }

      const data = await response.json();
      const newUser: SyncUser = {
        id: data.id,
        email: data.email,
        name: data.name,
        token: data.token,
      };

      setUser(newUser);
      await AsyncStorage.setItem('sync_user', JSON.stringify(newUser));
    } catch (error) {
      console.error('Error en login:', error);
      throw error;
    }
  };

  // Logout
  const logout = async () => {
    try {
      setUser(null);
      await AsyncStorage.removeItem('sync_user');
      await AsyncStorage.removeItem('last_sync_time');
    } catch (error) {
      console.error('Error en logout:', error);
    }
  };

  // Sincronizar datos
  const syncData = async () => {
    if (!user) return;

    setIsSyncing(true);
    try {
      // Obtener datos locales
      const plants = await AsyncStorage.getItem('user_plants');
      const photos = await AsyncStorage.getItem('plant_photos');
      const reminders = await AsyncStorage.getItem('plant_reminders');

      // Enviar al servidor
      const response = await fetch('http://localhost:3000/api/sync', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${user.token}`,
        },
        body: JSON.stringify({
          plants: plants ? JSON.parse(plants) : [],
          photos: photos ? JSON.parse(photos) : [],
          reminders: reminders ? JSON.parse(reminders) : [],
        }),
      });

      if (!response.ok) {
        throw new Error('Error en sincronización');
      }

      const syncTime = new Date().toISOString();
      setLastSyncTime(syncTime);
      await AsyncStorage.setItem('last_sync_time', syncTime);

      console.log('Sincronización completada');
    } catch (error) {
      console.error('Error sincronizando:', error);
    } finally {
      setIsSyncing(false);
    }
  };

  // Subir planta
  const uploadPlant = async (plant: any) => {
    if (!user) {
      console.log('No hay usuario para sincronizar');
      return;
    }

    try {
      const response = await fetch('http://localhost:3000/api/plants', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${user.token}`,
        },
        body: JSON.stringify(plant),
      });

      if (!response.ok) {
        throw new Error('Error subiendo planta');
      }

      console.log('Planta subida exitosamente');
    } catch (error) {
      console.error('Error subiendo planta:', error);
    }
  };

  // Descargar plantas
  const downloadPlants = async (): Promise<any[]> => {
    if (!user) return [];

    try {
      const response = await fetch('http://localhost:3000/api/plants', {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Error descargando plantas');
      }

      const plants = await response.json();
      return plants;
    } catch (error) {
      console.error('Error descargando plantas:', error);
      return [];
    }
  };

  return (
    <SyncContext.Provider
      value={{
        user,
        isLoggedIn: !!user,
        isSyncing,
        lastSyncTime,
        login,
        logout,
        syncData,
        uploadPlant,
        downloadPlants,
        isOnline,
      }}
    >
      {children}
    </SyncContext.Provider>
  );
}

export function useSync() {
  const context = useContext(SyncContext);
  if (!context) {
    throw new Error('useSync debe usarse dentro de SyncProvider');
  }
  return context;
}
