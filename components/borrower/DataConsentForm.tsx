"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
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

  // Simplified - no individual consent changes needed

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

        {/* Prominent "Consent to All" section */}
        <div className="p-6 bg-blue-50 border-2 border-blue-200 rounded-lg space-y-4">
          <div className="flex items-start space-x-4">
            <Checkbox
              id="agreeAll"
              checked={agreeAll}
              onCheckedChange={(checked) => handleAgreeAllChange(!!checked)}
              disabled={isSubmitting}
              className="h-6 w-6 mt-1"
            />
            <div className="space-y-2 flex-1">
              <Label htmlFor="agreeAll" className="text-lg font-bold text-blue-900 cursor-pointer">
                Consent to All Data Sharing
              </Label>
              <p className="text-sm text-blue-800">
                By selecting this option, you consent to sharing all the data categories listed below. This is required to complete your verification.
              </p>
            </div>
          </div>
        </div>

        {/* Data categories display (read-only) */}
        <div className="space-y-3">
          <Label className="text-base font-semibold">Data Categories to be Shared:</Label>
          <div className="p-4 border rounded-md bg-gray-50">
            <TooltipProvider>
              <div className="space-y-3">
                {dataCategories.map((category) => (
                  <div key={category.id} className="flex items-start space-x-3">
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <div className="mt-1 cursor-not-allowed">
                          <div className={`h-4 w-4 rounded-sm border flex items-center justify-center transition-all duration-200 ${
                            agreeAll 
                              ? 'bg-primary border-primary text-primary-foreground' 
                              : 'border-gray-300 bg-white opacity-50'
                          }`}>
                            {agreeAll && (
                              <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                              </svg>
                            )}
                          </div>
                        </div>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>
                          {agreeAll 
                            ? "This item is automatically selected when 'Consent to All' is checked above." 
                            : "Individual consent items cannot be selected. Use 'Consent to All' above to proceed."
                          }
                        </p>
                      </TooltipContent>
                    </Tooltip>
                    <div className="grid gap-1.5 leading-none flex-1">
                      <Label className={`font-medium ${agreeAll ? 'text-gray-900' : 'text-gray-500'}`}>
                        {category.label}
                      </Label>
                      <p className="text-xs text-muted-foreground">{category.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </TooltipProvider>
          </div>
          <p className="text-xs text-muted-foreground italic">
            All data categories are required for verification. You must consent to sharing all categories to proceed.
          </p>
        </div>

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

        {/* Terms and conditions */}
        <div className="pt-4 border-t text-center">
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
      </CardContent>
      <CardFooter className="flex flex-col sm:flex-row justify-between gap-4">
        <Button variant="outline" onClick={onDecline} disabled={isSubmitting} className="w-full sm:w-auto">
          Decline & Exit
        </Button>
        <Button onClick={handleSubmit} disabled={isSubmitting || !agreeAll} className="w-full sm:w-auto">
          {isSubmitting 
            ? "Submitting..." 
            : agreeAll 
              ? "I Consent to All & Continue" 
              : "Agree & Continue"
          }
        </Button>
      </CardFooter>
    </Card>
  )
}
