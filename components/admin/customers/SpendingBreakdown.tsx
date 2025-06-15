"use client"

import type React from "react"

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { PieChartIcon, ShoppingBag, Utensils, Car, Home, HeartPulse, MoreHorizontal } from "lucide-react" // Changed PieChart to PieChartIcon, Ellipsis to MoreHorizontal
import { formatCurrency } from "@/lib/utils"

interface SpendingBreakdownProps {
  data: any
}

const categoryIcons: Record<string, React.ElementType> = {
  "Food & Dining": Utensils,
  Transportation: Car,
  Shopping: ShoppingBag,
  Housing: Home,
  "Bills & Utilities": Home,
  Healthcare: HeartPulse,
  Entertainment: PieChartIcon, // Changed to PieChartIcon
  Other: MoreHorizontal, // Changed from Ellipsis
}

export function SpendingBreakdown({ data }: SpendingBreakdownProps) {
  if (!data || !data.categories || data.categories.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Spending Category Breakdown</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">Spending breakdown data not available.</p>
        </CardContent>
      </Card>
    )
  }

  const { categories, totalMonthlySpending } = data

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <PieChartIcon className="h-5 w-5" /> {/* Changed to PieChartIcon */}
          <span>Spending Category Breakdown</span>
        </CardTitle>
        <CardDescription>
          Analysis of spending across different categories. Total: {formatCurrency(totalMonthlySpending || 0)}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="h-48 bg-gray-100 rounded-md flex items-center justify-center text-sm text-gray-400 mb-4">
          Spending Distribution Pie Chart Placeholder (e.g., Recharts)
        </div>

        <div className="space-y-2">
          {categories.map((cat: { name: string; amount: number; percentage: number; trend: string }, i: number) => {
            const Icon = categoryIcons[cat.name] || MoreHorizontal // Changed from Ellipsis
            return (
              <div key={i} className="flex items-center justify-between p-2 border-b last:border-b-0">
                <div className="flex items-center space-x-2">
                  <Icon className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm font-medium">{cat.name}</span>
                </div>
                <div className="text-right">
                  <p className="text-sm font-semibold">{formatCurrency(cat.amount)}</p>
                  <p className="text-xs text-muted-foreground">
                    {cat.percentage.toFixed(1)}% - Trend: {cat.trend}
                  </p>
                </div>
              </div>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}
