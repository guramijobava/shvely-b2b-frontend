"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { getFieldDisplayName, getFieldPlaceholder, validateCustomerInfoField, type CustomerInfoField } from "@/lib/verification-utils"

interface CustomerInfoFormProps {
  requiredFields: string[]
  initialData: any
  onSubmit: (data: any) => Promise<void>
  isSubmitting: boolean
}

export function CustomerInfoForm({ requiredFields, initialData, onSubmit, isSubmitting }: CustomerInfoFormProps) {
  const [formData, setFormData] = useState({
    dateOfBirth: initialData?.dateOfBirth || "",
    nationality: initialData?.nationality || "",
    identificationNumber: initialData?.identificationNumber || "",
    residingCountry: initialData?.residingCountry || "",
    street: initialData?.street || "",
    zipcode: initialData?.zipcode || "",
    socialSecurityNumber: initialData?.socialSecurityNumber || "",
    state: initialData?.state || "",
    city: initialData?.city || "",
  })

  const [errors, setErrors] = useState<Record<string, string>>({})

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Validate required fields
    const newErrors: Record<string, string> = {}
    
    requiredFields.forEach(field => {
      const value = formData[field as keyof typeof formData]
      const validation = validateCustomerInfoField(field as CustomerInfoField, value)
      if (!validation.isValid) {
        newErrors[field] = validation.error || 'Invalid value'
      }
    })

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    // Only submit fields that were required
    const updateData: Record<string, string> = {}
    requiredFields.forEach(field => {
      updateData[field] = formData[field as keyof typeof formData]
    })
    
    try {
      await onSubmit(updateData)
    } catch (error) {
      console.error("Form submission error:", error)
    }
  }

  const updateField = (fieldName: string, value: string) => {
    setFormData(prev => ({ ...prev, [fieldName]: value }))
    
    // Clear error when user starts typing
    if (errors[fieldName]) {
      setErrors(prev => {
        const newErrors = { ...prev }
        delete newErrors[fieldName]
        return newErrors
      })
    }
  }

  const renderField = (fieldName: string) => {
    const value = formData[fieldName as keyof typeof formData]
    const error = errors[fieldName]
    const displayName = getFieldDisplayName(fieldName as CustomerInfoField)
    const placeholder = getFieldPlaceholder(fieldName as CustomerInfoField)

    switch (fieldName) {
      case 'dateOfBirth':
        return (
          <div className="space-y-2">
            <Label htmlFor="dateOfBirth">{displayName}</Label>
            <Input
              id="dateOfBirth"
              type="date"
              value={value}
              onChange={(e) => updateField(fieldName, e.target.value)}
              placeholder={placeholder}
              className={error ? "border-red-500" : ""}
              required
            />
            {error && <p className="text-sm text-red-500">{error}</p>}
            <p className="text-xs text-gray-500">
              Please enter your date of birth for verification purposes
            </p>
          </div>
        )
        
      case 'nationality':
        return (
          <div className="space-y-2">
            <Label htmlFor="nationality">{displayName}</Label>
            <Select value={value} onValueChange={(newValue) => updateField(fieldName, newValue)}>
              <SelectTrigger className={error ? "border-red-500" : ""}>
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
            {error && <p className="text-sm text-red-500">{error}</p>}
          </div>
        )
        
      case 'residingCountry':
        return (
          <div className="space-y-2">
            <Label htmlFor="residingCountry">{displayName}</Label>
            <Select value={value} onValueChange={(newValue) => updateField(fieldName, newValue)}>
              <SelectTrigger className={error ? "border-red-500" : ""}>
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
            {error && <p className="text-sm text-red-500">{error}</p>}
          </div>
        )
        
      default:
        return (
          <div className="space-y-2">
            <Label htmlFor={fieldName}>{displayName}</Label>
            <Input
              id={fieldName}
              type={fieldName === 'socialSecurityNumber' ? 'password' : 'text'}
              value={value}
              onChange={(e) => updateField(fieldName, e.target.value)}
              placeholder={placeholder}
              className={error ? "border-red-500" : ""}
              required
            />
            {error && <p className="text-sm text-red-500">{error}</p>}
            {fieldName === 'socialSecurityNumber' && (
              <p className="text-xs text-gray-500">
                Format: XXX-XX-XXXX (your Social Security Number)
              </p>
            )}
          </div>
        )
    }
  }

  // Group fields by category
  const personalFields = requiredFields.filter(field => field === 'dateOfBirth')
  const nationalityFields = requiredFields.filter(field => field === 'nationality')
  const identityFields = requiredFields.filter(field => field === 'identificationNumber')
  const residingCountryFields = requiredFields.filter(field => field === 'residingCountry')
  const countrySpecificFields = requiredFields.filter(field => ['socialSecurityNumber', 'street', 'zipcode', 'state'].includes(field))
  const generalFields = requiredFields.filter(field => field === 'city')

  // Check if sections should be shown
  const showIdentitySection = formData.nationality && identityFields.length > 0
  const showCountrySpecificSection = formData.residingCountry && (countrySpecificFields.length > 0 || generalFields.length > 0)

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Personal Information Section */}
      {personalFields.map(field => (
        <div key={field}>
          {renderField(field)}
        </div>
      ))}

      {/* Nationality Section */}
      {nationalityFields.map(field => (
        <div key={field} className={personalFields.length > 0 ? "pt-4 border-t" : ""}>
          {renderField(field)}
        </div>
      ))}

      {/* Identity Information Section */}
      {showIdentitySection && (
        <div className="space-y-4 pt-4 border-t">
          <h3 className="text-sm font-medium text-gray-900 flex items-center space-x-2">
            <span>🆔</span>
            <span>Identity Information</span>
          </h3>
          <p className="text-xs text-gray-600">
            Please provide your Georgian identification details
          </p>
          {identityFields.map(field => (
            <div key={field}>
              {renderField(field)}
            </div>
          ))}
        </div>
      )}

      {/* Residing Country Section */}
      {residingCountryFields.map(field => (
        <div key={field} className={nationalityFields.length > 0 || showIdentitySection ? "pt-4 border-t" : ""}>
          {renderField(field)}
        </div>
      ))}

      {/* Country-Specific Information Section */}
      {showCountrySpecificSection && (
        <div className="space-y-4 pt-4 border-t">
          <h3 className="text-sm font-medium text-gray-900 flex items-center space-x-2">
            <span>🇺🇸</span>
            <span>US Resident Information</span>
          </h3>
          <p className="text-xs text-gray-600">
            Please provide your US-specific information
          </p>
          {/* Country-specific fields like SSN and State */}
          {countrySpecificFields.map(field => (
            <div key={field}>
              {renderField(field)}
            </div>
          ))}
          {/* General fields like City */}
          {generalFields.map(field => (
            <div key={field}>
              {renderField(field)}
            </div>
          ))}
        </div>
      )}
      
      <div className="flex justify-between pt-4">
        <div className="text-sm text-gray-500">
          {requiredFields.length} field{requiredFields.length !== 1 ? 's' : ''} required
        </div>
        <Button type="submit" disabled={isSubmitting} className="min-w-[120px]">
          {isSubmitting ? "Saving..." : "Continue"}
        </Button>
      </div>
    </form>
  )
} 