"use client"

import type React from "react"

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { TrendingUp, TrendingDown, Minus, Briefcase, CalendarClock, Percent, Calendar as CalendarIcon, DollarSign, PieChart } from "lucide-react"
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

  const handleMonthSelect = (date: Date | undefined) => {
    if (date) {
      setSelectedMonth(date)
    }
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

             {/* Income Sources Breakdown - Enhanced Design */}
       {data.incomeSources && (
         <Card className="border-l-4 border-l-purple-500 shadow-lg">
           <CardHeader className="pb-3">
             <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0">
               <div>
                 <CardTitle className="flex items-center space-x-2 text-lg">
                   <PieChart className="h-5 w-5 text-purple-500" />
                   <span>Income Sources Breakdown</span>
                 </CardTitle>
                 <CardDescription>Detailed analysis of all income streams and their contributions</CardDescription>
               </div>
               
               <Popover>
                 <PopoverTrigger asChild>
                   <Button
                     variant="outline"
                     className={cn(
                       "w-[200px] justify-start text-left font-normal"
                     )}
                   >
                     <CalendarIcon className="mr-2 h-4 w-4" />
                     {format(selectedMonth, "MMM yyyy")}
                   </Button>
                 </PopoverTrigger>
                 <PopoverContent className="w-auto p-0" align="end">
                   <div className="p-3">
                     <div className="grid grid-cols-2 gap-2">
                       {getAvailableMonths().map((month, index) => (
                         <Button
                           key={index}
                           variant={
                             format(month, "MMM yyyy") === format(selectedMonth, "MMM yyyy")
                               ? "default"
                               : "ghost"
                           }
                           className="h-9 text-sm font-normal justify-start"
                           onClick={() => handleMonthSelect(month)}
                         >
                           {format(month, "MMM yyyy")}
                         </Button>
                       ))}
                     </div>
                   </div>
                 </PopoverContent>
               </Popover>
             </div>
           </CardHeader>
          <CardContent className="space-y-4">
            {data.incomeSources.map((source: any, index: number) => {
              const categoryColors: { [key: string]: string } = {
                'Employment': 'bg-blue-100 border-blue-300 text-blue-800',
                'Side Income': 'bg-orange-100 border-orange-300 text-orange-800',
                'Passive Income': 'bg-green-100 border-green-300 text-green-800',
                'Benefits': 'bg-purple-100 border-purple-300 text-purple-800'
              }
              
              return (
                <div key={index} className="p-4 bg-gradient-to-r from-white to-gray-50 rounded-lg border-2 hover:shadow-md transition-shadow">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h4 className="font-semibold text-gray-900">{source.name}</h4>
                        <Badge className={categoryColors[source.category] || 'bg-gray-100 border-gray-300 text-gray-800'}>
                          {source.category}
                        </Badge>
                      </div>
                      <div className="flex items-center space-x-4 text-sm text-gray-600">
                        <span className="flex items-center">
                          <Briefcase className="h-3 w-3 mr-1" />
                          {source.source}
                        </span>
                        <span className="flex items-center">
                          <CalendarClock className="h-3 w-3 mr-1" />
                          {source.frequency}
                        </span>
                      </div>
                    </div>
                    <div className="text-right ml-6">
                      <div className="text-xl font-bold text-gray-900">{formatCurrency(source.amount)}</div>
                      <div className="text-sm text-gray-500">{source.percentage}% of total</div>
                    </div>
                  </div>
                </div>
              )
            })}
          </CardContent>
        </Card>
      )}

          </div>
  )
}
