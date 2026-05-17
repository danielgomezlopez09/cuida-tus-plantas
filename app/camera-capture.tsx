import { View, Text, Pressable, Alert } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { ScreenContainer } from '@/components/screen-container';
import { useState } from 'react';
import { MaterialIcons } from '@expo/vector-icons';
import { useColors } from '@/hooks/use-colors';
import { usePlantPhotos } from '@/hooks/use-plant-photos';

/**
 * Pantalla de captura de cámara
 * Nota: Esta es una versión simplificada. Para usar cámara real, instala expo-camera
 * y reemplaza esta implementación con el código de CameraView
 */
export default function CameraCaptureScreen() {
  const router = useRouter();
  const colors = useColors();
  const { plantId, plantName, mode } = useLocalSearchParams<{
    plantId?: string;
    plantName?: string;
    mode?: 'photo' | 'diagnosis';
  }>();

  const { addPhoto } = usePlantPhotos();
  const [notes, setNotes] = useState('');

  const handlePhotoCapture = async () => {
    Alert.alert(
      'Cámara',
      'Para usar la cámara real, instala expo-camera:\n\nnpm install expo-camera\n\nLuego reemplaza esta pantalla con CameraView'
    );
  };

  const handleGallerySelect = async () => {
    Alert.alert(
      'Galería',
      'Para seleccionar de la galería, instala expo-image-picker:\n\nnpm install expo-image-picker\n\nLuego implementa la selección de galería'
    );
  };

  const handleDiagnosis = () => {
    if (!plantId || !plantName) {
      Alert.alert('Error', 'Información de planta incompleta');
      return;
    }

    router.push({
      pathname: '/pest-diagnosis',
      params: {
        plantId,
        plantName,
        imageUri: 'file:///placeholder.jpg', // Reemplazar con URI real
      },
    });
  };

  return (
    <ScreenContainer className="p-4">
      <View className="flex-row items-center justify-between mb-6">
        <Pressable onPress={() => router.back()} className="flex-row items-center">
          <MaterialIcons name="arrow-back" size={24} color={colors.foreground} />
        </Pressable>
        <Text className="text-2xl font-bold text-foreground">Capturar Foto</Text>
        <View className="w-6" />
      </View>

      <View className="flex-1 justify-center gap-4">
        {/* Placeholder de Cámara */}
        <View className="bg-surface rounded-lg border-2 border-border p-8 items-center justify-center h-64">
          <MaterialIcons name="camera-alt" size={64} color={colors.muted} />
          <Text className="text-foreground font-semibold mt-4">Vista de Cámara</Text>
          <Text className="text-muted text-center mt-2 text-sm">
            Instala expo-camera para usar la cámara real
          </Text>
        </View>

        {/* Botones de Acción */}
        <Pressable
          onPress={handlePhotoCapture}
          className="bg-primary rounded-lg p-4 flex-row items-center justify-center gap-2"
        >
          <MaterialIcons name="camera" size={24} color="white" />
          <Text className="text-white font-semibold">Tomar Foto</Text>
        </Pressable>

        <Pressable
          onPress={handleGallerySelect}
          className="bg-surface border border-border rounded-lg p-4 flex-row items-center justify-center gap-2"
        >
          <MaterialIcons name="image" size={24} color={colors.foreground} />
          <Text className="text-foreground font-semibold">Seleccionar de Galería</Text>
        </Pressable>

        {mode === 'diagnosis' && (
          <Pressable
            onPress={handleDiagnosis}
            className="bg-success rounded-lg p-4 flex-row items-center justify-center gap-2"
          >
            <MaterialIcons name="bug-report" size={24} color="white" />
            <Text className="text-white font-semibold">Diagnosticar Plagas</Text>
          </Pressable>
        )}

        {/* Instrucciones */}
        <View className="bg-primary/10 rounded-lg p-4 border border-primary/20">
          <Text className="text-sm text-foreground font-semibold mb-2">Instrucciones:</Text>
          <Text className="text-xs text-foreground leading-relaxed">
            {mode === 'diagnosis'
              ? '1. Captura una foto clara de la planta o del área afectada\n2. Asegúrate de tener buena iluminación\n3. Incluye la parte afectada en el centro de la foto\n4. Toca "Diagnosticar Plagas" para analizar'
              : '1. Captura una foto clara de tu planta\n2. Asegúrate de tener buena iluminación\n3. Incluye toda la planta en el marco\n4. Guarda la foto en tu galería'}
          </Text>
        </View>
      </View>
    </ScreenContainer>
  );
}
