"use client"

import type React from "react"
import { useState, useRef, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { LoadingSpinner } from "@/components/shared/LoadingSpinner"
import { TrendingUp, TrendingDown, Minus, HelpCircle } from "lucide-react"
import { cn } from "@/lib/utils"

interface StatsCardProps {
  title: string
  value: string | number
  icon: React.ComponentType<{ className?: string }>
  trend?: {
    value: number
    label: string
    direction: "up" | "down" | "neutral"
  }
  isLoading?: boolean
  onClick?: () => void
  helpText?: string
}

export function StatsCard({ 
  title, 
  value, 
  icon: Icon, 
  trend, 
  isLoading, 
  onClick, 
  helpText 
}: StatsCardProps) {
  const [showTooltip, setShowTooltip] = useState(false)
  const [tooltipPosition, setTooltipPosition] = useState({ showBelow: true, leftOffset: 0, arrowLeft: 120 })
  const helpIconRef = useRef<HTMLButtonElement>(null)

  const getTrendIcon = () => {
    if (!trend) return null

    switch (trend.direction) {
      case "up":
        return <TrendingUp className="h-3 w-3" />
      case "down":
        return <TrendingDown className="h-3 w-3" />
      default:
        return <Minus className="h-3 w-3" />
    }
  }

  const getTrendColor = () => {
    if (!trend) return ""

    switch (trend.direction) {
      case "up":
        return "text-green-600"
      case "down":
        return "text-red-600"
      default:
        return "text-gray-600"
    }
  }

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
      <Card
        className={cn("transition-all duration-200", onClick && "cursor-pointer hover:shadow-md hover:scale-105")}
        onClick={onClick}
      >
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <div className="flex items-center space-x-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
            {helpText && (
              <button
                ref={helpIconRef}
                onClick={(e) => {
                  e.stopPropagation()
                  setShowTooltip(!showTooltip)
                }}
                className="p-1 rounded-full hover:bg-gray-100 transition-colors"
                aria-label="Show explanation"
              >
                <HelpCircle className="h-4 w-4 text-blue-500 hover:text-blue-600" />
              </button>
            )}
          </div>
          <Icon className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex items-center space-x-2">
              <LoadingSpinner size="sm" />
              <span className="text-muted-foreground">Loading...</span>
            </div>
          ) : (
            <>
              <div className="text-2xl font-bold">{value}</div>
              {trend && (
                <div className={cn("flex items-center space-x-1 text-xs mt-1", getTrendColor())}>
                  {getTrendIcon()}
                  <span>
                    {trend.value > 0 ? "+" : ""}
                    {trend.value}%
                  </span>
                  <span className="text-muted-foreground">{trend.label}</span>
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>

      {/* Custom Tooltip */}
      {showTooltip && helpText && (
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
                  <HelpCircle className="h-4 w-4 text-blue-500 mr-2" />
                  What this means
                </h4>
                <p className="text-sm text-gray-700 leading-relaxed">{helpText}</p>
              </div>
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  setShowTooltip(false)
                }}
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
