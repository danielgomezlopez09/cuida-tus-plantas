import React, { useState, useEffect } from 'react';
import {
  ScrollView,
  Text,
  View,
  Pressable,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { ScreenContainer } from '@/components/screen-container';
import { useColors } from '@/hooks/use-colors';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { usePlants } from '@/lib/contexts/PlantContext';
import { usePlantsDatabase } from '@/hooks/use-plants-database';
import { CareHistory } from '@/lib/types/plants';

export default function UserPlantDetailScreen() {
  const router = useRouter();
  const colors = useColors();
  const { userPlantId } = useLocalSearchParams();
  const { userPlants, getCareHistory, addCareRecord } = usePlants();
  const { getPlantById } = usePlantsDatabase();
  const [careHistory, setCareHistory] = useState<CareHistory[]>([]);
  const [activeTab, setActiveTab] = useState<'info' | 'history' | 'care'>('info');

  const userPlant = userPlants.find(p => p.id === userPlantId);
  const plant = userPlant ? getPlantById(userPlant.plantId) : null;

  useEffect(() => {
    if (userPlantId) {
      loadCareHistory();
    }
  }, [userPlantId]);

  const loadCareHistory = async () => {
    if (userPlantId) {
      const history = await getCareHistory(userPlantId as string);
      setCareHistory(history);
    }
  };

  const handleMarkCare = async (type: 'watering' | 'fertilizing' | 'pruning') => {
    if (!userPlantId) return;

    const record: CareHistory = {
      id: `${Date.now()}`,
      userPlantId: userPlantId as string,
      type,
      date: new Date().toISOString(),
      notes: '',
    };

    await addCareRecord(record);
    await loadCareHistory();
  };

  if (!userPlant || !plant) {
    return (
      <ScreenContainer className="items-center justify-center">
        <Text className="text-foreground text-lg">Planta no encontrada</Text>
      </ScreenContainer>
    );
  }

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
            <MaterialIcons name="more-vert" size={24} color={colors.foreground} />
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
            {userPlant.plantName}
          </Text>
          <Text className="text-sm text-muted mt-2">
            {plant.name}
          </Text>
          {userPlant.location && (
            <View className="flex-row items-center gap-2 mt-3">
              <MaterialIcons name="location-on" size={16} color={colors.muted} />
              <Text className="text-sm text-muted">{userPlant.location}</Text>
            </View>
          )}
          {userPlant.notes && (
            <View className="mt-3 bg-surface rounded-lg p-3 border border-border">
              <Text className="text-sm text-foreground">{userPlant.notes}</Text>
            </View>
          )}
        </View>

        {/* Quick Actions */}
        <View className="px-4 pb-4 gap-2">
          <Pressable
            onPress={() => handleMarkCare('watering')}
            style={({ pressed }) => ({ opacity: pressed ? 0.8 : 1 })}
          >
            <View className="bg-primary/20 rounded-lg p-3 flex-row items-center gap-2">
              <MaterialIcons name="water-drop" size={20} color={colors.primary} />
              <Text className="font-semibold text-primary flex-1">Marcar como regada</Text>
              <MaterialIcons name="check" size={20} color={colors.primary} />
            </View>
          </Pressable>

          <Pressable
            onPress={() => handleMarkCare('fertilizing')}
            style={({ pressed }) => ({ opacity: pressed ? 0.8 : 1 })}
          >
            <View className="bg-accent/20 rounded-lg p-3 flex-row items-center gap-2">
              <MaterialIcons name="local-florist" size={20} color={colors.accent} />
              <Text className="font-semibold text-accent flex-1">Marcar como fertilizada</Text>
              <MaterialIcons name="check" size={20} color={colors.accent} />
            </View>
          </Pressable>
        </View>

        {/* Tabs */}
        <View className="px-4 pb-4 flex-row gap-2 border-b border-border">
          {(['info', 'history', 'care'] as const).map((tab) => (
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
                  {tab === 'info' ? 'Información' : tab === 'history' ? 'Historial' : 'Cuidados'}
                </Text>
              </View>
            </Pressable>
          ))}
        </View>

        {/* Tab Content */}
        <View className="px-4 pb-6">
          {activeTab === 'info' && (
            <View className="gap-3">
              <InfoItem label="Especie" value={plant.name} />
              <InfoItem label="Categoría" value={plant.category} />
              <InfoItem label="Ubicación" value={userPlant.location} />
              <InfoItem label="Agregada el" value={new Date(userPlant.purchaseDate).toLocaleDateString('es-ES')} />
            </View>
          )}

          {activeTab === 'history' && (
            <View>
              {careHistory.length === 0 ? (
                <View className="items-center justify-center py-8">
                  <MaterialIcons name="history" size={48} color={colors.muted} />
                  <Text className="text-muted text-center mt-4">
                    Sin historial de cuidados aún
                  </Text>
                </View>
              ) : (
                careHistory.map((record) => (
                  <View
                    key={record.id}
                    className="flex-row items-center gap-3 mb-3 bg-surface rounded-lg p-3 border border-border"
                  >
                    <MaterialIcons
                      name={
                        record.type === 'watering'
                          ? 'water-drop'
                          : record.type === 'fertilizing'
                          ? 'local-florist'
                          : 'content-cut'
                      }
                      size={20}
                      color={colors.primary}
                    />
                    <View className="flex-1">
                      <Text className="font-semibold text-foreground text-sm">
                        {record.type === 'watering'
                          ? 'Regada'
                          : record.type === 'fertilizing'
                          ? 'Fertilizada'
                          : 'Podada'}
                      </Text>
                      <Text className="text-xs text-muted mt-1">
                        {new Date(record.date).toLocaleDateString('es-ES')}
                      </Text>
                    </View>
                  </View>
                ))
              )}
            </View>
          )}

          {activeTab === 'care' && (
            <View className="gap-3">
              <CareInfoItem icon="light-mode" label="Luz" value={plant.care.light} />
              <CareInfoItem icon="opacity" label="Riego" value={plant.care.water} />
              <CareInfoItem icon="thermostat" label="Temperatura" value={plant.care.temperature} />
              <CareInfoItem icon="water-drop" label="Humedad" value={plant.care.humidity} />
            </View>
          )}
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}

const InfoItem: React.FC<{ label: string; value: string }> = ({ label, value }) => (
  <View className="bg-surface rounded-lg p-3 border border-border">
    <Text className="text-xs text-muted font-medium">{label}</Text>
    <Text className="text-sm text-foreground mt-1">{value}</Text>
  </View>
);

const CareInfoItem: React.FC<{ icon: string; label: string; value: string }> = ({
  icon,
  label,
  value,
}) => {
  const colors = useColors();
  return (
    <View className="flex-row items-start gap-3 bg-surface rounded-lg p-3 border border-border">
      <MaterialIcons name={icon as any} size={20} color={colors.primary} />
      <View className="flex-1">
        <Text className="text-xs text-muted font-medium">{label}</Text>
        <Text className="text-sm text-foreground mt-1">{value}</Text>
      </View>
    </View>
  );
};
