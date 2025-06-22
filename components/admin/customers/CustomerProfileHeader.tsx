"use client"

import { useState } from "react"
import type { CustomerFinancialProfile } from "@/types/customer"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { formatCurrency, formatDate, formatRelativeTime } from "@/lib/utils"
import { Mail, Phone, ShieldCheck, User, DollarSign, TrendingUp, TrendingDown, AlertTriangle, Sparkles } from "lucide-react"
import { CustomerActions } from "./CustomerActions"
import { AIAnalystChat } from "./AIAnalystChat"

interface CustomerProfileHeaderProps {
  customer: CustomerFinancialProfile
}

export function CustomerProfileHeader({ customer }: CustomerProfileHeaderProps) {
  const [isChatOpen, setIsChatOpen] = useState(false)
  const [isChatMinimized, setIsChatMinimized] = useState(false)

  const getInitials = (name: string) =>
    name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()

  const verificationStatus = customer.verificationId ? "Verified" : "Pending" // Simplified
  const verificationDate = customer.verificationId ? customer.lastUpdated : undefined // Assuming lastUpdated is verification date

  const getRiskColor = (riskLevel?: string) => {
    switch (riskLevel) {
      case "low": return "bg-green-100 text-green-800 border-green-200"
      case "medium": return "bg-yellow-100 text-yellow-800 border-yellow-200"
      case "high": return "bg-red-100 text-red-800 border-red-200"
      default: return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  return (
    <>
      <Card>
        <CardHeader className="pb-4">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="flex items-center space-x-4">
              <Avatar className="h-20 w-20 text-3xl">
                <AvatarImage src={`/placeholder.svg?text=${getInitials(customer.customerInfo.fullName)}`} />
                <AvatarFallback>{getInitials(customer.customerInfo.fullName)}</AvatarFallback>
              </Avatar>
              <div>
                <h1 className="text-3xl font-bold">{customer.customerInfo.fullName}</h1>
                <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-muted-foreground mt-1">
                  <a href={`mailto:${customer.customerInfo.email}`} className="flex items-center hover:underline">
                    <Mail className="mr-1.5 h-4 w-4" /> {customer.customerInfo.email}
                  </a>
                  <a href={`tel:${customer.customerInfo.phoneNumber}`} className="flex items-center hover:underline">
                    <Phone className="mr-1.5 h-4 w-4" /> {customer.customerInfo.phoneNumber}
                  </a>
                </div>
              </div>
            </div>
            <div className="w-full md:w-auto">
              <div className="flex items-center gap-2">
                                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => setIsChatOpen(true)}
                    className="flex items-center gap-2 bg-gradient-to-r from-blue-50 to-blue-100 border-blue-200 hover:from-blue-100 hover:to-blue-200"
                  >
                    <Sparkles className="h-4 w-4 text-blue-600" />
                    Chat with Shvely AI
                  </Button>
                <CustomerActions customerId={customer.customerId} customerEmail={customer.customerInfo.email} />
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 text-sm border-t pt-4">
            <div>
              <p className="text-xs text-muted-foreground">Verification Status</p>
              <Badge
                variant={verificationStatus === "Verified" ? "default" : "outline"}
                className={verificationStatus === "Verified" ? "bg-green-100 text-green-700 border-green-300" : ""}
              >
                <ShieldCheck className="mr-1.5 h-3 w-3" /> {verificationStatus}
              </Badge>
              {verificationDate && <p className="text-xs text-muted-foreground mt-0.5">{formatDate(verificationDate)}</p>}
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Credit Score</p>
              <div className="flex items-center space-x-1">
                <span className="text-2xl font-bold">
                  {customer.creditReports?.summary?.averageScore || "N/A"}
                </span>
                {customer.creditReports?.summary?.overallGrade && (
                  <span className="ml-1 text-sm text-muted-foreground">({customer.creditReports.summary.overallGrade})</span>
                )}
              </div>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Total Balance</p>
              <p className="font-semibold text-lg">{formatCurrency(customer.financialSummary?.totalBalance || 0)}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Relationship Length</p>
              <p className="font-semibold">
                {customer.financialSummary?.accountAge ? `${customer.financialSummary.accountAge} years` : "N/A"}
              </p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Last Updated</p>
              <p className="font-semibold">{formatRelativeTime(customer.lastUpdated)}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* AI Analyst Chat */}
      <AIAnalystChat
        customer={customer}
        isOpen={isChatOpen && !isChatMinimized}
        onClose={() => {
          setIsChatOpen(false)
          setIsChatMinimized(false)
        }}
        onMinimize={() => setIsChatMinimized(true)}
      />
    </>
  )
}
