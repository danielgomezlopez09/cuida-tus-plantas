import { View, Text, Pressable, ScrollView, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { ScreenContainer } from '@/components/screen-container';
import { useGame } from '@/lib/contexts/GameContext';
import { useColors } from '@/hooks/use-colors';
import { MaterialIcons } from '@expo/vector-icons';
import { useState, useEffect } from 'react';

/**
 * Pantalla principal del juego de cultivo de plantas
 */
export default function GameScreen() {
  const router = useRouter();
  const colors = useColors();
  const { gameState, getCurrentPlant, plantSeed, waterPlant, fertilizePlant, repotPlant, harvestPlant, getSeeds } = useGame();
  const [currentPlant, setCurrentPlant] = useState(getCurrentPlant());
  const [nextCareTime, setNextCareTime] = useState<string>('');

  const plant = currentPlant || getCurrentPlant();

  useEffect(() => {
    setCurrentPlant(plant);
    updateNextCareTime();
    const interval = setInterval(updateNextCareTime, 60000);
    return () => clearInterval(interval);
  }, [plant]);

  const updateNextCareTime = () => {
    if (!plant) return;

    const now = Date.now();
    const wateringHours = (plant.lastWateredAt + 8 * 60 * 60 * 1000 - now) / (1000 * 60 * 60);
    const fertilizingHours = (plant.lastFertilizedAt + 48 * 60 * 60 * 1000 - now) / (1000 * 60 * 60);
    const repottingHours = (plant.lastRepottedAt + 240 * 60 * 60 * 1000 - now) / (1000 * 60 * 60);

    const nextCare = Math.min(
      Math.max(0, wateringHours),
      Math.max(0, fertilizingHours),
      Math.max(0, repottingHours)
    );

    setNextCareTime(`${Math.ceil(nextCare)}h`);
  };

  const handlePlantSeed = () => {
    router.push('/game-seed-selection');
  };

  const handleWater = async () => {
    if (!plant) return;
    await waterPlant();
    setCurrentPlant(getCurrentPlant());
  };

  const handleFertilize = async () => {
    if (!plant || gameState.fertilizersOwned <= 0) {
      Alert.alert('Sin fertilizante', 'Necesitas comprar más fertilizante en la tienda');
      return;
    }
    await fertilizePlant();
    setCurrentPlant(getCurrentPlant());
  };

  const handleRepot = async () => {
    if (!plant) return;
    await repotPlant();
    setCurrentPlant(getCurrentPlant());
  };

  const handleHarvest = async () => {
    if (!plant || !plant.isReadyToHarvest) return;
    await harvestPlant();
    setCurrentPlant(null);
  };

  const getPlantStageEmoji = (stage: number, total: number): string => {
    const progress = stage / (total - 1);
    if (progress < 0.2) return '🌱';
    if (progress < 0.4) return '🌿';
    if (progress < 0.6) return '🌱';
    if (progress < 0.8) return '🌿';
    return '🌳';
  };

  const getHealthColor = (health: number): string => {
    if (health >= 80) return colors.success;
    if (health >= 50) return colors.warning;
    return colors.error;
  };

  return (
    <ScreenContainer className="p-4">
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        {/* Header */}
        <View className="flex-row items-center justify-between mb-6">
          <View>
            <Text className="text-2xl font-bold text-foreground">Mi Jardín</Text>
            <Text className="text-sm text-muted">Cultiva y cosecha plantas</Text>
          </View>
          <View className="bg-primary rounded-full px-4 py-2 flex-row items-center gap-2">
            <MaterialIcons name="monetization-on" size={20} color="white" />
            <Text className="text-white font-bold">{gameState.coins}</Text>
          </View>
        </View>

        {/* Planta Actual */}
        {plant ? (
          <View className="bg-surface rounded-lg border-2 border-primary p-6 mb-6">
            {/* Información de la Planta */}
            <View className="items-center mb-6">
              <Text className="text-6xl mb-2">{plant.seedEmoji}</Text>
              <Text className="text-xl font-bold text-foreground">{plant.seedName}</Text>
              <Text className="text-sm text-muted mt-1">Etapa {plant.currentStage + 1} de {plant.totalStages}</Text>
            </View>

            {/* Barra de Progreso */}
            <View className="mb-6">
              <View className="flex-row gap-1 mb-2">
                {Array.from({ length: plant.totalStages }).map((_, i) => (
                  <View
                    key={i}
                    className={`flex-1 h-2 rounded-full ${
                      i <= plant.currentStage ? 'bg-primary' : 'bg-border'
                    }`}
                  />
                ))}
              </View>
              <Text className="text-xs text-muted text-center">
                {Math.round((plant.currentStage / plant.totalStages) * 100)}% de crecimiento
              </Text>
            </View>

            {/* Salud */}
            <View className="mb-6">
              <View className="flex-row items-center justify-between mb-2">
                <Text className="text-sm font-semibold text-foreground">Salud</Text>
                <Text className="text-sm font-bold" style={{ color: getHealthColor(plant.health) }}>
                  {plant.health}%
                </Text>
              </View>
              <View className="h-2 bg-border rounded-full overflow-hidden">
                <View
                  className="h-full rounded-full"
                  style={{
                    width: `${plant.health}%`,
                    backgroundColor: getHealthColor(plant.health),
                  }}
                />
              </View>
            </View>

            {/* Racha de Cuidados */}
            <View className="flex-row items-center gap-2 mb-6 bg-primary/10 rounded-lg p-3 border border-primary/20">
              <MaterialIcons name="local-florist" size={20} color={colors.primary} />
              <View>
                <Text className="text-xs text-muted">Racha de Cuidados</Text>
                <Text className="text-lg font-bold text-foreground">{plant.careStreak} días</Text>
              </View>
            </View>

            {/* Botones de Cuidado */}
            <View className="gap-3 mb-6">
              <Pressable
                onPress={handleWater}
                className="bg-blue-500 rounded-lg p-4 flex-row items-center justify-center gap-2 active:opacity-80"
              >
                <MaterialIcons name="water-drop" size={24} color="white" />
                <Text className="text-white font-semibold">Regar</Text>
              </Pressable>

              <View className="flex-row gap-3">
                <Pressable
                  onPress={handleFertilize}
                  className="flex-1 bg-green-500 rounded-lg p-3 flex-row items-center justify-center gap-2 active:opacity-80"
                >
                  <MaterialIcons name="eco" size={20} color="white" />
                  <Text className="text-white font-semibold text-sm">Fertilizar</Text>
                </Pressable>

                <Pressable
                  onPress={handleRepot}
                  className="flex-1 bg-orange-500 rounded-lg p-3 flex-row items-center justify-center gap-2 active:opacity-80"
                >
                  <MaterialIcons name="home-repair-service" size={20} color="white" />
                  <Text className="text-white font-semibold text-sm">Trasplantar</Text>
                </Pressable>
              </View>
            </View>

            {/* Botón de Cosecha */}
            {plant.isReadyToHarvest ? (
              <Pressable
                onPress={handleHarvest}
                className="bg-success rounded-lg p-4 flex-row items-center justify-center gap-2 active:opacity-80"
              >
                <MaterialIcons name="check-circle" size={24} color="white" />
                <Text className="text-white font-bold">Cosechar - {plant.coinsPerHarvest} 🪙</Text>
              </Pressable>
            ) : (
              <View className="bg-border/50 rounded-lg p-4 flex-row items-center justify-center gap-2">
                <MaterialIcons name="schedule" size={20} color={colors.muted} />
                <Text className="text-muted">Próximo cuidado: {nextCareTime}</Text>
              </View>
            )}
          </View>
        ) : (
          <View className="bg-surface rounded-lg border-2 border-dashed border-border p-8 items-center justify-center mb-6">
            <Text className="text-5xl mb-4">🌱</Text>
            <Text className="text-lg font-bold text-foreground mb-2">Sin Planta Actual</Text>
            <Text className="text-sm text-muted text-center mb-4">
              Selecciona una semilla para comenzar a cultivar
            </Text>
            <Pressable
              onPress={handlePlantSeed}
              className="bg-primary rounded-lg px-6 py-3 flex-row items-center gap-2 active:opacity-80"
            >
              <MaterialIcons name="add" size={20} color="white" />
              <Text className="text-white font-semibold">Plantar Semilla</Text>
            </Pressable>
          </View>
        )}

        {/* Botones de Acción */}
        <View className="gap-3">
          <Pressable
            onPress={() => router.push('/game-shop')}
            className="bg-surface border border-border rounded-lg p-4 flex-row items-center justify-between active:opacity-80"
          >
            <View className="flex-row items-center gap-3">
              <MaterialIcons name="store" size={24} color={colors.primary} />
              <Text className="text-foreground font-semibold">Tienda</Text>
            </View>
            <MaterialIcons name="arrow-forward" size={20} color={colors.muted} />
          </Pressable>

          <Pressable
            onPress={() => router.push('/game-achievements')}
            className="bg-surface border border-border rounded-lg p-4 flex-row items-center justify-between active:opacity-80"
          >
            <View className="flex-row items-center gap-3">
              <MaterialIcons name="emoji-events" size={24} color={colors.warning} />
              <Text className="text-foreground font-semibold">Logros</Text>
            </View>
            <MaterialIcons name="arrow-forward" size={20} color={colors.muted} />
          </Pressable>

          <Pressable
            onPress={() => router.push('/game-collection')}
            className="bg-surface border border-border rounded-lg p-4 flex-row items-center justify-between active:opacity-80"
          >
            <View className="flex-row items-center gap-3">
              <MaterialIcons name="collections" size={24} color={colors.success} />
              <Text className="text-foreground font-semibold">Mi Colección</Text>
            </View>
            <MaterialIcons name="arrow-forward" size={20} color={colors.muted} />
          </Pressable>
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}
