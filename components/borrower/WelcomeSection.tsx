"use client"

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ShieldCheck, Lock } from "lucide-react"
import Image from "next/image"

interface WelcomeSectionProps {
  customerName?: string | null
  bankName?: string | null
  onProceed: () => void
}

export function WelcomeSection({ customerName, bankName, onProceed }: WelcomeSectionProps) {
  return (
    <Card className="w-full">
      <CardHeader className="text-center">
        {bankName && (
          <Image
            src={`/placeholder.svg?height=60&width=150&query=${encodeURIComponent(bankName)} Logo`}
            alt={`${bankName} Logo`}
            width={150}
            height={60}
            className="mx-auto mb-4"
          />
        )}
        <CardTitle className="text-2xl">Welcome, {customerName || "Valued Customer"}!</CardTitle>
        <CardDescription>
          {bankName || "Your financial institution"} requires a quick verification to proceed with your request.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <p className="text-center text-muted-foreground">
          This secure process will help us confirm your bank account information. It typically takes just a few minutes.
        </p>

        <div className="flex justify-around items-center text-sm text-muted-foreground p-4 bg-gray-50 rounded-lg">
          <div className="flex items-center space-x-2">
            <ShieldCheck className="h-5 w-5 text-green-600" />
            <span>Bank-Level Security</span>
          </div>
          <div className="flex items-center space-x-2">
            <Lock className="h-5 w-5 text-green-600" />
            <span>Encrypted Connection</span>
          </div>
        </div>

        <Button onClick={onProceed} className="w-full" size="lg">
          Start Verification
        </Button>

        <p className="text-xs text-center text-muted-foreground">
          By proceeding, you acknowledge that you are authorized to share information for the accounts you connect.
        </p>
      </CardContent>
    </Card>
  )
}
