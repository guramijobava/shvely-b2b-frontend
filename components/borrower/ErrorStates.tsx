"use client"

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { AlertTriangle, WifiOff, Clock, RefreshCw, Mail, Phone, XCircle } from "lucide-react"
import Link from "next/link"

interface ErrorStatesProps {
  errorType:
    | "invalid_token"
    | "expired_token"
    | "network_error"
    | "connection_failed"
    | "consent_failed"
    | "consent_declined"
    | "completion_failed"
    | "unknown"
  onRetry?: () => void
  supportEmail?: string
  supportPhone?: string
}

const errorDetails = {
  invalid_token: {
    icon: AlertTriangle,
    title: "Invalid Verification Link",
    message:
      "The verification link you used is invalid or has already been used. Please check the link or request a new one.",
    retryable: false,
  },
  expired_token: {
    icon: Clock,
    title: "Verification Link Expired",
    message: "This verification link has expired. Please request a new one from your financial institution.",
    retryable: false,
  },
  network_error: {
    icon: WifiOff,
    title: "Network Connection Lost",
    message: "We couldn't connect to our servers. Please check your internet connection and try again.",
    retryable: true,
  },
  connection_failed: {
    icon: AlertTriangle,
    title: "Bank Connection Failed",
    message: "We were unable to connect to your bank. Please try again or select a different bank.",
    retryable: true,
  },
  consent_failed: {
    icon: AlertTriangle,
    title: "Consent Submission Failed",
    message: "There was an issue submitting your consent. Please try again.",
    retryable: true,
  },
  consent_declined: {
    icon: XCircle,
    title: "Verification Cannot Continue",
    message: "You have declined to share the required information. The verification process cannot be completed without your consent.",
    retryable: false,
  },
  completion_failed: {
    icon: AlertTriangle,
    title: "Verification Completion Failed",
    message: "We encountered an error while finalizing your verification. Please try again or contact support.",
    retryable: true,
  },
  unknown: {
    icon: AlertTriangle,
    title: "An Unexpected Error Occurred",
    message: "We're sorry, something went wrong. Please try again later or contact support for assistance.",
    retryable: true,
  },
}

export function ErrorStateDisplay({
  errorType,
  onRetry,
  supportEmail = "support@example.com",
  supportPhone = "1-800-BANK-HELP",
}: ErrorStatesProps) {
  const details = errorDetails[errorType] || errorDetails.unknown
  const IconComponent = details.icon

  return (
    <Card className="w-full text-center">
      <CardHeader>
        <IconComponent className="h-12 w-12 text-red-500 mx-auto mb-4" />
        <CardTitle className="text-2xl">{details.title}</CardTitle>
        <CardDescription>{details.message}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {details.retryable && onRetry && (
          <Button onClick={onRetry} size="lg">
            <RefreshCw className="h-4 w-4 mr-2" />
            Try Again
          </Button>
        )}
        <div className="p-4 bg-gray-50 rounded-lg">
          <h4 className="font-semibold mb-2 text-sm">Need Help?</h4>
          <p className="text-xs text-muted-foreground mb-2">
            If the problem persists, please contact our support team:
          </p>
          <div className="flex items-center justify-center space-x-1 text-xs">
            <Mail className="h-3 w-3" />
            <a href={`mailto:${supportEmail}`} className="hover:underline">
              {supportEmail}
            </a>
          </div>
          <div className="flex items-center justify-center space-x-1 text-xs">
            <Phone className="h-3 w-3" />
            <a href={`tel:${supportPhone}`} className="hover:underline">
              {supportPhone}
            </a>
          </div>
          <p className="text-xs text-muted-foreground mt-2">
            Or visit our{" "}
            <Link href="/faq" className="underline hover:text-primary">
              FAQ page
            </Link>
            .
          </p>
        </div>
        {!details.retryable && (
          <Button variant="outline" onClick={() => (window.location.href = "/")}>
            {" "}
            {/* Or a more specific redirect */}
            Go to Homepage
          </Button>
        )}
      </CardContent>
    </Card>
  )
}
