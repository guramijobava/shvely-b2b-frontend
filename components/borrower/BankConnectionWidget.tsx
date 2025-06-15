"use client"

import { useEffect } from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { LoadingSpinner } from "@/components/shared/LoadingSpinner"
import { Search, University, ExternalLink, ShieldAlert } from "lucide-react"
import Image from "next/image"

interface Bank {
  id: string
  name: string
  logoUrl: string
}

const popularBanks: Bank[] = [
  { id: "chase", name: "Chase", logoUrl: "/placeholder.svg?height=40&width=100" },
  { id: "boa", name: "Bank of America", logoUrl: "/placeholder.svg?height=40&width=100" },
  { id: "wells", name: "Wells Fargo", logoUrl: "/placeholder.svg?height=40&width=100" },
  { id: "citi", name: "Citibank", logoUrl: "/placeholder.svg?height=40&width=100" },
]

interface BankConnectionWidgetProps {
  onConnect: (bankId: string, provider: "stripe" | "teller") => void
  isConnecting: boolean
  connectionError: string | null
  stripeClientSecret?: string | null // For Stripe SDK
  tellerConnectionUrl?: string | null // For Teller SDK
  onConnectionSuccess: (accounts: Array<{ id: string; name: string; last4: string }>) => void
  onConnectionFailure: (errorMessage: string) => void
}

export function BankConnectionWidget({
  onConnect,
  isConnecting,
  connectionError,
  stripeClientSecret,
  tellerConnectionUrl,
  onConnectionSuccess,
  onConnectionFailure,
}: BankConnectionWidgetProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedBank, setSelectedBank] = useState<Bank | null>(null)

  // Placeholder for Stripe/Teller SDK interaction
  useEffect(() => {
    if (stripeClientSecret && selectedBank) {
      // Initialize Stripe Financial Connections SDK with stripeClientSecret
      console.log("Stripe SDK: Initializing with client secret for", selectedBank.name)
      // Simulate SDK flow
      setTimeout(() => {
        const success = Math.random() > 0.2 // 80% success rate
        if (success) {
          onConnectionSuccess([{ id: "acct_123", name: `${selectedBank.name} Checking`, last4: "1234" }])
        } else {
          onConnectionFailure("Stripe connection failed. Please try again or select another bank.")
        }
        setSelectedBank(null) // Reset
      }, 3000)
    }
  }, [stripeClientSecret, selectedBank, onConnectionSuccess, onConnectionFailure])

  useEffect(() => {
    if (tellerConnectionUrl && selectedBank) {
      // Open Teller.io widget/iframe with tellerConnectionUrl
      console.log("Teller SDK: Opening connection URL for", selectedBank.name, tellerConnectionUrl)
      // Simulate SDK flow
      setTimeout(() => {
        const success = Math.random() > 0.2
        if (success) {
          onConnectionSuccess([{ id: "acct_teller_456", name: `${selectedBank.name} Savings`, last4: "5678" }])
        } else {
          onConnectionFailure("Teller.io connection failed. Please try again.")
        }
        setSelectedBank(null) // Reset
      }, 3000)
    }
  }, [tellerConnectionUrl, selectedBank, onConnectionSuccess, onConnectionFailure])

  const handleBankSelect = (bank: Bank) => {
    setSelectedBank(bank)
    onConnect(bank.id, "stripe") // Default to Stripe, could add provider choice
  }

  const filteredBanks = popularBanks.filter((bank) => bank.name.toLowerCase().includes(searchTerm.toLowerCase()))

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <University className="h-6 w-6" />
          <span>Connect Your Bank Account</span>
        </CardTitle>
        <CardDescription>
          Securely link your bank account to verify your information. We use trusted partners like Stripe.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {connectionError && (
          <Alert variant="destructive">
            <ShieldAlert className="h-4 w-4" />
            <AlertDescription>{connectionError}</AlertDescription>
          </Alert>
        )}

        {isConnecting && selectedBank && (
          <div className="text-center space-y-2 p-4 border rounded-lg">
            <LoadingSpinner size="md" className="mx-auto" />
            <p className="font-medium">Connecting to {selectedBank.name}...</p>
            <p className="text-sm text-muted-foreground">You may be redirected to your bank's website.</p>
          </div>
        )}

        {!isConnecting && !stripeClientSecret && !tellerConnectionUrl && (
          <>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search for your bank"
                className="pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              {filteredBanks.map((bank) => (
                <Button
                  key={bank.id}
                  variant="outline"
                  className="h-auto p-4 flex flex-col items-center space-y-2"
                  onClick={() => handleBankSelect(bank)}
                  disabled={isConnecting}
                >
                  <Image
                    src={bank.logoUrl || "/placeholder.svg"}
                    alt={`${bank.name} logo`}
                    width={80}
                    height={32}
                    className="max-h-8 object-contain"
                  />
                  <span className="text-sm">{bank.name}</span>
                </Button>
              ))}
            </div>
            {filteredBanks.length === 0 && searchTerm && (
              <p className="text-sm text-center text-muted-foreground">
                No banks found matching "{searchTerm}". Try a different name.
              </p>
            )}
            <p className="text-xs text-center text-muted-foreground">
              Can't find your bank? You may be able to connect manually or contact support.
            </p>
          </>
        )}

        <div className="text-xs text-muted-foreground text-center space-y-1 pt-4 border-t">
          <p>We use Stripe Financial Connections to link your accounts securely.</p>
          <a
            href="https://stripe.com/financial-connections/data-usage"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:underline"
          >
            Learn more about Stripe's data usage <ExternalLink className="inline h-3 w-3" />
          </a>
        </div>
      </CardContent>
    </Card>
  )
}
