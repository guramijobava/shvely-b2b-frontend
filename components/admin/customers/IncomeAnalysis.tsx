"use client"

import type React from "react"

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { TrendingUp, TrendingDown, Minus, Briefcase, CalendarClock, Percent } from "lucide-react"
import { formatCurrency } from "@/lib/utils"

// Assuming IncomeAnalysisData structure from useFinancialAnalytics hook
interface IncomeAnalysisProps {
  data: any // Replace with specific IncomeAnalysisData type
}

const MetricDisplay = ({
  label,
  value,
  unit,
  icon: Icon,
}: { label: string; value: string | number | undefined; unit?: string; icon?: React.ElementType }) => (
  <div>
    <p className="text-xs text-muted-foreground flex items-center">
      {Icon && <Icon className="h-3.5 w-3.5 mr-1" />}
      {label}
    </p>
    <p className="font-semibold">
      {value === undefined ? "N/A" : unit === "$" ? formatCurrency(value as number) : `${value}${unit || ""}`}
    </p>
  </div>
)

export function IncomeAnalysis({ data }: IncomeAnalysisProps) {
  if (!data || !data.primarySource) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Income Stream Analysis</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">Income analysis data not available.</p>
        </CardContent>
      </Card>
    )
  }

  const { primarySource, totalMonthlyIncome, history } = data
  const TrendIcon = primarySource.trend === "up" ? TrendingUp : primarySource.trend === "down" ? TrendingDown : Minus

  return (
    <Card>
      <CardHeader>
        <CardTitle>Income Stream Analysis</CardTitle>
        <CardDescription>Overview of the customer's primary income sources and stability.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Card className="p-4 bg-gray-50/50">
          <h3 className="font-semibold text-md mb-2 flex items-center">
            <Briefcase className="h-5 w-5 mr-2 text-primary" />
            Primary Income: {primarySource.name} ({primarySource.type})
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
            <MetricDisplay label="Avg. Amount" value={primarySource.averageAmount} unit="$" />
            <MetricDisplay label="Frequency" value={primarySource.frequency} icon={CalendarClock} />
            <MetricDisplay label="Stability Score" value={primarySource.stabilityScore} unit="/100" icon={Percent} />
            <div className="col-span-full md:col-span-1 flex items-center">
              <p className="text-xs text-muted-foreground mr-1">Trend:</p>
              <TrendIcon
                className={`h-4 w-4 ${primarySource.trend === "up" ? "text-green-500" : primarySource.trend === "down" ? "text-red-500" : ""}`}
              />
              <span className="ml-1 text-sm font-semibold capitalize">{primarySource.trend}</span>
            </div>
          </div>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t">
          <MetricDisplay label="Total Estimated Monthly Income" value={totalMonthlyIncome} unit="$" icon={TrendingUp} />
          {/* Placeholder for income history chart */}
          <div>
            <p className="text-xs text-muted-foreground mb-1">Income History (Last 3 Months - Simplified)</p>
            <div className="h-24 bg-gray-100 rounded flex items-end justify-around p-2">
              {history?.slice(-3).map((entry: { month: string; amount: number }, i: number) => (
                <div key={i} className="text-center text-xs">
                  <div
                    className="w-6 bg-green-500 hover:bg-green-600 mx-auto"
                    style={{ height: `${(entry.amount / (primarySource.averageAmount * 1.2)) * 100}%` }}
                  />
                  <p className="mt-1">{entry.month}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
