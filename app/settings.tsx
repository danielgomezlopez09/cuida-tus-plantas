import { ScrollView, Text, View, TextInput, TouchableOpacity, Alert } from 'react-native';
import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ScreenContainer } from '@/components/screen-container';
import { useColors } from '@/hooks/use-colors';

export default function SettingsScreen() {
  const colors = useColors();
  const [apiKey, setApiKey] = useState('');
  const [showApiKey, setShowApiKey] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    loadApiKey();
  }, []);

  const loadApiKey = async () => {
    try {
      const saved = await AsyncStorage.getItem('plantnet_api_key');
      if (saved) {
        setApiKey(saved);
      }
    } catch (error) {
      console.error('Error cargando API key:', error);
    }
  };

  const saveApiKey = async () => {
    if (!apiKey.trim()) {
      Alert.alert('Error', 'Por favor ingresa una API key válida');
      return;
    }

    setIsSaving(true);
    try {
      await AsyncStorage.setItem('plantnet_api_key', apiKey);
      Alert.alert('Éxito', 'API key guardada correctamente');
    } catch (error) {
      Alert.alert('Error', 'No se pudo guardar la API key');
      console.error('Error guardando API key:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const clearApiKey = () => {
    Alert.alert(
      'Confirmar',
      '¿Estás seguro de que deseas eliminar la API key?',
      [
        { text: 'Cancelar', onPress: () => {} },
        {
          text: 'Eliminar',
          onPress: async () => {
            try {
              await AsyncStorage.removeItem('plantnet_api_key');
              setApiKey('');
              Alert.alert('Éxito', 'API key eliminada');
            } catch (error) {
              Alert.alert('Error', 'No se pudo eliminar la API key');
            }
          },
        },
      ]
    );
  };

  return (
    <ScreenContainer className="bg-background">
      <ScrollView contentContainerStyle={{ flexGrow: 1 }} className="p-4">
        <View className="gap-6">
          {/* Título */}
          <View className="gap-2">
            <Text className="text-3xl font-bold text-foreground">Configuración</Text>
            <Text className="text-base text-muted">Configura tu API key de PlantNet</Text>
          </View>

          {/* Sección PlantNet API */}
          <View className="bg-surface rounded-xl p-4 gap-4 border border-border">
            <View className="gap-2">
              <Text className="text-lg font-semibold text-foreground">🔑 PlantNet API Key</Text>
              <Text className="text-sm text-muted">
                Necesitas una API key para usar el diagnóstico de plagas en tiempo real
              </Text>
            </View>

            {/* Input de API Key */}
            <View className="gap-2">
              <Text className="text-sm font-medium text-foreground">API Key</Text>
              <View className="flex-row items-center gap-2 bg-background rounded-lg border border-border px-3 py-3">
                <TextInput
                  placeholder="Ingresa tu API key de PlantNet"
                  placeholderTextColor={colors.muted}
                  value={apiKey}
                  onChangeText={setApiKey}
                  secureTextEntry={!showApiKey}
                  className="flex-1 text-foreground"
                  editable={!isSaving}
                />
                <TouchableOpacity
                  onPress={() => setShowApiKey(!showApiKey)}
                  className="p-2"
                >
                  <Text className="text-lg">{showApiKey ? '👁️' : '👁️‍🗨️'}</Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Botón Guardar */}
            <TouchableOpacity
              onPress={saveApiKey}
              disabled={isSaving}
              className={`rounded-lg py-3 px-4 items-center ${
                isSaving ? 'bg-primary opacity-50' : 'bg-primary'
              }`}
            >
              <Text className="text-white font-semibold">
                {isSaving ? 'Guardando...' : 'Guardar API Key'}
              </Text>
            </TouchableOpacity>

            {/* Botón Eliminar */}
            {apiKey && (
              <TouchableOpacity
                onPress={clearApiKey}
                className="rounded-lg py-3 px-4 items-center bg-error opacity-80"
              >
                <Text className="text-white font-semibold">Eliminar API Key</Text>
              </TouchableOpacity>
            )}

            {/* Estado */}
            {apiKey && (
              <View className="bg-success bg-opacity-10 rounded-lg p-3 border border-success">
                <Text className="text-sm text-success font-medium">✓ API Key configurada</Text>
              </View>
            )}
          </View>

          {/* Sección de Ayuda */}
          <View className="bg-surface rounded-xl p-4 gap-4 border border-border">
            <Text className="text-lg font-semibold text-foreground">📚 ¿Cómo obtener tu API Key?</Text>

            <View className="gap-3">
              <View className="gap-1">
                <Text className="font-semibold text-foreground">1. Visita PlantNet</Text>
                <Text className="text-sm text-muted">Ve a https://my.plantnet.org/</Text>
              </View>

              <View className="gap-1">
                <Text className="font-semibold text-foreground">2. Crea una cuenta</Text>
                <Text className="text-sm text-muted">Usa tu email o cuenta de Google</Text>
              </View>

              <View className="gap-1">
                <Text className="font-semibold text-foreground">3. Obtén tu API Key</Text>
                <Text className="text-sm text-muted">Ve a la sección "API Keys" y crea una nueva</Text>
              </View>

              <View className="gap-1">
                <Text className="font-semibold text-foreground">4. Copia y pega aquí</Text>
                <Text className="text-sm text-muted">Pega tu API key en el campo de arriba</Text>
              </View>
            </View>

            <TouchableOpacity
              onPress={() => {
                // Abrir URL de PlantNet
                alert('Abre https://my.plantnet.org/ en tu navegador');
              }}
              className="bg-primary rounded-lg py-3 px-4 items-center"
            >
              <Text className="text-white font-semibold">Ir a PlantNet</Text>
            </TouchableOpacity>
          </View>

          {/* Información */}
          <View className="bg-surface rounded-xl p-4 gap-3 border border-border">
            <Text className="font-semibold text-foreground">ℹ️ Información</Text>
            <Text className="text-sm text-muted">
              • PlantNet es gratuito y muy preciso (85%+ de exactitud)
            </Text>
            <Text className="text-sm text-muted">
              • Límite: 500 llamadas por día, 10 por minuto
            </Text>
            <Text className="text-sm text-muted">
              • Tu API key se guarda localmente en tu dispositivo
            </Text>
            <Text className="text-sm text-muted">
              • Nunca se envía a servidores externos
            </Text>
          </View>
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}
