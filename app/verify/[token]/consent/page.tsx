"use client"

import { useEffect } from "react"
import { useTokenValidation } from "@/hooks/useTokenValidation"
import { useBorrowerVerification } from "@/hooks/useBorrowerVerification"
import { useBankConnection } from "@/hooks/useBankConnection" // To get connected accounts for preview
import { DataConsentForm } from "@/components/borrower/DataConsentForm"
import { DataPreview } from "@/components/borrower/DataPreview"
import { ProcessOverview } from "@/components/borrower/ProcessOverview"
import { LoadingSpinner } from "@/components/shared/LoadingSpinner"
import { ErrorStateDisplay } from "@/components/borrower/ErrorStates"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"

export default function ConsentPage() {
  const router = useRouter()
  const { token, isValidating, isValid, errorType, customerInfo, refetchValidation } = useTokenValidation()
  // Fetch connected accounts info for preview, assuming it's stored or re-fetchable
  // For simplicity, we'll mock it here or assume it's passed via state/context in a real app
  const { connectedAccounts } = useBankConnection(token) // This hook might need adjustment to persist/retrieve state across pages

  const { submitConsent, isSubmitting, error: submissionError, setCurrentStep } = useBorrowerVerification(token)

  useEffect(() => {
    setCurrentStep("consent")
  }, [setCurrentStep])

  if (isValidating) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-200px)] text-center">
        <LoadingSpinner size="lg" className="mb-4" />
        <p className="text-lg font-medium">Loading consent page...</p>
      </div>
    )
  }

  if (!isValid || !customerInfo) {
    return <ErrorStateDisplay errorType={errorType || "unknown"} onRetry={refetchValidation} />
  }

  const handleDecline = () => {
    // Redirect to an exit page or show a message
    router.push(`/verify/${token}/error?type=consent_declined`)
  }

  // Mock preview data based on connectedAccounts from useBankConnection
  const previewAccounts = connectedAccounts.map((acc) => ({
    bankName: acc.name.split(" ")[0] || "Connected Bank", // Simplistic parsing
    accountType: acc.name.includes("Checking") ? "Checking" : acc.name.includes("Savings") ? "Savings" : "Account",
    maskedAccountNumber: acc.last4,
    balance: "$X,XXX.XX", // Placeholder balance
  }))

  return (
    <div className="space-y-8">
      <ProcessOverview currentStep="consent" />

      <DataPreview bankName={customerInfo.bankName || "Your Bank"} connectedAccounts={previewAccounts} />

      <DataConsentForm
        bankName={customerInfo.bankName || "Your Bank"}
        customerName={customerInfo.fullName}
        onSubmit={submitConsent}
        onDecline={handleDecline}
        isSubmitting={isSubmitting}
      />
      {submissionError && <ErrorStateDisplay errorType="consent_failed" onRetry={() => submitConsent({})} />}
      <div className="pt-6 border-t">
        <Button variant="outline" onClick={() => router.back()} className="w-full sm:w-auto">
          Back to Bank Connection
        </Button>
      </div>
    </div>
  )
}
