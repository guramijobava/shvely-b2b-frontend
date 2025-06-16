"use client"

import { useEffect } from "react"
import { useTokenValidation } from "@/hooks/useTokenValidation"
import { useBorrowerVerification } from "@/hooks/useBorrowerVerification"
import { WelcomeSection } from "@/components/borrower/WelcomeSection"
import { LoadingSpinner } from "@/components/shared/LoadingSpinner"
import { ErrorStateDisplay } from "@/components/borrower/ErrorStates"

export default function VerificationLandingPage() {
  const { token, isValidating, isValid, errorType, customerInfo, refetchValidation } = useTokenValidation()
  const { navigateToConsent, setCurrentStep } = useBorrowerVerification(token)

  useEffect(() => {
    setCurrentStep("welcome")
  }, [setCurrentStep])

  if (isValidating) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-200px)] text-center">
        <LoadingSpinner size="lg" className="mb-4" />
        <p className="text-lg font-medium">Validating your verification link...</p>
        <p className="text-muted-foreground">Please wait a moment.</p>
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

  const handleStartVerification = () => {
    navigateToConsent()
  }

  return (
    <div className="space-y-8">
      <WelcomeSection
        customerName={customerInfo.fullName}
        bankName={customerInfo.bankName || "Your Bank"}
        onProceed={handleStartVerification}
      />
    </div>
  )
}
