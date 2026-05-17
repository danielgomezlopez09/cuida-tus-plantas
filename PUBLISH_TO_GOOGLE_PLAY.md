# Guía Completa: Publicar en Google Play Store

## Índice
1. [Requisitos Previos](#requisitos-previos)
2. [Paso 1: Preparar Certificados](#paso-1-preparar-certificados)
3. [Paso 2: Compilar APK](#paso-2-compilar-apk)
4. [Paso 3: Testing](#paso-3-testing)
5. [Paso 4: Crear Cuenta en Google Play](#paso-4-crear-cuenta-en-google-play)
6. [Paso 5: Crear Aplicación](#paso-5-crear-aplicación)
7. [Paso 6: Completar Información](#paso-6-completar-información)
8. [Paso 7: Subir APK](#paso-7-subir-apk)
9. [Paso 8: Publicar](#paso-8-publicar)
10. [Paso 9: Después de Publicar](#paso-9-después-de-publicar)

---

## Requisitos Previos

Asegúrate de tener:
- ✅ Java Development Kit (JDK) 11+
- ✅ Android SDK
- ✅ Gradle
- ✅ Node.js y pnpm
- ✅ Expo CLI
- ✅ Cuenta Google (para Google Play)
- ✅ Tarjeta de crédito ($25 USD de una sola vez)

### Verificar Instalación

```bash
# Verificar Java
java -version

# Verificar Android SDK
echo $ANDROID_HOME

# Verificar Node.js
node --version

# Verificar pnpm
pnpm --version
```

---

## Paso 1: Preparar Certificados

### 1.1 Generar Keystore (Ya Completado)

El keystore ya fue generado en:
```
~/cuida-tus-plantas.keystore
```

**Credenciales:**
- Contraseña del store: `CuidaTusPlantas2026!`
- Alias de clave: `cuida-tus-plantas`
- Contraseña de clave: `CuidaTusPlantas2026!`

### 1.2 Guardar Keystore de Forma Segura

```bash
# Copiar a ubicación segura
cp ~/cuida-tus-plantas.keystore ~/backup/cuida-tus-plantas.keystore

# Hacer backup en nube (recomendado)
# Usar Google Drive, Dropbox, o similar
```

**⚠️ IMPORTANTE**: Guarda esta clave en un lugar seguro. La necesitarás para:
- Futuras actualizaciones
- Recuperación de cuenta
- Firma de nuevas versiones

### 1.3 Verificar Keystore

```bash
keytool -list -v -keystore ~/cuida-tus-plantas.keystore \
  -storepass "CuidaTusPlantas2026!" \
  -keypass "CuidaTusPlantas2026!"
```

Deberías ver:
```
Alias name: cuida-tus-plantas
Creation date: [fecha]
Entry type: PrivateKeyEntry
Certificate fingerprint (SHA-256): [fingerprint]
```

---

## Paso 2: Compilar APK

### 2.1 Preparar Proyecto

```bash
cd ~/cuida-tus-plantas

# Verificar que todo está actualizado
pnpm install

# Limpiar compilaciones anteriores
rm -rf android/app/build
rm -rf dist
```

### 2.2 Generar Archivos Nativos

```bash
# Generar estructura de Android
expo prebuild --clean --no-install

# Esto crea la carpeta android/ con toda la configuración
```

### 2.3 Compilar APK

**Opción A: Usar el Script (Recomendado)**

```bash
# El script maneja todo automáticamente
./build-apk.sh

# Esperar a que complete (puede tomar 5-15 minutos)
```

**Opción B: Manual**

```bash
cd android

# Limpiar
./gradlew clean

# Compilar
./gradlew assembleRelease

# Esperar a que complete
cd ..
```

### 2.4 Verificar APK

```bash
# Verificar que la APK fue creada
ls -lh android/app/build/outputs/apk/release/app-release.apk

# Debería mostrar algo como:
# -rw-r--r-- 1 ubuntu ubuntu 65M May 15 16:30 app-release.apk
```

---

## Paso 3: Testing

### 3.1 Testing Local

Antes de publicar, prueba la APK:

```bash
# Instalar en dispositivo conectado
adb install -r android/app/build/outputs/apk/release/app-release.apk

# O instalar en emulador
adb -e install -r android/app/build/outputs/apk/release/app-release.apk
```

### 3.2 Checklist de Testing

Revisa `TESTING_GUIDE.md` para lista completa.

**Pruebas Críticas:**
- [ ] App abre sin crashes
- [ ] Todas las pantallas funcionan
- [ ] Datos se guardan correctamente
- [ ] Navegación es fluida
- [ ] Información es correcta

### 3.3 Reportar Problemas

Si encuentras problemas:
1. Anota el error exacto
2. Toma screenshot
3. Anota pasos para reproducir
4. Corrige en el código
5. Recompila y prueba nuevamente

---

## Paso 4: Crear Cuenta en Google Play

### 4.1 Ir a Google Play Console

1. Abre https://play.google.com/console
2. Click en "Crear cuenta" o inicia sesión

### 4.2 Completar Registro

1. **Información Personal**
   - Nombre completo
   - Dirección
   - País
   - Teléfono

2. **Información de Pago**
   - Tarjeta de crédito/débito
   - Monto: $25 USD (de una sola vez)
   - Aceptar términos

3. **Información de Desarrollador**
   - Nombre del desarrollador
   - Email de contacto
   - Sitio web (opcional)

### 4.3 Verificación

Google verificará tu información (puede tomar 24-48 horas).

---

## Paso 5: Crear Aplicación

### 5.1 En Google Play Console

1. Click en "Crear aplicación"
2. Completa el formulario:

```
Nombre de la aplicación: Cuida tus Plantas
Idioma predeterminado: Español
Categoría: Estilo de vida
Tipo de aplicación: Aplicación
Contenido para menores: No
Aceptar términos: ✓
```

3. Click en "Crear"

### 5.2 Configuración Inicial

Se te llevará a la página de configuración de la aplicación.

---

## Paso 6: Completar Información

### 6.1 Información de la Aplicación

En la sección "Información de la aplicación":

1. **Nombre corto** (máx 50 caracteres)
   ```
   Cuida tus Plantas
   ```

2. **Descripción** (máx 4000 caracteres)
   - Ver `GOOGLE_PLAY_DESCRIPTION.md`
   - Copiar descripción completa

3. **Idiomas**
   - Seleccionar: Español

### 6.2 Gráficos

En la sección "Gráficos":

1. **Icono de la aplicación** (512x512 px)
   - Usar: `assets/images/icon.png`
   - Subir PNG

2. **Capturas de pantalla** (1080x1920 px)
   - Mínimo 2, máximo 8
   - Recomendado: 5-6 capturas
   - Mostrar diferentes pantallas
   - Incluir texto descriptivo

3. **Imagen de portada** (1024x500 px)
   - Imagen atractiva de la app
   - PNG o JPG

4. **Video promocional** (Opcional)
   - URL de YouTube
   - 15-30 segundos
   - Demo de características

### 6.3 Clasificación de Contenido

1. Click en "Cuestionario de clasificación"
2. Responder preguntas:
   - Violencia: **No**
   - Contenido sexual: **No**
   - Lenguaje inapropiado: **No**
   - Alcohol/Tabaco/Drogas: **No**
   - Contenido aterrador: **No**
   - Información financiera: **No**
   - Ubicación: **No**
   - Contactos: **No**
   - Calendario: **No**
   - Cámara: **Sí**
   - Micrófono: **No**
   - ID de dispositivo: **Sí**
   - Archivos: **Sí**

3. Click en "Guardar"

### 6.4 Categorización

1. **Categoría principal**: Estilo de vida
2. **Categoría secundaria**: Educación
3. **Audiencia objetivo**: Todos
4. **Edad mínima**: 3+

### 6.5 Política de Privacidad

1. Click en "Política de privacidad"
2. Copiar contenido de `PRIVACY_POLICY.md`
3. Crear página web o documento
4. Pegar URL o contenido

### 6.6 Términos de Servicio

1. Click en "Términos de servicio"
2. Copiar contenido de `TERMS_OF_SERVICE.md`
3. Crear página web o documento
4. Pegar URL o contenido

### 6.7 Precios y Distribución

1. **Precio**: Gratis
2. **Países**: Seleccionar todos o los deseados
3. **Contenido para menores**: No
4. **Aceptar políticas**: ✓

---

## Paso 7: Subir APK

### 7.1 Preparar APK

```bash
# Verificar que la APK existe
ls -lh android/app/build/outputs/apk/release/app-release.apk

# Copiar a ubicación accesible
cp android/app/build/outputs/apk/release/app-release.apk ~/app-release.apk
```

### 7.2 En Google Play Console

1. Click en "Versión" en el menú izquierdo
2. Click en "Producción"
3. Click en "Crear versión"

### 7.3 Subir APK

1. Click en "Subir APK"
2. Seleccionar archivo: `app-release.apk`
3. Esperar a que suba (puede tomar 1-2 minutos)
4. Verificar que se subió correctamente

### 7.4 Notas de Lanzamiento

En "Notas de lanzamiento (para esta versión)":

```
Versión 1.0.0 - Lanzamiento Inicial

✨ Características:
- Catálogo de 20+ plantas
- Información completa de cuidados
- Búsqueda y filtros
- Gestión de colección personal
- Historial de cuidados
- Consejos diarios

🎨 Interfaz amigable
📱 Optimizado para móviles
🌍 Completamente en español

¡Gracias por usar Cuida tus Plantas!
```

---

## Paso 8: Publicar

### 8.1 Revisar Información

Antes de publicar, verifica:

- [ ] Nombre de la app es correcto
- [ ] Descripción es completa
- [ ] Icono se ve bien
- [ ] Capturas de pantalla son claras
- [ ] Política de privacidad está completa
- [ ] Términos de servicio están completos
- [ ] Clasificación de contenido es correcta
- [ ] APK se subió correctamente
- [ ] Notas de lanzamiento están escritas

### 8.2 Enviar para Revisión

1. Click en "Revisar"
2. Verificar que no hay errores
3. Click en "Enviar para revisión"
4. Aceptar términos
5. Click en "Enviar"

### 8.3 Esperar Revisión

Google Play revisa automáticamente:
- **Tiempo**: 2-4 horas típicamente
- **Criterios**: Seguridad, contenido, funcionalidad
- **Resultado**: Email de aprobación o rechazo

### 8.4 Publicar

Una vez aprobada:

1. Vuelve a Google Play Console
2. Click en "Publicar"
3. Confirmar publicación
4. ¡Listo! Tu app está en Google Play Store

---

## Paso 9: Después de Publicar

### 9.1 Monitoreo

**Diariamente:**
- [ ] Revisar comentarios de usuarios
- [ ] Responder preguntas
- [ ] Reportar bugs encontrados

**Semanalmente:**
- [ ] Revisar calificaciones
- [ ] Analizar estadísticas de descargas
- [ ] Revisar crashes reportados

### 9.2 Actualizar Información

Si necesitas cambiar:
- Descripción
- Capturas de pantalla
- Política de privacidad
- Términos de servicio

Simplemente edita en Google Play Console.

### 9.3 Actualizar Aplicación

Para publicar una nueva versión:

1. Incrementar `versionCode` en `app.config.ts`
2. Actualizar `version` si es cambio mayor
3. Recompilar APK
4. Subir nueva APK a Google Play Console
5. Escribir notas de lanzamiento
6. Enviar para revisión

### 9.4 Promoción

Para aumentar descargas:

- **Redes Sociales**: Compartir en Instagram, Facebook, TikTok
- **Comunidades**: Publicar en foros de jardinería
- **Blogs**: Contactar blogs de plantas y jardinería
- **Reseñas**: Pedir a usuarios que dejen reseñas
- **Sitio Web**: Crear sitio web con información

### 9.5 Análisis

En Google Play Console, revisa:

- **Descargas**: Número total y tendencia
- **Usuarios activos**: Cuántos usan la app
- **Calificación**: Promedio de estrellas
- **Retención**: Cuántos vuelven a usar
- **Crashes**: Errores reportados
- **Geografía**: Dónde descargan más

---

## Solución de Problemas

### Problema: "APK no está firmada"

**Solución:**
```bash
# Firmar APK manualmente
jarsigner -verbose -sigalg SHA1withRSA -digestalg SHA1 \
  -keystore ~/cuida-tus-plantas.keystore \
  -storepass "CuidaTusPlantas2026!" \
  -keypass "CuidaTusPlantas2026!" \
  app-release.apk cuida-tus-plantas
```

### Problema: "Versión de código es menor"

**Solución:**
1. Abrir `app.config.ts`
2. Incrementar `versionCode` en `android`
3. Recompilar APK

### Problema: "Certificado no válido"

**Solución:**
```bash
# Verificar certificado
keytool -list -v -keystore ~/cuida-tus-plantas.keystore

# Si está dañado, generar nuevo:
keytool -genkey -v -keystore ~/cuida-tus-plantas.keystore ...
```

### Problema: "Google Play rechaza APK"

**Causas comunes:**
- Malware detectado (falso positivo)
- Contenido inapropiado
- Violación de políticas
- Permisos no justificados

**Solución:**
1. Revisar email de rechazo
2. Corregir problema
3. Recompilar APK
4. Subir nueva versión

### Problema: "Publicación está en revisión"

**Solución:**
- Esperar 2-4 horas
- No subir nuevas versiones durante revisión
- Revisar email para actualizaciones

---

## Checklist Final

Antes de publicar, verifica:

### Código
- [ ] Sin errores de TypeScript
- [ ] Sin warnings de consola
- [ ] Código limpio y documentado
- [ ] Versión correcta en `app.config.ts`

### Compilación
- [ ] APK compila sin errores
- [ ] APK está firmada
- [ ] APK está optimizada
- [ ] Tamaño es razonable (< 100 MB)

### Testing
- [ ] Probado en múltiples dispositivos
- [ ] Probado en diferentes versiones de Android
- [ ] Todas las funciones funcionan
- [ ] Sin crashes
- [ ] Datos se guardan correctamente

### Documentación
- [ ] Política de privacidad completa
- [ ] Términos de servicio completos
- [ ] Descripción de Google Play escrita
- [ ] Notas de lanzamiento escritas
- [ ] Capturas de pantalla preparadas

### Google Play Console
- [ ] Información de la app completa
- [ ] Gráficos subidos
- [ ] Clasificación de contenido completa
- [ ] Precios y distribución configurados
- [ ] APK subida correctamente

---

## Próximos Pasos

Después de publicar:

1. **Monitorear**: Revisar comentarios y calificaciones
2. **Responder**: Contestar preguntas de usuarios
3. **Mejorar**: Agregar características basado en feedback
4. **Actualizar**: Mantener app actualizada
5. **Promover**: Compartir en redes sociales
6. **Expandir**: Agregar más plantas a la base de datos

---

## Recursos Útiles

- [Google Play Console](https://play.google.com/console)
- [Documentación de Expo](https://docs.expo.dev/)
- [Guía de Publicación de Google](https://support.google.com/googleplay/android-developer/)
- [Políticas de Google Play](https://play.google.com/about/developer-content-policy/)

---

**Última actualización**: 15 de mayo de 2026

**¡Felicidades! Tu aplicación está lista para Google Play Store.**
