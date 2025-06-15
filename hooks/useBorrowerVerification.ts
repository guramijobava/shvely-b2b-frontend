"use client"

import { useState, useCallback } from "react"
import { useRouter } from "next/navigation"
import { borrowerApiClient } from "@/lib/borrower-api"
import { useToast } from "@/hooks/use-toast"

export function useBorrowerVerification(token: string) {
  const router = useRouter()
  const { toast } = useToast()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [currentStep, setCurrentStep] = useState<"welcome" | "consent" | "complete">("welcome")

  const submitConsent = useCallback(
    async (consentData: any) => {
      setIsSubmitting(true)
      setError(null)
      try {
        await borrowerApiClient.recordConsent(token, consentData)
        toast({ title: "Consent Submitted", description: "Your consent has been recorded." })
        setCurrentStep("complete") // Or navigate to completion page
        router.push(`/verify/${token}/complete`)
      } catch (e) {
        const message = e instanceof Error ? e.message : "Failed to submit consent."
        setError(message)
        toast({ title: "Consent Error", description: message, variant: "destructive" })
      } finally {
        setIsSubmitting(false)
      }
    },
    [token, router, toast],
  )

  const finalizeVerification = useCallback(async () => {
    setIsSubmitting(true)
    setError(null)
    try {
      const response = await borrowerApiClient.completeVerification(token)
      toast({ title: "Verification Complete!", description: response.message })
      // The page itself will show completion details.
    } catch (e) {
      const message = e instanceof Error ? e.message : "Failed to finalize verification."
      setError(message)
      toast({ title: "Completion Error", description: message, variant: "destructive" })
      router.push(`/verify/${token}/error?type=completion_failed`)
    } finally {
      setIsSubmitting(false)
    }
  }, [token, router, toast])

  const navigateToConsent = useCallback(() => {
    router.push(`/verify/${token}/consent`)
    setCurrentStep("consent")
  }, [router, token])

  return {
    isSubmitting,
    error,
    currentStep,
    submitConsent,
    finalizeVerification,
    navigateToConsent,
    setCurrentStep, // Allow manual step setting if needed
  }
}
