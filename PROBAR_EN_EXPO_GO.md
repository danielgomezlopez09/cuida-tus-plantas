# Guía: Probar la App en Expo Go (Inmediato)

**¡La forma más rápida de probar la app sin compilar APK!**

## ¿Qué es Expo Go?

Expo Go es una aplicación móvil que te permite ejecutar proyectos Expo directamente en tu teléfono sin necesidad de compilar APK. Perfecto para testing rápido.

---

## Paso 1: Instalar Expo Go en tu Teléfono

### En Android
1. Abre Google Play Store
2. Busca "Expo Go"
3. Instala la aplicación oficial de Expo

**Link directo**: https://play.google.com/store/apps/details?id=host.exp.exponent

### En iPhone
1. Abre App Store
2. Busca "Expo Go"
3. Instala la aplicación oficial de Expo

**Link directo**: https://apps.apple.com/us/app/expo-go/id982107779

---

## Paso 2: Asegúrate que el Servidor está Corriendo

En tu navegador, deberías ver la app en:
```
https://8081-isxxa05baovov976u7i0x-5ec14844.us1.manus.computer
```

Si no está corriendo, el servidor se iniciará automáticamente.

---

## Paso 3: Generar Código QR

### Opción A: Desde el Navegador
1. Abre la URL del servidor en tu navegador
2. Busca el código QR en la esquina inferior derecha
3. Toma una captura de pantalla

### Opción B: Generar con Script
```bash
cd ~/cuida-tus-plantas
pnpm qr
# Mostrará un código QR en la terminal
```

---

## Paso 4: Escanear Código QR

### En Android
1. Abre **Expo Go**
2. Toca el botón **"Scan QR code"** (código QR con cámara)
3. Apunta a la pantalla con el código QR
4. La app se cargará automáticamente

### En iPhone
1. Abre **Expo Go**
2. Toca el botón **"Scan QR code"** (código QR con cámara)
3. Apunta a la pantalla con el código QR
4. Toca la notificación que aparece
5. La app se cargará automáticamente

---

## Paso 5: ¡Prueba la App!

Una vez cargada, puedes:

### Pantalla de Inicio
- ✅ Ver colección de plantas (0 inicialmente)
- ✅ Ver botones de acción rápida
- ✅ Ver plantas destacadas
- ✅ Ver consejos del día
- ✅ Hacer scroll

### Explorador de Plantas
- ✅ Tocar tab "Explorador"
- ✅ Ver todas las plantas (20+)
- ✅ Buscar por nombre
- ✅ Filtrar por tipo
- ✅ Tocar planta para ver detalle

### Detalle de Planta
- ✅ Ver información completa
- ✅ Cambiar entre tabs (Cuidados, Plagas, Fertilizantes)
- ✅ Ver información de cada tab
- ✅ Tocar "Agregar a mis plantas"

### Mis Plantas
- ✅ Ver planta agregada
- ✅ Tocar planta para ver detalle del usuario
- ✅ Ver historial de cuidados
- ✅ Hacer acciones rápidas (riego, fertilización)

### Búsqueda por Foto
- ✅ Ver interfaz de búsqueda
- ✅ Botones de cámara y galería

---

## Checklist de Testing Rápido

### Navegación
- [ ] Todos los tabs funcionan
- [ ] Cambio entre pantallas es suave
- [ ] Botón atrás funciona
- [ ] Scroll funciona correctamente

### Funcionalidad
- [ ] Búsqueda filtra plantas correctamente
- [ ] Detalle de planta muestra información
- [ ] Agregar planta funciona
- [ ] Datos se guardan (cierra y reabre app)
- [ ] Eliminar planta funciona

### Interfaz
- [ ] Colores se ven bien
- [ ] Textos son legibles
- [ ] Botones son fáciles de tocar
- [ ] Diseño es responsive
- [ ] Sin elementos superpuestos

### Rendimiento
- [ ] App carga rápido
- [ ] Navegación es fluida
- [ ] Sin lag o congelamiento
- [ ] Sin crashes

---

## Solución de Problemas

### Código QR no aparece
```bash
# Reiniciar servidor
pnpm dev

# O generar QR manualmente
pnpm qr
```

### "Conexión rechazada"
- Verifica que tu teléfono está en la misma red WiFi
- Reinicia el servidor
- Recarga la página

### "App se carga pero muestra pantalla blanca"
- Espera 10-15 segundos
- Revisa la consola del navegador para errores
- Recarga la app en Expo Go

### "No puedo escanear el código QR"
- Asegúrate que Expo Go tiene permisos de cámara
- Intenta escribir la URL manualmente:
  ```
  exp://8081-isxxa05baovov976u7i0x-5ec14844.us1.manus.computer
  ```

### "Errores de TypeScript"
- Verifica que el servidor está corriendo
- Revisa la consola para mensajes de error
- Reinicia el servidor

---

## Ventajas de Expo Go

| Ventaja | Descripción |
|---------|------------|
| **Rápido** | Prueba inmediata sin compilar |
| **Fácil** | Solo escanear código QR |
| **Gratuito** | No requiere pago |
| **Iterativo** | Cambios se ven al guardar |
| **Multiplataforma** | Funciona en Android e iOS |

---

## Limitaciones de Expo Go

- Algunas características nativas pueden no funcionar
- Rendimiento puede ser más lento que APK compilada
- No es la versión final de la app
- Requiere conexión a internet

---

## Después de Testing en Expo Go

Una vez que hayas probado la app y esté funcionando correctamente:

1. **Compilar APK**: Sigue `COMPILAR_APK_LOCALMENTE.md`
2. **Testing en Dispositivo**: Instala APK en teléfono
3. **Publicar**: Sigue `PUBLISH_TO_GOOGLE_PLAY.md`

---

## Comandos Útiles

```bash
# Iniciar servidor de desarrollo
cd ~/cuida-tus-plantas
pnpm dev

# Generar código QR
pnpm qr

# Ver logs en tiempo real
pnpm dev:metro

# Ejecutar tests
pnpm test

# Verificar tipos
pnpm check
```

---

## Recursos

- [Expo Go - Android](https://play.google.com/store/apps/details?id=host.exp.exponent)
- [Expo Go - iOS](https://apps.apple.com/us/app/expo-go/id982107779)
- [Documentación Expo](https://docs.expo.dev/)
- [Guía de Testing](./TESTING_GUIDE.md)

---

**¡Listo para probar tu app!** 📱

Escanea el código QR y comienza a explorar "Cuida tus Plantas".
