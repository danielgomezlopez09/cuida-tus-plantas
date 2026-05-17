import { ScrollView, Text, View, TouchableOpacity, Switch, Alert, ActivityIndicator } from 'react-native';
import { useState, useEffect, useCallback } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { ScreenContainer } from '@/components/screen-container';
import { useColors } from '@/hooks/use-colors';
import {
  getNotificationSchedule,
  saveNotificationSchedule,
  sendTestNotification,
  initializeNotifications,
  NotificationSchedule,
} from '@/lib/services/local-notifications-service';

export default function NotificationsSettingsScreen() {
  const colors = useColors();
  const [schedule, setSchedule] = useState<NotificationSchedule | null>(null);
  const [loading, setLoading] = useState(true);
  const [testing, setTesting] = useState(false);

  useFocusEffect(
    useCallback(() => {
      loadSchedule();
    }, [])
  );

  const loadSchedule = async () => {
    try {
      setLoading(true);
      await initializeNotifications();
      const data = await getNotificationSchedule();
      setSchedule(data);
    } catch (error) {
      console.error('Error cargando configuración:', error);
      Alert.alert('Error', 'No se pudo cargar la configuración');
    } finally {
      setLoading(false);
    }
  };

  const handleToggleNotifications = async (value: boolean) => {
    try {
      if (schedule) {
        const updated = { ...schedule, enabled: value };
        await saveNotificationSchedule({ enabled: value });
        setSchedule(updated);
      }
    } catch (error) {
      Alert.alert('Error', 'No se pudo actualizar la configuración');
    }
  };

  const handleChangeInterval = async (type: string, value: number) => {
    try {
      if (schedule) {
        const key = `${type}Interval` as keyof NotificationSchedule;
        await saveNotificationSchedule({ [key]: value });
        setSchedule({ ...schedule, [key]: value });
      }
    } catch (error) {
      Alert.alert('Error', 'No se pudo actualizar el intervalo');
    }
  };

  const handleTestNotification = async () => {
    try {
      setTesting(true);
      await sendTestNotification();
      Alert.alert('Éxito', 'Notificación de prueba enviada');
    } catch (error) {
      Alert.alert('Error', 'No se pudo enviar la notificación de prueba');
    } finally {
      setTesting(false);
    }
  };

  if (loading || !schedule) {
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
            <Text className="text-3xl font-bold text-foreground">Notificaciones</Text>
            <Text className="text-base text-muted">
              Configura recordatorios para el cuidado de tus plantas
            </Text>
          </View>

          {/* Habilitar/deshabilitar notificaciones */}
          <View className="bg-surface rounded-xl p-4 gap-4 border border-border">
            <View className="flex-row justify-between items-center">
              <View className="flex-1">
                <Text className="text-lg font-semibold text-foreground">
                  Notificaciones Habilitadas
                </Text>
                <Text className="text-sm text-muted">
                  Recibe recordatorios de cuidados
                </Text>
              </View>
              <Switch
                value={schedule.enabled}
                onValueChange={handleToggleNotifications}
                trackColor={{ false: colors.border, true: colors.primary }}
                thumbColor={schedule.enabled ? colors.primary : colors.muted}
              />
            </View>
          </View>

          {schedule.enabled && (
            <>
              {/* Intervalo de riego */}
              <View className="bg-surface rounded-xl p-4 gap-3 border border-border">
                <Text className="text-lg font-semibold text-foreground">💧 Riego</Text>
                <Text className="text-sm text-muted">
                  Recordatorio cada {schedule.wateringInterval} horas
                </Text>

                <View className="flex-row gap-2">
                  {[6, 8, 12, 24].map((hours) => (
                    <TouchableOpacity
                      key={hours}
                      onPress={() => handleChangeInterval('watering', hours)}
                      className={`flex-1 py-2 px-3 rounded-lg border ${
                        schedule.wateringInterval === hours
                          ? 'bg-primary border-primary'
                          : 'bg-background border-border'
                      }`}
                    >
                      <Text
                        className={`text-center text-sm font-semibold ${
                          schedule.wateringInterval === hours
                            ? 'text-white'
                            : 'text-foreground'
                        }`}
                      >
                        {hours}h
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              {/* Intervalo de fertilización */}
              <View className="bg-surface rounded-xl p-4 gap-3 border border-border">
                <Text className="text-lg font-semibold text-foreground">🌱 Fertilización</Text>
                <Text className="text-sm text-muted">
                  Recordatorio cada {schedule.fertilizingInterval} horas
                </Text>

                <View className="flex-row gap-2">
                  {[12, 14, 24, 48].map((hours) => (
                    <TouchableOpacity
                      key={hours}
                      onPress={() => handleChangeInterval('fertilizing', hours)}
                      className={`flex-1 py-2 px-3 rounded-lg border ${
                        schedule.fertilizingInterval === hours
                          ? 'bg-primary border-primary'
                          : 'bg-background border-border'
                      }`}
                    >
                      <Text
                        className={`text-center text-sm font-semibold ${
                          schedule.fertilizingInterval === hours
                            ? 'text-white'
                            : 'text-foreground'
                        }`}
                      >
                        {hours}h
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              {/* Intervalo de trasplante */}
              <View className="bg-surface rounded-xl p-4 gap-3 border border-border">
                <Text className="text-lg font-semibold text-foreground">🪴 Trasplante</Text>
                <Text className="text-sm text-muted">
                  Recordatorio cada {schedule.repottingInterval} horas
                </Text>

                <View className="flex-row gap-2">
                  {[120, 168, 240, 336].map((hours) => {
                    const days = Math.round(hours / 24);
                    return (
                      <TouchableOpacity
                        key={hours}
                        onPress={() => handleChangeInterval('repotting', hours)}
                        className={`flex-1 py-2 px-3 rounded-lg border ${
                          schedule.repottingInterval === hours
                            ? 'bg-primary border-primary'
                            : 'bg-background border-border'
                        }`}
                      >
                        <Text
                          className={`text-center text-sm font-semibold ${
                            schedule.repottingInterval === hours
                              ? 'text-white'
                              : 'text-foreground'
                          }`}
                        >
                          {days}d
                        </Text>
                      </TouchableOpacity>
                    );
                  })}
                </View>
              </View>

              {/* Botón de prueba */}
              <TouchableOpacity
                onPress={handleTestNotification}
                disabled={testing}
                className={`rounded-lg py-3 px-4 items-center flex-row justify-center gap-2 ${
                  testing ? 'bg-primary opacity-50' : 'bg-primary'
                }`}
              >
                {testing ? (
                  <>
                    <ActivityIndicator color="white" size="small" />
                    <Text className="text-white font-semibold">Enviando...</Text>
                  </>
                ) : (
                  <>
                    <Text className="text-lg">🔔</Text>
                    <Text className="text-white font-semibold">Enviar Notificación de Prueba</Text>
                  </>
                )}
              </TouchableOpacity>
            </>
          )}

          {!schedule.enabled && (
            <View className="bg-warning bg-opacity-10 rounded-xl p-4 border border-warning">
              <Text className="text-sm text-warning font-semibold">
                ⚠️ Notificaciones Deshabilitadas
              </Text>
              <Text className="text-sm text-warning mt-2">
                Habilita las notificaciones para recibir recordatorios de cuidados
              </Text>
            </View>
          )}

          {/* Información */}
          <View className="bg-surface rounded-xl p-4 gap-3 border border-border">
            <Text className="font-semibold text-foreground">ℹ️ Información</Text>
            <Text className="text-sm text-muted">
              • Las notificaciones se envían incluso si la app está cerrada
            </Text>
            <Text className="text-sm text-muted">
              • Personaliza los intervalos según tus plantas
            </Text>
            <Text className="text-sm text-muted">
              • Necesitas permitir notificaciones en configuración del dispositivo
            </Text>
            <Text className="text-sm text-muted">
              • Usa la notificación de prueba para verificar que todo funciona
            </Text>
          </View>
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}
