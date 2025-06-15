"use client"

import { useState } from "react"
import { apiClient } from "@/lib/api"
import { useToast } from "@/hooks/use-toast"

export function useReportGeneration(customerId: string | null) {
  const [isGenerating, setIsGenerating] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const { toast } = useToast()

  const generateReport = async (reportType: string, format: "pdf" | "excel" | "csv") => {
    if (!customerId) {
      setError("Customer ID is missing.")
      toast({ title: "Error", description: "Customer ID is missing.", variant: "destructive" })
      return
    }
    setIsGenerating(true)
    setError(null)
    try {
      const blob = await apiClient.exportCustomerReport(customerId, reportType, format)
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = `${reportType}_${customerId}.${format === "excel" ? "xlsx" : format}`
      document.body.appendChild(a)
      a.click()
      a.remove()
      window.URL.revokeObjectURL(url)
      toast({ title: "Report Generated", description: `${reportType} has been downloaded.` })
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to generate report."
      setError(message)
      toast({ title: "Report Generation Failed", description: message, variant: "destructive" })
    } finally {
      setIsGenerating(false)
    }
  }

  return {
    isGenerating,
    error,
    generateReport,
  }
}
