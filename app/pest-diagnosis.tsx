import { ScrollView, Text, View, Pressable, Image, Alert, ActivityIndicator } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { ScreenContainer } from '@/components/screen-container';
import { useState } from 'react';
import { MaterialIcons } from '@expo/vector-icons';
import { useColors } from '@/hooks/use-colors';
import PlantDiagnosisService, { type DiagnosisResult } from '@/lib/services/plant-diagnosis-service';

export default function PestDiagnosisScreen() {
  const router = useRouter();
  const colors = useColors();
  const { plantId, plantName, imageUri } = useLocalSearchParams<{
    plantId?: string;
    plantName?: string;
    imageUri?: string;
  }>();

  const [diagnosis, setDiagnosis] = useState<DiagnosisResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [recommendations, setRecommendations] = useState<string[]>([]);

  const analyzePlant = async () => {
    if (!imageUri) {
      Alert.alert('Error', 'No se proporcionó imagen para analizar');
      return;
    }

    setLoading(true);
    try {
      const service = new PlantDiagnosisService();
      const result = await service.diagnosePestOrDisease(
        imageUri,
        plantName,
        plantId
      );
      setDiagnosis(result);

      // Obtener recomendaciones
      const recs = await service.getTreatmentRecommendations(result);
      setRecommendations(recs);
    } catch (error) {
      Alert.alert('Error', 'No se pudo analizar la imagen. Intenta de nuevo.');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical':
        return colors.error;
      case 'high':
        return '#FF6B6B';
      case 'medium':
        return '#FFA500';
      case 'low':
        return '#FFD700';
      default:
        return colors.success;
    }
  };

  const getSeverityLabel = (severity: string) => {
    switch (severity) {
      case 'critical':
        return 'Crítico';
      case 'high':
        return 'Alto';
      case 'medium':
        return 'Medio';
      case 'low':
        return 'Bajo';
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
        <Text className="text-2xl font-bold text-foreground">Diagnóstico</Text>
        <View className="w-6" />
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {imageUri && (
          <View className="mb-4 rounded-lg overflow-hidden border border-border">
            <Image source={{ uri: imageUri }} className="w-full h-48" resizeMode="cover" />
          </View>
        )}

        {!diagnosis && !loading && (
          <Pressable
            onPress={analyzePlant}
            className="bg-primary rounded-lg p-4 items-center justify-center mb-4"
          >
            <MaterialIcons name="search" size={24} color="white" />
            <Text className="text-white font-semibold mt-2">Analizar Imagen</Text>
          </Pressable>
        )}

        {loading && (
          <View className="items-center justify-center py-8">
            <ActivityIndicator size="large" color={colors.primary} />
            <Text className="text-foreground mt-4">Analizando imagen...</Text>
          </View>
        )}

        {diagnosis && (
          <View className="gap-4">
            {/* Resultado Principal */}
            <View className="bg-surface rounded-lg p-4 border border-border">
              <View className="flex-row items-center gap-3 mb-3">
                <View
                  className="w-12 h-12 rounded-full items-center justify-center"
                  style={{ backgroundColor: getSeverityColor(diagnosis.severity) }}
                >
                  <MaterialIcons
                    name={
                      diagnosis.type === 'pest'
                        ? 'bug-report'
                        : diagnosis.type === 'disease'
                          ? 'warning'
                          : 'check-circle'
                    }
                    size={24}
                    color="white"
                  />
                </View>
                <View className="flex-1">
                  <Text className="text-lg font-bold text-foreground">{diagnosis.name}</Text>
                  <Text className="text-sm text-muted">
                    Confianza: {diagnosis.confidence}%
                  </Text>
                </View>
              </View>

              <Text className="text-sm text-foreground mb-2">{diagnosis.description}</Text>

              <View className="flex-row items-center gap-2 mt-2">
                <View
                  className="px-3 py-1 rounded-full"
                  style={{ backgroundColor: getSeverityColor(diagnosis.severity) + '20' }}
                >
                  <Text
                    className="text-xs font-semibold"
                    style={{ color: getSeverityColor(diagnosis.severity) }}
                  >
                    Severidad: {getSeverityLabel(diagnosis.severity)}
                  </Text>
                </View>
              </View>
            </View>

            {/* Síntomas */}
            {diagnosis.symptoms.length > 0 && (
              <View className="bg-surface rounded-lg p-4 border border-border">
                <Text className="text-base font-bold text-foreground mb-2">Síntomas</Text>
                {diagnosis.symptoms.map((symptom: string, index: number) => (
                  <View key={index} className="flex-row items-start gap-2 mb-2">
                    <MaterialIcons name="check" size={20} color={colors.success} />
                    <Text className="flex-1 text-sm text-foreground">{symptom}</Text>
                  </View>
                ))}
              </View>
            )}

            {/* Áreas Afectadas */}
            {diagnosis.affectedAreas.length > 0 && (
              <View className="bg-surface rounded-lg p-4 border border-border">
                <Text className="text-base font-bold text-foreground mb-2">Áreas Afectadas</Text>
                {diagnosis.affectedAreas.map((area: string, index: number) => (
                  <View key={index} className="flex-row items-center gap-2 mb-1">
                    <View className="w-2 h-2 rounded-full bg-primary" />
                    <Text className="text-sm text-foreground">{area}</Text>
                  </View>
                ))}
              </View>
            )}

            {/* Tratamientos Naturales */}
            {diagnosis.treatments.natural.length > 0 && (
              <View className="bg-surface rounded-lg p-4 border border-border">
                <View className="flex-row items-center gap-2 mb-2">
                  <MaterialIcons name="eco" size={20} color={colors.success} />
                  <Text className="text-base font-bold text-foreground">Tratamientos Naturales</Text>
                </View>
                {diagnosis.treatments.natural.map((treatment: string, index: number) => (
                  <View key={index} className="flex-row items-start gap-2 mb-2">
                    <Text className="text-success font-bold">•</Text>
                    <Text className="flex-1 text-sm text-foreground">{treatment}</Text>
                  </View>
                ))}
              </View>
            )}

            {/* Tratamientos Químicos */}
            {diagnosis.treatments.chemical.length > 0 && (
              <View className="bg-surface rounded-lg p-4 border border-border">
                <View className="flex-row items-center gap-2 mb-2">
                  <MaterialIcons name="science" size={20} color={colors.warning} />
                  <Text className="text-base font-bold text-foreground">Tratamientos Químicos</Text>
                </View>
                {diagnosis.treatments.chemical.map((treatment: string, index: number) => (
                  <View key={index} className="flex-row items-start gap-2 mb-2">
                    <Text className="text-warning font-bold">•</Text>
                    <Text className="flex-1 text-sm text-foreground">{treatment}</Text>
                  </View>
                ))}
              </View>
            )}

            {/* Medidas Preventivas */}
            {diagnosis.treatments.preventive.length > 0 && (
              <View className="bg-surface rounded-lg p-4 border border-border">
                <View className="flex-row items-center gap-2 mb-2">
                  <MaterialIcons name="shield" size={20} color={colors.primary} />
                  <Text className="text-base font-bold text-foreground">Medidas Preventivas</Text>
                </View>
                {diagnosis.treatments.preventive.map((measure: string, index: number) => (
                  <View key={index} className="flex-row items-start gap-2 mb-2">
                    <Text className="text-primary font-bold">•</Text>
                    <Text className="flex-1 text-sm text-foreground">{measure}</Text>
                  </View>
                ))}
              </View>
            )}

            {/* Recomendaciones */}
            {recommendations.length > 0 && (
              <View className="bg-primary/10 rounded-lg p-4 border border-primary/20">
                <View className="flex-row items-center gap-2 mb-2">
                  <MaterialIcons name="lightbulb" size={20} color={colors.primary} />
                  <Text className="text-base font-bold text-foreground">Recomendaciones</Text>
                </View>
                {recommendations.map((rec: string, index: number) => (
                  <View key={index} className="flex-row items-start gap-2 mb-2">
                    <Text className="text-primary font-bold">{index + 1}.</Text>
                    <Text className="flex-1 text-sm text-foreground">{rec}</Text>
                  </View>
                ))}
              </View>
            )}

            {/* Urgencia */}
            {diagnosis.urgency && (
              <View className="bg-warning/10 rounded-lg p-4 border border-warning/20">
                <Text className="text-sm text-foreground">
                  <Text className="font-bold">Urgencia: </Text>
                  {diagnosis.urgency}
                </Text>
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
                onPress={analyzePlant}
                className="flex-1 bg-primary rounded-lg p-3 items-center"
              >
                <Text className="text-white font-semibold">Analizar de Nuevo</Text>
              </Pressable>
            </View>
          </View>
        )}
      </ScrollView>
    </ScreenContainer>
  );
}
