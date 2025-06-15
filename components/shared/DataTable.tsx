"use client"

import type React from "react"

import { useState } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { EmptyState } from "@/components/shared/EmptyState"
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, ArrowUpDown } from "lucide-react"
import { cn } from "@/lib/utils"

interface Column<T> {
  key: keyof T | string
  label: string
  sortable?: boolean
  render?: (item: T) => React.ReactNode
  className?: string
}

interface DataTableProps<T> {
  data: T[]
  columns: Column<T>[]
  isLoading?: boolean
  pagination?: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
  onPageChange?: (page: number) => void
  onSort?: (column: string, direction: "asc" | "desc") => void
  onSelectionChange?: (selectedIds: string[]) => void
  selectable?: boolean
  emptyState?: {
    icon: React.ComponentType<{ className?: string }>
    title: string
    description: string
  }
  getRowId?: (item: T) => string
  onRowClick?: (item: T) => void
}

export function DataTable<T>({
  data = [], // Default to empty array
  columns,
  isLoading = false,
  pagination,
  onPageChange,
  onSort,
  onSelectionChange,
  selectable = false,
  emptyState,
  getRowId,
  onRowClick,
}: DataTableProps<T>) {
  const [selectedIds, setSelectedIds] = useState<string[]>([])
  const [sortColumn, setSortColumn] = useState<string | null>(null)
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc")

  // Ensure data is always an array
  const safeData = Array.isArray(data) ? data : []

  const handleSort = (column: string) => {
    if (!onSort) return

    const newDirection = sortColumn === column && sortDirection === "asc" ? "desc" : "asc"
    setSortColumn(column)
    setSortDirection(newDirection)
    onSort(column, newDirection)
  }

  const handleSelectAll = (checked: boolean) => {
    if (!getRowId) return

    const newSelectedIds = checked ? safeData.map(getRowId) : []
    setSelectedIds(newSelectedIds)
    onSelectionChange?.(newSelectedIds)
  }

  const handleSelectRow = (id: string, checked: boolean) => {
    const newSelectedIds = checked ? [...selectedIds, id] : selectedIds.filter((selectedId) => selectedId !== id)

    setSelectedIds(newSelectedIds)
    onSelectionChange?.(newSelectedIds)
  }

  const isAllSelected = safeData.length > 0 && selectedIds.length === safeData.length
  const isPartiallySelected = selectedIds.length > 0 && selectedIds.length < safeData.length

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                {selectable && <TableHead className="w-12"></TableHead>}
                {columns.map((column) => (
                  <TableHead key={String(column.key)} className={column.className}>
                    {column.label}
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {Array.from({ length: 5 }).map((_, index) => (
                <TableRow key={index}>
                  {selectable && (
                    <TableCell>
                      <div className="h-4 w-4 bg-gray-200 rounded animate-pulse"></div>
                    </TableCell>
                  )}
                  {columns.map((column) => (
                    <TableCell key={String(column.key)}>
                      <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    )
  }

  if (!isLoading && safeData.length === 0 && emptyState) {
    return <EmptyState {...emptyState} />
  }

  return (
    <div className="space-y-4">
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              {selectable && (
                <TableHead className="w-12">
                  <Checkbox
                    checked={isAllSelected}
                    onCheckedChange={handleSelectAll}
                    aria-label="Select all"
                    {...(isPartiallySelected && { "data-state": "indeterminate" })}
                  />
                </TableHead>
              )}
              {columns.map((column) => (
                <TableHead key={String(column.key)} className={column.className}>
                  {column.sortable ? (
                    <Button
                      variant="ghost"
                      size="sm"
                      className="-ml-3 h-8 data-[state=open]:bg-accent"
                      onClick={() => handleSort(String(column.key))}
                    >
                      <span>{column.label}</span>
                      <ArrowUpDown className="ml-2 h-4 w-4" />
                    </Button>
                  ) : (
                    column.label
                  )}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {safeData.map((item, index) => {
              const rowId = getRowId?.(item) || String(index)
              const isSelected = selectedIds.includes(rowId)

              return (
                <TableRow
                  key={rowId}
                  className={cn(onRowClick && "cursor-pointer hover:bg-muted/50", isSelected && "bg-muted/50")}
                  onClick={() => onRowClick?.(item)}
                >
                  {selectable && (
                    <TableCell>
                      <Checkbox
                        checked={isSelected}
                        onCheckedChange={(checked) => handleSelectRow(rowId, checked as boolean)}
                        aria-label={`Select row ${index + 1}`}
                        onClick={(e) => e.stopPropagation()}
                      />
                    </TableCell>
                  )}
                  {columns.map((column) => (
                    <TableCell key={String(column.key)} className={column.className}>
                      {column.render ? column.render(item) : String((item as any)[column.key] || "")}
                    </TableCell>
                  ))}
                </TableRow>
              )
            })}
          </TableBody>
        </Table>
      </div>

      {pagination && (
        <div className="flex items-center justify-between">
          <div className="text-sm text-muted-foreground">
            Showing {(pagination.page - 1) * pagination.limit + 1} to{" "}
            {Math.min(pagination.page * pagination.limit, pagination.total)} of {pagination.total} results
          </div>
          <div className="flex items-center space-x-2">
            <Button variant="outline" size="sm" onClick={() => onPageChange?.(1)} disabled={pagination.page === 1}>
              <ChevronsLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onPageChange?.(pagination.page - 1)}
              disabled={pagination.page === 1}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <div className="text-sm">
              Page {pagination.page} of {pagination.totalPages}
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onPageChange?.(pagination.page + 1)}
              disabled={pagination.page === pagination.totalPages}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onPageChange?.(pagination.totalPages)}
              disabled={pagination.page === pagination.totalPages}
            >
              <ChevronsRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
