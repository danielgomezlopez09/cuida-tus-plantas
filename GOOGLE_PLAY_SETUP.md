# Guía de Publicación en Google Play Store

## Paso 1: Generar Keystore (Clave de Firma)

La clave de firma es necesaria para firmar la APK antes de publicarla en Google Play Store.

```bash
# Generar keystore (ejecutar una sola vez)
keytool -genkey -v -keystore ~/cuida-tus-plantas-key.keystore \
  -keyalg RSA -keysize 2048 -validity 10000 \
  -alias cuida-tus-plantas-key \
  -storepass tu_contraseña \
  -keypass tu_contraseña \
  -dname "CN=Tu Nombre, O=Tu Organización, L=Tu Ciudad, ST=Tu Estado, C=MX"
```

**Importante**: Guarda esta clave en un lugar seguro. La necesitarás para futuras actualizaciones.

## Paso 2: Configurar Credenciales en app.config.ts

```typescript
// En app.config.ts, agregar:
const env = {
  // ... otras configuraciones
  // Para Google Play Store
  androidPackage: "com.tudominio.cuidatusplantas",
  iosBundleId: "com.tudominio.cuidatusplantas",
};
```

## Paso 3: Compilar APK Optimizada

### Opción A: Usar Expo (Recomendado)

```bash
# Requiere cuenta Expo
eas build --platform android --release
```

### Opción B: Compilar Localmente

```bash
# Preparar proyecto
expo prebuild --clean

# Compilar APK de release
cd android
./gradlew assembleRelease

# La APK estará en:
# android/app/build/outputs/apk/release/app-release.apk
```

## Paso 4: Firmar APK

```bash
# Firmar la APK con tu keystore
jarsigner -verbose -sigalg SHA1withRSA -digestalg SHA1 \
  -keystore ~/cuida-tus-plantas-key.keystore \
  app-release.apk cuida-tus-plantas-key

# Verificar firma
jarsigner -verify -verbose -certs app-release.apk
```

## Paso 5: Optimizar APK con zipalign

```bash
# Alinear APK para optimizar
zipalign -v 4 app-release.apk app-release-aligned.apk

# Usar la versión alineada
mv app-release-aligned.apk app-release.apk
```

## Paso 6: Crear Cuenta en Google Play Console

1. Ir a [Google Play Console](https://play.google.com/console)
2. Crear nueva cuenta de desarrollador ($25 USD de una sola vez)
3. Aceptar términos y condiciones
4. Completar información de perfil

## Paso 7: Crear Aplicación en Google Play Console

1. Click en "Crear aplicación"
2. Nombre: "Cuida tus Plantas"
3. Idioma predeterminado: Español
4. Categoría: Estilo de vida o Educación
5. Tipo de aplicación: Aplicación
6. Contenido para menores: No
7. Click en "Crear"

## Paso 8: Completar Información de la Aplicación

### 8.1 Detalles de la Aplicación
- **Nombre corto**: Cuida tus Plantas (máx 50 caracteres)
- **Descripción completa**: Ver sección "Textos para Google Play" abajo
- **Idiomas**: Español

### 8.2 Gráficos
Necesitas preparar:
- **Icono de la aplicación**: 512x512 px (PNG)
- **Capturas de pantalla**: Mínimo 2, máximo 8 (1080x1920 px)
- **Imagen de portada**: 1024x500 px (PNG o JPG)
- **Video promocional**: Opcional (YouTube URL)

### 8.3 Categorización
- **Categoría**: Estilo de vida
- **Clasificación de contenido**: Completar cuestionario
- **Audiencia objetivo**: Todos

## Paso 9: Configurar Precios y Distribución

1. **Precios y distribución**
   - Precio: Gratis
   - Países: Seleccionar todos o los deseados
   - Contenido para menores: No

2. **Consentimiento de datos**
   - Política de privacidad: [Tu URL de política]
   - Recopilar datos: Mínimo (solo AsyncStorage local)

## Paso 10: Subir APK

1. En Google Play Console, ir a "Versión" > "Producción"
2. Click en "Crear versión"
3. Subir APK firmada (app-release.apk)
4. Completar notas de lanzamiento:
   ```
   Versión 1.0.0
   
   ¡Bienvenido a Cuida tus Plantas!
   
   Características:
   - Catálogo de 20+ plantas
   - Información completa de cuidados
   - Búsqueda por nombre y tipo
   - Gestión de tu colección personal
   - Historial de cuidados
   - Consejos diarios
   ```

## Paso 11: Revisar y Publicar

1. Revisar toda la información
2. Aceptar políticas de contenido
3. Click en "Enviar para revisión"
4. Esperar 2-4 horas para revisión automática
5. Una vez aprobada, click en "Publicar"

---

## Textos para Google Play Store

### Título
```
Cuida tus Plantas - Guía Completa
```

### Descripción Corta (80 caracteres máx)
```
Guía completa de cuidados para todas tus plantas
```

### Descripción Completa
```
¡Bienvenido a Cuida tus Plantas! Tu asistente personal para el cuidado de plantas, árboles frutales, flores y más.

CARACTERÍSTICAS PRINCIPALES:

📚 Catálogo Completo
- Más de 20 plantas diferentes
- Plantas de interior, árboles frutales, flores, aromáticas y hortalizas
- Información detallada de cada especie

🌱 Información Completa de Cuidados
- Luz, riego, temperatura y humedad ideales
- Sustrato recomendado
- Frecuencia de riego
- Técnicas de poda y propagación

🐛 Control de Plagas y Enfermedades
- Plagas comunes para cada planta
- Métodos de control natural
- Opciones de tratamiento químico
- Prevención y soluciones

🌿 Guía de Fertilizantes
- Tipos de fertilizantes recomendados
- Frecuencia de aplicación
- Recetas caseras naturales
- Alternativas ecológicas

📱 Gestión Personal
- Agrega tus plantas a tu colección
- Registra cuidados realizados
- Historial de mantenimiento
- Consejos diarios

🔍 Búsqueda Inteligente
- Busca por nombre de planta
- Filtra por tipo (interior, frutal, floral, etc.)
- Encuentra información rápidamente

PERFECTO PARA:
- Principiantes en jardinería
- Amantes de las plantas
- Dueños de huertos caseros
- Personas con plantas de interior

¡Descarga Cuida tus Plantas y conviértete en un experto en el cuidado de tus plantas!

Desarrollado con ❤️ para amantes de las plantas.
```

### Notas de Lanzamiento
```
Versión 1.0.0 - Lanzamiento Inicial

✨ Características:
- Catálogo de 20+ plantas
- Información completa de cuidados
- Búsqueda y filtros
- Gestión de colección personal
- Historial de cuidados
- Consejos diarios

🎨 Interfaz amigable y fácil de usar
📱 Optimizado para móviles
🌍 Completamente en español

¡Gracias por usar Cuida tus Plantas!
```

---

## Checklist Final Antes de Publicar

- [ ] APK compilada y firmada correctamente
- [ ] Versión de APK es 1.0.0 o superior
- [ ] Icono de aplicación 512x512 px
- [ ] Mínimo 2 capturas de pantalla (1080x1920 px)
- [ ] Descripción completa escrita
- [ ] Política de privacidad preparada
- [ ] Clasificación de contenido completada
- [ ] Precio establecido como "Gratis"
- [ ] Países de distribución seleccionados
- [ ] Notas de lanzamiento escritas
- [ ] Toda la información revisada

---

## Requisitos Técnicos

- **Versión mínima de Android**: 7.0 (API 24)
- **Versión objetivo de Android**: 14 (API 34)
- **Tamaño de APK**: ~50-100 MB
- **Arquitecturas**: armeabi-v7a, arm64-v8a

---

## Después de la Publicación

### Monitoreo
- Revisar comentarios y calificaciones diariamente
- Responder a preguntas de usuarios
- Reportar bugs encontrados

### Actualizaciones
- Mantener la aplicación actualizada
- Agregar nuevas plantas regularmente
- Mejorar funcionalidades basado en feedback

### Promoción
- Compartir en redes sociales
- Pedir a usuarios que dejen reseñas
- Colaborar con blogs de jardinería

---

## Solución de Problemas

### Error: "Certificado no válido"
```bash
# Verificar certificado
keytool -list -v -keystore ~/cuida-tus-plantas-key.keystore
```

### Error: "APK no está firmada"
```bash
# Firmar nuevamente
jarsigner -verbose -sigalg SHA1withRSA -digestalg SHA1 \
  -keystore ~/cuida-tus-plantas-key.keystore \
  app-release.apk cuida-tus-plantas-key
```

### Error: "Versión de código es menor"
- Incrementar `versionCode` en `app.config.ts`
- Compilar nuevamente

---

## Contacto y Soporte

Para preguntas sobre la publicación:
- Documentación de Expo: https://docs.expo.dev/build/setup/
- Google Play Console Help: https://support.google.com/googleplay/android-developer/
- Comunidad Expo: https://forums.expo.dev/
