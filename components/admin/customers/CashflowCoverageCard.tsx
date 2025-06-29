"use client"

import React, { useState, useRef, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
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
  Zap,
  Calendar as CalendarIcon,
  ShieldCheck,
  HelpCircle
} from "lucide-react"
import { formatCurrency, cn } from "@/lib/utils"
import { format } from "date-fns"
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
  const [showTooltip, setShowTooltip] = useState(false)
  const [tooltipPosition, setTooltipPosition] = useState({ showBelow: true, leftOffset: 0, arrowLeft: 120 })
  const helpIconRef = useRef<HTMLButtonElement>(null)
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

  // Calculate tooltip position when it's shown
  const calculateTooltipPosition = () => {
    if (!showTooltip || !helpIconRef.current) return

    const helpIconRect = helpIconRef.current.getBoundingClientRect()
    const viewportHeight = window.innerHeight
    const viewportWidth = window.innerWidth
    const tooltipHeight = 180
    const tooltipWidth = 300
    
    // Determine if tooltip should be above or below
    const spaceBelow = viewportHeight - helpIconRect.bottom
    const spaceAbove = helpIconRect.top
    const showBelow = spaceBelow >= tooltipHeight || spaceAbove < tooltipHeight
    
    // Calculate horizontal position - center tooltip on help icon
    const helpIconCenter = helpIconRect.left + helpIconRect.width / 2
    
    // Calculate tooltip left position (centered on help icon, with viewport bounds)
    const tooltipLeft = helpIconCenter - (tooltipWidth / 2)
    const finalLeft = Math.max(10, Math.min(tooltipLeft, viewportWidth - tooltipWidth - 10))
    
    // Calculate arrow position relative to tooltip (points to help icon center)
    const arrowLeft = helpIconCenter - finalLeft
    
    setTooltipPosition({
      showBelow,
      leftOffset: finalLeft,
      arrowLeft: Math.max(15, Math.min(arrowLeft, tooltipWidth - 15))
    })
  }

  useEffect(() => {
    if (showTooltip) {
      // Small delay to ensure DOM is fully rendered
      const timer = setTimeout(calculateTooltipPosition, 5)
      
      // Handle window resize
      const handleResize = () => calculateTooltipPosition()
      window.addEventListener('resize', handleResize)
      
      return () => {
        clearTimeout(timer)
        window.removeEventListener('resize', handleResize)
      }
    }
  }, [showTooltip])

  return (
    <div className="relative">
      <Card className={`border-l-4 ${getStatusColor(status)}`}>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
          <div className="flex items-center space-x-2">
            <Icon className="h-5 w-5 text-muted-foreground" />
            <CardTitle className="text-sm font-medium">{title}</CardTitle>
            {explanation && (
              <button
                ref={helpIconRef}
                onClick={() => setShowTooltip(!showTooltip)}
                className="ml-1 p-1 rounded-full hover:bg-gray-100 transition-colors"
                aria-label="Show explanation"
              >
                <HelpCircle className="h-4 w-4 text-blue-500 hover:text-blue-600" />
              </button>
            )}
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
            <p className="text-sm text-muted-foreground">{description}</p>
          )}
        </CardContent>
      </Card>
      
      {/* Custom Tooltip */}
      {showTooltip && explanation && (
        <div 
          className={`fixed z-[100] ${tooltipPosition.showBelow ? 'mt-2' : 'mb-2'}`}
          style={{ 
            left: `${tooltipPosition.leftOffset}px`,
            top: tooltipPosition.showBelow 
              ? `${helpIconRef.current?.getBoundingClientRect().bottom || 0}px`
              : `${(helpIconRef.current?.getBoundingClientRect().top || 0) - 180}px`,
            width: '300px'
          }}
        >
          <div className="bg-white border border-gray-200 rounded-lg shadow-xl p-4 relative">
            {/* Triangle Arrow */}
            <div 
              className={`absolute w-3 h-3 bg-white border-gray-200 transform rotate-45 ${
                tooltipPosition.showBelow 
                  ? '-top-1.5 border-l border-t' 
                  : '-bottom-1.5 border-r border-b'
              }`}
              style={{ 
                left: `${tooltipPosition.arrowLeft}px`
              }}
            ></div>
            <div className="flex items-start justify-between">
              <div className="flex-1 pr-4">
                <h4 className="font-semibold text-gray-900 mb-2 flex items-center">
                  <CheckCircle className="h-4 w-4 text-blue-500 mr-2" />
                  What this means
                </h4>
                <p className="text-sm text-gray-700 leading-relaxed">{explanation}</p>
              </div>
              <button
                onClick={() => setShowTooltip(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors p-1 flex-shrink-0"
                aria-label="Close explanation"
              >
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* Click outside to close */}
      {showTooltip && (
        <div 
          className="fixed inset-0 z-40" 
          onClick={() => setShowTooltip(false)}
        />
      )}
    </div>
  )
}



export function CashflowCoverageCard({ financialProfile }: CashflowCoverageCardProps) {
  const [selectedChartMonthIndex, setSelectedChartMonthIndex] = useState<number>(11) // Default to current month

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
      {/* Interactive Cash Flow Chart */}
      <Card className="border-l-4 border-l-blue-500 shadow-lg">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center space-x-2 text-lg">
            <Activity className="h-5 w-5 text-blue-500" />
            <span>Cash Flow Analysis</span>
          </CardTitle>
          <CardDescription>Interactive 12-month cash flow - click on any month to view detailed financial metrics</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="p-6 rounded-xl border">
            {(() => {
              // Generate mock historical data for the last 12 months
              const months = []
              const now = new Date()
              for (let i = 11; i >= 0; i--) {
                const month = new Date(now.getFullYear(), now.getMonth() - i, 1)
                months.push(month)
              }
              
              // Generate monthly cash flow data with variations
              const monthlyDataSets = months.map((month, monthIndex) => {
                const baseIncome = financialProfile.financialSummary.monthlyIncome
                const baseExpenses = financialProfile.financialSummary.monthlyExpenses
                
                // Add some realistic variation (±15%) to simulate historical changes
                const incomeVariation = 0.85 + (Math.sin(monthIndex * 0.5) * 0.15)
                const expenseVariation = 0.85 + (Math.cos(monthIndex * 0.3) * 0.15)
                
                const cashIn = baseIncome * incomeVariation
                const cashOut = baseExpenses * expenseVariation
                const netCashFlow = cashIn - cashOut
                
                return {
                  month,
                  monthIndex,
                  cashIn,
                  cashOut,
                  netCashFlow
                }
              })
              
              // Calculate max values for Y-axis scaling
              const maxCashIn = Math.max(...monthlyDataSets.map(set => set.cashIn))
              const maxCashOut = Math.max(...monthlyDataSets.map(set => set.cashOut))
              const maxTotal = Math.max(maxCashIn, maxCashOut)
              
              // Smart Y-axis labeling function
              const generateYAxisLabels = (maxValue: number) => {
                let step: number
                
                if (maxValue <= 1000) {
                  step = 250
                } else if (maxValue <= 2500) {
                  step = 500
                } else if (maxValue <= 5000) {
                  step = 1000
                } else if (maxValue <= 10000) {
                  step = 2000
                } else if (maxValue <= 25000) {
                  step = 5000
                } else if (maxValue <= 50000) {
                  step = 10000
                } else {
                  step = Math.ceil(maxValue / 5 / 10000) * 10000
                }
                
                const labels = []
                let currentValue = step * Math.ceil(maxTotal * 1.3 / step) // Top
                while (currentValue >= -(maxTotal * 1.3)) {
                  labels.push(currentValue)
                  currentValue -= step
                }
                
                return labels
              }
              
              const yAxisLabels = generateYAxisLabels(maxTotal)
              const chartMaxValue = Math.max(...yAxisLabels.map(Math.abs))
              
              return (
                <div>
                  {/* Instructions */}
                  <div className="mb-4 text-center">
                    <p className="text-sm text-gray-600">
                      <span className="font-medium">Click on any month</span> to view detailed financial metrics breakdown
                    </p>
                  </div>
                  
                  {/* Chart */}
                  <div className="relative">
                    {/* Y-axis labels */}
                    <div className="flex">
                      <div className="w-20 flex flex-col justify-between h-80 text-xs text-gray-600 pr-3">
                        {yAxisLabels.map((label, index) => (
                          <span key={index} className="text-right">
                            {label >= 1000 ? `$${(label / 1000).toFixed(0)}k` : label <= -1000 ? `-$${(Math.abs(label) / 1000).toFixed(0)}k` : `$${label}`}
                          </span>
                        ))}
                      </div>
                      
                      {/* Chart area */}
                      <div className="flex-1 h-80 bg-gray-50 rounded-lg border relative">
                        {/* Zero line */}
                        <div className="absolute inset-0 flex items-center px-2">
                          <div className="w-full border-t-2 border-gray-400"></div>
                        </div>
                        
                        {/* Grid lines */}
                        <div className="absolute inset-0 flex flex-col justify-between p-2">
                          {yAxisLabels.map((_, index) => (
                            <div key={index} className="w-full border-t border-gray-200 opacity-30"></div>
                          ))}
                        </div>
                        
                                                {/* Bars and Net Line container */}
                        <div className="absolute inset-0 px-4 py-2">
                          {/* Chart positioned relative to zero line (center) */}
                          <div className="relative w-full h-full" style={{ isolation: 'isolate' }}>
                            
                            {/* Bars */}
                            <div className="absolute w-full h-full flex justify-around items-center" style={{ zIndex: 10 }}>
                              {monthlyDataSets.map((monthSet, monthIndex) => (
                                <div 
                                  key={monthIndex} 
                                  className={`relative cursor-pointer transition-all duration-200 ${
                                    selectedChartMonthIndex === monthIndex ? 'bg-blue-50 rounded-lg px-2 py-1' : 'hover:bg-gray-50 rounded-lg px-2 py-1'
                                  }`}
                                  style={{ width: '40px', height: '100%' }}
                                  onClick={() => setSelectedChartMonthIndex(monthIndex)}
                                >
                                  {/* Cash In Bar (above zero line) */}
                                  <div 
                                    className="absolute bottom-1/2 left-1/2 transform -translate-x-1/2 rounded-t-md transition-all duration-300 cursor-pointer group/segment"
                                    style={{ 
                                      width: '20px',
                                      height: `${Math.max((monthSet.cashIn / chartMaxValue) * 35, 2)}%`,
                                      backgroundColor: '#10b981'
                                    }}
                                  >
                                    {/* Tooltip */}
                                    <div className="absolute left-1/2 bottom-full transform -translate-x-1/2 mb-2 px-3 py-2 bg-gray-900 text-white text-xs rounded-lg opacity-0 group-hover/segment:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-30">
                                      <div className="font-semibold">Cash In</div>
                                      <div>{format(monthSet.month, "MMM yyyy")}</div>
                                      <div>+{formatCurrency(monthSet.cashIn)}</div>
                                      <div className="text-gray-300 text-[10px] mt-1 border-t border-gray-600 pt-1">
                                        Net: {formatCurrency(monthSet.netCashFlow)}
                                      </div>
                                      <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900"></div>
                                    </div>
                                  </div>
                                  
                                  {/* Cash Out Bar (below zero line) */}
                                  <div 
                                    className="absolute top-1/2 left-1/2 transform -translate-x-1/2 rounded-b-md transition-all duration-300 cursor-pointer group/segment"
                                    style={{ 
                                      width: '20px',
                                      height: `${Math.max((monthSet.cashOut / chartMaxValue) * 35, 2)}%`,
                                      backgroundColor: '#ef4444'
                                    }}
                                  >
                                    {/* Tooltip */}
                                    <div className="absolute left-1/2 top-full transform -translate-x-1/2 mt-2 px-3 py-2 bg-gray-900 text-white text-xs rounded-lg opacity-0 group-hover/segment:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-30">
                                      <div className="font-semibold">Cash Out</div>
                                      <div>{format(monthSet.month, "MMM yyyy")}</div>
                                      <div>-{formatCurrency(monthSet.cashOut)}</div>
                                      <div className="text-gray-300 text-[10px] mt-1 border-t border-gray-600 pt-1">
                                        Net: {formatCurrency(monthSet.netCashFlow)}
                                      </div>
                                      <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 border-l-4 border-r-4 border-b-4 border-transparent border-b-gray-900"></div>
                                    </div>
                                  </div>
                                </div>
                              ))}
                            </div>
                            
                            {/* Net Line */}
                            <svg 
                              className="absolute inset-0 w-full h-full pointer-events-none" 
                              style={{ zIndex: 30, position: 'relative' }}
                              viewBox="0 0 1000 100"
                              preserveAspectRatio="none"
                            >
                              <polyline
                                fill="none"
                                stroke="#f59e0b"
                                strokeWidth="2"
                                opacity="1"
                                vectorEffect="non-scaling-stroke"
                                points={monthlyDataSets.map((monthSet, monthIndex) => {
                                  // Calculate coordinates in viewBox units (0-1000 width, 0-100 height)
                                  const totalBars = monthlyDataSets.length
                                  const barSpacing = 1000 / totalBars
                                  const x = (monthIndex * barSpacing) + (barSpacing / 2)
                                  const netRatio = monthSet.netCashFlow / chartMaxValue
                                  const y = 50 - (netRatio * 35) // Center at 50, scale by 35 up/down
                                  return `${x},${y}`
                                }).join(' ')}
                              />
                            </svg>
                            
                            {/* Net line dots - separate positioning to avoid viewBox distortion */}
                            {monthlyDataSets.map((monthSet, monthIndex) => {
                              // Calculate percentage positions for absolute positioning
                              const totalBars = monthlyDataSets.length
                              const barSpacing = 100 / totalBars
                              const xPercent = (monthIndex * barSpacing) + (barSpacing / 2)
                              const netRatio = monthSet.netCashFlow / chartMaxValue
                              const yPercent = 50 - (netRatio * 35) // Center at 50%, scale by 35% up/down
                              
                              return (
                                <div
                                  key={monthIndex}
                                  className="absolute w-3 h-3 rounded-full border-2 border-white shadow-sm"
                                  style={{
                                    left: `${xPercent}%`,
                                    top: `${yPercent}%`,
                                    backgroundColor: '#f59e0b',
                                    transform: 'translate(-50%, -50%)',
                                    zIndex: 35
                                  }}
                                />
                              )
                            })}
                          </div>
                          
                          {/* Month Labels */}
                          <div className="absolute bottom-0 left-0 right-0 flex justify-around px-4 pb-2">
                            {monthlyDataSets.map((monthSet, monthIndex) => (
                              <div key={monthIndex} className={`text-xs font-medium text-center transition-colors ${
                                selectedChartMonthIndex === monthIndex 
                                  ? 'text-blue-600 font-bold' 
                                  : 'text-gray-600'
                              }`}>
                                {format(monthSet.month, "MMM")}
                                {selectedChartMonthIndex === monthIndex && (
                                  <div className="w-2 h-2 bg-blue-500 rounded-full mx-auto mt-1"></div>
                                )}
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    {/* X-axis label */}
                    <div className="flex justify-center mt-2">
                      <span className="text-sm text-gray-600 font-medium">Months</span>
                    </div>
                  </div>
                  
                  {/* Legend */}
                  <div className="mt-8 pt-4 border-t border-gray-300">
                    <div className="flex items-center justify-center gap-6">
                      <div className="flex items-center space-x-2">
                        <div className="w-4 h-4 rounded bg-green-500"></div>
                        <span className="text-sm font-medium text-gray-700">Cash In</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className="w-4 h-4 rounded bg-red-500"></div>
                        <span className="text-sm font-medium text-gray-700">Cash Out</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className="w-4 h-1 bg-yellow-500"></div>
                        <span className="text-sm font-medium text-gray-700">Net Cash Flow</span>
                      </div>
                    </div>
                  </div>
                  
                                     {/* Selected Month Details */}
                   <div className="mt-6 p-4 bg-white rounded-lg border border-blue-200">
                     <h5 className="font-semibold text-gray-900 mb-4 flex items-center">
                       <CalendarIcon className="h-4 w-4 mr-2 text-blue-600" />
                       {format(monthlyDataSets[selectedChartMonthIndex].month, "MMMM yyyy")} - Financial Analysis
                     </h5>
                     
                     {/* Cash Flow Summary */}
                     <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                       <div className="p-3 bg-green-50 rounded-lg">
                         <div className="text-sm text-gray-600">Cash In</div>
                         <div className="text-xl font-bold text-green-700">
                           +{formatCurrency(monthlyDataSets[selectedChartMonthIndex].cashIn)}
                         </div>
                       </div>
                       <div className="p-3 bg-red-50 rounded-lg">
                         <div className="text-sm text-gray-600">Cash Out</div>
                         <div className="text-xl font-bold text-red-700">
                           -{formatCurrency(monthlyDataSets[selectedChartMonthIndex].cashOut)}
                         </div>
                       </div>
                       <div className="p-3 bg-yellow-50 rounded-lg">
                         <div className="text-sm text-gray-600">Net Cash Flow</div>
                         <div className={`text-xl font-bold ${
                           monthlyDataSets[selectedChartMonthIndex].netCashFlow >= 0 ? 'text-green-700' : 'text-red-700'
                         }`}>
                           {monthlyDataSets[selectedChartMonthIndex].netCashFlow >= 0 ? '+' : ''}{formatCurrency(monthlyDataSets[selectedChartMonthIndex].netCashFlow)}
                         </div>
                       </div>
                     </div>

                     {/* Financial Metrics for Selected Month */}
                     <div className="space-y-6">
                       {/* Key Financial Metrics */}
                       <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                         <MetricCard
                           title="Debt Service Coverage Ratio"
                           value={metrics.debtServiceCoverageRatio}
                           icon={CreditCard}
                           description="How well income covers debt payments"
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
                           value={monthlyDataSets[selectedChartMonthIndex].netCashFlow > 0 ? monthlyDataSets[selectedChartMonthIndex].netCashFlow : metrics.availableCashAfterObligations}
                           icon={DollarSign}
                           description="Discretionary income remaining"
                           status={
                             monthlyDataSets[selectedChartMonthIndex].netCashFlow >= 1000 ? "good" : 
                             monthlyDataSets[selectedChartMonthIndex].netCashFlow >= 500 ? "warning" : "danger"
                           }
                           explanation="Money left over after essential expenses. Higher amounts provide better financial cushion for unexpected expenses."
                         />
                         
                         <MetricCard
                           title="Financial Obligation Coverage"
                           value={`${(metrics.coveragePercentage).toFixed(0)}%`}
                           icon={ShieldCheck}
                           description="Obligations vs. Income %"
                           trend="improving"
                           status="good"
                         />
                       </div>
                     </div>
                   </div>
                </div>
              )
            })()}
          </div>
                          </CardContent>
       </Card>
    </div>
  )
} 