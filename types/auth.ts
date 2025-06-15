export interface User {
  id: string
  email: string
  name: string
  role: "admin" | "agent" | "supervisor"
  permissions: Permission[]
  lastLogin?: string
  isActive: boolean
}

export interface Permission {
  resource: "verifications" | "customers" | "reports" | "settings"
  actions: ("create" | "read" | "update" | "delete")[]
}

export interface LoginRequest {
  email: string
  password: string
}

export interface LoginResponse {
  user: User
  token: string
  expiresAt: string
}
