import React, { useState } from 'react';
import {
  ScrollView,
  Text,
  View,
  Pressable,
  FlatList,
  Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import { ScreenContainer } from '@/components/screen-container';
import { PlantCard } from '@/components/PlantCard';
import { useColors } from '@/hooks/use-colors';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { usePlants } from '@/lib/contexts/PlantContext';
import { useFocusEffect } from '@react-navigation/native';
import { useCallback } from 'react';

export default function MyPlantsScreen() {
  const router = useRouter();
  const colors = useColors();
  const { userPlants, removePlant } = usePlants();
  const [sortBy, setSortBy] = useState<'name' | 'date'>('name');

  useFocusEffect(
    useCallback(() => {
      // Refresh when screen is focused
    }, [])
  );

  const sortedPlants = [...userPlants].sort((a, b) => {
    if (sortBy === 'name') {
      return a.plantName.localeCompare(b.plantName);
    }
    return new Date(b.purchaseDate).getTime() - new Date(a.purchaseDate).getTime();
  });

  const handleRemovePlant = (id: string, name: string) => {
    Alert.alert(
      'Eliminar planta',
      `¿Estás seguro de que deseas eliminar "${name}" de tu colección?`,
      [
        {
          text: 'Cancelar',
          onPress: () => {},
          style: 'cancel',
        },
        {
          text: 'Eliminar',
          onPress: async () => {
            await removePlant(id);
          },
          style: 'destructive',
        },
      ]
    );
  };

  return (
    <ScreenContainer className="bg-background">
      {/* Header */}
      <View className="px-4 pt-4 pb-4 flex-row items-center gap-3">
        <Pressable
          onPress={() => router.back()}
          style={({ pressed }) => ({ opacity: pressed ? 0.6 : 1 })}
        >
          <MaterialIcons name="arrow-back" size={24} color={colors.foreground} />
        </Pressable>
        <Text className="text-2xl font-bold text-foreground flex-1">
          Mis plantas
        </Text>
      </View>

      {/* Sort Options */}
      <View className="px-4 pb-4 flex-row gap-2">
        <Pressable
          onPress={() => setSortBy('name')}
          style={({ pressed }) => ({ opacity: pressed ? 0.8 : 1 })}
        >
          <View
            className={`px-4 py-2 rounded-lg border ${
              sortBy === 'name'
                ? 'bg-primary border-primary'
                : 'bg-surface border-border'
            }`}
          >
            <Text
              className={`font-medium text-sm ${
                sortBy === 'name' ? 'text-white' : 'text-foreground'
              }`}
            >
              Por nombre
            </Text>
          </View>
        </Pressable>

        <Pressable
          onPress={() => setSortBy('date')}
          style={({ pressed }) => ({ opacity: pressed ? 0.8 : 1 })}
        >
          <View
            className={`px-4 py-2 rounded-lg border ${
              sortBy === 'date'
                ? 'bg-primary border-primary'
                : 'bg-surface border-border'
            }`}
          >
            <Text
              className={`font-medium text-sm ${
                sortBy === 'date' ? 'text-white' : 'text-foreground'
              }`}
            >
              Por fecha
            </Text>
          </View>
        </Pressable>
      </View>

      {/* Plants List */}
      {userPlants.length === 0 ? (
        <View className="flex-1 items-center justify-center px-4">
          <MaterialIcons name="local-florist" size={64} color={colors.muted} />
          <Text className="text-lg font-semibold text-foreground mt-4">
            Aún no tienes plantas
          </Text>
          <Text className="text-sm text-muted text-center mt-2">
            Comienza a agregar plantas a tu colección
          </Text>
          <Pressable
            onPress={() => router.push('/explore')}
            style={({ pressed }) => ({ opacity: pressed ? 0.8 : 1 })}
          >
            <View className="bg-primary rounded-lg px-6 py-3 mt-6 flex-row items-center gap-2">
              <MaterialIcons name="add" size={20} color="white" />
              <Text className="text-white font-semibold">Explorar plantas</Text>
            </View>
          </Pressable>
        </View>
      ) : (
        <View className="px-4 pb-6 flex-1">
          <FlatList
            data={sortedPlants}
            keyExtractor={(item) => item.id}
            scrollEnabled={true}
            renderItem={({ item }) => (
              <Pressable
                onPress={() =>
                  router.push({
                    pathname: '/user-plant-detail',
                    params: { userPlantId: item.id },
                  })
                }
                onLongPress={() => handleRemovePlant(item.id, item.plantName)}
                style={({ pressed }) => ({
                  opacity: pressed ? 0.7 : 1,
                })}
              >
                <View className="mb-3">
                  <PlantCard
                    id={item.plantId}
                    name={item.plantName}
                    onPress={() =>
                      router.push({
                        pathname: '/user-plant-detail',
                        params: { userPlantId: item.id },
                      })
                    }
                    variant="horizontal"
                  />
                </View>
              </Pressable>
            )}
          />
        </View>
      )}
    </ScreenContainer>
  );
}
