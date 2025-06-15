"use client"

// Remove useState import if no longer used for currentFilters
// import { useState } from "react"
import { useParams } from "next/navigation"
import { useCustomerTransactions } from "@/hooks/useCustomerTransactions"
import { TransactionTable } from "@/components/admin/customers/TransactionTable"
import { TransactionFilters } from "@/components/admin/customers/TransactionFilters"
import { LoadingSpinner } from "@/components/shared/LoadingSpinner"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertTriangle, ListChecks } from "lucide-react"

// Define a stable initial filter object if needed, or pass empty object
const stableInitialFilters = {
  search: "",
  accountId: "",
  // type: undefined, // Let the hook handle defaults
  // status: undefined, // Let the hook handle defaults
  category: "",
}

export default function CustomerTransactionsPage() {
  const params = useParams()
  const customerId = params.id as string

  // Remove local currentFilters state:
  // const [currentFilters, setCurrentFilters] = useState({ ... });

  const {
    transactions,
    pagination,
    isLoading,
    error,
    // filters, // You can use this if you need to read the current filters state
    updateFilters, // This is now stable due to useCallback in the hook
    goToPage,
    refetch,
  } = useCustomerTransactions(customerId, stableInitialFilters) // Pass stable initial filters

  // The handleFilterChange function is now just updateFilters from the hook
  // const handleFilterChange = (newAppliedFilters: any) => {
  //   updateFilters(newAppliedFilters);
  // };

  if (isLoading && !transactions.length) {
    return (
      <div className="flex items-center justify-center py-10">
        <LoadingSpinner size="md" />
        <p className="ml-3 text-muted-foreground">Loading transactions...</p>
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

  return (
    <div className="space-y-6">
      {/* Pass updateFilters directly. It's now stable. */}
      <TransactionFilters onFiltersChange={updateFilters} isLoading={isLoading} />

      {/* TransactionAnalytics would go here */}
      {/* <TransactionAnalytics transactions={transactions} isLoading={isLoading} /> */}

      <TransactionTable
        transactions={transactions}
        pagination={pagination}
        isLoading={isLoading}
        onPageChange={goToPage} // goToPage is also stable now
      />
      {!isLoading && transactions.length === 0 && (
        <Alert className="mt-4">
          <ListChecks className="h-4 w-4" />
          <AlertTitle>No Transactions Found</AlertTitle>
          <AlertDescription>
            No transactions match the current filters, or this customer has no transaction history.
          </AlertDescription>
        </Alert>
      )}
    </div>
  )
}
