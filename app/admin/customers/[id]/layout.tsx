"use client"

import type React from "react"

import { useParams } from "next/navigation"
import { useCustomer } from "@/hooks/useCustomer"
import { CustomerProfileHeader } from "@/components/admin/customers/CustomerProfileHeader"
import { CustomerTabs } from "@/components/admin/customers/CustomerTabs"
import { LoadingSpinner } from "@/components/shared/LoadingSpinner"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertTriangle } from "lucide-react"
import { ErrorBoundary } from "@/components/shared/ErrorBoundary"

export default function CustomerProfileLayout({ children }: { children: React.ReactNode }) {
  const params = useParams()
  const customerId = params.id as string
  const { customer, isLoading, error } = useCustomer(customerId)

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-200px)]">
        <LoadingSpinner size="lg" />
        <p className="ml-4 text-muted-foreground">Loading customer profile...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="p-6">
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Error Loading Profile</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      </div>
    )
  }

  if (!customer) {
    return (
      <div className="p-6">
        <Alert>
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Customer Not Found</AlertTitle>
          <AlertDescription>The requested customer profile could not be found.</AlertDescription>
        </Alert>
      </div>
    )
  }

  return (
    <div className="p-6 space-y-6">
      <CustomerProfileHeader customer={customer} />
      <CustomerTabs customerId={customerId} />
      <ErrorBoundary
        fallback={
          <Alert variant="destructive" className="mt-6">
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>Content Error</AlertTitle>
            <AlertDescription>There was an error rendering this section of the profile.</AlertDescription>
          </Alert>
        }
      >
        <div className="mt-6">{children}</div>
      </ErrorBoundary>
    </div>
  )
}
