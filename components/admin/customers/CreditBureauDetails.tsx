"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { CreditBureauReport } from "@/types/customer"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import { TrendingUp, TrendingDown, Clock, CreditCard, History, BarChart3 } from "lucide-react"

interface CreditBureauDetailsProps {
  equifax: CreditBureauReport
  experian: CreditBureauReport
  transunion: CreditBureauReport
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

export function CreditBureauDetails({ equifax, experian, transunion }: CreditBureauDetailsProps) {
  const [selectedBureau, setSelectedBureau] = useState<"equifax" | "experian" | "transunion">("equifax")
  
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
                  domain={[300, 850]}
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
            <div className="text-sm text-gray-600">
              {selectedReport.paymentHistory.onTimePercentage}% on-time payments, {selectedReport.paymentHistory.recentLatePayments} recent late payments
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
            <div className="text-sm text-gray-600">
              {selectedReport.utilization.utilizationPercentage}% utilization ({formatCurrency(selectedReport.utilization.usedCredit)} of {formatCurrency(selectedReport.utilization.totalCredit)})
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
            <div className="text-sm text-gray-600">
              Average account age: {creditScoreFactors.lengthOfCreditHistory.averageAccountAge} years
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
            <div className="text-sm text-gray-600">
              {creditScoreFactors.amountOfNewCredit.recentInquiries} recent inquiries
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
            <div className="text-sm text-gray-600">
              Account types: {creditScoreFactors.creditMix.accountTypes.join(", ") || "No account types available"}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Bureau Report Summary */}
      <Card>
        <CardHeader>
          <CardTitle>Report Summary - {bureauDisplayNames[selectedBureau]}</CardTitle>
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
    </div>
  )
} 