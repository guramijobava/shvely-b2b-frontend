"use client"

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { CheckCircle2, Banknote, CalendarCheck } from "lucide-react"

interface CompletionSuccessProps {
  customerName?: string | null
  bankName?: string | null
  completionTime?: string // ISO string
  connectedAccountsCount?: number
}

export function CompletionSuccess({
  customerName,
  bankName,
  completionTime,
  connectedAccountsCount,
}: CompletionSuccessProps) {
  return (
    <Card className="w-full text-center">
      <CardHeader>
        <CheckCircle2 className="h-16 w-16 text-green-500 mx-auto mb-4" />
        <CardTitle className="text-3xl">Verification Complete!</CardTitle>
        <CardDescription className="text-lg">
          Thank you, {customerName || "Valued Customer"}. Your bank information has been securely submitted to{" "}
          {bankName || "your financial institution"}.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="p-6 bg-gray-50 rounded-lg space-y-3">
          <div className="flex items-center justify-center space-x-2">
            <Banknote className="h-5 w-5 text-muted-foreground" />
            <p className="text-sm">
              <span className="font-semibold">{connectedAccountsCount || "Multiple"}</span> bank account(s) successfully
              connected and verified.
            </p>
          </div>
          {completionTime && (
            <div className="flex items-center justify-center space-x-2">
              <CalendarCheck className="h-5 w-5 text-muted-foreground" />
              <p className="text-sm">Completed on: {new Date(completionTime).toLocaleString()}</p>
            </div>
          )}
        </div>
        <p className="text-muted-foreground">
          {bankName || "Your financial institution"} will now review your information. You will be contacted regarding
          the next steps for your request.
        </p>
      </CardContent>
    </Card>
  )
}
