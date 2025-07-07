"use client"

import { useEffect, useState } from "react"
import { useParams, useSearchParams } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Mail, CheckCircle, Clock, RefreshCw } from "lucide-react"
import Image from "next/image"

export default function EmailSentPage() {
  const params = useParams()
  const searchParams = useSearchParams()
  const [isResending, setIsResending] = useState(false)
  
  const campaignId = params.campaignId as string
  const email = searchParams.get("email") || ""

  const handleResendEmail = async () => {
    setIsResending(true)
    try {
      // Mock API call to resend email
      await new Promise(resolve => setTimeout(resolve, 1000))
      // Show success message or update UI
    } catch (error) {
      console.error("Failed to resend email:", error)
    } finally {
      setIsResending(false)
    }
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header Section */}
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-8">
          <div className="flex items-center justify-center">
            <div className="flex items-center space-x-6">
              {/* Shvely Logo */}
              <div className="flex items-center">
                <Image
                  src="/logo.svg"
                  alt="Shvely Logo"
                  width={120}
                  height={40}
                  className="h-8 sm:h-10 w-auto"
                />
              </div>
              
              {/* Plus Icon */}
              <div className="flex-shrink-0 text-slate-400">
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  width="24" 
                  height="24" 
                  viewBox="0 0 24 24" 
                  fill="none" 
                  stroke="currentColor" 
                  strokeWidth="2" 
                  strokeLinecap="round" 
                  strokeLinejoin="round"
                >
                  <path d="M5 12h14"/>
                  <path d="M12 5v14"/>
                </svg>
              </div>
              
              {/* Bank Logo */}
              <div className="flex-shrink-0">
                <Image
                  src="/bank_logo_example.svg"
                  alt="SpringFin Credit Union Logo"
                  width={180}
                  height={60}
                  className="h-10 sm:h-12 w-auto"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-16">
        <Card className="border-slate-200 shadow-lg">
          <CardHeader className="text-center bg-slate-900 text-white rounded-t-lg p-6 lg:p-8">
            <div className="mx-auto w-16 h-16 lg:w-20 lg:h-20 bg-blue-600 rounded-full flex items-center justify-center mb-6">
              <Mail className="h-8 w-8 lg:h-10 lg:w-10 text-white" />
            </div>
            <CardTitle className="text-xl lg:text-2xl mb-2">Check Your Email</CardTitle>
            <CardDescription className="text-slate-300 text-sm lg:text-base">
              We've sent you a secure link to continue your loan application
            </CardDescription>
          </CardHeader>
          
          <CardContent className="p-6 lg:p-8 space-y-6 lg:space-y-8">
            {/* Email Address Display */}
            <div className="bg-slate-50 border border-slate-200 rounded-lg p-4 lg:p-6">
              <div className="text-center">
                <p className="text-sm lg:text-base font-medium text-slate-700 mb-2">Verification link sent to:</p>
                <p className="text-slate-900 font-mono text-base lg:text-lg break-all">{email}</p>
              </div>
            </div>

            {/* Instructions */}
            <div className="space-y-6">
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0 w-10 h-10 bg-blue-50 rounded-full flex items-center justify-center">
                  <span className="text-blue-600 font-semibold text-sm">1</span>
                </div>
                <div>
                  <h3 className="font-semibold text-slate-900 mb-1">Check Your Email Inbox</h3>
                  <p className="text-slate-600 text-sm leading-relaxed">
                    Look for an email from SpringFin Credit Union with the subject line 
                    "Continue Your Loan Application - Secure Link Inside"
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0 w-10 h-10 bg-green-50 rounded-full flex items-center justify-center">
                  <span className="text-green-600 font-semibold text-sm">2</span>
                </div>
                <div>
                  <h3 className="font-semibold text-slate-900 mb-1">Click the Secure Verification Link</h3>
                  <p className="text-slate-600 text-sm leading-relaxed">
                    Click the secure link in the email to continue your application and 
                    safely connect your bank account for loan pre-qualification.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0 w-10 h-10 bg-purple-50 rounded-full flex items-center justify-center">
                  <span className="text-purple-600 font-semibold text-sm">3</span>
                </div>
                <div>
                  <h3 className="font-semibold text-slate-900 mb-1">Get Your Loan Options</h3>
                  <p className="text-slate-600 text-sm leading-relaxed">
                    Connect your bank account safely and get personalized loan rates 
                    and terms based on your actual financial information.
                  </p>
                </div>
              </div>
            </div>

            {/* Troubleshooting */}
            <div className="border-t border-slate-200 pt-6">
              <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-4">
                <h4 className="font-semibold text-amber-800 mb-2 flex items-center">
                  <Clock className="h-4 w-4 mr-2" />
                  Email Not Received?
                </h4>
                <ul className="text-sm text-amber-700 space-y-1">
                  <li>• Check your spam or junk mail folder</li>
                  <li>• Email delivery may take 2-3 minutes</li>
                  <li>• Ensure jennifer@email.com is accessible</li>
                  <li>• Verify your email provider accepts automated emails</li>
                </ul>
              </div>

              <Button 
                variant="outline" 
                onClick={handleResendEmail}
                disabled={isResending}
                className="w-full h-12 lg:h-14 border-slate-300 text-slate-700 hover:bg-slate-50 text-base lg:text-lg"
              >
                {isResending ? (
                  <div className="flex items-center space-x-2">
                    <RefreshCw className="h-4 w-4 animate-spin" />
                    <span>Resending Verification Email...</span>
                  </div>
                ) : (
                  <div className="flex items-center space-x-2">
                    <Mail className="h-4 w-4" />
                    <span>Resend Verification Email</span>
                  </div>
                )}
              </Button>
            </div>

            {/* Next Steps */}
            <div className="bg-slate-50 border border-slate-200 rounded-lg p-6">
              <h4 className="font-semibold text-slate-900 mb-3">What Happens Next</h4>
              <div className="space-y-2 text-sm text-slate-600">
                <p>
                  <strong>Verify Your Identity:</strong> Confirm your personal information and 
                  agree to safely share your financial data for loan pre-qualification.
                </p>
                <p>
                  <strong>Connect Your Bank:</strong> Safely link your bank account through our 
                  secure platform to verify your income and financial health.
                </p>
                <p>
                  <strong>Get Your Results:</strong> Receive personalized loan rates and terms 
                  based on your real financial information, not estimates.
                </p>
              </div>
            </div>

            {/* Security Notice */}
            <div className="text-center pt-4 border-t border-slate-200">
              <p className="text-xs text-slate-500 leading-relaxed">
                Your information is protected with bank-level security and encryption. We never 
                store your banking passwords and only use your data to determine your loan eligibility.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
} 