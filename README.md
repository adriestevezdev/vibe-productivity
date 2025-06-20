# Vibe Productivity Platform

A 3D productivity platform with gamification features built with FastAPI, Next.js, and Three.js.

## Phase 1 Implementation Complete ✅

### What was implemented:

#### Backend (FastAPI)
- ✅ FastAPI project structure with modular organization
- ✅ PostgreSQL database configuration with SQLAlchemy ORM
- ✅ Clerk authentication integration with JWT verification
- ✅ Database models:
  - User (linked to Clerk ID)
  - Task (with 3D positioning)
  - PomodoroSession
  - Achievement & UserAchievement
  - SpaceConfiguration (3D world state)
- ✅ RESTful API endpoints for tasks and users
- ✅ CORS configuration for frontend communication
- ✅ Docker configuration for development

#### Frontend (Next.js)
- ✅ Clerk authentication provider integration
- ✅ Middleware for route protection
- ✅ Zustand store for state management
- ✅ API service with Axios for backend communication
- ✅ Dependencies installed:
  - Three.js & React Three Fiber for 3D
  - Clerk for authentication
  - Zustand for state management
  - Axios for API calls

#### Infrastructure
- ✅ Docker Compose configuration with:
  - PostgreSQL database
  - FastAPI backend with hot reload
  - Next.js frontend with hot reload
- ✅ Environment variable configuration

## Getting Started

### Prerequisites
- Docker and Docker Compose
- Clerk account for authentication keys

### Setup

1. Clone the repository
2. Copy `.env.example` to `.env` and fill in your Clerk keys:
   ```bash
   cp .env.example .env
   ```

3. Start the services:
   ```bash
   docker-compose up
   ```

This will start:
- PostgreSQL database on port 5432
- FastAPI backend on http://localhost:8000
- Next.js frontend on http://localhost:3000

### API Documentation
Once running, visit http://localhost:8000/docs for the FastAPI interactive documentation.

## Project Structure

```
vibe-productivity/
├── backend/
│   ├── app/
│   │   ├── api/          # API endpoints
│   │   ├── core/         # Core configurations
│   │   ├── db/           # Database configuration
│   │   ├── models/       # SQLAlchemy models
│   │   ├── schemas/      # Pydantic schemas
│   │   └── middleware/   # Middleware (auth, etc.)
│   ├── Dockerfile.dev
│   └── requirements.txt
├── frontend/
│   ├── src/
│   │   ├── app/          # Next.js app directory
│   │   ├── services/     # API services
│   │   └── store/        # Zustand stores
│   ├── Dockerfile.dev
│   └── package.json
└── docker-compose.yml
```

## Next Steps (Phase 2)
- Implement the 3D world with React Three Fiber
- Create the voxel system and interactions
- Build the task visualization components
- Implement the Pomodoro timer with 3D animations