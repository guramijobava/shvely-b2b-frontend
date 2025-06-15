"use client" // This is the Overview Tab content page

import { useParams } from "next/navigation"
import { useCustomer } from "@/hooks/useCustomer"
import { CreditScoreCard } from "@/components/admin/customers/CreditScoreCard"
import { FinancialHealthDashboard } from "@/components/admin/customers/FinancialHealthDashboard"
import { RiskIndicators } from "@/components/admin/customers/RiskIndicators"
import { LoadingSpinner } from "@/components/shared/LoadingSpinner"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertTriangle } from "lucide-react"

export default function CustomerOverviewPage() {
  const params = useParams()
  const customerId = params.id as string
  const { customer, isLoading, error } = useCustomer(customerId) // useCustomer fetches the full CustomerFinancialProfile

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-10">
        <LoadingSpinner size="md" />
        <p className="ml-3 text-muted-foreground">Loading overview...</p>
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

  if (!customer) {
    return (
      <Alert>
        <AlertTriangle className="h-4 w-4" />
        <AlertTitle>No Data</AlertTitle>
        <AlertDescription>Customer overview data is not available.</AlertDescription>
      </Alert>
    )
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <CreditScoreCard creditScoreData={customer.creditScore} />
        </div>
        <div className="lg:col-span-2">
          <FinancialHealthDashboard summary={customer.financialSummary} />
        </div>
      </div>
      <RiskIndicators riskData={customer.riskIndicators} />
    </div>
  )
}
