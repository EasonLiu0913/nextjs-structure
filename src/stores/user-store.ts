import { create } from 'zustand'

interface UserProfile {
  name: string
  email: string
  phone?: string
  bio?: string
  website?: string
  location?: string
  avatar?: string
}

interface UserPreferences {
  language: 'en' | 'zh'
  theme: 'light' | 'dark' | 'system'
  notifications: {
    email: boolean
    push: boolean
    marketing: boolean
  }
  privacy: {
    profilePublic: boolean
    showEmail: boolean
    allowMessages: boolean
  }
}

interface UserState {
  profile: UserProfile | null
  preferences: UserPreferences | null
  isLoading: boolean
  error: string | null
  
  // Actions
  setProfile: (profile: UserProfile) => void
  updateProfile: (updates: Partial<UserProfile>) => void
  setPreferences: (preferences: UserPreferences) => void
  updatePreferences: (updates: Partial<UserPreferences>) => void
  setLoading: (loading: boolean) => void
  setError: (error: string | null) => void
  clearError: () => void
  reset: () => void
}

export const useUserStore = create<UserState>((set) => ({
  profile: null,
  preferences: null,
  isLoading: false,
  error: null,

  setProfile: (profile) => set({ profile, error: null }),

  updateProfile: (updates) => set((state) => ({
    profile: state.profile ? { ...state.profile, ...updates } : null
  })),

  setPreferences: (preferences) => set({ preferences, error: null }),

  updatePreferences: (updates) => set((state) => ({
    preferences: state.preferences ? { ...state.preferences, ...updates } : null
  })),

  setLoading: (isLoading) => set({ isLoading }),

  setError: (error) => set({ error }),

  clearError: () => set({ error: null }),

  reset: () => set({
    profile: null,
    preferences: null,
    isLoading: false,
    error: null
  })
}))