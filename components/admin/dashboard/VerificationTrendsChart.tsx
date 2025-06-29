"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { LoadingSpinner } from "@/components/shared/LoadingSpinner"
import { TrendingUp } from "lucide-react"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts"

interface VerificationTrendsChartProps {
  isLoading?: boolean
}

export function VerificationTrendsChart({ isLoading = false }: VerificationTrendsChartProps) {
  // SpringFin Credit Union - March 2024 Growth Pattern
  // Shows increasing volume during spring lending season
  const mockData = [
    { date: "Mar 1", completed: 14, sent: 18 },
    { date: "Mar 2", completed: 16, sent: 21 },
    { date: "Mar 3", completed: 12, sent: 15 }, // Weekend dip
    { date: "Mar 4", completed: 19, sent: 24 },
    { date: "Mar 5", completed: 22, sent: 27 },
    { date: "Mar 6", completed: 25, sent: 31 },
    { date: "Mar 7", completed: 21, sent: 26 },
    { date: "Mar 8", completed: 18, sent: 23 },
    { date: "Mar 9", completed: 17, sent: 20 }, // Weekend dip
    { date: "Mar 10", completed: 20, sent: 25 }, // Weekend dip
    { date: "Mar 11", completed: 26, sent: 32 }, // Spring pickup
    { date: "Mar 12", completed: 28, sent: 35 },
    { date: "Mar 13", completed: 24, sent: 30 },
    { date: "Mar 14", completed: 27, sent: 33 },
    { date: "Mar 15", completed: 23, sent: 29 }  // Current day
  ]

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <TrendingUp className="h-5 w-5" />
            <span>Verification Trends</span>
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
          <TrendingUp className="h-5 w-5" />
          <span>Verification Trends</span>
        </CardTitle>
        <p className="text-sm text-muted-foreground">Daily verification activity over the last 15 days</p>
      </CardHeader>
      <CardContent>
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={mockData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis 
                dataKey="date" 
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
              <Line 
                type="monotone" 
                dataKey="sent" 
                stroke="#3b82f6" 
                strokeWidth={3}
                dot={{ fill: '#3b82f6', strokeWidth: 0, r: 4 }}
                name="Sent"
                connectNulls
              />
              <Line 
                type="monotone" 
                dataKey="completed" 
                stroke="#10b981" 
                strokeWidth={3}
                dot={{ fill: '#10b981', strokeWidth: 0, r: 4 }}
                name="Completed"
                connectNulls
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
} 