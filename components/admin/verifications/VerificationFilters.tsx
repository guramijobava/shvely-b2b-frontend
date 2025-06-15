"use client"

import { useState, useEffect, useCallback } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, X } from "lucide-react"
import { useDebounce } from "@/hooks/useDebounce"

interface VerificationFiltersProps {
  onFiltersChange: (filters: {
    search: string
    status: string
    agent: string
  }) => void
  isLoading?: boolean
}

export function VerificationFilters({ onFiltersChange, isLoading = false }: VerificationFiltersProps) {
  const [search, setSearch] = useState("")
  const [status, setStatus] = useState("all")
  const [agent, setAgent] = useState("all")

  const debouncedSearch = useDebounce(search, 300)

  const filters = useCallback(
    () => ({
      search: debouncedSearch,
      status: status === "all" ? "" : status,
      agent: agent === "all" ? "" : agent,
    }),
    [debouncedSearch, status, agent],
  )

  useEffect(() => {
    onFiltersChange(filters())
  }, [filters, onFiltersChange])

  const clearFilters = () => {
    setSearch("")
    setStatus("all")
    setAgent("all")
  }

  const hasActiveFilters = search || status !== "all" || agent !== "all"

  return (
    <div className="flex flex-col sm:flex-row gap-4 p-4 bg-white rounded-lg border">
      <div className="flex-1">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Search by customer name or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10"
            disabled={isLoading}
          />
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-2">
        <Select value={status} onValueChange={setStatus} disabled={isLoading}>
          <SelectTrigger className="w-full sm:w-40">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="sent">Sent</SelectItem>
            <SelectItem value="in_progress">In Progress</SelectItem>
            <SelectItem value="completed">Completed</SelectItem>
            <SelectItem value="expired">Expired</SelectItem>
            <SelectItem value="failed">Failed</SelectItem>
          </SelectContent>
        </Select>

        <Select value={agent} onValueChange={setAgent} disabled={isLoading}>
          <SelectTrigger className="w-full sm:w-40">
            <SelectValue placeholder="Agent" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Agents</SelectItem>
            <SelectItem value="admin@example.com">Admin User</SelectItem>
            <SelectItem value="agent1@example.com">Agent One</SelectItem>
            <SelectItem value="agent2@example.com">Agent Two</SelectItem>
          </SelectContent>
        </Select>

        {hasActiveFilters && (
          <Button variant="outline" size="sm" onClick={clearFilters} disabled={isLoading}>
            <X className="h-4 w-4 mr-1" />
            Clear
          </Button>
        )}
      </div>
    </div>
  )
}
