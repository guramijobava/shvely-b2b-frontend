"use client"

import { Label } from "@/components/ui/label"

import { CardContent } from "@/components/ui/card"

import { CardTitle } from "@/components/ui/card"

import { CardHeader } from "@/components/ui/card"

import { Card } from "@/components/ui/card"

import { useState, useEffect } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, X, Filter } from "lucide-react"
import { useDebounce } from "@/hooks/useDebounce"
import type { DateRange } from "react-day-picker"

interface TransactionFiltersProps {
  onFiltersChange: (filters: {
    search: string
    dateRange?: DateRange
    type?: "debit" | "credit"
    category?: string // Could be multi-select in future
    accountId?: string
    status?: "pending" | "posted"
  }) => void
  isLoading?: boolean
  // Pass accounts for account filter if needed: accounts: BankAccount[]
}

export function TransactionFilters({ onFiltersChange, isLoading = false }: TransactionFiltersProps) {
  const [search, setSearch] = useState("")
  const [dateRange, setDateRange] = useState<DateRange | undefined>()
  const [type, setType] = useState<"debit" | "credit" | "all">("all")
  const [category, setCategory] = useState("") // Example: single string, could be array for multi-select
  const [accountId, setAccountId] = useState("")
  const [status, setStatus] = useState<"pending" | "posted" | "all">("all")

  const debouncedSearch = useDebounce(search, 500)

  useEffect(() => {
    onFiltersChange({
      search: debouncedSearch,
      dateRange,
      type: type === "all" ? undefined : type,
      category: category || undefined,
      accountId: accountId || undefined,
      status: status === "all" ? undefined : status,
    })
  }, [debouncedSearch, dateRange, type, category, accountId, status, onFiltersChange])

  const clearFilters = () => {
    setSearch("")
    setDateRange(undefined)
    setType("all")
    setCategory("")
    setAccountId("")
    setStatus("all")
  }

  const hasActiveFilters = search || dateRange || type !== "all" || category || accountId || status !== "all"

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Filter className="h-5 w-5" />
          <span>Filter Transactions</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search description/merchant..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10"
              disabled={isLoading}
            />
          </div>

          {/* DateRangePicker is a complex component, using placeholder */}
          <div>
            <Label htmlFor="date-range" className="text-xs">
              Date Range
            </Label>
            {/* <DateRangePicker id="date-range" value={dateRange} onValueChange={setDateRange} disabled={isLoading} /> */}
            <Input
              type="text"
              placeholder="Date Range Picker Placeholder"
              disabled={isLoading}
              value={dateRange ? `${dateRange.from?.toLocaleDateString()} - ${dateRange.to?.toLocaleDateString()}` : ""}
              onClick={() => alert("DateRangePicker component needed here")}
              readOnly
            />
          </div>

          <Select value={type} onValueChange={(v) => setType(v as any)} disabled={isLoading}>
            <SelectTrigger>
              <SelectValue placeholder="Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="debit">Debit</SelectItem>
              <SelectItem value="credit">Credit</SelectItem>
            </SelectContent>
          </Select>

          {/* Add more filters: Category (multi-select), Account, Status */}
          <Select value={status} onValueChange={(v) => setStatus(v as any)} disabled={isLoading}>
            <SelectTrigger>
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="posted">Posted</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
            </SelectContent>
          </Select>

          <Input
            placeholder="Filter by Category (e.g., Groceries)"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            disabled={isLoading}
          />
          <Input
            placeholder="Filter by Account ID (last 8 chars)"
            value={accountId}
            onChange={(e) => setAccountId(e.target.value)}
            disabled={isLoading}
          />
        </div>
        {hasActiveFilters && (
          <div className="flex justify-end">
            <Button variant="ghost" size="sm" onClick={clearFilters} disabled={isLoading}>
              <X className="h-4 w-4 mr-1" />
              Clear All Filters
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
