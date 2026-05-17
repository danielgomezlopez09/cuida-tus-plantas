# 📱 Guía: Descargar y Probar la APK de Cuida tus Plantas

## Opción 1: Probar en Expo Go (Más Rápido - 2 minutos)

### Paso 1: Instalar Expo Go
- **Android**: Descarga desde Google Play Store
- **iOS**: Descarga desde App Store

### Paso 2: Abrir la App
1. Abre Expo Go en tu dispositivo
2. Escanea el código QR que aparece en la pantalla de Metro
3. ¡La app se cargará automáticamente!

**Ventajas**: Instantáneo, sin compilación, perfecto para testing rápido
**Desventajas**: Solo funciona mientras el servidor de desarrollo está activo

---

## Opción 2: Compilar APK (Recomendado - 20-30 minutos)

### Requisitos Previos
- **Android Studio** instalado (incluye Android SDK)
- **Java Development Kit (JDK)** versión 11 o superior
- **Node.js** y **pnpm** instalados
- Mínimo 5GB de espacio en disco

### Paso 1: Preparar el Entorno

```bash
# Instalar Node.js (si no lo tienes)
curl -fsSL https://deb.nodesource.com/setup_lts.x | sudo -E bash -
sudo apt-get install -y nodejs

# Instalar pnpm
npm install -g pnpm

# Instalar Android Studio y SDK
# Descarga desde: https://developer.android.com/studio
```

### Paso 2: Compilar la APK

```bash
# Navegar al proyecto
cd /home/ubuntu/cuida-tus-plantas

# Ejecutar el script de compilación
./build-apk-release.sh
```

El proceso incluye:
1. Limpieza de compilaciones anteriores
2. Instalación de dependencias
3. Generación de estructura nativa de Android
4. Compilación de APK de release

**Tiempo estimado**: 20-30 minutos (depende de tu conexión y velocidad de compilación)

### Paso 3: Descargar la APK

Una vez compilada, la APK estará en:
```
/home/ubuntu/Downloads/cuida-tus-plantas-release.apk
```

---

## Opción 3: Usar Expo Cloud Build (Más Fácil)

### Paso 1: Crear Cuenta en Expo
1. Ve a https://expo.dev
2. Crea una cuenta gratuita
3. Inicia sesión en tu terminal:
   ```bash
   npx expo login
   ```

### Paso 2: Compilar en la Nube
```bash
cd /home/ubuntu/cuida-tus-plantas
npx eas build --platform android --profile preview
```

### Paso 3: Descargar
- Expo compilará en la nube
- Recibirás un enlace para descargar la APK
- No necesitas Android Studio instalado

**Ventajas**: No necesitas herramientas locales, compilación en la nube
**Desventajas**: Requiere cuenta de Expo, más lento

---

## Instalación en Dispositivo Android

### Paso 1: Transferir APK
- **Opción A**: Descarga directamente en tu dispositivo
- **Opción B**: Usa ADB (Android Debug Bridge):
  ```bash
  adb install /home/ubuntu/Downloads/cuida-tus-plantas-release.apk
  ```

### Paso 2: Permitir Instalación desde Fuentes Desconocidas
1. Ve a Configuración → Seguridad
2. Activa "Instalar apps de fuentes desconocidas"
3. O permite cuando el sistema te lo pida

### Paso 3: Instalar
1. Abre el archivo APK
2. Toca "Instalar"
3. Espera a que se complete
4. Toca "Abrir" para lanzar la app

---

## Checklist de Testing

Antes de publicar en Google Play Store, verifica:

### Funcionalidades Principales
- [ ] **Pantalla de Inicio**: Se carga correctamente
- [ ] **Explorador de Plantas**: Búsqueda por nombre funciona
- [ ] **Detalle de Planta**: Muestra información completa
- [ ] **Mis Plantas**: Agregar y eliminar plantas funciona
- [ ] **Juego**: Seleccionar semilla y cuidarla funciona

### Diagnóstico de Plagas
- [ ] **Pantalla de Diagnóstico**: Se carga sin errores
- [ ] **Configuración de API Key**: Puedes guardar tu API key de PlantNet
- [ ] **Historial**: Se guardan los diagnósticos
- [ ] **Exportación**: Puedes exportar reportes PDF

### Sincronización
- [ ] **Configuración de Sync**: Puedes habilitar/deshabilitar
- [ ] **Sincronización Manual**: El botón funciona
- [ ] **Estado**: Muestra último sync correctamente

### Rendimiento
- [ ] **Velocidad**: La app responde rápidamente
- [ ] **Memoria**: No hay fugas de memoria
- [ ] **Batería**: No consume batería excesivamente
- [ ] **Conexión**: Funciona con WiFi y datos móviles

### Compatibilidad
- [ ] **Android 7+**: Funciona en versiones antiguas
- [ ] **Pantallas**: Se ve bien en diferentes tamaños
- [ ] **Orientación**: Funciona en vertical y horizontal
- [ ] **Temas**: Funciona en modo claro y oscuro

---

## Solución de Problemas

### "APK no se instala"
- Desinstala versiones anteriores primero
- Verifica que tienes suficiente espacio
- Intenta instalar con ADB:
  ```bash
  adb install -r cuida-tus-plantas-release.apk
  ```

### "La app se cierra al abrir"
- Verifica que tienes Android 7 o superior
- Limpia la caché de la app en Configuración
- Reinstala la app

### "Las plantas no se guardan"
- Verifica que la app tiene permiso de almacenamiento
- Intenta limpiar datos de la app
- Reinstala la app

### "El diagnóstico no funciona"
- Verifica tu conexión a internet
- Configura tu API key de PlantNet en Configuración
- Verifica que la imagen es clara y de buena calidad

---

## Publicar en Google Play Store

Una vez que hayas testeado y verificado todo:

1. **Crear Cuenta de Desarrollador**: https://play.google.com/console
2. **Crear Aplicación**: Proporciona nombre, descripción, categoría
3. **Cargar APK**: Sube el archivo compilado
4. **Completar Información**: Agrega descripción, capturas, política de privacidad
5. **Enviar para Revisión**: Google revisa en 24-48 horas
6. **Publicar**: Una vez aprobada, aparece en Play Store

**Costo**: $25 USD (pago único)

---

## Contacto y Soporte

Si encuentras problemas:
1. Verifica los logs: `adb logcat`
2. Consulta la documentación de Expo: https://docs.expo.dev
3. Abre un issue en GitHub si es necesario

¡Buena suerte con tu app! 🌿
