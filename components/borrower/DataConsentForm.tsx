"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { ScrollArea } from "@/components/ui/scroll-area"
import { FileText, ShieldCheck, AlertCircle } from "lucide-react"
import Link from "next/link"

interface DataConsentFormProps {
  bankName?: string | null
  customerName?: string | null
  onSubmit: (consentData: Record<string, boolean>) => void
  onDecline: () => void
  isSubmitting: boolean
}

const dataCategories = [
  {
    id: "account_details",
    label: "Account Details (name, type, number)",
    description: "Basic information about your connected bank accounts.",
  },
  { id: "balances", label: "Account Balances", description: "Current and available balances for your accounts." },
  {
    id: "transactions",
    label: "Transaction History (up to 90 days)",
    description: "Details of your recent transactions, including dates, amounts, and descriptions.",
  },
  {
    id: "identity",
    label: "Identity Information (name, address)",
    description: "Information to verify your identity as held by your bank.",
  },
  // { id: "credit_score", label: "Credit Score (if available)", description: "Your credit score if provided by your bank through this connection." },
]

export function DataConsentForm({ bankName, customerName, onSubmit, onDecline, isSubmitting }: DataConsentFormProps) {
  const [consents, setConsents] = useState<Record<string, boolean>>(
    dataCategories.reduce((acc, cat) => ({ ...acc, [cat.id]: false }), {}),
  )
  const [agreeAll, setAgreeAll] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleConsentChange = (id: string, checked: boolean) => {
    setConsents((prev) => ({ ...prev, [id]: checked }))
  }

  const handleAgreeAllChange = (checked: boolean) => {
    setAgreeAll(checked)
    const newConsents = dataCategories.reduce((acc, cat) => ({ ...acc, [cat.id]: checked }), {})
    setConsents(newConsents)
  }

  const handleSubmit = () => {
    setError(null)
    const allCategoriesConsented = dataCategories.every((cat) => consents[cat.id])
    if (!allCategoriesConsented || !agreeAll) {
      setError("Please review and agree to all data sharing terms to continue.")
      return
    }
    onSubmit({ ...consents, agreeToTerms: agreeAll })
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <FileText className="h-6 w-6" />
          <span>Data Sharing Consent</span>
        </CardTitle>
        <CardDescription>
          Please review and consent to share the following information from your connected bank account(s) with{" "}
          {bankName || "us"}.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <p className="text-sm">
          To complete your verification, {customerName || "you"} need to authorize the sharing of specific data from
          your bank. This information will be used solely for the purpose of processing your request with{" "}
          {bankName || "your financial institution"}.
        </p>

        <ScrollArea className="h-60 p-4 border rounded-md">
          <div className="space-y-4">
            {dataCategories.map((category) => (
              <div key={category.id} className="flex items-start space-x-3">
                <Checkbox
                  id={category.id}
                  checked={consents[category.id]}
                  onCheckedChange={(checked) => handleConsentChange(category.id, !!checked)}
                  disabled={isSubmitting}
                />
                <div className="grid gap-1.5 leading-none">
                  <Label htmlFor={category.id} className="font-medium">
                    {category.label}
                  </Label>
                  <p className="text-xs text-muted-foreground">{category.description}</p>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>

        <div className="p-4 bg-gray-50 rounded-lg space-y-2">
          <div className="flex items-center space-x-2">
            <ShieldCheck className="h-5 w-5 text-green-600" />
            <p className="text-sm font-medium">Your Data Security</p>
          </div>
          <ul className="list-disc list-inside text-xs text-muted-foreground space-y-1 pl-2">
            <li>Your data is encrypted during transmission.</li>
            <li>Access is strictly limited and monitored.</li>
            <li>We adhere to GDPR and relevant data privacy laws.</li>
          </ul>
        </div>

        <div className="flex items-start space-x-3 pt-4 border-t">
          <Checkbox
            id="agreeAll"
            checked={agreeAll}
            onCheckedChange={(checked) => handleAgreeAllChange(!!checked)}
            disabled={isSubmitting}
          />
          <div className="grid gap-1.5 leading-none">
            <Label htmlFor="agreeAll" className="font-medium">
              I confirm that I have read and agree to the terms of data sharing. I understand what information will be
              shared and how it will be used.
            </Label>
            <p className="text-xs text-muted-foreground">
              You can review our full{" "}
              <Link href="/privacy-policy" target="_blank" className="underline hover:text-primary">
                Privacy Policy
              </Link>{" "}
              and{" "}
              <Link href="/terms-of-service" target="_blank" className="underline hover:text-primary">
                Terms of Service
              </Link>
              .
            </p>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex flex-col sm:flex-row justify-between gap-4">
        <Button variant="outline" onClick={onDecline} disabled={isSubmitting} className="w-full sm:w-auto">
          Decline & Exit
        </Button>
        <Button onClick={handleSubmit} disabled={isSubmitting || !agreeAll} className="w-full sm:w-auto">
          {isSubmitting ? "Submitting..." : "Agree & Continue"}
        </Button>
      </CardFooter>
    </Card>
  )
}
