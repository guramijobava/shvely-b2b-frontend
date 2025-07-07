"use client"

import { useState, useRef, useEffect } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useRouter } from "next/navigation"
import { createVerificationSchema, type CreateVerificationFormData } from "@/lib/validations"
import { useVerifications } from "@/hooks/useVerifications"
import { getDefaultFieldValue } from "@/lib/verification-utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { LoadingSpinner } from "@/components/shared/LoadingSpinner"
import { AlertCircle, User, Settings, Send, HelpCircle, CheckCircle } from "lucide-react"

// Custom Tooltip Component
interface CustomTooltipProps {
  content: string
  children: React.ReactNode
}

function CustomTooltip({ content, children }: CustomTooltipProps) {
  const [showTooltip, setShowTooltip] = useState(false)
  const [tooltipPosition, setTooltipPosition] = useState({ showBelow: true, leftOffset: 0, arrowLeft: 120 })
  const helpIconRef = useRef<HTMLButtonElement>(null)

  // Calculate tooltip position when it's shown
  const calculateTooltipPosition = () => {
    if (!showTooltip || !helpIconRef.current) return

    const helpIconRect = helpIconRef.current.getBoundingClientRect()
    const viewportHeight = window.innerHeight
    const viewportWidth = window.innerWidth
    const tooltipHeight = 120
    const tooltipWidth = 320
    
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
      <button
        ref={helpIconRef}
        onClick={() => setShowTooltip(!showTooltip)}
        className="p-1 rounded-full hover:bg-gray-100 transition-colors"
        aria-label="Show explanation"
        type="button"
      >
        {children}
      </button>
      
      {/* Custom Tooltip */}
      {showTooltip && (
        <div 
          className={`fixed z-[100] ${tooltipPosition.showBelow ? 'mt-2' : 'mb-2'}`}
          style={{ 
            left: `${tooltipPosition.leftOffset}px`,
            top: tooltipPosition.showBelow 
              ? `${helpIconRef.current?.getBoundingClientRect().bottom || 0}px`
              : `${(helpIconRef.current?.getBoundingClientRect().top || 0) - 120}px`,
            width: '320px'
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
                  <CheckCircle className="h-4 w-4 text-blue-500 mr-2" />
                  Information Collection
                </h4>
                <p className="text-sm text-gray-700 leading-relaxed">{content}</p>
              </div>
              <button
                onClick={() => setShowTooltip(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors p-1 flex-shrink-0"
                aria-label="Close explanation"
                type="button"
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

export function SendVerificationForm() {
  const router = useRouter()
  const { createVerification } = useVerifications()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<CreateVerificationFormData>({
    resolver: zodResolver(createVerificationSchema),
    defaultValues: {
      customerInfo: {
        fullName: "",
        email: "",
        phoneNumber: "",
        dateOfBirth: "",
        nationality: "",
        identificationNumber: "",
        residingCountry: "",
        street: "",
        zipcode: "",
        socialSecurityNumber: "",
        state: "",
        city: "",
      },
      settings: {
        expirationDays: 7,
        sendMethod: "email",
        includeReminders: true,
        agentNotes: "",
      },
    },
  })

  const watchedValues = watch()

  const onSubmit = async (data: CreateVerificationFormData) => {
    setIsSubmitting(true)
    setError(null)

    try {
      const verification = await createVerification(data)
      router.push(`/admin/verifications/${verification.id}`)
    } catch (error) {
      setError(error instanceof Error ? error.message : "Failed to send verification")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleSaveDraft = () => {
    // In a real app, this would save the form data as a draft
    console.log("Save as draft:", watchedValues)
  }

  // Phone number validation patterns and placeholders
  const getPhoneValidation = (countryCode: string) => {
    switch (countryCode) {
      case '+995':
        return {
          pattern: /^[0-9]{9}$/,
          placeholder: "555123456",
          example: "555123456 (9 digits)"
        }
      case '+1':
        return {
          pattern: /^[0-9]{3}-?[0-9]{3}-?[0-9]{4}$/,
          placeholder: "555-123-4567",
          example: "555-123-4567 (10 digits)"
        }
      default:
        return {
          pattern: /^[0-9+\-\s()]+$/,
          placeholder: "Enter phone number",
          example: "Enter phone number"
        }
    }
  }

  const formatPhoneNumber = (value: string, countryCode: string) => {
    // Remove all non-digits
    const digits = value.replace(/\D/g, '')
    
    if (countryCode === '+1') {
      // US phone number formatting: XXX-XXX-XXXX
      if (digits.length >= 6) {
        return `${digits.slice(0, 3)}-${digits.slice(3, 6)}-${digits.slice(6, 10)}`
      } else if (digits.length >= 3) {
        return `${digits.slice(0, 3)}-${digits.slice(3)}`
      }
    }
    
    return digits
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Customer Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <User className="h-5 w-5" />
            <span>Customer Information</span>
          </CardTitle>
          <CardDescription>Enter the customer's contact details for the verification request.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Contact Information Section */}
          <div className="rounded-lg border border-gray-200 p-4 bg-gray-50/50">
            <h4 className="text-sm font-semibold text-gray-900 mb-4 flex items-center space-x-2">
              <span>📞</span>
              <span>Contact Information</span>
            </h4>
            
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="firstName">
                  First Name <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="firstName"
                  placeholder="Enter first name"
                  value={watchedValues.customerInfo.fullName?.split(' ')[0] || ''}
                  onChange={(e) => {
                    const lastName = watchedValues.customerInfo.fullName?.split(' ').slice(1).join(' ') || ''
                    setValue("customerInfo.fullName", `${e.target.value} ${lastName}`.trim())
                  }}
                  disabled={isSubmitting}
                />
                {errors.customerInfo?.fullName && (
                  <p className="text-sm text-red-600">{errors.customerInfo.fullName.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="lastName">
                  Last Name <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="lastName"
                  placeholder="Enter last name"
                  value={watchedValues.customerInfo.fullName?.split(' ').slice(1).join(' ') || ''}
                  onChange={(e) => {
                    const firstName = watchedValues.customerInfo.fullName?.split(' ')[0] || ''
                    setValue("customerInfo.fullName", `${firstName} ${e.target.value}`.trim())
                  }}
                  disabled={isSubmitting}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">
                  Email Address <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter email address"
                  {...register("customerInfo.email")}
                  disabled={isSubmitting}
                />
                {errors.customerInfo?.email && <p className="text-sm text-red-600">{errors.customerInfo.email.message}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="phoneNumber">Phone Number</Label>
                <div className="flex space-x-2">
                  <Select
                    value={
                      !watchedValues.customerInfo.phoneNumber ? '' :
                      watchedValues.customerInfo.phoneNumber.startsWith('+995') ? '+995' : 
                      watchedValues.customerInfo.phoneNumber.startsWith('+1') ? '+1' : ''
                    }
                    onValueChange={(countryCode) => {
                      const currentNumber = watchedValues.customerInfo.phoneNumber || ''
                      const numberWithoutCode = currentNumber.replace(/^\+\d+\s*/, '')
                      setValue("customerInfo.phoneNumber", numberWithoutCode ? `${countryCode} ${numberWithoutCode}` : `${countryCode} `)
                    }}
                    disabled={isSubmitting}
                  >
                    <SelectTrigger className="w-28">
                      <SelectValue placeholder="Code" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="+995">
                        <div className="flex items-center space-x-2">
                          <span>🇬🇪</span>
                          <span>+995</span>
                        </div>
                      </SelectItem>
                      <SelectItem value="+1">
                        <div className="flex items-center space-x-2">
                          <span>🇺🇸</span>
                          <span>+1</span>
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                  <Input
                    id="phoneNumber"
                    type="tel"
                    placeholder={
                      watchedValues.customerInfo.phoneNumber?.startsWith('+995') ? getPhoneValidation('+995').placeholder :
                      watchedValues.customerInfo.phoneNumber?.startsWith('+1') ? getPhoneValidation('+1').placeholder :
                      "Select country code first"
                    }
                    value={watchedValues.customerInfo.phoneNumber?.replace(/^\+\d+\s*/, '') || ''}
                    onChange={(e) => {
                      const currentPhone = watchedValues.customerInfo.phoneNumber || ''
                      const existingCountryCode = currentPhone.startsWith('+995') ? '+995' : 
                                                 currentPhone.startsWith('+1') ? '+1' : null
                      
                      if (existingCountryCode) {
                        const formattedNumber = formatPhoneNumber(e.target.value, existingCountryCode)
                        setValue("customerInfo.phoneNumber", formattedNumber ? `${existingCountryCode} ${formattedNumber}` : "")
                      } else {
                        setValue("customerInfo.phoneNumber", e.target.value)
                      }
                    }}
                    disabled={isSubmitting}
                    className="flex-1"
                  />
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="missing-phone"
                    checked={!watchedValues.customerInfo.phoneNumber}
                    onCheckedChange={(checked) => setValue("customerInfo.phoneNumber", "")}
                    disabled={isSubmitting}
                  />
                  <Label htmlFor="missing-phone" className="text-sm text-gray-600">
                    I don't have this information
                  </Label>
                  <CustomTooltip content="If selected, the customer will be asked to provide their phone number during the verification process.">
                    <HelpCircle className="h-4 w-4 text-gray-400 cursor-pointer" />
                  </CustomTooltip>
                </div>
                {errors.customerInfo?.phoneNumber && (
                  <p className="text-sm text-red-600">{errors.customerInfo.phoneNumber.message}</p>
                )}
              </div>

              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="dateOfBirth">Date of Birth</Label>
                <Input
                  id="dateOfBirth"
                  type="date"
                  placeholder="MM/DD/YYYY"
                  {...register("customerInfo.dateOfBirth")}
                  disabled={isSubmitting}
                />
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="missing-dob"
                    checked={!watchedValues.customerInfo.dateOfBirth}
                    onCheckedChange={(checked) => setValue("customerInfo.dateOfBirth", "")}
                    disabled={isSubmitting}
                  />
                  <Label htmlFor="missing-dob" className="text-sm text-gray-600">
                    I don't have this information
                  </Label>
                  <CustomTooltip content="If selected, the customer will be asked to provide their date of birth during the verification process.">
                    <HelpCircle className="h-4 w-4 text-gray-400 cursor-pointer" />
                  </CustomTooltip>
                </div>
                {errors.customerInfo?.dateOfBirth && (
                  <p className="text-sm text-red-600">{errors.customerInfo.dateOfBirth.message}</p>
                )}
              </div>
            </div>
          </div>

          {/* Nationality Section */}
          <div className="rounded-lg border border-gray-200 p-4 bg-green-50/20">
            <h4 className="text-sm font-semibold text-gray-900 mb-4 flex items-center space-x-2">
              <span>🌍</span>
              <span>Nationality</span>
            </h4>
            
            <div className="space-y-4">
              {/* Nationality Selection */}
              <div className="space-y-2">
                <Label htmlFor="nationality">Nationality</Label>
                <Select
                  value={watchedValues.customerInfo.nationality || ""}
                  onValueChange={(value) => setValue("customerInfo.nationality", value)}
                  disabled={isSubmitting}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select nationality" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Georgian">
                      <div className="flex items-center space-x-2">
                        <span>🇬🇪</span>
                        <span>Georgian</span>
                      </div>
                    </SelectItem>
                    <SelectItem value="coming_soon" disabled>
                      <div className="flex items-center space-x-2 text-muted-foreground">
                        <span>🌍</span>
                        <span>Other nationalities (Coming Soon)</span>
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="missing-nationality"
                    checked={!watchedValues.customerInfo.nationality}
                    onCheckedChange={(checked) => setValue("customerInfo.nationality", "")}
                    disabled={isSubmitting}
                  />
                  <Label htmlFor="missing-nationality" className="text-sm text-gray-600">
                    I don't have this information
                  </Label>
                  <CustomTooltip content="If selected, the customer will be asked to provide their nationality during the verification process.">
                    <HelpCircle className="h-4 w-4 text-gray-400 cursor-pointer" />
                  </CustomTooltip>
                </div>
              </div>

              {/* Nationality-specific fields */}
              {watchedValues.customerInfo.nationality === "Georgian" && (
                <div className="pt-4 border-t border-gray-200">
                  <div className="flex items-center space-x-2 mb-3">
                    <span>🇬🇪</span>
                    <h5 className="text-sm font-medium text-gray-800">Georgian Identity Documents</h5>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="identificationNumber">Georgian ID Number</Label>
                    <Input
                      id="identificationNumber"
                      placeholder="Georgian ID number"
                      {...register("customerInfo.identificationNumber")}
                      disabled={isSubmitting}
                    />
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="missing-id"
                        checked={!watchedValues.customerInfo.identificationNumber}
                        onCheckedChange={(checked) => setValue("customerInfo.identificationNumber", checked ? "" : "")}
                        disabled={isSubmitting}
                      />
                      <Label htmlFor="missing-id" className="text-sm text-gray-600">
                        I don't have this information
                      </Label>
                      <CustomTooltip content="If selected, the customer will be asked to provide their Georgian ID number during the verification process.">
                        <HelpCircle className="h-4 w-4 text-gray-400 cursor-pointer" />
                      </CustomTooltip>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Residing Information Section */}
          <div className="rounded-lg border border-gray-200 p-4 bg-blue-50/20">
            <h4 className="text-sm font-semibold text-gray-900 mb-4 flex items-center space-x-2">
              <span>🏠</span>
              <span>Residing Information</span>
            </h4>
            
            <div className="space-y-4">
              {/* Residing Country Selection */}
              <div className="space-y-2">
                <Label htmlFor="residingCountry">Residing Country</Label>
                <Select
                  value={watchedValues.customerInfo.residingCountry || ""}
                  onValueChange={(value) => setValue("customerInfo.residingCountry", value)}
                  disabled={isSubmitting}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select residing country" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="United States">
                      <div className="flex items-center space-x-2">
                        <span>🇺🇸</span>
                        <span>United States</span>
                      </div>
                    </SelectItem>
                    <SelectItem value="coming_soon" disabled>
                      <div className="flex items-center space-x-2 text-muted-foreground">
                        <span>🌍</span>
                        <span>Other countries (Coming Soon)</span>
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="missing-country"
                    checked={!watchedValues.customerInfo.residingCountry}
                    onCheckedChange={(checked) => setValue("customerInfo.residingCountry", "")}
                    disabled={isSubmitting}
                  />
                  <Label htmlFor="missing-country" className="text-sm text-gray-600">
                    I don't have this information
                  </Label>
                  <CustomTooltip content="If selected, the customer will be asked to provide their residing country during the verification process.">
                    <HelpCircle className="h-4 w-4 text-gray-400 cursor-pointer" />
                  </CustomTooltip>
                </div>
              </div>

              {/* Country-specific fields */}
              {watchedValues.customerInfo.residingCountry === "United States" && (
                <div className="pt-4 border-t border-gray-200">
                  <div className="flex items-center space-x-2 mb-3">
                    <span>🇺🇸</span>
                    <h5 className="text-sm font-medium text-gray-800">US Resident Details</h5>
                  </div>
                  
                  <div className="grid md:grid-cols-2 gap-4">
                    {/* Social Security Number */}
                    <div className="space-y-2">
                      <Label htmlFor="socialSecurityNumber">Social Security Number</Label>
                      <Input
                        id="socialSecurityNumber"
                        type="password"
                        placeholder="XXX-XX-XXXX"
                        {...register("customerInfo.socialSecurityNumber")}
                        disabled={isSubmitting}
                      />
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="missing-ssn"
                          checked={!watchedValues.customerInfo.socialSecurityNumber}
                          onCheckedChange={(checked) => setValue("customerInfo.socialSecurityNumber", checked ? "" : "")}
                          disabled={isSubmitting}
                        />
                        <Label htmlFor="missing-ssn" className="text-sm text-gray-600">
                          I don't have this information
                        </Label>
                        <CustomTooltip content="If selected, the customer will be asked to provide their Social Security Number during the verification process.">
                          <HelpCircle className="h-4 w-4 text-gray-400 cursor-pointer" />
                        </CustomTooltip>
                      </div>
                    </div>

                    {/* State */}
                    <div className="space-y-2">
                      <Label htmlFor="state">State</Label>
                      <Input
                        id="state"
                        placeholder="e.g., California"
                        {...register("customerInfo.state")}
                        disabled={isSubmitting}
                      />
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="missing-state"
                          checked={!watchedValues.customerInfo.state}
                          onCheckedChange={(checked) => setValue("customerInfo.state", checked ? "" : "")}
                          disabled={isSubmitting}
                        />
                        <Label htmlFor="missing-state" className="text-sm text-gray-600">
                          I don't have this information
                        </Label>
                        <CustomTooltip content="If selected, the customer will be asked to provide their state during the verification process.">
                          <HelpCircle className="h-4 w-4 text-gray-400 cursor-pointer" />
                        </CustomTooltip>
                      </div>
                    </div>

                    {/* Street Address */}
                    <div className="space-y-2 md:col-span-2">
                      <Label htmlFor="street">Street Address</Label>
                      <Input
                        id="street"
                        placeholder="e.g., 123 Main Street"
                        {...register("customerInfo.street")}
                        disabled={isSubmitting}
                      />
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="missing-street"
                          checked={!watchedValues.customerInfo.street}
                          onCheckedChange={(checked) => setValue("customerInfo.street", checked ? "" : "")}
                          disabled={isSubmitting}
                        />
                        <Label htmlFor="missing-street" className="text-sm text-gray-600">
                          I don't have this information
                        </Label>
                        <CustomTooltip content="If selected, the customer will be asked to provide their street address during the verification process.">
                          <HelpCircle className="h-4 w-4 text-gray-400 cursor-pointer" />
                        </CustomTooltip>
                      </div>
                    </div>

                    {/* Zipcode */}
                    <div className="space-y-2">
                      <Label htmlFor="zipcode">Zipcode</Label>
                      <Input
                        id="zipcode"
                        placeholder="e.g., 12345"
                        {...register("customerInfo.zipcode")}
                        disabled={isSubmitting}
                      />
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="missing-zipcode"
                          checked={!watchedValues.customerInfo.zipcode}
                          onCheckedChange={(checked) => setValue("customerInfo.zipcode", checked ? "" : "")}
                          disabled={isSubmitting}
                        />
                        <Label htmlFor="missing-zipcode" className="text-sm text-gray-600">
                          I don't have this information
                        </Label>
                        <CustomTooltip content="If selected, the customer will be asked to provide their zipcode during the verification process.">
                          <HelpCircle className="h-4 w-4 text-gray-400 cursor-pointer" />
                        </CustomTooltip>
                      </div>
                    </div>

                    {/* City */}
                    <div className="space-y-2">
                      <Label htmlFor="city">City</Label>
                      <Input
                        id="city"
                        placeholder="e.g., San Francisco"
                        {...register("customerInfo.city")}
                        disabled={isSubmitting}
                      />
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="missing-city"
                          checked={!watchedValues.customerInfo.city}
                          onCheckedChange={(checked) => setValue("customerInfo.city", checked ? "" : "")}
                          disabled={isSubmitting}
                        />
                        <Label htmlFor="missing-city" className="text-sm text-gray-600">
                          I don't have this information
                        </Label>
                        <CustomTooltip content="If selected, the customer will be asked to provide their city during the verification process.">
                          <HelpCircle className="h-4 w-4 text-gray-400 cursor-pointer" />
                        </CustomTooltip>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Verification Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Settings className="h-5 w-5" />
            <span>Verification Settings</span>
          </CardTitle>
          <CardDescription>Configure how the verification request will be sent and managed.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="expirationDays">Expiration Period</Label>
            <Select
              value={String(watchedValues.settings.expirationDays)}
              onValueChange={(value) => setValue("settings.expirationDays", Number(value))}
              disabled={isSubmitting}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select expiration period" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="3">3 days</SelectItem>
                <SelectItem value="7">7 days (recommended)</SelectItem>
                <SelectItem value="14">14 days</SelectItem>
                <SelectItem value="30">30 days</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-3">
            <Label>Send Method</Label>
            <RadioGroup
              value={watchedValues.settings.sendMethod}
              onValueChange={(value) => setValue("settings.sendMethod", value as any)}
              disabled={isSubmitting}
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="email" id="email-method" />
                <Label htmlFor="email-method">Email only</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="sms" id="sms-method" />
                <Label htmlFor="sms-method">SMS only</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="both" id="both-method" />
                <Label htmlFor="both-method">Both email and SMS</Label>
              </div>
            </RadioGroup>
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="includeReminders"
              checked={watchedValues.settings.includeReminders}
              onCheckedChange={(checked) => setValue("settings.includeReminders", checked as boolean)}
              disabled={isSubmitting}
            />
            <Label htmlFor="includeReminders" className="text-sm">
              Send reminder notifications before expiration
            </Label>
          </div>

          <div className="space-y-2">
            <Label htmlFor="agentNotes">Agent Notes (Internal)</Label>
            <Textarea
              id="agentNotes"
              placeholder="Add any internal notes about this verification request..."
              rows={3}
              {...register("settings.agentNotes")}
              disabled={isSubmitting}
            />
            <p className="text-xs text-muted-foreground">
              These notes are for internal use only and will not be visible to the customer.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Form Actions */}
      <div className="flex items-center justify-between pt-6 border-t">
        <Button type="button" variant="outline" onClick={() => router.back()} disabled={isSubmitting}>
          Cancel
        </Button>

        <div className="flex items-center space-x-3">
          <Button type="button" variant="secondary" onClick={handleSaveDraft} disabled={isSubmitting}>
            Save as Draft
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <LoadingSpinner size="sm" className="mr-2" />
                Sending...
              </>
            ) : (
              <>
                <Send className="h-4 w-4 mr-2" />
                Send Verification
              </>
            )}
          </Button>
        </div>
      </div>
    </form>
  )
}
