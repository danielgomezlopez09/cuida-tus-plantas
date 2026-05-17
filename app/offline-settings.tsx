import { ScrollView, Text, View, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { useState, useEffect, useCallback } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { ScreenContainer } from '@/components/screen-container';
import { useColors } from '@/hooks/use-colors';
import {
  getOfflineInfo,
  forceSync,
  clearOfflineCache,
  getConnectionStatus,
} from '@/lib/services/offline-service';

export default function OfflineSettingsScreen() {
  const colors = useColors();
  const [offlineInfo, setOfflineInfo] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);
  const [clearing, setClearing] = useState(false);

  useFocusEffect(
    useCallback(() => {
      loadOfflineInfo();
      const interval = setInterval(loadOfflineInfo, 5000); // Actualizar cada 5 segundos
      return () => clearInterval(interval);
    }, [])
  );

  const loadOfflineInfo = async () => {
    try {
      const info = await getOfflineInfo();
      setOfflineInfo(info);
    } catch (error) {
      console.error('Error cargando información offline:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleForceSync = async () => {
    try {
      setSyncing(true);
      const result = await forceSync();

      if (result.success) {
        Alert.alert('Éxito', `Se sincronizaron ${result.synced} cambios`);
      } else {
        Alert.alert('Error', result.error || 'No se pudo sincronizar');
      }

      await loadOfflineInfo();
    } catch (error) {
      Alert.alert('Error', 'No se pudo sincronizar');
    } finally {
      setSyncing(false);
    }
  };

  const handleClearCache = async () => {
    Alert.alert(
      'Limpiar Caché',
      '¿Estás seguro? Esto eliminará todos los datos almacenados localmente.',
      [
        { text: 'Cancelar', onPress: () => {} },
        {
          text: 'Limpiar',
          onPress: async () => {
            try {
              setClearing(true);
              await clearOfflineCache();
              Alert.alert('Éxito', 'Caché limpiado correctamente');
              await loadOfflineInfo();
            } catch (error) {
              Alert.alert('Error', 'No se pudo limpiar el caché');
            } finally {
              setClearing(false);
            }
          },
        },
      ]
    );
  };

  if (loading || !offlineInfo) {
    return (
      <ScreenContainer className="bg-background items-center justify-center">
        <ActivityIndicator size="large" color={colors.primary} />
      </ScreenContainer>
    );
  }

  return (
    <ScreenContainer className="bg-background">
      <ScrollView contentContainerStyle={{ flexGrow: 1 }} className="p-4">
        <View className="gap-6">
          {/* Encabezado */}
          <View className="gap-2">
            <Text className="text-3xl font-bold text-foreground">Modo Offline</Text>
            <Text className="text-base text-muted">
              Gestiona tu experiencia sin conexión a internet
            </Text>
          </View>

          {/* Estado de conexión */}
          <View className="bg-surface rounded-xl p-4 gap-4 border border-border">
            <Text className="text-lg font-semibold text-foreground">Estado de Conexión</Text>

            <View className="gap-3">
              <View className="flex-row justify-between items-center">
                <Text className="text-foreground">Estado:</Text>
                <Text
                  className={`text-sm font-semibold ${
                    offlineInfo.isOnline ? 'text-success' : 'text-warning'
                  }`}
                >
                  {offlineInfo.status}
                </Text>
              </View>

              <View className="flex-row justify-between items-center">
                <Text className="text-foreground">Última sincronización:</Text>
                <Text className="text-sm text-muted font-medium">{offlineInfo.lastSync}</Text>
              </View>

              <View className="flex-row justify-between items-center">
                <Text className="text-foreground">Cambios pendientes:</Text>
                <Text className="text-sm text-muted font-medium">
                  {offlineInfo.pendingChanges}
                </Text>
              </View>

              <View className="flex-row justify-between items-center">
                <Text className="text-foreground">Tamaño de caché:</Text>
                <Text className="text-sm text-muted font-medium">{offlineInfo.cacheSize}</Text>
              </View>
            </View>

            {offlineInfo.isOnline && offlineInfo.pendingChanges > 0 && (
              <TouchableOpacity
                onPress={handleForceSync}
                disabled={syncing}
                className={`rounded-lg py-3 px-4 items-center flex-row justify-center gap-2 ${
                  syncing ? 'bg-primary opacity-50' : 'bg-primary'
                }`}
              >
                {syncing ? (
                  <>
                    <ActivityIndicator color="white" size="small" />
                    <Text className="text-white font-semibold">Sincronizando...</Text>
                  </>
                ) : (
                  <>
                    <Text className="text-lg">🔄</Text>
                    <Text className="text-white font-semibold">Sincronizar Ahora</Text>
                  </>
                )}
              </TouchableOpacity>
            )}
          </View>

          {/* Información de offline */}
          <View className="bg-surface rounded-xl p-4 gap-3 border border-border">
            <Text className="font-semibold text-foreground">📱 Modo Offline</Text>
            <Text className="text-sm text-muted">
              • Todos tus datos se guardan localmente en tu dispositivo
            </Text>
            <Text className="text-sm text-muted">
              • Puedes usar la app completamente sin conexión a internet
            </Text>
            <Text className="text-sm text-muted">
              • Los cambios se sincronizan automáticamente cuando hay conexión
            </Text>
            <Text className="text-sm text-muted">
              • Tu privacidad está protegida con almacenamiento local
            </Text>
          </View>

          {/* Gestión de caché */}
          <View className="bg-surface rounded-xl p-4 gap-3 border border-border">
            <Text className="font-semibold text-foreground">💾 Gestión de Caché</Text>

            <TouchableOpacity
              onPress={handleClearCache}
              disabled={clearing}
              className={`rounded-lg py-3 px-4 items-center flex-row justify-center gap-2 border border-error ${
                clearing ? 'bg-error opacity-50' : 'bg-error bg-opacity-10'
              }`}
            >
              {clearing ? (
                <>
                  <ActivityIndicator color={colors.error} size="small" />
                  <Text className="text-error font-semibold">Limpiando...</Text>
                </>
              ) : (
                <>
                  <Text className="text-lg">🗑️</Text>
                  <Text className="text-error font-semibold">Limpiar Caché</Text>
                </>
              )}
            </TouchableOpacity>

            <Text className="text-xs text-muted">
              Esto eliminará todos los datos almacenados localmente. Solo hazlo si tienes
              problemas.
            </Text>
          </View>

          {/* Estado de conexión */}
          {offlineInfo.isOnline ? (
            <View className="bg-success bg-opacity-10 rounded-xl p-4 border border-success">
              <Text className="text-sm text-success font-semibold">
                ✓ Conectado a Internet
              </Text>
              <Text className="text-sm text-success mt-2">
                Puedes sincronizar y usar todas las características online
              </Text>
            </View>
          ) : (
            <View className="bg-warning bg-opacity-10 rounded-xl p-4 border border-warning">
              <Text className="text-sm text-warning font-semibold">
                ⚠️ Sin Conexión a Internet
              </Text>
              <Text className="text-sm text-warning mt-2">
                Estás trabajando en modo offline. Los cambios se sincronizarán cuando haya
                conexión.
              </Text>
            </View>
          )}
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}
