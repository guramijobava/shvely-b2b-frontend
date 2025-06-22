"use client"

import { useParams } from "next/navigation"
import { useCustomer } from "@/hooks/useCustomer"
import { TriBureauCreditAssessment } from "@/components/admin/customers/TriBureauCreditAssessment"
import { LoadingSpinner } from "@/components/shared/LoadingSpinner"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertTriangle } from "lucide-react"

export default function CustomerCreditPage() {
  const params = useParams()
  const customerId = params.id as string
  const { customer, isLoading, error } = useCustomer(customerId)

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <LoadingSpinner size="lg" />
        <p className="ml-4 text-muted-foreground">Loading credit assessment...</p>
      </div>
    )
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertTriangle className="h-4 w-4" />
        <AlertTitle>Error Loading Credit Assessment</AlertTitle>
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    )
  }

  if (!customer) {
    return (
      <Alert>
        <AlertTriangle className="h-4 w-4" />
        <AlertTitle>Customer Not Found</AlertTitle>
        <AlertDescription>The requested customer profile could not be found.</AlertDescription>
      </Alert>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Credit Assessment</h2>
        <p className="text-muted-foreground">
          Comprehensive tri-bureau credit analysis for {customer.customerInfo.fullName}
        </p>
      </div>
      
      <TriBureauCreditAssessment customer={customer} />
    </div>
  )
} 