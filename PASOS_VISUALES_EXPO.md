# 📱 Pasos Visuales: Compilar APK desde Expo.dev

## Ya Iniciaste Sesión ✅

Perfecto, ya estás en https://expo.dev con tu sesión iniciada.

---

## PASO 1: Ir a la Sección de Builds

1. En la página principal de Expo, busca en el menú lateral izquierdo
2. Haz clic en **"Builds"** (o ve directamente a https://expo.dev/builds)
3. Deberías ver una página que dice "No builds yet" o un listado de builds anteriores

---

## PASO 2: Crear un Nuevo Build

1. Haz clic en el botón **"Create build"** (Crear build) - usualmente está en la esquina superior derecha
2. Se abrirá un formulario con opciones

---

## PASO 3: Seleccionar Opciones

En el formulario, selecciona:

| Campo | Valor |
|-------|-------|
| **Project** | Busca "cuida-tus-plantas" o crea uno nuevo |
| **Platform** | Android |
| **Build type** | APK (no AAB) |
| **Build profile** | production |

---

## PASO 4: Subir el Proyecto

Si es tu primer build, necesitas subir el código:

### Opción A: Desde GitHub (Recomendado)
1. Haz clic en **"Connect GitHub"**
2. Autoriza a Expo
3. Selecciona tu repositorio "cuida-tus-plantas"
4. Expo compilará automáticamente

### Opción B: Desde ZIP Local
1. Descarga el proyecto desde el checkpoint
2. Comprime la carpeta "cuida-tus-plantas" en ZIP
3. Haz clic en **"Upload project"**
4. Selecciona el archivo ZIP
5. Espera a que se cargue

---

## PASO 5: Iniciar la Compilación

1. Después de subir el proyecto, haz clic en **"Build"** o **"Start build"**
2. Verás un mensaje: "Build iniciado"
3. La compilación tardará **15-20 minutos** la primera vez

---

## PASO 6: Monitorear el Progreso

1. Verás una barra de progreso en la pantalla
2. Los estados son:
   - 🟡 **Queued** (En cola)
   - 🟡 **Building** (Compilando)
   - 🟢 **Finished** (Completado)

3. Puedes cerrar la página y volver después - el build continuará en la nube

---

## PASO 7: Descargar la APK

Cuando el estado sea **"Finished"** (verde):

1. Haz clic en el build completado
2. Verás un botón **"Download"** (Descargar)
3. Haz clic y se descargará el archivo `app-release.apk`

---

## PASO 8: Instalar en tu Teléfono

### En Android:
1. Transfiere el archivo `.apk` a tu teléfono (por email, WhatsApp, Google Drive, etc.)
2. Abre el archivo desde el gestor de archivos
3. Si pide permiso, haz clic en **"Instalar de todas formas"**
4. ¡Listo! La app está instalada

### Alternativa Rápida:
1. Escanea el código QR que genera Expo
2. Se descarga e instala automáticamente

---

## ⏱️ Tiempo Total

- Subir proyecto: 2 minutos
- Compilar: 15-20 minutos
- Descargar: 1 minuto
- Instalar: 1 minuto

**Total: 20-25 minutos**

---

## 🆘 Si Algo Sale Mal

### "No puedo encontrar el botón Create build"
→ Ve directamente a https://expo.dev/builds y busca el botón azul

### "No me deja subir el proyecto"
→ Asegúrate de que el ZIP no sea mayor a 500MB
→ Intenta conectar GitHub en lugar de subir ZIP

### "Build falló"
→ Haz clic en el build y revisa los logs
→ Busca mensajes de error en rojo
→ Intenta nuevamente

### "No puedo descargar la APK"
→ Espera a que el estado sea completamente verde
→ Intenta con otro navegador
→ Limpia el caché del navegador

---

## 📞 Ayuda Adicional

Si necesitas más ayuda:
1. Revisa https://docs.expo.dev/build/setup
2. Contacta al soporte de Expo: https://expo.dev/support

---

**¿Listo? ¡Comienza en Paso 1!**
