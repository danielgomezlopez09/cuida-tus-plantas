import { ScrollView, Text, View, Pressable, FlatList } from 'react-native';
import { useRouter } from 'expo-router';
import { ScreenContainer } from '@/components/screen-container';
import { PlantCard } from '@/components/PlantCard';
import { usePlantsDatabase } from '@/hooks/use-plants-database';
import { useColors } from '@/hooks/use-colors';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { usePlants } from '@/lib/contexts/PlantContext';
import { useEffect, useState } from 'react';

export default function HomeScreen() {
  const router = useRouter();
  const colors = useColors();
  const { plants: allPlants, loading } = usePlantsDatabase();
  const { userPlants } = usePlants();
  const [featuredPlants, setFeaturedPlants] = useState(allPlants.slice(0, 5));

  useEffect(() => {
    setFeaturedPlants(allPlants.slice(0, 5));
  }, [allPlants]);

  const handleAddPlant = () => {
    router.push('/explore');
  };

  const handlePlantPress = (plantId: number) => {
    router.push({
      pathname: '/plant-detail',
      params: { plantId: plantId.toString() },
    });
  };

  const handleMyPlants = () => {
    router.push('/my-plants');
  };

  return (
    <ScreenContainer className="bg-background">
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ flexGrow: 1 }}
      >
        {/* Header */}
        <View className="px-4 pt-6 pb-4">
          <Text className="text-3xl font-bold text-foreground">
            Cuida tus plantas
          </Text>
          <Text className="text-sm text-muted mt-1">
            {userPlants.length} planta{userPlants.length !== 1 ? 's' : ''} en tu colección
          </Text>
        </View>

        {/* Quick Actions */}
        <View className="px-4 pb-6 gap-3">
          <Pressable
            onPress={handleAddPlant}
            style={({ pressed }) => ({
              opacity: pressed ? 0.8 : 1,
            })}
          >
            <View className="bg-primary rounded-xl p-4 flex-row items-center justify-between">
              <View>
                <Text className="text-white font-semibold text-base">
                  Agregar nueva planta
                </Text>
                <Text className="text-white text-xs opacity-90 mt-1">
                  Explora nuestro catálogo
                </Text>
              </View>
              <MaterialIcons name="add-circle" size={28} color="white" />
            </View>
          </Pressable>

          <Pressable
            onPress={() => router.push('/camera')}
            style={({ pressed }) => ({
              opacity: pressed ? 0.8 : 1,
            })}
          >
            <View className="bg-accent rounded-xl p-4 flex-row items-center justify-between">
              <View>
                <Text className="text-white font-semibold text-base">
                  Buscar por foto
                </Text>
                <Text className="text-white text-xs opacity-90 mt-1">
                  Identifica plantas desconocidas
                </Text>
              </View>
              <MaterialIcons name="camera-alt" size={28} color="white" />
            </View>
          </Pressable>
        </View>

        {/* My Plants Section */}
        {userPlants.length > 0 && (
          <View className="px-4 pb-6">
            <View className="flex-row items-center justify-between mb-4">
              <Text className="text-lg font-semibold text-foreground">
                Mis plantas
              </Text>
              <Pressable
                onPress={handleMyPlants}
                style={({ pressed }) => ({
                  opacity: pressed ? 0.6 : 1,
                })}
              >
                <Text className="text-primary font-medium text-sm">Ver todas</Text>
              </Pressable>
            </View>
            <FlatList
              data={userPlants.slice(0, 3)}
              keyExtractor={(item) => item.id}
              scrollEnabled={false}
              renderItem={({ item }) => (
                <View className="mb-3">
                  <PlantCard
                    id={item.plantId}
                    name={item.plantName}
                    onPress={() => router.push({
                      pathname: '/user-plant-detail',
                      params: { userPlantId: item.id },
                    })}
                    variant="horizontal"
                  />
                </View>
              )}
            />
          </View>
        )}

        {/* Featured Plants Section */}
        <View className="px-4 pb-6">
          <View className="flex-row items-center justify-between mb-4">
            <Text className="text-lg font-semibold text-foreground">
              Plantas destacadas
            </Text>
            <Pressable
              onPress={() => router.push('/explore')}
              style={({ pressed }) => ({
                opacity: pressed ? 0.6 : 1,
              })}
            >
              <Text className="text-primary font-medium text-sm">Ver más</Text>
            </Pressable>
          </View>
          <FlatList
            data={featuredPlants}
            keyExtractor={(item) => item.id.toString()}
            scrollEnabled={false}
            numColumns={2}
            columnWrapperStyle={{ gap: 12 }}
            renderItem={({ item }) => (
              <View className="flex-1">
                <PlantCard
                  id={item.id}
                  name={item.name}
                  commonName={item.commonNames[0]}
                  category={item.category}
                  onPress={() => handlePlantPress(item.id)}
                  variant="compact"
                />
              </View>
            )}
          />
        </View>

        {/* Tips Section */}
        <View className="px-4 pb-6">
          <Text className="text-lg font-semibold text-foreground mb-3">
            Consejos del día
          </Text>
          <View className="bg-surface border border-border rounded-xl p-4">
            <View className="flex-row gap-3">
              <MaterialIcons name="lightbulb" size={24} color={colors.warning} />
              <View className="flex-1">
                <Text className="font-semibold text-foreground text-sm">
                  Riego inteligente
                </Text>
                <Text className="text-muted text-xs mt-2 leading-5">
                  Verifica siempre la humedad del sustrato antes de regar. El riego excesivo es la causa principal de muerte de plantas.
                </Text>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}
