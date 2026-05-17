import { View, Text, Pressable, ScrollView, FlatList } from 'react-native';
import { useRouter } from 'expo-router';
import { ScreenContainer } from '@/components/screen-container';
import { useGame } from '@/lib/contexts/GameContext';
import { useColors } from '@/hooks/use-colors';
import { MaterialIcons } from '@expo/vector-icons';

/**
 * Pantalla de colección de plantas cosechadas
 */
export default function GameCollectionScreen() {
  const router = useRouter();
  const colors = useColors();
  const { gameState, getHarvestedPlants, getSeeds } = useGame();

  const harvestedPlants = getHarvestedPlants();
  const seeds = getSeeds();

  const totalCoinsFromHarvests = harvestedPlants.reduce((sum, p) => sum + p.coinsEarned, 0);

  const renderPlantCard = ({ item }: { item: any }) => (
    <View className="bg-surface rounded-lg p-4 m-2 border border-border flex-1">
      <View className="items-center">
        <Text className="text-4xl mb-2">{item.seedEmoji}</Text>
        <Text className="text-sm font-bold text-foreground text-center mb-1">{item.seedName}</Text>
        <Text className="text-xs text-muted mb-2">
          {new Date(item.harvestedAt).toLocaleDateString('es-ES')}
        </Text>

        <View className="flex-row items-center gap-1 bg-warning/10 rounded-full px-2 py-1">
          <MaterialIcons name="monetization-on" size={14} color={colors.warning} />
          <Text className="text-xs font-bold text-warning">+{item.coinsEarned}</Text>
        </View>
      </View>
    </View>
  );

  return (
    <ScreenContainer className="p-4">
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        {/* Header */}
        <View className="flex-row items-center justify-between mb-6">
          <Pressable onPress={() => router.back()} className="flex-row items-center">
            <MaterialIcons name="arrow-back" size={24} color={colors.foreground} />
          </Pressable>
          <Text className="text-2xl font-bold text-foreground">Mi Colección</Text>
          <View className="w-6" />
        </View>

        {/* Estadísticas */}
        <View className="gap-3 mb-6">
          <View className="bg-success/10 rounded-lg p-4 border border-success">
            <View className="flex-row items-center gap-3">
              <MaterialIcons name="check-circle" size={24} color={colors.success} />
              <View>
                <Text className="text-sm text-muted">Plantas Cosechadas</Text>
                <Text className="text-2xl font-bold text-foreground">{harvestedPlants.length}</Text>
              </View>
            </View>
          </View>

          <View className="bg-warning/10 rounded-lg p-4 border border-warning">
            <View className="flex-row items-center gap-3">
              <MaterialIcons name="monetization-on" size={24} color={colors.warning} />
              <View>
                <Text className="text-sm text-muted">Doblones Ganados</Text>
                <Text className="text-2xl font-bold text-foreground">+{totalCoinsFromHarvests}</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Plantas Cosechadas */}
        {harvestedPlants.length > 0 ? (
          <>
            <Text className="text-lg font-bold text-foreground mb-3">Plantas Cosechadas</Text>
            <FlatList
              data={harvestedPlants}
              renderItem={renderPlantCard}
              keyExtractor={(item) => item.id}
              numColumns={2}
              scrollEnabled={false}
              contentContainerStyle={{ marginBottom: 20 }}
            />
          </>
        ) : (
          <View className="bg-surface rounded-lg border-2 border-dashed border-border p-8 items-center justify-center mb-6">
            <Text className="text-4xl mb-4">🌾</Text>
            <Text className="text-lg font-bold text-foreground mb-2">Sin Cosechas Aún</Text>
            <Text className="text-sm text-muted text-center">
              Cultiva y cosecha plantas para verlas aquí
            </Text>
          </View>
        )}

        {/* Especies Disponibles */}
        <Text className="text-lg font-bold text-foreground mb-3">Todas las Especies</Text>
        <View className="gap-2 mb-6">
          {seeds.map((seed) => {
            const harvested = harvestedPlants.filter((p) => p.seedId === seed.id).length;

            return (
              <View key={seed.id} className="bg-surface rounded-lg p-3 border border-border">
                <View className="flex-row items-center justify-between">
                  <View className="flex-row items-center gap-3 flex-1">
                    <Text className="text-2xl">{seed.emoji}</Text>
                    <View className="flex-1">
                      <Text className="text-sm font-bold text-foreground">{seed.name}</Text>
                      <Text className="text-xs text-muted">{seed.type}</Text>
                    </View>
                  </View>

                  <View className="items-center">
                    <Text className="text-lg font-bold text-foreground">{harvested}</Text>
                    <Text className="text-xs text-muted">cosechadas</Text>
                  </View>
                </View>
              </View>
            );
          })}
        </View>

        {/* Información */}
        <View className="bg-primary/10 rounded-lg p-4 border border-primary/20">
          <Text className="text-sm font-bold text-foreground mb-2">💡 Consejo</Text>
          <Text className="text-xs text-foreground leading-relaxed">
            Cultiva diferentes especies para completar tu colección. Cada planta cosechada te acerca a ser un coleccionista experto.
          </Text>
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}
