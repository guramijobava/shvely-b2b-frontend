"use client"

import { useState, useEffect } from "react"

interface DashboardStats {
  totalVerifications: number
  pendingReviews: number
  activeVerifications: number
  completionRate: number
  trends: {
    verifications: { value: number; direction: "up" | "down" | "neutral" }
    completionRate: { value: number; direction: "up" | "down" | "neutral" }
  }
}

interface ActivityItem {
  id: string
  type: "verification_sent" | "verification_completed" | "customer_registered"
  title: string
  description: string
  timestamp: string
  status?: string
  customerName?: string
  href?: string
}

export function useDashboardStats() {
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [activities, setActivities] = useState<ActivityItem[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchDashboardData = async () => {
    setIsLoading(true)
    setError(null)

    try {
      // In a real app, these would be actual API calls
      // For now, we'll use mock data

      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Mock stats data
      const mockStats: DashboardStats = {
        totalVerifications: 1247,
        pendingReviews: 23,
        activeVerifications: 45,
        completionRate: 87,
        trends: {
          verifications: { value: 12, direction: "up" },
          completionRate: { value: 3, direction: "up" },
        },
      }

      // Mock activity data
      const mockActivities: ActivityItem[] = [
        {
          id: "1",
          type: "verification_completed",
          title: "Verification Completed",
          description: "Bank account verification successfully completed",
          timestamp: new Date(Date.now() - 1000 * 60 * 15).toISOString(), // 15 minutes ago
          status: "completed",
          customerName: "John Smith",
          href: "/admin/verifications/1",
        },
        {
          id: "2",
          type: "verification_sent",
          title: "Verification Sent",
          description: "New verification request sent to customer",
          timestamp: new Date(Date.now() - 1000 * 60 * 30).toISOString(), // 30 minutes ago
          status: "sent",
          customerName: "Sarah Johnson",
          href: "/admin/verifications/2",
        },
        {
          id: "3",
          type: "customer_registered",
          title: "New Customer",
          description: "Customer profile created and verified",
          timestamp: new Date(Date.now() - 1000 * 60 * 60).toISOString(), // 1 hour ago
          customerName: "Mike Davis",
          href: "/admin/customers/3",
        },
      ]

      setStats(mockStats)
      setActivities(mockActivities)
    } catch (error) {
      setError(error instanceof Error ? error.message : "Failed to fetch dashboard data")
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchDashboardData()
  }, [])

  return {
    stats,
    activities,
    isLoading,
    error,
    refetch: fetchDashboardData,
  }
}
