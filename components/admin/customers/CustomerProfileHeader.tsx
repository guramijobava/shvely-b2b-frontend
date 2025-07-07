"use client"

import { useState, useEffect } from "react"
import type { CustomerFinancialProfile } from "@/types/customer"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { formatCurrency, formatDate, formatRelativeTime } from "@/lib/utils"
import { formatCustomerInfoFieldForDisplay } from "@/lib/verification-utils"
import { Mail, Phone, ShieldCheck, User, DollarSign, TrendingUp, TrendingDown, AlertTriangle, Sparkles, MapPin, CreditCard, Shield, Eye, EyeOff } from "lucide-react"
import { CustomerActions } from "./CustomerActions"
import { AIAnalystChat } from "./AIAnalystChat"

interface CustomerProfileHeaderProps {
  customer: CustomerFinancialProfile
}

export function CustomerProfileHeader({ customer }: CustomerProfileHeaderProps) {
  const [isChatOpen, setIsChatOpen] = useState(false)
  const [isChatMinimized, setIsChatMinimized] = useState(false)
  const [showNationalityModal, setShowNationalityModal] = useState(false)
  const [showResidenceModal, setShowResidenceModal] = useState(false)

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
                  {customer.customerInfo.dateOfBirth && (
                    <span className="flex items-center">
                      <User className="mr-1.5 h-4 w-4" /> 
                      DOB: {formatCustomerInfoFieldForDisplay('dateOfBirth', customer.customerInfo.dateOfBirth)}
                    </span>
                  )}
                  {customer.customerInfo.nationality && (
                    <button 
                      onClick={() => setShowNationalityModal(true)}
                      className="flex items-center hover:underline cursor-pointer"
                    >
                      <span className="mr-1.5">🇬🇪</span> {customer.customerInfo.nationality}
                    </button>
                  )}
                  {customer.customerInfo.residingCountry && (
                    <button 
                      onClick={() => setShowResidenceModal(true)}
                      className="flex items-center hover:underline cursor-pointer"
                    >
                      <MapPin className="mr-1.5 h-4 w-4" /> {customer.customerInfo.residingCountry}
                    </button>
                  )}
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

      {/* Nationality Details Modal */}
      <Dialog open={showNationalityModal} onOpenChange={setShowNationalityModal}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <span className="text-lg">🇬🇪</span> 
              Nationality Information
            </DialogTitle>
            <DialogDescription>
              Identity documents and nationality details
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="nationality">Nationality</Label>
              <Input 
                id="nationality"
                value={customer.customerInfo.nationality || ""}
                readOnly
                className="bg-gray-50"
              />
            </div>
            {customer.customerInfo.identificationNumber && (
              <SecureField
                label="Georgian Personal ID"
                value={customer.customerInfo.identificationNumber}
                icon={<CreditCard className="h-4 w-4" />}
              />
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* Residence Details Modal */}
      <Dialog open={showResidenceModal} onOpenChange={setShowResidenceModal}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <MapPin className="h-4 w-4" />
              Residence Information
            </DialogTitle>
            <DialogDescription>
              Current residence and location details
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="residingCountry">Residing Country</Label>
              <Input 
                id="residingCountry"
                value={customer.customerInfo.residingCountry || ""}
                readOnly
                className="bg-gray-50"
              />
            </div>
            {customer.customerInfo.street && (
              <div>
                <Label htmlFor="street">Street Address</Label>
                <Input 
                  id="street"
                  value={customer.customerInfo.street}
                  readOnly
                  className="bg-gray-50"
                />
              </div>
            )}
            {customer.customerInfo.zipcode && (
              <div>
                <Label htmlFor="zipcode">Zipcode</Label>
                <Input 
                  id="zipcode"
                  value={customer.customerInfo.zipcode}
                  readOnly
                  className="bg-gray-50"
                />
              </div>
            )}
            {customer.customerInfo.city && (
              <div>
                <Label htmlFor="city">City</Label>
                <Input 
                  id="city"
                  value={customer.customerInfo.city}
                  readOnly
                  className="bg-gray-50"
                />
              </div>
            )}
            {customer.customerInfo.state && (
              <div>
                <Label htmlFor="state">State</Label>
                <Input 
                  id="state"
                  value={customer.customerInfo.state}
                  readOnly
                  className="bg-gray-50"
                />
              </div>
            )}
            {customer.customerInfo.socialSecurityNumber && (
              <SecureField
                label="Social Security Number"
                value={customer.customerInfo.socialSecurityNumber}
                icon={<Shield className="h-4 w-4" />}
              />
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}

// Secure Field Component with auto-hide functionality
interface SecureFieldProps {
  label: string
  value: string
  icon?: React.ReactNode
}

function SecureField({ label, value, icon }: SecureFieldProps) {
  const [isVisible, setIsVisible] = useState(false)
  const [hideTimer, setHideTimer] = useState<NodeJS.Timeout | null>(null)

  const toggleVisibility = () => {
    if (isVisible) {
      // Hide immediately if currently visible
      setIsVisible(false)
      if (hideTimer) {
        clearTimeout(hideTimer)
        setHideTimer(null)
      }
    } else {
      // Show and set auto-hide timer
      setIsVisible(true)
      const timer = setTimeout(() => {
        setIsVisible(false)
        setHideTimer(null)
      }, 10000) // 10 seconds
      setHideTimer(timer)
    }
  }

  // Clean up timer on unmount
  useEffect(() => {
    return () => {
      if (hideTimer) {
        clearTimeout(hideTimer)
      }
    }
  }, [hideTimer])

  return (
    <div>
      <Label htmlFor={label.toLowerCase().replace(/\s+/g, '-')} className="flex items-center gap-2">
        {icon}
        {label}
      </Label>
      <div className="relative">
        <Input
          id={label.toLowerCase().replace(/\s+/g, '-')}
          type={isVisible ? "text" : "password"}
          value={isVisible ? value : "••••••••••"}
          readOnly
          className="bg-gray-50 pr-10 font-mono"
        />
        <button
          type="button"
          onClick={toggleVisibility}
          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
        >
          {isVisible ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
        </button>
      </div>
      {isVisible && (
        <p className="text-xs text-gray-500 mt-1">
          This field will be hidden automatically in 10 seconds
        </p>
      )}
    </div>
  )
}
