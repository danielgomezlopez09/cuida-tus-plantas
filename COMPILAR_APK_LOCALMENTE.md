# Guía: Compilar APK Localmente

Debido a limitaciones de recursos en el sandbox, te proporcionamos esta guía para compilar la APK en tu máquina local.

## Opción 1: Usar Expo Cloud Build (Recomendado - Sin Instalaciones Locales)

### Ventajas
- ✅ No requiere instalar Android SDK
- ✅ No requiere Java
- ✅ Compilación en servidores de Expo
- ✅ Más rápido y confiable
- ✅ Perfecto para principiantes

### Pasos

1. **Crear Cuenta Expo**
   ```bash
   # Si no tienes cuenta
   npx eas-cli auth:login
   # O crear en: https://expo.dev/signup
   ```

2. **Instalar EAS CLI**
   ```bash
   npm install -g eas-cli
   # O
   pnpm add -g eas-cli
   ```

3. **Configurar Proyecto**
   ```bash
   cd ~/cuida-tus-plantas
   eas build:configure
   # Seleccionar: Android
   ```

4. **Compilar APK**
   ```bash
   eas build --platform android --release
   # Esperar a que complete (5-15 minutos)
   ```

5. **Descargar APK**
   - Ir a: https://expo.dev/builds
   - Descargar APK cuando esté lista
   - O usar: `eas build:list` para ver historial

---

## Opción 2: Compilar Localmente (Requiere Instalaciones)

### Requisitos Previos

**En Windows:**
```bash
# Instalar Java Development Kit (JDK) 11+
# Descargar desde: https://www.oracle.com/java/technologies/downloads/

# Instalar Android SDK
# Descargar Android Studio: https://developer.android.com/studio

# Configurar variables de entorno
set JAVA_HOME=C:\Program Files\Java\jdk-11
set ANDROID_HOME=C:\Users\%USERNAME%\AppData\Local\Android\sdk
```

**En macOS:**
```bash
# Instalar Java
brew install openjdk@11
export JAVA_HOME=$(/usr/libexec/java_home -v 11)

# Instalar Android SDK
brew install android-sdk
export ANDROID_HOME=/usr/local/share/android-sdk
```

**En Linux:**
```bash
# Instalar Java
sudo apt-get install openjdk-11-jdk
export JAVA_HOME=/usr/lib/jvm/java-11-openjdk-amd64

# Instalar Android SDK
# Descargar desde: https://developer.android.com/studio
export ANDROID_HOME=$HOME/Android/Sdk
```

### Compilación

1. **Clonar/Descargar Proyecto**
   ```bash
   cd ~/cuida-tus-plantas
   ```

2. **Instalar Dependencias**
   ```bash
   pnpm install
   ```

3. **Generar Estructura Nativa**
   ```bash
   npx expo prebuild --clean
   ```

4. **Compilar APK**
   ```bash
   cd android
   ./gradlew assembleRelease
   # En Windows: gradlew.bat assembleRelease
   ```

5. **Encontrar APK**
   ```bash
   # La APK estará en:
   android/app/build/outputs/apk/release/app-release.apk
   ```

---

## Opción 3: Usar Script Automático (Si Tienes Requisitos)

```bash
cd ~/cuida-tus-plantas
chmod +x build-apk.sh
./build-apk.sh
# En Windows: bash build-apk.sh
```

---

## Verificar Compilación

### Verificar que APK Existe
```bash
ls -lh android/app/build/outputs/apk/release/app-release.apk
# Debería mostrar tamaño ~50-100 MB
```

### Instalar en Dispositivo
```bash
# Conectar dispositivo Android con USB
adb devices

# Instalar APK
adb install -r android/app/build/outputs/apk/release/app-release.apk

# O en emulador
adb -e install -r android/app/build/outputs/apk/release/app-release.apk
```

### Instalar desde Archivo
- Transferir `app-release.apk` a tu teléfono
- Abrir archivo con gestor de archivos
- Tocar para instalar
- Permitir instalación de fuentes desconocidas si es necesario

---

## Solución de Problemas

### Error: "Java not found"
```bash
# Verificar Java
java -version

# Si no está instalado, descargar desde:
# https://www.oracle.com/java/technologies/downloads/
```

### Error: "Android SDK not found"
```bash
# Configurar ANDROID_HOME
# Windows: set ANDROID_HOME=C:\Users\...\AppData\Local\Android\sdk
# macOS/Linux: export ANDROID_HOME=$HOME/Android/Sdk
```

### Error: "Gradle build failed"
```bash
# Limpiar y reintentar
cd android
./gradlew clean
./gradlew assembleRelease
```

### Error: "APK no está firmada"
```bash
# Verificar keystore
keytool -list -v -keystore ~/cuida-tus-plantas.keystore

# Si está dañado, regenerar:
# Ver GOOGLE_PLAY_SETUP.md
```

---

## Después de Compilar

### Testing en Dispositivo
1. Instalar APK
2. Abrir app
3. Verificar que todas las pantallas funcionan
4. Probar agregar plantas
5. Probar búsqueda
6. Verificar almacenamiento de datos

### Preparar para Google Play
1. Verificar que APK funciona correctamente
2. Crear cuenta en Google Play Console
3. Subir APK a consola
4. Completar información de la app
5. Enviar para revisión

Ver `PUBLISH_TO_GOOGLE_PLAY.md` para instrucciones completas.

---

## Comparación de Opciones

| Opción | Ventajas | Desventajas | Tiempo |
|--------|----------|------------|--------|
| Expo Cloud Build | Fácil, sin instalaciones, confiable | Requiere cuenta Expo | 10-15 min |
| Compilación Local | Control total, gratis | Requiere instalaciones | 15-30 min |
| Script Automático | Automatizado | Requiere requisitos locales | 15-30 min |

**Recomendación**: Usa **Expo Cloud Build** para la primera vez. Es más fácil y no requiere instalaciones.

---

## Recursos Útiles

- [Expo Cloud Build](https://docs.expo.dev/build/setup/)
- [Android Studio](https://developer.android.com/studio)
- [Java Development Kit](https://www.oracle.com/java/technologies/downloads/)
- [Gradle Documentation](https://gradle.org/guides/)

---

**¡Éxito compilando tu APK!** 🚀

Si tienes problemas, consulta los documentos incluidos en el proyecto.
