"use client"
// Placeholder for Reports Tab
import { useParams } from "next/navigation"
import { ReportBuilder } from "@/components/admin/customers/ReportBuilder" // To be created
import { useReportGeneration } from "@/hooks/useReportGeneration"
import { FileDown } from "lucide-react"

export default function CustomerReportsPage() {
  const params = useParams()
  const customerId = params.id as string
  const { generateReport, isGenerating, error } = useReportGeneration(customerId)

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-2">
        <FileDown className="h-6 w-6" />
        <h2 className="text-2xl font-semibold">Generate Customer Reports</h2>
      </div>
      <ReportBuilder onGenerateReport={generateReport} isGenerating={isGenerating} error={error} />
      {/* Potentially list previously generated reports here */}
    </div>
  )
}
