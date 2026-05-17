# 🚀 Guía de Compilación con Expo Cloud Build

## ¿Qué es Expo Cloud Build?

Expo Cloud Build es un servicio gratuito que compila tu aplicación React Native en la nube sin necesidad de instalar Java, Android SDK o Gradle en tu computadora. Es la forma más fácil de generar APK lista para Google Play Store.

## Paso 1: Crear Cuenta en Expo

1. Ve a **https://expo.dev**
2. Haz clic en **"Sign Up"** (Registrarse)
3. Completa el formulario con:
   - Email
   - Contraseña
   - Nombre de usuario
4. Verifica tu email
5. ¡Listo! Tu cuenta está creada

## Paso 2: Preparar el Proyecto

El proyecto ya está completamente configurado. Solo necesitas:

1. Asegúrate de que `app.config.ts` tenga:
   ```typescript
   name: "Cuida tus Plantas"
   slug: "cuida-tus-plantas"
   version: "1.0.0"
   ```

2. Verifica que `eas.json` exista en la raíz del proyecto (si no, créalo):
   ```json
   {
     "cli": {
       "version": ">= 5.0.0"
     },
     "build": {
       "production": {
         "android": {
           "buildType": "apk"
         }
       }
     },
     "submit": {
       "production": {}
     }
   }
   ```

## Paso 3: Instalar EAS CLI (Herramienta de Expo)

Abre tu terminal en la carpeta del proyecto y ejecuta:

```bash
npm install -g eas-cli
```

O si usas pnpm:

```bash
pnpm add -g eas-cli
```

## Paso 4: Conectar tu Proyecto a Expo

En la terminal, dentro de la carpeta del proyecto:

```bash
eas login
```

Ingresa tu email y contraseña de Expo que creaste en Paso 1.

## Paso 5: Inicializar EAS en tu Proyecto

```bash
eas build:configure
```

Selecciona:
- Platform: **Android**
- Build type: **APK** (para testing)

## Paso 6: Compilar la APK

Ejecuta el comando para compilar:

```bash
eas build --platform android --local
```

O si prefieres compilar en la nube (más fácil):

```bash
eas build --platform android
```

**Nota:** La primera compilación en la nube puede tomar 15-20 minutos. Las siguientes serán más rápidas.

## Paso 7: Descargar la APK

1. Después de que termine la compilación, verás un enlace en la terminal
2. También puedes ir a **https://expo.dev/builds** en tu navegador
3. Busca tu build "Cuida tus Plantas"
4. Haz clic en **"Download"** para descargar la APK

## Paso 8: Instalar en tu Teléfono

### En Android:
1. Transfiere el archivo `.apk` a tu teléfono
2. Abre el archivo desde el gestor de archivos
3. Permite la instalación desde fuentes desconocidas si es necesario
4. ¡Listo! La app está instalada

### Alternativa (Más Fácil):
1. Escanea el código QR que genera Expo
2. Se descarga e instala automáticamente

## Solución de Problemas

### "Error: No se puede conectar a Expo"
- Verifica tu conexión a internet
- Ejecuta `eas logout` y luego `eas login` nuevamente

### "Build falló"
- Revisa los logs en https://expo.dev/builds
- Asegúrate de que `app.config.ts` sea válido
- Verifica que no haya errores de TypeScript: `pnpm check`

### "APK no se instala en el teléfono"
- Asegúrate de que tu teléfono tenga suficiente espacio
- Desinstala versiones anteriores de la app
- Habilita instalación desde fuentes desconocidas

## Próximos Pasos

Una vez que tengas la APK funcionando:

1. **Testing**: Prueba todas las características en tu teléfono
2. **Reporte de Bugs**: Anota cualquier problema encontrado
3. **Publicar en Google Play Store**: Sigue la guía `PUBLISH_TO_GOOGLE_PLAY.md`

## Recursos Útiles

- **Documentación Oficial**: https://docs.expo.dev/build/setup
- **EAS CLI Docs**: https://docs.expo.dev/eas-cli/introduction
- **Foro de Expo**: https://forums.expo.dev

---

**¿Necesitas ayuda?** Revisa los logs completos en la terminal o contacta al equipo de Expo en https://expo.dev/support
