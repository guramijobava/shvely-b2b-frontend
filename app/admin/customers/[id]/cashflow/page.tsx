"use client"

import { useParams } from "next/navigation"
import { useCustomer } from "@/hooks/useCustomer"
import { CashflowCoverageCard } from "@/components/admin/customers/CashflowCoverageCard"
import { LoadingSpinner } from "@/components/shared/LoadingSpinner"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertTriangle } from "lucide-react"

export default function CustomerCashflowPage() {
  const params = useParams()
  const customerId = params.id as string
  const { customer, isLoading, error } = useCustomer(customerId)

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <LoadingSpinner size="lg" />
        <p className="ml-4 text-muted-foreground">Loading cashflow analysis...</p>
      </div>
    )
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertTriangle className="h-4 w-4" />
        <AlertTitle>Error Loading Cashflow Data</AlertTitle>
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    )
  }

  if (!customer) {
    return (
      <Alert>
        <AlertTriangle className="h-4 w-4" />
        <AlertTitle>Customer Not Found</AlertTitle>
        <AlertDescription>Unable to load customer cashflow data.</AlertDescription>
      </Alert>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Cashflow Coverage Analysis</h2>
          <p className="text-muted-foreground">
            Comprehensive liability coverage and cashflow risk assessment for {customer.customerInfo.fullName}
          </p>
        </div>
      </div>
      
      <CashflowCoverageCard financialProfile={customer} />
    </div>
  )
} 