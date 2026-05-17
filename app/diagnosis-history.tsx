import { ScrollView, Text, View, FlatList, TouchableOpacity, Alert, Image } from 'react-native';
import { useState, useEffect, useCallback } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { ScreenContainer } from '@/components/screen-container';
import { useColors } from '@/hooks/use-colors';
import { getDiagnosisHistory, deleteDiagnosisFromHistory, clearDiagnosisHistory, DiagnosisRecord } from '@/lib/services/plantnet-service';

export default function DiagnosisHistoryScreen() {
  const colors = useColors();
  const [history, setHistory] = useState<DiagnosisRecord[]>([]);
  const [loading, setLoading] = useState(true);

  useFocusEffect(
    useCallback(() => {
      loadHistory();
    }, [])
  );

  const loadHistory = async () => {
    try {
      setLoading(true);
      const data = await getDiagnosisHistory();
      setHistory(data);
    } catch (error) {
      console.error('Error cargando historial:', error);
      Alert.alert('Error', 'No se pudo cargar el historial');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = (id: string) => {
    Alert.alert(
      'Eliminar diagnóstico',
      '¿Estás seguro de que deseas eliminar este diagnóstico?',
      [
        { text: 'Cancelar', onPress: () => {} },
        {
          text: 'Eliminar',
          onPress: async () => {
            try {
              await deleteDiagnosisFromHistory(id);
              loadHistory();
              Alert.alert('Éxito', 'Diagnóstico eliminado');
            } catch (error) {
              Alert.alert('Error', 'No se pudo eliminar el diagnóstico');
            }
          },
        },
      ]
    );
  };

  const handleClearAll = () => {
    Alert.alert(
      'Limpiar historial',
      '¿Estás seguro de que deseas eliminar todo el historial? Esta acción no se puede deshacer.',
      [
        { text: 'Cancelar', onPress: () => {} },
        {
          text: 'Eliminar todo',
          onPress: async () => {
            try {
              await clearDiagnosisHistory();
              setHistory([]);
              Alert.alert('Éxito', 'Historial limpiado');
            } catch (error) {
              Alert.alert('Error', 'No se pudo limpiar el historial');
            }
          },
        },
      ]
    );
  };

  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp);
    return date.toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const renderItem = ({ item }: { item: DiagnosisRecord }) => (
    <View className="bg-surface rounded-lg p-4 mb-3 border border-border">
      <View className="gap-3">
        {/* Encabezado */}
        <View className="flex-row justify-between items-start gap-2">
          <View className="flex-1 gap-1">
            <Text className="text-lg font-semibold text-foreground">{item.plantName}</Text>
            <Text className="text-xs text-muted">{formatDate(item.timestamp)}</Text>
          </View>
          <TouchableOpacity
            onPress={() => handleDelete(item.id)}
            className="p-2"
          >
            <Text className="text-lg">🗑️</Text>
          </TouchableOpacity>
        </View>

        {/* Imagen */}
        {item.imageUri && (
          <Image
            source={{ uri: item.imageUri }}
            className="w-full h-40 rounded-lg bg-background"
          />
        )}

        {/* Resultados */}
        {item.results && (
          <View className="gap-2">
            {/* Plantas identificadas */}
            {item.results.plants && item.results.plants.length > 0 && (
              <View className="gap-1">
                <Text className="text-sm font-semibold text-foreground">🌿 Plantas identificadas:</Text>
                {item.results.plants.slice(0, 2).map((plant, idx) => (
                  <Text key={idx} className="text-xs text-muted">
                    • {plant.commonNames[0] || plant.scientificName} ({Math.round(plant.score * 100)}%)
                  </Text>
                ))}
              </View>
            )}

            {/* Plagas detectadas */}
            {item.results.pests && item.results.pests.length > 0 && (
              <View className="gap-1">
                <Text className="text-sm font-semibold text-warning">🐛 Plagas detectadas:</Text>
                {item.results.pests.slice(0, 2).map((pest, idx) => (
                  <Text key={idx} className="text-xs text-muted">
                    • {pest.pestName} ({pest.severity})
                  </Text>
                ))}
              </View>
            )}

            {/* Enfermedades detectadas */}
            {item.results.diseases && item.results.diseases.length > 0 && (
              <View className="gap-1">
                <Text className="text-sm font-semibold text-error">🦠 Enfermedades detectadas:</Text>
                {item.results.diseases.slice(0, 2).map((disease, idx) => (
                  <Text key={idx} className="text-xs text-muted">
                    • {disease.diseaseName} ({disease.severity})
                  </Text>
                ))}
              </View>
            )}
          </View>
        )}

        {/* Notas */}
        {item.notes && (
          <View className="bg-background rounded p-2">
            <Text className="text-xs text-muted">
              <Text className="font-semibold">Notas: </Text>
              {item.notes}
            </Text>
          </View>
        )}

        {/* Acción tomada */}
        {item.actionTaken && (
          <View className="bg-success bg-opacity-10 rounded p-2 border border-success">
            <Text className="text-xs text-success">
              <Text className="font-semibold">✓ Acción: </Text>
              {item.actionTaken}
            </Text>
          </View>
        )}
      </View>
    </View>
  );

  return (
    <ScreenContainer className="bg-background">
      <View className="flex-1">
        {/* Encabezado */}
        <View className="px-4 pt-4 pb-2 gap-2">
          <Text className="text-3xl font-bold text-foreground">Historial de Diagnósticos</Text>
          <Text className="text-base text-muted">
            {history.length} diagnóstico{history.length !== 1 ? 's' : ''}
          </Text>
        </View>

        {/* Contenido */}
        {loading ? (
          <View className="flex-1 items-center justify-center">
            <Text className="text-muted">Cargando...</Text>
          </View>
        ) : history.length === 0 ? (
          <View className="flex-1 items-center justify-center gap-4 px-4">
            <Text className="text-4xl">📋</Text>
            <Text className="text-lg font-semibold text-foreground text-center">
              No hay diagnósticos aún
            </Text>
            <Text className="text-sm text-muted text-center">
              Usa la pantalla de diagnóstico para analizar fotos de plantas
            </Text>
          </View>
        ) : (
          <FlatList
            data={history}
            renderItem={renderItem}
            keyExtractor={(item) => item.id}
            contentContainerStyle={{ padding: 16, paddingBottom: 24 }}
            scrollEnabled={true}
          />
        )}

        {/* Botón Limpiar */}
        {history.length > 0 && (
          <View className="px-4 pb-4">
            <TouchableOpacity
              onPress={handleClearAll}
              className="bg-error rounded-lg py-3 px-4 items-center opacity-80"
            >
              <Text className="text-white font-semibold">Limpiar todo el historial</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </ScreenContainer>
  );
}
