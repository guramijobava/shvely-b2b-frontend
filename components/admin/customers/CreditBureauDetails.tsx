"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { CreditBureauReport, CreditSummary } from "@/types/customer"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import { TrendingUp, TrendingDown, Clock, CreditCard, History, BarChart3, Eye, Shield, FileText, Building, AlertTriangle, CheckCircle, Target, Activity } from "lucide-react"
import { CreditScoreFactorModal } from "./CreditScoreFactorModal"
import { PublicRecordsModal } from "./PublicRecordsModal"

interface CreditBureauDetailsProps {
  equifax: CreditBureauReport
  experian: CreditBureauReport
  transunion: CreditBureauReport
  summary: CreditSummary
}

const bureauDisplayNames = {
  equifax: "Equifax",
  experian: "Experian", 
  transunion: "TransUnion"
}

const gradeColors = {
  A: "bg-green-100 text-green-800 border-green-200",
  B: "bg-blue-100 text-blue-800 border-blue-200", 
  C: "bg-yellow-100 text-yellow-800 border-yellow-200",
  D: "bg-orange-100 text-orange-800 border-orange-200",
  F: "bg-red-100 text-red-800 border-red-200"
}

const ratingColors = {
  EXCEPTIONAL: "bg-green-100 text-green-800 border-green-200",
  "VERY GOOD": "bg-blue-100 text-blue-800 border-blue-200",
  GOOD: "bg-cyan-100 text-cyan-800 border-cyan-200",
  FAIR: "bg-yellow-100 text-yellow-800 border-yellow-200",
  POOR: "bg-red-100 text-red-800 border-red-200"
}

const impactIcons = {
  high: <TrendingUp className="h-4 w-4 text-red-600" />,
  medium: <BarChart3 className="h-4 w-4 text-yellow-600" />,
  low: <TrendingDown className="h-4 w-4 text-green-600" />
}

export function CreditBureauDetails({ equifax, experian, transunion, summary }: CreditBureauDetailsProps) {
  const [selectedBureau, setSelectedBureau] = useState<"equifax" | "experian" | "transunion">("equifax")
  const [modalOpen, setModalOpen] = useState(false)
  const [selectedFactor, setSelectedFactor] = useState<"paymentHistory" | "amountOfDebt" | "lengthOfCreditHistory" | "amountOfNewCredit" | "creditMix" | null>(null)
  const [publicRecordsModalOpen, setPublicRecordsModalOpen] = useState(false)
  
  const bureauReports = { equifax, experian, transunion }
  const selectedReport = bureauReports[selectedBureau]

  // Default credit score factors if not available
  const defaultCreditScoreFactors = {
    paymentHistory: { score: 0, rating: "POOR" as const, impact: "high" as const },
    amountOfDebt: { score: 0, rating: "POOR" as const, impact: "high" as const },
    lengthOfCreditHistory: { score: 0, rating: "POOR" as const, impact: "medium" as const, averageAccountAge: 0 },
    amountOfNewCredit: { score: 0, rating: "POOR" as const, impact: "low" as const, recentInquiries: 0 },
    creditMix: { score: 0, rating: "POOR" as const, impact: "low" as const, accountTypes: [] }
  }

  // Default credit history if not available
  const defaultCreditHistory = Array.from({ length: 12 }, (_, i) => {
    const date = new Date()
    date.setMonth(date.getMonth() - (11 - i))
    return {
      month: date.toISOString().slice(0, 7) + "-01",
      score: selectedReport.score
    }
  })

  const creditScoreFactors = selectedReport.creditScoreFactors || defaultCreditScoreFactors
  const creditHistory = selectedReport.creditHistory || defaultCreditHistory

  // Calculate dynamic Y-axis domain with 20% padding
  const calculateYAxisDomain = (data: typeof creditHistory) => {
    if (!data || data.length === 0) return [300, 850]
    
    const scores = data.map(item => item.score)
    const minScore = Math.min(...scores)
    const maxScore = Math.max(...scores)
    
    // Add 15% padding below minimum, 10% above maximum
    const paddingBelow = minScore * 0.15
    const paddingAbove = maxScore * 0.1
    
    const yMin = Math.max(300, Math.floor(minScore - paddingBelow)) // Don't go below 300
    const yMax = Math.min(850, Math.ceil(maxScore + paddingAbove))  // Don't go above 850
    
    return [yMin, yMax]
  }

  const yAxisDomain = calculateYAxisDomain(creditHistory)

  const handleViewDetails = (factor: "paymentHistory" | "amountOfDebt" | "lengthOfCreditHistory" | "amountOfNewCredit" | "creditMix") => {
    setSelectedFactor(factor)
    setModalOpen(true)
  }

  const closeModal = () => {
    setModalOpen(false)
    setSelectedFactor(null)
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    })
  }

  const getRiskBadgeColor = (riskLevel: string) => {
    switch (riskLevel) {
      case "low": return "bg-green-100 text-green-800 border-green-200"
      case "medium": return "bg-yellow-100 text-yellow-800 border-yellow-200"
      case "high": return "bg-red-100 text-red-800 border-red-200"
      default: return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  const getScoreGradeColor = (grade: string) => {
    switch (grade) {
      case "A": return "bg-green-100 text-green-800 border-green-200"
      case "B": return "bg-blue-100 text-blue-800 border-blue-200"
      case "C": return "bg-yellow-100 text-yellow-800 border-yellow-200"
      case "D": return "bg-orange-100 text-orange-800 border-orange-200"
      case "F": return "bg-red-100 text-red-800 border-red-200"
      default: return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  // Calculate enhanced metrics
  const avgUtilization = Math.round((equifax.utilization.utilizationPercentage + 
                                   experian.utilization.utilizationPercentage + 
                                   transunion.utilization.utilizationPercentage) / 3 * 10) / 10

  const totalAvailableCredit = equifax.utilization.totalCredit + 
                              experian.utilization.totalCredit + 
                              transunion.utilization.totalCredit

  const avgOnTimePercentage = Math.round((equifax.paymentHistory.onTimePercentage + 
                                        experian.paymentHistory.onTimePercentage + 
                                        transunion.paymentHistory.onTimePercentage) / 3)

  const totalRecentLatePayments = equifax.paymentHistory.recentLatePayments + 
                                experian.paymentHistory.recentLatePayments + 
                                transunion.paymentHistory.recentLatePayments

  // Mock enhanced data for demonstration
  const enhancedData = {
    publicRecords: {
      bankruptcies: [
        { type: "Chapter 7", filedDate: "2019-03-15", status: "Discharged", amount: 45000, court: "Eastern District Court" },
        { type: "Chapter 13", filedDate: "2021-08-22", status: "Active", amount: 28500, court: "Central District Court" }
      ],
      taxLiens: [
        { type: "Federal Tax Lien", filedDate: "2022-01-10", status: "Active", amount: 12500, agency: "IRS" },
        { type: "State Tax Lien", filedDate: "2021-11-05", status: "Released", amount: 3200, agency: "State Revenue" }
      ],
      civilJudgments: [
        { type: "Civil Judgment", filedDate: "2020-09-18", status: "Satisfied", amount: 8900, court: "County Superior Court" }
      ],
      foreclosures: [
        { type: "Foreclosure", filedDate: "2018-12-03", status: "Completed", amount: 185000, property: "123 Main St, Anytown, ST" }
      ]
    }
  }

  return (
    <div className="space-y-6">
      {/* Bureau Selection */}
      <Card>
        <CardHeader className="pb-4">
          <CardTitle className="text-lg">Select Credit Bureau</CardTitle>
        </CardHeader>
        <CardContent>
          <RadioGroup 
            value={selectedBureau} 
            onValueChange={(value) => setSelectedBureau(value as "equifax" | "experian" | "transunion")}
            className="flex flex-col sm:flex-row gap-6"
          >
            {Object.entries(bureauReports).map(([bureau, report]) => (
              <div key={bureau} className="flex items-center space-x-3 p-4 border rounded-lg hover:bg-gray-50">
                <RadioGroupItem value={bureau} id={bureau} />
                <Label htmlFor={bureau} className="flex-1 cursor-pointer">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium">{bureauDisplayNames[bureau as keyof typeof bureauDisplayNames]}</div>
                      <div className="text-sm text-gray-500">Score: {report.score}</div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge className={gradeColors[report.grade]}>
                        {report.grade}
                      </Badge>
                    </div>
                  </div>
                </Label>
              </div>
            ))}
          </RadioGroup>
        </CardContent>
      </Card>

                {/* Credit History Chart */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <History className="h-5 w-5" />
            <span>Credit History - {bureauDisplayNames[selectedBureau]}</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={creditHistory}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="month" 
                  tick={{ fontSize: 12 }}
                  tickFormatter={(value) => new Date(value).toLocaleDateString('en-US', { month: 'short', year: '2-digit' })}
                />
                <YAxis 
                  domain={yAxisDomain}
                  tick={{ fontSize: 12 }}
                />
                <Tooltip 
                  labelFormatter={(value) => new Date(value).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                  formatter={(value) => [value, 'Credit Score']}
                />
                <Line 
                  type="monotone" 
                  dataKey="score" 
                  stroke="#2563eb" 
                  strokeWidth={3}
                  dot={{ fill: '#2563eb', strokeWidth: 2, r: 4 }}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Credit Score Factors */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <BarChart3 className="h-5 w-5" />
            <span>Credit Score Factors</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
                     {/* Payment History */}
          <div className="border rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center space-x-2">
                <CreditCard className="h-4 w-4" />
                <span className="font-medium">Payment History</span>
                {impactIcons[creditScoreFactors.paymentHistory.impact]}
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-500">{creditScoreFactors.paymentHistory.score}/100</span>
                <Badge className={ratingColors[creditScoreFactors.paymentHistory.rating]}>
                  {creditScoreFactors.paymentHistory.rating}
                </Badge>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-600">
                {selectedReport.paymentHistory.onTimePercentage}% on-time payments, {selectedReport.paymentHistory.recentLatePayments} recent late payments
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleViewDetails("paymentHistory")}
                className="ml-2"
              >
                <Eye className="h-4 w-4 mr-1" />
                View Details
              </Button>
            </div>
          </div>

          {/* Amount of Debt */}
          <div className="border rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center space-x-2">
                <TrendingUp className="h-4 w-4" />
                <span className="font-medium">Amount of Debt</span>
                {impactIcons[creditScoreFactors.amountOfDebt.impact]}
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-500">{creditScoreFactors.amountOfDebt.score}/100</span>
                <Badge className={ratingColors[creditScoreFactors.amountOfDebt.rating]}>
                  {creditScoreFactors.amountOfDebt.rating}
                </Badge>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-600">
                {selectedReport.utilization.utilizationPercentage}% utilization ({formatCurrency(selectedReport.utilization.usedCredit)} of {formatCurrency(selectedReport.utilization.totalCredit)})
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleViewDetails("amountOfDebt")}
                className="ml-2"
              >
                <Eye className="h-4 w-4 mr-1" />
                View Details
              </Button>
            </div>
          </div>

          {/* Length of Credit History */}
          <div className="border rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center space-x-2">
                <Clock className="h-4 w-4" />
                <span className="font-medium">Length of Credit History</span>
                {impactIcons[creditScoreFactors.lengthOfCreditHistory.impact]}
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-500">{creditScoreFactors.lengthOfCreditHistory.score}/100</span>
                <Badge className={ratingColors[creditScoreFactors.lengthOfCreditHistory.rating]}>
                  {creditScoreFactors.lengthOfCreditHistory.rating}
                </Badge>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-600">
                Average account age: {creditScoreFactors.lengthOfCreditHistory.averageAccountAge} years
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleViewDetails("lengthOfCreditHistory")}
                className="ml-2"
              >
                <Eye className="h-4 w-4 mr-1" />
                View Details
              </Button>
            </div>
          </div>

          {/* Amount of New Credit */}
          <div className="border rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center space-x-2">
                <TrendingUp className="h-4 w-4" />
                <span className="font-medium">Amount of New Credit</span>
                {impactIcons[creditScoreFactors.amountOfNewCredit.impact]}
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-500">{creditScoreFactors.amountOfNewCredit.score}/100</span>
                <Badge className={ratingColors[creditScoreFactors.amountOfNewCredit.rating]}>
                  {creditScoreFactors.amountOfNewCredit.rating}
                </Badge>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-600">
                {creditScoreFactors.amountOfNewCredit.recentInquiries} recent inquiries
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleViewDetails("amountOfNewCredit")}
                className="ml-2"
              >
                <Eye className="h-4 w-4 mr-1" />
                View Details
              </Button>
            </div>
          </div>

          {/* Credit Mix */}
          <div className="border rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center space-x-2">
                <BarChart3 className="h-4 w-4" />
                <span className="font-medium">Credit Mix</span>
                {impactIcons[creditScoreFactors.creditMix.impact]}
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-500">{creditScoreFactors.creditMix.score}/100</span>
                <Badge className={ratingColors[creditScoreFactors.creditMix.rating]}>
                  {creditScoreFactors.creditMix.rating}
                </Badge>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-600">
                Account types: {creditScoreFactors.creditMix.accountTypes.join(", ") || "No account types available"}
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleViewDetails("creditMix")}
                className="ml-2"
              >
                <Eye className="h-4 w-4 mr-1" />
                View Details
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>



      {/* Public Records */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <FileText className="h-5 w-5 text-purple-600" />
            <span>Public Records</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 flex-1">
              <div className="text-center">
                <div className="text-2xl font-bold text-red-600">{enhancedData.publicRecords.bankruptcies.length}</div>
                <div className="text-sm text-gray-600">Bankruptcies</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-red-600">{enhancedData.publicRecords.taxLiens.length}</div>
                <div className="text-sm text-gray-600">Tax Liens</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-red-600">{enhancedData.publicRecords.civilJudgments.length}</div>
                <div className="text-sm text-gray-600">Civil Judgments</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-red-600">{enhancedData.publicRecords.foreclosures.length}</div>
                <div className="text-sm text-gray-600">Foreclosures</div>
              </div>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPublicRecordsModalOpen(true)}
              className="ml-4"
            >
              <Eye className="h-4 w-4 mr-1" />
              View Details
            </Button>
          </div>
          
          {/* Risk indicator */}
          {(enhancedData.publicRecords.bankruptcies.length > 0 || 
            enhancedData.publicRecords.taxLiens.length > 0 || 
            enhancedData.publicRecords.civilJudgments.length > 0 || 
            enhancedData.publicRecords.foreclosures.length > 0) && (
            <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
              <div className="flex items-center space-x-2 text-red-700">
                <AlertTriangle className="h-4 w-4" />
                <span className="text-sm font-medium">
                  {enhancedData.publicRecords.bankruptcies.length + 
                   enhancedData.publicRecords.taxLiens.length + 
                   enhancedData.publicRecords.civilJudgments.length + 
                   enhancedData.publicRecords.foreclosures.length} adverse public record(s) found
                </span>
              </div>
            </div>
          )}

          {/* No records message */}
          {enhancedData.publicRecords.bankruptcies.length === 0 && 
           enhancedData.publicRecords.taxLiens.length === 0 && 
           enhancedData.publicRecords.civilJudgments.length === 0 && 
           enhancedData.publicRecords.foreclosures.length === 0 && (
            <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
              <div className="flex items-center space-x-2 text-green-700">
                <CheckCircle className="h-4 w-4" />
                <span className="text-sm font-medium">No adverse public records found</span>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Bureau Report Details - Current Bureau */}
      <Card>
        <CardHeader>
          <CardTitle>Bureau Report Details - {bureauDisplayNames[selectedBureau]}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">Credit Score</span>
            <div className="flex items-center space-x-2">
              <span className="font-semibold text-2xl">{selectedReport.score}</span>
              <Badge className={gradeColors[selectedReport.grade]}>
                {selectedReport.grade}
              </Badge>
            </div>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">Last Updated</span>
            <span className="font-semibold">{formatDate(selectedReport.lastUpdated)}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">Credit Utilization</span>
            <span className="font-semibold">{selectedReport.utilization.utilizationPercentage}%</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">Available Credit</span>
            <span className="font-semibold">{formatCurrency(selectedReport.utilization.totalCredit - selectedReport.utilization.usedCredit)}</span>
          </div>
        </CardContent>
      </Card>

      {summary.majorDiscrepancies.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <AlertTriangle className="h-5 w-5 text-red-600" />
              <span>Major Discrepancies</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {summary.majorDiscrepancies.map((discrepancy, index) => (
                <div key={index} className="flex items-center space-x-2 p-3 bg-red-50 border border-red-200 rounded-lg">
                  <AlertTriangle className="h-4 w-4 text-red-600" />
                  <span className="text-sm text-red-700">{discrepancy}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Credit Score Factor Details Modal */}
      {selectedFactor && (
        <CreditScoreFactorModal
          isOpen={modalOpen}
          onClose={closeModal}
          factor={selectedFactor}
          report={selectedReport}
          bureauName={bureauDisplayNames[selectedBureau]}
        />
      )}

      {/* Public Records Modal */}
      <PublicRecordsModal
        isOpen={publicRecordsModalOpen}
        onClose={() => setPublicRecordsModalOpen(false)}
      />
    </div>
  )
} 