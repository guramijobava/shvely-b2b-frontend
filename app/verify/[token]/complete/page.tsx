"use client"

import { useEffect, useState } from "react"
import { useTokenValidation } from "@/hooks/useTokenValidation"
import { useBorrowerVerification } from "@/hooks/useBorrowerVerification"
import { CompletionSuccess } from "@/components/borrower/CompletionSuccess"
import { NextSteps } from "@/components/borrower/NextSteps"
import { DownloadConfirmation } from "@/components/borrower/DownloadConfirmation"
import { ProcessOverview } from "@/components/borrower/ProcessOverview"
import { LoadingSpinner } from "@/components/shared/LoadingSpinner"
import { ErrorStateDisplay } from "@/components/borrower/ErrorStates"
import { borrowerApiClient } from "@/lib/borrower-api" // For fetching completion details

interface CompletionDetails {
  timestamp: string
  connectedAccountsCount: number
}

export default function CompletionPage() {
  const { token, isValidating, isValid, errorType, customerInfo, refetchValidation } = useTokenValidation()
  const { finalizeVerification, isSubmitting, error: submissionError, setCurrentStep } = useBorrowerVerification(token)
  const [completionDetails, setCompletionDetails] = useState<CompletionDetails | null>(null)
  const [isLoadingDetails, setIsLoadingDetails] = useState(true)

  useEffect(() => {
    setCurrentStep("complete")
    if (isValid && token) {
      // Only finalize if token is valid
      finalizeVerification() // Call this to mark verification as complete on backend

      // Fetch completion details (mocked here, should be from API response of finalize or separate call)
      borrowerApiClient
        .completeVerification(token) // Re-calling to get details, ideally from finalizeVerification's response
        .then((response) => {
          if (response.success && response.completionDetails) {
            setCompletionDetails(response.completionDetails)
          } else {
            // Fallback if details not in response
            setCompletionDetails({ timestamp: new Date().toISOString(), connectedAccountsCount: 1 }) // Default mock
          }
        })
        .catch(() => setCompletionDetails({ timestamp: new Date().toISOString(), connectedAccountsCount: 1 })) // Error fallback
        .finally(() => setIsLoadingDetails(false))
    } else if (!isValidating && !isValid) {
      // If token validation failed before reaching here (e.g. direct navigation)
      setIsLoadingDetails(false)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isValid, token, setCurrentStep]) // finalizeVerification removed to prevent re-trigger loop if it's not stable

  if (isValidating || (isValid && isLoadingDetails)) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-200px)] text-center">
        <LoadingSpinner size="lg" className="mb-4" />
        <p className="text-lg font-medium">Finalizing your verification...</p>
      </div>
    )
  }

  // Map error types from useTokenValidation to ErrorStateDisplay expected types
  const mapErrorType = (type: string | null): "invalid_token" | "expired_token" | "network_error" | "unknown" => {
    switch (type) {
      case "invalid":
        return "invalid_token"
      case "expired":
        return "expired_token"
      case "network":
        return "network_error"
      default:
        return "unknown"
    }
  }

  if (!isValid || !customerInfo) {
    return <ErrorStateDisplay errorType={mapErrorType(errorType)} onRetry={refetchValidation} />
  }

  if (submissionError) {
    return <ErrorStateDisplay errorType="completion_failed" onRetry={finalizeVerification} />
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <ProcessOverview currentStep="complete" />
      
      {/* Main content area with responsive padding */}
      <div className="lg:pl-0 pt-0 lg:pt-8">
        <div className="max-w-4xl mx-auto p-6 space-y-8">
          <CompletionSuccess
            customerName={customerInfo.fullName}
            bankName={customerInfo.bankName || "Your Bank"}
            completionTime={completionDetails?.timestamp}
            connectedAccountsCount={completionDetails?.connectedAccountsCount}
          />
          <NextSteps bankName={customerInfo.bankName || "Your Bank"} />
          <DownloadConfirmation verificationId={token} customerEmail={customerInfo.email} />
        </div>
      </div>
    </div>
  )
}
