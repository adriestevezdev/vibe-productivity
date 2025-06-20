# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Critical Instructions

### 📋 Progress Tracking Requirement
**IMPORTANT**: After implementing ANY functionality, you MUST update the `Todolist.md` file:
- Mark completed tasks with [X] instead of [ ]
- This file contains the complete implementation roadmap divided into 6 phases
- Accurate tracking is essential for project management

## Project Overview

Vibe Productivity is a gamified task management platform that visualizes user productivity in a 3D voxel-based virtual space. Users can organize tasks, track time with Pomodoro sessions, and see their progress represented as building blocks in their personal productivity world.

## Development Commands

```bash
# Initial setup
cp .env.example .env    # Configure environment variables

# Start development environment
docker-compose up       # Start all services (PostgreSQL, Backend, Frontend, Adminer)
docker-compose up -d    # Start in background

# Service management
docker-compose logs -f backend    # View backend logs
docker-compose logs -f frontend   # View frontend logs
docker-compose down              # Stop all services

# Access points
# Frontend: http://localhost:3000
# Backend API: http://localhost:8000
# API Docs: http://localhost:8000/docs
# Database UI: http://localhost:8080 (postgres/vibe_user/vibe_password/vibe_db)

# Frontend development
cd frontend
npm run dev     # Start development server
npm run build   # Build for production
npm run lint    # Run ESLint

# Backend development (if running outside Docker)
cd backend
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

## Technical Architecture

### Frontend Stack
- **Framework**: Next.js 15.3.4 with App Router
- **React**: 19.0.0
- **TypeScript**: Strict mode enabled
- **Styling**: Tailwind CSS v4 (new syntax)
- **Planned**: Three.js + React Three Fiber for 3D visualization
- **State**: Zustand (to be added)
- **API Client**: Axios (to be added)
- **Auth**: Clerk (to be added)

### Backend Stack
- **Framework**: FastAPI 0.115.12
- **Python**: 3.11
- **ORM**: SQLAlchemy 2.0.36
- **Database**: PostgreSQL 16
- **Validation**: Pydantic 2.10.4
- **Auth**: Clerk JWT validation
- **Migrations**: Alembic (installed but not configured)

## Data Models

### User
- `id`: UUID primary key
- `clerk_id`: Unique Clerk identifier
- `email`: User email
- `username`: Display name
- `created_at`, `updated_at`: Timestamps
- Relationships: tasks, pomodoros, achievements, spaces

### Task
- `id`: UUID primary key
- `user_id`: Foreign key to User
- `title`: Task name
- `description`: Optional details
- `status`: pending/in_progress/completed
- `priority`: low/medium/high
- `due_date`: Optional deadline
- `estimated_pomodoros`: Time estimate
- `completed_pomodoros`: Progress tracking
- `position_x`, `position_y`, `position_z`: 3D coordinates
- `color`: Hex color for visualization
- `size`: Visual representation size
- Relationship: pomodoros

### Pomodoro
- `id`: UUID primary key
- `user_id`, `task_id`: Foreign keys
- `start_time`, `end_time`: Session timing
- `duration`: Minutes (default 25)
- `is_break`: Boolean flag
- `completed`: Session status

### Achievement
- `id`: UUID primary key
- `user_id`: Foreign key
- `type`: Achievement category
- `name`, `description`: Display info
- `unlocked_at`: Timestamp
- `progress`, `target`: Progress tracking

### Space
- `id`: UUID primary key
- `user_id`: Foreign key
- `name`: Space identifier
- `theme`: Visual theme
- `grid_size`: 3D grid dimensions
- `camera_position`: JSON camera state
- `environment_settings`: JSON config

## Visual System Architecture

### MVP Visual System (CSS-based)
- Isometric grid using CSS transforms
- Voxel blocks as colored divs
- Smooth animations with CSS transitions
- Responsive design considerations

### Future 3D System (Three.js)
- Instanced mesh rendering for performance
- Interactive camera controls
- Particle effects and shaders
- Real-time shadow mapping

## Environment Configuration

Required environment variables (see .env.example):
```
# Backend
DATABASE_URL=postgresql://user:password@host:port/dbname
SECRET_KEY=your-secret-key
CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...

# Frontend
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...
NEXT_PUBLIC_API_URL=http://localhost:8000
```

## Development Workflow

### Important: Progress Tracking
**After completing any implementation task, you MUST:**
1. Read the `Todolist.md` file
2. Mark completed items with [X] instead of [ ]
3. Update the file to reflect the current implementation status
4. This ensures accurate tracking of project progress across all phases

### Current Phase Tasks
1. Complete database migration setup with Alembic
2. Implement frontend authentication with Clerk
3. Create base component library
4. Set up API service layer in frontend
5. Implement state management with Zustand

### Next Phase (Visual Voxel System)
1. Install Three.js and React Three Fiber
2. Create 3D scene component
3. Implement voxel rendering system
4. Add camera controls and interactions

## Key Development Principles

1. **Performance First**: Use instancing for 3D objects, implement virtualization for large lists
2. **Accessibility**: Provide 2D fallbacks, keyboard navigation, screen reader support
3. **Type Safety**: Leverage TypeScript strictly, validate API contracts
4. **Responsive Design**: Mobile-first approach, touch-friendly interactions
5. **Progressive Enhancement**: CSS visual system before full 3D implementation

## API Design Pattern

- RESTful endpoints under `/api/v1/`
- Consistent response format with Pydantic schemas
- JWT authentication via Clerk
- Comprehensive error handling
- OpenAPI documentation at `/docs`

## Future Features (Post-MVP)

- Music integration with productivity rhythms
- Collaborative spaces
- AI task suggestions
- Data export functionality
- Mobile applications
- Theme marketplace