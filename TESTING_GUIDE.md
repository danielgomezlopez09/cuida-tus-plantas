# Guía de Testing - Cuida tus Plantas

## Checklist de Testing Funcional

### 1. Pantalla de Inicio
- [ ] Pantalla carga correctamente
- [ ] Se muestra el contador de plantas (0 inicialmente)
- [ ] Botón "Agregar nueva planta" es clickeable
- [ ] Botón "Buscar por foto" es clickeable
- [ ] Sección de plantas destacadas se muestra
- [ ] Sección de consejos del día se muestra
- [ ] Scroll funciona correctamente
- [ ] Colores y fuentes son legibles

### 2. Explorador de Plantas
- [ ] Pantalla carga correctamente
- [ ] Se muestran todas las plantas (20+)
- [ ] Búsqueda por nombre funciona
- [ ] Filtros por tipo funcionan
- [ ] Grid de 2 columnas se muestra correctamente
- [ ] Click en planta abre detalle
- [ ] Scroll funciona sin problemas
- [ ] Indicador de resultados es preciso

### 3. Detalle de Planta
- [ ] Información de planta se carga correctamente
- [ ] Nombre y descripción se muestran
- [ ] Tabs (Cuidados, Plagas, Fertilizantes) funcionan
- [ ] Contenido de cada tab es correcto
- [ ] Botón "Agregar a mis plantas" funciona
- [ ] Scroll dentro de tabs funciona
- [ ] Botón atrás regresa al explorador
- [ ] Información es legible y bien formateada

### 4. Mis Plantas
- [ ] Pantalla carga correctamente
- [ ] Inicialmente muestra "Sin plantas"
- [ ] Después de agregar, muestra plantas agregadas
- [ ] Cada planta muestra información correcta
- [ ] Click en planta abre detalle del usuario
- [ ] Botón eliminar funciona
- [ ] Confirmación de eliminación aparece
- [ ] Ordenamiento funciona (si está implementado)

### 5. Detalle de Planta del Usuario
- [ ] Información de planta se carga
- [ ] Tabs funcionan correctamente
- [ ] Botones de acción rápida (riego, fertilización) funcionan
- [ ] Historial se actualiza después de acciones
- [ ] Información de cuidados se muestra
- [ ] Botón atrás regresa a "Mis plantas"
- [ ] Datos persisten después de cerrar app

### 6. Búsqueda por Foto
- [ ] Pantalla carga correctamente
- [ ] Botones de cámara y galería se muestran
- [ ] Interfaz es clara e intuitiva
- [ ] Botón atrás funciona
- [ ] Placeholder de resultados se muestra

### 7. Navegación
- [ ] Barra inferior con 4 tabs se muestra
- [ ] Tabs son clickeables
- [ ] Cambio entre tabs es suave
- [ ] Icono activo se destaca
- [ ] Navegación es consistente

### 8. Almacenamiento Local
- [ ] Datos se guardan al agregar planta
- [ ] Datos persisten después de cerrar app
- [ ] Datos se eliminan al eliminar planta
- [ ] Historial se guarda correctamente
- [ ] No hay errores de almacenamiento

### 9. Interfaz y Diseño
- [ ] Colores son consistentes
- [ ] Fuentes son legibles
- [ ] Espaciado es apropiado
- [ ] Botones son fáciles de tocar
- [ ] Diseño es responsive
- [ ] Sin elementos superpuestos
- [ ] Tema claro/oscuro funciona (si aplica)

### 10. Rendimiento
- [ ] App carga rápidamente
- [ ] Navegación es fluida
- [ ] Sin lag o congelamiento
- [ ] Búsqueda es rápida
- [ ] Scroll es suave
- [ ] Sin crashes

### 11. Compatibilidad
- [ ] Funciona en Android 7.0+
- [ ] Funciona en diferentes tamaños de pantalla
- [ ] Funciona en orientación vertical
- [ ] Funciona en orientación horizontal (si aplica)
- [ ] Compatible con notch/muesca
- [ ] Compatible con navegación por gestos

### 12. Textos y Contenido
- [ ] Todos los textos están en español
- [ ] No hay typos
- [ ] Información es precisa
- [ ] Descripciones son claras
- [ ] Instrucciones son fáciles de entender

---

## Testing de Dispositivos Específicos

### Dispositivos Recomendados para Testing

**Teléfonos:**
- [ ] Samsung Galaxy A10 (5.0", 720x1520)
- [ ] Samsung Galaxy S20 (6.2", 1440x3200)
- [ ] Xiaomi Redmi Note 9 (6.5", 1080x2340)
- [ ] Motorola G9 (6.5", 720x1600)
- [ ] iPhone 12 (6.1", 1170x2532) - Si es posible

**Tablets:**
- [ ] iPad Mini (7.9", 1024x768) - Si es posible
- [ ] Samsung Galaxy Tab A (10.1", 1920x1200) - Si es posible

### Resoluciones a Verificar
- [ ] 720x1280 (pequeño)
- [ ] 1080x1920 (estándar)
- [ ] 1440x2560 (grande)
- [ ] 1080x2340 (extra alto)

---

## Testing de Casos Extremos

### Datos Extremos
- [ ] Nombre de planta muy largo
- [ ] Descripción muy larga
- [ ] Muchas plantas agregadas (50+)
- [ ] Historial con muchos registros (100+)

### Acciones Rápidas
- [ ] Agregar y eliminar planta rápidamente
- [ ] Cambiar entre tabs rápidamente
- [ ] Hacer scroll rápido
- [ ] Búsqueda con caracteres especiales

### Conexión
- [ ] Sin conexión a internet
- [ ] Conexión lenta
- [ ] Cambio de conexión (WiFi a datos)

### Memoria
- [ ] App funciona con poca memoria disponible
- [ ] App no consume excesiva memoria
- [ ] Sin memory leaks

---

## Testing de Seguridad

### Validación de Entrada
- [ ] No se puede inyectar código
- [ ] Caracteres especiales se manejan correctamente
- [ ] Campos vacíos se validan

### Almacenamiento
- [ ] Datos se guardan de forma segura
- [ ] Sin exposición de datos sensibles
- [ ] Datos se eliminan correctamente

### Permisos
- [ ] App solicita permisos necesarios
- [ ] Sin solicitud de permisos innecesarios
- [ ] Funciona sin permisos opcionales

---

## Testing de Accesibilidad

### Texto
- [ ] Texto es legible (contraste suficiente)
- [ ] Tamaño de fuente es adecuado
- [ ] Sin texto muy pequeño

### Navegación
- [ ] Navegación con teclado funciona
- [ ] Botones son fáciles de tocar
- [ ] Elementos interactivos son claros

### Colores
- [ ] No depende solo del color
- [ ] Suficiente contraste
- [ ] Accesible para daltónicos

---

## Proceso de Testing

### 1. Instalación
```bash
# Instalar APK en dispositivo
adb install app-release.apk

# O usar interfaz de Google Play Console
```

### 2. Testing Manual
1. Abrir app
2. Revisar cada pantalla
3. Probar cada función
4. Verificar datos
5. Probar navegación
6. Cerrar y reabrir app

### 3. Documentar Problemas
Para cada problema encontrado:
- Descripción clara
- Pasos para reproducir
- Dispositivo y versión de Android
- Screenshot si es posible
- Severidad (crítico, alto, medio, bajo)

### 4. Reportar Bugs
Crear reporte con:
```
Título: [Pantalla] Descripción breve
Severidad: [Crítico/Alto/Medio/Bajo]
Dispositivo: [Modelo, versión Android]
Pasos:
1. ...
2. ...
3. ...
Resultado esperado: ...
Resultado actual: ...
Screenshot: [Adjuntar si es posible]
```

---

## Checklist Final Antes de Publicar

### Funcionalidad
- [ ] Todas las pantallas funcionan
- [ ] Todas las funciones funcionan
- [ ] Navegación es fluida
- [ ] Datos se guardan correctamente
- [ ] No hay crashes

### Diseño
- [ ] Interfaz es atractiva
- [ ] Colores son consistentes
- [ ] Textos son legibles
- [ ] Diseño es responsive
- [ ] Sin elementos rotos

### Contenido
- [ ] Información es precisa
- [ ] Textos están en español
- [ ] Sin typos
- [ ] Descripciones son claras

### Rendimiento
- [ ] App carga rápido
- [ ] Navegación es fluida
- [ ] Sin lag
- [ ] Uso de memoria es razonable

### Compatibilidad
- [ ] Funciona en Android 7.0+
- [ ] Funciona en diferentes dispositivos
- [ ] Funciona en diferentes tamaños
- [ ] Funciona en orientaciones

### Seguridad
- [ ] Datos se guardan seguramente
- [ ] Sin exposición de datos
- [ ] Permisos son apropiados

### Documentación
- [ ] Política de privacidad está lista
- [ ] Términos de servicio están listos
- [ ] Descripción de Google Play está lista
- [ ] Capturas de pantalla están listas

---

## Criterios de Aceptación

### Críticos (Debe cumplir)
- ✅ App no crashea
- ✅ Todas las pantallas cargan
- ✅ Datos se guardan y recuperan
- ✅ Navegación funciona
- ✅ Información es correcta

### Altos (Debe cumplir)
- ✅ Interfaz es usable
- ✅ Rendimiento es aceptable
- ✅ Compatible con Android 7.0+
- ✅ Textos son claros
- ✅ Diseño es atractivo

### Medios (Debería cumplir)
- ✅ Accesibilidad básica
- ✅ Animaciones suaves
- ✅ Tema claro/oscuro
- ✅ Optimización de memoria

### Bajos (Podría cumplir)
- ✅ Efectos visuales adicionales
- ✅ Animaciones avanzadas
- ✅ Características extras

---

## Resultado del Testing

**Fecha de Testing**: [Completar]
**Dispositivos Testeados**: [Completar]
**Problemas Encontrados**: [Completar]
**Estado**: [ ] Aprobado [ ] Rechazado

**Notas**:
[Completar]

---

**Última actualización**: 15 de mayo de 2026
