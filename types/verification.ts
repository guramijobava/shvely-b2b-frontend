export interface VerificationRequest {
  id: string
  customerId?: string // Available when verification is completed
  customerInfo: {
    fullName: string
    email: string
    phoneNumber: string
    dateOfBirth?: string          // Date of birth, null = need to collect
    nationality?: string           // "Georgian", null = need to collect
    identificationNumber?: string  // Georgian ID, null = need to collect  
    residingCountry?: string      // "United States", null = need to collect
    street?: string               // Street address, null = need to collect
    zipcode?: string              // Zipcode/postal code, null = need to collect
    socialSecurityNumber?: string // US SSN, null = need to collect
    state?: string                // US State, null = need to collect
    city?: string                 // US City, null = need to collect
  }
  settings: {
    expirationDays: number
    sendMethod: "email" | "sms" | "both"
    includeReminders: boolean
    agentNotes?: string
  }
  status: "pending" | "sent" | "in_progress" | "completed" | "expired" | "failed"
  timeline: {
    createdAt: string
    sentAt?: string
    customerStartedAt?: string
    bankConnectedAt?: string
    completedAt?: string
    expiresAt: string
  }
  verificationLink: string
  verificationToken: string
  createdBy: string
  connectedAccounts: number
  attempts: number
  lastActivity?: string
}

export interface CreateVerificationRequest {
  customerInfo: {
    fullName: string
    email: string
    phoneNumber?: string
    dateOfBirth?: string          // Date of birth, null = need to collect
    nationality?: string           // "Georgian", null = need to collect
    identificationNumber?: string  // Georgian ID, null = need to collect  
    residingCountry?: string      // "United States", null = need to collect
    street?: string               // Street address, null = need to collect
    zipcode?: string              // Zipcode/postal code, null = need to collect
    socialSecurityNumber?: string // US SSN, null = need to collect
    state?: string                // US State, null = need to collect
    city?: string                 // US City, null = need to collect
  }
  settings: {
    expirationDays: number
    sendMethod: "email" | "sms" | "both"
    includeReminders: boolean
    agentNotes?: string
  }
}
