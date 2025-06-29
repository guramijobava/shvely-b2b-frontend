"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { StatsCard } from "./StatsCard"
import { TrendingUp, Clock, Target } from "lucide-react"

interface ProductivityMetricsProps {
  stats: any
  isLoading: boolean
}

export function ProductivityMetrics({ stats, isLoading }: ProductivityMetricsProps) {
  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-xl font-semibold text-gray-900">Productivity Metrics</h2>
        <p className="text-sm text-muted-foreground">Simple tracking of verification request performance</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatsCard
          title="Success Rate"
          value={stats ? `${stats.successRate}%` : "0%"}
          icon={Target}
          trend={{
            value: stats?.trends?.successRate?.value || 0,
            label: "vs last week",
            direction: stats?.trends?.successRate?.direction || "neutral",
          }}
          isLoading={isLoading}
          helpText="Percentage of sent verification requests that customers successfully complete. A good success rate is 65-80%. Low rates may indicate confusing instructions or technical problems."
        />

        <StatsCard
          title="Avg Completion Time"
          value={stats?.avgCompletionTime || "0 hours"}
          icon={Clock}
          trend={{
            value: stats?.trends?.avgCompletionTime?.value || 0,
            label: "vs last week",
            direction: stats?.trends?.avgCompletionTime?.direction || "neutral",
          }}
          isLoading={isLoading}
          helpText="Average time it takes customers to complete verification after receiving the request. Typical completion time is 2-24 hours. Longer times may indicate the process is too complex."
        />

        <StatsCard
          title="Weekly Completed"
          value={stats?.weekCompleted || 0}
          icon={TrendingUp}
          trend={{
            value: stats?.trends?.weekCompleted?.value || 0,
            label: "vs last week",
            direction: stats?.trends?.weekCompleted?.direction || "neutral",
          }}
          isLoading={isLoading}
          helpText="Number of verification requests completed by customers this week. Shows the volume of financial data you're gathering for lending decisions."
        />
      </div>
    </div>
  )
} 