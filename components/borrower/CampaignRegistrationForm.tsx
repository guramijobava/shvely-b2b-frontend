"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { ArrowRight, Building2, CheckCircle2, Globe } from "lucide-react"
import Image from "next/image"

interface CampaignRegistrationFormProps {
  bankName: string
  bankLogo: string
  onSubmit: (data: { firstName: string; lastName: string; email: string }) => Promise<void>
}

export function CampaignRegistrationForm({ bankName, bankLogo, onSubmit }: CampaignRegistrationFormProps) {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    consent: false
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errors, setErrors] = useState<{ [key: string]: string }>({})

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {}

    if (!formData.firstName.trim()) {
      newErrors.firstName = "First name is required"
    }

    if (!formData.lastName.trim()) {
      newErrors.lastName = "Last name is required"
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required"
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address"
    }

    if (!formData.consent) {
      newErrors.consent = "You must agree to proceed"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) {
      return
    }

    setIsSubmitting(true)
    try {
      await onSubmit({
        firstName: formData.firstName.trim(),
        lastName: formData.lastName.trim(),
        email: formData.email.trim()
      })
    } catch (error) {
      console.error("Submission failed:", error)
      setErrors({ submit: "Failed to submit. Please try again." })
    } finally {
      setIsSubmitting(false)
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
                  src={bankLogo}
                  alt={`${bankName} Logo`}
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
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 lg:gap-16 items-start">
          
          {/* Left Side - Information */}
          <div className="lg:col-span-3 space-y-8 lg:space-y-12">
            <div>
              <h1 className="text-2xl sm:text-3xl lg:text-3xl xl:text-4xl font-bold text-slate-900 leading-tight">
                Get Pre-Qualified in Minutes
              </h1>
              <p className="text-lg sm:text-xl lg:text-lg text-slate-600 mt-4 lg:mt-6 leading-relaxed">
                Start with your basic information, then we'll guide you through 
                connecting your bank safely to check your loan eligibility.
              </p>
            </div>

            {/* Benefits */}
            <div className="space-y-6 lg:space-y-8">
              <div className="flex items-start space-x-4 lg:space-x-6">
                <div className="flex-shrink-0 w-12 h-12 lg:w-14 lg:h-14 bg-blue-50 rounded-lg flex items-center justify-center">
                  <Building2 className="h-6 w-6 lg:h-7 lg:w-7 text-blue-600" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-slate-900 mb-2 text-base lg:text-base">
                    Quick & Accurate Assessment
                  </h3>
                  <p className="text-slate-600 text-sm lg:text-sm leading-relaxed">
                    We analyze your real banking data to give you accurate loan rates and terms - no guessing or manual paperwork required.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4 lg:space-x-6">
                <div className="flex-shrink-0 w-12 h-12 lg:w-14 lg:h-14 bg-green-50 rounded-lg flex items-center justify-center">
                  <CheckCircle2 className="h-6 w-6 lg:h-7 lg:w-7 text-green-600" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-slate-900 mb-2 text-base lg:text-base">
                    Your Data Stays Safe
                  </h3>
                  <p className="text-slate-600 text-sm lg:text-sm leading-relaxed">
                    We use bank-level security to protect your information. You control what we see, and we never store your banking passwords.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4 lg:space-x-6">
                <div className="flex-shrink-0 w-12 h-12 lg:w-14 lg:h-14 bg-purple-50 rounded-lg flex items-center justify-center">
                  <Globe className="h-6 w-6 lg:h-7 lg:w-7 text-purple-600" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-slate-900 mb-2 text-base lg:text-base">
                    Multiple Loan Options
                  </h3>
                  <p className="text-slate-600 text-sm lg:text-sm leading-relaxed">
                    Get pre-qualified for home loans, personal loans, auto loans, and business financing all in one simple process.
                  </p>
                </div>
              </div>
            </div>

            {/* Trust Indicators - Desktop Only */}
            <div className="hidden lg:block bg-slate-100 rounded-lg p-6 lg:p-8">
              <h4 className="font-semibold text-slate-900 mb-4 lg:mb-6 text-base lg:text-base">Security & Compliance</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 lg:gap-4 text-sm lg:text-sm text-slate-700">
                <div className="flex items-center">
                  <span className="w-1.5 h-1.5 bg-blue-600 rounded-full mr-3"></span>
                  SOC 2 Type II Certified
                </div>
                <div className="flex items-center">
                  <span className="w-1.5 h-1.5 bg-blue-600 rounded-full mr-3"></span>
                  256-bit SSL Encryption
                </div>
                <div className="flex items-center">
                  <span className="w-1.5 h-1.5 bg-blue-600 rounded-full mr-3"></span>
                  FFIEC Guidelines
                </div>
                <div className="flex items-center">
                  <span className="w-1.5 h-1.5 bg-blue-600 rounded-full mr-3"></span>
                  PCI DSS Compliant
                </div>
              </div>
            </div>
          </div>

          {/* Right Side - Form */}
          <div className="lg:col-span-2">
            <Card className="border-slate-200 shadow-lg sticky top-4">
              <CardHeader className="bg-slate-900 text-white rounded-t-lg p-6 lg:p-8">
                <CardTitle className="text-lg lg:text-lg">Start Your Application</CardTitle>
                <CardDescription className="text-slate-300 text-sm lg:text-sm">
                  Enter your details to get personalized loan rates
                </CardDescription>
              </CardHeader>
              
              <CardContent className="p-6 lg:p-8">
                <form onSubmit={handleSubmit} className="space-y-6 lg:space-y-8">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 lg:gap-6">
                    <div className="space-y-2 lg:space-y-3">
                      <Label htmlFor="firstName" className="text-sm lg:text-sm font-medium text-slate-700">
                        First Name *
                      </Label>
                      <Input
                        id="firstName"
                        type="text"
                        value={formData.firstName}
                        onChange={(e) => setFormData(prev => ({ ...prev, firstName: e.target.value }))}
                        className={`h-12 lg:h-12 text-base ${errors.firstName ? "border-red-500" : "border-slate-300"} focus:border-slate-900 focus:ring-slate-900`}
                        placeholder="Enter first name"
                      />
                      {errors.firstName && (
                        <p className="text-sm text-red-600">{errors.firstName}</p>
                      )}
                    </div>

                    <div className="space-y-2 lg:space-y-3">
                      <Label htmlFor="lastName" className="text-sm lg:text-sm font-medium text-slate-700">
                        Last Name *
                      </Label>
                      <Input
                        id="lastName"
                        type="text"
                        value={formData.lastName}
                        onChange={(e) => setFormData(prev => ({ ...prev, lastName: e.target.value }))}
                        className={`h-12 lg:h-12 text-base ${errors.lastName ? "border-red-500" : "border-slate-300"} focus:border-slate-900 focus:ring-slate-900`}
                        placeholder="Enter last name"
                      />
                      {errors.lastName && (
                        <p className="text-sm text-red-600">{errors.lastName}</p>
                      )}
                    </div>
                  </div>

                  <div className="space-y-2 lg:space-y-3">
                    <Label htmlFor="email" className="text-sm lg:text-sm font-medium text-slate-700">
                      Email Address *
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                      className={`h-12 lg:h-12 text-base ${errors.email ? "border-red-500" : "border-slate-300"} focus:border-slate-900 focus:ring-slate-900`}
                      placeholder="Enter email address"
                    />
                    {errors.email && (
                      <p className="text-sm text-red-600">{errors.email}</p>
                    )}
                  </div>

                  {/* Consent */}
                  <div className="border border-slate-200 rounded-lg p-4 lg:p-6 bg-slate-50">
                    <div className="flex items-start space-x-3 lg:space-x-4">
                      <Checkbox
                        id="consent"
                        checked={formData.consent}
                        onCheckedChange={(checked) => setFormData(prev => ({ ...prev, consent: !!checked }))}
                        className={`mt-1 w-5 h-5 ${errors.consent ? "border-red-500" : ""}`}
                      />
                      <div className="flex-1">
                        <Label
                          htmlFor="consent"
                          className="text-sm lg:text-sm text-slate-700 leading-relaxed cursor-pointer font-normal"
                        >
                          I agree to {bankName}'s Terms & Conditions and Privacy Policy.  I consent to receive 
                          email communications including verification links, loan offers, and marketing 
                          materials.
                        </Label>
                        {errors.consent && (
                          <p className="text-sm text-red-600 mt-2">{errors.consent}</p>
                        )}
                      </div>
                    </div>
                  </div>

                  {errors.submit && (
                    <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                      <p className="text-sm text-red-700">{errors.submit}</p>
                    </div>
                  )}

                  <Button 
                    type="submit" 
                    className="w-full h-12 lg:h-12 bg-slate-900 hover:bg-slate-800 text-white font-medium text-base lg:text-base" 
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <div className="flex items-center space-x-2">
                        <div className="w-4 h-4 lg:w-4 lg:h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        <span>Processing Request...</span>
                      </div>
                    ) : (
                      <div className="flex items-center space-x-2">
                        <span>Receive verification link</span>
                        <ArrowRight className="h-4 w-4 lg:h-4 lg:w-4" />
                      </div>
                    )}
                  </Button>

                  <p className="text-xs lg:text-xs text-slate-500 text-center leading-relaxed px-2">
                    Your information is secure and encrypted. We'll send you an email to continue 
                    your application safely.
                  </p>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Trust Indicators - Mobile Only */}
        <div className="lg:hidden mt-8">
          <div className="bg-slate-100 rounded-lg p-6">
            <h4 className="font-semibold text-slate-900 mb-4 text-base">Security & Compliance</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm text-slate-700">
              <div className="flex items-center">
                <span className="w-1.5 h-1.5 bg-blue-600 rounded-full mr-3"></span>
                SOC 2 Type II Certified
              </div>
              <div className="flex items-center">
                <span className="w-1.5 h-1.5 bg-blue-600 rounded-full mr-3"></span>
                256-bit SSL Encryption
              </div>
              <div className="flex items-center">
                <span className="w-1.5 h-1.5 bg-blue-600 rounded-full mr-3"></span>
                FFIEC Guidelines
              </div>
              <div className="flex items-center">
                <span className="w-1.5 h-1.5 bg-blue-600 rounded-full mr-3"></span>
                PCI DSS Compliant
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 