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

      // SpringFin Credit Union - March 2024 Growth Period
      const mockStats: DashboardStats = {
        // Current Status Overview
        sentWaiting: 47,      // Spring lending season - high volume
        completedReady: 28,   // Strong completion rate
        weekSent: 156,        // Busy week with mortgage season
        expiredFailed: 12,    // Low failure rate shows good processes
        
        // Productivity Metrics
        successRate: 82,                // Excellent completion rate
        avgCompletionTime: "4.3 hours", // Fast customer response
        weekCompleted: 128,             // High completion volume
        
        trends: {
          sentWaiting: { value: 23, direction: "up" },     // Growing demand
          completedReady: { value: 18, direction: "up" },  // More completions
          weekSent: { value: 31, direction: "up" },        // Seasonal increase
          successRate: { value: 7, direction: "up" },      // Improving processes
          avgCompletionTime: { value: -12, direction: "up" }, // Getting faster
          weekCompleted: { value: 26, direction: "up" }    // More throughput
        }
      }

      // Realistic Recent Activities - SpringFin Credit Union
      const mockActivities: ActivityItem[] = [
        {
          id: "1",
          type: "verification_completed",
          title: "Verification Completed",
          description: "Mortgage pre-approval verification completed",
          timestamp: new Date(Date.now() - 1000 * 60 * 8).toISOString(), // 8 minutes ago
          status: "completed",
          customerName: "Jennifer Martinez",
          href: "/admin/customers/cust_jennifer_martinez",
        },
        {
          id: "2", 
          type: "verification_completed",
          title: "Verification Completed",
          description: "Auto loan application verification completed",
          timestamp: new Date(Date.now() - 1000 * 60 * 22).toISOString(), // 22 minutes ago
          status: "completed",
          customerName: "Robert Chen",
          href: "/admin/customers/cust_robert_chen",
        },
        {
          id: "3",
          type: "verification_sent",
          title: "Verification Sent",
          description: "New checking account verification sent",
          timestamp: new Date(Date.now() - 1000 * 60 * 15).toISOString(), // 15 minutes ago
          status: "sent",
          customerName: "Amanda Johnson",
          href: "/admin/verifications/ver_amanda_johnson",
        },
        {
          id: "4",
          type: "verification_completed",
          title: "Verification Completed",
          description: "Home equity line verification completed",
          timestamp: new Date(Date.now() - 1000 * 60 * 45).toISOString(), // 45 minutes ago
          status: "completed",
          customerName: "Michael Thompson",
          href: "/admin/customers/cust_michael_thompson",
        },
        {
          id: "5",
          type: "verification_sent", 
          title: "Verification Sent",
          description: "Business loan verification sent",
          timestamp: new Date(Date.now() - 1000 * 60 * 35).toISOString(), // 35 minutes ago
          status: "sent",
          customerName: "Sarah Davis",
          href: "/admin/verifications/ver_sarah_davis",
        },
        {
          id: "6",
          type: "verification_expiring",
          title: "Verification Expiring",
          description: "Personal loan verification expires in 1 day",
          timestamp: new Date(Date.now() - 1000 * 60 * 60 * 3).toISOString(), // 3 hours ago
          status: "expiring",
          customerName: "David Wilson",
          href: "/admin/verifications/ver_david_wilson",
        },
        {
          id: "7",
          type: "verification_sent",
          title: "Verification Sent",
          description: "Refinance application verification sent",
          timestamp: new Date(Date.now() - 1000 * 60 * 50).toISOString(), // 50 minutes ago
          status: "sent",
          customerName: "Lisa Rodriguez",
          href: "/admin/verifications/ver_lisa_rodriguez",
        },
        {
          id: "8",
          type: "verification_expiring",
          title: "Verification Expiring",
          description: "Credit card application expires in 2 days",
          timestamp: new Date(Date.now() - 1000 * 60 * 60 * 4).toISOString(), // 4 hours ago
          status: "expiring",
          customerName: "Kevin Brown",
          href: "/admin/verifications/ver_kevin_brown",
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
