"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { DataTable } from "@/components/shared/DataTable"
import { StatusBadge } from "@/components/shared/StatusBadge"
import { ActionDropdown } from "@/components/shared/ActionDropdown"
import { formatRelativeTime, formatDate } from "@/lib/utils"
import { Eye, Send, Clock, X, Mail, Phone } from "lucide-react"
import type { VerificationRequest, PaginationInfo } from "@/lib/types"

interface VerificationTableProps {
  verifications: VerificationRequest[]
  pagination?: PaginationInfo | null
  isLoading?: boolean
  onPageChange?: (page: number) => void
  onSort?: (column: string, direction: "asc" | "desc") => void
  onResend?: (id: string) => void
  onExtend?: (id: string) => void
  onCancel?: (id: string) => void
}

export function VerificationTable({
  verifications = [], // Default to empty array
  pagination,
  isLoading = false,
  onPageChange,
  onSort,
  onResend,
  onExtend,
  onCancel,
}: VerificationTableProps) {
  const getCustomerInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
  }

  const getTimeRemaining = (expiresAt: string) => {
    const now = new Date()
    const expires = new Date(expiresAt)
    const diffInHours = Math.floor((expires.getTime() - now.getTime()) / (1000 * 60 * 60))

    if (diffInHours < 0) return { text: "Expired", className: "text-red-600" }
    if (diffInHours < 24) return { text: `${diffInHours}h remaining`, className: "text-red-600" }
    if (diffInHours < 48) return { text: `${Math.floor(diffInHours / 24)}d remaining`, className: "text-orange-600" }
    return { text: `${Math.floor(diffInHours / 24)}d remaining`, className: "text-gray-600" }
  }

  const getActions = (verification: VerificationRequest) => {
    const actions = [
      {
        label: "View Details",
        icon: Eye,
        onClick: () => window.open(`/admin/verifications/${verification.id}`, "_blank"),
      },
    ]

    if (verification.status === "sent" || verification.status === "in_progress") {
      actions.push(
        {
          label: "Resend Link",
          icon: Send,
          onClick: () => onResend?.(verification.id),
        },
        {
          label: "Extend Expiration",
          icon: Clock,
          onClick: () => onExtend?.(verification.id),
        },
      )
    }

    if (verification.status !== "completed" && verification.status !== "expired") {
      actions.push({
        label: "Cancel",
        icon: X,
        onClick: () => onCancel?.(verification.id),
        destructive: true,
        separator: true,
      })
    }

    return actions
  }

  const columns = [
    {
      key: "customerInfo.fullName",
      label: "Customer",
      sortable: true,
      render: (verification: VerificationRequest) => (
        <div className="flex items-center space-x-3">
          <Avatar className="h-8 w-8">
            <AvatarImage src="/placeholder.svg" alt={verification.customerInfo.fullName} />
            <AvatarFallback className="text-xs">
              {getCustomerInitials(verification.customerInfo.fullName)}
            </AvatarFallback>
          </Avatar>
          <div>
            <div className="font-medium">{verification.customerInfo.fullName}</div>
            <div className="text-sm text-muted-foreground">{verification.customerInfo.email}</div>
          </div>
        </div>
      ),
    },
    {
      key: "customerInfo.email",
      label: "Contact",
      render: (verification: VerificationRequest) => (
        <div className="space-y-1">
          <div className="flex items-center space-x-1">
            <Mail className="h-3 w-3 text-gray-400" />
            <a
              href={`mailto:${verification.customerInfo.email}`}
              className="text-sm text-blue-600 hover:underline"
              onClick={(e) => e.stopPropagation()}
            >
              {verification.customerInfo.email}
            </a>
          </div>
          <div className="flex items-center space-x-1">
            <Phone className="h-3 w-3 text-gray-400" />
            <a
              href={`tel:${verification.customerInfo.phoneNumber}`}
              className="text-sm text-blue-600 hover:underline"
              onClick={(e) => e.stopPropagation()}
            >
              {verification.customerInfo.phoneNumber}
            </a>
          </div>
        </div>
      ),
    },
    {
      key: "customerInfo.nationality",
      label: "Nationality",
      render: (verification: VerificationRequest) => (
        verification.customerInfo.nationality ? (
          <Badge variant="outline" className="text-xs">
            {verification.customerInfo.nationality}
          </Badge>
        ) : (
          <span className="text-muted-foreground text-xs">Missing</span>
        )
      ),
    },
    {
      key: "customerInfo.residingCountry",
      label: "Residing Country", 
      render: (verification: VerificationRequest) => (
        verification.customerInfo.residingCountry ? (
          <Badge variant="outline" className="text-xs">
            {verification.customerInfo.residingCountry}
          </Badge>
        ) : (
          <span className="text-muted-foreground text-xs">Missing</span>
        )
      ),
    },
    {
      key: "status",
      label: "Status",
      render: (verification: VerificationRequest) => <StatusBadge status={verification.status} />,
    },
    {
      key: "timeline.createdAt",
      label: "Created",
      sortable: true,
      render: (verification: VerificationRequest) => (
        <div>
          <div className="text-sm">{formatRelativeTime(verification.timeline.createdAt)}</div>
          <div className="text-xs text-muted-foreground">{formatDate(verification.timeline.createdAt)}</div>
        </div>
      ),
    },
    {
      key: "timeline.expiresAt",
      label: "Expires",
      sortable: true,
      render: (verification: VerificationRequest) => {
        const timeRemaining = getTimeRemaining(verification.timeline.expiresAt)
        return (
          <div>
            <div className={`text-sm ${timeRemaining.className}`}>{timeRemaining.text}</div>
            <div className="text-xs text-muted-foreground">{formatDate(verification.timeline.expiresAt)}</div>
          </div>
        )
      },
    },
    {
      key: "createdBy",
      label: "Created By",
      render: (verification: VerificationRequest) => <div className="text-sm">{verification.createdBy}</div>,
    },
    {
      key: "actions",
      label: "Actions",
      className: "w-12",
      render: (verification: VerificationRequest) => <ActionDropdown actions={getActions(verification)} />,
    },
  ]

  return (
    <DataTable
      data={verifications}
      columns={columns}
      isLoading={isLoading}
      pagination={pagination}
      onPageChange={onPageChange}
      onSort={onSort}
      getRowId={(verification) => verification.id}
      onRowClick={(verification) => window.open(`/admin/verifications/${verification.id}`, "_blank")}
      emptyState={{
        icon: Eye,
        title: "No verifications found",
        description: "No verifications match your current filters. Try adjusting your search criteria.",
      }}
    />
  )
}
