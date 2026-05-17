import { useState, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface PlantPhoto {
  id: string;
  plantId: string;
  plantName: string;
  uri: string;
  timestamp: string;
  notes: string;
}

export function usePlantPhotos() {
  const [photos, setPhotos] = useState<PlantPhoto[]>([]);

  // Cargar todas las fotos
  const loadPhotos = useCallback(async () => {
    try {
      const stored = await AsyncStorage.getItem('plant_photos');
      if (stored) {
        setPhotos(JSON.parse(stored));
      }
    } catch (error) {
      console.error('Error cargando fotos:', error);
    }
  }, []);

  // Cargar fotos de una planta específica
  const loadPlantPhotos = useCallback(async (plantId: string) => {
    try {
      const stored = await AsyncStorage.getItem('plant_photos');
      if (stored) {
        const allPhotos = JSON.parse(stored);
        const plantPhotos = allPhotos.filter((p: PlantPhoto) => p.plantId === plantId);
        setPhotos(plantPhotos);
      }
    } catch (error) {
      console.error('Error cargando fotos de planta:', error);
    }
  }, []);

  // Agregar nueva foto
  const addPhoto = useCallback(async (
    plantId: string,
    plantName: string,
    uri: string,
    notes: string = ''
  ) => {
    try {
      const stored = await AsyncStorage.getItem('plant_photos');
      const allPhotos = stored ? JSON.parse(stored) : [];

      const newPhoto: PlantPhoto = {
        id: Date.now().toString(),
        plantId,
        plantName,
        uri,
        timestamp: new Date().toISOString(),
        notes,
      };

      const updated = [...allPhotos, newPhoto];
      await AsyncStorage.setItem('plant_photos', JSON.stringify(updated));
      setPhotos(updated);
      return newPhoto;
    } catch (error) {
      console.error('Error agregando foto:', error);
      throw error;
    }
  }, []);

  // Eliminar foto
  const deletePhoto = useCallback(async (photoId: string) => {
    try {
      const stored = await AsyncStorage.getItem('plant_photos');
      if (stored) {
        const allPhotos = JSON.parse(stored);
        const updated = allPhotos.filter((p: PlantPhoto) => p.id !== photoId);
        await AsyncStorage.setItem('plant_photos', JSON.stringify(updated));
        setPhotos(updated);
      }
    } catch (error) {
      console.error('Error eliminando foto:', error);
      throw error;
    }
  }, []);

  // Actualizar notas de foto
  const updatePhotoNotes = useCallback(async (photoId: string, notes: string) => {
    try {
      const stored = await AsyncStorage.getItem('plant_photos');
      if (stored) {
        const allPhotos = JSON.parse(stored);
        const updated = allPhotos.map((p: PlantPhoto) =>
          p.id === photoId ? { ...p, notes } : p
        );
        await AsyncStorage.setItem('plant_photos', JSON.stringify(updated));
        setPhotos(updated);
      }
    } catch (error) {
      console.error('Error actualizando notas:', error);
      throw error;
    }
  }, []);

  // Obtener fotos de una planta
  const getPlantPhotos = useCallback((plantId: string) => {
    return photos.filter(p => p.plantId === plantId);
  }, [photos]);

  // Contar fotos de una planta
  const countPlantPhotos = useCallback((plantId: string) => {
    return photos.filter(p => p.plantId === plantId).length;
  }, [photos]);

  return {
    photos,
    loadPhotos,
    loadPlantPhotos,
    addPhoto,
    deletePhoto,
    updatePhotoNotes,
    getPlantPhotos,
    countPlantPhotos,
  };
}
