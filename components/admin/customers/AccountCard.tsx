"use client"

import type { BankAccount } from "@/lib/types"
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { formatCurrency, formatDate } from "@/lib/utils"
import { TrendingUp, TrendingDown, Minus, Eye } from "lucide-react"
import Image from "next/image"

interface AccountCardProps {
  account: BankAccount
  onDetailsClick: () => void
}

export function AccountCard({ account, onDetailsClick }: AccountCardProps) {
  const getAccountTypeColor = (type: string) => {
    switch (type) {
      case "checking":
        return "bg-blue-100 text-blue-700"
      case "savings":
        return "bg-green-100 text-green-700"
      case "credit":
        return "bg-purple-100 text-purple-700"
      case "investment":
        return "bg-yellow-100 text-yellow-700"
      default:
        return "bg-gray-100 text-gray-700"
    }
  }

  // Placeholder for balance trend
  const balanceTrend = Math.random() > 0.5 ? "up" : Math.random() > 0.5 ? "down" : "stable"
  const TrendIcon = balanceTrend === "up" ? TrendingUp : balanceTrend === "down" ? TrendingDown : Minus

  return (
    <Card className="flex flex-col justify-between">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center space-x-2">
            <Image
              src={`/placeholder.svg?height=24&width=24&query=${account.bankName} logo`}
              alt={`${account.bankName} logo`}
              width={24}
              height={24}
              className="rounded-sm"
            />
            <CardTitle className="text-lg">{account.bankName}</CardTitle>
          </div>
          <Badge variant="outline" className={`text-xs ${getAccountTypeColor(account.accountType)} border-current`}>
            {account.accountType.charAt(0).toUpperCase() + account.accountType.slice(1)}
          </Badge>
        </div>
        <p className="text-xs text-muted-foreground">Account: ****{account.accountNumber.slice(-4)}</p>
      </CardHeader>
      <CardContent className="space-y-1 py-2">
        <div>
          <p className="text-xs text-muted-foreground">Current Balance</p>
          <p className="text-2xl font-bold">{formatCurrency(account.balance, account.currency)}</p>
        </div>
        {account.availableBalance !== undefined && (
          <div>
            <p className="text-xs text-muted-foreground">Available Balance</p>
            <p className="text-sm">{formatCurrency(account.availableBalance, account.currency)}</p>
          </div>
        )}
        <div className="flex items-center justify-between text-xs text-muted-foreground pt-1">
          <span>Opened: {formatDate(account.openedDate)}</span>
          <span className="flex items-center">
            <TrendIcon
              className={`h-3.5 w-3.5 mr-0.5 ${balanceTrend === "up" ? "text-green-500" : balanceTrend === "down" ? "text-red-500" : ""}`}
            />
            Trend
          </span>
        </div>
      </CardContent>
      <CardFooter className="pt-3">
        <Button variant="outline" size="sm" className="w-full" onClick={onDetailsClick}>
          <Eye className="mr-2 h-4 w-4" /> View Details
        </Button>
      </CardFooter>
    </Card>
  )
}
