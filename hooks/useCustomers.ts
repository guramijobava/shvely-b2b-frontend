"use client"

import { useState, useEffect } from "react"
import type { CustomerFinancialProfile, PaginationInfo } from "@/lib/types"
import { apiClient } from "@/lib/api"

export function useCustomers(params?: {
  page?: number
  limit?: number
  search?: string
}) {
  const [customers, setCustomers] = useState<CustomerFinancialProfile[]>([])
  const [pagination, setPagination] = useState<PaginationInfo | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchCustomers = async () => {
    setIsLoading(true)
    setError(null)
    try {
      const response = await apiClient.getCustomers(params)
      setCustomers(response.data)
      setPagination(response.pagination)
    } catch (error) {
      setError(error instanceof Error ? error.message : "Failed to fetch customers")
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchCustomers()
  }, [params?.page, params?.limit, params?.search])

  return {
    customers,
    pagination,
    isLoading,
    error,
    fetchCustomers,
  }
}
