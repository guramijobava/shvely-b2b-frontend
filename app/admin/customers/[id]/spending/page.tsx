"use client"
// Placeholder for Spending Tab
import { useParams } from "next/navigation"
import { useFinancialAnalytics } from "@/hooks/useFinancialAnalytics"
import { LoadingSpinner } from "@/components/shared/LoadingSpinner"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertTriangle, BarChartBig } from "lucide-react"
import { SpendingBreakdown } from "@/components/admin/customers/SpendingBreakdown" // To be created
import { SpendingPatterns } from "@/components/admin/customers/SpendingPatterns" // To be created

export default function CustomerSpendingPage() {
  const params = useParams()
  const customerId = params.id as string
  const { spendingAnalysis, isLoading, error } = useFinancialAnalytics(customerId)

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-10">
        <LoadingSpinner size="md" />
        <p className="ml-3 text-muted-foreground">Loading spending analysis...</p>
      </div>
    )
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertTriangle className="h-4 w-4" />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    )
  }

  if (!spendingAnalysis) {
    return (
      <Alert>
        <BarChartBig className="h-4 w-4" />
        <AlertTitle>No Spending Data</AlertTitle>
        <AlertDescription>Spending analysis data is not available for this customer.</AlertDescription>
      </Alert>
    )
  }

  return (
    <div className="space-y-6">
      <SpendingBreakdown data={spendingAnalysis} />
      <SpendingPatterns data={spendingAnalysis} />
    </div>
  )
}
