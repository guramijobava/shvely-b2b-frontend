"use client"

import { useState, useEffect, useCallback, useMemo } from "react"
import type { VerificationRequest, CreateVerificationRequest, PaginationInfo } from "@/lib/types"
import { apiClient } from "@/lib/api"

export function useVerifications(params?: {
  page?: number
  limit?: number
  status?: string
  search?: string
  agent?: string
}) {
  const [verifications, setVerifications] = useState<VerificationRequest[]>([])
  const [pagination, setPagination] = useState<PaginationInfo | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const memoizedParams = useMemo(
    () => params,
    [params?.page, params?.limit, params?.status, params?.search, params?.agent],
  )

  const fetchVerifications = useCallback(async () => {
    setIsLoading(true)
    setError(null)
    try {
      const response = await apiClient.getVerifications(memoizedParams)

      // Ensure we have the correct data structure
      if (response && response.data && Array.isArray(response.data)) {
        setVerifications(response.data)
        setPagination(response.pagination)
      } else {
        // Fallback for unexpected response structure
        console.warn("Unexpected API response structure:", response)
        setVerifications([])
        setPagination(null)
      }
    } catch (error) {
      console.error("Error fetching verifications:", error)
      setError(error instanceof Error ? error.message : "Failed to fetch verifications")
      setVerifications([]) // Ensure we always have an array
      setPagination(null)
    } finally {
      setIsLoading(false)
    }
  }, [memoizedParams])

  const createVerification = useCallback(async (data: CreateVerificationRequest) => {
    const newVerification = await apiClient.createVerification(data)
    setVerifications((prev) => [newVerification, ...prev])
    return newVerification
  }, [])

  const updateVerificationStatus = useCallback(async (id: string, status: string) => {
    const updatedVerification = await apiClient.updateVerificationStatus(id, status)
    setVerifications((prev) => prev.map((v) => (v.id === id ? updatedVerification : v)))
    return updatedVerification
  }, [])

  const resendVerification = useCallback(
    async (id: string) => {
      await apiClient.resendVerification(id)
      // Refresh the list to get updated status
      await fetchVerifications()
    },
    [fetchVerifications],
  )

  useEffect(() => {
    fetchVerifications()
  }, [fetchVerifications])

  return {
    verifications,
    pagination,
    isLoading,
    error,
    fetchVerifications,
    createVerification,
    updateVerificationStatus,
    resendVerification,
  }
}
