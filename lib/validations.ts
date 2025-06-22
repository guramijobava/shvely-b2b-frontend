import { z } from "zod"

export const createVerificationSchema = z.object({
  customerInfo: z.object({
    fullName: z.string().min(1, "Full name is required"),
    email: z.string().email("Valid email is required"),
    phoneNumber: z.string().min(10, "Valid phone number is required"),
  }),
  settings: z.object({
    expirationDays: z.number().min(1).max(30),
    sendMethod: z.enum(["email", "sms", "both"]),
    includeReminders: z.boolean(),
    agentNotes: z.string().optional(),
  }),
})

// Bulk verification schema for validating CSV data
export const bulkVerificationRowSchema = z.object({
  fullName: z.string().min(1, "Full name is required"),
  email: z.string().email("Valid email is required"),
  phoneNumber: z.string().min(10, "Valid phone number is required"),
  expirationDays: z.number().min(1).max(30).default(7),
  sendMethod: z.enum(["email", "sms", "both"]).default("email"),
  agentNotes: z.string().optional(),
})

export const bulkVerificationSchema = z.object({
  verifications: z.array(bulkVerificationRowSchema).min(1, "At least one verification is required"),
})

export const loginSchema = z.object({
  email: z.string().email("Valid email is required"),
  password: z.string().min(1, "Password is required"),
})

export type CreateVerificationFormData = z.infer<typeof createVerificationSchema>
export type BulkVerificationRowData = z.infer<typeof bulkVerificationRowSchema>
export type BulkVerificationFormData = z.infer<typeof bulkVerificationSchema>
export type LoginFormData = z.infer<typeof loginSchema>
