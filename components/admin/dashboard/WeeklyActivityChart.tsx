"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { LoadingSpinner } from "@/components/shared/LoadingSpinner"
import { Calendar } from "lucide-react"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"

interface WeeklyActivityChartProps {
  isLoading?: boolean
}

export function WeeklyActivityChart({ isLoading = false }: WeeklyActivityChartProps) {
  // SpringFin Credit Union - Customer Completion Patterns
  // Shows realistic customer behavior - higher on weekdays, lower on weekends
  const mockData = [
    { day: "Mon", completions: 31 },
    { day: "Tue", completions: 35 },
    { day: "Wed", completions: 38 }, // Peak day
    { day: "Thu", completions: 33 },
    { day: "Fri", completions: 27 },
    { day: "Sat", completions: 18 }, // Weekend lower activity
    { day: "Sun", completions: 14 }
  ]

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Calendar className="h-5 w-5" />
            <span>Weekly Activity Pattern</span>
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
          <Calendar className="h-5 w-5" />
          <span>Weekly Activity Pattern</span>
        </CardTitle>
        <p className="text-sm text-muted-foreground">Customer completion activity by day of week</p>
      </CardHeader>
      <CardContent>
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={mockData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis 
                dataKey="day" 
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
                formatter={(value: number) => [`${value} completions`, 'Completions']}
                contentStyle={{ 
                  backgroundColor: 'white',
                  border: '1px solid #e2e8f0',
                  borderRadius: '8px',
                  boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
                }}
              />
              <Bar 
                dataKey="completions" 
                fill="#8b5cf6"
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
        
        {/* Business Insight */}
        <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
          <p className="text-sm text-blue-800">
            <strong>💡 Business Insight:</strong> Send verifications Monday-Wednesday for optimal completion rates. 82% of customers complete within 2 business days.
          </p>
        </div>
      </CardContent>
    </Card>
  )
} 