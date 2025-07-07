"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { useTokenValidation } from "@/hooks/useTokenValidation"
import { useBorrowerVerification } from "@/hooks/useBorrowerVerification"
import { getRequiredCustomerInfoFields } from "@/lib/verification-utils"
import { ProcessOverview } from "@/components/borrower/ProcessOverview"
import { CustomerInfoForm } from "@/components/borrower/CustomerInfoForm"
import { LoadingSpinner } from "@/components/shared/LoadingSpinner"
import { ErrorStateDisplay } from "@/components/borrower/ErrorStates"

export default function CustomerInfoPage() {
  const params = useParams()
  const router = useRouter()
  const token = params.token as string
  
  const { isValid, customerInfo, isValidating, errorType, refetchValidation } = useTokenValidation()
  const { updateCustomerInfo, setCurrentStep } = useBorrowerVerification(token)
  
  const [missingFields, setMissingFields] = useState<string[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    setCurrentStep("customer-info")
  }, [setCurrentStep])

  useEffect(() => {
    if (customerInfo) {
      const required = getRequiredCustomerInfoFields(customerInfo)
      setMissingFields(required)
      
      // If no fields missing, skip to consent
      if (required.length === 0) {
        router.push(`/verify/${token}/consent`)
      }
    }
  }, [customerInfo, token, router])

  const handleSubmit = async (data: any) => {
    setIsSubmitting(true)
    setError(null)
    
    try {
      await updateCustomerInfo(data)
      router.push(`/verify/${token}/consent`)
    } catch (error) {
      console.error("Failed to update customer info:", error)
      setError(error instanceof Error ? error.message : "Failed to update customer information")
    } finally {
      setIsSubmitting(false) 
    }
  }

  // Loading state
  if (isValidating) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-200px)] text-center">
        <LoadingSpinner size="lg" className="mb-4" />
        <p className="text-lg font-medium">Validating verification...</p>
      </div>
    )
  }

  // Error state - invalid token
  if (!isValid || !customerInfo) {
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

    return <ErrorStateDisplay errorType={mapErrorType(errorType)} onRetry={refetchValidation} />
  }

  // No missing fields - redirect (this should be handled by useEffect but as fallback)
  if (missingFields.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-200px)] text-center">
        <LoadingSpinner size="lg" className="mb-4" />
        <p className="text-lg font-medium">Redirecting...</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <ProcessOverview currentStep="customer-info" />
      
      <div className="lg:pl-0 pt-0 lg:pt-8">
        <div className="max-w-2xl mx-auto p-6">
          <div className="bg-white rounded-lg shadow-sm p-8">
            <div className="mb-6">
              <h1 className="text-2xl font-bold text-gray-900 mb-2">
                Personal Information
              </h1>
              <p className="text-gray-600">
                We need a few additional details to complete your verification. This information helps us ensure secure and accurate processing.
              </p>
            </div>

            {error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-red-700 text-sm">{error}</p>
              </div>
            )}
            
            <CustomerInfoForm
              requiredFields={missingFields}
              initialData={customerInfo}
              onSubmit={handleSubmit}
              isSubmitting={isSubmitting}
            />

            <div className="mt-8 pt-6 border-t border-gray-200">
              <div className="flex items-center text-sm text-gray-500">
                <svg className="h-4 w-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
                Your information is encrypted and securely stored. We only share data with your explicit consent.
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 