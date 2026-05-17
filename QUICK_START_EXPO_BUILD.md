# ⚡ Guía Rápida: Expo Cloud Build en 5 Minutos

## Resumen de Pasos

```bash
# 1. Instalar herramienta EAS
npm install -g eas-cli

# 2. Conectar a tu cuenta Expo
eas login

# 3. Configurar el proyecto
eas build:configure

# 4. Compilar APK en la nube
eas build --platform android

# 5. Descargar desde https://expo.dev/builds
```

## Instrucciones Detalladas

### 1️⃣ Crear Cuenta Expo (si no la tienes)
- Ve a https://expo.dev
- Haz clic en "Sign Up"
- Completa el formulario y verifica tu email

### 2️⃣ Instalar EAS CLI
Abre terminal/PowerShell en tu computadora y ejecuta:
```bash
npm install -g eas-cli
```

### 3️⃣ Descargar el Proyecto
```bash
# Descarga el archivo ZIP del checkpoint
# Extrae la carpeta "cuida-tus-plantas"
cd cuida-tus-plantas
```

### 4️⃣ Conectar a Expo
```bash
eas login
```
Ingresa tu email y contraseña de Expo

### 5️⃣ Configurar el Proyecto
```bash
eas build:configure
```
Selecciona:
- Platform: **Android**
- Build type: **APK**

### 6️⃣ Compilar
```bash
eas build --platform android
```

**Espera 15-20 minutos** mientras Expo compila tu APK en la nube.

### 7️⃣ Descargar
1. Abre https://expo.dev/builds
2. Busca tu build "Cuida tus Plantas"
3. Haz clic en "Download"
4. ¡Listo! Tienes tu APK

## ✅ Verificar que Todo Funciona

Antes de compilar, asegúrate de:
```bash
# Verificar que no hay errores de TypeScript
pnpm check

# Verificar que las dependencias están instaladas
pnpm install
```

## 🎯 Próximo Paso

Una vez descargada la APK:
1. Transfiere a tu teléfono Android
2. Instala desde el gestor de archivos
3. ¡Prueba la app!

## ❓ Problemas Comunes

| Problema | Solución |
|----------|----------|
| "eas: command not found" | Instala con `npm install -g eas-cli` |
| "No se puede conectar a Expo" | Verifica internet, ejecuta `eas logout` y `eas login` |
| "Build falló" | Revisa logs en https://expo.dev/builds |
| "APK no se instala" | Habilita "Fuentes desconocidas" en Android |

---

**¿Necesitas más ayuda?** Lee `EXPO_CLOUD_BUILD_GUIDE.md` para instrucciones completas.
