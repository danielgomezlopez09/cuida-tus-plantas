import { useState, useEffect } from 'react';
import { Plant } from '@/lib/types/plants';

// Import the plants database
import plantsData from '@/plants_database.json';

export const usePlantsDatabase = () => {
  const [plants, setPlants] = useState<Plant[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Load plants from JSON file
    try {
      const data = plantsData as any;
      const plantsArray = data.plants || [];
      setPlants(plantsArray);
    } catch (error) {
      console.error('Error loading plants database:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  const searchPlants = (query: string): Plant[] => {
    if (!query.trim()) return plants;

    const lowerQuery = query.toLowerCase();
    return plants.filter(
      (plant: any) =>
        plant?.name?.toLowerCase?.()?.includes?.(lowerQuery) ||
        plant?.commonNames?.some?.((name: string) => name?.toLowerCase?.()?.includes?.(lowerQuery)) ||
        plant?.category?.toLowerCase?.()?.includes?.(lowerQuery)
    );
  };

  const filterByType = (type: string): Plant[] => {
    if (!type) return plants;
    return plants.filter(plant => plant.type === type);
  };

  const filterByCategory = (category: string): Plant[] => {
    if (!category) return plants;
    return plants.filter(plant => plant.category === category);
  };

  const getPlantById = (id: number): Plant | undefined => {
    return plants.find(plant => plant.id === id);
  };

  const getCategories = (): string[] => {
    const categories = new Set(plants.map(p => p.category));
    return Array.from(categories).sort();
  };

  const getTypes = (): string[] => {
    const types = new Set(plants.map(p => p.type));
    return Array.from(types).sort();
  };

  const getPlantsByType = (type: string): Plant[] => {
    return plants.filter(plant => plant.type === type);
  };

  return {
    plants,
    loading,
    searchPlants,
    filterByType,
    filterByCategory,
    getPlantById,
    getCategories,
    getTypes,
    getPlantsByType,
  };
};
