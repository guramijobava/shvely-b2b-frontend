"use client"

import { useState, useRef, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { CustomerFinancialProfile } from "@/types/customer"
import { Send, X, Minimize2, Sparkles, TrendingUp, AlertTriangle, DollarSign } from "lucide-react"

interface Message {
  id: string
  type: "user" | "ai"
  content: string
  timestamp: Date
}

interface AIAnalystChatProps {
  customer: CustomerFinancialProfile
  isOpen: boolean
  onClose: () => void
  onMinimize: () => void
}

export function AIAnalystChat({ customer, isOpen, onClose, onMinimize }: AIAnalystChatProps) {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const messagesContainerRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  useEffect(() => {
    if (isOpen && messages.length === 0) {
      // Initialize with welcome message
      const welcomeMessage: Message = {
        id: "welcome",
        type: "ai",
        content: `👋 Hello! I'm **Shvely AI**, your advanced financial analyst.\n\nI've analyzed **${customer.customerInfo.fullName}**'s complete profile:\n• Credit Score: **${customer.creditReports.summary.averageScore}** (${customer.creditReports.summary.overallGrade})\n• Risk Level: **${customer.creditReports.summary.riskLevel.toUpperCase()}**\n• Monthly Income: **$${customer.financialSummary.monthlyIncome?.toLocaleString() || 'N/A'}**\n\nHow can I assist with your analysis today?`,
        timestamp: new Date()
      }
      setMessages([welcomeMessage])
    }
  }, [isOpen, customer, messages.length])

  const generateAIResponse = (userMessage: string): string => {
    const lowerMessage = userMessage.toLowerCase()
    const { creditReports, financialSummary, riskIndicators, customerInfo } = customer

    // Risk Assessment Questions
    if (lowerMessage.includes("risk") || lowerMessage.includes("assessment")) {
      const riskFactors = []
      if (riskIndicators.highOverdraftFrequency) riskFactors.push("frequent overdrafts")
      if (riskIndicators.irregularIncomePattern) riskFactors.push("irregular income patterns")
      if (riskIndicators.gamblingActivity) riskFactors.push("gambling activity detected")
      if (creditReports.summary.scoreVariance > 30) riskFactors.push("significant credit score variance")

      if (riskFactors.length > 0) {
        return `🎯 **Risk Assessment for ${customerInfo.fullName}**\n\n**Risk Level:** ${creditReports.summary.riskLevel.toUpperCase()}\n**Average Score:** ${creditReports.summary.averageScore}\n**Score Variance:** ${creditReports.summary.scoreVariance} points\n\n⚠️ **Key Risk Factors:**\n${riskFactors.map(factor => `• ${factor.charAt(0).toUpperCase() + factor.slice(1)}`).join('\n')}\n\n**Recommendation:** ${creditReports.summary.scoreVariance > 30 ? "Enhanced due diligence required due to inconsistent credit reporting." : "Standard risk assessment protocols apply."}`
      } else {
        return `✅ **Low Risk Assessment**\n\n**${customerInfo.fullName}** presents a **${creditReports.summary.riskLevel.toUpperCase()}** risk profile with excellent indicators:\n\n📊 **Key Metrics:**\n• Average Credit Score: **${creditReports.summary.averageScore}**\n• Score Stability: **${creditReports.summary.scoreVariance} points variance**\n• Payment History: **Consistent across bureaus**\n\n💡 **Insight:** This customer demonstrates strong financial responsibility and creditworthiness.`
      }
    }

    // Financial Behavior Analysis
    if (lowerMessage.includes("behavior") || lowerMessage.includes("spending") || lowerMessage.includes("financial")) {
      const avgUtilization = Math.round((creditReports.equifax.utilization.utilizationPercentage + 
                                       creditReports.experian.utilization.utilizationPercentage + 
                                       creditReports.transunion.utilization.utilizationPercentage) / 3)
      
      return `📈 **Financial Behavior Analysis**\n\n**Customer:** ${customerInfo.fullName}\n\n💳 **Credit Utilization:**\n• Average across bureaus: **${avgUtilization}%**\n• Status: ${avgUtilization > 70 ? "🔴 HIGH - Potential debt stress" : avgUtilization > 30 ? "🟡 MODERATE - Monitor closely" : "🟢 HEALTHY - Excellent management"}\n\n💰 **Cash Flow Analysis:**\n• Monthly Income: **$${financialSummary.monthlyIncome?.toLocaleString() || 'N/A'}**\n• Net Cash Flow: **$${financialSummary.netCashFlow?.toLocaleString() || 'N/A'}**\n• Overdraft Count: **${financialSummary.overdraftCount}** ${financialSummary.overdraftCount > 3 ? "⚠️ (Concerning)" : "✅ (Acceptable)"}\n\n💡 **Behavioral Insight:** ${avgUtilization < 30 && financialSummary.overdraftCount <= 3 ? "Demonstrates excellent financial discipline and cash flow management." : "Shows areas for improvement in credit and cash management."}`
    }

    // Loan Recommendations
    if (lowerMessage.includes("loan") || lowerMessage.includes("recommend") || lowerMessage.includes("approve")) {
      const minScore = Math.min(creditReports.equifax.score, creditReports.experian.score, creditReports.transunion.score)
      const avgScore = creditReports.summary.averageScore
      const maxLoanAmount = (financialSummary.monthlyIncome || 0) * 4
      
      if (avgScore >= 750 && creditReports.summary.riskLevel === "low") {
        return `🏆 **APPROVED - Premium Tier**\n\n**Loan Recommendation for ${customerInfo.fullName}:**\n\n✅ **Decision:** **APPROVE** with premium rates\n📊 **Credit Strength:** Exceptional (${avgScore} average)\n💰 **Recommended Amount:** Up to **$${maxLoanAmount.toLocaleString()}**\n📈 **Interest Rate:** **Prime - 0.5%** (best available)\n\n🎯 **Key Strengths:**\n• Excellent credit score (${avgScore})\n• Low risk profile\n• Strong payment history\n• Stable income verification\n\n✨ **VIP Treatment Recommended**`
      } else if (avgScore >= 650 && minScore >= 600) {
        return `✅ **APPROVED - Standard Terms**\n\n**Loan Recommendation:**\n\n📋 **Decision:** **APPROVE** with standard rates\n📊 **Credit Rating:** Good (${avgScore} average)\n💰 **Recommended Amount:** Up to **$${Math.round(maxLoanAmount * 0.75).toLocaleString()}**\n📈 **Interest Rate:** **Prime + 1.5%**\n\n📋 **Additional Requirements:**\n• Income verification\n• Debt-to-income ratio review\n• Recent payment history confirmation`
      } else {
        return `⚠️ **CONDITIONAL APPROVAL**\n\n**Enhanced Review Required:**\n\n📊 **Credit Concerns:** Below standard (${avgScore} average)\n🔍 **Risk Level:** ${creditReports.summary.riskLevel.toUpperCase()}\n💰 **Max Amount:** **$${Math.round(maxLoanAmount * 0.5).toLocaleString()}**\n📈 **Interest Rate:** **Prime + 4.0%**\n\n📋 **Required Actions:**\n• Manual underwriting review\n• Additional collateral consideration\n• Co-signer evaluation\n• Enhanced documentation`
      }
    }

    // Credit Analysis
    if (lowerMessage.includes("credit") || lowerMessage.includes("score")) {
      const discrepancies = creditReports.summary.majorDiscrepancies
      return `📊 **Tri-Bureau Credit Analysis**\n\n**Bureau Scores:**\n• **Equifax:** ${creditReports.equifax.score} (Grade ${creditReports.equifax.grade})\n• **Experian:** ${creditReports.experian.score} (Grade ${creditReports.experian.grade})\n• **TransUnion:** ${creditReports.transunion.score} (Grade ${creditReports.transunion.grade})\n\n📈 **Score Analysis:**\n• **Average:** ${creditReports.summary.averageScore}\n• **Variance:** ${creditReports.summary.scoreVariance} points\n• **Stability:** ${creditReports.summary.scoreVariance <= 20 ? "🟢 Excellent" : creditReports.summary.scoreVariance <= 40 ? "🟡 Moderate" : "🔴 High Variance"}\n\n${discrepancies.length > 0 ? `⚠️ **Discrepancies Found:**\n${discrepancies.map(d => `• ${d}`).join('\n')}` : "✅ **No major discrepancies detected**"}`
    }

    // Payment History
    if (lowerMessage.includes("payment") || lowerMessage.includes("history")) {
      const avgOnTime = Math.round((creditReports.equifax.paymentHistory.onTimePercentage + 
                                  creditReports.experian.paymentHistory.onTimePercentage + 
                                  creditReports.transunion.paymentHistory.onTimePercentage) / 3)
      const totalLate = creditReports.equifax.paymentHistory.recentLatePayments + 
                       creditReports.experian.paymentHistory.recentLatePayments + 
                       creditReports.transunion.paymentHistory.recentLatePayments

      return `💳 **Payment History Analysis**\n\n**Overall Performance:**\n• **On-Time Rate:** ${avgOnTime}% average across bureaus\n• **Recent Late Payments:** ${totalLate} total\n• **Reliability:** ${avgOnTime >= 95 ? "🟢 Excellent" : avgOnTime >= 85 ? "🟡 Good" : "🔴 Needs Attention"}\n\n**Bureau Breakdown:**\n• **Equifax:** ${creditReports.equifax.paymentHistory.onTimePercentage}% (${creditReports.equifax.paymentHistory.recentLatePayments} late)\n• **Experian:** ${creditReports.experian.paymentHistory.onTimePercentage}% (${creditReports.experian.paymentHistory.recentLatePayments} late)\n• **TransUnion:** ${creditReports.transunion.paymentHistory.onTimePercentage}% (${creditReports.transunion.paymentHistory.recentLatePayments} late)\n\n💡 **Assessment:** ${avgOnTime >= 95 ? "Exceptional payment reliability demonstrates strong financial discipline." : avgOnTime >= 85 ? "Generally reliable with minor payment issues." : "Payment consistency requires attention and monitoring."}`
    }

    // Default response with customer insights
    return `🤖 **Shvely AI - Ready to Assist**\n\nI can provide detailed analysis on:\n\n🎯 **Risk Assessment** - Comprehensive risk evaluation\n💰 **Loan Recommendations** - Approval decisions & terms\n📊 **Credit Analysis** - Multi-bureau score comparison\n💳 **Payment History** - Payment reliability assessment\n📈 **Financial Behavior** - Spending & income patterns\n\n**Current Customer:** ${customerInfo.fullName}\n**Profile Summary:** ${creditReports.summary.averageScore} credit score, ${creditReports.summary.riskLevel} risk\n\nWhat would you like me to analyze?`
  }

  const handleSendMessage = async () => {
    if (!input.trim()) return

    const userMessage: Message = {
      id: Date.now().toString(),
      type: "user",
      content: input.trim(),
      timestamp: new Date()
    }

    setMessages(prev => [...prev, userMessage])
    setInput("")
    setIsTyping(true)

    // Simulate AI thinking time
    setTimeout(() => {
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        type: "ai",
        content: generateAIResponse(input.trim()),
        timestamp: new Date()
      }
      setMessages(prev => [...prev, aiResponse])
      setIsTyping(false)
    }, 1200 + Math.random() * 800) // 1.2-2.0 seconds
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  // Enhanced markdown renderer for chat messages
  const renderMarkdown = (text: string) => {
    const lines = text.split('\n')
    
    return lines.map((line, lineIndex) => {
      // Check for bullet points
      if (line.trim().startsWith('•') || line.trim().startsWith('-')) {
        return (
          <div key={lineIndex} className="flex items-start gap-2 my-1">
            <span className="text-blue-600 font-bold mt-0.5">•</span>
            <span>{processInlineFormatting(line.replace(/^[•-]\s*/, ''))}</span>
          </div>
        )
      }

      // Regular line processing
      return (
        <div key={lineIndex} className={lineIndex > 0 ? "mt-1" : ""}>
          {processInlineFormatting(line)}
        </div>
      )
    })
  }

  // Process inline formatting (bold, italic)
  const processInlineFormatting = (text: string) => {
    const parts = []
    let currentText = text
    let key = 0

    while (currentText.length > 0) {
      // Look for bold (**text**)
      const boldMatch = currentText.match(/\*\*([^*]+)\*\*/)
      // Look for italic (*text* but not ***text***)
      const italicMatch = currentText.match(/(?<!\*)\*([^*]+)\*(?!\*)/)
      
      let nextMatch = null
      let matchType = null
      let matchIndex = -1

      // Find which match comes first
      if (boldMatch && (matchIndex === -1 || boldMatch.index! < matchIndex)) {
        nextMatch = boldMatch
        matchType = 'bold'
        matchIndex = boldMatch.index!
      }
      if (italicMatch && (matchIndex === -1 || italicMatch.index! < matchIndex)) {
        nextMatch = italicMatch
        matchType = 'italic'
        matchIndex = italicMatch.index!
      }

      if (!nextMatch) {
        // No more formatting, add remaining text
        if (currentText.length > 0) {
          parts.push(
            <span key={`text-${key++}`}>{currentText}</span>
          )
        }
        break
      }

      // Add text before the match
      if (matchIndex > 0) {
        parts.push(
          <span key={`pre-${key++}`}>
            {currentText.substring(0, matchIndex)}
          </span>
        )
      }

      // Add formatted text
      if (matchType === 'bold') {
        parts.push(
          <strong key={`bold-${key++}`} className="font-semibold text-gray-900">
            {nextMatch[1]}
          </strong>
        )
        currentText = currentText.substring(matchIndex + nextMatch[0].length)
      } else if (matchType === 'italic') {
        parts.push(
          <em key={`italic-${key++}`} className="italic text-gray-700">
            {nextMatch[1]}
          </em>
        )
        currentText = currentText.substring(matchIndex + nextMatch[0].length)
      }
    }

    return parts.length > 0 ? parts : text
  }

  const quickActions = [
    { label: "Risk Assessment", icon: AlertTriangle, action: "What's the risk assessment?" },
    { label: "Loan Decision", icon: DollarSign, action: "Should we approve a loan?" },
    { label: "Credit Analysis", icon: TrendingUp, action: "Analyze credit scores" }
  ]

  if (!isOpen) return null

  return (
    <Card className="fixed bottom-4 right-4 w-[420px] h-[700px] shadow-2xl z-50 flex flex-col bg-gradient-to-b from-white to-gray-50/50 border-2 border-blue-100">
      <CardHeader className="pb-3 flex-shrink-0 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-t-lg">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative">
              <Avatar className="h-10 w-10 border-2 border-white/20">
                <AvatarFallback className="bg-white/10 text-white backdrop-blur-sm">
                  <Sparkles className="h-5 w-5" />
                </AvatarFallback>
              </Avatar>
              <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-400 rounded-full border-2 border-white"></div>
            </div>
            <div>
              <CardTitle className="text-lg font-bold">Shvely AI</CardTitle>
              <p className="text-xs text-blue-100">
                Financial Analyst • Analyzing {customer.customerInfo.fullName}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-1">
            <Button variant="ghost" size="sm" onClick={onMinimize} className="h-8 w-8 text-white hover:bg-white/10">
              <Minimize2 className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="sm" onClick={onClose} className="h-8 w-8 text-white hover:bg-white/10">
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>
        <div className="flex items-center gap-2 mt-2">
          <Badge variant="secondary" className="bg-white/10 text-white border-white/20 text-xs">
            Risk: {customer.creditReports.summary.riskLevel.toUpperCase()}
          </Badge>
          <Badge variant="secondary" className="bg-white/10 text-white border-white/20 text-xs">
            Score: {customer.creditReports.summary.averageScore}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="flex-1 flex flex-col p-0 min-h-0">
        {/* Messages Area */}
        <div 
          ref={messagesContainerRef}
          className="flex-1 overflow-y-auto p-4 space-y-4 min-h-0"
          style={{ maxHeight: "calc(100% - 140px)" }}
        >
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex gap-3 ${message.type === "user" ? "justify-end" : "justify-start"}`}
            >
              {message.type === "ai" && (
                <Avatar className="h-8 w-8 mt-1 flex-shrink-0">
                  <AvatarFallback className="bg-gradient-to-br from-blue-100 to-blue-200 text-blue-700">
                    <Sparkles className="h-4 w-4" />
                  </AvatarFallback>
                </Avatar>
              )}
              <div
                className={`max-w-[75%] rounded-2xl px-4 py-3 ${
                  message.type === "user"
                    ? "bg-gradient-to-br from-blue-600 to-blue-700 text-white rounded-br-md"
                    : "bg-white border border-gray-200 text-gray-800 rounded-bl-md shadow-sm"
                }`}
              >
                                 <div className="text-sm leading-relaxed">
                   {renderMarkdown(message.content)}
                 </div>
                <p className={`text-xs mt-2 ${
                  message.type === "user" ? "text-blue-100" : "text-gray-500"
                }`}>
                  {message.timestamp.toLocaleTimeString([], { 
                    hour: "2-digit", 
                    minute: "2-digit" 
                  })}
                </p>
              </div>
              {message.type === "user" && (
                <Avatar className="h-8 w-8 mt-1 flex-shrink-0">
                  <AvatarFallback className="bg-gray-100 text-gray-700">
                    {customer.customerInfo.fullName.split(' ').map(n => n[0]).join('').toUpperCase()}
                  </AvatarFallback>
                </Avatar>
              )}
            </div>
          ))}
          
          {isTyping && (
            <div className="flex gap-3 justify-start">
              <Avatar className="h-8 w-8 mt-1">
                <AvatarFallback className="bg-gradient-to-br from-blue-100 to-blue-200 text-blue-700">
                  <Sparkles className="h-4 w-4" />
                </AvatarFallback>
              </Avatar>
              <div className="bg-white border border-gray-200 rounded-2xl rounded-bl-md px-4 py-3 shadow-sm">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: "0ms" }}></div>
                  <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: "150ms" }}></div>
                  <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: "300ms" }}></div>
                </div>
                <p className="text-xs text-gray-500 mt-1">Analyzing...</p>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Quick Actions */}
        {messages.length <= 1 && (
          <div className="px-4 py-2 border-t bg-gray-50/50">
            <p className="text-xs text-gray-600 mb-2 font-medium">Quick Actions:</p>
            <div className="flex gap-2 flex-wrap">
              {quickActions.map((action, index) => (
                <Button
                  key={index}
                  variant="outline"
                  size="sm"
                  onClick={() => setInput(action.action)}
                  className="text-xs h-7 px-2 bg-white hover:bg-blue-50 border-blue-200"
                >
                  <action.icon className="h-3 w-3 mr-1" />
                  {action.label}
                </Button>
              ))}
            </div>
          </div>
        )}

        {/* Input Area */}
        <div className="p-4 border-t bg-white flex-shrink-0">
          <div className="flex gap-2">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Ask about risk, loans, credit analysis..."
              className="flex-1 rounded-xl border-gray-300 focus:border-blue-500 focus:ring-blue-500"
              disabled={isTyping}
            />
            <Button 
              onClick={handleSendMessage} 
              disabled={!input.trim() || isTyping}
              size="sm"
              className="px-3 rounded-xl bg-blue-600 hover:bg-blue-700"
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
          <p className="text-xs text-gray-500 mt-2 text-center">
            🔒 Powered by Shvely AI • Responses based on real customer data
          </p>
        </div>
      </CardContent>
    </Card>
  )
} 