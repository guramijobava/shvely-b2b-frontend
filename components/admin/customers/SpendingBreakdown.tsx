"use client"

import type React from "react"

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { PieChartIcon, ShoppingBag, Utensils, Car, Home, HeartPulse, MoreHorizontal, ChevronDown, ChevronUp, ExternalLink, Calendar as CalendarIcon } from "lucide-react"
import { formatCurrency, cn } from "@/lib/utils"
import { format } from "date-fns"
import { useState } from "react"
import { useRouter } from "next/navigation"

interface SpendingBreakdownProps {
  data: any
}

const categoryIcons: Record<string, React.ElementType> = {
  "Food & Dining": Utensils,
  Transportation: Car,
  Shopping: ShoppingBag,
  Housing: Home,
  "Bills & Utilities": Home,
  Healthcare: HeartPulse,
  Entertainment: PieChartIcon,
  Other: MoreHorizontal,
}

const categoryColors: Record<string, string> = {
  "Housing": 'bg-blue-500',
  "Food & Dining": 'bg-orange-500',
  "Transportation": 'bg-green-500',
  "Shopping": 'bg-purple-500',
  "Bills & Utilities": 'bg-cyan-500',
  "Healthcare": 'bg-pink-500',
  "Entertainment": 'bg-yellow-500',
  "Other": 'bg-gray-500',
}

export function SpendingBreakdown({ data }: SpendingBreakdownProps) {
  const router = useRouter()
  const [selectedChartMonthIndex, setSelectedChartMonthIndex] = useState<number>(11) // Default to current month
  const [expandedCategories, setExpandedCategories] = useState<Set<number>>(new Set())

  const toggleExpandedCategory = (index: number) => {
    const newExpanded = new Set(expandedCategories)
    if (newExpanded.has(index)) {
      newExpanded.delete(index)
    } else {
      newExpanded.add(index)
    }
    setExpandedCategories(newExpanded)
  }

  const handleViewAllTransactions = (category: string) => {
    // Navigate to transactions tab with category filter
    router.push(`/admin/customers/${window.location.pathname.split('/')[3]}/transactions?category=${encodeURIComponent(category)}`)
  }

  if (!data || !data.categories || data.categories.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Spending Category Breakdown</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">Spending breakdown data not available.</p>
        </CardContent>
      </Card>
    )
  }

  const { categories } = data

  return (
    <Card className="border-l-4 border-l-gray-500 shadow-lg">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center space-x-2 text-lg">
          <PieChartIcon className="h-5 w-5 text-gray-500" />
          <span>Spending Category Breakdown</span>
        </CardTitle>
        <CardDescription>Interactive 12-month analysis - click on any month to view detailed transaction breakdown</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="p-6 bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl border">
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
              const monthlyData = categories.map((category: any, categoryIndex: number) => {
                // Add some realistic variation (±25%) to simulate historical changes
                const variation = 0.75 + (Math.sin(monthIndex + categoryIndex) * 0.25)
                const adjustedAmount = category.amount * variation
                return {
                  ...category,
                  amount: adjustedAmount
                }
              })
              
              const totalAmount = monthlyData.reduce((sum: number, category: any) => sum + category.amount, 0)
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
              let currentValue = 0
              while (currentValue <= maxTotal * 1.3) { // Added padding
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
                    <span className="font-medium">Click on any month</span> to view detailed spending breakdown
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
                              {monthSet.data.map((category: any, categoryIndex: number) => {
                                // Calculate height based on amount
                                const availableHeight = 250 // Reduced height for top padding
                                const heightPercentage = (category.amount / chartMaxValue) * 100
                                const segmentHeight = Math.max((heightPercentage / 100) * availableHeight, 1)
                                
                                // Determine border radius based on position
                                const isFirst = categoryIndex === 0
                                const isLast = categoryIndex === monthSet.data.length - 1
                                let borderRadius = ''
                                
                                if (isFirst && isLast) {
                                  borderRadius = '6px' // Single segment gets full rounding
                                } else if (isFirst) {
                                  borderRadius = '6px 6px 0 0' // Top segment
                                } else if (isLast) {
                                  borderRadius = '0 0 6px 6px' // Bottom segment
                                } else {
                                  borderRadius = '0' // Middle segments
                                }
                                
                                return (
                                  <div
                                    key={categoryIndex}
                                    className={`${categoryColors[category.name] || 'bg-gray-500'} w-full transition-all duration-300 hover:opacity-80 cursor-pointer group/segment relative`}
                                    style={{ 
                                      height: `${segmentHeight}px`,
                                      borderRadius
                                    }}
                                  >
                                    {/* Tooltip */}
                                    <div className="absolute left-1/2 bottom-full transform -translate-x-1/2 mb-2 px-3 py-2 bg-gray-900 text-white text-xs rounded-lg opacity-0 group-hover/segment:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-30">
                                      <div className="font-semibold">{category.name}</div>
                                      <div>{format(monthSet.month, "MMM yyyy")}</div>
                                      <div>{formatCurrency(category.amount)}</div>
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
                                 ? 'text-blue-600 font-bold' 
                                 : 'text-gray-600'
                             }`}>
                               {format(monthSet.month, "MMM")}
                               {selectedChartMonthIndex === monthIndex && (
                                 <div className="w-2 h-2 bg-blue-500 rounded-full mx-auto mt-1"></div>
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
                    {categories.map((category: any, index: number) => (
                      <div key={index} className="flex items-center space-x-2">
                        <div className={`w-4 h-4 rounded ${categoryColors[category.name] || 'bg-gray-500'}`}></div>
                        <span className="text-sm font-medium text-gray-700">{category.name}</span>
                      </div>
                    ))}
                  </div>
                </div>
                
                {/* Selected Month Details */}
                                 <div className="mt-6 p-4 bg-white rounded-lg border border-gray-200">
                   <h5 className="font-semibold text-gray-900 mb-4 flex items-center">
                     <CalendarIcon className="h-4 w-4 mr-2 text-blue-600" />
                     {format(monthlyDataSets[selectedChartMonthIndex].month, "MMMM yyyy")} - Detailed Breakdown
                   </h5>
                   
                   {/* Selected Month Summary */}
                   <div className="mb-4 p-3 bg-blue-50 rounded-lg">
                    <div className="text-sm text-gray-600">Total Monthly Spending</div>
                    <div className="text-2xl font-bold text-gray-900">
                      {formatCurrency(monthlyDataSets[selectedChartMonthIndex].total)}
                    </div>
                  </div>
                  
                  {/* Expandable Spending Categories */}
                  <div className="space-y-3">
                    {monthlyDataSets[selectedChartMonthIndex].data.map((category: any, index: number) => {
                      const Icon = categoryIcons[category.name] || MoreHorizontal
                      
                      // Mock top 10 transactions for each category
                      const mockTransactions = (() => {
                        const monthYear = format(monthlyDataSets[selectedChartMonthIndex].month, "yyyy-MM")
                        const baseTransactions = {
                          "Housing": [
                            { date: `${monthYear}-01`, description: 'Rent Payment', amount: category.amount * 0.8 },
                            { date: `${monthYear}-15`, description: 'Property Tax', amount: category.amount * 0.2 }
                          ],
                          "Food & Dining": [
                            { date: `${monthYear}-03`, description: 'Whole Foods Market', amount: category.amount * 0.3 },
                            { date: `${monthYear}-07`, description: 'Starbucks', amount: category.amount * 0.1 },
                            { date: `${monthYear}-12`, description: 'Restaurant ABC', amount: category.amount * 0.25 },
                            { date: `${monthYear}-18`, description: 'Trader Joes', amount: category.amount * 0.2 },
                            { date: `${monthYear}-25`, description: 'McDonald\'s', amount: category.amount * 0.15 }
                          ],
                          "Transportation": [
                            { date: `${monthYear}-05`, description: 'Gas Station', amount: category.amount * 0.4 },
                            { date: `${monthYear}-10`, description: 'Uber Ride', amount: category.amount * 0.3 },
                            { date: `${monthYear}-20`, description: 'Public Transit', amount: category.amount * 0.3 }
                          ]
                        }
                        
                        return baseTransactions[category.name as keyof typeof baseTransactions] || [
                          { date: `${monthYear}-15`, description: `${category.name} Purchase`, amount: category.amount }
                        ]
                      })()
                      
                      const topTransactions = mockTransactions.slice(0, 10) // Top 10
                      const hasMoreTransactions = mockTransactions.length > 10
                      
                      return (
                        <div key={index} className="border border-gray-200 rounded-lg overflow-hidden">
                          {/* Header */}
                          <div 
                            className="p-4 bg-gradient-to-r from-white to-gray-50 cursor-pointer hover:bg-gray-50 transition-colors"
                            onClick={() => toggleExpandedCategory(index)}
                          >
                            <div className="flex items-center justify-between">
                              <div className="flex-1">
                                <div className="flex items-center space-x-3 mb-2">
                                  <Icon className="h-5 w-5 text-gray-600" />
                                  <h4 className="font-semibold text-gray-900">{category.name}</h4>
                                  <Badge variant="outline" className="text-xs">
                                    {mockTransactions.length} transactions
                                  </Badge>
                                </div>
                                <div className="text-sm text-gray-600">
                                  Top {Math.min(10, mockTransactions.length)} transactions shown
                                </div>
                              </div>
                              <div className="flex items-center space-x-3">
                                <div className="text-right">
                                  <div className="text-xl font-bold text-gray-900">{formatCurrency(category.amount)}</div>
                                  <div className="text-sm text-gray-500">
                                    {Math.round((category.amount / monthlyDataSets[selectedChartMonthIndex].total) * 100)}% of total
                                  </div>
                                </div>
                                {expandedCategories.has(index) ? (
                                  <ChevronUp className="h-5 w-5 text-gray-400" />
                                ) : (
                                  <ChevronDown className="h-5 w-5 text-gray-400" />
                                )}
                              </div>
                            </div>
                          </div>
                          
                          {/* Expandable Content */}
                          {expandedCategories.has(index) && (
                            <div className="border-t border-gray-200 bg-gray-50">
                              <div className="p-4">
                                <h6 className="font-medium text-gray-900 mb-3">Top Transactions</h6>
                                <div className="space-y-2">
                                  {topTransactions.map((transaction, txIndex) => (
                                    <div key={txIndex} className="flex items-center justify-between p-3 bg-white rounded-md border">
                                      <div className="flex-1">
                                        <div className="font-medium text-gray-900">{transaction.description}</div>
                                        <div className="text-sm text-gray-500">{transaction.date}</div>
                                      </div>
                                                                             <div className="text-lg font-semibold text-gray-900">
                                         -{formatCurrency(transaction.amount)}
                                       </div>
                                    </div>
                                  ))}
                                </div>
                                
                                {hasMoreTransactions && (
                                  <div className="mt-4 pt-3 border-t border-gray-200">
                                    <Button 
                                      variant="outline" 
                                      size="sm" 
                                      className="w-full"
                                      onClick={() => handleViewAllTransactions(category.name)}
                                    >
                                      <ExternalLink className="h-4 w-4 mr-2" />
                                      View All {category.name} Transactions
                                    </Button>
                                  </div>
                                )}
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
  )
}
