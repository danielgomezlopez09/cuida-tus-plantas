# Diseño de Interfaz - Cuida tus plantas

## Visión General

La aplicación "Cuida tus plantas" es una herramienta educativa y práctica para ayudar a los usuarios a cuidar sus plantas, árboles frutales, arbustos y flores. La interfaz está diseñada para ser intuitiva, accesible y orientada a dispositivos móviles en orientación vertical (9:16), permitiendo el uso con una sola mano.

## Paleta de Colores

- **Color Primario (Verde Naturaleza)**: #2D8659 - Representa crecimiento y naturaleza
- **Color Secundario (Verde Claro)**: #7BC043 - Acciones y elementos interactivos
- **Color de Fondo**: #F5F9F7 - Blanco cálido con toque verde
- **Color de Texto Principal**: #1A1A1A - Gris oscuro para legibilidad
- **Color de Texto Secundario**: #666666 - Gris medio para información adicional
- **Color de Alerta/Plagas**: #E74C3C - Rojo para problemas
- **Color de Éxito**: #27AE60 - Verde para acciones completadas
- **Color de Advertencia**: #F39C12 - Naranja para cuidados importantes

## Lista de Pantallas

### 1. **Home Screen (Inicio)**
Pantalla principal que muestra un resumen del estado de las plantas del usuario.

**Contenido Principal:**
- Encabezado con saludo personalizado ("Hola, [nombre]")
- Sección "Mis Plantas" con cards deslizables mostrando plantas principales
- Cada card de planta muestra: nombre, imagen, estado de salud (indicador visual), próximo riego
- Botón flotante "+" para agregar nueva planta
- Barra de navegación inferior con 4 pestañas

**Funcionalidad:**
- Deslizar cards horizontalmente para ver más plantas
- Tocar card para ir a detalle de planta
- Indicadores visuales de estado: verde (saludable), amarillo (requiere atención), rojo (problema)

### 2. **Explorador de Plantas (Browse/Explore)**
Pantalla para descubrir y seleccionar nuevas plantas.

**Contenido Principal:**
- Barra de búsqueda por nombre de planta
- Filtros por categoría: Plantas de interior, Árboles frutales, Arbustos, Flores, Hierbas aromáticas
- Grid de plantas (2 columnas) con imagen, nombre y categoría
- Cada item es un card con imagen cuadrada y nombre debajo

**Funcionalidad:**
- Búsqueda en tiempo real
- Filtros deslizables horizontalmente
- Tocar card para ver detalles completos
- Botón "Agregar a mis plantas" en detalle

### 3. **Búsqueda por Foto (Camera/Photo Recognition)**
Pantalla para identificar plantas usando la cámara.

**Contenido Principal:**
- Botón grande de cámara en el centro
- Área de vista previa de foto seleccionada
- Botón "Analizar planta" después de capturar
- Historial de búsquedas recientes (pequeños thumbnails)

**Funcionalidad:**
- Capturar foto con cámara o seleccionar de galería
- Enviar a servidor para análisis de IA
- Mostrar resultados con confianza de identificación
- Opción para confirmar o rechazar identificación

### 4. **Detalle de Planta**
Pantalla completa con toda la información de una planta específica.

**Contenido Principal:**
- Imagen grande de la planta (carrusel si hay múltiples)
- Nombre común y científico
- Categoría y tipo
- Descripción general
- Tabs deslizables: Cuidados | Plagas | Fertilizantes | Historial

**Tab Cuidados:**
- Luz requerida con icono
- Riego (frecuencia y cantidad)
- Temperatura óptima
- Humedad recomendada
- Tipo de sustrato
- Calendario de cuidados

**Tab Plagas:**
- Lista de plagas comunes
- Síntomas de cada plaga
- Control natural (remedios caseros)
- Control químico (productos)
- Imágenes de plagas

**Tab Fertilizantes:**
- Tipo de fertilizante recomendado
- Frecuencia de aplicación
- Opciones naturales (caseras)
- Recetas de fertilizantes caseros

**Tab Historial:**
- Registro de cuidados realizados
- Fechas de riego, poda, fertilización
- Notas personales
- Fotos de progreso

### 5. **Mis Plantas (My Plants)**
Pantalla que muestra todas las plantas del usuario.

**Contenido Principal:**
- Lista de plantas con cards verticales
- Cada card muestra: imagen, nombre, estado de salud, próximo riego
- Botón "+" para agregar nueva planta
- Opciones de ordenamiento: Nombre, Próximo riego, Estado

**Funcionalidad:**
- Deslizar card para eliminar
- Tocar card para ver detalles
- Editar información de planta
- Establecer recordatorios de riego

### 6. **Agregar/Editar Planta**
Pantalla para agregar una nueva planta o editar existente.

**Contenido Principal:**
- Campo de nombre (personalizado)
- Selector de tipo de planta (con búsqueda)
- Foto de la planta (capturar o subir)
- Ubicación en casa (selector)
- Fecha de compra/plantación
- Notas personales
- Botón "Guardar"

**Funcionalidad:**
- Validación de campos
- Sugerencias de plantas mientras se escribe
- Previsualización de foto
- Sincronización con base de datos local

### 7. **Recordatorios y Notificaciones**
Pantalla de configuración de recordatorios.

**Contenido Principal:**
- Toggle para habilitar/deshabilitar recordatorios
- Recordatorios automáticos por tipo de cuidado
- Recordatorio de riego
- Recordatorio de fertilización
- Recordatorio de poda
- Recordatorio de revisión de plagas
- Configuración de hora de notificación

**Funcionalidad:**
- Activar/desactivar recordatorios individuales
- Configurar hora de notificación
- Notificaciones push locales

### 8. **Diagnóstico de Problemas**
Pantalla para diagnosticar problemas en plantas.

**Contenido Principal:**
- Síntomas comunes (hojas amarillas, manchas, etc.)
- Fotos de síntomas
- Causas posibles
- Soluciones recomendadas
- Opción para enviar foto

**Funcionalidad:**
- Seleccionar síntoma visible
- Obtener diagnóstico basado en IA
- Ver soluciones paso a paso
- Guardar diagnóstico en historial

### 9. **Recetas de Fertilizantes Caseros**
Pantalla con recetas de fertilizantes naturales.

**Contenido Principal:**
- Lista de recetas disponibles
- Cada receta muestra: nombre, ingredientes, pasos
- Ingredientes con cantidades
- Instrucciones paso a paso
- Tiempo de preparación
- Plantas para las que es útil

**Funcionalidad:**
- Búsqueda de recetas
- Filtrar por ingredientes disponibles
- Guardar recetas favoritas
- Compartir recetas

### 10. **Configuración**
Pantalla de configuración de la aplicación.

**Contenido Principal:**
- Perfil del usuario
- Preferencias de notificaciones
- Tema (claro/oscuro)
- Idioma
- Sobre la aplicación
- Contacto/Soporte

**Funcionalidad:**
- Cambiar información de perfil
- Exportar/importar datos
- Limpiar caché
- Versión de la app

## Flujos de Usuario Principales

### Flujo 1: Agregar Nueva Planta
1. Usuario toca botón "+" en Home
2. Elige entre: Buscar en catálogo, Tomar foto, Escanear código QR
3. Selecciona planta del catálogo o confirma identificación
4. Completa información personal (ubicación, notas)
5. Guarda planta
6. Vuelve a Home con nueva planta agregada

### Flujo 2: Cuidar una Planta
1. Usuario ve card de planta en Home
2. Toca para ver detalles
3. Va a tab "Cuidados"
4. Lee instrucciones de riego/fertilización
5. Marca como completado (checkbox)
6. Recibe confirmación y próxima fecha

### Flujo 3: Diagnosticar Problema
1. Usuario nota problema en planta
2. Va a "Diagnóstico" o toca botón de alerta en card
3. Toma foto del problema
4. Selecciona síntomas visibles
5. Recibe diagnóstico y soluciones
6. Implementa solución
7. Registra en historial

### Flujo 4: Buscar Planta por Foto
1. Usuario ve planta desconocida
2. Va a pestaña "Búsqueda por Foto"
3. Captura foto o selecciona de galería
4. Espera análisis
5. Recibe identificación con confianza
6. Puede agregar a "Mis plantas"

## Consideraciones de Diseño

### Accesibilidad
- Texto legible (mínimo 16px para cuerpo)
- Contraste suficiente (WCAG AA)
- Iconos con etiquetas de texto
- Botones de al menos 44x44px
- Soporte para modo oscuro

### Rendimiento
- Imágenes optimizadas (WebP)
- Carga lazy de imágenes
- Base de datos local para plantas
- Sincronización en background

### Usabilidad Móvil
- Una sola mano: botones en zona inferior
- Gestos intuitivos: deslizar, tocar, presionar largo
- Feedback visual inmediato
- Transiciones suaves pero rápidas
- Orientación vertical fija

### Marca Visual
- Iconografía consistente
- Espaciado uniforme (8px grid)
- Tipografía clara (Poppins o similar)
- Animaciones sutiles (no distractoras)
- Uso consistente de colores

## Recomendaciones Adicionales para Perfeccionar la App

1. **Integración con Calendario**: Sincronizar recordatorios con calendario del dispositivo
2. **Comunidad**: Compartir fotos de plantas y consejos con otros usuarios
3. **Estadísticas**: Gráficos de crecimiento y salud de plantas
4. **Guía Interactiva**: Tutorial para nuevos usuarios
5. **Modo Offline**: Funcionalidad completa sin conexión
6. **Exportar Datos**: Generar reporte PDF de plantas y cuidados
7. **Integración con Tiendas**: Comprar plantas, fertilizantes, herramientas
8. **Ubicación Geográfica**: Recomendaciones según clima local
9. **Historial de Fotos**: Seguimiento visual del crecimiento
10. **Comparativa de Plantas**: Ver diferencias entre variedades
