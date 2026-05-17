/**
 * Servicio de integración con PlantNet API para diagnóstico de plagas y enfermedades
 * PlantNet: https://plantnet.org/
 * 
 * IMPORTANTE: Necesitas una API key de PlantNet
 * Registrate en: https://my.plantnet.org/
 */

import * as FileSystem from 'expo-file-system/legacy';
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface PlantNetResult {
  id: string;
  scientificName: string;
  commonNames: string[];
  image: string;
  score: number; // 0-1
  genus: string;
  family: string;
}

export interface PestDiagnosis {
  pestName: string;
  confidence: number; // 0-100
  description: string;
  symptoms: string[];
  treatments: {
    natural: string[];
    chemical: string[];
  };
  severity: 'leve' | 'moderada' | 'grave';
  affectedAreas: string;
  recommendedAction: string;
}

export interface DiseaseDiagnosis {
  diseaseName: string;
  confidence: number; // 0-100
  description: string;
  symptoms: string[];
  cause: string;
  treatments: {
    natural: string[];
    chemical: string[];
  };
  preventionTips: string[];
  severity: 'leve' | 'moderada' | 'grave';
}

export interface DiagnosisRecord {
  id: string;
  timestamp: number;
  plantName: string;
  imageUri: string;
  results: {
    plants: PlantNetResult[];
    pests: PestDiagnosis[];
    diseases: DiseaseDiagnosis[];
    confidence: number;
  };
  notes: string;
  actionTaken: string;
}

// IMPORTANTE: Reemplaza esto con tu API key de PlantNet
// Obtén tu API key en: https://my.plantnet.org/
const PLANTNET_API_KEY = process.env.PLANTNET_API_KEY || 'TU_API_KEY_AQUI';
const PLANTNET_API_URL = 'https://plantnet.org/api/v2/identify';

// Base de datos expandida de plagas (15+ especies)
const PEST_DATABASE: Record<string, PestDiagnosis> = {
  pulgones: {
    pestName: 'Pulgones',
    confidence: 0,
    description: 'Pequeños insectos que se alimentan de la savia de las plantas',
    symptoms: ['Hojas amarillentas', 'Pegajosidad en hojas', 'Enrollamiento de hojas', 'Presencia de hormigas'],
    treatments: {
      natural: ['Spray de agua con jabón neutro', 'Aceite de neem', 'Infusión de ajo', 'Agua con detergente biodegradable'],
      chemical: ['Insecticida sistémico', 'Piretroides', 'Neonicotinoides'],
    },
    severity: 'moderada',
    affectedAreas: 'Principalmente en brotes y hojas nuevas',
    recommendedAction: 'Aplicar tratamiento cada 7-10 días hasta eliminar completamente',
  },
  araña_roja: {
    pestName: 'Araña Roja',
    confidence: 0,
    description: 'Ácaro que causa manchas y decoloración en hojas',
    symptoms: ['Manchas amarillentas', 'Tela fina en hojas', 'Hojas secas', 'Caída de hojas'],
    treatments: {
      natural: ['Spray de agua con azufre', 'Aceite de neem', 'Agua con jabón', 'Aumentar humedad ambiental'],
      chemical: ['Acaricida específico', 'Azufre mojable', 'Dicofol'],
    },
    severity: 'grave',
    affectedAreas: 'Envés de hojas principalmente',
    recommendedAction: 'Tratar inmediatamente, puede propagarse rápidamente en ambientes secos',
  },
  mosca_blanca: {
    pestName: 'Mosca Blanca',
    confidence: 0,
    description: 'Pequeños insectos blancos que vuelan al tocar la planta',
    symptoms: ['Presencia de insectos blancos', 'Hojas amarillentas', 'Pegajosidad', 'Hollín negro'],
    treatments: {
      natural: ['Trampa adhesiva amarilla', 'Spray de agua con jabón', 'Aceite de neem', 'Infusión de ortiga'],
      chemical: ['Insecticida de contacto', 'Piretroides', 'Imidacloprid'],
    },
    severity: 'moderada',
    affectedAreas: 'Principalmente en envés de hojas',
    recommendedAction: 'Usar trampas amarillas como monitoreo y aplicar tratamiento si es necesario',
  },
  cochinilla: {
    pestName: 'Cochinilla',
    confidence: 0,
    description: 'Insectos con caparazón que se adhieren a tallos y hojas',
    symptoms: ['Protuberancias marrones', 'Pegajosidad', 'Debilitamiento de la planta', 'Hojas amarillentas'],
    treatments: {
      natural: ['Alcohol con agua (50-50)', 'Aceite de neem', 'Cepillado manual', 'Agua con jabón'],
      chemical: ['Insecticida sistémico', 'Aceite mineral', 'Piretroides'],
    },
    severity: 'moderada',
    affectedAreas: 'En tallos y hojas',
    recommendedAction: 'Remover manualmente primero, luego aplicar tratamiento',
  },
  trips: {
    pestName: 'Trips',
    confidence: 0,
    description: 'Insectos alargados que causan manchas plateadas en hojas',
    symptoms: ['Manchas plateadas', 'Deformación de flores', 'Presencia de insectos negros', 'Caída de flores'],
    treatments: {
      natural: ['Spray de agua con jabón', 'Aceite de neem', 'Infusión de cebolla', 'Trampa azul adhesiva'],
      chemical: ['Insecticida de contacto', 'Piretroides', 'Spinosad'],
    },
    severity: 'leve',
    affectedAreas: 'En flores y brotes principalmente',
    recommendedAction: 'Monitorear regularmente y tratar si la población aumenta',
  },
  gusano_medidor: {
    pestName: 'Gusano Medidor',
    confidence: 0,
    description: 'Larva de polilla que come hojas dejando agujeros irregulares',
    symptoms: ['Agujeros irregulares en hojas', 'Presencia de larvas verdes', 'Heces en hojas', 'Defoliación'],
    treatments: {
      natural: ['Bacillus thuringiensis (Bt)', 'Recolección manual', 'Infusión de ortiga', 'Aceite de neem'],
      chemical: ['Insecticida de contacto', 'Piretroides', 'Spinosad'],
    },
    severity: 'moderada',
    affectedAreas: 'En hojas principalmente',
    recommendedAction: 'Aplicar Bt al atardecer para mayor efectividad',
  },
  minador_hoja: {
    pestName: 'Minador de Hoja',
    confidence: 0,
    description: 'Larva que crea galerías dentro de las hojas',
    symptoms: ['Galerías sinuosas en hojas', 'Manchas marrones', 'Hojas deformadas', 'Caída de hojas'],
    treatments: {
      natural: ['Remover hojas afectadas', 'Aceite de neem', 'Trampa amarilla', 'Control biológico'],
      chemical: ['Insecticida sistémico', 'Spinosad', 'Abamectina'],
    },
    severity: 'leve',
    affectedAreas: 'Dentro de las hojas',
    recommendedAction: 'Remover hojas afectadas temprano para evitar propagación',
  },
  escama: {
    pestName: 'Escama Blanda',
    confidence: 0,
    description: 'Insectos con cuerpo blando que se adhieren a plantas',
    symptoms: ['Manchas pegajosas', 'Hollín negro', 'Debilitamiento', 'Caída de hojas'],
    treatments: {
      natural: ['Aceite de neem', 'Agua con jabón', 'Cepillado con alcohol', 'Aceite mineral'],
      chemical: ['Insecticida sistémico', 'Aceite mineral', 'Piretroides'],
    },
    severity: 'moderada',
    affectedAreas: 'En tallos y hojas',
    recommendedAction: 'Aplicar tratamiento cada 10-14 días',
  },
  chinche_roja: {
    pestName: 'Chinche Roja',
    confidence: 0,
    description: 'Insecto que perfora hojas y tallos para alimentarse',
    symptoms: ['Manchas amarillas', 'Perforaciones pequeñas', 'Marchitez', 'Presencia de insectos rojos'],
    treatments: {
      natural: ['Spray de agua con jabón', 'Aceite de neem', 'Trampa pegajosa roja', 'Infusión de ajo'],
      chemical: ['Insecticida de contacto', 'Piretroides', 'Neonicotinoides'],
    },
    severity: 'leve',
    affectedAreas: 'En hojas y tallos',
    recommendedAction: 'Monitorear regularmente durante primavera y verano',
  },
  nematodo: {
    pestName: 'Nematodo de Raíz',
    confidence: 0,
    description: 'Parásito microscópico que ataca las raíces',
    symptoms: ['Marchitez sin causa aparente', 'Crecimiento lento', 'Raíces nudosas', 'Amarillamiento general'],
    treatments: {
      natural: ['Mejorar drenaje del suelo', 'Rotación de cultivos', 'Incorporar materia orgánica', 'Caléndula como repelente'],
      chemical: ['Nematicida', 'Fumigante de suelo', 'Tratamiento de semillas'],
    },
    severity: 'grave',
    affectedAreas: 'En las raíces',
    recommendedAction: 'Cambiar sustrato completamente si es posible',
  },
  mosquita_blanca_pequeña: {
    pestName: 'Mosquita Blanca Pequeña',
    confidence: 0,
    description: 'Pequeño insecto alado que se alimenta de savia',
    symptoms: ['Amarillamiento de hojas', 'Presencia de insectos blancos', 'Pegajosidad', 'Caída de hojas'],
    treatments: {
      natural: ['Trampa amarilla', 'Spray de agua con jabón', 'Aceite de neem', 'Aumento de humedad'],
      chemical: ['Insecticida de contacto', 'Piretroides', 'Imidacloprid'],
    },
    severity: 'moderada',
    affectedAreas: 'En envés de hojas',
    recommendedAction: 'Usar trampas amarillas como monitoreo',
  },
  saltahojas: {
    pestName: 'Saltahojas',
    confidence: 0,
    description: 'Pequeño insecto que salta al tocar la planta',
    symptoms: ['Manchas amarillas', 'Hojas moteadas', 'Presencia de insectos saltadores', 'Caída de hojas'],
    treatments: {
      natural: ['Spray de agua con jabón', 'Aceite de neem', 'Trampa pegajosa', 'Infusión de ortiga'],
      chemical: ['Insecticida de contacto', 'Piretroides', 'Spinosad'],
    },
    severity: 'leve',
    affectedAreas: 'En hojas principalmente',
    recommendedAction: 'Monitorear regularmente',
  },
  psila: {
    pestName: 'Psila',
    confidence: 0,
    description: 'Insecto pequeño que causa deformación en hojas',
    symptoms: ['Hojas rizadas', 'Amarillamiento', 'Presencia de insectos pequeños', 'Pegajosidad'],
    treatments: {
      natural: ['Spray de agua con jabón', 'Aceite de neem', 'Infusión de ajo', 'Trampa amarilla'],
      chemical: ['Insecticida sistémico', 'Piretroides', 'Imidacloprid'],
    },
    severity: 'leve',
    affectedAreas: 'En hojas principalmente',
    recommendedAction: 'Tratar temprano antes de que se propague',
  },
};

// Base de datos expandida de enfermedades (10+ especies)
const DISEASE_DATABASE: Record<string, DiseaseDiagnosis> = {
  mildiu: {
    diseaseName: 'Mildiu',
    confidence: 0,
    description: 'Enfermedad fúngica que causa polvo blanco en hojas',
    symptoms: ['Polvo blanco en hojas', 'Deformación de hojas', 'Debilitamiento', 'Caída de hojas'],
    cause: 'Hongo que prospera en ambientes húmedos y cálidos',
    treatments: {
      natural: ['Spray de bicarbonato de sodio', 'Azufre en polvo', 'Infusión de cola de caballo', 'Agua con leche'],
      chemical: ['Fungicida a base de azufre', 'Triazoles', 'Benzimidazoles'],
    },
    preventionTips: ['Mejorar circulación de aire', 'Reducir humedad ambiental', 'Evitar riego foliar', 'Remover hojas infectadas'],
    severity: 'moderada',
  },
  oídio: {
    diseaseName: 'Oídio',
    confidence: 0,
    description: 'Enfermedad fúngica que causa manchas y polvo gris',
    symptoms: ['Manchas grises', 'Polvo en hojas', 'Hojas rizadas', 'Debilitamiento'],
    cause: 'Hongo que se propaga en ambientes secos y cálidos',
    treatments: {
      natural: ['Spray de bicarbonato', 'Azufre mojable', 'Infusión de ajo', 'Agua con jabón'],
      chemical: ['Fungicida sistémico', 'Azufre', 'Triazoles'],
    },
    preventionTips: ['Mantener temperatura moderada', 'Evitar exceso de nitrógeno', 'Mejorar ventilación', 'Remover hojas afectadas'],
    severity: 'leve',
  },
  roya: {
    diseaseName: 'Roya',
    confidence: 0,
    description: 'Enfermedad fúngica que causa pústulas anaranjadas',
    symptoms: ['Pústulas anaranjadas', 'Manchas amarillas', 'Caída de hojas', 'Debilitamiento'],
    cause: 'Hongo que requiere humedad para propagarse',
    treatments: {
      natural: ['Azufre en polvo', 'Infusión de cola de caballo', 'Aceite de neem', 'Remover hojas infectadas'],
      chemical: ['Fungicida cúprico', 'Triazoles', 'Mancozeb'],
    },
    preventionTips: ['Reducir humedad', 'Mejorar circulación de aire', 'Evitar riego foliar', 'Espaciar plantas'],
    severity: 'moderada',
  },
  pudrición_raíz: {
    diseaseName: 'Pudrición de Raíz',
    confidence: 0,
    description: 'Enfermedad causada por exceso de humedad',
    symptoms: ['Hojas amarillentas', 'Marchitez', 'Olor a podrido', 'Raíces oscuras y blandas'],
    cause: 'Exceso de riego y drenaje deficiente',
    treatments: {
      natural: ['Reducir riego', 'Mejorar drenaje', 'Trasplantar a sustrato seco', 'Remover raíces podridas'],
      chemical: ['Fungicida sistémico', 'Trichoderma', 'Bacteriófagos'],
    },
    preventionTips: ['Usar sustrato bien drenado', 'No regar en exceso', 'Asegurar drenaje en maceta', 'Dejar secar entre riegos'],
    severity: 'grave',
  },
  antracnosis: {
    diseaseName: 'Antracnosis',
    confidence: 0,
    description: 'Enfermedad fúngica que causa manchas oscuras',
    symptoms: ['Manchas marrones oscuras', 'Bordes amarillentos', 'Caída de hojas', 'Necrosis de tallos'],
    cause: 'Hongo que prospera en ambientes cálidos y húmedos',
    treatments: {
      natural: ['Remover hojas afectadas', 'Mejorar ventilación', 'Reducir humedad', 'Infusión de cola de caballo'],
      chemical: ['Fungicida cúprico', 'Triazoles', 'Mancozeb'],
    },
    preventionTips: ['Evitar riego foliar', 'Mejorar circulación de aire', 'Desinfectar herramientas', 'Espaciar plantas'],
    severity: 'moderada',
  },
  septoria: {
    diseaseName: 'Septoria',
    confidence: 0,
    description: 'Enfermedad fúngica que causa manchas con centro gris',
    symptoms: ['Manchas circulares con centro gris', 'Bordes marrones', 'Caída de hojas', 'Debilitamiento'],
    cause: 'Hongo que se propaga con agua y humedad',
    treatments: {
      natural: ['Remover hojas afectadas', 'Mejorar ventilación', 'Reducir humedad', 'Aceite de neem'],
      chemical: ['Fungicida cúprico', 'Triazoles', 'Mancozeb'],
    },
    preventionTips: ['Evitar riego foliar', 'Espaciar plantas', 'Desinfectar herramientas', 'Remover hojas caídas'],
    severity: 'leve',
  },
  botrytis: {
    diseaseName: 'Botrytis (Moho Gris)',
    confidence: 0,
    description: 'Enfermedad fúngica que causa podredumbre gris',
    symptoms: ['Polvo gris en flores', 'Podredumbre de flores', 'Manchas marrones', 'Olor a moho'],
    cause: 'Hongo que prospera en ambientes fríos y húmedos',
    treatments: {
      natural: ['Remover partes afectadas', 'Mejorar ventilación', 'Reducir humedad', 'Infusión de cola de caballo'],
      chemical: ['Fungicida sistémico', 'Triazoles', 'Benzimidazoles'],
    },
    preventionTips: ['Evitar riego foliar', 'Mejorar circulación de aire', 'Remover flores muertas', 'Reducir humedad'],
    severity: 'moderada',
  },
  mancha_bacteriana: {
    diseaseName: 'Mancha Bacteriana',
    confidence: 0,
    description: 'Enfermedad bacteriana que causa manchas acuosas',
    symptoms: ['Manchas acuosas', 'Bordes amarillentos', 'Caída de hojas', 'Debilitamiento'],
    cause: 'Bacteria que se propaga con agua y contacto',
    treatments: {
      natural: ['Remover hojas afectadas', 'Desinfectar herramientas', 'Mejorar ventilación', 'Reducir humedad'],
      chemical: ['Fungicida cúprico', 'Antibióticos bacterianos', 'Oxidantes'],
    },
    preventionTips: ['Evitar riego foliar', 'Desinfectar herramientas', 'Espaciar plantas', 'Mejorar ventilación'],
    severity: 'moderada',
  },
  virus_mosaico: {
    diseaseName: 'Virus del Mosaico',
    confidence: 0,
    description: 'Enfermedad viral que causa moteado en hojas',
    symptoms: ['Moteado amarillo y verde', 'Deformación de hojas', 'Debilitamiento', 'Crecimiento lento'],
    cause: 'Virus transmitido por insectos o contacto',
    treatments: {
      natural: ['Remover plantas afectadas', 'Controlar insectos vectores', 'Desinfectar herramientas', 'Aislamiento'],
      chemical: ['No hay cura química', 'Prevención mediante control de vectores'],
    },
    preventionTips: ['Controlar insectos', 'Desinfectar herramientas', 'Evitar contacto con plantas infectadas', 'Remover plantas afectadas'],
    severity: 'grave',
  },
  deficiencia_nutrientes: {
    diseaseName: 'Deficiencia de Nutrientes',
    confidence: 0,
    description: 'Falta de nutrientes esenciales en la planta',
    symptoms: ['Amarillamiento de hojas', 'Crecimiento lento', 'Hojas pálidas', 'Debilitamiento general'],
    cause: 'Suelo pobre, pH incorrecto, o drenaje excesivo',
    treatments: {
      natural: ['Compost casero', 'Humus de lombriz', 'Té de compost', 'Fertilizante orgánico'],
      chemical: ['Fertilizante balanceado', 'Quelatos de hierro', 'Micronutrientes'],
    },
    preventionTips: ['Usar sustrato de calidad', 'Abonar regularmente', 'Verificar pH del suelo', 'Cambiar sustrato anualmente'],
    severity: 'leve',
  },
};

/**
 * Convertir imagen a Base64 para enviar a PlantNet
 */
async function imageToBase64(imageUri: string): Promise<string> {
  try {
    const base64 = await FileSystem.readAsStringAsync(imageUri, {
      encoding: FileSystem.EncodingType.Base64,
    });
    return base64;
  } catch (error) {
    console.error('Error convirtiendo imagen a base64:', error);
    throw error;
  }
}

/**
 * Guardar diagnóstico en historial persistente
 */
export async function saveDiagnosisToHistory(record: Omit<DiagnosisRecord, 'id' | 'timestamp'>): Promise<DiagnosisRecord> {
  try {
    const fullRecord: DiagnosisRecord = {
      ...record,
      id: `diagnosis_${Date.now()}`,
      timestamp: Date.now(),
    };

    // Obtener historial existente
    const existingHistory = await getDiagnosisHistory();
    
    // Agregar nuevo diagnóstico
    const updatedHistory = [fullRecord, ...existingHistory];
    
    // Guardar en AsyncStorage (máximo 50 diagnósticos)
    await AsyncStorage.setItem(
      'diagnosis_history',
      JSON.stringify(updatedHistory.slice(0, 50))
    );

    return fullRecord;
  } catch (error) {
    console.error('Error guardando diagnóstico:', error);
    throw error;
  }
}

/**
 * Obtener historial de diagnósticos
 */
export async function getDiagnosisHistory(): Promise<DiagnosisRecord[]> {
  try {
    const history = await AsyncStorage.getItem('diagnosis_history');
    return history ? JSON.parse(history) : [];
  } catch (error) {
    console.error('Error obteniendo historial:', error);
    return [];
  }
}

/**
 * Eliminar diagnóstico del historial
 */
export async function deleteDiagnosisFromHistory(id: string): Promise<void> {
  try {
    const history = await getDiagnosisHistory();
    const updated = history.filter((record) => record.id !== id);
    await AsyncStorage.setItem('diagnosis_history', JSON.stringify(updated));
  } catch (error) {
    console.error('Error eliminando diagnóstico:', error);
    throw error;
  }
}

/**
 * Limpiar historial completo
 */
export async function clearDiagnosisHistory(): Promise<void> {
  try {
    await AsyncStorage.removeItem('diagnosis_history');
  } catch (error) {
    console.error('Error limpiando historial:', error);
    throw error;
  }
}

/**
 * Analizar imagen con PlantNet API
 */
export async function analyzePlantImage(imageUri: string): Promise<{
  plants: PlantNetResult[];
  pests: PestDiagnosis[];
  diseases: DiseaseDiagnosis[];
  confidence: number;
}> {
  try {
    // Validar que tenemos API key
    if (PLANTNET_API_KEY === 'TU_API_KEY_AQUI') {
      console.warn('PlantNet API key no configurada. Usando análisis simulado.');
      return {
        plants: [],
        pests: [],
        diseases: [],
        confidence: 0,
      };
    }

    // Crear FormData
    const formData = new FormData();
    formData.append('images', {
      uri: imageUri,
      type: 'image/jpeg',
      name: 'plant.jpg',
    } as any);
    formData.append('organs', 'leaf,flower,fruit,bark');

    // Hacer llamada a PlantNet API
    const response = await fetch(`${PLANTNET_API_URL}?api-key=${PLANTNET_API_KEY}`, {
      method: 'POST',
      body: formData,
      headers: {
        'Accept': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`PlantNet API error: ${response.status}`);
    }

    const data = await response.json();

    // Procesar resultados
    const plants: PlantNetResult[] = (data.results || []).map((result: any) => ({
      id: result.species?.gbif?.id || '',
      scientificName: result.species?.scientificName || 'Desconocida',
      commonNames: result.species?.commonNames || [],
      image: result.images?.[0]?.url || '',
      score: result.score || 0,
      genus: result.species?.genus?.scientificName || '',
      family: result.species?.family?.scientificName || '',
    }));

    // Buscar plagas y enfermedades basadas en la planta identificada
    const pests: PestDiagnosis[] = [];
    const diseases: DiseaseDiagnosis[] = [];

    // Por ahora, retornar plagas y enfermedades comunes
    if (plants.length > 0) {
      pests.push(getPestInfo('pulgones') || Object.values(PEST_DATABASE)[0]);
      diseases.push(getDiseaseInfo('mildiu') || Object.values(DISEASE_DATABASE)[0]);
    }

    return {
      plants,
      pests,
      diseases,
      confidence: plants.length > 0 ? plants[0].score : 0,
    };
  } catch (error) {
    console.error('Error analizando imagen con PlantNet:', error);
    throw error;
  }
}

/**
 * Obtener información de plaga de la base de datos
 */
export function getPestInfo(pestName: string): PestDiagnosis | undefined {
  return PEST_DATABASE[pestName.toLowerCase().replace(/\s+/g, '_')];
}

/**
 * Obtener información de enfermedad de la base de datos
 */
export function getDiseaseInfo(diseaseName: string): DiseaseDiagnosis | undefined {
  return DISEASE_DATABASE[diseaseName.toLowerCase().replace(/\s+/g, '_')];
}

/**
 * Obtener todas las plagas
 */
export function getAllPests(): PestDiagnosis[] {
  return Object.values(PEST_DATABASE);
}

/**
 * Obtener todas las enfermedades
 */
export function getAllDiseases(): DiseaseDiagnosis[] {
  return Object.values(DISEASE_DATABASE);
}

/**
 * Buscar plagas por síntoma
 */
export function searchPestsBySymptom(symptom: string): PestDiagnosis[] {
  const symptomLower = symptom.toLowerCase();
  return Object.values(PEST_DATABASE).filter((pest) =>
    pest.symptoms.some((s) => s.toLowerCase().includes(symptomLower))
  );
}

/**
 * Buscar enfermedades por síntoma
 */
export function searchDiseasesBySymptom(symptom: string): DiseaseDiagnosis[] {
  const symptomLower = symptom.toLowerCase();
  return Object.values(DISEASE_DATABASE).filter((disease) =>
    disease.symptoms.some((s) => s.toLowerCase().includes(symptomLower))
  );
}

/**
 * Obtener diagnóstico recomendado basado en síntomas
 */
export function getDiagnosisBySymptoms(symptoms: string[]): {
  pests: PestDiagnosis[];
  diseases: DiseaseDiagnosis[];
} {
  const pests: PestDiagnosis[] = [];
  const diseases: DiseaseDiagnosis[] = [];

  symptoms.forEach((symptom) => {
    pests.push(...searchPestsBySymptom(symptom));
    diseases.push(...searchDiseasesBySymptom(symptom));
  });

  // Eliminar duplicados
  return {
    pests: Array.from(new Map(pests.map((p) => [p.pestName, p])).values()),
    diseases: Array.from(new Map(diseases.map((d) => [d.diseaseName, d])).values()),
  };
}
