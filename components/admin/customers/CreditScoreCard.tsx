"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CustomerFinancialProfile } from "@/types/customer"
import { AlertTriangle } from "lucide-react"

interface CreditScoreCardProps {
  creditReports?: CustomerFinancialProfile["creditReports"]
}

export function CreditScoreCard({ creditReports }: CreditScoreCardProps) {
  if (!creditReports) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-orange-500" />
            Credit Report Unavailable
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Credit report data is not available for this customer.
            Please refresh or try again later.
          </p>
        </CardContent>
      </Card>
    )
  }

  const { summary } = creditReports

  const getRiskColor = (riskLevel: string) => {
    switch (riskLevel) {
      case "low": return "bg-green-100 text-green-800 border-green-200"
      case "medium": return "bg-yellow-100 text-yellow-800 border-yellow-200"
      case "high": return "bg-red-100 text-red-800 border-red-200"
      default: return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Credit Summary</CardTitle>
        <CardDescription>
          Multi-bureau credit assessment
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="text-center">
          <div className="text-3xl font-bold">{summary.averageScore}</div>
          <div className="text-sm text-muted-foreground">Average Score ({summary.overallGrade})</div>
        </div>
        
        <div className="flex justify-between items-center">
          <span className="text-sm">Score Variance:</span>
          <span className="font-semibold">{summary.scoreVariance} pts</span>
        </div>
        
        <div className="flex justify-between items-center">
          <span className="text-sm">Risk Level:</span>
          <Badge className={getRiskColor(summary.riskLevel)}>
            {summary.riskLevel.toUpperCase()}
          </Badge>
        </div>
        
        <div className="flex justify-between items-center">
          <span className="text-sm">Primary Bureau:</span>
          <span className="font-semibold capitalize">{summary.primaryBureau}</span>
        </div>

        {summary.majorDiscrepancies.length > 0 && (
          <div className="pt-2 border-t">
            <p className="text-xs text-orange-600 font-medium">Discrepancies Detected</p>
            <p className="text-xs text-muted-foreground">
              Review full tri-bureau assessment for details
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
