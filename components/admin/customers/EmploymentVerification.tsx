"use client"

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, AlertCircle, HelpCircle, Briefcase } from "lucide-react"

// Assuming data structure from useFinancialAnalytics hook (data.employmentVerification)
interface EmploymentVerificationProps {
  data?: {
    status: string // e.g., "Verified", "Partial Match", "Unverified"
    confidence: number // 0-100
    employerNameMatch?: boolean
    consistentDeposits?: boolean
    // Add more fields like estimated length if available
  }
}

export function EmploymentVerification({ data }: EmploymentVerificationProps) {
  if (!data) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Employment Verification</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">Employment verification data not available.</p>
        </CardContent>
      </Card>
    )
  }

  const getStatusBadge = () => {
    if (data.status === "Verified")
      return (
        <Badge className="bg-green-100 text-green-700">
          <CheckCircle className="h-3.5 w-3.5 mr-1" />
          Verified
        </Badge>
      )
    if (data.status === "Partial Match")
      return (
        <Badge className="bg-yellow-100 text-yellow-700">
          <AlertCircle className="h-3.5 w-3.5 mr-1" />
          Partial Match
        </Badge>
      )
    return (
      <Badge variant="destructive">
        <AlertCircle className="h-3.5 w-3.5 mr-1" />
        Unverified
      </Badge>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Briefcase className="h-5 w-5" />
          <span>Employment Verification</span>
        </CardTitle>
        <CardDescription>Assessment of employment status based on income data.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex items-center justify-between p-3 border rounded-md">
          <span className="font-medium text-sm">Overall Status:</span>
          {getStatusBadge()}
        </div>
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">Confidence Score:</span>
          <span className="font-semibold">{data.confidence}%</span>
        </div>
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">Employer Name Match:</span>
          {data.employerNameMatch === undefined ? (
            <HelpCircle className="h-4 w-4 text-gray-400" />
          ) : data.employerNameMatch ? (
            <CheckCircle className="h-4 w-4 text-green-500" />
          ) : (
            <AlertCircle className="h-4 w-4 text-red-500" />
          )}
        </div>
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">Consistent Deposits:</span>
          {data.consistentDeposits === undefined ? (
            <HelpCircle className="h-4 w-4 text-gray-400" />
          ) : data.consistentDeposits ? (
            <CheckCircle className="h-4 w-4 text-green-500" />
          ) : (
            <AlertCircle className="h-4 w-4 text-red-500" />
          )}
        </div>
        {/* Add more verification indicators here */}
        <p className="text-xs text-muted-foreground pt-2 border-t">
          Note: This is an automated assessment based on transactional data analysis. Manual verification may be
          required.
        </p>
      </CardContent>
    </Card>
  )
}
