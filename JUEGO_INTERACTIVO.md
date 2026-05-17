# 🎮 Juego Interactivo de Cultivo de Plantas

## Descripción General

El juego interactivo es una experiencia gamificada donde los usuarios cultivan plantas virtuales desde semillas hasta plantas adultas. El objetivo es cuidar adecuadamente las plantas para ganar monedas (doblones) y desbloquear logros.

## 🌱 Características Principales

### 1. Sistema de Semillas (20 Tipos)

El juego incluye 20 semillas diferentes clasificadas en 3 categorías:

**Frutas (7)**
- Tomate Cherry 🍅
- Fresa 🍓
- Manzana 🍎
- Limonero 🍋
- Naranja 🍊
- Plátano 🍌
- Tomate Beefsteak 🍅

**Flores (7)**
- Girasol 🌻
- Rosa Roja 🌹
- Orquídea 🌸
- Margarita 🌼
- Tulipán 🌷
- Lirio 🌺
- Cactus Flor 🌵

**Hortalizas (6)**
- Lechuga 🥬
- Pimiento 🫑
- Zanahoria 🥕
- Espinaca 🥗
- Calabaza 🎃
- Fresa Silvestre 🍓

### 2. Sistema de Monedas (Doblones)

Las monedas son la economía del juego:

| Acción | Doblones | Notas |
|--------|----------|-------|
| Primera semilla | 0 (Gratis) | Solo la primera vez |
| Semillas adicionales | 10 | Por cada semilla nueva |
| Riego a tiempo | 5-15 | Bonificación por racha |
| Fertilización a tiempo | 8-25 | Bonificación por racha |
| Trasplante a tiempo | 10-30 | Bonificación por racha |
| Cosecha de planta | 35-80 | Depende del tipo |
| Bono diario | 50 | Una vez cada 24 horas |
| Fertilizante | -10 | Costo de compra |

### 3. Ciclo de Crecimiento

Cada planta pasa por 5 etapas en aproximadamente 10 días:

1. **Semilla** 🌱 - Recién plantada
2. **Brote** 🌿 - Primeras hojas
3. **Plántula** 🌱 - Crecimiento inicial
4. **Planta Joven** 🌿 - Desarrollo
5. **Planta Adulta** 🌳 - Lista para cosechar

### 4. Sistema de Cuidados

Las plantas requieren cuidados regulares:

| Cuidado | Intervalo | Bonificación |
|---------|-----------|--------------|
| Riego | Cada 8 horas | +1 por racha |
| Fertilización | Cada 48 horas | +2 por racha |
| Trasplante | Cada 240 horas (10 días) | +3 por racha |

**Racha de Cuidados**: Cada cuidado correcto aumenta la racha, multiplicando las monedas ganadas.

### 5. Sistema de Salud

La salud de la planta (0-100%) afecta:
- Velocidad de crecimiento
- Cantidad de monedas en cosecha
- Éxito de cuidados

Cada cuidado correcto restaura salud:
- Riego: +10%
- Fertilización: +15%
- Trasplante: +20%

### 6. Sistema de Logros

5 logros principales para desbloquear:

| Logro | Descripción | Meta |
|-------|-------------|------|
| 🌱 Primer Cultivo | Cultiva tu primera planta | 1 planta |
| 🎯 Coleccionista | Cultiva 10 plantas diferentes | 10 especies |
| 💰 Maestro de Monedas | Gana 1000 doblones | 1000 monedas |
| ✨ Cuidador Perfecto | Mantén racha de 10 cuidados | 10 cuidados |
| 🌾 Cosechador | Cosecha 5 plantas | 5 cosechas |

### 7. Tienda de Compras

Acceso a la tienda desde el menú principal:

**Semillas**
- Todas las 20 semillas disponibles
- Primera semilla gratis
- Siguientes: 10 doblones cada una

**Fertilizante**
- Primera bolsa gratis
- Siguientes: 10 doblones cada una
- Necesario para fertilizar plantas

### 8. Colección de Plantas

Galería de plantas cosechadas:

- Visualiza todas las plantas que has cosechado
- Estadísticas de cosechas por especie
- Total de doblones ganados
- Fecha de cosecha de cada planta

## 🎮 Cómo Jugar

### Paso 1: Seleccionar Semilla
1. Abre la pestaña "Juego"
2. Toca "Plantar Semilla"
3. Elige una de las 20 semillas disponibles
4. Confirma la selección

### Paso 2: Cuidar la Planta
1. Riega cada 8 horas (botón azul)
2. Fertiliza cada 48 horas (botón verde)
3. Trasplanta cada 10 días (botón naranja)
4. Observa el crecimiento en la barra de progreso

### Paso 3: Cosechar
1. Cuando la planta esté lista (100% de crecimiento)
2. Toca el botón "Cosechar"
3. Gana monedas según el tipo de planta
4. La planta se añade a tu colección

### Paso 4: Repetir
1. Vuelve a seleccionar una semilla
2. Cultiva diferentes especies
3. Desbloquea logros
4. Compra nuevas semillas con tus doblones

## 💡 Consejos Estratégicos

### Maximizar Ganancias
- Mantén rachas largas de cuidados (bonificación multiplicadora)
- Cultiva plantas de alto valor (Rosa: 60, Calabaza: 75, Orquídea: 80)
- Desbloquea logros para bonificaciones especiales

### Gestión de Recursos
- Ahorra doblones para comprar semillas premium
- Compra fertilizante cuando sea necesario
- Cultiva varias plantas simultáneamente (futuro)

### Optimizar Tiempo
- Configura recordatorios para cuidados
- Planifica cosechas para máximas ganancias
- Usa el bono diario (50 doblones)

## 🏆 Características Futuras

- Cultivo simultáneo de múltiples plantas
- Sistema de invernadero mejorado
- Plagas y enfermedades (desafío)
- Eventos especiales y temporadas
- Competencia con otros jugadores
- Integración con redes sociales
- Animales de compañía para ayudar

## 📊 Estadísticas del Juego

El juego rastrea:
- Total de doblones ganados
- Plantas cultivadas
- Racha más larga de cuidados
- Plantas cosechadas por especie
- Logros desbloqueados
- Historial de cosechas

## ⚙️ Configuración Técnica

- **Almacenamiento**: AsyncStorage (local)
- **Persistencia**: Automática después de cada acción
- **Sincronización**: Futura con backend
- **Notificaciones**: Recordatorios de cuidados (futuro)

## 🐛 Solución de Problemas

### La planta no crece
- Verifica que la salud sea > 50%
- Asegúrate de regar y fertilizar a tiempo
- Espera el tiempo de crecimiento (10 días)

### No puedo cosechar
- La planta debe estar al 100% de crecimiento
- Verifica que el botón "Cosechar" esté disponible
- Intenta actualizar la pantalla

### Se perdieron mis datos
- Los datos se guardan automáticamente
- Verifica que la app no se cerró abruptamente
- Reinstala si es necesario (datos en AsyncStorage)

## 📞 Soporte

Para reportar bugs o sugerencias, contacta al equipo de desarrollo.
