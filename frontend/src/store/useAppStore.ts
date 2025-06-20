import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';

export interface Task {
  id: string;
  title: string;
  description?: string;
  status: 'pending' | 'in_progress' | 'completed';
  priority: 'low' | 'medium' | 'high';
  dueDate?: Date;
  estimatedPomodoros: number;
  completedPomodoros: number;
  position: { x: number; y: number; z: number };
  color?: string;
  size: number;
}

export interface Pomodoro {
  id: string;
  taskId?: string;
  startTime: Date;
  endTime?: Date;
  duration: number;
  isBreak: boolean;
  completed: boolean;
}

export interface Space {
  id: string;
  name: string;
  theme: string;
  gridSize: { width: number; height: number; depth: number };
  cameraPosition: { x: number; y: number; z: number };
  environmentSettings: Record<string, any>;
}

interface AppState {
  // User state
  user: {
    id: string;
    email: string;
    username: string;
  } | null;
  
  // Tasks state
  tasks: Task[];
  selectedTaskId: string | null;
  
  // Pomodoro state
  activePomodoro: Pomodoro | null;
  pomodoroHistory: Pomodoro[];
  
  // Space state
  currentSpace: Space | null;
  spaces: Space[];
  
  // UI state
  isLoading: boolean;
  error: string | null;
  sidebarOpen: boolean;
  viewMode: '3d' | 'list' | 'kanban';
}

interface AppActions {
  // User actions
  setUser: (user: AppState['user']) => void;
  clearUser: () => void;
  
  // Task actions
  addTask: (task: Omit<Task, 'id'>) => void;
  updateTask: (id: string, updates: Partial<Task>) => void;
  deleteTask: (id: string) => void;
  setSelectedTask: (id: string | null) => void;
  
  // Pomodoro actions
  startPomodoro: (taskId?: string, duration?: number) => void;
  pausePomodoro: () => void;
  completePomodoro: () => void;
  cancelPomodoro: () => void;
  
  // Space actions
  setCurrentSpace: (space: Space) => void;
  updateSpaceSettings: (settings: Partial<Space>) => void;
  
  // UI actions
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  toggleSidebar: () => void;
  setViewMode: (mode: AppState['viewMode']) => void;
}

const initialState: AppState = {
  user: null,
  tasks: [],
  selectedTaskId: null,
  activePomodoro: null,
  pomodoroHistory: [],
  currentSpace: null,
  spaces: [],
  isLoading: false,
  error: null,
  sidebarOpen: true,
  viewMode: '3d',
};

export const useAppStore = create<AppState & AppActions>()(
  devtools(
    persist(
      (set, get) => ({
        ...initialState,
        
        // User actions
        setUser: (user) => set({ user }),
        clearUser: () => set({ user: null }),
        
        // Task actions
        addTask: (taskData) => {
          const newTask: Task = {
            ...taskData,
            id: crypto.randomUUID(),
          };
          set((state) => ({ tasks: [...state.tasks, newTask] }));
        },
        
        updateTask: (id, updates) => {
          set((state) => ({
            tasks: state.tasks.map((task) =>
              task.id === id ? { ...task, ...updates } : task
            ),
          }));
        },
        
        deleteTask: (id) => {
          set((state) => ({
            tasks: state.tasks.filter((task) => task.id !== id),
            selectedTaskId: state.selectedTaskId === id ? null : state.selectedTaskId,
          }));
        },
        
        setSelectedTask: (id) => set({ selectedTaskId: id }),
        
        // Pomodoro actions
        startPomodoro: (taskId, duration = 25) => {
          const pomodoro: Pomodoro = {
            id: crypto.randomUUID(),
            taskId,
            startTime: new Date(),
            duration,
            isBreak: false,
            completed: false,
          };
          set({ activePomodoro: pomodoro });
        },
        
        pausePomodoro: () => {
          // Implementation will be added with timer logic
        },
        
        completePomodoro: () => {
          const { activePomodoro } = get();
          if (activePomodoro) {
            const completedPomodoro: Pomodoro = {
              ...activePomodoro,
              endTime: new Date(),
              completed: true,
            };
            
            set((state) => ({
              activePomodoro: null,
              pomodoroHistory: [...state.pomodoroHistory, completedPomodoro],
            }));
            
            // Update task if linked
            if (activePomodoro.taskId) {
              const task = get().tasks.find((t) => t.id === activePomodoro.taskId);
              if (task) {
                get().updateTask(task.id, {
                  completedPomodoros: task.completedPomodoros + 1,
                });
              }
            }
          }
        },
        
        cancelPomodoro: () => set({ activePomodoro: null }),
        
        // Space actions
        setCurrentSpace: (space) => set({ currentSpace: space }),
        updateSpaceSettings: (settings) => {
          set((state) => ({
            currentSpace: state.currentSpace
              ? { ...state.currentSpace, ...settings }
              : null,
          }));
        },
        
        // UI actions
        setLoading: (loading) => set({ isLoading: loading }),
        setError: (error) => set({ error }),
        toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
        setViewMode: (mode) => set({ viewMode: mode }),
      }),
      {
        name: 'vibe-productivity-store',
        partialize: (state) => ({
          tasks: state.tasks,
          spaces: state.spaces,
          viewMode: state.viewMode,
          sidebarOpen: state.sidebarOpen,
        }),
      }
    )
  )
);