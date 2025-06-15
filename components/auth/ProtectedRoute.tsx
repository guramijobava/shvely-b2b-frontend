"use client"

import type React from "react"

import { useAuth } from "@/hooks/useAuth"
import { LoadingSpinner } from "@/components/shared/LoadingSpinner"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Shield, AlertTriangle } from "lucide-react"
import Link from "next/link"

interface ProtectedRouteProps {
  children: React.ReactNode
  requiredPermissions?: {
    resource: string
    actions: string[]
  }[]
  requiredRole?: string
  fallback?: React.ReactNode
}

export function ProtectedRoute({ children, requiredPermissions = [], requiredRole, fallback }: ProtectedRouteProps) {
  const { user, isLoading, isAuthenticated } = useAuth()

  // Show loading spinner while checking authentication
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <LoadingSpinner size="lg" className="mb-4" />
          <p className="text-muted-foreground">Checking authentication...</p>
        </div>
      </div>
    )
  }

  // Show login prompt if not authenticated
  if (!isAuthenticated || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Card className="w-full max-w-md">
          <CardContent className="p-6 text-center">
            <Shield className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
            <h2 className="text-xl font-semibold mb-2">Authentication Required</h2>
            <p className="text-muted-foreground mb-4">You need to sign in to access this page.</p>
            <Button asChild>
              <Link href="/auth/login">Sign In</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  // Check role requirements
  if (requiredRole && user.role !== requiredRole) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Card className="w-full max-w-md">
          <CardContent className="p-6 text-center">
            <AlertTriangle className="mx-auto h-12 w-12 text-yellow-500 mb-4" />
            <h2 className="text-xl font-semibold mb-2">Access Denied</h2>
            <p className="text-muted-foreground mb-4">You don't have the required permissions to access this page.</p>
            <Button variant="outline" asChild>
              <Link href="/admin/dashboard">Go to Dashboard</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  // Check specific permissions
  if (requiredPermissions.length > 0) {
    const hasPermission = requiredPermissions.every((required) => {
      return user.permissions.some((permission) => {
        return (
          permission.resource === required.resource &&
          required.actions.every((action) => permission.actions.includes(action as any))
        )
      })
    })

    if (!hasPermission) {
      return (
        fallback || (
          <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <Card className="w-full max-w-md">
              <CardContent className="p-6 text-center">
                <AlertTriangle className="mx-auto h-12 w-12 text-yellow-500 mb-4" />
                <h2 className="text-xl font-semibold mb-2">Insufficient Permissions</h2>
                <p className="text-muted-foreground mb-4">
                  You don't have the required permissions to access this resource.
                </p>
                <Button variant="outline" asChild>
                  <Link href="/admin/dashboard">Go to Dashboard</Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        )
      )
    }
  }

  return <>{children}</>
}
