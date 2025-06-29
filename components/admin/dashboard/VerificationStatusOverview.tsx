"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { StatsCard } from "./StatsCard"
import { Clock, CheckCircle, Send, AlertTriangle } from "lucide-react"

interface VerificationStatusOverviewProps {
  stats: any
  isLoading: boolean
}

export function VerificationStatusOverview({ stats, isLoading }: VerificationStatusOverviewProps) {
  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-xl font-semibold text-gray-900">Verification Status Overview</h2>
        <p className="text-sm text-muted-foreground">Current status of all verification requests</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard
          title="Sent & Waiting"
          value={stats?.sentWaiting || 0}
          icon={Clock}
          trend={{
            value: stats?.trends?.sentWaiting?.value || 0,
            label: "from yesterday",
            direction: stats?.trends?.sentWaiting?.direction || "neutral",
          }}
          isLoading={isLoading}
          onClick={() => (window.location.href = "/admin/verifications?status=sent,in_progress")}
          helpText="Verification requests that have been sent to customers but not yet completed. Customers are currently working on connecting their bank accounts."
        />

        <StatsCard
          title="Completed & Ready"
          value={stats?.completedReady || 0}
          icon={CheckCircle}
          trend={{
            value: stats?.trends?.completedReady?.value || 0,
            label: "from yesterday", 
            direction: stats?.trends?.completedReady?.direction || "neutral",
          }}
          isLoading={isLoading}
          onClick={() => (window.location.href = "/admin/verifications?status=completed")}
          helpText="Customers who have successfully completed their bank verification. Click to view and download their financial data for your lending decision."
        />

        <StatsCard
          title="This Week Sent"
          value={stats?.weekSent || 0}
          icon={Send}
          trend={{
            value: stats?.trends?.weekSent?.value || 0,
            label: "vs last week",
            direction: stats?.trends?.weekSent?.direction || "neutral",
          }}
          isLoading={isLoading}
          helpText="Total verification requests sent to customers this week. Tracks your team's verification request volume."
        />

        <StatsCard
          title="Expired/Failed"
          value={stats?.expiredFailed || 0}
          icon={AlertTriangle}
          isLoading={isLoading}
          onClick={() => (window.location.href = "/admin/verifications?status=expired,failed")}
          helpText="Verification requests that expired before completion or failed due to technical issues. These customers may need to be re-sent verification requests."
        />
      </div>
    </div>
  )
} 