/**
 * Servicio de modo multijugador competitivo
 * Gestiona desafíos, leaderboards y competencias
 */

import AsyncStorage from '@react-native-async-storage/async-storage';

export interface PlayerProfile {
  id: string;
  username: string;
  avatar: string;
  totalCoins: number;
  totalPlantsGrown: number;
  totalHarvests: number;
  longestStreak: number;
  level: number;
  joinedAt: number;
  lastActiveAt: number;
  achievements: string[];
}

export interface Challenge {
  id: string;
  name: string;
  description: string;
  type: 'speed' | 'quality' | 'quantity' | 'collection' | 'coins';
  duration: number; // en días
  startDate: number;
  endDate: number;
  objective: string;
  reward: number; // monedas
  participants: string[];
  status: 'active' | 'completed' | 'upcoming';
  difficulty: 'fácil' | 'media' | 'difícil';
}

export interface LeaderboardEntry {
  rank: number;
  playerId: string;
  username: string;
  score: number;
  plantCount: number;
  coinsEarned: number;
  streakDays: number;
}

export interface ChallengeParticipation {
  challengeId: string;
  playerId: string;
  progress: number; // 0-100
  currentScore: number;
  completed: boolean;
  completedAt: number | null;
  reward: number;
}

const STORAGE_KEY_PROFILE = 'player_profile';
const STORAGE_KEY_CHALLENGES = 'active_challenges';
const STORAGE_KEY_LEADERBOARD = 'leaderboard';
const STORAGE_KEY_PARTICIPATIONS = 'challenge_participations';

// Desafíos predefinidos
const WEEKLY_CHALLENGES: Challenge[] = [
  {
    id: 'speed_grower_1',
    name: 'Cultivador Rápido',
    description: 'Cultiva una planta en el menor tiempo posible',
    type: 'speed',
    duration: 7,
    startDate: Date.now(),
    endDate: Date.now() + 7 * 24 * 60 * 60 * 1000,
    objective: 'Cultiva y cosecha una planta en menos de 10 días',
    reward: 100,
    participants: [],
    status: 'active',
    difficulty: 'media',
  },
  {
    id: 'quality_master_1',
    name: 'Maestro de Calidad',
    description: 'Cultiva una planta con 100% de salud',
    type: 'quality',
    duration: 7,
    startDate: Date.now(),
    endDate: Date.now() + 7 * 24 * 60 * 60 * 1000,
    objective: 'Cosecha una planta manteniendo 100% de salud durante todo el crecimiento',
    reward: 150,
    participants: [],
    status: 'active',
    difficulty: 'difícil',
  },
  {
    id: 'collector_1',
    name: 'Coleccionista',
    description: 'Cultiva 5 plantas diferentes',
    type: 'collection',
    duration: 14,
    startDate: Date.now(),
    endDate: Date.now() + 14 * 24 * 60 * 60 * 1000,
    objective: 'Cultiva y cosecha 5 especies diferentes de plantas',
    reward: 200,
    participants: [],
    status: 'active',
    difficulty: 'media',
  },
  {
    id: 'coin_master_1',
    name: 'Cazador de Doblones',
    description: 'Gana 500 monedas en una semana',
    type: 'coins',
    duration: 7,
    startDate: Date.now(),
    endDate: Date.now() + 7 * 24 * 60 * 60 * 1000,
    objective: 'Acumula 500 doblones en una semana',
    reward: 100,
    participants: [],
    status: 'active',
    difficulty: 'media',
  },
  {
    id: 'streak_master_1',
    name: 'Cuidador Dedicado',
    description: 'Mantén una racha de 20 cuidados consecutivos',
    type: 'quality',
    duration: 7,
    startDate: Date.now(),
    endDate: Date.now() + 7 * 24 * 60 * 60 * 1000,
    objective: 'Realiza 20 cuidados consecutivos sin fallar',
    reward: 250,
    participants: [],
    status: 'active',
    difficulty: 'difícil',
  },
];

/**
 * Obtener o crear perfil de jugador
 */
export async function getOrCreatePlayerProfile(username: string): Promise<PlayerProfile> {
  try {
    const stored = await AsyncStorage.getItem(STORAGE_KEY_PROFILE);
    if (stored) {
      return JSON.parse(stored);
    }

    const newProfile: PlayerProfile = {
      id: `player_${Date.now()}`,
      username,
      avatar: '👤',
      totalCoins: 0,
      totalPlantsGrown: 0,
      totalHarvests: 0,
      longestStreak: 0,
      level: 1,
      joinedAt: Date.now(),
      lastActiveAt: Date.now(),
      achievements: [],
    };

    await AsyncStorage.setItem(STORAGE_KEY_PROFILE, JSON.stringify(newProfile));
    return newProfile;
  } catch (error) {
    console.error('Error obteniendo perfil:', error);
    throw error;
  }
}

/**
 * Actualizar perfil de jugador
 */
export async function updatePlayerProfile(profile: PlayerProfile): Promise<void> {
  try {
    profile.lastActiveAt = Date.now();
    await AsyncStorage.setItem(STORAGE_KEY_PROFILE, JSON.stringify(profile));
  } catch (error) {
    console.error('Error actualizando perfil:', error);
  }
}

/**
 * Obtener desafíos activos
 */
export async function getActiveChallenges(): Promise<Challenge[]> {
  try {
    const stored = await AsyncStorage.getItem(STORAGE_KEY_CHALLENGES);
    if (stored) {
      return JSON.parse(stored);
    }

    await AsyncStorage.setItem(STORAGE_KEY_CHALLENGES, JSON.stringify(WEEKLY_CHALLENGES));
    return WEEKLY_CHALLENGES;
  } catch (error) {
    console.error('Error obteniendo desafíos:', error);
    return WEEKLY_CHALLENGES;
  }
}

/**
 * Unirse a un desafío
 */
export async function joinChallenge(challengeId: string, playerId: string): Promise<void> {
  try {
    const challenges = await getActiveChallenges();
    const challenge = challenges.find((c) => c.id === challengeId);

    if (challenge && !challenge.participants.includes(playerId)) {
      challenge.participants.push(playerId);
      await AsyncStorage.setItem(STORAGE_KEY_CHALLENGES, JSON.stringify(challenges));

      // Crear participación
      const participation: ChallengeParticipation = {
        challengeId,
        playerId,
        progress: 0,
        currentScore: 0,
        completed: false,
        completedAt: null,
        reward: 0,
      };

      const participations = await getChallengeParticipations(playerId);
      participations.push(participation);
      await saveChallengeParticipations(playerId, participations);
    }
  } catch (error) {
    console.error('Error uniéndose al desafío:', error);
  }
}

/**
 * Obtener participaciones en desafíos del jugador
 */
export async function getChallengeParticipations(
  playerId: string
): Promise<ChallengeParticipation[]> {
  try {
    const stored = await AsyncStorage.getItem(`${STORAGE_KEY_PARTICIPATIONS}_${playerId}`);
    if (stored) {
      return JSON.parse(stored);
    }
    return [];
  } catch (error) {
    console.error('Error obteniendo participaciones:', error);
    return [];
  }
}

/**
 * Guardar participaciones en desafíos
 */
export async function saveChallengeParticipations(
  playerId: string,
  participations: ChallengeParticipation[]
): Promise<void> {
  try {
    await AsyncStorage.setItem(
      `${STORAGE_KEY_PARTICIPATIONS}_${playerId}`,
      JSON.stringify(participations)
    );
  } catch (error) {
    console.error('Error guardando participaciones:', error);
  }
}

/**
 * Actualizar progreso en desafío
 */
export async function updateChallengeProgress(
  playerId: string,
  challengeId: string,
  progress: number,
  score: number
): Promise<void> {
  try {
    const participations = await getChallengeParticipations(playerId);
    const participation = participations.find(
      (p) => p.challengeId === challengeId && p.playerId === playerId
    );

    if (participation) {
      participation.progress = Math.min(100, progress);
      participation.currentScore = score;

      if (progress >= 100) {
        participation.completed = true;
        participation.completedAt = Date.now();
        participation.reward = (await getActiveChallenges()).find((c) => c.id === challengeId)
          ?.reward || 0;
      }

      await saveChallengeParticipations(playerId, participations);
    }
  } catch (error) {
    console.error('Error actualizando progreso:', error);
  }
}

/**
 * Obtener leaderboard global
 */
export async function getGlobalLeaderboard(): Promise<LeaderboardEntry[]> {
  try {
    const stored = await AsyncStorage.getItem(STORAGE_KEY_LEADERBOARD);
    if (stored) {
      return JSON.parse(stored);
    }
    return [];
  } catch (error) {
    console.error('Error obteniendo leaderboard:', error);
    return [];
  }
}

/**
 * Actualizar leaderboard
 */
export async function updateLeaderboard(profile: PlayerProfile): Promise<void> {
  try {
    let leaderboard = await getGlobalLeaderboard();

    // Calcular puntuación
    const score =
      profile.totalCoins * 0.5 +
      profile.totalPlantsGrown * 10 +
      profile.totalHarvests * 5 +
      profile.longestStreak * 2;

    // Buscar entrada existente
    const existingIndex = leaderboard.findIndex((e) => e.playerId === profile.id);

    const entry: LeaderboardEntry = {
      rank: 0,
      playerId: profile.id,
      username: profile.username,
      score,
      plantCount: profile.totalPlantsGrown,
      coinsEarned: profile.totalCoins,
      streakDays: profile.longestStreak,
    };

    if (existingIndex >= 0) {
      leaderboard[existingIndex] = entry;
    } else {
      leaderboard.push(entry);
    }

    // Ordenar por puntuación
    leaderboard.sort((a, b) => b.score - a.score);

    // Asignar rangos
    leaderboard = leaderboard.map((entry, index) => ({
      ...entry,
      rank: index + 1,
    }));

    await AsyncStorage.setItem(STORAGE_KEY_LEADERBOARD, JSON.stringify(leaderboard));
  } catch (error) {
    console.error('Error actualizando leaderboard:', error);
  }
}

/**
 * Obtener rango del jugador
 */
export async function getPlayerRank(playerId: string): Promise<number> {
  try {
    const leaderboard = await getGlobalLeaderboard();
    const entry = leaderboard.find((e) => e.playerId === playerId);
    return entry?.rank || 0;
  } catch (error) {
    console.error('Error obteniendo rango:', error);
    return 0;
  }
}

/**
 * Calcular nivel basado en experiencia
 */
export function calculateLevel(totalCoins: number, totalHarvests: number): number {
  const experience = totalCoins + totalHarvests * 10;
  return Math.floor(experience / 100) + 1;
}

/**
 * Obtener recompensa por desafío completado
 */
export async function claimChallengeReward(
  playerId: string,
  challengeId: string
): Promise<number> {
  try {
    const participations = await getChallengeParticipations(playerId);
    const participation = participations.find(
      (p) => p.challengeId === challengeId && p.playerId === playerId
    );

    if (participation && participation.completed && participation.reward > 0) {
      const reward = participation.reward;
      participation.reward = 0; // Marcar como reclamado
      await saveChallengeParticipations(playerId, participations);
      return reward;
    }

    return 0;
  } catch (error) {
    console.error('Error reclamando recompensa:', error);
    return 0;
  }
}

/**
 * Obtener desafío temático especial
 */
export function getThematicChallenge(theme: string): Challenge | null {
  const thematicChallenges: Record<string, Challenge> = {
    halloween: {
      id: 'halloween_2024',
      name: 'Desafío de Halloween',
      description: 'Cultiva calabazas y cactus',
      type: 'collection',
      duration: 14,
      startDate: Date.now(),
      endDate: Date.now() + 14 * 24 * 60 * 60 * 1000,
      objective: 'Cultiva 3 calabazas y 2 cactus',
      reward: 300,
      participants: [],
      status: 'active',
      difficulty: 'media',
    },
    spring: {
      id: 'spring_2024',
      name: 'Desafío de Primavera',
      description: 'Cultiva flores de primavera',
      type: 'collection',
      duration: 21,
      startDate: Date.now(),
      endDate: Date.now() + 21 * 24 * 60 * 60 * 1000,
      objective: 'Cultiva todas las flores disponibles',
      reward: 500,
      participants: [],
      status: 'active',
      difficulty: 'difícil',
    },
  };

  return thematicChallenges[theme] || null;
}
