import axios from 'axios'
import { auth } from '@clerk/nextjs/server'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'

export const apiClient = axios.create({
  baseURL: `${API_URL}/api/v1`,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Request interceptor to add authentication token
apiClient.interceptors.request.use(
  async (config) => {
    if (typeof window === 'undefined') {
      // Server-side
      const { getToken } = await auth()
      const token = await getToken()
      if (token) {
        config.headers.Authorization = `Bearer ${token}`
      }
    } else {
      // Client-side
      const clerkInstance = (window as any).Clerk
      if (clerkInstance) {
        const token = await clerkInstance.session?.getToken()
        if (token) {
          config.headers.Authorization = `Bearer ${token}`
        }
      }
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Response interceptor for error handling
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Handle unauthorized access
      window.location.href = '/sign-in'
    }
    return Promise.reject(error)
  }
)

// API service methods
export const api = {
  // Tasks
  tasks: {
    getAll: () => apiClient.get('/tasks'),
    getById: (id: number) => apiClient.get(`/tasks/${id}`),
    create: (data: any) => apiClient.post('/tasks', data),
    update: (id: number, data: any) => apiClient.patch(`/tasks/${id}`, data),
    delete: (id: number) => apiClient.delete(`/tasks/${id}`),
  },
  
  // Users
  users: {
    getCurrentUser: () => apiClient.get('/users/me'),
    updateProfile: (data: any) => apiClient.patch('/users/me', data),
  },
  
  // Pomodoro
  pomodoro: {
    startSession: (data: any) => apiClient.post('/pomodoro/sessions', data),
    updateSession: (id: number, data: any) => apiClient.patch(`/pomodoro/sessions/${id}`, data),
    getActiveSessions: () => apiClient.get('/pomodoro/sessions/active'),
  },
  
  // Achievements
  achievements: {
    getAll: () => apiClient.get('/achievements'),
    getUserAchievements: () => apiClient.get('/achievements/user'),
  },
  
  // Space
  space: {
    getConfiguration: () => apiClient.get('/space/configuration'),
    updateConfiguration: (data: any) => apiClient.patch('/space/configuration', data),
  },
}