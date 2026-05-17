import { View, Text, Pressable, ScrollView, FlatList } from 'react-native';
import { useRouter } from 'expo-router';
import { ScreenContainer } from '@/components/screen-container';
import { useColors } from '@/hooks/use-colors';
import { MaterialIcons } from '@expo/vector-icons';
import { useState, useEffect } from 'react';
import {
  getActiveChallenges,
  getGlobalLeaderboard,
  joinChallenge,
  getOrCreatePlayerProfile,
  Challenge,
  LeaderboardEntry,
} from '@/lib/services/multiplayer-service';

/**
 * Pantalla de desafíos y leaderboard multijugador
 */
export default function ChallengesScreen() {
  const router = useRouter();
  const colors = useColors();
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [activeTab, setActiveTab] = useState<'challenges' | 'leaderboard'>('challenges');
  const [playerProfile, setPlayerProfile] = useState<any>(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const profile = await getOrCreatePlayerProfile('Jugador');
      setPlayerProfile(profile);

      const activeChallenges = await getActiveChallenges();
      setChallenges(activeChallenges);

      const globalLeaderboard = await getGlobalLeaderboard();
      setLeaderboard(globalLeaderboard);
    } catch (error) {
      console.error('Error cargando datos:', error);
    }
  };

  const handleJoinChallenge = async (challengeId: string) => {
    if (!playerProfile) return;
    try {
      await joinChallenge(challengeId, playerProfile.id);
      await loadData();
    } catch (error) {
      console.error('Error uniéndose al desafío:', error);
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'fácil':
        return colors.success;
      case 'media':
        return colors.warning;
      case 'difícil':
        return colors.error;
      default:
        return colors.primary;
    }
  };

  const getChallengeIcon = (type: string) => {
    switch (type) {
      case 'speed':
        return '⚡';
      case 'quality':
        return '✨';
      case 'quantity':
        return '📦';
      case 'collection':
        return '🎯';
      case 'coins':
        return '💰';
      default:
        return '🏆';
    }
  };

  const renderChallengeCard = ({ item }: { item: Challenge }) => {
    const isJoined = playerProfile && item.participants.includes(playerProfile.id);

    return (
      <View className="bg-surface rounded-lg p-4 mb-3 border border-border">
        <View className="flex-row items-start justify-between mb-3">
          <View className="flex-1">
            <View className="flex-row items-center gap-2 mb-1">
              <Text className="text-2xl">{getChallengeIcon(item.type)}</Text>
              <Text className="text-base font-bold text-foreground flex-1">{item.name}</Text>
            </View>
            <Text className="text-sm text-muted">{item.description}</Text>
          </View>
          <View
            className="px-2 py-1 rounded-full"
            style={{ backgroundColor: getDifficultyColor(item.difficulty) + '20' }}
          >
            <Text
              className="text-xs font-bold"
              style={{ color: getDifficultyColor(item.difficulty) }}
            >
              {item.difficulty}
            </Text>
          </View>
        </View>

        <Text className="text-sm text-foreground mb-2">{item.objective}</Text>

        <View className="flex-row items-center justify-between mb-3">
          <View className="flex-row items-center gap-4">
            <View className="flex-row items-center gap-1">
              <MaterialIcons name="people" size={14} color={colors.muted} />
              <Text className="text-xs text-muted">{item.participants.length} participantes</Text>
            </View>
            <View className="flex-row items-center gap-1">
              <MaterialIcons name="monetization-on" size={14} color={colors.warning} />
              <Text className="text-xs text-muted">{item.reward} doblones</Text>
            </View>
          </View>
        </View>

        <Pressable
          onPress={() => handleJoinChallenge(item.id)}
          disabled={isJoined}
          className={`rounded-lg p-2 flex-row items-center justify-center gap-2 ${
            isJoined ? 'bg-success/20' : 'bg-primary active:opacity-80'
          }`}
        >
          <MaterialIcons
            name={isJoined ? 'check-circle' : 'add-circle'}
            size={18}
            color={isJoined ? colors.success : 'white'}
          />
          <Text className={`font-semibold text-sm ${isJoined ? 'text-success' : 'text-white'}`}>
            {isJoined ? 'Unido' : 'Unirse'}
          </Text>
        </Pressable>
      </View>
    );
  };

  const renderLeaderboardEntry = ({ item }: { item: LeaderboardEntry }) => {
    const isCurrentPlayer = playerProfile && item.playerId === playerProfile.id;

    return (
      <View
        className={`flex-row items-center gap-3 p-3 rounded-lg mb-2 border ${
          isCurrentPlayer ? 'bg-primary/10 border-primary' : 'bg-surface border-border'
        }`}
      >
        <View
          className={`w-10 h-10 rounded-full items-center justify-center ${
            item.rank === 1
              ? 'bg-yellow-500'
              : item.rank === 2
                ? 'bg-gray-400'
                : item.rank === 3
                  ? 'bg-orange-600'
                  : 'bg-border'
          }`}
        >
          <Text className="font-bold text-white">{item.rank}</Text>
        </View>

        <View className="flex-1">
          <Text className="font-bold text-foreground">{item.username}</Text>
          <View className="flex-row gap-2 mt-1">
            <Text className="text-xs text-muted">🌱 {item.plantCount}</Text>
            <Text className="text-xs text-muted">💰 {item.coinsEarned}</Text>
            <Text className="text-xs text-muted">🔥 {item.streakDays}</Text>
          </View>
        </View>

        <View className="items-end">
          <Text className="font-bold text-lg text-primary">{Math.round(item.score)}</Text>
          <Text className="text-xs text-muted">pts</Text>
        </View>
      </View>
    );
  };

  return (
    <ScreenContainer className="p-4">
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        {/* Header */}
        <View className="mb-6">
          <Text className="text-2xl font-bold text-foreground">🏆 Desafíos</Text>
          <Text className="text-sm text-muted">Compite con otros jugadores</Text>
        </View>

        {/* Tabs */}
        <View className="flex-row gap-2 mb-6">
          <Pressable
            onPress={() => setActiveTab('challenges')}
            className={`flex-1 rounded-lg p-3 items-center ${
              activeTab === 'challenges'
                ? 'bg-primary'
                : 'bg-surface border border-border'
            }`}
          >
            <Text
              className={`font-bold ${
                activeTab === 'challenges' ? 'text-white' : 'text-foreground'
              }`}
            >
              Desafíos
            </Text>
          </Pressable>

          <Pressable
            onPress={() => setActiveTab('leaderboard')}
            className={`flex-1 rounded-lg p-3 items-center ${
              activeTab === 'leaderboard'
                ? 'bg-primary'
                : 'bg-surface border border-border'
            }`}
          >
            <Text
              className={`font-bold ${
                activeTab === 'leaderboard' ? 'text-white' : 'text-foreground'
              }`}
            >
              Ranking
            </Text>
          </Pressable>
        </View>

        {/* Contenido */}
        {activeTab === 'challenges' ? (
          <View>
            <Text className="text-base font-bold text-foreground mb-3">Desafíos Activos</Text>
            <FlatList
              data={challenges}
              renderItem={renderChallengeCard}
              keyExtractor={(item) => item.id}
              scrollEnabled={false}
            />
          </View>
        ) : (
          <View>
            <Text className="text-base font-bold text-foreground mb-3">Ranking Global</Text>
            {leaderboard.length > 0 ? (
              <FlatList
                data={leaderboard.slice(0, 10)}
                renderItem={renderLeaderboardEntry}
                keyExtractor={(item) => item.playerId}
                scrollEnabled={false}
              />
            ) : (
              <View className="bg-surface rounded-lg p-6 items-center">
                <Text className="text-lg text-muted">Sin datos aún</Text>
              </View>
            )}
          </View>
        )}

        {/* Información */}
        <View className="bg-primary/10 rounded-lg p-4 mt-6 border border-primary/20">
          <Text className="text-sm font-bold text-foreground mb-2">💡 Consejo</Text>
          <Text className="text-xs text-foreground leading-relaxed">
            Participa en desafíos para ganar doblones extra y subir en el ranking. Cada desafío tiene
            diferentes dificultades y recompensas.
          </Text>
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}
