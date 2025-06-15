"use client"

import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

interface StatusBadgeProps {
  status: "pending" | "sent" | "in_progress" | "completed" | "expired" | "failed"
  className?: string
  showPulse?: boolean
}

export function StatusBadge({ status, className, showPulse = true }: StatusBadgeProps) {
  const getStatusConfig = (status: string) => {
    switch (status) {
      case "pending":
        return {
          variant: "outline" as const,
          className: "bg-yellow-50 text-yellow-700 border-yellow-200",
          label: "Pending",
        }
      case "sent":
        return {
          variant: "outline" as const,
          className: "bg-blue-50 text-blue-700 border-blue-200",
          label: "Sent",
        }
      case "in_progress":
        return {
          variant: "outline" as const,
          className: "bg-orange-50 text-orange-700 border-orange-200",
          label: "In Progress",
        }
      case "completed":
        return {
          variant: "outline" as const,
          className: "bg-green-50 text-green-700 border-green-200",
          label: "Completed",
        }
      case "expired":
        return {
          variant: "outline" as const,
          className: "bg-red-50 text-red-700 border-red-200",
          label: "Expired",
        }
      case "failed":
        return {
          variant: "destructive" as const,
          className: "bg-red-50 text-red-700 border-red-200",
          label: "Failed",
        }
      default:
        return {
          variant: "outline" as const,
          className: "bg-gray-50 text-gray-700 border-gray-200",
          label: "Unknown",
        }
    }
  }

  const config = getStatusConfig(status)

  return (
    <Badge
      variant={config.variant}
      className={cn(config.className, status === "in_progress" && showPulse && "animate-pulse", className)}
    >
      {config.label}
    </Badge>
  )
}
