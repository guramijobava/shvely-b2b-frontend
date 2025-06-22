"use client"

import { useState, useCallback, useMemo } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { VerificationTable } from "@/components/admin/verifications/VerificationTable"
import { BulkVerificationUpload } from "@/components/admin/verifications/BulkVerificationUpload"
import { useVerifications } from "@/hooks/useVerifications"
import { useVerificationActions } from "@/hooks/useVerificationActions"
import { StatsCard } from "@/components/admin/dashboard/StatsCard"
import { Plus, Download, Search, FileCheck, Clock, AlertTriangle, Send, Upload } from "lucide-react"
import Link from "next/link"

export default function VerificationsPage() {
  const [filters, setFilters] = useState({
    search: "",
    status: "all",
    agent: "all",
    page: 1,
    limit: 10,
  })
  const [showBulkUpload, setShowBulkUpload] = useState(false)

  // Convert "all" values to empty strings for the API call
  const apiFilters = useMemo(() => ({
    ...filters,
    status: filters.status === "all" ? "" : filters.status,
    agent: filters.agent === "all" ? "" : filters.agent,
  }), [filters])

  const { verifications, pagination, isLoading, error } = useVerifications(apiFilters)
  const { resendVerification, extendVerification, cancelVerification } = useVerificationActions()

  const handleSearchChange = useCallback((search: string) => {
    setFilters((prev) => ({
      ...prev,
      search,
      page: 1,
    }))
  }, [])

  const handleStatusChange = useCallback((status: string) => {
    setFilters((prev) => ({
      ...prev,
      status,
      page: 1,
    }))
  }, [])

  const handleAgentChange = useCallback((agent: string) => {
    setFilters((prev) => ({
      ...prev,
      agent,
      page: 1,
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

  const handleBulkUploadComplete = useCallback((results: { successful: number; failed: number; errors: string[] }) => {
    setShowBulkUpload(false)
    // Refresh the verifications list
    // In a real app, you might want to show a success/error toast
    console.log("Bulk upload completed:", results)
    // You could also refresh the verifications list here
  }, [])

  // Calculate stats from the verifications data
  const stats = useMemo(() => {
    const totalVerifications = pagination?.total || 0
    const pendingCount = verifications?.filter(v => v.status === "sent" || v.status === "in_progress").length || 0
    const completedCount = verifications?.filter(v => v.status === "completed").length || 0
    const expiredCount = verifications?.filter(v => v.status === "expired").length || 0

    return {
      total: totalVerifications,
      pending: pendingCount,
      completed: completedCount,
      expired: expiredCount
    }
  }, [verifications, pagination?.total])

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
          <Button variant="outline" onClick={() => setShowBulkUpload(true)}>
            <Upload className="h-4 w-4 mr-2" />
            Bulk Send
          </Button>
          <Button asChild>
            <Link href="/admin/verifications/send">
              <Plus className="h-4 w-4 mr-2" />
              Send New Verification
            </Link>
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <StatsCard 
          title="Total Verifications" 
          value={stats.total} 
          icon={FileCheck} 
          isLoading={isLoading} 
        />
        <StatsCard 
          title="Pending" 
          value={stats.pending} 
          icon={Clock} 
          isLoading={isLoading} 
        />
        <StatsCard 
          title="Completed" 
          value={stats.completed} 
          icon={Send} 
          isLoading={isLoading} 
        />
        <StatsCard 
          title="Expired" 
          value={stats.expired} 
          icon={AlertTriangle} 
          isLoading={isLoading} 
        />
      </div>

      {/* Error state */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-800">Error loading verifications: {error}</p>
        </div>
      )}

      {/* Filters and Table wrapped in Card */}
      <Card>
        <CardContent className="p-4 space-y-4">
          {/* Filters */}
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-grow">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search by customer name, email, or phone..."
                value={filters.search}
                onChange={(e) => handleSearchChange(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select
              value={filters.status}
              onValueChange={handleStatusChange}
            >
              <SelectTrigger className="w-full md:w-[180px]">
                <SelectValue placeholder="All Statuses" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="draft">Draft</SelectItem>
                <SelectItem value="sent">Sent</SelectItem>
                <SelectItem value="in_progress">In Progress</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="expired">Expired</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>
            <Select
              value={filters.agent}
              onValueChange={handleAgentChange}
            >
              <SelectTrigger className="w-full md:w-[180px]">
                <SelectValue placeholder="All Agents" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Agents</SelectItem>
                <SelectItem value="admin">Admin</SelectItem>
                <SelectItem value="agent1">Agent 1</SelectItem>
                <SelectItem value="agent2">Agent 2</SelectItem>
              </SelectContent>
            </Select>
          </div>

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
        </CardContent>
      </Card>

      {/* Bulk Upload Dialog */}
      <Dialog open={showBulkUpload} onOpenChange={setShowBulkUpload}>
        <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Bulk Verification Upload</DialogTitle>
          </DialogHeader>
          <BulkVerificationUpload
            onClose={() => setShowBulkUpload(false)}
            onComplete={handleBulkUploadComplete}
          />
        </DialogContent>
      </Dialog>
    </div>
  )
}
