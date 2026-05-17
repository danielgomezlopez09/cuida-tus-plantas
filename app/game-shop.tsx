import { View, Text, Pressable, ScrollView, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { ScreenContainer } from '@/components/screen-container';
import { useGame } from '@/lib/contexts/GameContext';
import { useColors } from '@/hooks/use-colors';
import { MaterialIcons } from '@expo/vector-icons';
import { useState } from 'react';

/**
 * Pantalla de tienda para comprar semillas y fertilizantes
 */
export default function GameShopScreen() {
  const router = useRouter();
  const colors = useColors();
  const { gameState, buySeed, buyFertilizer, getSeeds } = useGame();
  const [refreshing, setRefreshing] = useState(false);

  const seeds = getSeeds();

  const handleBuySeed = async (seedId: number) => {
    const success = await buySeed(seedId);
    if (success) {
      Alert.alert('¡Éxito!', 'Semilla comprada correctamente');
      setRefreshing(!refreshing);
    } else {
      Alert.alert('Error', 'No tienes suficientes doblones');
    }
  };

  const handleBuyFertilizer = async () => {
    const success = await buyFertilizer();
    if (success) {
      Alert.alert('¡Éxito!', 'Fertilizante comprado correctamente');
      setRefreshing(!refreshing);
    } else {
      Alert.alert('Error', 'No tienes suficientes doblones');
    }
  };

  return (
    <ScreenContainer className="p-4">
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        {/* Header */}
        <View className="flex-row items-center justify-between mb-6">
          <Pressable onPress={() => router.back()} className="flex-row items-center">
            <MaterialIcons name="arrow-back" size={24} color={colors.foreground} />
          </Pressable>
          <Text className="text-2xl font-bold text-foreground">Tienda</Text>
          <View className="bg-primary rounded-full px-3 py-1 flex-row items-center gap-1">
            <MaterialIcons name="monetization-on" size={16} color="white" />
            <Text className="text-white font-bold text-sm">{gameState.coins}</Text>
          </View>
        </View>

        {/* Sección de Semillas */}
        <View className="mb-8">
          <View className="flex-row items-center gap-2 mb-4">
            <MaterialIcons name="local-florist" size={24} color={colors.primary} />
            <Text className="text-xl font-bold text-foreground">Semillas</Text>
          </View>

          {seeds.map((seed) => (
            <View key={seed.id} className="bg-surface rounded-lg p-4 mb-3 border border-border">
              <View className="flex-row items-start justify-between">
                <View className="flex-1">
                  <View className="flex-row items-center gap-2 mb-1">
                    <Text className="text-3xl">{seed.emoji}</Text>
                    <View className="flex-1">
                      <Text className="text-base font-bold text-foreground">{seed.name}</Text>
                      <Text className="text-xs text-muted">{seed.type}</Text>
                    </View>
                  </View>
                  <Text className="text-sm text-foreground mt-2">{seed.description}</Text>

                  <View className="flex-row items-center gap-4 mt-3">
                    <View className="flex-row items-center gap-1">
                      <MaterialIcons name="schedule" size={14} color={colors.muted} />
                      <Text className="text-xs text-muted">{seed.growthTime}d</Text>
                    </View>
                    <View className="flex-row items-center gap-1">
                      <MaterialIcons name="monetization-on" size={14} color={colors.warning} />
                      <Text className="text-xs text-muted">{seed.coinsPerHarvest}</Text>
                    </View>
                  </View>
                </View>

                <Pressable
                  onPress={() => handleBuySeed(seed.id)}
                  className={`rounded-lg px-4 py-2 flex-row items-center gap-1 ${
                    gameState.coins >= 10 || seed.id === 1
                      ? 'bg-primary active:opacity-80'
                      : 'bg-border opacity-50'
                  }`}
                >
                  <MaterialIcons
                    name="shopping-cart"
                    size={16}
                    color={gameState.coins >= 10 || seed.id === 1 ? 'white' : colors.muted}
                  />
                  <Text
                    className={`font-bold text-sm ${
                      gameState.coins >= 10 || seed.id === 1 ? 'text-white' : 'text-muted'
                    }`}
                  >
                    {seed.id === 1 ? 'GRATIS' : '10'}
                  </Text>
                </Pressable>
              </View>
            </View>
          ))}
        </View>

        {/* Sección de Fertilizante */}
        <View className="mb-8">
          <View className="flex-row items-center gap-2 mb-4">
            <MaterialIcons name="eco" size={24} color={colors.success} />
            <Text className="text-xl font-bold text-foreground">Fertilizante</Text>
          </View>

          <View className="bg-surface rounded-lg p-4 border border-border">
            <View className="flex-row items-start justify-between">
              <View className="flex-1">
                <Text className="text-base font-bold text-foreground mb-1">Bolsa de Fertilizante</Text>
                <Text className="text-sm text-muted mb-3">
                  Necesario para fertilizar tus plantas cada 48 horas. La primera bolsa es gratis.
                </Text>

                <View className="flex-row items-center gap-2">
                  <MaterialIcons name="inventory-2" size={16} color={colors.primary} />
                  <Text className="text-sm text-foreground">
                    Bolsas disponibles: {gameState.fertilizersOwned}
                  </Text>
                </View>
              </View>

              <Pressable
                onPress={handleBuyFertilizer}
                className={`rounded-lg px-4 py-2 flex-row items-center gap-1 ${
                  gameState.coins >= 10 ? 'bg-success active:opacity-80' : 'bg-border opacity-50'
                }`}
              >
                <MaterialIcons
                  name="shopping-cart"
                  size={16}
                  color={gameState.coins >= 10 ? 'white' : colors.muted}
                />
                <Text
                  className={`font-bold text-sm ${gameState.coins >= 10 ? 'text-white' : 'text-muted'}`}
                >
                  10
                </Text>
              </Pressable>
            </View>
          </View>
        </View>

        {/* Información de Precios */}
        <View className="bg-primary/10 rounded-lg p-4 border border-primary/20">
          <Text className="text-sm font-bold text-foreground mb-2">💡 Consejo</Text>
          <Text className="text-xs text-foreground leading-relaxed">
            Cuida bien tus plantas para ganar más doblones. Cuanto mejor sea el cuidado, más monedas ganarás por cosecha. ¡Mantén una racha de cuidados para obtener bonificaciones!
          </Text>
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}
