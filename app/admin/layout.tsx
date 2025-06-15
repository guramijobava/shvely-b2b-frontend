"use client"

import type React from "react"

import { useState } from "react"
import { useAuth } from "@/hooks/useAuth"
import { ProtectedRoute } from "@/components/auth/ProtectedRoute"
import { Sidebar } from "@/components/admin/Sidebar"
import { Header } from "@/components/admin/Header"
import { ErrorBoundary } from "@/components/shared/ErrorBoundary"
import { LoadingSpinner } from "@/components/shared/LoadingSpinner"

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false)
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false)
  const { isLoading } = useAuth()

  const toggleSidebar = () => {
    // On mobile, toggle the mobile sidebar
    if (window.innerWidth < 768) {
      setIsMobileSidebarOpen(!isMobileSidebarOpen)
    } else {
      // On desktop, toggle collapse state
      setIsSidebarCollapsed(!isSidebarCollapsed)
    }
  }

  const closeMobileSidebar = () => {
    setIsMobileSidebarOpen(false)
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  return (
    <ProtectedRoute
      requiredPermissions={[
        {
          resource: "verifications",
          actions: ["read"],
        },
      ]}
    >
      <div className="flex h-screen bg-gray-50">
        {/* Desktop Sidebar */}
        <div className="hidden md:block">
          <Sidebar isCollapsed={isSidebarCollapsed} onToggle={toggleSidebar} />
        </div>

        {/* Mobile Sidebar */}
        {isMobileSidebarOpen && (
          <>
            <div className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden" onClick={closeMobileSidebar} />
            <div className="fixed left-0 top-0 h-full z-50 md:hidden">
              <Sidebar isCollapsed={false} onToggle={closeMobileSidebar} className="h-full shadow-lg" />
            </div>
          </>
        )}

        {/* Main content area */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Header */}
          <Header onMenuToggle={toggleSidebar} isSidebarCollapsed={isSidebarCollapsed} />

          {/* Page content */}
          <main className="flex-1 overflow-auto">
            <ErrorBoundary>{children}</ErrorBoundary>
          </main>
        </div>
      </div>
    </ProtectedRoute>
  )
}
