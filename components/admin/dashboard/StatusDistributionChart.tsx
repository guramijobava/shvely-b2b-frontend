"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { LoadingSpinner } from "@/components/shared/LoadingSpinner"
import { PieChart as PieChartIcon } from "lucide-react"
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts"

interface StatusDistributionChartProps {
  stats?: any
  isLoading?: boolean
}

export function StatusDistributionChart({ stats, isLoading = false }: StatusDistributionChartProps) {
  // Calculate data from stats with proper colors
  const data = [
    { 
      name: "Completed & Ready",
      value: stats?.completedReady || 12,
      color: "#10b981", // green
      description: "Ready to view financial data"
    },
    { 
      name: "Sent & Waiting",
      value: stats?.sentWaiting || 23,
      color: "#f59e0b", // amber
      description: "Customers working on verification"
    },
    { 
      name: "Expired/Failed",
      value: stats?.expiredFailed || 5,
      color: "#ef4444", // red
      description: "Need to be re-sent"
    }
  ]

  const total = data.reduce((sum, item) => sum + item.value, 0)

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <PieChartIcon className="h-5 w-5" />
            <span>Status Distribution</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-64">
            <LoadingSpinner size="md" />
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <PieChartIcon className="h-5 w-5" />
          <span>Status Distribution</span>
        </CardTitle>
        <p className="text-sm text-muted-foreground">Current verification status breakdown</p>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col lg:flex-row items-center gap-6">
          {/* Pie Chart on the left */}
          <div className="flex-shrink-0">
            <div className="h-48 w-48">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={data}
                    cx="50%"
                    cy="50%"
                    innerRadius={35}
                    outerRadius={75}
                    paddingAngle={2}
                    dataKey="value"
                  >
                    {data.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip 
                    formatter={(value: number) => [
                      `${value} (${((value / total) * 100).toFixed(1)}%)`,
                      'Verifications'
                    ]}
                    contentStyle={{ 
                      backgroundColor: 'white',
                      border: '1px solid #e2e8f0',
                      borderRadius: '8px',
                      boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Legend as cards on the right */}
          <div className="flex-1 space-y-3">
            {data.map((item, index) => (
              <div 
                key={index} 
                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200 hover:bg-gray-100 transition-colors"
              >
                <div className="flex items-center space-x-3">
                  <div 
                    className="w-4 h-4 rounded-full flex-shrink-0" 
                    style={{ backgroundColor: item.color }}
                  />
                  <div>
                    <div className="font-medium text-gray-900">{item.name}</div>
                    <div className="text-xs text-gray-500">{item.description}</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-xl font-bold" style={{ color: item.color }}>
                    {item.value}
                  </div>
                  <div className="text-xs text-gray-500">
                    {((item.value / total) * 100).toFixed(1)}%
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  )
} 