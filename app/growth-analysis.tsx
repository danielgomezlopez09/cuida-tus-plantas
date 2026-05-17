import { ScrollView, Text, View, Pressable, ActivityIndicator, Alert } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { ScreenContainer } from '@/components/screen-container';
import { useState, useEffect } from 'react';
import { MaterialIcons } from '@expo/vector-icons';
import { useColors } from '@/hooks/use-colors';
import { usePlantPhotos } from '@/hooks/use-plant-photos';
import PlantDiagnosisService, { type GrowthAnalysis } from '@/lib/services/plant-diagnosis-service';

export default function GrowthAnalysisScreen() {
  const router = useRouter();
  const colors = useColors();
  const { plantId, plantName } = useLocalSearchParams<{
    plantId?: string;
    plantName?: string;
  }>();

  const { getPlantPhotos } = usePlantPhotos();
  const [analysis, setAnalysis] = useState<GrowthAnalysis | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    analyzeGrowth();
  }, []);

  const analyzeGrowth = async () => {
    if (!plantId || !plantName) {
      Alert.alert('Error', 'Información de planta incompleta');
      return;
    }

    setLoading(true);
    try {
      const photos = getPlantPhotos(plantId);

      if (photos.length < 2) {
        Alert.alert(
          'Fotos Insuficientes',
          'Se necesitan al menos 2 fotos para analizar el crecimiento'
        );
        setLoading(false);
        return;
      }

      const service = new PlantDiagnosisService();
      const result = await service.analyzeGrowth(
        plantId,
        plantName,
        photos.map((p) => ({
          date: p.timestamp,
          uri: p.uri,
        }))
      );

      setAnalysis(result);
    } catch (error) {
      Alert.alert('Error', 'No se pudo analizar el crecimiento');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'excellent':
        return 'trending-up';
      case 'good':
        return 'trending-up';
      case 'stable':
        return 'trending-flat';
      case 'declining':
        return 'trending-down';
      default:
        return 'help';
    }
  };

  const getTrendColor = (trend: string) => {
    switch (trend) {
      case 'excellent':
        return colors.success;
      case 'good':
        return '#90EE90';
      case 'stable':
        return colors.primary;
      case 'declining':
        return colors.error;
      default:
        return colors.muted;
    }
  };

  const getTrendLabel = (trend: string) => {
    switch (trend) {
      case 'excellent':
        return 'Excelente';
      case 'good':
        return 'Bueno';
      case 'stable':
        return 'Estable';
      case 'declining':
        return 'Declinando';
      default:
        return 'Desconocido';
    }
  };

  return (
    <ScreenContainer className="p-4">
      <View className="flex-row items-center justify-between mb-6">
        <Pressable onPress={() => router.back()} className="flex-row items-center">
          <MaterialIcons name="arrow-back" size={24} color={colors.foreground} />
        </Pressable>
        <Text className="text-2xl font-bold text-foreground">Análisis de Crecimiento</Text>
        <View className="w-6" />
      </View>

      {loading ? (
        <View className="flex-1 justify-center items-center">
          <ActivityIndicator size="large" color={colors.primary} />
          <Text className="text-foreground mt-4">Analizando crecimiento...</Text>
        </View>
      ) : analysis ? (
        <ScrollView showsVerticalScrollIndicator={false}>
          <View className="gap-4">
            {/* Tendencia General */}
            <View className="bg-surface rounded-lg p-4 border border-border">
              <View className="flex-row items-center gap-3 mb-3">
                <View
                  className="w-12 h-12 rounded-full items-center justify-center"
                  style={{ backgroundColor: getTrendColor(analysis.growthTrend) + '20' }}
                >
                  <MaterialIcons
                    name={getTrendIcon(analysis.growthTrend)}
                    size={24}
                    color={getTrendColor(analysis.growthTrend)}
                  />
                </View>
                <View className="flex-1">
                  <Text className="text-lg font-bold text-foreground">Tendencia de Crecimiento</Text>
                  <Text className="text-sm text-muted">{getTrendLabel(analysis.growthTrend)}</Text>
                </View>
              </View>
            </View>

            {/* Puntuación de Salud */}
            <View className="bg-surface rounded-lg p-4 border border-border">
              <Text className="text-base font-bold text-foreground mb-3">Puntuación de Salud</Text>
              <View className="flex-row items-center gap-3">
                <View className="flex-1 bg-border rounded-full h-2 overflow-hidden">
                  <View
                    className="h-full bg-primary"
                    style={{ width: `${analysis.healthScore}%` }}
                  />
                </View>
                <Text className="text-lg font-bold text-foreground">{analysis.healthScore}%</Text>
              </View>
            </View>

            {/* Tasa de Crecimiento */}
            {analysis.estimatedGrowthRate && (
              <View className="bg-surface rounded-lg p-4 border border-border">
                <View className="flex-row items-center gap-2 mb-2">
                  <MaterialIcons name="speed" size={20} color={colors.primary} />
                  <Text className="text-base font-bold text-foreground">Tasa de Crecimiento</Text>
                </View>
                <Text className="text-sm text-foreground">{analysis.estimatedGrowthRate}</Text>
              </View>
            )}

            {/* Recomendaciones */}
            {analysis.recommendations.length > 0 && (
              <View className="bg-primary/10 rounded-lg p-4 border border-primary/20">
                <View className="flex-row items-center gap-2 mb-3">
                  <MaterialIcons name="lightbulb" size={20} color={colors.primary} />
                  <Text className="text-base font-bold text-foreground">Recomendaciones</Text>
                </View>
                {analysis.recommendations.map((rec: string, index: number) => (
                  <View key={index} className="flex-row items-start gap-2 mb-2">
                    <Text className="text-primary font-bold">{index + 1}.</Text>
                    <Text className="flex-1 text-sm text-foreground">{rec}</Text>
                  </View>
                ))}
              </View>
            )}

            {/* Historial de Fotos */}
            {analysis.photos.length > 0 && (
              <View className="bg-surface rounded-lg p-4 border border-border">
                <Text className="text-base font-bold text-foreground mb-3">Historial de Fotos</Text>
                {analysis.photos.map((photo: any, index: number) => (
                  <View key={index} className="flex-row items-center gap-2 mb-2 pb-2 border-b border-border last:border-b-0">
                    <MaterialIcons name="image" size={20} color={colors.primary} />
                    <View className="flex-1">
                      <Text className="text-sm text-foreground">
                        Foto {index + 1}
                      </Text>
                      <Text className="text-xs text-muted">
                        {new Date(photo.date).toLocaleDateString('es-ES')}
                      </Text>
                    </View>
                  </View>
                ))}
              </View>
            )}

            {/* Botones de Acción */}
            <View className="flex-row gap-3 mt-4">
              <Pressable
                onPress={() => router.back()}
                className="flex-1 bg-surface border border-border rounded-lg p-3 items-center"
              >
                <Text className="text-foreground font-semibold">Volver</Text>
              </Pressable>
              <Pressable
                onPress={analyzeGrowth}
                className="flex-1 bg-primary rounded-lg p-3 items-center"
              >
                <Text className="text-white font-semibold">Actualizar</Text>
              </Pressable>
            </View>
          </View>
        </ScrollView>
      ) : (
        <View className="flex-1 justify-center items-center">
          <MaterialIcons name="info" size={48} color={colors.muted} />
          <Text className="text-foreground text-lg font-semibold mt-4">
            Sin datos de análisis
          </Text>
          <Text className="text-muted text-center mt-2">
            Agrega más fotos para analizar el crecimiento
          </Text>
        </View>
      )}
    </ScreenContainer>
  );
}
