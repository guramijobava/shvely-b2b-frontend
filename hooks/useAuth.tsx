"use client"

import type React from "react"

import { useState, useEffect, createContext, useContext } from "react"
import type { User, LoginRequest } from "@/lib/types"
import { apiClient } from "@/lib/api"

interface AuthContextType {
  user: User | null
  isLoading: boolean
  login: (credentials: LoginRequest) => Promise<void>
  logout: () => Promise<void>
  isAuthenticated: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const initAuth = async () => {
      try {
        const token = localStorage.getItem("auth_token")
        console.log("Initializing auth, token:", !!token)

        if (token) {
          apiClient.setToken(token)
          try {
            const userData = await apiClient.getCurrentUser()
            console.log("Got user data:", userData)
            setUser(userData)
          } catch (error) {
            console.log("Failed to get user data:", error)
            localStorage.removeItem("auth_token")
          }
        }
      } catch (error) {
        console.error("Auth initialization error:", error)
      } finally {
        setIsLoading(false)
      }
    }

    initAuth()
  }, [])

  const login = async (credentials: LoginRequest) => {
    try {
      console.log("Attempting login with:", credentials.email)
      const response = await apiClient.login(credentials)
      console.log("Login response:", response)

      setUser(response.user)
      apiClient.setToken(response.token)
      localStorage.setItem("auth_token", response.token)

      console.log("Login successful, user set:", response.user)
    } catch (error) {
      console.error("Login error:", error)
      throw error
    }
  }

  const logout = async () => {
    try {
      await apiClient.logout()
    } catch (error) {
      console.log("Logout API call failed, continuing with local logout")
    }
    setUser(null)
    localStorage.removeItem("auth_token")
  }

  const value = {
    user,
    isLoading,
    login,
    logout,
    isAuthenticated: !!user,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
