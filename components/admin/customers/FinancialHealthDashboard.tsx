"use client"

import type React from "react"

import type { CustomerFinancialProfile } from "@/lib/types"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { TrendingUp, CircleDollarSign, Landmark, AlertCircle, CalendarDays } from "lucide-react"
import { formatCurrency } from "@/lib/utils"

interface FinancialHealthDashboardProps {
  summary?: CustomerFinancialProfile["financialSummary"]
}

const MetricCard = ({
  title,
  value,
  icon: Icon,
  trend,
  unit,
  goodThreshold,
  badThreshold,
  lowerIsBetter,
}: {
  title: string
  value?: number | string
  icon: React.ElementType
  trend?: "up" | "down" | "stable"
  unit?: string
  goodThreshold?: number
  badThreshold?: number
  lowerIsBetter?: boolean
}) => {
  let valueColor = "text-gray-900"
  if (typeof value === "number" && goodThreshold !== undefined && badThreshold !== undefined) {
    if (lowerIsBetter) {
      if (value <= goodThreshold) valueColor = "text-green-600"
      else if (value >= badThreshold) valueColor = "text-red-600"
    } else {
      if (value >= goodThreshold) valueColor = "text-green-600"
      else if (value <= badThreshold) valueColor = "text-red-600"
    }
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
        <Icon className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className={`text-2xl font-bold ${valueColor}`}>
          {typeof value === "number" && unit === "$" ? formatCurrency(value) : value}
          {typeof value === "number" && unit && unit !== "$" ? ` ${unit}` : ""}
          {value === undefined || value === null ? "N/A" : ""}
        </div>
        {/* Add trend indicator if needed */}
      </CardContent>
    </Card>
  )
}

export function FinancialHealthDashboard({ summary }: FinancialHealthDashboardProps) {
  if (!summary) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Financial Health</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">Financial summary data not available.</p>
        </CardContent>
      </Card>
    )
  }

  const debtToIncomeRatio =
    summary.monthlyIncome > 0 ? ((summary.monthlyExpenses / summary.monthlyIncome) * 100).toFixed(1) : "N/A"

  return (
    <Card>
      <CardHeader>
        <CardTitle>Financial Health Dashboard</CardTitle>
      </CardHeader>
      <CardContent className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <MetricCard
          title="Monthly Income"
          value={summary.monthlyIncome}
          icon={CircleDollarSign}
          unit="$"
          goodThreshold={5000}
          badThreshold={2000}
        />
        <MetricCard
          title="Monthly Expenses"
          value={summary.monthlyExpenses}
          icon={CircleDollarSign}
          unit="$"
          goodThreshold={3000}
          badThreshold={6000}
          lowerIsBetter
        />
        <MetricCard
          title="Net Cash Flow"
          value={summary.netCashFlow}
          icon={TrendingUp}
          unit="$"
          goodThreshold={1000}
          badThreshold={100}
        />
        <MetricCard
          title="Debt-to-Income"
          value={debtToIncomeRatio !== "N/A" ? Number.parseFloat(debtToIncomeRatio) : undefined}
          unit="%"
          icon={Landmark}
          goodThreshold={30}
          badThreshold={50}
          lowerIsBetter
        />
        <MetricCard
          title="Overdrafts (Last 90d)"
          value={summary.overdraftCount}
          icon={AlertCircle}
          goodThreshold={0}
          badThreshold={3}
          lowerIsBetter
        />
        <MetricCard
          title="Avg. Account Age"
          value={summary.accountAge}
          icon={CalendarDays}
          unit="yrs"
          goodThreshold={5}
          badThreshold={1}
        />
      </CardContent>
    </Card>
  )
}
