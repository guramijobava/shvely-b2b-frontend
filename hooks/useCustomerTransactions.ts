"use client"

import { useState, useEffect, useCallback, useMemo } from "react"
import type { Transaction, PaginationInfo } from "@/lib/types"
import { apiClient } from "@/lib/api"

interface TransactionFilters {
  page?: number
  limit?: number
  startDate?: string
  endDate?: string
  category?: string
  accountId?: string
  type?: "debit" | "credit"
  status?: "pending" | "posted"
  search?: string
}

export function useCustomerTransactions(customerId: string | null, initialFilters: TransactionFilters = {}) {
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [pagination, setPagination] = useState<PaginationInfo | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [filters, setFilters] = useState<TransactionFilters>({
    page: 1,
    limit: 10,
    ...initialFilters,
  })

  const memoizedFilters = useMemo(() => filters, [
    filters.page,
    filters.limit,
    filters.startDate,
    filters.endDate,
    filters.category,
    filters.accountId,
    filters.type,
    filters.status,
    filters.search,
  ])

  const fetchTransactions = useCallback(async () => {
    if (!customerId) {
      setTransactions([])
      setPagination(null)
      return
    }

    setIsLoading(true)
    setError(null)
    try {
      const response = await apiClient.getCustomerTransactions(customerId, memoizedFilters)
      if (response.success && response.data) {
        setTransactions(response.data)
        setPagination(response.pagination)
      } else {
        throw new Error("Failed to fetch transactions")
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "An unknown error occurred")
      setTransactions([])
      setPagination(null)
    } finally {
      setIsLoading(false)
    }
  }, [customerId, memoizedFilters])

  useEffect(() => {
    fetchTransactions()
  }, [fetchTransactions])

  const updateFilters = useCallback((newFilters: Partial<TransactionFilters>) => {
    setFilters((prev) => ({ ...prev, ...newFilters, page: 1 }))
  }, [])

  const goToPage = useCallback((page: number) => {
    setFilters((prev) => ({ ...prev, page }))
  }, [])

  return {
    transactions,
    pagination,
    isLoading,
    error,
    filters,
    updateFilters,
    goToPage,
    refetch: fetchTransactions,
  }
}
