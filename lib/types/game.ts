/**
 * Tipos para el sistema de juego interactivo de cultivo de plantas
 */

export interface Seed {
  id: number;
  name: string;
  type: 'frutal' | 'floral' | 'hortaliza';
  emoji: string;
  color: string;
  description: string;
  growthTime: number; // en días
  stages: string[];
  harvestType: 'fruto' | 'flor';
  coinsPerHarvest: number;
  careRequirements: {
    wateringInterval: number; // en horas
    fertilizingInterval: number; // en horas
    repottingInterval: number; // en horas
  };
}

export interface GrowingPlant {
  id: string;
  seedId: number;
  seedName: string;
  seedEmoji: string;
  seedColor: string;
  harvestType: 'fruto' | 'flor';
  coinsPerHarvest: number;
  currentStage: number; // 0-4
  totalStages: number;
  plantedAt: number; // timestamp
  lastWateredAt: number;
  lastFertilizedAt: number;
  lastRepottedAt: number;
  health: number; // 0-100
  careStreak: number; // número de cuidados consecutivos correctos
  isReadyToHarvest: boolean;
  harvestedCount: number;
  totalCoinsEarned: number;
}

export interface GameState {
  coins: number;
  totalCoinsEarned: number;
  currentPlant: GrowingPlant | null;
  harvestedPlants: HarvestedPlant[];
  achievements: Achievement[];
  seedsOwned: SeedOwnership[];
  fertilizersOwned: number;
  lastDailyBonus: number; // timestamp
  totalPlantsGrown: number;
  longestStreak: number;
}

export interface HarvestedPlant {
  id: string;
  seedId: number;
  seedName: string;
  seedEmoji: string;
  harvestedAt: number;
  coinsEarned: number;
  growthDays: number;
}

export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  unlockedAt: number | null;
  progress: number; // para logros progresivos
  target: number; // meta del logro
}

export interface SeedOwnership {
  seedId: number;
  seedName: string;
  owned: boolean;
  harvestedCount: number;
}

export interface CareAction {
  type: 'water' | 'fertilize' | 'repot';
  timestamp: number;
  success: boolean;
  coinsEarned: number;
}

export interface DailyBonus {
  coins: number;
  timestamp: number;
}

export interface ShopItem {
  id: string;
  name: string;
  type: 'seed' | 'fertilizer' | 'pot';
  cost: number;
  description: string;
  icon: string;
}

export interface Notification {
  id: string;
  type: 'care_needed' | 'plant_ready' | 'achievement' | 'coins_earned';
  title: string;
  message: string;
  timestamp: number;
  read: boolean;
}
