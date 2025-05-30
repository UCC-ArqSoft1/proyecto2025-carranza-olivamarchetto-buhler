import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import { jwtDecode } from 'jwt-decode'

// Cookie storage implementation
const cookieStorage = {
  getItem: (name) => {
    const value = `; ${document.cookie}`
    const parts = value.split(`; ${name}=`)
    if (parts.length === 2) {
      try {
        return JSON.parse(decodeURIComponent(parts.pop().split(';').shift()))
      } catch {
        return null
      }
    }
    return null
  },
  setItem: (name, value) => {
    const expires = new Date()
    expires.setTime(expires.getTime() + (7 * 24 * 60 * 60 * 1000)) // 7 days
    document.cookie = `${name}=${encodeURIComponent(JSON.stringify(value))}; expires=${expires.toUTCString()}; path=/; SameSite=Strict`
  },
  removeItem: (name) => {
    document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`
  }
}

export const useAuthStore = create(
  persist(
    (set, get) => ({
      token: null,
      user: null,
      isAuthenticated: false,

      login: (token) => {
        try {
          const decoded = jwtDecode(token)
          set({
            token,
            user: {
              id: decoded.user_id,
              role: decoded.role,
              username: decoded.username || decoded.sub
            },
            isAuthenticated: true
          })
          return true
        } catch (error) {
          console.error('Invalid token:', error)
          return false
        }
      },

      logout: () => {
        set({
          token: null,
          user: null,
          isAuthenticated: false
        })
      },

      checkAuth: () => {
        const { token } = get()
        if (token) {
          try {
            const decoded = jwtDecode(token)
            // Check if token is expired
            if (decoded.exp * 1000 < Date.now()) {
              get().logout()
              return false
            }
            return true
          } catch {
            get().logout()
            return false
          }
        }
        return false
      },

      getAuthHeader: () => {
        const { token } = get()
        return token ? `Bearer ${token}` : null
      }
    }),
    {
      name: 'gym-auth',
      storage: createJSONStorage(() => cookieStorage),
      partialize: (state) => ({
        token: state.token,
        user: state.user,
        isAuthenticated: state.isAuthenticated
      })
    }
  )
)
