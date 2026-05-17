# 🌿 Configuración de PlantNet API

## ¿Qué es PlantNet?

PlantNet es una plataforma de identificación de plantas basada en IA que permite identificar plantas, plagas y enfermedades a partir de fotos. Es gratuita y muy precisa (85%+ de exactitud).

**Sitio web**: https://plantnet.org/

## Paso 1: Registrarse en PlantNet

1. Visita https://plantnet.org/
2. Haz clic en "API" o ve a https://my.plantnet.org/
3. Crea una cuenta (puedes usar email o Google)
4. Verifica tu email

## Paso 2: Obtener API Key

1. Inicia sesión en https://my.plantnet.org/
2. Ve a la sección "API Keys" o "Configuración"
3. Crea una nueva API key
4. Copia la clave (la necesitarás en el siguiente paso)

## Paso 3: Configurar en la App

### Opción A: Variables de Entorno (Recomendado)

1. Crea un archivo `.env` en la raíz del proyecto:
```bash
PLANTNET_API_KEY=tu_api_key_aqui
PLANTNET_API_URL=https://plantnet.org/api/v2
```

2. Actualiza `app.config.ts` para cargar las variables:
```typescript
const env = {
  appName: "Cuida tus Plantas",
  appSlug: "cuida-tus-plantas",
  logoUrl: "",
  scheme: schemeFromBundleId,
  iosBundleId: bundleId,
  androidPackage: bundleId,
  plantnetApiKey: process.env.PLANTNET_API_KEY,
  plantnetApiUrl: process.env.PLANTNET_API_URL,
};
```

### Opción B: Configuración Directa

Edita `/lib/services/plantnet-service.ts` y reemplaza:

```typescript
const PLANTNET_API_KEY = 'tu_api_key_aqui';
const PLANTNET_API_URL = 'https://plantnet.org/api/v2';
```

## Paso 4: Usar la API en la App

El servicio ya está configurado. Solo necesitas:

```typescript
import { analyzePlantImage } from '@/lib/services/plantnet-service';

// Analizar una imagen
const results = await analyzePlantImage(imageUri);

// results contiene:
// - results.plants: Array de plantas identificadas
// - results.pests: Array de plagas detectadas
// - results.diseases: Array de enfermedades detectadas
// - results.confidence: Confianza general (0-1)
```

## Límites de la API (Gratis)

- **Llamadas por día**: 500
- **Llamadas por minuto**: 10
- **Tamaño máximo de imagen**: 10 MB
- **Formatos soportados**: JPG, PNG, JPEG

## Respuesta de la API

La API retorna un objeto con esta estructura:

```json
{
  "results": [
    {
      "score": 0.85,
      "species": {
        "scientificName": "Rosa damascena",
        "commonNames": ["Rosa Damascena", "Rosa de Damasco"]
      },
      "gbif": {
        "id": 3887
      }
    }
  ],
  "query": {
    "project": "all",
    "includeClosedLeaves": false
  }
}
```

## Integración en la Pantalla de Diagnóstico

La pantalla `/app/pest-diagnosis.tsx` ya está preparada para usar la API:

1. Usuario toma foto o selecciona de galería
2. Se envía a PlantNet API
3. Se reciben resultados de plantas identificadas
4. Se buscan plagas/enfermedades asociadas
5. Se muestran tratamientos recomendados

## Solución de Problemas

### Error: "API Key inválida"
- Verifica que copiaste la clave correctamente
- Asegúrate de que la clave está activa en PlantNet

### Error: "Límite de llamadas excedido"
- Espera a que se reinicie el contador (cada 24 horas)
- Considera un plan de pago para más llamadas

### Error: "Imagen no procesada"
- La imagen debe ser clara y mostrar la planta
- Asegúrate de que el tamaño es menor a 10 MB
- Intenta con una foto diferente

### Error: "No se identificó la planta"
- La planta puede ser muy rara o la foto de mala calidad
- Intenta con una foto más clara
- Asegúrate de que la planta es visible

## Mejores Prácticas

1. **Fotos de calidad**: Usa luz natural, evita sombras
2. **Enfoque**: Asegúrate de que la planta esté enfocada
3. **Ángulo**: Toma fotos desde diferentes ángulos
4. **Contexto**: Incluye hojas, flores o frutos si es posible
5. **Tamaño**: No hagas zoom excesivo

## Documentación Oficial

- API Docs: https://plantnet.org/pages/api/
- GitHub: https://github.com/plantnet/
- Ejemplos: https://plantnet.org/pages/api-examples/

## Próximos Pasos

1. Registrarse en PlantNet
2. Obtener API key
3. Configurar en la app
4. Probar con fotos de plantas
5. Ajustar tratamientos según resultados

## Soporte

Si tienes problemas:
- Contacta a PlantNet: support@plantnet.org
- Revisa la documentación oficial
- Prueba con fotos de ejemplo
