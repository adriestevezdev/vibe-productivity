# Vibe Productivity Platform

## MVP - Funcionalidades Core Simplificadas

### ⚠️ Compatibilidad de Versiones
- **React 19**: Verificar compatibilidad de librerías antes de instalar
- **Tailwind CSS v4**: Nueva sintaxis y sistema de plugins
- **ESLint 9**: Usa flat config en lugar de .eslintrc
- **Next.js 15**: App Router es el estándar, no Pages Router

### Frontend (Next.js)

- **Mundo Voxel Principal**: Vista isométrica 2.5D navegable con CSS
- **Gestión de Tareas**: CRUD con representación 3D de tareas como bloques
- **Timer Pomodoro Visual**: Reloj de arena voxel con animaciones
- **Dashboard de Productividad**: Vista isométrica con estadísticas básicas
- **Perfil de Usuario**: Personalización de avatar voxel y preferencias
- **Sistema de Recompensas**: Desbloqueables visuales por completar tareas

### Backend (FastAPI)

- **Models**: Usuario, Tarea, SesionPomodoro, Logro, ConfiguracionEspacio
- **APIs REST** para:
  - Tareas (CRUD + cambio de estado)
  - Sesiones Pomodoro (iniciar, pausar, finalizar)
  - Estadísticas de productividad
  - Configuración del espacio 3D
- **Base de datos**: PostgreSQL levantado por docker-compose.yml
- **Sistema de gamificación**: Cálculo de puntos y logros

### Sistema Visual Voxel (CSS/Canvas 2D) ✅ IMPLEMENTADO

- **Renderizado isométrico voxel**: CSS 3D transforms para bloques simples ✅
  - Sistema de coordenadas isométricas con cálculos precisos
  - 6 caras renderizadas por voxel con gradientes para profundidad
- **Vista isométrica**: CSS Grid con perspectiva isométrica ✅
  - Grid floor visual para referencia espacial
  - Sistema de posicionamiento basado en CSS custom properties
- **Interacciones**: Click handlers nativos del DOM ✅
  - Detección mejorada con áreas de click expandidas
  - Soporte para selección y hover states
- **Animaciones**: CSS transitions y animations ✅
  - Animaciones de aparición, pulse, hover y selección
  - Efectos de material (glass, metal, neon)
- **Efectos visuales**: CSS filters y pseudo-elementos ✅
  - Drop shadows dinámicas
  - Efectos de brillo y saturación
  - Sistema de temas con 6 variantes de color

### Estructura Técnica

#### Frontend - Versiones Específicas
- **Framework**: Next.js 15.3.4 (App Router)
- **React**: 19.1.0 (última versión estable)
- **TypeScript**: 5.8.3 con strict mode
- **Node.js**: 20.x LTS requerido
- **Estilizado**: Tailwind CSS 4.1.10 (v4 con nuevo sistema de configuración)
- **Estado Global**: Zustand 5.x (compatible con React 19)
- **Linting**: ESLint 9.29.0 con flat config

#### Backend - Stack Recomendado
- **Framework**: FastAPI 0.115.x
- **ORM**: SQLAlchemy 2.x
- **Validación**: Pydantic 2.x
- **Python**: 3.11+ recomendado

#### Infraestructura
- **Base de datos**: PostgreSQL 16.x (via docker-compose)
- **Autenticación**: Clerk OAuth (última versión SDK)
- **Containerización**: Docker con hot-reload en desarrollo

### Arquitectura de Componentes Visuales

- **VoxelGrid**: Grid isométrico principal con CSS ✅
  - Control de cámara (pan, rotate, zoom)
  - Grid floor de referencia
  - Controles visuales integrados
- **VoxelBlock**: Bloques voxel con CSS 3D transforms ✅
  - 6 caras con gradientes dinámicos
  - Sistema de temas y materiales
  - Estados interactivos (hover, selected, completed)
- **TaskVoxel**: Tareas representadas como cubos isométricos (pendiente)
- **PomodoroVoxel**: Timer visual con animaciones CSS (pendiente)
- **AvatarVoxel**: Sprite 2D o composición de divs (pendiente)
- **IslandSection**: Secciones temáticas con estilos CSS (pendiente)

### Sistema de Datos Visuales

- **Posicionamiento**: Sistema de grid 2D con altura simulada
- **Serialización**: Estado de la UI guardado en BD
- **Sincronización**: Updates del DOM con React
- **Optimización**: Lazy loading y virtualización de elementos