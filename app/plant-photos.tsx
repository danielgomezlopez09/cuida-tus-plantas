import { ScrollView, Text, View, Pressable, Image, Alert, FlatList } from 'react-native';
import { useRouter } from 'expo-router';
import { ScreenContainer } from '@/components/screen-container';
import { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { MaterialIcons } from '@expo/vector-icons';
import { useColors } from '@/hooks/use-colors';

interface PlantPhoto {
  id: string;
  plantId: string;
  plantName: string;
  uri: string;
  timestamp: string;
  notes: string;
}

export default function PlantPhotosScreen() {
  const router = useRouter();
  const colors = useColors();
  const [photos, setPhotos] = useState<PlantPhoto[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadPhotos();
  }, []);

  const loadPhotos = async () => {
    try {
      const stored = await AsyncStorage.getItem('plant_photos');
      if (stored) {
        setPhotos(JSON.parse(stored));
      }
      setLoading(false);
    } catch (error) {
      console.error('Error cargando fotos:', error);
      setLoading(false);
    }
  };

  const deletePhoto = async (id: string) => {
    Alert.alert(
      'Eliminar Foto',
      '¿Estás seguro de que deseas eliminar esta foto?',
      [
        { text: 'Cancelar', onPress: () => {} },
        {
          text: 'Eliminar',
          onPress: async () => {
            const updated = photos.filter(p => p.id !== id);
            await AsyncStorage.setItem('plant_photos', JSON.stringify(updated));
            setPhotos(updated);
          },
          style: 'destructive',
        },
      ]
    );
  };

  const renderPhoto = ({ item }: { item: PlantPhoto }) => (
    <View className="mb-4 bg-surface rounded-lg overflow-hidden border border-border">
      <Image
        source={{ uri: item.uri }}
        className="w-full h-48"
        resizeMode="cover"
      />
      <View className="p-3">
        <Text className="text-base font-semibold text-foreground">{item.plantName}</Text>
        <Text className="text-xs text-muted mt-1">
          {new Date(item.timestamp).toLocaleDateString('es-ES')}
        </Text>
        {item.notes && (
          <Text className="text-sm text-foreground mt-2">{item.notes}</Text>
        )}
        <Pressable
          onPress={() => deletePhoto(item.id)}
          className="mt-3 flex-row items-center justify-center py-2 bg-error/10 rounded"
        >
          <MaterialIcons name="delete" size={16} color={colors.error} />
          <Text className="text-error text-sm font-medium ml-1">Eliminar</Text>
        </Pressable>
      </View>
    </View>
  );

  if (loading) {
    return (
      <ScreenContainer className="justify-center items-center">
        <Text className="text-foreground">Cargando fotos...</Text>
      </ScreenContainer>
    );
  }

  return (
    <ScreenContainer className="p-4">
      <View className="flex-row items-center justify-between mb-6">
        <Pressable
          onPress={() => router.back()}
          className="flex-row items-center"
        >
          <MaterialIcons name="arrow-back" size={24} color={colors.foreground} />
        </Pressable>
        <Text className="text-2xl font-bold text-foreground">Galería de Fotos</Text>
        <View className="w-6" />
      </View>

      {photos.length === 0 ? (
        <View className="flex-1 justify-center items-center">
          <MaterialIcons name="image-not-supported" size={64} color={colors.muted} />
          <Text className="text-foreground text-lg font-semibold mt-4">
            Sin fotos aún
          </Text>
          <Text className="text-muted text-center mt-2">
            Agrega fotos de tus plantas desde la pantalla de detalle
          </Text>
        </View>
      ) : (
        <FlatList
          data={photos}
          renderItem={renderPhoto}
          keyExtractor={item => item.id}
          scrollEnabled={false}
          contentContainerStyle={{ paddingBottom: 20 }}
        />
      )}
    </ScreenContainer>
  );
}
