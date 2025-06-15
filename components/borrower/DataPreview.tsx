"use client"

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Eye, ShieldCheck } from "lucide-react"

interface AccountPreview {
  bankName: string
  accountType: string
  maskedAccountNumber: string
  balance?: string // e.g., "$X,XXX.XX"
}

interface DataPreviewProps {
  bankName?: string | null
  connectedAccounts: AccountPreview[] // Simplified for preview
}

export function DataPreview({ bankName, connectedAccounts }: DataPreviewProps) {
  if (!connectedAccounts || connectedAccounts.length === 0) {
    return null // Don't show if no accounts connected or preview not applicable
  }

  return (
    <Card className="w-full my-6">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Eye className="h-6 w-6" />
          <span>Data Sharing Preview</span>
        </CardTitle>
        <CardDescription>
          Here's a sample of the information that will be shared with {bankName || "us"} once you consent.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="p-4 border rounded-lg bg-gray-50">
          <h4 className="font-medium mb-2">Connected Accounts Summary:</h4>
          {connectedAccounts.map((acc, index) => (
            <div key={index} className="text-sm mb-1">
              <span className="font-semibold">{acc.bankName}</span> - {acc.accountType} (**** {acc.maskedAccountNumber})
              {acc.balance && <span className="text-muted-foreground"> - Balance: {acc.balance}</span>}
            </div>
          ))}
        </div>

        <div className="text-sm text-muted-foreground p-3 border border-dashed rounded-md">
          <p className="font-medium mb-1">Example Transaction Data (Illustrative):</p>
          <ul className="list-disc list-inside pl-2 text-xs">
            <li>Grocery Store Purchase: -$54.20</li>
            <li>Monthly Salary Deposit: +$2,500.00</li>
            <li>Utility Bill Payment: -$85.00</li>
          </ul>
          <p className="mt-2 text-xs">
            Actual transaction details (dates, amounts, descriptions) for up to 90 days will be shared if consented.
          </p>
        </div>

        <div className="flex items-center space-x-2 text-xs text-muted-foreground p-3 bg-blue-50 border border-blue-200 rounded-lg">
          <ShieldCheck className="h-5 w-5 text-blue-600 flex-shrink-0" />
          <p>
            <strong>Privacy Note:</strong> This is a simplified preview. The actual data shared will be based on your
            consent choices. All data is handled securely.
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
