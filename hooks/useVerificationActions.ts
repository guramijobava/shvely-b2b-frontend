"use client"

import { useState } from "react"
import { apiClient } from "@/lib/api"
import { useToast } from "@/hooks/use-toast"

export function useVerificationActions() {
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()

  const resendVerification = async (id: string) => {
    setIsLoading(true)
    try {
      await apiClient.resendVerification(id)
      toast({
        title: "Verification Resent",
        description: "The verification link has been sent to the customer.",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to resend verification. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const extendVerification = async (id: string, days = 7) => {
    setIsLoading(true)
    try {
      // Mock API call - in real app this would extend the expiration
      await new Promise((resolve) => setTimeout(resolve, 1000))
      toast({
        title: "Expiration Extended",
        description: `Verification expiration extended by ${days} days.`,
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to extend verification. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const cancelVerification = async (id: string) => {
    setIsLoading(true)
    try {
      await apiClient.updateVerificationStatus(id, "cancelled")
      toast({
        title: "Verification Cancelled",
        description: "The verification has been cancelled.",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to cancel verification. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return {
    resendVerification,
    extendVerification,
    cancelVerification,
    isLoading,
  }
}
