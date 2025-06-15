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

export const loginSchema = z.object({
  email: z.string().email("Valid email is required"),
  password: z.string().min(1, "Password is required"),
})

export type CreateVerificationFormData = z.infer<typeof createVerificationSchema>
export type LoginFormData = z.infer<typeof loginSchema>
