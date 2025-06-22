"use client"

import { Card, CardContent } from "@/components/ui/card"
import { CustomerFinancialProfile } from "@/types/customer"
import { BureauScoreCard } from "./BureauScoreCard"
import { CreditAssessmentTabs } from "./CreditAssessmentTabs"

interface TriBureauCreditAssessmentProps {
  customer: CustomerFinancialProfile
}

export function TriBureauCreditAssessment({ customer }: TriBureauCreditAssessmentProps) {
  const { creditReports } = customer

  return (
    <div className="space-y-6">
      {/* Bureau Score Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <BureauScoreCard 
          bureau="equifax"
          report={creditReports.equifax}
        />
        <BureauScoreCard 
          bureau="experian"
          report={creditReports.experian}
        />
        <BureauScoreCard 
          bureau="transunion"
          report={creditReports.transunion}
        />
      </div>

      {/* Detailed Tabs */}
      <Card>
        <CardContent className="p-6">
          <CreditAssessmentTabs
            equifax={creditReports.equifax}
            experian={creditReports.experian}
            transunion={creditReports.transunion}
            summary={creditReports.summary}
          />
        </CardContent>
      </Card>
    </div>
  )
} 