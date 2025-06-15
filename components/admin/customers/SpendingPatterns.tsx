"use client"

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { BarChart3, Repeat, AlertTriangle, CalendarClock } from "lucide-react"

// Assuming SpendingAnalysisData structure from useFinancialAnalytics hook
interface SpendingPatternsProps {
  data: any // Replace with specific SpendingAnalysisData type
}

// Function to format currency
const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(amount)
}

export function SpendingPatterns({ data }: SpendingPatternsProps) {
  if (!data || !data.spendingPatterns) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Spending Patterns</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">Spending patterns data not available.</p>
        </CardContent>
      </Card>
    )
  }

  const { spendingPatterns, recurringPayments } = data

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <BarChart3 className="h-5 w-5" />
          <span>Spending Patterns & Habits</span>
        </CardTitle>
        <CardDescription>Insights into recurring payments and spending behaviors.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Placeholder for Monthly Spending Trend Chart */}
        <div>
          <h4 className="text-sm font-semibold mb-1 text-muted-foreground">Monthly Spending Trend</h4>
          <div className="h-40 bg-gray-100 rounded-md flex items-center justify-center text-sm text-gray-400">
            Time Series Chart Placeholder (e.g., Recharts)
          </div>
        </div>

        {recurringPayments && recurringPayments.length > 0 && (
          <div>
            <h4 className="text-sm font-semibold mb-2 flex items-center">
              <Repeat className="h-4 w-4 mr-2 text-primary" />
              Identified Recurring Payments
            </h4>
            <ul className="space-y-1 text-xs border rounded-md p-2 max-h-48 overflow-y-auto">
              {recurringPayments.map((payment: { merchant: string; amount: number; category: string }, i: number) => (
                <li key={i} className="flex justify-between">
                  <span>
                    {payment.merchant} ({payment.category})
                  </span>
                  <span className="font-medium">{formatCurrency(payment.amount)}/mo</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {spendingPatterns.unusualAlerts && spendingPatterns.unusualAlerts.length > 0 && (
          <div>
            <h4 className="text-sm font-semibold mb-2 flex items-center text-red-600">
              <AlertTriangle className="h-4 w-4 mr-2" />
              Unusual Spending Alerts
            </h4>
            <ul className="space-y-1 text-xs text-red-700">
              {spendingPatterns.unusualAlerts.map((alert: string, i: number) => (
                <li key={i}>{alert}</li>
              ))}
            </ul>
          </div>
        )}
        {spendingPatterns.highestDay && (
          <div className="text-sm text-muted-foreground flex items-center">
            <CalendarClock className="h-4 w-4 mr-2" />
            Highest spending typically occurs on:{" "}
            <span className="font-semibold ml-1">{spendingPatterns.highestDay}s</span>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
