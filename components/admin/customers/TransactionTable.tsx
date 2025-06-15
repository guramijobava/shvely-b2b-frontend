"use client"

import type { Transaction, PaginationInfo } from "@/lib/types"
import { DataTable } from "@/components/shared/DataTable"
import { Badge } from "@/components/ui/badge"
import { formatCurrency, formatRelativeTime, formatDate } from "@/lib/utils"
import { ListChecks } from "lucide-react"

interface TransactionTableProps {
  transactions: Transaction[]
  pagination: PaginationInfo | null
  isLoading: boolean
  onPageChange: (page: number) => void
  // Add onSort, onRowClick if needed
}

export function TransactionTable({ transactions, pagination, isLoading, onPageChange }: TransactionTableProps) {
  const columns = [
    {
      key: "date",
      label: "Date",
      sortable: true,
      render: (item: Transaction) => (
        <div>
          <p className="text-sm font-medium">{formatDate(item.date)}</p>
          <p className="text-xs text-muted-foreground">{formatRelativeTime(item.date)}</p>
        </div>
      ),
    },
    {
      key: "description",
      label: "Description",
      render: (item: Transaction) => (
        <div>
          <p className="text-sm font-medium truncate max-w-xs">{item.description}</p>
          {item.merchantName && <p className="text-xs text-muted-foreground">{item.merchantName}</p>}
        </div>
      ),
    },
    {
      key: "category",
      label: "Category",
      render: (item: Transaction) => (
        <div className="flex flex-wrap gap-1">
          {item.category?.map((cat, i) => (
            <Badge key={i} variant="outline" className="text-xs">
              {cat}
            </Badge>
          ))}
        </div>
      ),
    },
    {
      key: "amount",
      label: "Amount",
      sortable: true,
      render: (item: Transaction) => (
        <span className={`font-medium ${item.type === "debit" ? "text-red-600" : "text-green-600"}`}>
          {item.type === "debit" ? "-" : "+"}
          {formatCurrency(Math.abs(item.amount))}
        </span>
      ),
    },
    {
      key: "accountId", // Assuming accountId can be mapped to an account name/identifier
      label: "Account",
      render: (item: Transaction) => <span className="text-xs text-muted-foreground">{item.accountId.slice(-8)}</span>, // Display last 8 chars of accountId
    },
    {
      key: "status",
      label: "Status",
      render: (item: Transaction) => (
        <Badge
          variant={item.status === "posted" ? "default" : "secondary"}
          className={item.status === "posted" ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"}
        >
          {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
        </Badge>
      ),
    },
  ]

  return (
    <DataTable
      columns={columns}
      data={transactions}
      isLoading={isLoading}
      pagination={pagination || undefined}
      onPageChange={onPageChange}
      getRowId={(item: Transaction) => item.id}
      emptyState={{
        icon: ListChecks,
        title: "No Transactions",
        description: "No transactions match your current filters or are available for this customer.",
      }}
    />
  )
}
