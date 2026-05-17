import React, { useState } from 'react';
import {
  Text,
  View,
  Pressable,
  Image,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import { useRouter } from 'expo-router';
import { ScreenContainer } from '@/components/screen-container';
import { useColors } from '@/hooks/use-colors';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
// import * as ImagePicker from 'expo-image-picker'; // Comentado - será implementado en versión futura
import { usePlantsDatabase } from '@/hooks/use-plants-database';

export default function CameraScreen() {
  const router = useRouter();
  const colors = useColors();
  const { plants } = usePlantsDatabase();
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [results, setResults] = useState<any[]>([]);

  const handlePickImage = async () => {
    // Placeholder - será implementado con expo-image-picker en versión futura
    alert('Función de galería disponible en la versión compilada');
  };

  const handleTakePhoto = async () => {
    // Placeholder - será implementado con expo-camera en versión futura
    alert('Función de cámara disponible en la versión compilada');
  };

  const analyzeImage = async (uri: string) => {
    setIsAnalyzing(true);
    // Simulate AI analysis - in real app, this would call an API
    setTimeout(() => {
      // Return random plants as mock results
      const mockResults = plants.slice(0, 3).map((plant: any) => ({
        ...plant,
        confidence: Math.floor(Math.random() * 40) + 60,
      }));
      setResults(mockResults);
      setIsAnalyzing(false);
    }, 2000);
  };

  const handlePlantResult = (plantId: number) => {
    router.push({
      pathname: '/plant-detail',
      params: { plantId: plantId.toString() },
    });
  };

  return (
    <ScreenContainer className="bg-background">
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View className="px-4 pt-4 pb-4 flex-row items-center gap-3">
          <Pressable
            onPress={() => router.back()}
            style={({ pressed }) => ({ opacity: pressed ? 0.6 : 1 })}
          >
            <MaterialIcons name="arrow-back" size={24} color={colors.foreground} />
          </Pressable>
          <Text className="text-2xl font-bold text-foreground flex-1">
            Buscar por foto
          </Text>
        </View>

        {/* Camera Area */}
        {!selectedImage ? (
          <View className="px-4 pb-6">
            <View className="bg-surface rounded-2xl border-2 border-dashed border-border p-8 items-center justify-center min-h-64">
              <MaterialIcons name="camera-alt" size={64} color={colors.muted} />
              <Text className="text-lg font-semibold text-foreground mt-4">
                Captura o sube una foto
              </Text>
              <Text className="text-sm text-muted text-center mt-2">
                Toma una foto clara de la planta para identificarla
              </Text>
            </View>

            {/* Buttons */}
            <View className="gap-3 mt-6">
              <Pressable
                onPress={handleTakePhoto}
                style={({ pressed }) => ({ opacity: pressed ? 0.8 : 1 })}
              >
                <View className="bg-primary rounded-lg p-4 flex-row items-center justify-center gap-2">
                  <MaterialIcons name="camera" size={24} color="white" />
                  <Text className="text-white font-semibold text-base">
                    Tomar foto
                  </Text>
                </View>
              </Pressable>

              <Pressable
                onPress={handlePickImage}
                style={({ pressed }) => ({ opacity: pressed ? 0.8 : 1 })}
              >
                <View className="bg-accent rounded-lg p-4 flex-row items-center justify-center gap-2">
                  <MaterialIcons name="image" size={24} color="white" />
                  <Text className="text-white font-semibold text-base">
                    Seleccionar de galería
                  </Text>
                </View>
              </Pressable>
            </View>
          </View>
        ) : (
          <View className="px-4 pb-6">
            {/* Selected Image */}
            <View className="rounded-2xl overflow-hidden border border-border mb-6">
              <Image
                source={{ uri: selectedImage }}
                className="w-full h-64"
              />
            </View>

            {/* Analysis Status */}
            {isAnalyzing ? (
              <View className="items-center justify-center py-8">
                <ActivityIndicator size="large" color={colors.primary} />
                <Text className="text-foreground mt-4 font-semibold">
                  Analizando foto...
                </Text>
              </View>
            ) : results.length > 0 ? (
              <View>
                <Text className="text-lg font-semibold text-foreground mb-4">
                  Resultados
                </Text>
                {results.map((result: any) => (
                  <Pressable
                    key={result.id}
                    onPress={() => handlePlantResult(result.id)}
                    style={({ pressed }) => ({ opacity: pressed ? 0.7 : 1 })}
                  >
                    <View className="bg-surface rounded-lg p-4 mb-3 border border-border flex-row items-center justify-between">
                      <View className="flex-1">
                        <Text className="font-semibold text-foreground">
                          {result?.name || 'Planta'}
                        </Text>
                        <Text className="text-xs text-muted mt-1">
                          {result?.commonNames?.[0] || 'Desconocida'}
                        </Text>
                      </View>
                      <View className="items-center">
                        <View className="bg-success/20 rounded-full px-3 py-1">
                          <Text className="text-success font-semibold text-sm">
                            {result.confidence}%
                          </Text>
                        </View>
                      </View>
                    </View>
                  </Pressable>
                ))}

                <Pressable
                  onPress={() => {
                    setSelectedImage(null);
                    setResults([]);
                  }}
                  style={({ pressed }) => ({ opacity: pressed ? 0.8 : 1 })}
                >
                  <View className="bg-surface rounded-lg p-3 border border-border mt-4 flex-row items-center justify-center gap-2">
                    <MaterialIcons name="refresh" size={20} color={colors.primary} />
                    <Text className="text-primary font-semibold">
                      Intentar otra foto
                    </Text>
                  </View>
                </Pressable>
              </View>
            ) : null}
          </View>
        )}
      </ScrollView>
    </ScreenContainer>
  );
}
