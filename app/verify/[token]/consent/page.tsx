"use client"

import { useEffect, useState } from "react"
import { useTokenValidation } from "@/hooks/useTokenValidation"
import { useBorrowerVerification } from "@/hooks/useBorrowerVerification"
import { useBankConnection } from "@/hooks/useBankConnection"
import { DataConsentForm } from "@/components/borrower/DataConsentForm"
import { BankConnectionWidget } from "@/components/borrower/BankConnectionWidget"
import { ProcessOverview } from "@/components/borrower/ProcessOverview"
import { LoadingSpinner } from "@/components/shared/LoadingSpinner"
import { ErrorStateDisplay } from "@/components/borrower/ErrorStates"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { CheckCircle } from "lucide-react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"

export default function ConsentPage() {
  const router = useRouter()
  const { token, isValidating, isValid, errorType, customerInfo, refetchValidation } = useTokenValidation()
  const { submitConsent, isSubmitting, error: submissionError, setCurrentStep } = useBorrowerVerification(token)
  const {
    initiateConnection,
    isConnecting,
    connectionError,
    connectedAccounts,
    stripeClientSecret,
    tellerConnectionUrl,
    handleConnectionSuccess,
    handleConnectionFailure,
  } = useBankConnection(token)
  
  const [consentGiven, setConsentGiven] = useState(false)

  useEffect(() => {
    setCurrentStep("consent")
  }, [setCurrentStep])

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

  if (isValidating) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-200px)] text-center">
        <LoadingSpinner size="lg" className="mb-4" />
        <p className="text-lg font-medium">Loading consent page...</p>
      </div>
    )
  }

  if (!isValid || !customerInfo) {
    return <ErrorStateDisplay errorType={mapErrorType(errorType)} onRetry={refetchValidation} />
  }

  const handleConsentSubmit = async (consentData: any) => {
    try {
      await submitConsent(consentData)
      setConsentGiven(true)
      
      // Show success toast
      toast.success("Consent recorded successfully!", {
        description: "Now please connect your bank account(s).",
        duration: 4000,
      })
      
      // Smooth scroll to bank connection section
      setTimeout(() => {
        const bankConnectionSection = document.getElementById("bank-connection-section")
        if (bankConnectionSection) {
          bankConnectionSection.scrollIntoView({ behavior: "smooth" })
        }
      }, 100)
    } catch (error) {
      // Error is handled by the submitConsent function
    }
  }

  const handleDecline = () => {
    router.push(`/verify/${token}/error?type=consent_declined`)
  }

  const proceedToComplete = () => {
    router.push(`/verify/${token}/complete`)
  }

  // Adapter function to match BankConnectionWidget's expected signature
  const handleBankConnect = (bankId: string, provider: "stripe" | "teller") => {
    initiateConnection(provider)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <ProcessOverview currentStep={consentGiven ? "connect" : "consent"} />
      
      {/* Main content area with responsive padding */}
      <div className="lg:pl-0 pt-0 lg:pt-8">
        <div className="max-w-4xl mx-auto p-6 space-y-8">
          {!consentGiven ? (
            <>
              <DataConsentForm
                bankName={customerInfo.bankName || "Your Bank"}
                customerName={customerInfo.fullName}
                onSubmit={handleConsentSubmit}
                onDecline={handleDecline}
                isSubmitting={isSubmitting}
              />
              {submissionError && <ErrorStateDisplay errorType="consent_failed" onRetry={() => handleConsentSubmit({})} />}
              
              <div className="pt-6 border-t">
                <Button variant="outline" onClick={() => router.back()} className="w-full sm:w-auto">
                  Back to Welcome
                </Button>
              </div>
            </>
          ) : (
            <div id="bank-connection-section">
              <BankConnectionWidget
                onConnect={handleBankConnect}
                isConnecting={isConnecting}
                connectionError={connectionError}
                stripeClientSecret={stripeClientSecret}
                tellerConnectionUrl={tellerConnectionUrl}
                onConnectionSuccess={handleConnectionSuccess}
                onConnectionFailure={handleConnectionFailure}
                onComplete={proceedToComplete}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
