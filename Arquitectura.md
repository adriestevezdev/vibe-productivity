# Vibe Productivity Platform

## MVP - Funcionalidades Core Simplificadas

### Frontend (Next.js)

- **Mundo 3D Principal**: Espacio voxel navegable con islas temáticas
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

### Motor 3D (Three.js/React Three Fiber)

- **Renderizado de mundo voxel**: Sistema de chunks para optimización
- **Sistema de cámara**: Vista isométrica con controles de navegación
- **Interacciones 3D**: Click/drag para manipular objetos
- **Animaciones**: Transiciones suaves entre estados
- **Sistema de partículas**: Efectos visuales para feedback

### Estructura Técnica

- **Frontend**: Next.js 15.x, TypeScript, Three.js, React Three Fiber
- **Backend**: FastAPI, SQLAlchemy, Pydantic
- **Base de datos**: PostgreSQL (levantado por docker-compose.yml)
- **Autenticación**: Clerk OAuth
- **Estado Global**: Zustand para gestión de estado 3D
- **Estilizado**: Tailwind CSS para UI 2D

### Arquitectura de Componentes 3D

- **VoxelWorld**: Componente principal del mundo 3D
- **TaskBlock**: Representación 3D de tareas individuales
- **PomodoroTimer3D**: Visualización del timer
- **Avatar**: Personaje voxel del usuario
- **IslandZone**: Áreas temáticas del espacio de trabajo

### Sistema de Datos 3D

- **Posicionamiento**: Coordenadas x,y,z para cada elemento
- **Serialización**: Guardado del estado del mundo en BD
- **Sincronización**: Updates en tiempo real del espacio 3D
- **Optimización**: LOD (Level of Detail) para rendimiento