import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface UIState {
  theme: 'light' | 'dark' | 'system'
  sidebarOpen: boolean
  language: 'en' | 'zh'
  notifications: {
    email: boolean
    push: boolean
    marketing: boolean
  }
  
  // Actions
  setTheme: (theme: 'light' | 'dark' | 'system') => void
  toggleSidebar: () => void
  setSidebarOpen: (open: boolean) => void
  setLanguage: (language: 'en' | 'zh') => void
  updateNotifications: (notifications: Partial<UIState['notifications']>) => void
}

export const useUIStore = create<UIState>()(
  persist(
    (set) => ({
      theme: 'system',
      sidebarOpen: false,
      language: 'en',
      notifications: {
        email: true,
        push: true,
        marketing: false
      },

      setTheme: (theme) => set({ theme }),

      toggleSidebar: () => set((state) => ({ 
        sidebarOpen: !state.sidebarOpen 
      })),

      setSidebarOpen: (sidebarOpen) => set({ sidebarOpen }),

      setLanguage: (language) => set({ language }),

      updateNotifications: (newNotifications) => set((state) => ({
        notifications: { ...state.notifications, ...newNotifications }
      }))
    }),
    {
      name: 'ui-storage'
    }
  )
)