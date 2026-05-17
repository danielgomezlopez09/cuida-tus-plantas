import React, { createContext, useContext, useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { GameState, GrowingPlant, HarvestedPlant, Achievement, Seed } from '@/lib/types/game';
import seedsData from '@/game_seeds_database.json';

interface GameContextType {
  gameState: GameState;
  isLoading: boolean;
  plantSeed: (seedId: number) => Promise<void>;
  waterPlant: () => Promise<void>;
  fertilizePlant: () => Promise<void>;
  repotPlant: () => Promise<void>;
  harvestPlant: () => Promise<void>;
  buySeed: (seedId: number) => Promise<boolean>;
  buyFertilizer: () => Promise<boolean>;
  addCoins: (amount: number, reason: string) => Promise<void>;
  getSeeds: () => Seed[];
  getCurrentPlant: () => GrowingPlant | null;
  getHarvestedPlants: () => HarvestedPlant[];
  getAchievements: () => Achievement[];
  unlockAchievement: (achievementId: string) => Promise<void>;
  getDailyBonus: () => Promise<number>;
}

const GameContext = createContext<GameContextType | undefined>(undefined);

const STORAGE_KEY = 'game_state';
const DEFAULT_GAME_STATE: GameState = {
  coins: 0,
  totalCoinsEarned: 0,
  currentPlant: null,
  harvestedPlants: [],
  achievements: [],
  seedsOwned: [],
  fertilizersOwned: 1,
  lastDailyBonus: 0,
  totalPlantsGrown: 0,
  longestStreak: 0,
};

const DEFAULT_ACHIEVEMENTS: Achievement[] = [
  {
    id: 'first_plant',
    name: 'Primer Cultivo',
    description: 'Cultiva tu primera planta',
    icon: '🌱',
    unlockedAt: null,
    progress: 0,
    target: 1,
  },
  {
    id: 'collector',
    name: 'Coleccionista',
    description: 'Cultiva 10 plantas diferentes',
    icon: '🎯',
    unlockedAt: null,
    progress: 0,
    target: 10,
  },
  {
    id: 'coin_master',
    name: 'Maestro de Monedas',
    description: 'Gana 1000 doblones',
    icon: '💰',
    unlockedAt: null,
    progress: 0,
    target: 1000,
  },
  {
    id: 'perfect_care',
    name: 'Cuidador Perfecto',
    description: 'Mantén una racha de 10 cuidados correctos',
    icon: '✨',
    unlockedAt: null,
    progress: 0,
    target: 10,
  },
  {
    id: 'harvester',
    name: 'Cosechador',
    description: 'Cosecha 5 plantas',
    icon: '🌾',
    unlockedAt: null,
    progress: 0,
    target: 5,
  },
];

export function GameProvider({ children }: { children: React.ReactNode }) {
  const [gameState, setGameState] = useState<GameState>(DEFAULT_GAME_STATE);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadGameState();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      updatePlantGrowth();
    }, 60000);

    return () => clearInterval(interval);
  }, [gameState.currentPlant]);

  const loadGameState = async () => {
    try {
      const stored = await AsyncStorage.getItem(STORAGE_KEY);
      if (stored) {
        const loaded = JSON.parse(stored);
        setGameState(loaded);
      } else {
        const newState = {
          ...DEFAULT_GAME_STATE,
          achievements: DEFAULT_ACHIEVEMENTS,
        };
        setGameState(newState);
        await saveGameState(newState);
      }
    } catch (error) {
      console.error('Error cargando estado del juego:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const saveGameState = async (state: GameState) => {
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch (error) {
      console.error('Error guardando estado del juego:', error);
    }
  };

  const getSeedData = (seedId: number): Seed | undefined => {
    return (seedsData as any).seeds.find((s: Seed) => s.id === seedId);
  };

  const updatePlantGrowth = async () => {
    if (!gameState.currentPlant) return;

    const plant = gameState.currentPlant;
    const seed = getSeedData(plant.seedId);
    if (!seed) return;

    const now = Date.now();
    const ageInHours = (now - plant.plantedAt) / (1000 * 60 * 60);
    const growthTimeInHours = plant.totalStages * 48;

    const newStage = Math.floor((ageInHours / growthTimeInHours) * plant.totalStages);

    if (newStage > plant.currentStage && newStage < plant.totalStages) {
      const updatedPlant = { ...plant, currentStage: newStage };
      const newState = { ...gameState, currentPlant: updatedPlant };
      setGameState(newState);
      await saveGameState(newState);
    } else if (newStage >= plant.totalStages) {
      const updatedPlant = {
        ...plant,
        currentStage: plant.totalStages - 1,
        isReadyToHarvest: true,
      };
      const newState = { ...gameState, currentPlant: updatedPlant };
      setGameState(newState);
      await saveGameState(newState);
    }
  };

  const plantSeed = async (seedId: number) => {
    const seed = getSeedData(seedId);
    if (!seed) return;

    const now = Date.now();
    const newPlant: GrowingPlant = {
      id: `plant_${now}`,
      seedId: seed.id,
      seedName: seed.name,
      seedEmoji: seed.emoji,
      seedColor: seed.color,
      harvestType: seed.harvestType,
      coinsPerHarvest: seed.coinsPerHarvest,
      currentStage: 0,
      totalStages: seed.stages.length,
      plantedAt: now,
      lastWateredAt: now,
      lastFertilizedAt: now,
      lastRepottedAt: now,
      health: 100,
      careStreak: 0,
      isReadyToHarvest: false,
      harvestedCount: 0,
      totalCoinsEarned: 0,
    };

    const newState = {
      ...gameState,
      currentPlant: newPlant,
      totalPlantsGrown: gameState.totalPlantsGrown + 1,
    };

    setGameState(newState);
    await saveGameState(newState);
  };

  const waterPlant = async () => {
    if (!gameState.currentPlant) return;

    const now = Date.now();
    const plant = gameState.currentPlant;
    const seed = getSeedData(plant.seedId);
    if (!seed) return;

    const hoursSinceWatering = (now - plant.lastWateredAt) / (1000 * 60 * 60);

    if (hoursSinceWatering >= seed.careRequirements.wateringInterval - 2) {
      const coinsEarned = 5 + plant.careStreak;
      const newStreak = plant.careStreak + 1;
      const newHealth = Math.min(100, plant.health + 10);

      const updatedPlant = {
        ...plant,
        lastWateredAt: now,
        health: newHealth,
        careStreak: newStreak,
        totalCoinsEarned: plant.totalCoinsEarned + coinsEarned,
      };

      const newState = {
        ...gameState,
        currentPlant: updatedPlant,
        coins: gameState.coins + coinsEarned,
        totalCoinsEarned: gameState.totalCoinsEarned + coinsEarned,
      };

      setGameState(newState);
      await saveGameState(newState);
    }
  };

  const fertilizePlant = async () => {
    if (!gameState.currentPlant || gameState.fertilizersOwned <= 0) return;

    const now = Date.now();
    const plant = gameState.currentPlant;
    const seed = getSeedData(plant.seedId);
    if (!seed) return;

    const hoursSinceFertilizing = (now - plant.lastFertilizedAt) / (1000 * 60 * 60);

    if (hoursSinceFertilizing >= seed.careRequirements.fertilizingInterval - 2) {
      const coinsEarned = 8 + plant.careStreak * 2;
      const newStreak = plant.careStreak + 1;
      const newHealth = Math.min(100, plant.health + 15);

      const updatedPlant = {
        ...plant,
        lastFertilizedAt: now,
        health: newHealth,
        careStreak: newStreak,
        totalCoinsEarned: plant.totalCoinsEarned + coinsEarned,
      };

      const newState = {
        ...gameState,
        currentPlant: updatedPlant,
        coins: gameState.coins + coinsEarned,
        totalCoinsEarned: gameState.totalCoinsEarned + coinsEarned,
        fertilizersOwned: gameState.fertilizersOwned - 1,
      };

      setGameState(newState);
      await saveGameState(newState);
    }
  };

  const repotPlant = async () => {
    if (!gameState.currentPlant) return;

    const now = Date.now();
    const plant = gameState.currentPlant;
    const seed = getSeedData(plant.seedId);
    if (!seed) return;

    const hoursSinceRepotting = (now - plant.lastRepottedAt) / (1000 * 60 * 60);

    if (hoursSinceRepotting >= seed.careRequirements.repottingInterval - 2) {
      const coinsEarned = 10 + plant.careStreak * 3;
      const newStreak = plant.careStreak + 1;
      const newHealth = Math.min(100, plant.health + 20);

      const updatedPlant = {
        ...plant,
        lastRepottedAt: now,
        health: newHealth,
        careStreak: newStreak,
        totalCoinsEarned: plant.totalCoinsEarned + coinsEarned,
      };

      const newState = {
        ...gameState,
        currentPlant: updatedPlant,
        coins: gameState.coins + coinsEarned,
        totalCoinsEarned: gameState.totalCoinsEarned + coinsEarned,
      };

      setGameState(newState);
      await saveGameState(newState);
    }
  };

  const harvestPlant = async () => {
    if (!gameState.currentPlant || !gameState.currentPlant.isReadyToHarvest) return;

    const plant = gameState.currentPlant;
    const coinsEarned = plant.coinsPerHarvest;

    const harvestedPlant: HarvestedPlant = {
      id: plant.id,
      seedId: plant.seedId,
      seedName: plant.seedName,
      seedEmoji: plant.seedEmoji,
      harvestedAt: Date.now(),
      coinsEarned,
      growthDays: 10,
    };

    const newState = {
      ...gameState,
      currentPlant: null,
      harvestedPlants: [...gameState.harvestedPlants, harvestedPlant],
      coins: gameState.coins + coinsEarned,
      totalCoinsEarned: gameState.totalCoinsEarned + coinsEarned,
    };

    setGameState(newState);
    await saveGameState(newState);
  };

  const buySeed = async (seedId: number): Promise<boolean> => {
    const seed = getSeedData(seedId);
    if (!seed) return false;

    const cost = seedId === 1 ? 0 : 10;

    if (gameState.coins < cost) return false;

    const newState = {
      ...gameState,
      coins: gameState.coins - cost,
      seedsOwned: [
        ...gameState.seedsOwned.filter((s) => s.seedId !== seedId),
        { seedId, seedName: seed.name, owned: true, harvestedCount: 0 },
      ],
    };

    setGameState(newState);
    await saveGameState(newState);
    return true;
  };

  const buyFertilizer = async (): Promise<boolean> => {
    const cost = 10;

    if (gameState.coins < cost) return false;

    const newState = {
      ...gameState,
      coins: gameState.coins - cost,
      fertilizersOwned: gameState.fertilizersOwned + 1,
    };

    setGameState(newState);
    await saveGameState(newState);
    return true;
  };

  const addCoins = async (amount: number, reason: string) => {
    const newState = {
      ...gameState,
      coins: gameState.coins + amount,
      totalCoinsEarned: gameState.totalCoinsEarned + amount,
    };

    setGameState(newState);
    await saveGameState(newState);
  };

  const getSeeds = (): Seed[] => {
    return (seedsData as any).seeds;
  };

  const getCurrentPlant = (): GrowingPlant | null => {
    return gameState.currentPlant;
  };

  const getHarvestedPlants = (): HarvestedPlant[] => {
    return gameState.harvestedPlants;
  };

  const getAchievements = (): Achievement[] => {
    return gameState.achievements;
  };

  const unlockAchievement = async (achievementId: string) => {
    const achievements = gameState.achievements.map((a) =>
      a.id === achievementId && !a.unlockedAt
        ? { ...a, unlockedAt: Date.now() }
        : a
    );

    const newState = { ...gameState, achievements };
    setGameState(newState);
    await saveGameState(newState);
  };

  const getDailyBonus = async (): Promise<number> => {
    const now = Date.now();
    const lastBonus = gameState.lastDailyBonus;
    const hoursSinceBonus = (now - lastBonus) / (1000 * 60 * 60);

    if (hoursSinceBonus >= 24) {
      const bonus = 50;
      const newState = {
        ...gameState,
        coins: gameState.coins + bonus,
        totalCoinsEarned: gameState.totalCoinsEarned + bonus,
        lastDailyBonus: now,
      };

      setGameState(newState);
      await saveGameState(newState);
      return bonus;
    }

    return 0;
  };

  return (
    <GameContext.Provider
      value={{
        gameState,
        isLoading,
        plantSeed,
        waterPlant,
        fertilizePlant,
        repotPlant,
        harvestPlant,
        buySeed,
        buyFertilizer,
        addCoins,
        getSeeds,
        getCurrentPlant,
        getHarvestedPlants,
        getAchievements,
        unlockAchievement,
        getDailyBonus,
      }}
    >
      {children}
    </GameContext.Provider>
  );
}

export function useGame() {
  const context = useContext(GameContext);
  if (!context) {
    throw new Error('useGame debe usarse dentro de GameProvider');
  }
  return context;
}
