import { View, Text, Pressable, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { ScreenContainer } from '@/components/screen-container';
import { useGame } from '@/lib/contexts/GameContext';
import { useColors } from '@/hooks/use-colors';
import { MaterialIcons } from '@expo/vector-icons';

/**
 * Pantalla de logros y desafíos
 */
export default function GameAchievementsScreen() {
  const router = useRouter();
  const colors = useColors();
  const { getAchievements } = useGame();

  const achievements = getAchievements();
  const unlockedCount = achievements.filter((a) => a.unlockedAt).length;

  return (
    <ScreenContainer className="p-4">
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        {/* Header */}
        <View className="flex-row items-center justify-between mb-6">
          <Pressable onPress={() => router.back()} className="flex-row items-center">
            <MaterialIcons name="arrow-back" size={24} color={colors.foreground} />
          </Pressable>
          <Text className="text-2xl font-bold text-foreground">Logros</Text>
          <View className="w-6" />
        </View>

        {/* Estadísticas */}
        <View className="bg-primary/10 rounded-lg p-4 mb-6 border border-primary/20">
          <View className="flex-row items-center justify-between">
            <View>
              <Text className="text-sm text-muted">Logros Desbloqueados</Text>
              <Text className="text-2xl font-bold text-foreground">
                {unlockedCount}/{achievements.length}
              </Text>
            </View>
            <Text className="text-4xl">{Math.round((unlockedCount / achievements.length) * 100)}%</Text>
          </View>
        </View>

        {/* Lista de Logros */}
        <View className="gap-3">
          {achievements.map((achievement) => {
            const isUnlocked = achievement.unlockedAt !== null;
            const progress = achievement.progress / achievement.target;

            return (
              <View
                key={achievement.id}
                className={`rounded-lg p-4 border ${
                  isUnlocked
                    ? 'bg-success/10 border-success'
                    : 'bg-surface border-border'
                }`}
              >
                <View className="flex-row items-start gap-3">
                  <View
                    className={`w-12 h-12 rounded-lg items-center justify-center ${
                      isUnlocked ? 'bg-success/20' : 'bg-border'
                    }`}
                  >
                    <Text className="text-2xl">{achievement.icon}</Text>
                  </View>

                  <View className="flex-1">
                    <View className="flex-row items-center gap-2 mb-1">
                      <Text className="text-base font-bold text-foreground flex-1">
                        {achievement.name}
                      </Text>
                      {isUnlocked && (
                        <MaterialIcons name="check-circle" size={20} color={colors.success} />
                      )}
                    </View>

                    <Text className="text-sm text-muted mb-2">{achievement.description}</Text>

                    {/* Barra de Progreso */}
                    {!isUnlocked && (
                      <View>
                        <View className="h-2 bg-border rounded-full overflow-hidden mb-1">
                          <View
                            className="h-full bg-primary rounded-full"
                            style={{ width: `${Math.min(progress * 100, 100)}%` }}
                          />
                        </View>
                        <Text className="text-xs text-muted">
                          {achievement.progress} / {achievement.target}
                        </Text>
                      </View>
                    )}
                  </View>
                </View>
              </View>
            );
          })}
        </View>

        {/* Información */}
        <View className="bg-primary/10 rounded-lg p-4 mt-6 border border-primary/20">
          <Text className="text-sm font-bold text-foreground mb-2">💡 Consejo</Text>
          <Text className="text-xs text-foreground leading-relaxed">
            Desbloquea logros cuidando bien tus plantas, ganando doblones y cultivando diferentes especies. ¡Cada logro te acerca a ser un maestro jardinero!
          </Text>
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}
