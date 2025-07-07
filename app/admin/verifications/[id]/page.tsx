"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Progress } from "@/components/ui/progress"
import { StatusBadge } from "@/components/shared/StatusBadge"
import { LoadingSpinner } from "@/components/shared/LoadingSpinner"
import { apiClient } from "@/lib/api"
import { formatDate, formatRelativeTime } from "@/lib/utils"
import { 
  getRequiredCustomerInfoFields, 
  formatCustomerInfoFieldForDisplay, 
  getFieldDisplayName, 
  requiresCustomerInfoCollection 
} from "@/lib/verification-utils"
import {
  ArrowLeft,
  User,
  Mail,
  Phone,
  Calendar,
  Clock,
  LinkIcon,
  Send,
  RefreshCw,
  X,
  AlertCircle,
  FileText,
  Users,
  MapPin,
  CreditCard,
  Shield,
  AlertTriangle,
  Info,
} from "lucide-react"
import Link from "next/link"
import type { VerificationRequest } from "@/lib/types"

export default function VerificationDetailsPage() {
  const params = useParams()
  const router = useRouter()
  const [verification, setVerification] = useState<VerificationRequest | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const verificationId = params.id as string

  useEffect(() => {
    const fetchVerification = async () => {
      if (!verificationId) return

      setIsLoading(true)
      setError(null)
      try {
        const data = await apiClient.getVerification(verificationId)
        setVerification(data)
      } catch (error) {
        setError(error instanceof Error ? error.message : "Failed to fetch verification")
      } finally {
        setIsLoading(false)
      }
    }

    fetchVerification()
  }, [verificationId])

  const getTimelineIcon = (step: string) => {
    switch (step) {
      case "created":
        return <FileText className="h-4 w-4" />
      case "sent":
        return <Send className="h-4 w-4" />
      case "started":
        return <Clock className="h-4 w-4" />
      case "connected":
        return <LinkIcon className="h-4 w-4" />
      case "completed":
        return (
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M20 6 9 17l-5-5"/>
          </svg>
        )
      default:
        return <Clock className="h-4 w-4" />
    }
  }

  const getTimelineSteps = (verification: VerificationRequest) => {
    const steps = [
      {
        key: "created",
        label: "Verification Created",
        timestamp: verification.timeline.createdAt,
        completed: true,
        description: `Created by ${verification.createdBy}`,
      },
    ]

    if (verification.timeline.sentAt) {
      steps.push({
        key: "sent",
        label: "Verification Sent",
        timestamp: verification.timeline.sentAt,
        completed: true,
        description: `Sent via ${verification.settings.sendMethod}`,
      })
    }

    if (verification.timeline.customerStartedAt) {
      steps.push({
        key: "started",
        label: "Customer Started",
        timestamp: verification.timeline.customerStartedAt,
        completed: true,
        description: "Customer opened verification link",
      })
    }

    if (verification.timeline.bankConnectedAt) {
      steps.push({
        key: "connected",
        label: "Bank Connected",
        timestamp: verification.timeline.bankConnectedAt,
        completed: true,
        description: `${verification.connectedAccounts} account(s) connected`,
      })
    }

    if (verification.timeline.completedAt) {
      steps.push({
        key: "completed",
        label: "Verification Completed",
        timestamp: verification.timeline.completedAt,
        completed: true,
        description: "All required information collected",
      })
    }

    return steps
  }

  // Information collection analysis
  const getCollectionAnalysis = (customerInfo: any) => {
    const missingFields = getRequiredCustomerInfoFields(customerInfo)
    const totalPossibleFields = ['dateOfBirth', 'nationality', 'identificationNumber', 'residingCountry', 'street', 'zipcode', 'socialSecurityNumber', 'state', 'city', 'phoneNumber']
    const providedFields = totalPossibleFields.filter(field => {
      if (field === 'phoneNumber') return customerInfo.phoneNumber
      return customerInfo[field]
    })
    
    return {
      missingFields,
      providedCount: providedFields.length,
      totalCount: totalPossibleFields.length,
      requiresCollection: requiresCustomerInfoCollection(customerInfo),
      completionPercentage: Math.round((providedFields.length / totalPossibleFields.length) * 100)
    }
  }

  const renderFieldStatus = (fieldName: string, value: any, isSensitive = false) => {
    const hasValue = value && value.trim() !== ''
    
    if (hasValue) {
      const displayValue = isSensitive ? formatCustomerInfoFieldForDisplay(fieldName as any, value) : value
      return (
        <div className="flex items-center space-x-2">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-green-600">
            <path d="M20 6 9 17l-5-5"/>
          </svg>
          <span className="text-sm font-medium">{displayValue}</span>
        </div>
      )
    } else {
      return (
        <div className="flex items-center space-x-2">
          <AlertTriangle className="h-4 w-4 text-orange-500" />
          <span className="text-sm text-orange-600">Will be collected from customer</span>
        </div>
      )
    }
  }

  if (isLoading) {
    return (
      <div className="p-6 flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <LoadingSpinner size="lg" className="mx-auto mb-4" />
          <p className="text-muted-foreground">Loading verification details...</p>
        </div>
      </div>
    )
  }

  if (error || !verification) {
    return (
      <div className="p-6">
        <div className="flex items-center space-x-4 mb-6">
          <Button variant="ghost" size="sm" asChild>
            <Link href="/admin/verifications">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Verifications
            </Link>
          </Button>
        </div>
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <AlertCircle className="h-12 w-12 text-red-500 mb-4" />
            <h3 className="text-lg font-semibold mb-2">Error Loading Verification</h3>
            <p className="text-muted-foreground text-center mb-4">{error || "Verification not found"}</p>
            <Button onClick={() => router.back()}>Go Back</Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  const timelineSteps = getTimelineSteps(verification)
  const collectionAnalysis = getCollectionAnalysis(verification.customerInfo)

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="space-y-4">
        {/* Back Button */}
        <div>
          <Button variant="ghost" size="sm" asChild>
            <Link href="/admin/verifications">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Verifications
            </Link>
          </Button>
        </div>
        
        {/* Title and Actions */}
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <h1 className="text-3xl font-bold text-gray-900">Verification Details</h1>
            <p className="text-muted-foreground">ID: {verification.id}</p>
          </div>
          <div className="flex items-center space-x-3">
            <StatusBadge status={verification.status} />
            <Button variant="outline" size="sm">
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh
            </Button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Enhanced Customer Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <User className="h-5 w-5" />
                <span>Customer Information</span>
              </CardTitle>
              <CardDescription>
                Contact details and identity information for verification
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Contact Information */}
              <div>
                <h4 className="text-sm font-semibold text-gray-900 mb-3 flex items-center space-x-2">
                  <Mail className="h-4 w-4" />
                  <span>Contact Information</span>
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Full Name</label>
                    {renderFieldStatus('fullName', verification.customerInfo.fullName)}
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Email</label>
                    {renderFieldStatus('email', verification.customerInfo.email)}
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Phone Number</label>
                    {renderFieldStatus('phoneNumber', verification.customerInfo.phoneNumber)}
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Date of Birth</label>
                    {renderFieldStatus('dateOfBirth', verification.customerInfo.dateOfBirth, true)}
                  </div>
                </div>
              </div>

              {/* Identity Information */}
              <div>
                <h4 className="text-sm font-semibold text-gray-900 mb-3 flex items-center space-x-2">
                  <Users className="h-4 w-4" />
                  <span>Identity Information</span>
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-muted-foreground flex items-center space-x-1">
                      <span>🇬🇪</span>
                      <span>Nationality</span>
                    </label>
                    {renderFieldStatus('nationality', verification.customerInfo.nationality)}
                  </div>
                  
                  {verification.customerInfo.nationality === "Georgian" && (
                    <div>
                      <label className="text-sm font-medium text-muted-foreground flex items-center space-x-1">
                        <CreditCard className="h-4 w-4" />
                        <span>Georgian ID Number</span>
                      </label>
                      {renderFieldStatus('identificationNumber', verification.customerInfo.identificationNumber, true)}
                    </div>
                  )}
                </div>
              </div>

              {/* Residence Information */}
              <div>
                <h4 className="text-sm font-semibold text-gray-900 mb-3 flex items-center space-x-2">
                  <MapPin className="h-4 w-4" />
                  <span>Residence Information</span>
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-muted-foreground flex items-center space-x-1">
                      <span>🏠</span>
                      <span>Residing Country</span>
                    </label>
                    {renderFieldStatus('residingCountry', verification.customerInfo.residingCountry)}
                  </div>
                  
                  {verification.customerInfo.residingCountry === "United States" && (
                    <>
                      <div className="md:col-span-2">
                        <label className="text-sm font-medium text-muted-foreground">Street Address</label>
                        {renderFieldStatus('street', verification.customerInfo.street)}
                      </div>
                      <div>
                        <label className="text-sm font-medium text-muted-foreground">Zipcode</label>
                        {renderFieldStatus('zipcode', verification.customerInfo.zipcode)}
                      </div>
                      <div>
                        <label className="text-sm font-medium text-muted-foreground">City</label>
                        {renderFieldStatus('city', verification.customerInfo.city)}
                      </div>
                      <div>
                        <label className="text-sm font-medium text-muted-foreground">State</label>
                        {renderFieldStatus('state', verification.customerInfo.state)}
                      </div>
                      <div>
                        <label className="text-sm font-medium text-muted-foreground flex items-center space-x-1">
                          <Shield className="h-4 w-4" />
                          <span>Social Security Number</span>
                        </label>
                        {renderFieldStatus('socialSecurityNumber', verification.customerInfo.socialSecurityNumber, true)}
                      </div>
                    </>
                  )}
                </div>
              </div>

              {verification.status === "completed" && verification.customerId && (
                <div className="pt-4 border-t">
                  <label className="text-sm font-medium text-muted-foreground">Customer Profile</label>
                  <div className="flex items-center space-x-2 mt-1">
                    <User className="h-4 w-4 text-muted-foreground" />
                    <Link
                      href={`/admin/customers/${verification.customerId}`}
                      className="text-sm text-blue-600 hover:underline font-medium"
                    >
                      View Full Customer Profile
                    </Link>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Information Collection Status */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Info className="h-5 w-5" />
                <span>Information Collection Status</span>
              </CardTitle>
              <CardDescription>
                Overview of customer information completeness and collection requirements
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Progress Overview */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Information Completeness</span>
                  <span className="text-sm text-muted-foreground">
                    {collectionAnalysis.providedCount} of {collectionAnalysis.totalCount} fields provided
                  </span>
                </div>
                <Progress value={collectionAnalysis.completionPercentage} className="h-2" />
                <p className="text-xs text-muted-foreground">
                  {collectionAnalysis.completionPercentage}% complete
                </p>
              </div>

              {/* Collection Status */}
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-2">
                  <Users className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm font-medium">Collection Required</span>
                </div>
                <Badge variant={collectionAnalysis.requiresCollection ? "secondary" : "default"}>
                  {collectionAnalysis.requiresCollection ? "Yes" : "No"}
                </Badge>
              </div>

              {/* Missing Fields */}
              {collectionAnalysis.missingFields.length > 0 && (
                <div>
                  <h5 className="text-sm font-medium mb-2">Missing Information</h5>
                  <div className="space-y-1">
                    {collectionAnalysis.missingFields.map((field) => (
                      <div key={field} className="flex items-center space-x-2 text-sm">
                        <AlertTriangle className="h-3 w-3 text-orange-500" />
                        <span className="text-orange-700">{getFieldDisplayName(field)}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Customer Experience Note */}
              <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                <div className="flex items-start space-x-2">
                  <Info className="h-4 w-4 text-blue-600 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-blue-900">Customer Experience</p>
                    <p className="text-sm text-blue-700">
                      {collectionAnalysis.requiresCollection 
                        ? "Customer will complete missing information before connecting their bank account."
                        : "Customer can proceed directly to bank connection - all information is complete."
                      }
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Verification Timeline */}
          <Card>
            <CardHeader>
              <CardTitle>Verification Timeline</CardTitle>
              <CardDescription>Track the progress of this verification request</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {timelineSteps.map((step, index) => (
                  <div key={step.key} className="flex items-start space-x-4">
                    <div
                      className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                        step.completed ? "bg-green-100 text-green-600" : "bg-gray-100 text-gray-400"
                      }`}
                    >
                      {getTimelineIcon(step.key)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-medium">{step.label}</p>
                        <span className="text-xs text-muted-foreground">{formatRelativeTime(step.timestamp)}</span>
                      </div>
                      <p className="text-sm text-muted-foreground">{step.description}</p>
                      <p className="text-xs text-muted-foreground mt-1">{formatDate(step.timestamp)}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Agent Notes */}
          {verification.settings.agentNotes && (
            <Card>
              <CardHeader>
                <CardTitle>Agent Notes</CardTitle>
                <CardDescription>Internal notes for this verification</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm">{verification.settings.agentNotes}</p>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Enhanced Quick Stats */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Stats</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Information Complete</span>
                <Badge variant={collectionAnalysis.requiresCollection ? "secondary" : "default"}>
                  {collectionAnalysis.completionPercentage}%
                </Badge>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Collection Required</span>
                <span className="text-sm font-medium">
                  {collectionAnalysis.requiresCollection ? "Yes" : "No"}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Missing Fields</span>
                <span className="text-sm font-medium">{collectionAnalysis.missingFields.length}</span>
              </div>
              <Separator />
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Connected Accounts</span>
                <span className="text-sm font-medium">{verification.connectedAccounts}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Attempts</span>
                <span className="text-sm font-medium">{verification.attempts}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Send Method</span>
                <Badge variant="outline" className="text-xs">
                  {verification.settings.sendMethod}
                </Badge>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Reminders</span>
                <span className="text-sm font-medium">
                  {verification.settings.includeReminders ? "Enabled" : "Disabled"}
                </span>
              </div>
            </CardContent>
          </Card>

          {/* Important Dates */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Calendar className="h-5 w-5" />
                <span>Important Dates</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium text-muted-foreground">Created</label>
                <p className="text-sm">{formatDate(verification.timeline.createdAt)}</p>
                <p className="text-xs text-muted-foreground">{formatRelativeTime(verification.timeline.createdAt)}</p>
              </div>
              <Separator />
              <div>
                <label className="text-sm font-medium text-muted-foreground">Expires</label>
                <p className="text-sm">{formatDate(verification.timeline.expiresAt)}</p>
                <p className="text-xs text-muted-foreground">{formatRelativeTime(verification.timeline.expiresAt)}</p>
              </div>
              {verification.timeline.completedAt && (
                <>
                  <Separator />
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Completed</label>
                    <p className="text-sm">{formatDate(verification.timeline.completedAt)}</p>
                    <p className="text-xs text-muted-foreground">
                      {formatRelativeTime(verification.timeline.completedAt)}
                    </p>
                  </div>
                </>
              )}
            </CardContent>
          </Card>

          {/* Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {verification.status === "sent" || verification.status === "in_progress" ? (
                <>
                  <Button className="w-full" size="sm">
                    <Send className="h-4 w-4 mr-2" />
                    Resend Link
                  </Button>
                  <Button variant="outline" className="w-full" size="sm">
                    <Clock className="h-4 w-4 mr-2" />
                    Extend Expiration
                  </Button>
                </>
              ) : null}

              {verification.status !== "completed" && verification.status !== "expired" && (
                <Button variant="destructive" className="w-full" size="sm">
                  <X className="h-4 w-4 mr-2" />
                  Cancel Verification
                </Button>
              )}

              <Button variant="outline" className="w-full" size="sm">
                <LinkIcon className="h-4 w-4 mr-2" />
                Copy Link
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
