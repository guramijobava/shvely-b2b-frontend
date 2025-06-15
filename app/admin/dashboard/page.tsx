"use client"

import { StatsCard } from "@/components/admin/dashboard/StatsCard"
import { RecentActivity } from "@/components/admin/dashboard/RecentActivity"
import { useDashboardStats } from "@/hooks/useDashboardStats"
import { Button } from "@/components/ui/button"
import { RefreshCw, Plus } from "lucide-react"
import { FileCheck, Clock, CheckCircle, TrendingUp } from "lucide-react"
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
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-muted-foreground">
            Welcome back! Here's what's happening with your verification platform.
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <Button variant="outline" onClick={handleRefresh} disabled={isLoading}>
            <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? "animate-spin" : ""}`} />
            Refresh
          </Button>
          <Button asChild>
            <Link href="/admin/verifications/new">
              <Plus className="h-4 w-4 mr-2" />
              New Verification
            </Link>
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

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard
          title="Total Verifications"
          value={stats?.totalVerifications || 0}
          icon={FileCheck}
          trend={{
            value: stats?.trends.verifications.value || 0,
            label: "from last month",
            direction: stats?.trends.verifications.direction || "neutral",
          }}
          isLoading={isLoading}
          onClick={() => (window.location.href = "/admin/verifications")}
        />

        <StatsCard
          title="Pending Reviews"
          value={stats?.pendingReviews || 0}
          icon={Clock}
          isLoading={isLoading}
          onClick={() => (window.location.href = "/admin/verifications?status=pending")}
        />

        <StatsCard
          title="Active Verifications"
          value={stats?.activeVerifications || 0}
          icon={TrendingUp}
          isLoading={isLoading}
          onClick={() => (window.location.href = "/admin/verifications?status=in_progress")}
        />

        <StatsCard
          title="Completion Rate"
          value={stats ? `${stats.completionRate}%` : "0%"}
          icon={CheckCircle}
          trend={{
            value: stats?.trends.completionRate.value || 0,
            label: "from last month",
            direction: stats?.trends.completionRate.direction || "neutral",
          }}
          isLoading={isLoading}
        />
      </div>

      {/* Recent Activity - Full Width */}
      <div className="w-full">
        <RecentActivity activities={activities} isLoading={isLoading} />
      </div>
    </div>
  )
}
