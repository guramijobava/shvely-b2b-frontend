"use client"

import { useState, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { VerificationFilters } from "@/components/admin/verifications/VerificationFilters"
import { VerificationTable } from "@/components/admin/verifications/VerificationTable"
import { useVerifications } from "@/hooks/useVerifications"
import { useVerificationActions } from "@/hooks/useVerificationActions"
import { Plus, Download } from "lucide-react"
import Link from "next/link"

export default function VerificationsPage() {
  const [filters, setFilters] = useState({
    search: "",
    status: "",
    agent: "",
    page: 1,
    limit: 10,
  })

  const { verifications, pagination, isLoading, error } = useVerifications(filters)
  const { resendVerification, extendVerification, cancelVerification } = useVerificationActions()

  const handleFiltersChange = useCallback((newFilters: { search: string; status: string; agent: string }) => {
    setFilters((prev) => ({
      ...prev,
      ...newFilters,
      page: 1, // Reset to first page when filters change
    }))
  }, [])

  const handlePageChange = useCallback((page: number) => {
    setFilters((prev) => ({ ...prev, page }))
  }, [])

  const handleSort = useCallback((column: string, direction: "asc" | "desc") => {
    // In a real app, this would update the API call with sort parameters
    console.log("Sort:", column, direction)
  }, [])

  const handleExport = useCallback(() => {
    // In a real app, this would trigger a CSV/Excel download
    console.log("Export verifications")
  }, [])

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Verification Management</h1>
          <p className="text-muted-foreground">Manage and track bank verification requests for your customers.</p>
        </div>
        <div className="flex items-center space-x-3">
          <Button variant="outline" onClick={handleExport}>
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Button asChild>
            <Link href="/admin/verifications/send">
              <Plus className="h-4 w-4 mr-2" />
              Send New Verification
            </Link>
          </Button>
        </div>
      </div>

      {/* Error state */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-800">Error loading verifications: {error}</p>
        </div>
      )}

      {/* Filters */}
      <VerificationFilters onFiltersChange={handleFiltersChange} isLoading={isLoading} />

      {/* Table */}
      <VerificationTable
        verifications={verifications || []} // Ensure we always pass an array
        pagination={pagination}
        isLoading={isLoading}
        onPageChange={handlePageChange}
        onSort={handleSort}
        onResend={resendVerification}
        onExtend={extendVerification}
        onCancel={cancelVerification}
      />
    </div>
  )
}
