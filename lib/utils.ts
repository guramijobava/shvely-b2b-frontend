import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatCurrency(amount: number, currency = "USD"): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
  }).format(amount)
}

export function formatDate(date: string | Date): string {
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  }).format(new Date(date))
}

export function formatRelativeTime(date: string | Date): string {
  const now = new Date()
  const target = new Date(date)
  const diffInSeconds = Math.floor((now.getTime() - target.getTime()) / 1000)

  if (diffInSeconds < 60) return "Just now"
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} minutes ago`
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hours ago`
  return `${Math.floor(diffInSeconds / 86400)} days ago`
}

export function getStatusColor(status: string): string {
  const colors = {
    pending: "text-yellow-600 bg-yellow-100",
    sent: "text-blue-600 bg-blue-100",
    in_progress: "text-orange-600 bg-orange-100",
    completed: "text-green-600 bg-green-100",
    expired: "text-red-600 bg-red-100",
    failed: "text-red-600 bg-red-100",
  }
  return colors[status as keyof typeof colors] || "text-gray-600 bg-gray-100"
}

export function getStatusBadgeVariant(status: string): "default" | "secondary" | "destructive" | "outline" {
  const variants = {
    pending: "outline" as const,
    sent: "secondary" as const,
    in_progress: "default" as const,
    completed: "default" as const,
    expired: "destructive" as const,
    failed: "destructive" as const,
  }
  return variants[status as keyof typeof variants] || "outline"
}
