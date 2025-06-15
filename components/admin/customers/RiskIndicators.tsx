"use client"

import type { CustomerFinancialProfile } from "@/lib/types"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { AlertTriangle, ShieldAlert, Info } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"

interface RiskIndicatorsProps {
  riskData?: CustomerFinancialProfile["riskIndicators"]
}

const indicatorConfig = [
  {
    key: "irregularIncomePattern" as const,
    label: "Irregular Income Pattern",
    description: "Income deposits show significant inconsistency in amount or frequency.",
  },
  {
    key: "highOverdraftFrequency" as const,
    label: "High Overdraft Frequency",
    description: "Account has experienced multiple overdrafts recently.",
  },
  {
    key: "gamblingActivity" as const,
    label: "Significant Gambling Activity",
    description: "Notable transactions related to gambling platforms detected.",
  },
  {
    key: "cryptocurrencyActivity" as const,
    label: "Cryptocurrency Activity",
    description: "Transactions involving cryptocurrency exchanges or services.",
  },
  {
    key: "largeUnexplainedDeposits" as const,
    label: "Large Unexplained Deposits",
    description: "One or more large deposits without a clear source identified.",
  },
]

export function RiskIndicators({ riskData }: RiskIndicatorsProps) {
  if (!riskData) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Risk Indicators</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">Risk indicator data not available.</p>
        </CardContent>
      </Card>
    )
  }

  const activeRisks = indicatorConfig.filter((ind) => riskData[ind.key])
  const noRisksDetected = activeRisks.length === 0

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          {noRisksDetected ? (
            <ShieldAlert className="h-5 w-5 text-green-500" />
          ) : (
            <AlertTriangle className="h-5 w-5 text-red-500" />
          )}
          <span>Risk Indicators</span>
        </CardTitle>
        <CardDescription>
          {noRisksDetected
            ? "No significant risk indicators detected based on available data."
            : "Potential risk factors identified for this customer."}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {noRisksDetected ? (
          <div className="text-sm text-muted-foreground p-4 border rounded-md bg-green-50 border-green-200">
            <Info className="inline h-4 w-4 mr-1" />
            All clear! Standard risk profile.
          </div>
        ) : (
          <Accordion type="multiple" className="w-full">
            {activeRisks.map((indicator) => (
              <AccordionItem value={indicator.key} key={indicator.key}>
                <AccordionTrigger className="text-sm hover:no-underline">
                  <div className="flex items-center space-x-2">
                    <AlertTriangle className="h-4 w-4 text-red-500" />
                    <span className="font-medium">{indicator.label}</span>
                    <Badge variant="destructive" className="text-xs">
                      Active
                    </Badge>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="text-xs text-muted-foreground px-2">
                  {indicator.description}
                  {/* Placeholder for supporting data */}
                  <p className="mt-1 italic">Further details or specific transaction IDs would appear here.</p>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        )}
      </CardContent>
    </Card>
  )
}
