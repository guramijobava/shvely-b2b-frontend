"use client"

import type { CustomerFinancialProfile } from "@/lib/types"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { formatCurrency, formatDate, formatRelativeTime } from "@/lib/utils"
import { Mail, Phone, ShieldCheck } from "lucide-react"
import { CustomerActions } from "./CustomerActions" // To be created

interface CustomerProfileHeaderProps {
  customer: CustomerFinancialProfile
}

export function CustomerProfileHeader({ customer }: CustomerProfileHeaderProps) {
  const getInitials = (name: string) =>
    name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()

  const verificationStatus = customer.verificationId ? "Verified" : "Pending" // Simplified
  const verificationDate = customer.verificationId ? customer.lastUpdated : undefined // Assuming lastUpdated is verification date

  return (
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
            <CustomerActions customerId={customer.customerId} customerEmail={customer.customerInfo.email} />
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
  )
}
