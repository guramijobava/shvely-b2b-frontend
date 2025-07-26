"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CreditBureauReport } from "@/types/customer"
import { 
  CreditCard, 
  TrendingUp, 
  Clock, 
  BarChart3, 
  AlertTriangle,
  CheckCircle,
  XCircle,
  Calendar,
  DollarSign,
  Building,
  FileText
} from "lucide-react"

interface CreditScoreFactorModalProps {
  isOpen: boolean
  onClose: () => void
  factor: "paymentHistory" | "amountOfDebt" | "lengthOfCreditHistory" | "amountOfNewCredit" | "creditMix"
  report: CreditBureauReport
  bureauName: string
}

export function CreditScoreFactorModal({ 
  isOpen, 
  onClose, 
  factor, 
  report, 
  bureauName 
}: CreditScoreFactorModalProps) {
  const creditScoreFactors = report.creditScoreFactors || {
    paymentHistory: { score: 0, rating: "POOR" as const, impact: "high" as const },
    amountOfDebt: { score: 0, rating: "POOR" as const, impact: "high" as const },
    lengthOfCreditHistory: { score: 0, rating: "POOR" as const, impact: "medium" as const, averageAccountAge: 0 },
    amountOfNewCredit: { score: 0, rating: "POOR" as const, impact: "low" as const, recentInquiries: 0 },
    creditMix: { score: 0, rating: "POOR" as const, impact: "low" as const, accountTypes: [] }
  }

  const factorData = creditScoreFactors[factor]

  const factorConfig = {
    paymentHistory: {
      title: "Payment History",
      subtitle: "35% Impact on Credit Score",
      icon: <CreditCard className="h-6 w-6" />,
      color: "text-blue-600"
    },
    amountOfDebt: {
      title: "Amount of Debt",
      subtitle: "30% Impact on Credit Score", 
      icon: <TrendingUp className="h-6 w-6" />,
      color: "text-green-600"
    },
    lengthOfCreditHistory: {
      title: "Length of Credit History",
      subtitle: "15% Impact on Credit Score",
      icon: <Clock className="h-6 w-6" />,
      color: "text-purple-600"
    },
    amountOfNewCredit: {
      title: "Amount of New Credit",
      subtitle: "10% Impact on Credit Score",
      icon: <BarChart3 className="h-6 w-6" />,
      color: "text-orange-600"
    },
    creditMix: {
      title: "Credit Mix",
      subtitle: "10% Impact on Credit Score",
      icon: <Building className="h-6 w-6" />,
      color: "text-indigo-600"
    }
  }

  const config = factorConfig[factor]

  const getRatingColor = (rating: string) => {
    switch (rating) {
      case "EXCEPTIONAL": return "bg-green-100 text-green-800 border-green-200"
      case "VERY GOOD": return "bg-blue-100 text-blue-800 border-blue-200"
      case "GOOD": return "bg-cyan-100 text-cyan-800 border-cyan-200"
      case "FAIR": return "bg-yellow-100 text-yellow-800 border-yellow-200"
      case "POOR": return "bg-red-100 text-red-800 border-red-200"
      default: return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    })
  }

  // Mock detailed data - in production, this would come from the comprehensive API
  const getMockDetailedData = () => {
    switch (factor) {
      case "paymentHistory":
        return {
          collections: 0,
          derogatoryPublicRecords: 0,
          latePayments30Days: 0,
          latePayments30DaysOlderThanYear: 0,
          latePayments30DaysInPastYear: 0,
          latePayments60Days: 0,
          latePayments90Days: 0,
          accountsAlwaysPaidAsAgreed: 100,
          timeSinceRecentLatePayment: "No Delinquent Accounts",
          accountDetails: [
            { name: "Chase Sapphire Preferred", type: "Credit Card", status: "Current", lastPayment: "2024-03-15" },
            { name: "Wells Fargo Mortgage", type: "Mortgage", status: "Current", lastPayment: "2024-03-01" },
            { name: "Toyota Auto Loan", type: "Auto Loan", status: "Current", lastPayment: "2024-03-10" }
          ]
        }
      case "amountOfDebt":
        return {
          accountsWithBalances: 11,
          revolvingUtilization: 75,
          totalRevolvingBalance: 87911,
          accountDetails: [
            { name: "Chase Sapphire Preferred", balance: 8500, limit: 15000, utilization: 57 },
            { name: "American Express Gold", balance: 4200, limit: 10000, utilization: 42 },
            { name: "Discover It", balance: 3100, limit: 5000, utilization: 62 },
            { name: "Capital One Venture", balance: 2800, limit: 8000, utilization: 35 }
          ]
        }
      case "amountOfNewCredit":
        return {
          hardInquiries12Months: 2,
          hardInquiries24Months: 4,
          accountsOpened12Months: 1,
          accountsOpened24Months: 2,
          inquiryDetails: [
            { company: "Chase Bank", date: "2024-01-15", type: "Credit Card", purpose: "New Account" },
            { company: "Wells Fargo", date: "2023-11-10", type: "Auto Loan", purpose: "Vehicle Purchase" },
            { company: "American Express", date: "2023-09-05", type: "Credit Card", purpose: "New Account" }
          ],
          newAccountDetails: [
            { name: "Chase Sapphire Preferred", type: "Credit Card", dateOpened: "2024-01-20", initialLimit: 15000 },
            { name: "Wells Fargo Auto Loan", type: "Auto Loan", dateOpened: "2023-11-15", initialBalance: 35000 }
          ]
        }
      case "creditMix":
        return {
          bankIssuedCreditCards: 7,
          revolvingAccounts: 7,
          installmentLoans: 1,
          accountDetails: [
            { name: "Chase Sapphire Preferred", type: "Credit Card", status: "Open", balance: 8500, limit: 15000, dateOpened: "2024-01-20" },
            { name: "American Express Gold", type: "Credit Card", status: "Open", balance: 4200, limit: 10000, dateOpened: "2022-03-15" },
            { name: "Discover It", type: "Credit Card", status: "Open", balance: 3100, limit: 5000, dateOpened: "2021-07-10" },
            { name: "Capital One Venture", type: "Credit Card", status: "Open", balance: 2800, limit: 8000, dateOpened: "2020-11-05" },
            { name: "Wells Fargo Mortgage", type: "Mortgage", status: "Open", balance: 285000, dateOpened: "2019-06-01" },
            { name: "Toyota Auto Loan", type: "Auto Loan", status: "Open", balance: 18500, dateOpened: "2023-11-15" }
          ]
        }
      default:
        return {}
    }
  }

  const detailedData = getMockDetailedData()

  const renderPaymentHistoryContent = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center space-x-2">
              <CheckCircle className="h-5 w-5 text-green-600" />
              <span>Payment Performance</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Collections</span>
              <span className="font-semibold">{detailedData.collections}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Derogatory Public Records</span>
              <span className="font-semibold">{detailedData.derogatoryPublicRecords}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Accounts Always Paid as Agreed</span>
              <span className="font-semibold text-green-600">{detailedData.accountsAlwaysPaidAsAgreed}%</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Time Since Most Recent Late Payment</span>
              <span className="font-semibold text-green-600">{detailedData.timeSinceRecentLatePayment}</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center space-x-2">
              <XCircle className="h-5 w-5 text-red-600" />
              <span>Late Payment History</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Late Payments 30+ Days</span>
              <span className="font-semibold">{detailedData.latePayments30Days}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Late Payments 30+ Days Older Than Past Year</span>
              <span className="font-semibold">{detailedData.latePayments30DaysOlderThanYear}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Late Payments 30+ Days In Past Year</span>
              <span className="font-semibold">{detailedData.latePayments30DaysInPastYear}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Late Payments 60+ Days</span>
              <span className="font-semibold">{detailedData.latePayments60Days}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Late Payments 90+ Days</span>
              <span className="font-semibold">{detailedData.latePayments90Days}</span>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Account-Level Payment History</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {detailedData.accountDetails?.map((account, index) => (
              <div key={index} className="flex justify-between items-center p-3 border rounded-lg">
                <div className="flex-1">
                  <div className="font-medium">{account.name}</div>
                  <div className="text-sm text-gray-500">{account.type}</div>
                </div>
                <div className="text-right">
                  <Badge className="bg-green-100 text-green-800 border-green-200">
                    {account.status}
                  </Badge>
                  <div className="text-xs text-gray-500 mt-1">
                    Last Payment: {formatDate(account.lastPayment)}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )

  const renderAmountOfDebtContent = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center space-x-2">
              <DollarSign className="h-5 w-5 text-green-600" />
              <span>Utilization Summary</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Accounts with Balances</span>
              <span className="font-semibold">{detailedData.accountsWithBalances}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Revolving Utilization</span>
              <span className="font-semibold text-orange-600">{detailedData.revolvingUtilization}%</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Total Balance on Revolving Accounts</span>
              <span className="font-semibold">{formatCurrency(detailedData.totalRevolvingBalance)}</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center space-x-2">
              <BarChart3 className="h-5 w-5 text-blue-600" />
              <span>Risk Assessment</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {detailedData.revolvingUtilization > 70 && (
              <div className="flex items-center space-x-2 text-red-600">
                <AlertTriangle className="h-4 w-4" />
                <span className="text-sm">High utilization warning</span>
              </div>
            )}
            {detailedData.revolvingUtilization > 50 && detailedData.revolvingUtilization <= 70 && (
              <div className="flex items-center space-x-2 text-yellow-600">
                <AlertTriangle className="h-4 w-4" />
                <span className="text-sm">Moderate utilization concern</span>
              </div>
            )}
            {detailedData.revolvingUtilization <= 30 && (
              <div className="flex items-center space-x-2 text-green-600">
                <CheckCircle className="h-4 w-4" />
                <span className="text-sm">Healthy utilization level</span>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Account-Level Utilization</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {detailedData.accountDetails?.map((account, index) => (
              <div key={index} className="flex justify-between items-center p-3 border rounded-lg">
                <div className="flex-1">
                  <div className="font-medium">{account.name}</div>
                  <div className="text-sm text-gray-500">
                    {formatCurrency(account.balance)} / {formatCurrency(account.limit)}
                  </div>
                </div>
                <div className="text-right">
                  <div className={`font-semibold ${account.utilization > 70 ? 'text-red-600' : account.utilization > 50 ? 'text-yellow-600' : 'text-green-600'}`}>
                    {account.utilization}%
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )

  const renderNewCreditContent = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center space-x-2">
              <FileText className="h-5 w-5 text-orange-600" />
              <span>Inquiry Summary</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Hard Inquiries (Last 12 months)</span>
              <span className="font-semibold">{detailedData.hardInquiries12Months}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Hard Inquiries (Last 24 months)</span>
              <span className="font-semibold">{detailedData.hardInquiries24Months}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Accounts Opened (Last 12 months)</span>
              <span className="font-semibold">{detailedData.accountsOpened12Months}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Accounts Opened (Last 24 months)</span>
              <span className="font-semibold">{detailedData.accountsOpened24Months}</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center space-x-2">
              <AlertTriangle className="h-5 w-5 text-red-600" />
              <span>Risk Assessment</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {detailedData.hardInquiries12Months > 6 && (
              <div className="flex items-center space-x-2 text-red-600">
                <AlertTriangle className="h-4 w-4" />
                <span className="text-sm">High inquiry activity</span>
              </div>
            )}
            {detailedData.hardInquiries12Months > 3 && detailedData.hardInquiries12Months <= 6 && (
              <div className="flex items-center space-x-2 text-yellow-600">
                <AlertTriangle className="h-4 w-4" />
                <span className="text-sm">Moderate inquiry activity</span>
              </div>
            )}
            {detailedData.hardInquiries12Months <= 3 && (
              <div className="flex items-center space-x-2 text-green-600">
                <CheckCircle className="h-4 w-4" />
                <span className="text-sm">Normal inquiry activity</span>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="inquiries" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="inquiries">Inquiry Details</TabsTrigger>
          <TabsTrigger value="accounts">New Account Details</TabsTrigger>
        </TabsList>
        
        <TabsContent value="inquiries" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Hard Inquiry History</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {detailedData.inquiryDetails?.map((inquiry, index) => (
                  <div key={index} className="flex justify-between items-center p-3 border rounded-lg">
                    <div className="flex-1">
                      <div className="font-medium">{inquiry.company}</div>
                      <div className="text-sm text-gray-500">{inquiry.type} - {inquiry.purpose}</div>
                    </div>
                    <div className="text-right">
                      <div className="font-semibold">{formatDate(inquiry.date)}</div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="accounts" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Recently Opened Accounts</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {detailedData.newAccountDetails?.map((account, index) => (
                  <div key={index} className="flex justify-between items-center p-3 border rounded-lg">
                    <div className="flex-1">
                      <div className="font-medium">{account.name}</div>
                      <div className="text-sm text-gray-500">{account.type}</div>
                    </div>
                    <div className="text-right">
                      <div className="font-semibold">{formatDate(account.dateOpened)}</div>
                      <div className="text-sm text-gray-500">
                        {account.type === "Credit Card" ? `Limit: ${formatCurrency(account.initialLimit)}` : `Balance: ${formatCurrency(account.initialBalance)}`}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )

  const renderCreditMixContent = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center space-x-2">
              <CreditCard className="h-5 w-5 text-blue-600" />
              <span>Credit Cards</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{detailedData.bankIssuedCreditCards}</div>
            <div className="text-sm text-gray-600">Bank-Issued Credit Card Accounts</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center space-x-2">
              <TrendingUp className="h-5 w-5 text-green-600" />
              <span>Revolving</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{detailedData.revolvingAccounts}</div>
            <div className="text-sm text-gray-600">Revolving Accounts</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center space-x-2">
              <Building className="h-5 w-5 text-purple-600" />
              <span>Installment</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">{detailedData.installmentLoans}</div>
            <div className="text-sm text-gray-600">Installment Loans, Including Mortgages</div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Account Portfolio Details</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {detailedData.accountDetails?.map((account, index) => (
              <div key={index} className="flex justify-between items-center p-3 border rounded-lg">
                <div className="flex-1">
                  <div className="font-medium">{account.name}</div>
                  <div className="text-sm text-gray-500">{account.type}</div>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="text-right">
                    <Badge className={account.status === "Open" ? "bg-green-100 text-green-800 border-green-200" : "bg-gray-100 text-gray-800 border-gray-200"}>
                      {account.status}
                    </Badge>
                    <div className="text-xs text-gray-500 mt-1">
                      Opened: {formatDate(account.dateOpened)}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-semibold">
                      {account.limit ? `${formatCurrency(account.balance)} / ${formatCurrency(account.limit)}` : formatCurrency(account.balance)}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )

  const renderLengthOfHistoryContent = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center space-x-2">
              <Clock className="h-5 w-5 text-purple-600" />
              <span>Account Age Analysis</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Average Account Age</span>
              <span className="font-semibold">{(creditScoreFactors.lengthOfCreditHistory.averageAccountAge || 0).toFixed(1)} years</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Oldest Account</span>
              <span className="font-semibold">12.3 years</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Newest Account</span>
              <span className="font-semibold">2.1 years</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center space-x-2">
              <BarChart3 className="h-5 w-5 text-blue-600" />
              <span>Stability Assessment</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center space-x-2 text-green-600">
              <CheckCircle className="h-4 w-4" />
              <span className="text-sm">Strong credit history length</span>
            </div>
            <div className="flex items-center space-x-2 text-green-600">
              <CheckCircle className="h-4 w-4" />
              <span className="text-sm">Good account age diversity</span>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Account Timeline</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {detailedData.accountDetails?.map((account, index) => (
              <div key={index} className="flex justify-between items-center p-3 border rounded-lg">
                <div className="flex-1">
                  <div className="font-medium">{account.name}</div>
                  <div className="text-sm text-gray-500">{account.type}</div>
                </div>
                <div className="text-right">
                  <div className="font-semibold">{formatDate(account.lastPayment)}</div>
                  <div className="text-sm text-gray-500">
                    {Math.floor((new Date().getTime() - new Date(account.lastPayment).getTime()) / (365.25 * 24 * 60 * 60 * 1000))} years old
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )

  const renderContent = () => {
    switch (factor) {
      case "paymentHistory":
        return renderPaymentHistoryContent()
      case "amountOfDebt":
        return renderAmountOfDebtContent()
      case "amountOfNewCredit":
        return renderNewCreditContent()
      case "creditMix":
        return renderCreditMixContent()
      case "lengthOfCreditHistory":
        return renderLengthOfHistoryContent()
      default:
        return <div>No data available</div>
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-3">
            <div className={config.color}>{config.icon}</div>
            <div>
              <div className="text-xl font-bold">{config.title}</div>
              <div className="text-sm text-gray-500 font-normal">
                {config.subtitle} • {bureauName}
              </div>
            </div>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Factor Score Summary */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Factor Score Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="text-3xl font-bold text-blue-600">{factorData.score}/100</div>
                  <Badge className={getRatingColor(factorData.rating)}>
                    {factorData.rating}
                  </Badge>
                </div>
                <div className="text-right">
                  <div className="text-sm text-gray-600">Impact Level</div>
                  <div className={`font-semibold ${factorData.impact === 'high' ? 'text-red-600' : factorData.impact === 'medium' ? 'text-yellow-600' : 'text-green-600'}`}>
                    {factorData.impact.toUpperCase()}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Detailed Content */}
          {renderContent()}
        </div>
      </DialogContent>
    </Dialog>
  )
} 