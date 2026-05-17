/**
 * Servicio de Diagnóstico de Plagas y Enfermedades
 * Utiliza la API de IA del servidor para analizar fotos de plantas
 */

interface DiagnosisResult {
  type: 'pest' | 'disease' | 'nutrient_deficiency' | 'healthy';
  name: string;
  confidence: number; // 0-100
  description: string;
  symptoms: string[];
  treatments: {
    natural: string[];
    chemical: string[];
    preventive: string[];
  };
  severity: 'low' | 'medium' | 'high' | 'critical';
  urgency: string;
  affectedAreas: string[];
}

interface GrowthAnalysis {
  plantId: string;
  plantName: string;
  photos: Array<{
    date: string;
    uri: string;
    measurements?: {
      height?: number;
      leafCount?: number;
      leafSize?: number;
    };
  }>;
  growthTrend: 'excellent' | 'good' | 'stable' | 'declining';
  estimatedGrowthRate: string;
  recommendations: string[];
  healthScore: number; // 0-100
}

export class PlantDiagnosisService {
  private apiUrl: string;

  constructor(apiUrl: string = 'http://localhost:3000') {
    this.apiUrl = apiUrl;
  }

  /**
   * Diagnosticar plagas y enfermedades a partir de una foto
   */
  async diagnosePestOrDisease(
    imageUri: string,
    plantName?: string,
    plantId?: string
  ): Promise<DiagnosisResult> {
    try {
      // Convertir imagen a base64
      const base64Image = await this.imageToBase64(imageUri);

      // Enviar a servidor para análisis con IA
      const response = await fetch(`${this.apiUrl}/api/diagnose-plant`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          image: base64Image,
          plantName,
          plantId,
          analysisType: 'pest_disease',
        }),
      });

      if (!response.ok) {
        throw new Error(`Error en diagnóstico: ${response.statusText}`);
      }

      const result = await response.json();
      return this.parseDiagnosisResponse(result);
    } catch (error) {
      console.error('Error diagnosticando plaga/enfermedad:', error);
      throw error;
    }
  }

  /**
   * Diagnosticar daños generales en la planta
   */
  async diagnosePlantDamage(
    imageUri: string,
    plantName?: string
  ): Promise<DiagnosisResult> {
    try {
      const base64Image = await this.imageToBase64(imageUri);

      const response = await fetch(`${this.apiUrl}/api/diagnose-plant`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          image: base64Image,
          plantName,
          analysisType: 'damage',
        }),
      });

      if (!response.ok) {
        throw new Error(`Error en diagnóstico: ${response.statusText}`);
      }

      const result = await response.json();
      return this.parseDiagnosisResponse(result);
    } catch (error) {
      console.error('Error diagnosticando daño:', error);
      throw error;
    }
  }

  /**
   * Analizar crecimiento de la planta basado en fotos históricas
   */
  async analyzeGrowth(
    plantId: string,
    plantName: string,
    photos: Array<{ date: string; uri: string }>
  ): Promise<GrowthAnalysis> {
    try {
      // Convertir fotos a base64
      const base64Photos = await Promise.all(
        photos.map(async (photo) => ({
          date: photo.date,
          image: await this.imageToBase64(photo.uri),
        }))
      );

      const response = await fetch(`${this.apiUrl}/api/analyze-growth`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          plantId,
          plantName,
          photos: base64Photos,
        }),
      });

      if (!response.ok) {
        throw new Error(`Error en análisis de crecimiento: ${response.statusText}`);
      }

      const result = await response.json();
      return this.parseGrowthAnalysis(result);
    } catch (error) {
      console.error('Error analizando crecimiento:', error);
      throw error;
    }
  }

  /**
   * Obtener recomendaciones de tratamiento basadas en diagnóstico
   */
  async getTreatmentRecommendations(diagnosis: DiagnosisResult): Promise<string[]> {
    try {
      const response = await fetch(`${this.apiUrl}/api/treatment-recommendations`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          diagnosis,
        }),
      });

      if (!response.ok) {
        throw new Error(`Error obteniendo recomendaciones: ${response.statusText}`);
      }

      const result = await response.json();
      return result.recommendations || [];
    } catch (error) {
      console.error('Error obteniendo recomendaciones:', error);
      // Retornar recomendaciones por defecto
      return this.getDefaultRecommendations(diagnosis);
    }
  }

  /**
   * Convertir imagen a base64
   */
  private async imageToBase64(imageUri: string): Promise<string> {
    try {
      // Si es una URL, descargarla
      if (imageUri.startsWith('http')) {
        const response = await fetch(imageUri);
        const blob = await response.blob();
        return new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.onloadend = () => {
            const base64 = reader.result as string;
            resolve(base64.split(',')[1]);
          };
          reader.onerror = reject;
          reader.readAsDataURL(blob);
        });
      }

      // Si es un archivo local, leerlo
      const response = await fetch(imageUri);
      const blob = await response.blob();
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          const base64 = reader.result as string;
          resolve(base64.split(',')[1]);
        };
        reader.onerror = reject;
        reader.readAsDataURL(blob);
      });
    } catch (error) {
      console.error('Error convirtiendo imagen a base64:', error);
      throw error;
    }
  }

  /**
   * Parsear respuesta de diagnóstico
   */
  private parseDiagnosisResponse(response: any): DiagnosisResult {
    return {
      type: response.type || 'healthy',
      name: response.name || 'Desconocido',
      confidence: response.confidence || 0,
      description: response.description || '',
      symptoms: response.symptoms || [],
      treatments: {
        natural: response.treatments?.natural || [],
        chemical: response.treatments?.chemical || [],
        preventive: response.treatments?.preventive || [],
      },
      severity: response.severity || 'low',
      urgency: response.urgency || '',
      affectedAreas: response.affectedAreas || [],
    };
  }

  /**
   * Parsear análisis de crecimiento
   */
  private parseGrowthAnalysis(response: any): GrowthAnalysis {
    return {
      plantId: response.plantId || '',
      plantName: response.plantName || '',
      photos: response.photos || [],
      growthTrend: response.growthTrend || 'stable',
      estimatedGrowthRate: response.estimatedGrowthRate || '',
      recommendations: response.recommendations || [],
      healthScore: response.healthScore || 0,
    };
  }

  /**
   * Recomendaciones por defecto basadas en diagnóstico
   */
  private getDefaultRecommendations(diagnosis: DiagnosisResult): string[] {
    const recommendations: string[] = [];

    if (diagnosis.type === 'pest') {
      recommendations.push('Aislar la planta de otras');
      recommendations.push('Inspeccionar regularmente');
      recommendations.push('Aplicar tratamiento natural primero');
      if (diagnosis.severity === 'critical') {
        recommendations.push('Considerar tratamiento químico');
      }
    } else if (diagnosis.type === 'disease') {
      recommendations.push('Aumentar circulación de aire');
      recommendations.push('Reducir humedad si es posible');
      recommendations.push('Remover partes afectadas');
      recommendations.push('Aplicar fungicida si es necesario');
    } else if (diagnosis.type === 'nutrient_deficiency') {
      recommendations.push('Aplicar fertilizante balanceado');
      recommendations.push('Cambiar sustrato si es necesario');
      recommendations.push('Aumentar frecuencia de riego ligero');
    }

    return recommendations;
  }
}

export type { DiagnosisResult, GrowthAnalysis };
export default PlantDiagnosisService;
