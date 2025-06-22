"use client"
// Placeholder for Income Tab
import { useParams } from "next/navigation"
import { useFinancialAnalytics } from "@/hooks/useFinancialAnalytics"
import { LoadingSpinner } from "@/components/shared/LoadingSpinner"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertTriangle, TrendingUp } from "lucide-react"
import { IncomeAnalysis } from "@/components/admin/customers/IncomeAnalysis"

export default function CustomerIncomePage() {
  const params = useParams()
  const customerId = params.id as string
  const { incomeAnalysis, isLoading, error } = useFinancialAnalytics(customerId)

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-10">
        <LoadingSpinner size="md" />
        <p className="ml-3 text-muted-foreground">Loading income analysis...</p>
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

  if (!incomeAnalysis) {
    return (
      <Alert>
        <TrendingUp className="h-4 w-4" />
        <AlertTitle>No Income Data</AlertTitle>
        <AlertDescription>Income analysis data is not available for this customer.</AlertDescription>
      </Alert>
    )
  }

  return (
    <div className="space-y-6">
      <IncomeAnalysis data={incomeAnalysis} />
    </div>
  )
}
