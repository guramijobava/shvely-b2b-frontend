export interface VerificationRequest {
  id: string
  customerInfo: {
    fullName: string
    email: string
    phoneNumber: string
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
    phoneNumber: string
  }
  settings: {
    expirationDays: number
    sendMethod: "email" | "sms" | "both"
    includeReminders: boolean
    agentNotes?: string
  }
}
