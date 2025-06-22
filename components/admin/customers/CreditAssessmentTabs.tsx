"use client"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { CreditBureauReport, CreditSummary } from "@/types/customer"
import { AlertTriangle, TrendingUp, TrendingDown, Minus } from "lucide-react"

interface CreditAssessmentTabsProps {
  equifax: CreditBureauReport
  experian: CreditBureauReport
  transunion: CreditBureauReport
  summary: CreditSummary
}

export function CreditAssessmentTabs({ equifax, experian, transunion, summary }: CreditAssessmentTabsProps) {
  const bureauReports = { equifax, experian, transunion }

  const getRiskBadgeColor = (riskLevel: string) => {
    switch (riskLevel) {
      case "low": return "bg-green-100 text-green-800 border-green-200"
      case "medium": return "bg-yellow-100 text-yellow-800 border-yellow-200"
      case "high": return "bg-red-100 text-red-800 border-red-200"
      default: return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount)
  }

  const getUtilizationColor = (percentage: number) => {
    if (percentage >= 70) return "text-red-600"
    if (percentage >= 50) return "text-yellow-600"
    return "text-green-600"
  }

  // Calculate averages
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

  return (
    <Tabs defaultValue="overview" className="w-full">
      <TabsList className="grid w-full grid-cols-3">
        <TabsTrigger value="overview">Overview</TabsTrigger>
        <TabsTrigger value="credit-usage">Credit Usage</TabsTrigger>
        <TabsTrigger value="payment-history">Payment History</TabsTrigger>
      </TabsList>

      <TabsContent value="overview" className="space-y-4">
        <div className="grid grid-cols-1 gap-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Credit Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Average Score</span>
                <span className="font-semibold">{summary.averageScore}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Score Variance</span>
                <span className="font-semibold">{summary.scoreVariance} pts</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Overall Grade</span>
                <Badge className="bg-blue-100 text-blue-800 border-blue-200">
                  {summary.overallGrade}
                </Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Risk Level</span>
                <Badge className={getRiskBadgeColor(summary.riskLevel)}>
                  {summary.riskLevel.toUpperCase()}
                </Badge>
              </div>
            </CardContent>
          </Card>
        </div>

        {summary.majorDiscrepancies.length > 0 && (
          <Alert>
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              <div className="font-medium mb-2">Major Discrepancies Detected:</div>
              <ul className="list-disc list-inside space-y-1">
                {summary.majorDiscrepancies.map((discrepancy, index) => (
                  <li key={index} className="text-sm">{discrepancy}</li>
                ))}
              </ul>
            </AlertDescription>
          </Alert>
        )}
      </TabsContent>

      <TabsContent value="credit-usage" className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Utilization Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Average Utilization</span>
                <span className={`font-semibold ${getUtilizationColor(avgUtilization)}`}>
                  {avgUtilization}%
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Total Available Credit</span>
                <span className="font-semibold">{formatCurrency(totalAvailableCredit)}</span>
              </div>
              {avgUtilization >= 70 && (
                <Alert>
                  <AlertTriangle className="h-4 w-4" />
                  <AlertDescription className="text-sm">
                    High utilization warning: {avgUtilization}% exceeds recommended 30%
                  </AlertDescription>
                </Alert>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Bureau Breakdown</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {Object.entries(bureauReports).map(([bureau, report]) => (
                <div key={bureau} className="flex justify-between items-center">
                  <span className="text-sm text-gray-600 capitalize">{bureau}</span>
                  <div className="text-right">
                    <div className={`font-semibold ${getUtilizationColor(report.utilization.utilizationPercentage)}`}>
                      {report.utilization.utilizationPercentage}%
                    </div>
                    <div className="text-xs text-gray-500">
                      {formatCurrency(report.utilization.usedCredit)} / {formatCurrency(report.utilization.totalCredit)}
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </TabsContent>

      <TabsContent value="payment-history" className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Payment Performance</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Average On-Time Payments</span>
                <span className="font-semibold text-green-600">{avgOnTimePercentage}%</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Total Recent Late Payments</span>
                <span className={`font-semibold ${totalRecentLatePayments > 0 ? 'text-red-600' : 'text-green-600'}`}>
                  {totalRecentLatePayments}
                </span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Bureau Comparison</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {Object.entries(bureauReports).map(([bureau, report]) => (
                <div key={bureau} className="flex justify-between items-center">
                  <span className="text-sm text-gray-600 capitalize">{bureau}</span>
                  <div className="text-right">
                    <div className="font-semibold text-green-600">
                      {report.paymentHistory.onTimePercentage}%
                    </div>
                    <div className="text-xs text-gray-500">
                      {report.paymentHistory.recentLatePayments} late payments
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {totalRecentLatePayments > 0 && (
          <Alert>
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              <div className="font-medium mb-1">Payment Consistency Issues:</div>
              <div className="text-sm">
                {totalRecentLatePayments} recent late payment{totalRecentLatePayments > 1 ? 's' : ''} detected across bureaus
              </div>
            </AlertDescription>
          </Alert>
        )}
      </TabsContent>
    </Tabs>
  )
} 