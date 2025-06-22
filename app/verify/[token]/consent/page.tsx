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
    if (connectedAccounts.length > 0) {
      router.push(`/verify/${token}/complete`)
    } else {
      alert("Please connect at least one bank account to proceed.")
    }
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
            <>
              <Alert variant="default" className="bg-green-50 border-green-200 text-green-700">
                <CheckCircle className="h-5 w-5 text-green-600" />
                <AlertDescription className="font-medium">
                  Consent recorded successfully! Now please connect your bank account(s).
                </AlertDescription>
              </Alert>

              {connectedAccounts.length > 0 && (
                <Alert variant="default" className="bg-blue-50 border-blue-200 text-blue-700">
                  <CheckCircle className="h-5 w-5 text-blue-600" />
                  <AlertDescription className="font-medium">
                    {connectedAccounts.length} bank account(s) connected successfully! You can connect more or proceed to complete the verification.
                  </AlertDescription>
                </Alert>
              )}

              <div id="bank-connection-section">
                <BankConnectionWidget
                  onConnect={handleBankConnect}
                  isConnecting={isConnecting}
                  connectionError={connectionError}
                  stripeClientSecret={stripeClientSecret}
                  tellerConnectionUrl={tellerConnectionUrl}
                  onConnectionSuccess={handleConnectionSuccess}
                  onConnectionFailure={handleConnectionFailure}
                />
              </div>

              <div className="pt-6 border-t">
                <Button
                  onClick={proceedToComplete}
                  className="w-full"
                  size="lg"
                  disabled={connectedAccounts.length === 0 || isConnecting}
                >
                  {isConnecting ? "Connecting..." : "Complete Verification"}
                </Button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
