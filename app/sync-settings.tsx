import { ScrollView, Text, View, TouchableOpacity, Switch, Alert, ActivityIndicator } from 'react-native';
import { useState, useEffect, useCallback } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { ScreenContainer } from '@/components/screen-container';
import { useColors } from '@/hooks/use-colors';
import {
  getSyncInfo,
  enableAutoSync,
  disableAutoSync,
  forceSync,
  getSyncConfig,
  saveSyncConfig,
} from '@/lib/services/sync-service';
import { getDiagnosisHistory } from '@/lib/services/plantnet-service';

export default function SyncSettingsScreen() {
  const colors = useColors();
  const [syncInfo, setSyncInfo] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);
  const [autoSyncEnabled, setAutoSyncEnabled] = useState(false);

  useFocusEffect(
    useCallback(() => {
      loadSyncInfo();
    }, [])
  );

  const loadSyncInfo = async () => {
    try {
      setLoading(true);
      const info = await getSyncInfo();
      setSyncInfo(info);
      setAutoSyncEnabled(info.isAutoSyncEnabled);
    } catch (error) {
      console.error('Error cargando información de sync:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleAutoSync = async (value: boolean) => {
    try {
      setAutoSyncEnabled(value);
      if (value) {
        await enableAutoSync();
      } else {
        await disableAutoSync();
      }
      await loadSyncInfo();
    } catch (error) {
      Alert.alert('Error', 'No se pudo cambiar la configuración');
      setAutoSyncEnabled(!value);
    }
  };

  const handleForceSync = async () => {
    try {
      setSyncing(true);
      const diagnoses = await getDiagnosisHistory();
      await forceSync(diagnoses);
      Alert.alert('Éxito', 'Sincronización completada');
      await loadSyncInfo();
    } catch (error) {
      Alert.alert('Error', 'No se pudo sincronizar');
      console.error('Error en sincronización:', error);
    } finally {
      setSyncing(false);
    }
  };

  return (
    <ScreenContainer className="bg-background">
      <ScrollView contentContainerStyle={{ flexGrow: 1 }} className="p-4">
        <View className="gap-6">
          {/* Encabezado */}
          <View className="gap-2">
            <Text className="text-3xl font-bold text-foreground">Sincronización</Text>
            <Text className="text-base text-muted">
              Sincroniza tus diagnósticos entre dispositivos
            </Text>
          </View>

          {loading ? (
            <View className="items-center justify-center py-8">
              <ActivityIndicator size="large" color={colors.primary} />
            </View>
          ) : (
            <>
              {/* Estado de sincronización */}
              <View className="bg-surface rounded-xl p-4 gap-4 border border-border">
                <Text className="text-lg font-semibold text-foreground">Estado Actual</Text>

                <View className="gap-3">
                  <View className="flex-row justify-between items-center">
                    <Text className="text-foreground">Última sincronización:</Text>
                    <Text className="text-sm text-muted font-medium">
                      {syncInfo?.lastSyncTime}
                    </Text>
                  </View>

                  <View className="flex-row justify-between items-center">
                    <Text className="text-foreground">Cambios pendientes:</Text>
                    <Text className="text-sm text-muted font-medium">
                      {syncInfo?.pendingChanges}
                    </Text>
                  </View>

                  {syncInfo?.error && (
                    <View className="bg-error bg-opacity-10 rounded p-2 border border-error">
                      <Text className="text-xs text-error">
                        <Text className="font-semibold">Error: </Text>
                        {syncInfo.error}
                      </Text>
                    </View>
                  )}
                </View>

                {/* Botón de sincronización manual */}
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
              </View>

              {/* Configuración */}
              <View className="bg-surface rounded-xl p-4 gap-4 border border-border">
                <Text className="text-lg font-semibold text-foreground">Configuración</Text>

                {/* Auto-sincronización */}
                <View className="flex-row justify-between items-center">
                  <View className="flex-1">
                    <Text className="text-foreground font-medium">Sincronización Automática</Text>
                    <Text className="text-sm text-muted">
                      Sincronizar cada 15 minutos
                    </Text>
                  </View>
                  <Switch
                    value={autoSyncEnabled}
                    onValueChange={handleToggleAutoSync}
                    trackColor={{ false: colors.border, true: colors.primary }}
                    thumbColor={autoSyncEnabled ? colors.primary : colors.muted}
                  />
                </View>

                {autoSyncEnabled && (
                  <View className="bg-success bg-opacity-10 rounded p-3 border border-success">
                    <Text className="text-xs text-success">
                      ✓ La sincronización automática está habilitada
                    </Text>
                  </View>
                )}
              </View>

              {/* Información */}
              <View className="bg-surface rounded-xl p-4 gap-3 border border-border">
                <Text className="font-semibold text-foreground">ℹ️ Información</Text>
                <Text className="text-sm text-muted">
                  • La sincronización guarda tus diagnósticos en la nube
                </Text>
                <Text className="text-sm text-muted">
                  • Puedes acceder a tu historial desde cualquier dispositivo
                </Text>
                <Text className="text-sm text-muted">
                  • La sincronización automática se ejecuta cada 15 minutos
                </Text>
                <Text className="text-sm text-muted">
                  • Necesitas conexión a internet para sincronizar
                </Text>
                <Text className="text-sm text-muted">
                  • Tus datos se encriptan antes de enviarse
                </Text>
              </View>

              {/* Próximamente */}
              <View className="bg-warning bg-opacity-10 rounded-xl p-4 border border-warning">
                <Text className="text-sm text-warning font-semibold">
                  🚀 Próximamente
                </Text>
                <Text className="text-sm text-warning mt-2">
                  La sincronización con backend estará disponible en la próxima actualización. Por ahora, tus diagnósticos se guardan localmente en tu dispositivo.
                </Text>
              </View>
            </>
          )}
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}
