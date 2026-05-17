import React, { useState } from 'react';
import {
  ScrollView,
  Text,
  View,
  Pressable,
  useWindowDimensions,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { ScreenContainer } from '@/components/screen-container';
import { usePlantsDatabase } from '@/hooks/use-plants-database';
import { useColors } from '@/hooks/use-colors';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { usePlants } from '@/lib/contexts/PlantContext';
import { UserPlant } from '@/lib/types/plants';

export default function PlantDetailScreen() {
  const router = useRouter();
  const colors = useColors();
  const { plantId } = useLocalSearchParams();
  const { getPlantById } = usePlantsDatabase();
  const { addPlant } = usePlants();
  const [activeTab, setActiveTab] = useState<'care' | 'pests' | 'fertilizer'>('care');
  const [isAdded, setIsAdded] = useState(false);

  const plant = getPlantById(Number(plantId));

  if (!plant) {
    return (
      <ScreenContainer className="items-center justify-center">
        <Text className="text-foreground text-lg">Planta no encontrada</Text>
      </ScreenContainer>
    );
  }

  const handleAddPlant = async () => {
    const newUserPlant: UserPlant = {
      id: `${Date.now()}`,
      userId: 'current_user',
      plantId: plant.id,
      plantName: plant.name,
      location: 'Mi hogar',
      purchaseDate: new Date().toISOString().split('T')[0],
      notes: '',
    };
    await addPlant(newUserPlant);
    setIsAdded(true);
  };

  return (
    <ScreenContainer className="bg-background">
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View className="px-4 pt-4 pb-4 flex-row items-center justify-between">
          <Pressable
            onPress={() => router.back()}
            style={({ pressed }) => ({ opacity: pressed ? 0.6 : 1 })}
          >
            <MaterialIcons name="arrow-back" size={24} color={colors.foreground} />
          </Pressable>
          <Pressable
            style={({ pressed }) => ({ opacity: pressed ? 0.6 : 1 })}
          >
            <MaterialIcons name="share" size={24} color={colors.foreground} />
          </Pressable>
        </View>

        {/* Plant Image Placeholder */}
        <View className="px-4 pb-4">
          <View className="w-full h-64 bg-surface rounded-2xl border border-border items-center justify-center">
            <MaterialIcons name="image" size={64} color={colors.muted} />
          </View>
        </View>

        {/* Plant Info */}
        <View className="px-4 pb-4">
          <Text className="text-3xl font-bold text-foreground">
            {plant.name}
          </Text>
          <Text className="text-sm text-muted mt-2">
            {plant.commonNames.join(', ')}
          </Text>
          <View className="flex-row gap-2 mt-3">
            <View className="bg-primary/10 px-3 py-1 rounded-full">
              <Text className="text-xs font-medium text-primary">
                {plant.category}
              </Text>
            </View>
            <View className="bg-accent/10 px-3 py-1 rounded-full">
              <Text className="text-xs font-medium text-accent">
                {plant.type.replace('_', ' ')}
              </Text>
            </View>
          </View>
          <Text className="text-sm text-muted mt-4 leading-6">
            {plant.description}
          </Text>
        </View>

        {/* Add Plant Button */}
        <View className="px-4 pb-4">
          <Pressable
            onPress={handleAddPlant}
            disabled={isAdded}
            style={({ pressed }) => ({
              opacity: pressed ? 0.8 : 1,
            })}
          >
            <View
              className={`rounded-lg py-3 items-center justify-center flex-row gap-2 ${
                isAdded
                  ? 'bg-success/20 border border-success'
                  : 'bg-primary'
              }`}
            >
              <MaterialIcons
                name={isAdded ? 'check-circle' : 'add'}
                size={20}
                color={isAdded ? colors.success : 'white'}
              />
              <Text
                className={`font-semibold text-base ${
                  isAdded ? 'text-success' : 'text-white'
                }`}
              >
                {isAdded ? 'Agregada a mis plantas' : 'Agregar a mis plantas'}
              </Text>
            </View>
          </Pressable>
        </View>

        {/* Tabs */}
        <View className="px-4 pb-4 flex-row gap-2 border-b border-border">
          {(['care', 'pests', 'fertilizer'] as const).map((tab) => (
            <Pressable
              key={tab}
              onPress={() => setActiveTab(tab)}
              style={({ pressed }) => ({ opacity: pressed ? 0.6 : 1 })}
            >
              <View
                className={`pb-3 px-2 border-b-2 ${
                  activeTab === tab
                    ? 'border-primary'
                    : 'border-transparent'
                }`}
              >
                <Text
                  className={`font-semibold text-sm ${
                    activeTab === tab
                      ? 'text-primary'
                      : 'text-muted'
                  }`}
                >
                  {tab === 'care' ? 'Cuidados' : tab === 'pests' ? 'Plagas' : 'Fertilizantes'}
                </Text>
              </View>
            </Pressable>
          ))}
        </View>

        {/* Tab Content */}
        <View className="px-4 pb-6">
          {activeTab === 'care' && (
            <View className="gap-4">
              <CareItem icon="light-mode" label="Luz" value={plant.care.light} />
              <CareItem icon="opacity" label="Riego" value={plant.care.water} />
              <CareItem icon="thermostat" label="Temperatura" value={plant.care.temperature} />
              <CareItem icon="water-drop" label="Humedad" value={plant.care.humidity} />
              <CareItem icon="terrain" label="Sustrato" value={plant.care.soil} />
              <CareItem icon="schedule" label="Frecuencia" value={plant.care.frequency} />
            </View>
          )}

          {activeTab === 'pests' && (
            <View className="gap-4">
              <View>
                <Text className="font-semibold text-foreground mb-2">
                  Plagas comunes
                </Text>
                {plant.pests.map((pest, idx) => (
                  <View key={idx} className="flex-row items-center gap-2 mb-2">
                    <View className="w-2 h-2 rounded-full bg-error" />
                    <Text className="text-foreground">{pest}</Text>
                  </View>
                ))}
              </View>

              <View>
                <Text className="font-semibold text-foreground mb-2">
                  Control natural
                </Text>
                {plant.pestControl.natural.map((remedy, idx) => (
                  <View key={idx} className="flex-row items-center gap-2 mb-2">
                    <MaterialIcons name="check-circle" size={16} color={colors.success} />
                    <Text className="text-foreground">{remedy}</Text>
                  </View>
                ))}
              </View>

              {plant.pestControl.chemical.length > 0 && (
                <View>
                  <Text className="font-semibold text-foreground mb-2">
                    Control químico
                  </Text>
                  {plant.pestControl.chemical.map((chemical, idx) => (
                    <View key={idx} className="flex-row items-center gap-2 mb-2">
                      <MaterialIcons name="warning" size={16} color={colors.warning} />
                      <Text className="text-foreground">{chemical}</Text>
                    </View>
                  ))}
                </View>
              )}
            </View>
          )}

          {activeTab === 'fertilizer' && (
            <View className="gap-4">
              <CareItem icon="local-florist" label="Tipo" value={plant.fertilizer.type} />
              <CareItem icon="schedule" label="Frecuencia" value={plant.fertilizer.frequency} />
              
              <View>
                <Text className="font-semibold text-foreground mb-2">
                  Opciones naturales
                </Text>
                {plant.fertilizer.natural.map((option, idx) => (
                  <View key={idx} className="flex-row items-center gap-2 mb-2">
                    <MaterialIcons name="eco" size={16} color={colors.success} />
                    <Text className="text-foreground">{option}</Text>
                  </View>
                ))}
              </View>
            </View>
          )}
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}

interface CareItemProps {
  icon: string;
  label: string;
  value: string;
}

const CareItem: React.FC<CareItemProps> = ({ icon, label, value }) => {
  const colors = useColors();
  return (
    <View className="flex-row items-start gap-3 bg-surface rounded-lg p-3 border border-border">
      <MaterialIcons name={icon as any} size={24} color={colors.primary} />
      <View className="flex-1">
        <Text className="text-xs text-muted font-medium">{label}</Text>
        <Text className="text-sm text-foreground mt-1">{value}</Text>
      </View>
    </View>
  );
};
