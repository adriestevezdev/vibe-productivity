import { create } from 'zustand'
import { devtools, persist } from 'zustand/middleware'

interface Task {
  id: number
  title: string
  description?: string
  status: 'pending' | 'in_progress' | 'completed' | 'archived'
  priority: 'low' | 'medium' | 'high' | 'urgent'
  position: { x: number; y: number; z: number }
  color: string
  size: number
}

interface AppState {
  // Tasks
  tasks: Task[]
  selectedTaskId: number | null
  
  // UI State
  isLoading: boolean
  error: string | null
  
  // 3D World State
  cameraPosition: { x: number; y: number; z: number }
  cameraRotation: { x: number; y: number; z: number }
  
  // Actions
  setTasks: (tasks: Task[]) => void
  addTask: (task: Task) => void
  updateTask: (id: number, updates: Partial<Task>) => void
  deleteTask: (id: number) => void
  selectTask: (id: number | null) => void
  
  // UI Actions
  setLoading: (loading: boolean) => void
  setError: (error: string | null) => void
  
  // Camera Actions
  setCameraPosition: (position: { x: number; y: number; z: number }) => void
  setCameraRotation: (rotation: { x: number; y: number; z: number }) => void
}

export const useAppStore = create<AppState>()(
  devtools(
    persist(
      (set) => ({
        // Initial state
        tasks: [],
        selectedTaskId: null,
        isLoading: false,
        error: null,
        cameraPosition: { x: 5, y: 10, z: 5 },
        cameraRotation: { x: 0, y: 0, z: 0 },
        
        // Actions
        setTasks: (tasks) => set({ tasks }),
        addTask: (task) => set((state) => ({ tasks: [...state.tasks, task] })),
        updateTask: (id, updates) => set((state) => ({
          tasks: state.tasks.map((task) =>
            task.id === id ? { ...task, ...updates } : task
          ),
        })),
        deleteTask: (id) => set((state) => ({
          tasks: state.tasks.filter((task) => task.id !== id),
          selectedTaskId: state.selectedTaskId === id ? null : state.selectedTaskId,
        })),
        selectTask: (id) => set({ selectedTaskId: id }),
        
        setLoading: (loading) => set({ isLoading: loading }),
        setError: (error) => set({ error }),
        
        setCameraPosition: (position) => set({ cameraPosition: position }),
        setCameraRotation: (rotation) => set({ cameraRotation: rotation }),
      }),
      {
        name: 'vibe-app-store',
        partialize: (state) => ({
          cameraPosition: state.cameraPosition,
          cameraRotation: state.cameraRotation,
        }),
      }
    )
  )
)