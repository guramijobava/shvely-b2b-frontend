"use client"

import React from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"


import { 
  TrendingUp, 
  TrendingDown, 
  Minus, 
  DollarSign, 
  AlertTriangle, 
  CheckCircle, 
  Activity,
  Home,
  CreditCard,
  Zap
} from "lucide-react"
import { formatCurrency } from "@/lib/utils"
import type { CustomerFinancialProfile } from "@/lib/types"

interface CashflowCoverageMetrics {
  debtServiceCoverageRatio: number
  essentialExpenseCoverage: number
  availableCashAfterObligations: number
  coveragePercentage: number
  riskLevel: "low" | "medium" | "high"
  trend: "improving" | "worsening" | "stable"
  overdraftFrequency: number
  latePaymentCount: number
  insufficientFundsCount: number
}

interface CashflowCoverageCardProps {
  financialProfile: CustomerFinancialProfile
}

// Mock function to calculate cashflow metrics - in real implementation this would come from your API
function calculateCashflowMetrics(profile: CustomerFinancialProfile): CashflowCoverageMetrics {
  const { financialSummary, transactionAnalysis, riskIndicators } = profile
  
  // Estimate debt payments (simplified calculation)
  let estimatedDebtPayments = transactionAnalysis.recurringPayments
    .filter(payment => ['loans', 'credit_card', 'mortgage'].some(type => 
      payment.category.toLowerCase().includes(type)
    ))
    .reduce((sum, payment) => sum + payment.averageAmount, 0)
  
  // If no debt payments found in recurring payments, estimate from monthly expenses
  // This is a more realistic approach for mock data
  if (estimatedDebtPayments === 0) {
    // Estimate typical debt payments as 15-25% of monthly expenses for a typical customer
    estimatedDebtPayments = financialSummary.monthlyExpenses * 0.20
  }
  
  // Estimate essential expenses (housing, utilities, debt)
  const essentialExpenseCategories = ['housing', 'utilities', 'insurance', 'loans', 'credit_card']
  let essentialExpenses = transactionAnalysis.topCategories
    .filter(cat => essentialExpenseCategories.some(essential => 
      cat.category.toLowerCase().includes(essential)
    ))
    .reduce((sum, cat) => sum + cat.amount, 0)
  
  // If no essential expenses found, estimate as 60-70% of total monthly expenses
  if (essentialExpenses === 0) {
    essentialExpenses = financialSummary.monthlyExpenses * 0.65
  }
  
  const monthlyIncome = financialSummary.monthlyIncome
  
  // Calculate ratios with more realistic values
  const debtServiceCoverageRatio = estimatedDebtPayments > 0 ? monthlyIncome / estimatedDebtPayments : 0
  const essentialExpenseCoverage = essentialExpenses > 0 ? monthlyIncome / essentialExpenses : 0
  const availableCashAfterObligations = monthlyIncome - essentialExpenses
  const coveragePercentage = monthlyIncome > 0 ? (essentialExpenses / monthlyIncome) * 100 : 0
  
  // Determine risk level
  let riskLevel: "low" | "medium" | "high" = "low"
  if (coveragePercentage > 60) riskLevel = "high"
  else if (coveragePercentage > 40) riskLevel = "medium"
  
  // Simulate risk indicators (in real implementation, these would come from transaction analysis)
  const overdraftFrequency = financialSummary.overdraftCount
  const latePaymentCount = riskIndicators.highOverdraftFrequency ? 2 : 0
  const insufficientFundsCount = overdraftFrequency > 2 ? 1 : 0
  
  // Determine trend (simplified - in real implementation would use historical data)
  const trend = financialSummary.netCashFlow > 0 ? "improving" : 
                financialSummary.netCashFlow < -500 ? "worsening" : "stable"
  
  return {
    debtServiceCoverageRatio,
    essentialExpenseCoverage,
    availableCashAfterObligations,
    coveragePercentage,
    riskLevel,
    trend,
    overdraftFrequency,
    latePaymentCount,
    insufficientFundsCount
  }
}

const CoverageGauge = ({ 
  percentage, 
  riskLevel,
  monthlyIncome,
  monthlyObligations 
}: { 
  percentage: number
  riskLevel: "low" | "medium" | "high"
  monthlyIncome: number
  monthlyObligations: number
}) => {
  const getColor = (risk: string) => {
    switch (risk) {
      case "low": return "bg-green-500"
      case "medium": return "bg-yellow-500"
      case "high": return "bg-red-500"
      default: return "bg-gray-500"
    }
  }

  const getTextColor = (risk: string) => {
    switch (risk) {
      case "low": return "text-green-700"
      case "medium": return "text-yellow-700"
      case "high": return "text-red-700"
      default: return "text-gray-700"
    }
  }

  const getRiskLabel = (risk: string) => {
    switch (risk) {
      case "low": return "Low Risk"
      case "medium": return "Moderate Risk"
      case "high": return "High Risk"
      default: return "Unknown"
    }
  }

  const getIconColor = (risk: string) => {
    switch (risk) {
      case "low": return "text-green-600"
      case "medium": return "text-yellow-600"
      case "high": return "text-red-600"
      default: return "text-gray-600"
    }
  }

  return (
    <Card className="p-4">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">Financial Obligation Coverage</h3>
          <div className="flex items-center space-x-2">
            {riskLevel === "low" && <CheckCircle className={`h-5 w-5 ${getIconColor(riskLevel)}`} />}
            {riskLevel !== "low" && <AlertTriangle className={`h-5 w-5 ${getIconColor(riskLevel)}`} />}
            <span className={`text-sm font-semibold ${getTextColor(riskLevel)}`}>
              {getRiskLabel(riskLevel)}
            </span>
          </div>
        </div>
        
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium">Obligations vs. Income</span>
            <span className={`text-xl font-bold ${getTextColor(riskLevel)}`}>
              {percentage.toFixed(1)}%
            </span>
          </div>
          
          <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden">
            <div 
              className="h-4 rounded-full transition-all duration-300" 
              style={{
                width: `${Math.min(percentage, 100)}%`,
                backgroundColor: riskLevel === "low" ? "#10b981" : riskLevel === "medium" ? "#f59e0b" : "#ef4444"
              }}
            />
          </div>
          
          <div className="grid grid-cols-3 gap-2 text-xs">
            <div className="text-center">
              <div className="h-2 w-full bg-green-200 rounded mb-1"></div>
              <span className="text-green-700 font-medium">Good (&lt;40%)</span>
            </div>
            <div className="text-center">
              <div className="h-2 w-full bg-yellow-200 rounded mb-1"></div>
              <span className="text-yellow-700 font-medium">Moderate (40-60%)</span>
            </div>
            <div className="text-center">
              <div className="h-2 w-full bg-red-200 rounded mb-1"></div>
              <span className="text-red-700 font-medium">High Risk (&gt;60%)</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 pt-3 border-t">
          <div>
            <p className="text-xs text-muted-foreground">Monthly Income</p>
            <p className="font-semibold">{formatCurrency(monthlyIncome)}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Monthly Obligations</p>
            <p className="font-semibold">{formatCurrency(monthlyObligations)}</p>
          </div>
        </div>
      </div>
    </Card>
  )
}

const TrendIndicator = ({ trend }: { trend: "improving" | "worsening" | "stable" }) => {
  const getTrendConfig = (trend: string) => {
    switch (trend) {
      case "improving":
        return { icon: TrendingUp, color: "text-green-600", label: "Improving" }
      case "worsening":
        return { icon: TrendingDown, color: "text-red-600", label: "Worsening" }
      default:
        return { icon: Minus, color: "text-yellow-600", label: "Stable" }
    }
  }

  const { icon: Icon, color, label } = getTrendConfig(trend)

  return (
    <div className="flex items-center space-x-1">
      <Icon className={`h-4 w-4 ${color}`} />
      <span className={`text-sm font-medium ${color}`}>{label}</span>
    </div>
  )
}

const MetricCard = ({ 
  title, 
  value, 
  icon: Icon, 
  description, 
  trend,
  status,
  explanation
}: {
  title: string
  value: string | number
  icon: React.ElementType
  description?: string
  trend?: "improving" | "worsening" | "stable"
  status?: "good" | "warning" | "danger"
  explanation?: string
}) => {
  const getStatusColor = (status?: string) => {
    switch (status) {
      case "good": return "border-l-green-500"
      case "warning": return "border-l-yellow-500"
      case "danger": return "border-l-red-500"
      default: return "border-l-gray-200"
    }
  }

  const getStatusBadge = (status?: string) => {
    switch (status) {
      case "good": return { variant: "default" as const, color: "bg-green-500", label: "Good" }
      case "warning": return { variant: "secondary" as const, color: "bg-yellow-500", label: "Watch" }
      case "danger": return { variant: "destructive" as const, color: "bg-red-500", label: "Risk" }
      default: return null
    }
  }

  const formatValue = (value: string | number, title: string) => {
    if (typeof value === 'number') {
      if (title.includes('Ratio') || title.includes('Coverage')) {
        if (value === 0) return "No Data"
        if (value >= 4) return `${value.toFixed(1)}x (Excellent)`
        if (value >= 2) return `${value.toFixed(1)}x (Strong)`
        if (value >= 1.25) return `${value.toFixed(1)}x (Good)`
        if (value >= 1) return `${value.toFixed(1)}x (Adequate)`
        return `${value.toFixed(1)}x (Weak)`
      }
      return formatCurrency(value)
    }
    return value
  }

  const statusBadge = getStatusBadge(status)

  return (
    <Card className={`border-l-4 ${getStatusColor(status)}`}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
        <div className="flex items-center space-x-2">
          <Icon className="h-5 w-5 text-muted-foreground" />
          <CardTitle className="text-sm font-medium">{title}</CardTitle>
          {statusBadge && (
            <Badge variant={statusBadge.variant} className="ml-2">
              <div className={`w-2 h-2 rounded-full ${statusBadge.color} mr-1`}></div>
              {statusBadge.label}
            </Badge>
          )}
        </div>
        {trend && <TrendIndicator trend={trend} />}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold mb-2">
          {formatValue(value, title)}
        </div>
        {description && (
          <p className="text-sm text-muted-foreground mb-2">{description}</p>
        )}
        {explanation && (
          <div className="text-xs bg-gray-100 p-2 rounded mt-2">
            <strong>What this means:</strong> {explanation}
          </div>
        )}
      </CardContent>
    </Card>
  )
}



export function CashflowCoverageCard({ financialProfile }: CashflowCoverageCardProps) {
  if (!financialProfile) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Cashflow & Liability Coverage</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">Financial profile data not available.</p>
        </CardContent>
      </Card>
    )
  }

  const metrics = calculateCashflowMetrics(financialProfile)

    return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <CoverageGauge 
            percentage={metrics.coveragePercentage} 
            riskLevel={metrics.riskLevel}
            monthlyIncome={financialProfile.financialSummary.monthlyIncome}
            monthlyObligations={financialProfile.financialSummary.monthlyIncome - metrics.availableCashAfterObligations}
          />
        </div>
        <div className="space-y-4">
          <Card className="p-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-lg font-semibold">3-Month Trend</h3>
              <TrendIndicator trend={metrics.trend} />
            </div>
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">
                {metrics.trend === "improving" && "Customer's financial position is strengthening with positive cash flow trends."}
                {metrics.trend === "stable" && "Customer maintains consistent financial patterns without significant changes."}
                {metrics.trend === "worsening" && "Financial position shows concerning negative trends requiring attention."}
              </p>
            </div>
          </Card>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <MetricCard
          title="Debt Service Coverage Ratio"
          value={metrics.debtServiceCoverageRatio}
          icon={CreditCard}
          description="How well income covers debt payments"
          trend={metrics.trend}
          status={
            metrics.debtServiceCoverageRatio === 0 ? "danger" :
            metrics.debtServiceCoverageRatio >= 2 ? "good" : 
            metrics.debtServiceCoverageRatio >= 1.25 ? "warning" : "danger"
          }
          explanation="Shows how many times income can cover debt payments. A ratio above 2.0x indicates strong debt management, while below 1.25x suggests potential payment difficulties."
        />
        
        <MetricCard
          title="Essential Expense Coverage"
          value={metrics.essentialExpenseCoverage}
          icon={Home}
          description="Income vs. critical living expenses"
          status={
            metrics.essentialExpenseCoverage === 0 ? "danger" :
            metrics.essentialExpenseCoverage >= 1.5 ? "good" : 
            metrics.essentialExpenseCoverage >= 1.2 ? "warning" : "danger"
          }
          explanation="Shows how well income covers housing, utilities, and essential debt payments. A ratio above 1.5x indicates strong coverage, while below 1.2x suggests tight finances."
        />
        
        <MetricCard
          title="Available Cash After Obligations"
          value={metrics.availableCashAfterObligations}
          icon={DollarSign}
          description="Discretionary income remaining"
          status={
            metrics.availableCashAfterObligations >= 1000 ? "good" : 
            metrics.availableCashAfterObligations >= 500 ? "warning" : "danger"
          }
          explanation="Money left over after essential expenses. Higher amounts provide better financial cushion for unexpected expenses."
        />
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <AlertTriangle className="h-5 w-5" />
            <span>Risk Indicators Summary</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <Card className="p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-2">
                  <div className={`w-3 h-3 rounded-full ${
                    metrics.overdraftFrequency > 2 ? 'bg-red-500' : 
                    metrics.overdraftFrequency > 0 ? 'bg-yellow-500' : 'bg-green-500'
                  }`}></div>
                  <p className="text-sm font-semibold">Overdraft Activity</p>
                </div>
                <Badge variant={
                  metrics.overdraftFrequency > 2 ? "destructive" : 
                  metrics.overdraftFrequency > 0 ? "secondary" : "default"
                }>
                  {metrics.overdraftFrequency}
                </Badge>
              </div>
              <p className="text-xs text-muted-foreground mb-2">Overdrafts in last 90 days</p>
              <p className="text-xs font-medium text-gray-700">
                {metrics.overdraftFrequency === 0 ? 'No recent overdrafts' :
                 metrics.overdraftFrequency <= 2 ? 'Manageable frequency' : 'High frequency - concerning'
                }
              </p>
            </Card>
            
            <Card className="p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-2">
                  <div className={`w-3 h-3 rounded-full ${
                    metrics.latePaymentCount > 1 ? 'bg-red-500' : 
                    metrics.latePaymentCount > 0 ? 'bg-yellow-500' : 'bg-green-500'
                  }`}></div>
                  <p className="text-sm font-semibold">Payment Delays</p>
                </div>
                <Badge variant={
                  metrics.latePaymentCount > 1 ? "destructive" : 
                  metrics.latePaymentCount > 0 ? "secondary" : "default"
                }>
                  {metrics.latePaymentCount}
                </Badge>
              </div>
              <p className="text-xs text-muted-foreground mb-2">Late payments detected</p>
              <p className="text-xs font-medium text-gray-700">
                {metrics.latePaymentCount === 0 ? 'Good payment history' :
                 metrics.latePaymentCount <= 1 ? 'Minor payment issues' : 'Pattern of late payments'
                }
              </p>
            </Card>
            
            <Card className="p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-2">
                  <div className={`w-3 h-3 rounded-full ${
                    metrics.insufficientFundsCount > 0 ? 'bg-red-500' : 'bg-green-500'
                  }`}></div>
                  <p className="text-sm font-semibold">NSF Incidents</p>
                </div>
                <Badge variant={metrics.insufficientFundsCount > 0 ? "destructive" : "default"}>
                  {metrics.insufficientFundsCount}
                </Badge>
              </div>
              <p className="text-xs text-muted-foreground mb-2">Insufficient funds events</p>
              <p className="text-xs font-medium text-gray-700">
                {metrics.insufficientFundsCount === 0 ? 'No NSF incidents' : 'Recent NSF activity'}
              </p>
            </Card>
          </div>
        </CardContent>
      </Card>
    </div>
  )
} 