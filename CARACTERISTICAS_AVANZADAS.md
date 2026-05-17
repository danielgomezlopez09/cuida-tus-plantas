# Características Avanzadas - Cuida tus Plantas v1.2.0

## 🚀 4 Características Avanzadas Implementadas

Esta versión incluye 4 características avanzadas que elevan la aplicación a un nivel profesional:

---

## 1. 📸 Cámara Real con Captura de Fotos

### Descripción
Permite a los usuarios capturar fotos directamente desde la cámara del dispositivo o seleccionar de la galería.

### Ubicación
- **Pantalla:** `app/camera-capture.tsx`
- **Hook:** `usePlantPhotos()` en `hooks/use-plant-photos.ts`

### Funcionalidades
- Capturar fotos en tiempo real
- Seleccionar de la galería del dispositivo
- Agregar notas personalizadas a cada foto
- Almacenamiento local de fotos con timestamps

### Cómo Usar
```typescript
import { usePlantPhotos } from '@/hooks/use-plant-photos';

const { addPhoto, getPlantPhotos } = usePlantPhotos();

// Agregar foto
await addPhoto(plantId, {
  uri: 'file:///path/to/photo.jpg',
  timestamp: new Date().toISOString(),
  notes: 'Planta en buen estado'
});

// Obtener fotos de una planta
const photos = getPlantPhotos(plantId);
```

### Instalación de Dependencias
Para usar cámara real, instala:
```bash
npm install expo-camera expo-image-picker
```

Luego actualiza `app/camera-capture.tsx` con:
```typescript
import { CameraView } from 'expo-camera';
import * as ImagePicker from 'expo-image-picker';
```

---

## 2. 📊 Análisis de Crecimiento

### Descripción
Analiza el crecimiento de la planta comparando fotos históricas y proporciona métricas de salud y tendencias.

### Ubicación
- **Pantalla:** `app/growth-analysis.tsx`
- **Servicio:** `lib/services/plant-diagnosis-service.ts`

### Funcionalidades
- Comparar fotos a lo largo del tiempo
- Calcular tasa de crecimiento estimada
- Puntuación de salud (0-100%)
- Tendencias: Excelente, Bueno, Estable, Declinando
- Recomendaciones automáticas basadas en crecimiento

### Cómo Usar
```typescript
import PlantDiagnosisService from '@/lib/services/plant-diagnosis-service';

const service = new PlantDiagnosisService();

const analysis = await service.analyzeGrowth(
  plantId,
  plantName,
  [
    { date: '2026-01-15', uri: 'file:///photo1.jpg' },
    { date: '2026-02-15', uri: 'file:///photo2.jpg' },
    { date: '2026-03-15', uri: 'file:///photo3.jpg' }
  ]
);

console.log(`Tendencia: ${analysis.growthTrend}`);
console.log(`Salud: ${analysis.healthScore}%`);
console.log(`Recomendaciones:`, analysis.recommendations);
```

### Métricas Incluidas
- **Altura estimada:** Cambio en altura de la planta
- **Número de hojas:** Conteo de nuevas hojas
- **Tamaño de hojas:** Crecimiento del follaje
- **Color y vitalidad:** Análisis visual de salud

---

## 3. 🔄 Sincronización con Backend

### Descripción
Sincroniza automáticamente los datos del usuario entre dispositivos usando una cuenta opcional.

### Ubicación
- **Contexto:** `lib/contexts/SyncContext.tsx`
- **Hook:** `useSync()`

### Funcionalidades
- Login/Logout con email y contraseña
- Sincronización automática cada 30 minutos
- Subir plantas individuales
- Descargar plantas del servidor
- Detección de conexión online/offline
- Almacenamiento de token de autenticación

### Cómo Usar
```typescript
import { useSync } from '@/lib/contexts/SyncContext';

export function MyComponent() {
  const { user, isLoggedIn, syncData, login, logout } = useSync();

  const handleLogin = async () => {
    try {
      await login('user@example.com', 'password123');
    } catch (error) {
      console.error('Error en login:', error);
    }
  };

  const handleSync = async () => {
    await syncData();
  };

  return (
    <View>
      {isLoggedIn ? (
        <>
          <Text>Conectado como: {user?.email}</Text>
          <Pressable onPress={handleSync}>
            <Text>Sincronizar Ahora</Text>
          </Pressable>
          <Pressable onPress={logout}>
            <Text>Cerrar Sesión</Text>
          </Pressable>
        </>
      ) : (
        <Pressable onPress={handleLogin}>
          <Text>Iniciar Sesión</Text>
        </Pressable>
      )}
    </View>
  );
}
```

### Configuración del Servidor
El servidor debe implementar estos endpoints:

```
POST /api/auth/login
  Body: { email, password }
  Response: { id, email, name, token }

POST /api/sync
  Headers: Authorization: Bearer {token}
  Body: { plants, photos, reminders }

GET /api/plants
  Headers: Authorization: Bearer {token}
  Response: [{ id, name, ... }]

POST /api/plants
  Headers: Authorization: Bearer {token}
  Body: { plant data }
```

---

## 4. 🐛 Diagnóstico de Plagas y Enfermedades con IA

### Descripción
Identifica plagas, enfermedades y daños en plantas usando análisis de IA de fotos, proporcionando tratamientos naturales y químicos.

### Ubicación
- **Pantalla:** `app/pest-diagnosis.tsx`
- **Servicio:** `lib/services/plant-diagnosis-service.ts`

### Funcionalidades
- Identificar plagas comunes
- Detectar enfermedades fúngicas y bacterianas
- Diagnosticar deficiencias nutricionales
- Clasificar severidad (Bajo, Medio, Alto, Crítico)
- Tratamientos naturales (caseros)
- Tratamientos químicos (comerciales)
- Medidas preventivas
- Recomendaciones urgentes

### Cómo Usar
```typescript
import PlantDiagnosisService from '@/lib/services/plant-diagnosis-service';

const service = new PlantDiagnosisService();

// Diagnosticar plagas
const diagnosis = await service.diagnosePestOrDisease(
  'file:///plant_photo.jpg',
  'Tomate',
  'plant_123'
);

console.log(`Tipo: ${diagnosis.name}`);
console.log(`Confianza: ${diagnosis.confidence}%`);
console.log(`Severidad: ${diagnosis.severity}`);
console.log(`Síntomas:`, diagnosis.symptoms);
console.log(`Tratamientos naturales:`, diagnosis.treatments.natural);
console.log(`Tratamientos químicos:`, diagnosis.treatments.chemical);

// Obtener recomendaciones personalizadas
const recommendations = await service.getTreatmentRecommendations(diagnosis);
```

### Tipos de Diagnóstico
```typescript
type DiagnosisType = 
  | 'pest'                    // Plagas (pulgones, ácaros, etc.)
  | 'disease'                 // Enfermedades (hongos, bacterias)
  | 'nutrient_deficiency'     // Deficiencias nutricionales
  | 'healthy';                // Planta saludable
```

### Severidad
```typescript
type Severity = 
  | 'low'      // Bajo - Monitorear
  | 'medium'   // Medio - Tratar pronto
  | 'high'     // Alto - Tratar inmediatamente
  | 'critical' // Crítico - Acción urgente
```

### Ejemplo de Respuesta
```json
{
  "type": "pest",
  "name": "Pulgones",
  "confidence": 92,
  "description": "Presencia de pulgones verdes en tallos y hojas",
  "symptoms": [
    "Hojas amarillentas",
    "Presencia de melaza",
    "Deformación de hojas nuevas",
    "Tallos pegajosos"
  ],
  "treatments": {
    "natural": [
      "Spray de agua con jabón",
      "Aceite de neem",
      "Infusión de ajo",
      "Introducir mariquitas"
    ],
    "chemical": [
      "Insecticida sistémico",
      "Piretroides",
      "Imidacloprid"
    ],
    "preventive": [
      "Inspeccionar regularmente",
      "Mantener humedad controlada",
      "Evitar exceso de nitrógeno",
      "Plantar plantas repelentes"
    ]
  },
  "severity": "high",
  "urgency": "Tratar dentro de 2-3 días",
  "affectedAreas": [
    "Tallos principales",
    "Hojas inferiores",
    "Puntas de crecimiento"
  ]
}
```

### Configuración del Servidor de IA
El servidor debe implementar:

```
POST /api/diagnose-plant
  Body: {
    image: base64_string,
    plantName: string,
    plantId: string,
    analysisType: 'pest_disease' | 'damage'
  }
  Response: DiagnosisResult

POST /api/analyze-growth
  Body: {
    plantId: string,
    plantName: string,
    photos: [{ date, image }]
  }
  Response: GrowthAnalysis

POST /api/treatment-recommendations
  Body: { diagnosis: DiagnosisResult }
  Response: { recommendations: string[] }
```

---

## 🔌 Integración con Servidor Backend

### Configuración Base
```typescript
// lib/services/plant-diagnosis-service.ts
const service = new PlantDiagnosisService('http://localhost:3000');
// o en producción:
const service = new PlantDiagnosisService('https://api.cuidatusplantas.com');
```

### Endpoints Requeridos
El backend debe implementar estos endpoints para todas las características:

| Endpoint | Método | Descripción |
|----------|--------|-------------|
| `/api/diagnose-plant` | POST | Diagnosticar plagas/enfermedades |
| `/api/analyze-growth` | POST | Analizar crecimiento de planta |
| `/api/treatment-recommendations` | POST | Obtener recomendaciones |
| `/api/auth/login` | POST | Autenticación de usuario |
| `/api/sync` | POST | Sincronizar datos |
| `/api/plants` | GET | Obtener plantas del usuario |
| `/api/plants` | POST | Crear nueva planta |

---

## 📱 Pantallas Nuevas

### 1. `app/pest-diagnosis.tsx`
Pantalla de diagnóstico de plagas y enfermedades con:
- Carga de imagen
- Análisis con IA
- Visualización de resultados
- Tratamientos y recomendaciones

### 2. `app/growth-analysis.tsx`
Pantalla de análisis de crecimiento con:
- Comparación de fotos
- Métricas de salud
- Tendencias de crecimiento
- Recomendaciones

### 3. `app/camera-capture.tsx`
Pantalla de captura de fotos con:
- Acceso a cámara
- Selección de galería
- Notas personalizadas
- Integración con diagnóstico

---

## 🧪 Testing de Características

### Pruebas Manuales
```bash
# 1. Probar cámara
- Abre la app en Expo Go
- Ve a "Mis Plantas"
- Selecciona una planta
- Toca "Agregar Foto"
- Captura una foto

# 2. Probar análisis de crecimiento
- Agrega 3+ fotos de la misma planta
- Ve a "Análisis de Crecimiento"
- Verifica métricas y recomendaciones

# 3. Probar diagnóstico de plagas
- Toma foto de planta con daño (o usa foto existente)
- Ve a "Diagnosticar Plagas"
- Verifica resultados y tratamientos

# 4. Probar sincronización
- Inicia sesión con cuenta
- Agrega plantas
- Sincroniza
- Verifica en otro dispositivo
```

---

## 🚀 Próximos Pasos

1. **Implementar servidor backend** con endpoints requeridos
2. **Integrar IA real** (PlantNet API, Clarifai, o modelo custom)
3. **Agregar más tipos de diagnóstico** (plagas específicas, enfermedades regionales)
4. **Crear dashboard de estadísticas** con gráficos de crecimiento
5. **Implementar notificaciones** para alertas de plagas
6. **Agregar comunidad** para compartir diagnósticos

---

## 📚 Referencias

- [Expo Camera Documentation](https://docs.expo.dev/versions/latest/sdk/camera/)
- [Expo Image Picker Documentation](https://docs.expo.dev/versions/latest/sdk/imagepicker/)
- [PlantNet API](https://www.plantnet.org/en/)
- [Clarifai API](https://www.clarifai.com/)

---

**Versión:** 1.2.0  
**Fecha:** 15 de mayo de 2026  
**Estado:** Listo para integración con backend
