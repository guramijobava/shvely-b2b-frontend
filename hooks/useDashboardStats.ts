"use client"

import { useState, useEffect } from "react"

interface DashboardStats {
  // Verification Status Overview
  sentWaiting: number
  completedReady: number
  weekSent: number
  expiredFailed: number
  
  // Productivity Metrics
  successRate: number
  avgCompletionTime: string
  weekCompleted: number
  
  trends: {
    sentWaiting: { value: number; direction: "up" | "down" | "neutral" }
    completedReady: { value: number; direction: "up" | "down" | "neutral" }
    weekSent: { value: number; direction: "up" | "down" | "neutral" }
    successRate: { value: number; direction: "up" | "down" | "neutral" }
    avgCompletionTime: { value: number; direction: "up" | "down" | "neutral" }
    weekCompleted: { value: number; direction: "up" | "down" | "neutral" }
  }
}

interface ActivityItem {
  id: string
  type: "verification_sent" | "verification_completed" | "verification_expiring"
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
      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Mock stats data focused on verification workflow
      const mockStats: DashboardStats = {
        // Verification Status Overview
        sentWaiting: 23,      // Sent but not completed yet
        completedReady: 12,   // Completed and ready to view data
        weekSent: 87,         // Sent this week
        expiredFailed: 5,     // Expired or failed
        
        // Productivity Metrics
        successRate: 73,                // % of sent that get completed
        avgCompletionTime: "6.2 hours", // How long customers take
        weekCompleted: 64,              // Completed this week
        
        trends: {
          sentWaiting: { value: 15, direction: "up" },
          completedReady: { value: 8, direction: "up" },
          weekSent: { value: 12, direction: "up" },
          successRate: { value: 5, direction: "up" },
          avgCompletionTime: { value: -18, direction: "up" }, // Negative is good (faster)
          weekCompleted: { value: 22, direction: "up" }
        }
      }

      // Mock activity data focused on verification workflow
      const mockActivities: ActivityItem[] = [
        {
          id: "1",
          type: "verification_completed",
          title: "Verification Completed",
          description: "Customer completed bank account verification",
          timestamp: new Date(Date.now() - 1000 * 60 * 15).toISOString(), // 15 minutes ago
          status: "completed",
          customerName: "Sarah Johnson",
          href: "/admin/customers/cust_001",
        },
        {
          id: "2", 
          type: "verification_completed",
          title: "Verification Completed",
          description: "Customer completed bank account verification",
          timestamp: new Date(Date.now() - 1000 * 60 * 45).toISOString(), // 45 minutes ago
          status: "completed",
          customerName: "Michael Chen",
          href: "/admin/customers/cust_002",
        },
        {
          id: "3",
          type: "verification_sent",
          title: "Verification Sent",
          description: "New verification request sent to customer",
          timestamp: new Date(Date.now() - 1000 * 60 * 30).toISOString(), // 30 minutes ago
          status: "sent",
          customerName: "Jessica Williams",
          href: "/admin/verifications/ver_003",
        },
        {
          id: "4",
          type: "verification_sent", 
          title: "Verification Sent",
          description: "New verification request sent to customer",
          timestamp: new Date(Date.now() - 1000 * 60 * 60).toISOString(), // 1 hour ago
          status: "sent",
          customerName: "David Rodriguez",
          href: "/admin/verifications/ver_004",
        },
        {
          id: "5",
          type: "verification_expiring",
          title: "Verification Expiring",
          description: "Verification request expires in 2 days",
          timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(), // 2 hours ago
          status: "expiring",
          customerName: "Emily Thompson",
          href: "/admin/verifications/ver_005",
        }
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
