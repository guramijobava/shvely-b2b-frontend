"use client"

import type { BankAccount } from "@/lib/types"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { formatCurrency, formatDate } from "@/lib/utils"
import { X, Download, Landmark, Info } from "lucide-react"
// Placeholder for chart component
const PlaceholderChart = ({ data, title }: { data: any[]; title: string }) => (
  <div className="mt-2">
    <h4 className="text-xs font-semibold text-muted-foreground mb-1">{title}</h4>
    <div className="h-40 bg-gray-100 rounded-md flex items-center justify-center text-sm text-gray-400">
      Chart Placeholder (e.g., Recharts)
    </div>
  </div>
)

interface AccountDetailsModalProps {
  account: BankAccount | null
  isOpen: boolean
  onClose: () => void
}

export function AccountDetailsModal({ account, isOpen, onClose }: AccountDetailsModalProps) {
  if (!account) return null

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <Landmark className="h-5 w-5" />
            <span>{account.bankName} - Account Details</span>
          </DialogTitle>
          <DialogDescription>
            Type: {account.accountType.charAt(0).toUpperCase() + account.accountType.slice(1)} | Number: ****
            {account.accountNumber.slice(-4)}
          </DialogDescription>
        </DialogHeader>

        <div className="flex-grow overflow-y-auto pr-2 space-y-4 py-4">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-xs text-muted-foreground">Current Balance</p>
              <p className="font-semibold text-lg">{formatCurrency(account.balance, account.currency)}</p>
            </div>
            {account.availableBalance !== undefined && (
              <div>
                <p className="text-xs text-muted-foreground">Available Balance</p>
                <p className="font-semibold text-lg">{formatCurrency(account.availableBalance, account.currency)}</p>
              </div>
            )}
            <div>
              <p className="text-xs text-muted-foreground">Account Opened</p>
              <p className="font-semibold">{formatDate(account.openedDate)}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Currency</p>
              <p className="font-semibold">{account.currency}</p>
            </div>
          </div>

          <Separator />

          {/* Placeholder for Monthly Balance History Chart */}
          <PlaceholderChart data={account.monthlyBalances || []} title="Monthly Balance History" />

          <Separator />

          <div>
            <h4 className="text-sm font-semibold mb-1">Recent Transactions (Sample)</h4>
            {account.transactions && account.transactions.length > 0 ? (
              <ul className="space-y-1 text-xs max-h-40 overflow-y-auto border rounded-md p-2">
                {account.transactions.slice(0, 5).map((tx) => (
                  <li key={tx.id} className="flex justify-between">
                    <span>{tx.description}</span>
                    <span className={tx.amount < 0 ? "text-red-600" : "text-green-600"}>
                      {formatCurrency(tx.amount, account.currency)}
                    </span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-xs text-muted-foreground">No recent transaction data available for this preview.</p>
            )}
          </div>

          <Separator />

          <div className="text-xs text-muted-foreground">
            <Info className="inline h-3.5 w-3.5 mr-1" />
            This is a summary. Full transaction history is available in the 'Transactions' tab.
          </div>
        </div>

        <DialogFooter className="pt-4 border-t">
          <Button variant="outline" onClick={() => console.log("Export account data for", account.accountId)}>
            <Download className="mr-2 h-4 w-4" /> Export Data
          </Button>
          <Button onClick={onClose}>
            <X className="mr-2 h-4 w-4" /> Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
