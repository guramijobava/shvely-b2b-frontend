"use client"

import { useEffect } from "react"
import { useTokenValidation } from "@/hooks/useTokenValidation"
import { useBankConnection } from "@/hooks/useBankConnection"
import { useBorrowerVerification } from "@/hooks/useBorrowerVerification"
import { WelcomeSection } from "@/components/borrower/WelcomeSection"
import { ProcessOverview } from "@/components/borrower/ProcessOverview"
import { BankConnectionWidget } from "@/components/borrower/BankConnectionWidget"
import { LoadingSpinner } from "@/components/shared/LoadingSpinner"
import { ErrorStateDisplay } from "@/components/borrower/ErrorStates"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { CheckCircle } from "lucide-react"

export default function VerificationLandingPage() {
  const { token, isValidating, isValid, errorType, customerInfo, refetchValidation } = useTokenValidation()
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
  const { navigateToConsent, setCurrentStep } = useBorrowerVerification(token)

  useEffect(() => {
    setCurrentStep("connect")
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

  if (!isValid || !customerInfo) {
    return <ErrorStateDisplay errorType={errorType || "unknown"} onRetry={refetchValidation} />
  }

  const proceedToConsent = () => {
    if (connectedAccounts.length > 0) {
      navigateToConsent()
    } else {
      // This case should ideally be handled by disabling the button
      // or showing a specific message in BankConnectionWidget
      alert("Please connect at least one bank account to proceed.")
    }
  }

  return (
    <div className="space-y-8">
      <WelcomeSection
        customerName={customerInfo.fullName}
        bankName={customerInfo.bankName || "Your Bank"}
        onProceed={() => {
          /* Logic to show bank connection */
        }}
      />

      <ProcessOverview currentStep="connect" />

      {connectedAccounts.length > 0 && (
        <Alert variant="default" className="bg-green-50 border-green-200 text-green-700">
          <CheckCircle className="h-5 w-5 text-green-600" />
          <AlertDescription className="font-medium">
            {connectedAccounts.length} bank account(s) connected successfully! You can connect more or proceed to the
            next step.
          </AlertDescription>
        </Alert>
      )}

      <BankConnectionWidget
        onConnect={initiateConnection}
        isConnecting={isConnecting}
        connectionError={connectionError}
        stripeClientSecret={stripeClientSecret}
        tellerConnectionUrl={tellerConnectionUrl}
        onConnectionSuccess={handleConnectionSuccess}
        onConnectionFailure={handleConnectionFailure}
      />

      <div className="pt-6 border-t">
        <Button
          onClick={proceedToConsent}
          className="w-full"
          size="lg"
          disabled={connectedAccounts.length === 0 || isConnecting}
        >
          {isConnecting ? "Connecting..." : "Continue to Consent"}
        </Button>
      </div>
    </div>
  )
}
