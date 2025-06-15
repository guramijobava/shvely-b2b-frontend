"use client"

import { useParams } from "next/navigation"
import { useCustomer } from "@/hooks/useCustomer"
import { AccountCard } from "@/components/admin/customers/AccountCard"
import { AccountDetailsModal } from "@/components/admin/customers/AccountDetailsModal" // To be created
import { LoadingSpinner } from "@/components/shared/LoadingSpinner"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertTriangle, Landmark } from "lucide-react"
import { useState } from "react"
import type { BankAccount } from "@/lib/types"

export default function CustomerAccountsPage() {
  const params = useParams()
  const customerId = params.id as string
  const { customer, isLoading, error } = useCustomer(customerId)
  const [selectedAccount, setSelectedAccount] = useState<BankAccount | null>(null)

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-10">
        <LoadingSpinner size="md" />
        <p className="ml-3 text-muted-foreground">Loading accounts...</p>
      </div>
    )
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertTriangle className="h-4 w-4" />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    )
  }

  if (!customer || !customer.bankAccounts || customer.bankAccounts.length === 0) {
    return (
      <Alert>
        <Landmark className="h-4 w-4" />
        <AlertTitle>No Bank Accounts</AlertTitle>
        <AlertDescription>This customer has no bank accounts linked or data is unavailable.</AlertDescription>
      </Alert>
    )
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {customer.bankAccounts.map((account) => (
          <AccountCard key={account.accountId} account={account} onDetailsClick={() => setSelectedAccount(account)} />
        ))}
      </div>
      {selectedAccount && (
        <AccountDetailsModal
          account={selectedAccount}
          isOpen={!!selectedAccount}
          onClose={() => setSelectedAccount(null)}
        />
      )}
    </div>
  )
}
