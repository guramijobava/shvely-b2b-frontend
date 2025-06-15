"use client"

import { useState, useEffect, useCallback } from "react"
import { apiClient } from "@/lib/api"

// Define more specific types for IncomeAnalysisData and SpendingAnalysisData
interface IncomeAnalysisData {
  primarySource?: {
    name: string
    type: string
    frequency: string
    averageAmount: number
    stabilityScore: number
    trend: string
  }
  secondarySources?: any[]
  totalMonthlyIncome?: number
  employmentVerification?: {
    status: string
    confidence: number
    employerNameMatch: boolean
    consistentDeposits: boolean
  }
  history?: { month: string; amount: number }[]
}

interface SpendingAnalysisData {
  categories?: { name: string; amount: number; percentage: number; trend: string }[]
  totalMonthlySpending?: number
  recurringPayments?: { merchant: string; amount: number; category: string }[]
  spendingPatterns?: { highestDay: string; unusualAlerts: any[] }
}

export function useFinancialAnalytics(customerId: string | null) {
  const [incomeAnalysis, setIncomeAnalysis] = useState<IncomeAnalysisData | null>(null)
  const [spendingAnalysis, setSpendingAnalysis] = useState<SpendingAnalysisData | null>(null)
  const [isLoadingIncome, setIsLoadingIncome] = useState(false)
  const [isLoadingSpending, setIsLoadingSpending] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchIncomeAnalysis = useCallback(async () => {
    if (!customerId) return
    setIsLoadingIncome(true)
    setError(null)
    try {
      const response = await apiClient.getCustomerIncomeAnalysis(customerId)
      if (response.success) {
        setIncomeAnalysis(response.data)
      } else {
        throw new Error(response.message || "Failed to fetch income analysis")
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error fetching income analysis")
    } finally {
      setIsLoadingIncome(false)
    }
  }, [customerId])

  const fetchSpendingAnalysis = useCallback(async () => {
    if (!customerId) return
    setIsLoadingSpending(true)
    setError(null)
    try {
      const response = await apiClient.getCustomerSpendingAnalysis(customerId)
      if (response.success) {
        setSpendingAnalysis(response.data)
      } else {
        throw new Error(response.message || "Failed to fetch spending analysis")
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error fetching spending analysis")
    } finally {
      setIsLoadingSpending(false)
    }
  }, [customerId])

  useEffect(() => {
    if (customerId) {
      fetchIncomeAnalysis()
      fetchSpendingAnalysis()
    }
  }, [customerId, fetchIncomeAnalysis, fetchSpendingAnalysis])

  return {
    incomeAnalysis,
    spendingAnalysis,
    isLoading: isLoadingIncome || isLoadingSpending,
    error,
    refetchAll: () => {
      fetchIncomeAnalysis()
      fetchSpendingAnalysis()
    },
  }
}
