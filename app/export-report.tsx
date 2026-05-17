import { ScrollView, Text, View, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { useState, useEffect, useCallback } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { ScreenContainer } from '@/components/screen-container';
import { useColors } from '@/hooks/use-colors';
import { getDiagnosisHistory, DiagnosisRecord } from '@/lib/services/plantnet-service';
import { generateDiagnosisReport, generateHistoryReport, shareReport } from '@/lib/services/pdf-report-service';

export default function ExportReportScreen() {
  const colors = useColors();
  const [history, setHistory] = useState<DiagnosisRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [exporting, setExporting] = useState(false);
  const [selectedDiagnosis, setSelectedDiagnosis] = useState<string | null>(null);

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

  const handleExportSingle = async (diagnosis: DiagnosisRecord) => {
    try {
      setExporting(true);
      const filePath = await generateDiagnosisReport(diagnosis, {
        title: `Diagnóstico - ${diagnosis.plantName}`,
        includeImages: true,
        includeRecommendations: true,
        format: 'full',
      });

      await shareReport(filePath, `diagnosis_${diagnosis.id}.pdf`);
      Alert.alert('Éxito', 'Reporte exportado correctamente');
    } catch (error) {
      console.error('Error exportando reporte:', error);
      Alert.alert('Error', 'No se pudo exportar el reporte');
    } finally {
      setExporting(false);
    }
  };

  const handleExportAll = async () => {
    if (history.length === 0) {
      Alert.alert('Sin datos', 'No hay diagnósticos para exportar');
      return;
    }

    try {
      setExporting(true);
      const filePath = await generateHistoryReport(history, {
        title: 'Historial de Diagnósticos',
        includeImages: false,
        includeRecommendations: true,
        format: 'summary',
      });

      await shareReport(filePath, `history_${Date.now()}.pdf`);
      Alert.alert('Éxito', 'Historial exportado correctamente');
    } catch (error) {
      console.error('Error exportando historial:', error);
      Alert.alert('Error', 'No se pudo exportar el historial');
    } finally {
      setExporting(false);
    }
  };

  return (
    <ScreenContainer className="bg-background">
      <ScrollView contentContainerStyle={{ flexGrow: 1 }} className="p-4">
        <View className="gap-6">
          {/* Encabezado */}
          <View className="gap-2">
            <Text className="text-3xl font-bold text-foreground">Exportar Reportes</Text>
            <Text className="text-base text-muted">
              Descarga tus diagnósticos en formato PDF
            </Text>
          </View>

          {/* Opciones de exportación */}
          <View className="gap-3">
            {/* Exportar historial completo */}
            <TouchableOpacity
              onPress={handleExportAll}
              disabled={exporting || history.length === 0}
              className={`rounded-lg p-4 flex-row items-center gap-3 ${
                exporting || history.length === 0
                  ? 'bg-primary opacity-50'
                  : 'bg-primary'
              }`}
            >
              {exporting ? (
                <ActivityIndicator color="white" />
              ) : (
                <Text className="text-2xl">📋</Text>
              )}
              <View className="flex-1">
                <Text className="text-white font-semibold">
                  Exportar Historial Completo
                </Text>
                <Text className="text-white text-sm opacity-90">
                  {history.length} diagnóstico{history.length !== 1 ? 's' : ''}
                </Text>
              </View>
            </TouchableOpacity>

            {/* Exportar diagnósticos individuales */}
            {history.length > 0 && (
              <View className="gap-2">
                <Text className="text-lg font-semibold text-foreground">
                  Diagnósticos Individuales
                </Text>
                {history.slice(0, 5).map((diagnosis) => (
                  <TouchableOpacity
                    key={diagnosis.id}
                    onPress={() => handleExportSingle(diagnosis)}
                    disabled={exporting}
                    className={`rounded-lg p-3 flex-row items-center gap-3 border border-border ${
                      exporting ? 'bg-surface opacity-50' : 'bg-surface'
                    }`}
                  >
                    {exporting && selectedDiagnosis === diagnosis.id ? (
                      <ActivityIndicator color={colors.primary} size="small" />
                    ) : (
                      <Text className="text-lg">📄</Text>
                    )}
                    <View className="flex-1">
                      <Text className="text-foreground font-medium">
                        {diagnosis.plantName}
                      </Text>
                      <Text className="text-xs text-muted">
                        {new Date(diagnosis.timestamp).toLocaleDateString('es-ES')}
                      </Text>
                    </View>
                    <Text className="text-lg">→</Text>
                  </TouchableOpacity>
                ))}

                {history.length > 5 && (
                  <Text className="text-xs text-muted text-center py-2">
                    +{history.length - 5} más diagnósticos
                  </Text>
                )}
              </View>
            )}
          </View>

          {/* Información */}
          <View className="bg-surface rounded-xl p-4 gap-3 border border-border">
            <Text className="font-semibold text-foreground">ℹ️ Información</Text>
            <Text className="text-sm text-muted">
              • Los reportes se generan en formato PDF con toda la información
            </Text>
            <Text className="text-sm text-muted">
              • Puedes compartir, descargar o imprimir los reportes
            </Text>
            <Text className="text-sm text-muted">
              • El historial completo incluye un resumen de todos los diagnósticos
            </Text>
            <Text className="text-sm text-muted">
              • Los reportes individuales contienen detalles completos y recomendaciones
            </Text>
          </View>

          {/* Estado vacío */}
          {!loading && history.length === 0 && (
            <View className="bg-surface rounded-xl p-6 items-center gap-3 border border-border">
              <Text className="text-4xl">📋</Text>
              <Text className="text-lg font-semibold text-foreground text-center">
                No hay diagnósticos para exportar
              </Text>
              <Text className="text-sm text-muted text-center">
                Realiza algunos diagnósticos primero para poder exportarlos
              </Text>
            </View>
          )}

          {/* Estado cargando */}
          {loading && (
            <View className="items-center justify-center py-8">
              <ActivityIndicator size="large" color={colors.primary} />
              <Text className="text-muted mt-2">Cargando...</Text>
            </View>
          )}
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}
