"use client"

import { useState, useEffect, useCallback } from "react"
import type { CustomerFinancialProfile } from "@/lib/types" // Ensure this type is comprehensive
import { apiClient } from "@/lib/api" // Use the main apiClient

export function useCustomer(customerId: string | null) {
  const [customer, setCustomer] = useState<CustomerFinancialProfile | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchCustomer = useCallback(async () => {
    if (!customerId) {
      setIsLoading(false)
      setCustomer(null)
      return
    }

    setIsLoading(true)
    setError(null)
    try {
      // Use the new method for fetching detailed financial profile
      const response = await apiClient.getCustomerFinancialProfile(customerId)
      if (response.success && response.data) {
        setCustomer(response.data)
      } else {
        throw new Error(response.message || "Failed to fetch customer financial profile")
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "An unknown error occurred")
      setCustomer(null)
    } finally {
      setIsLoading(false)
    }
  }, [customerId])

  useEffect(() => {
    fetchCustomer()
  }, [fetchCustomer])

  return {
    customer,
    isLoading,
    error,
    refetch: fetchCustomer,
  }
}
