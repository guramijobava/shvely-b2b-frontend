"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { DateRangePicker } from "@/components/shared/DateRangePicker" // Assuming this exists
import { Download, Settings, AlertCircle } from "lucide-react"
import type { DateRange } from "react-day-picker"

interface ReportBuilderProps {
  onGenerateReport: (reportType: string, format: "pdf" | "excel" | "csv", options?: any) => Promise<void>
  isGenerating: boolean
  error: string | null
}

const reportTypes = [
  { value: "FinancialSummary", label: "Financial Summary" },
  { value: "TransactionHistory", label: "Transaction History" },
  { value: "IncomeVerification", label: "Income Verification Report" },
  { value: "RiskAssessment", label: "Risk Assessment Report" },
  // { value: "CreditAnalysis", label: "Credit Analysis Report" }, // If applicable
]

const formats = [
  { value: "pdf", label: "PDF" },
  { value: "excel", label: "Excel (XLSX)" },
  { value: "csv", label: "CSV" },
]

export function ReportBuilder({ onGenerateReport, isGenerating, error }: ReportBuilderProps) {
  const [selectedReportType, setSelectedReportType] = useState(reportTypes[0].value)
  const [selectedFormat, setSelectedFormat] = useState(formats[0].value as "pdf" | "excel" | "csv")
  const [dateRange, setDateRange] = useState<DateRange | undefined>()
  const [customName, setCustomName] = useState("")
  const [includeSections, setIncludeSections] = useState({
    profileSummary: true,
    accountDetails: true,
    transactionList: true,
  })

  const handleGenerate = () => {
    const options = {
      dateRange,
      customName: customName || `${selectedReportType}_Report`,
      sections: includeSections,
    }
    onGenerateReport(selectedReportType, selectedFormat, options)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Settings className="h-5 w-5" />
          <span>Configure Your Report</span>
        </CardTitle>
        <CardDescription>Select the type of report, format, and desired options.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {error && (
          <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded-md text-sm flex items-center">
            <AlertCircle className="h-4 w-4 mr-2" /> {error}
          </div>
        )}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <Label htmlFor="reportType">Report Type</Label>
            <Select value={selectedReportType} onValueChange={setSelectedReportType}>
              <SelectTrigger id="reportType">
                <SelectValue placeholder="Select report type" />
              </SelectTrigger>
              <SelectContent>
                {reportTypes.map((rt) => (
                  <SelectItem key={rt.value} value={rt.value}>
                    {rt.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="format">Format</Label>
            <Select value={selectedFormat} onValueChange={(v) => setSelectedFormat(v as any)}>
              <SelectTrigger id="format">
                <SelectValue placeholder="Select format" />
              </SelectTrigger>
              <SelectContent>
                {formats.map((f) => (
                  <SelectItem key={f.value} value={f.value}>
                    {f.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Date Range - only show if relevant for report type, e.g., TransactionHistory */}
        {(selectedReportType === "TransactionHistory" || selectedReportType === "FinancialSummary") && (
          <div>
            <Label htmlFor="dateRange">Date Range (Optional)</Label>
            <DateRangePicker id="dateRange" value={dateRange} onValueChange={setDateRange} />
          </div>
        )}

        <div>
          <Label htmlFor="customName">Custom Report Name (Optional)</Label>
          <Input
            id="customName"
            value={customName}
            onChange={(e) => setCustomName(e.target.value)}
            placeholder={`${selectedReportType}_Report`}
          />
        </div>

        {/* Section Selection - placeholder */}
        {/* <div>
          <Label>Include Sections:</Label>
          <div className="space-y-2 mt-1">
            {Object.entries(includeSections).map(([key, value]) => (
              <div key={key} className="flex items-center space-x-2">
                <Checkbox id={key} checked={value} onCheckedChange={(checked) => setIncludeSections(prev => ({...prev, [key]: !!checked}))} />
                <Label htmlFor={key} className="text-sm font-normal capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}</Label>
              </div>
            ))}
          </div>
        </div> */}

        <Button onClick={handleGenerate} disabled={isGenerating} className="w-full md:w-auto">
          <Download className="mr-2 h-4 w-4" />
          {isGenerating ? "Generating..." : "Generate Report"}
        </Button>
      </CardContent>
    </Card>
  )
}
