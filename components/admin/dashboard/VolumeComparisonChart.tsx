"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { LoadingSpinner } from "@/components/shared/LoadingSpinner"
import { BarChart3 } from "lucide-react"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts"

interface VolumeComparisonChartProps {
  isLoading?: boolean
}

export function VolumeComparisonChart({ isLoading = false }: VolumeComparisonChartProps) {
  // SpringFin Credit Union - Weekly Volume Growth
  // Shows increasing trend through spring lending season
  const mockData = [
    { week: "Feb Week 3", sent: 142, completed: 116 },
    { week: "Feb Week 4", sent: 158, completed: 129 },
    { week: "Mar Week 1", sent: 174, completed: 143 },
    { week: "Mar Week 2", sent: 189, completed: 155 },
    { week: "Mar Week 3", sent: 201, completed: 165 },
    { week: "Mar Week 4", sent: 218, completed: 178 } // Current week projection
  ]

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <BarChart3 className="h-5 w-5" />
            <span>Volume Comparison</span>
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
          <BarChart3 className="h-5 w-5" />
          <span>Volume Comparison</span>
        </CardTitle>
        <p className="text-sm text-muted-foreground">6-week growth trend - 53% volume increase during peak lending season</p>
      </CardHeader>
      <CardContent>
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={mockData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis 
                dataKey="week" 
                tick={{ fontSize: 12 }}
                tickLine={false}
                axisLine={false}
              />
              <YAxis 
                tick={{ fontSize: 12 }}
                tickLine={false}
                axisLine={false}
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'white',
                  border: '1px solid #e2e8f0',
                  borderRadius: '8px',
                  boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
                }}
              />
              <Legend />
              <Bar 
                dataKey="sent" 
                fill="#3b82f6"
                name="Sent"
                radius={[4, 4, 0, 0]}
              />
              <Bar 
                dataKey="completed" 
                fill="#10b981"
                name="Completed"
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
} 