"use client"

import { CustomerFinancialProfile } from "@/types/customer"
import { CreditBureauDetails } from "./CreditBureauDetails"

interface TriBureauCreditAssessmentProps {
  customer: CustomerFinancialProfile
}

export function TriBureauCreditAssessment({ customer }: TriBureauCreditAssessmentProps) {
  const { creditReports } = customer

  return (
    <CreditBureauDetails
      equifax={creditReports.equifax}
      experian={creditReports.experian}
      transunion={creditReports.transunion}
      summary={creditReports.summary}
    />
  )
} 