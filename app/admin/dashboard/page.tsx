"use client"

import { useDashboardStats } from "@/hooks/useDashboardStats"
import { Button } from "@/components/ui/button"
import { RefreshCw, Plus } from "lucide-react"
import { ProductivityMetrics } from "@/components/admin/dashboard/ProductivityMetrics"
import { RecentActivity } from "@/components/admin/dashboard/RecentActivity"
import { VerificationTrendsChart } from "@/components/admin/dashboard/VerificationTrendsChart"
import { StatusDistributionChart } from "@/components/admin/dashboard/StatusDistributionChart"
import { VolumeComparisonChart } from "@/components/admin/dashboard/VolumeComparisonChart"
import { WeeklyActivityChart } from "@/components/admin/dashboard/WeeklyActivityChart"
import Link from "next/link"

export default function DashboardPage() {
  const { stats, activities, isLoading, error, refetch } = useDashboardStats()

  const handleRefresh = () => {
    refetch()
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Verification Dashboard</h1>
          <p className="text-muted-foreground">
            Manage bank verification requests and track customer completion status.
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <Button asChild>
            <Link href="/admin/verifications/send">
              <Plus className="h-4 w-4 mr-2" />
              New Verification
            </Link>
          </Button>
          <Button variant="outline" onClick={handleRefresh} disabled={isLoading}>
            <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? "animate-spin" : ""}`} />
            Refresh
          </Button>
        </div>
      </div>

      {/* Error state */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-800">Error loading dashboard data: {error}</p>
          <Button variant="outline" size="sm" onClick={handleRefresh} className="mt-2">
            Try Again
          </Button>
        </div>
      )}

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <VerificationTrendsChart isLoading={isLoading} />
        <StatusDistributionChart stats={stats} isLoading={isLoading} />
        <VolumeComparisonChart isLoading={isLoading} />
        <WeeklyActivityChart isLoading={isLoading} />
      </div>

      {/* Simple Productivity Metrics */}
      <ProductivityMetrics stats={stats} isLoading={isLoading} />

      {/* Recent Activity */}
      <RecentActivity activities={activities} isLoading={isLoading} />
    </div>
  )
}
