"use client"

import type React from "react"

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { TrendingUp, TrendingDown, Minus, Briefcase, CalendarClock, Percent, Calendar as CalendarIcon, DollarSign, PieChart, ChevronDown, ChevronUp } from "lucide-react"
import { formatCurrency, cn } from "@/lib/utils"
import { format } from "date-fns"
import { useState } from "react"

// Assuming IncomeAnalysisData structure from useFinancialAnalytics hook
interface IncomeAnalysisProps {
  data: any // Replace with specific IncomeAnalysisData type
}

const MetricDisplay = ({
  label,
  value,
  unit,
  icon: Icon,
}: { label: string; value: string | number | undefined; unit?: string; icon?: React.ElementType }) => (
  <div>
    <p className="text-xs text-muted-foreground flex items-center">
      {Icon && <Icon className="h-3.5 w-3.5 mr-1" />}
      {label}
    </p>
    <p className="font-semibold">
      {value === undefined ? "N/A" : unit === "$" ? formatCurrency(value as number) : `${value}${unit || ""}`}
    </p>
  </div>
)

export function IncomeAnalysis({ data }: IncomeAnalysisProps) {
  const [selectedMonth, setSelectedMonth] = useState<Date>(new Date())
  const [selectedChartMonthIndex, setSelectedChartMonthIndex] = useState<number>(11) // Default to current month (last in array)
  const [expandedSources, setExpandedSources] = useState<Set<number>>(new Set())

  const handleMonthSelect = (date: Date | undefined) => {
    if (date) {
      setSelectedMonth(date)
    }
  }

  const toggleExpandedSource = (index: number) => {
    const newExpanded = new Set(expandedSources)
    if (newExpanded.has(index)) {
      newExpanded.delete(index)
    } else {
      newExpanded.add(index)
    }
    setExpandedSources(newExpanded)
  }

  // Generate list of available months (last 12 months)
  const getAvailableMonths = () => {
    const months = []
    const now = new Date()
    for (let i = 0; i < 12; i++) {
      const month = new Date(now.getFullYear(), now.getMonth() - i, 1)
      months.push(month)
    }
    return months
  }

  if (!data || !data.primarySource) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Income Stream Analysis</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">Income analysis data not available.</p>
        </CardContent>
      </Card>
    )
  }

  const { primarySource, totalMonthlyIncome, history } = data
  const TrendIcon = primarySource.trend === "up" ? TrendingUp : primarySource.trend === "down" ? TrendingDown : Minus

    return (
    <div className="space-y-8">

             {/* Primary Income Source with Employment Verification - Enhanced Design */}
       <Card className="border-l-4 border-l-green-500 shadow-lg">
         <CardHeader className="pb-3">
           <CardTitle className="flex items-center space-x-2 text-lg">
             <Briefcase className="h-5 w-5 text-green-500" />
             <span>Primary Income & Employment Verification</span>
           </CardTitle>
           <CardDescription>Main employment income details, stability metrics, and verification status</CardDescription>
         </CardHeader>
         <CardContent>
           <div className="p-6 bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl border">
             <div className="flex items-center justify-between mb-4">
               <div>
                 <h3 className="text-lg font-semibold text-gray-900">
                   {primarySource.name}
                 </h3>
                 <p className="text-sm text-gray-600">{primarySource.type}</p>
               </div>
               <div className="flex items-center space-x-2">
                 <TrendIcon
                   className={`h-5 w-5 ${primarySource.trend === "up" ? "text-green-500" : primarySource.trend === "down" ? "text-red-500" : "text-gray-500"}`}
                 />
                 <Badge variant={primarySource.trend === "up" ? "default" : "secondary"} className="capitalize">
                   {primarySource.trend}
                 </Badge>
               </div>
             </div>
             
             <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
               <div className="text-center p-4 bg-white rounded-lg border">
                 <DollarSign className="h-6 w-6 text-green-600 mx-auto mb-2" />
                 <div className="text-xl font-bold text-gray-900">
                   {formatCurrency(primarySource.averageAmount)}
                 </div>
                 <p className="text-xs text-gray-600 mt-1">Average Amount</p>
               </div>
               
               <div className="text-center p-4 bg-white rounded-lg border">
                 <CalendarClock className="h-6 w-6 text-blue-600 mx-auto mb-2" />
                 <div className="text-xl font-bold text-gray-900">{primarySource.frequency}</div>
                 <p className="text-xs text-gray-600 mt-1">Payment Frequency</p>
               </div>
               
               <div className="text-center p-4 bg-white rounded-lg border">
                 <Percent className="h-6 w-6 text-purple-600 mx-auto mb-2" />
                 <div className="text-xl font-bold text-gray-900">{primarySource.stabilityScore}/100</div>
                 <p className="text-xs text-gray-600 mt-1">Stability Score</p>
               </div>
             </div>
           </div>

           {/* Employment Verification Status */}
           {data.employmentVerification && (
             <div className="mt-6 p-4 bg-white rounded-lg border">
               <div className="flex items-center justify-between mb-4">
                 <h4 className="font-semibold text-gray-900">Employment Verification</h4>
                 <Badge variant={data.employmentVerification.status === 'Verified' ? 'default' : 'secondary'}>
                   {data.employmentVerification.status}
                 </Badge>
               </div>
               
               <div className="space-y-4">
                 {/* Name Match */}
                 <div className="flex items-center space-x-4">
                   {data.employmentVerification.employerNameMatch ? (
                     <div className="flex-shrink-0">
                       <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
                         <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-green-600">
                           <path d="M20 6 9 17l-5-5"/>
                         </svg>
                       </div>
                     </div>
                   ) : (
                     <div className="flex-shrink-0">
                       <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center">
                         <Badge variant="secondary" className="w-6 h-6 rounded-full p-0 bg-red-500 text-white text-xs">
                           ✗
                         </Badge>
                       </div>
                     </div>
                   )}
                   
                   <div className="flex-1">
                     <div className={`text-lg font-semibold ${data.employmentVerification.employerNameMatch ? 'text-green-900' : 'text-red-900'}`}>
                       Name Match
                     </div>
                     <p className={`text-sm ${data.employmentVerification.employerNameMatch ? 'text-green-600' : 'text-red-600'}`}>
                       {data.employmentVerification.employerNameMatch 
                         ? 'Employer name on paystubs matches employment records'
                         : 'Employer name discrepancy found between documents'
                       }
                     </p>
                   </div>
                 </div>
                 
                 {/* Consistent Deposits */}
                 <div className="flex items-center space-x-4">
                   {data.employmentVerification.consistentDeposits ? (
                     <div className="flex-shrink-0">
                       <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
                         <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-green-600">
                           <path d="M20 6 9 17l-5-5"/>
                         </svg>
                       </div>
                     </div>
                   ) : (
                     <div className="flex-shrink-0">
                       <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center">
                         <Badge variant="secondary" className="w-6 h-6 rounded-full p-0 bg-red-500 text-white text-xs">
                           ✗
                         </Badge>
                       </div>
                     </div>
                   )}
                   
                   <div className="flex-1">
                     <div className={`text-lg font-semibold ${data.employmentVerification.consistentDeposits ? 'text-green-900' : 'text-red-900'}`}>
                       Consistent Deposits
                     </div>
                     <p className={`text-sm ${data.employmentVerification.consistentDeposits ? 'text-green-600' : 'text-red-600'}`}>
                       {data.employmentVerification.consistentDeposits 
                         ? 'Regular salary deposits show stable employment pattern'
                         : 'Irregular deposit patterns or missing salary payments detected'
                       }
                     </p>
                   </div>
                 </div>
               </div>
             </div>
           )}

           {/* Income History Chart - Enhanced */}
           <div className="mt-6 p-4 bg-white rounded-lg border">
             <div className="flex items-center justify-between mb-3">
               <h4 className="font-semibold text-gray-900">Income History</h4>
               <Badge variant="outline">Last 12 Months</Badge>
             </div>
             
             {history && (
               <div className="relative">
                 {/* Y-axis labels */}
                 <div className="flex">
                   <div className="w-16 flex flex-col justify-between h-32 text-xs text-gray-500 pr-2">
                     {(() => {
                       const dataMax = Math.max(...history.map((h: any) => h.amount))
                       const dataMin = Math.min(...history.map((h: any) => h.amount))
                       
                       // Add 25% padding above max value for better display
                       const chartMax = dataMax * 1.25
                       const chartMin = dataMin * 0.95 // Slight padding below min too
                       const chartRange = chartMax - chartMin
                       
                       // Create 5 evenly spaced labels from chartMin to chartMax
                       const labels = []
                       for (let i = 4; i >= 0; i--) {
                         const value = chartMin + (i / 4) * chartRange
                         labels.push(
                           <span key={i}>{formatCurrency(Math.round(value))}</span>
                         )
                       }
                       return labels
                     })()}
                   </div>
                   
                                      {/* Chart area */}
                   <div className="flex-1 h-32 bg-gradient-to-t from-gray-100 to-gray-50 rounded-lg relative overflow-hidden">
                     {/* Grid lines */}
                     <div className="absolute inset-0 flex flex-col justify-between px-2 py-1">
                       {[0, 1, 2, 3, 4].map((i) => (
                         <div key={i} className="w-full border-t border-gray-200 opacity-50"></div>
                       ))}
                     </div>
                     
                     {/* Bars container */}
                     <div className="absolute inset-0 flex items-end justify-around px-2 py-1">
                       {/* Bars */}
                       {history.map((entry: { month: string; amount: number }, i: number) => {
                         const dataMax = Math.max(...history.map((h: any) => h.amount))
                         const dataMin = Math.min(...history.map((h: any) => h.amount))
                         
                         // Use same scale as Y-axis (25% padding above max, 5% below min)
                         const chartMax = dataMax * 1.25
                         const chartMin = dataMin * 0.95
                         const chartRange = chartMax - chartMin
                         
                         // Calculate height as a percentage of the available chart height
                         let heightPercentage: number
                         if (chartRange > 0) {
                           // Scale from 0% to 100% of the chart height using padded scale
                           const relativePosition = (entry.amount - chartMin) / chartRange
                           heightPercentage = relativePosition * 100
                         } else {
                           // If all values are the same, show 50% height
                           heightPercentage = 50
                         }
                         
                         // Convert to actual pixels (120px available height accounting for padding)
                         const barHeight = Math.max((heightPercentage / 100) * 120, 8)
                         
                         return (
                           <div 
                             key={i} 
                             className="relative text-center text-xs flex-1 mx-0.5 group flex flex-col justify-end"
                           >
                             <div
                               className="w-full bg-gradient-to-t from-green-500 to-green-400 rounded-t-md hover:from-green-600 hover:to-green-500 transition-all duration-200 cursor-pointer relative"
                               style={{ 
                                 height: `${barHeight}px`
                               }}
                             />
                           
                             {/* Tooltip */}
                             <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-10">
                               {formatCurrency(entry.amount)}
                               <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900"></div>
                             </div>
                             
                             <p className="mt-2 text-gray-600 font-medium text-[10px]">{entry.month.split(' ')[0]}</p>
                           </div>
                         )
                       })}
                     </div>
                   </div>
                 </div>
                 
                 {/* Growth indicator */}
                 <div className="mt-2 text-xs text-gray-600 flex items-center justify-center">
                   <TrendingUp className="h-3 w-3 text-green-600 mr-1" />
                   <span>Income shows improvement in recent months</span>
                 </div>
               </div>
             )}
           </div>
         </CardContent>
       </Card>

             

       {/* Historical Income Sources Breakdown - Separate Section */}
       {data.incomeSources && (
         <Card className="border-l-4 border-l-indigo-500 shadow-lg">
           <CardHeader className="pb-3">
                         <CardTitle className="flex items-center space-x-2 text-lg">
              <TrendingUp className="h-5 w-5 text-indigo-500" />
              <span>Income Sources Breakdown</span>
            </CardTitle>
            <CardDescription>Interactive 12-month analysis - click on any month to view detailed transaction breakdown</CardDescription>
           </CardHeader>
           <CardContent>
             <div className="p-6 bg-gradient-to-br from-indigo-50 to-blue-100 rounded-xl border">
               {(() => {
                 // Generate mock historical data for the last 12 months
                 const months = []
                 const now = new Date()
                 for (let i = 11; i >= 0; i--) {
                   const month = new Date(now.getFullYear(), now.getMonth() - i, 1)
                   months.push(month)
                 }
                 
                 // Generate monthly data with variations
                 const monthlyDataSets = months.map((month, monthIndex) => {
                   const monthlyData = data.incomeSources.map((source: any, sourceIndex: number) => {
                     // Add some realistic variation (±20%) to simulate historical changes
                     const variation = 0.8 + (Math.sin(monthIndex + sourceIndex) * 0.2)
                     const adjustedAmount = source.amount * variation
                     return {
                       ...source,
                       amount: adjustedAmount
                     }
                   })
                   
                   const totalAmount = monthlyData.reduce((sum: number, source: any) => sum + source.amount, 0)
                   return {
                     month,
                     monthIndex,
                     data: monthlyData,
                     total: totalAmount
                   }
                 })
                 
                 // Calculate max total for Y-axis scaling
                 const maxTotal = Math.max(...monthlyDataSets.map(set => set.total))
                 
                 // Smart Y-axis labeling function
                 const generateYAxisLabels = (maxValue: number) => {
                   let step: number
                   let numSteps = 5
                   
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
                     step = Math.ceil(maxValue / numSteps / 10000) * 10000
                   }
                   
                   const labels = []
                   let currentValue = 0
                   while (currentValue <= maxTotal * 1.3) { // Added more padding
                     labels.push(currentValue)
                     currentValue += step
                   }
                   
                   return labels.slice(0, 6) // Max 6 labels
                 }
                 
                 const yAxisLabels = generateYAxisLabels(maxTotal)
                 const chartMaxValue = Math.max(...yAxisLabels)
                 
                 return (
                   <div>
                     {/* Instructions */}
                     <div className="mb-4 text-center">
                       <p className="text-sm text-gray-600">
                         <span className="font-medium">Click on any month</span> to view detailed transaction breakdown
                       </p>
                     </div>
                     
                     {/* Chart */}
                     <div className="relative">
                       {/* Y-axis labels */}
                       <div className="flex">
                         <div className="w-20 flex flex-col-reverse justify-between h-80 text-xs text-gray-600 pr-3">
                           {yAxisLabels.map((label, index) => (
                             <span key={index} className="text-right">
                               {label >= 1000 ? `$${(label / 1000).toFixed(0)}k` : `$${label}`}
                             </span>
                           ))}
                         </div>
                         
                         {/* Chart area */}
                         <div className="flex-1 h-80 bg-white rounded-lg border relative">
                           {/* Grid lines */}
                           <div className="absolute inset-0 flex flex-col-reverse justify-between p-2">
                             {yAxisLabels.map((_, index) => (
                               <div key={index} className="w-full border-t border-gray-200 opacity-30"></div>
                             ))}
                           </div>
                           
                                                       {/* Bars container */}
                            <div className="absolute inset-0 flex items-end justify-around px-4 py-2">
                              {monthlyDataSets.map((monthSet, monthIndex) => (
                                <div 
                                  key={monthIndex} 
                                  className={`flex flex-col items-center flex-1 max-w-[40px] group cursor-pointer transition-all duration-200 ${
                                    selectedChartMonthIndex === monthIndex ? 'bg-blue-50 rounded-lg' : 'hover:bg-gray-50 rounded-lg'
                                  }`}
                                  onClick={() => setSelectedChartMonthIndex(monthIndex)}
                                >
                                  {/* Stacked Bar Container */}
                                  <div className="relative w-full flex flex-col justify-end h-full pb-1">
                                    {monthSet.data.map((source: any, sourceIndex: number) => {
                                      const categoryColors: { [key: string]: string } = {
                                        'Employment': 'bg-blue-500',
                                        'Side Income': 'bg-orange-500',
                                        'Passive Income': 'bg-green-500',
                                        'Benefits': 'bg-purple-500'
                                      }
                                      
                                      // Calculate height based on amount (use available height minus padding)
                                      const availableHeight = 250 // Reduced height to give more top padding
                                      const heightPercentage = (source.amount / chartMaxValue) * 100
                                      const segmentHeight = Math.max((heightPercentage / 100) * availableHeight, 1)
                                      
                                      // Determine border radius based on position
                                      const isFirst = sourceIndex === 0
                                      const isLast = sourceIndex === monthSet.data.length - 1
                                      let borderRadius = ''
                                      
                                      if (isFirst && isLast) {
                                        borderRadius = '6px' // Single segment gets full rounding
                                      } else if (isFirst) {
                                        borderRadius = '6px 6px 0 0' // Top segment (first in array, visually at top)
                                      } else if (isLast) {
                                        borderRadius = '0 0 6px 6px' // Bottom segment (last in array, visually at bottom)
                                      } else {
                                        borderRadius = '0' // Middle segments
                                      }
                                      
                                      return (
                                        <div
                                          key={sourceIndex}
                                          className={`${categoryColors[source.category] || 'bg-gray-500'} w-full transition-all duration-300 hover:opacity-80 cursor-pointer group/segment relative`}
                                          style={{ 
                                            height: `${segmentHeight}px`,
                                            borderRadius
                                          }}
                                        >
                                          {/* Tooltip */}
                                          <div className="absolute left-1/2 bottom-full transform -translate-x-1/2 mb-2 px-3 py-2 bg-gray-900 text-white text-xs rounded-lg opacity-0 group-hover/segment:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-30">
                                            <div className="font-semibold">{source.name}</div>
                                            <div>{format(monthSet.month, "MMM yyyy")}</div>
                                            <div>{formatCurrency(source.amount)}</div>
                                            <div className="text-gray-300 text-[10px] mt-1 border-t border-gray-600 pt-1">
                                              Total: {formatCurrency(monthSet.total)}
                                            </div>
                                            <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900"></div>
                                          </div>
                                        </div>
                                      )
                                    })}
                                  </div>
                                  
                                  {/* Month Label */}
                                  <div className={`mt-2 text-xs font-medium text-center transition-colors ${
                                    selectedChartMonthIndex === monthIndex 
                                      ? 'text-indigo-600 font-bold' 
                                      : 'text-gray-600'
                                  }`}>
                                    {format(monthSet.month, "MMM")}
                                    {selectedChartMonthIndex === monthIndex && (
                                      <div className="w-2 h-2 bg-indigo-500 rounded-full mx-auto mt-1"></div>
                                    )}
                                  </div>
                                </div>
                              ))}
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
                       <div className="flex flex-wrap items-center justify-center gap-6">
                         {data.incomeSources.map((source: any, index: number) => {
                           const categoryColors: { [key: string]: string } = {
                             'Employment': 'bg-blue-500',
                             'Side Income': 'bg-orange-500',
                             'Passive Income': 'bg-green-500',
                             'Benefits': 'bg-purple-500'
                           }
                           
                           return (
                             <div key={index} className="flex items-center space-x-2">
                               <div className={`w-4 h-4 rounded ${categoryColors[source.category] || 'bg-gray-500'}`}></div>
                               <span className="text-sm font-medium text-gray-700">{source.category}</span>
                             </div>
                           )
                         })}
                       </div>
                     </div>
                     
                     {/* Selected Month Details */}
                     <div className="mt-6 p-4 bg-white rounded-lg border border-indigo-200">
                       <h5 className="font-semibold text-gray-900 mb-4 flex items-center">
                         <CalendarIcon className="h-4 w-4 mr-2 text-indigo-600" />
                         {format(monthlyDataSets[selectedChartMonthIndex].month, "MMMM yyyy")} - Detailed Breakdown
                       </h5>
                       
                       {/* Selected Month Summary */}
                       <div className="mb-4 p-3 bg-indigo-50 rounded-lg">
                         <div className="text-sm text-gray-600">Total Monthly Income</div>
                         <div className="text-2xl font-bold text-gray-900">
                           {formatCurrency(monthlyDataSets[selectedChartMonthIndex].total)}
                         </div>
                       </div>
                       
                       {/* Expandable Income Sources */}
                       <div className="space-y-3">
                         {monthlyDataSets[selectedChartMonthIndex].data.map((source: any, index: number) => {
                           const categoryColors: { [key: string]: string } = {
                             'Employment': 'bg-blue-100 border-blue-300 text-blue-800',
                             'Side Income': 'bg-orange-100 border-orange-300 text-orange-800',
                             'Passive Income': 'bg-green-100 border-green-300 text-green-800',
                             'Benefits': 'bg-purple-100 border-purple-300 text-purple-800'
                           }
                           
                           // Mock transactions for each income source
                           const mockTransactions = (() => {
                             const monthYear = format(monthlyDataSets[selectedChartMonthIndex].month, "yyyy-MM")
                             switch (source.category) {
                               case 'Employment':
                                 return [
                                   { date: `${monthYear}-15`, description: 'Direct Deposit - Salary', amount: source.amount * 0.5 },
                                   { date: `${monthYear}-30`, description: 'Direct Deposit - Salary', amount: source.amount * 0.5 }
                                 ]
                               case 'Side Income':
                                 return [
                                   { date: `${monthYear}-05`, description: 'Freelance Payment - Design Work', amount: source.amount * 0.7 },
                                   { date: `${monthYear}-22`, description: 'Consulting Fee', amount: source.amount * 0.3 }
                                 ]
                               case 'Passive Income':
                                 return [
                                   { date: `${monthYear}-01`, description: 'Dividend Payment - Tech Stocks', amount: source.amount * 0.4 },
                                   { date: `${monthYear}-10`, description: 'Rental Income - Property 1', amount: source.amount * 0.6 }
                                 ]
                               case 'Benefits':
                                 return [
                                   { date: `${monthYear}-01`, description: 'Government Benefit Payment', amount: source.amount }
                                 ]
                               default:
                                 return [
                                   { date: `${monthYear}-15`, description: 'Income Payment', amount: source.amount }
                                 ]
                             }
                           })()
                           
                           return (
                             <div key={index} className="border border-gray-200 rounded-lg overflow-hidden">
                               {/* Header */}
                               <div 
                                 className="p-4 bg-gradient-to-r from-white to-gray-50 cursor-pointer hover:bg-gray-50 transition-colors"
                                 onClick={() => toggleExpandedSource(index)}
                               >
                                 <div className="flex items-center justify-between">
                                   <div className="flex-1">
                                     <div className="flex items-center space-x-3 mb-2">
                                       <h4 className="font-semibold text-gray-900">{source.category}</h4>
                                       <Badge className={categoryColors[source.category] || 'bg-gray-100 border-gray-300 text-gray-800'}>
                                         {source.frequency}
                                       </Badge>
                                     </div>
                                     <div className="text-sm text-gray-600">
                                       {mockTransactions.length} transactions identified
                                     </div>
                                   </div>
                                   <div className="flex items-center space-x-3">
                                     <div className="text-right">
                                       <div className="text-xl font-bold text-gray-900">{formatCurrency(source.amount)}</div>
                                       <div className="text-sm text-gray-500">
                                         {Math.round((source.amount / monthlyDataSets[selectedChartMonthIndex].total) * 100)}% of total
                                       </div>
                                     </div>
                                     {expandedSources.has(index) ? (
                                       <ChevronUp className="h-5 w-5 text-gray-400" />
                                     ) : (
                                       <ChevronDown className="h-5 w-5 text-gray-400" />
                                     )}
                                   </div>
                                 </div>
                               </div>
                               
                               {/* Expandable Content */}
                               {expandedSources.has(index) && (
                                 <div className="border-t border-gray-200 bg-gray-50">
                                   <div className="p-4">
                                     <h6 className="font-medium text-gray-900 mb-3">Transactions</h6>
                                     <div className="space-y-2">
                                       {mockTransactions.map((transaction, txIndex) => (
                                         <div key={txIndex} className="flex items-center justify-between p-3 bg-white rounded-md border">
                                           <div className="flex-1">
                                             <div className="font-medium text-gray-900">{transaction.description}</div>
                                             <div className="text-sm text-gray-500">{transaction.date}</div>
                                           </div>
                                           <div className="text-lg font-semibold text-green-600">
                                             +{formatCurrency(transaction.amount)}
                                           </div>
                                         </div>
                                       ))}
                                     </div>
                                   </div>
                                 </div>
                               )}
                             </div>
                           )
                         })}
                       </div>
                     </div>
                   </div>
                 )
               })()}
             </div>
           </CardContent>
         </Card>
       )}

          </div>
  )
}
