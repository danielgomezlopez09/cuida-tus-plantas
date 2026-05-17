import React, { useState, useEffect } from 'react';
import {
  ScrollView,
  Text,
  View,
  TextInput,
  Pressable,
  FlatList,
} from 'react-native';
import { useRouter } from 'expo-router';
import { ScreenContainer } from '@/components/screen-container';
import { PlantCard } from '@/components/PlantCard';
import { usePlantsDatabase } from '@/hooks/use-plants-database';
import { useColors } from '@/hooks/use-colors';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { Plant } from '@/lib/types/plants';

export default function ExploreScreen() {
  const router = useRouter();
  const colors = useColors();
  const { plants, searchPlants, getTypes, getPlantsByType } = usePlantsDatabase();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState<string | null>(null);
  const [filteredPlants, setFilteredPlants] = useState<Plant[]>(plants);
  const [types] = useState(getTypes());

  useEffect(() => {
    let results = plants;

    // Apply search filter
    if (searchQuery.trim()) {
      results = searchPlants(searchQuery);
    }

    // Apply type filter
    if (selectedType) {
      results = results.filter(p => p.type === selectedType);
    }

    setFilteredPlants(results);
  }, [searchQuery, selectedType, plants]);

  const handlePlantPress = (plantId: number) => {
    router.push({
      pathname: '/plant-detail',
      params: { plantId: plantId.toString() },
    });
  };

  const typeLabels: Record<string, string> = {
    planta_interior: '🏠 Interior',
    arbol_frutal: '🍎 Frutales',
    arbusto_floral: '🌸 Flores',
    hierba_aromatica: '🌿 Aromáticas',
    hortaliza: '🥕 Hortalizas',
    suculenta: '🌵 Suculentas',
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
          Explorar plantas
        </Text>
      </View>

      {/* Search Bar */}
      <View className="px-4 pb-4">
        <View className="flex-row items-center bg-surface border border-border rounded-lg px-3 py-2">
          <MaterialIcons name="search" size={20} color={colors.muted} />
          <TextInput
            placeholder="Buscar planta..."
            placeholderTextColor={colors.muted}
            value={searchQuery}
            onChangeText={setSearchQuery}
            className="flex-1 ml-2 text-foreground"
          />
          {searchQuery && (
            <Pressable
              onPress={() => setSearchQuery('')}
              style={({ pressed }) => ({ opacity: pressed ? 0.6 : 1 })}
            >
              <MaterialIcons name="close" size={20} color={colors.muted} />
            </Pressable>
          )}
        </View>
      </View>

      {/* Type Filters */}
      <View className="px-4 pb-4">
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ gap: 8 }}
        >
          <Pressable
            onPress={() => setSelectedType(null)}
            style={({ pressed }) => ({
              opacity: pressed ? 0.8 : 1,
            })}
          >
            <View
              className={`px-4 py-2 rounded-full border ${
                selectedType === null
                  ? 'bg-primary border-primary'
                  : 'bg-surface border-border'
              }`}
            >
              <Text
                className={`font-medium text-sm ${
                  selectedType === null ? 'text-white' : 'text-foreground'
                }`}
              >
                Todas
              </Text>
            </View>
          </Pressable>

          {types.map((type) => (
            <Pressable
              key={type}
              onPress={() => setSelectedType(type)}
              style={({ pressed }) => ({
                opacity: pressed ? 0.8 : 1,
              })}
            >
              <View
                className={`px-4 py-2 rounded-full border ${
                  selectedType === type
                    ? 'bg-primary border-primary'
                    : 'bg-surface border-border'
                }`}
              >
                <Text
                  className={`font-medium text-sm ${
                    selectedType === type ? 'text-white' : 'text-foreground'
                  }`}
                >
                  {typeLabels[type] || type}
                </Text>
              </View>
            </Pressable>
          ))}
        </ScrollView>
      </View>

      {/* Results Count */}
      <View className="px-4 pb-2">
        <Text className="text-sm text-muted">
          {filteredPlants.length} planta{filteredPlants.length !== 1 ? 's' : ''} encontrada{filteredPlants.length !== 1 ? 's' : ''}
        </Text>
      </View>

      {/* Plants Grid */}
      <View className="px-4 pb-6 flex-1">
        <FlatList
          data={filteredPlants}
          keyExtractor={(item) => item.id.toString()}
          numColumns={2}
          columnWrapperStyle={{ gap: 12 }}
          scrollEnabled={true}
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
          ListEmptyComponent={
            <View className="flex-1 items-center justify-center py-12">
              <MaterialIcons name="search-off" size={48} color={colors.muted} />
              <Text className="text-muted text-center mt-4">
                No se encontraron plantas
              </Text>
            </View>
          }
        />
      </View>
    </ScreenContainer>
  );
}
