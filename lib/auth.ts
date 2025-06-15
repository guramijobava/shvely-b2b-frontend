"use client"

import { apiClient } from "@/lib/api"
import type { User } from "@/lib/types"

export class AuthManager {
  private static instance: AuthManager
  private user: User | null = null
  private token: string | null = null

  private constructor() {}

  static getInstance(): AuthManager {
    if (!AuthManager.instance) {
      AuthManager.instance = new AuthManager()
    }
    return AuthManager.instance
  }

  async initialize(): Promise<User | null> {
    const token = this.getStoredToken()
    if (!token) return null

    try {
      apiClient.setToken(token)
      const user = await apiClient.getCurrentUser()
      this.setUser(user)
      this.setToken(token)
      return user
    } catch (error) {
      this.clearAuth()
      return null
    }
  }

  async login(email: string, password: string): Promise<User> {
    const response = await apiClient.login({ email, password })
    this.setUser(response.user)
    this.setToken(response.token)
    this.storeToken(response.token)
    return response.user
  }

  async logout(): Promise<void> {
    try {
      await apiClient.logout()
    } catch (error) {
      // Continue with logout even if API call fails
    }
    this.clearAuth()
  }

  getUser(): User | null {
    return this.user
  }

  getToken(): string | null {
    return this.token
  }

  isAuthenticated(): boolean {
    return !!this.user && !!this.token
  }

  private setUser(user: User): void {
    this.user = user
  }

  private setToken(token: string): void {
    this.token = token
    apiClient.setToken(token)
  }

  private storeToken(token: string): void {
    localStorage.setItem("auth_token", token)
  }

  private getStoredToken(): string | null {
    return localStorage.getItem("auth_token")
  }

  private clearAuth(): void {
    this.user = null
    this.token = null
    localStorage.removeItem("auth_token")
    apiClient.setToken("")
  }
}

export const authManager = AuthManager.getInstance()
