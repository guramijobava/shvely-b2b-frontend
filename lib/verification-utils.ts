/**
 * Utility functions for verification customer info logic
 */

// Customer info field names that can be missing
export type CustomerInfoField = 'dateOfBirth' | 'nationality' | 'identificationNumber' | 'residingCountry' | 'street' | 'zipcode' | 'socialSecurityNumber' | 'state' | 'city'

// Interface for customer info (matches the customerInfo from types)
export interface CustomerInfo {
  fullName: string
  email: string
  phoneNumber: string
  dateOfBirth?: string
  nationality?: string
  identificationNumber?: string
  residingCountry?: string
  street?: string
  zipcode?: string
  socialSecurityNumber?: string
  state?: string
  city?: string
}

/**
 * Get list of required customer info fields that are missing (null/undefined)
 */
export const getRequiredCustomerInfoFields = (customerInfo: CustomerInfo): CustomerInfoField[] => {
  const missingFields: CustomerInfoField[] = []
  
  if (!customerInfo.dateOfBirth) missingFields.push('dateOfBirth')
  if (!customerInfo.nationality) missingFields.push('nationality')
  if (!customerInfo.identificationNumber) missingFields.push('identificationNumber')
  if (!customerInfo.residingCountry) missingFields.push('residingCountry')
  if (!customerInfo.street) missingFields.push('street')
  if (!customerInfo.zipcode) missingFields.push('zipcode')
  if (!customerInfo.socialSecurityNumber) missingFields.push('socialSecurityNumber')
  if (!customerInfo.state) missingFields.push('state')
  if (!customerInfo.city) missingFields.push('city')
  
  return missingFields
}

/**
 * Check if customer info collection is required (any fields are missing)
 */
export const requiresCustomerInfoCollection = (customerInfo: CustomerInfo): boolean => {
  return getRequiredCustomerInfoFields(customerInfo).length > 0
}

/**
 * Get display name for customer info fields
 */
export const getFieldDisplayName = (fieldName: CustomerInfoField): string => {
  const displayNames: Record<CustomerInfoField, string> = {
    dateOfBirth: 'Date of Birth',
    nationality: 'Nationality',
    identificationNumber: 'Identification Number',
    residingCountry: 'Residing Country',
    street: 'Street Address',
    zipcode: 'Zipcode',
    socialSecurityNumber: 'Social Security Number',
    state: 'State',
    city: 'City'
  }
  return displayNames[fieldName] || fieldName
}

/**
 * Get placeholder text for customer info fields
 */
export const getFieldPlaceholder = (fieldName: CustomerInfoField): string => {
  const placeholders: Record<CustomerInfoField, string> = {
    dateOfBirth: 'MM/DD/YYYY',
    nationality: 'e.g., Georgian',
    identificationNumber: 'Georgian ID number',
    residingCountry: 'e.g., United States',
    street: 'e.g., 123 Main Street',
    zipcode: 'e.g., 12345',
    socialSecurityNumber: 'XXX-XX-XXXX',
    state: 'e.g., California',
    city: 'e.g., San Francisco'
  }
  return placeholders[fieldName] || `Enter your ${getFieldDisplayName(fieldName).toLowerCase()}`
}

/**
 * Get default values for customer info fields (used in admin forms)
 */
export const getDefaultFieldValue = (fieldName: CustomerInfoField): string => {
  const defaults: Record<CustomerInfoField, string> = {
    dateOfBirth: '',
    nationality: 'Georgian',        // Default for Georgian bank
    identificationNumber: '',
    residingCountry: 'United States', // Default for US residents
    street: '',
    zipcode: '',
    socialSecurityNumber: '',
    state: '',
    city: ''
  }
  return defaults[fieldName] || ''
}

/**
 * Validate a customer info field value
 */
export const validateCustomerInfoField = (fieldName: CustomerInfoField, value: string): { isValid: boolean; error?: string } => {
  if (!value || value.trim() === '') {
    return { isValid: false, error: `${getFieldDisplayName(fieldName)} is required` }
  }

  switch (fieldName) {
    case 'dateOfBirth':
      // Basic date validation (MM/DD/YYYY or MM-DD-YYYY)
      const dateRegex = /^(0[1-9]|1[0-2])[\/\-](0[1-9]|[12]\d|3[01])[\/\-](19|20)\d{2}$/
      if (!dateRegex.test(value)) {
        return { isValid: false, error: 'Invalid date format. Use MM/DD/YYYY' }
      }
      
      // Check if date is not in the future
      const inputDate = new Date(value)
      const today = new Date()
      if (inputDate > today) {
        return { isValid: false, error: 'Date of birth cannot be in the future' }
      }
      
      // Check if person is at least 18 years old
      const eighteenYearsAgo = new Date()
      eighteenYearsAgo.setFullYear(today.getFullYear() - 18)
      if (inputDate > eighteenYearsAgo) {
        return { isValid: false, error: 'Must be at least 18 years old' }
      }
      break
      
    case 'socialSecurityNumber':
      // Basic SSN format validation (XXX-XX-XXXX or XXXXXXXXX)
      const ssnRegex = /^\d{3}-?\d{2}-?\d{4}$/
      if (!ssnRegex.test(value.replace(/\s/g, ''))) {
        return { isValid: false, error: 'Invalid Social Security Number format' }
      }
      break
    
    case 'identificationNumber':
      // Basic ID number validation (at least 5 characters)
      if (value.length < 5) {
        return { isValid: false, error: 'Identification number must be at least 5 characters' }
      }
      break
      
    case 'zipcode':
      // Basic US zipcode validation (5 digits or 5+4 format)
      const zipcodeRegex = /^\d{5}(-\d{4})?$/
      if (!zipcodeRegex.test(value)) {
        return { isValid: false, error: 'Invalid zipcode format. Use 12345 or 12345-6789' }
      }
      break
  }

  return { isValid: true }
}

/**
 * Format customer info field for display (mask sensitive fields)
 */
export const formatCustomerInfoFieldForDisplay = (fieldName: CustomerInfoField, value: string): string => {
  if (!value) return 'Not provided'

  switch (fieldName) {
    case 'dateOfBirth':
      // Format date consistently
      try {
        const date = new Date(value)
        return date.toLocaleDateString('en-US', { 
          year: 'numeric', 
          month: '2-digit', 
          day: '2-digit' 
        })
      } catch {
        return value // Return original if parsing fails
      }
      
    case 'socialSecurityNumber':
      // Mask all but last 4 digits
      return value.length >= 4 ? `XXX-XX-${value.slice(-4)}` : 'XXX-XX-XXXX'
    
    case 'identificationNumber':
      // Mask all but last 4 characters
      return value.length >= 4 ? `•••••${value.slice(-4)}` : value
    
    default:
      return value
  }
}

/**
 * Check if all required customer info is complete
 */
export const isCustomerInfoComplete = (customerInfo: CustomerInfo): boolean => {
  return getRequiredCustomerInfoFields(customerInfo).length === 0
} 