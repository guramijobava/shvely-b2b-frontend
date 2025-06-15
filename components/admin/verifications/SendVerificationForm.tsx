"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useRouter } from "next/navigation"
import { createVerificationSchema, type CreateVerificationFormData } from "@/lib/validations"
import { useVerifications } from "@/hooks/useVerifications"
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
import { AlertCircle, User, Settings, Send } from "lucide-react"

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
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="fullName">
              Full Name <span className="text-red-500">*</span>
            </Label>
            <Input
              id="fullName"
              placeholder="Enter customer's full name"
              {...register("customerInfo.fullName")}
              disabled={isSubmitting}
            />
            {errors.customerInfo?.fullName && (
              <p className="text-sm text-red-600">{errors.customerInfo.fullName.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">
              Email Address <span className="text-red-500">*</span>
            </Label>
            <Input
              id="email"
              type="email"
              placeholder="Enter customer's email address"
              {...register("customerInfo.email")}
              disabled={isSubmitting}
            />
            {errors.customerInfo?.email && <p className="text-sm text-red-600">{errors.customerInfo.email.message}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="phoneNumber">
              Phone Number <span className="text-red-500">*</span>
            </Label>
            <Input
              id="phoneNumber"
              type="tel"
              placeholder="Enter customer's phone number"
              {...register("customerInfo.phoneNumber")}
              disabled={isSubmitting}
            />
            {errors.customerInfo?.phoneNumber && (
              <p className="text-sm text-red-600">{errors.customerInfo.phoneNumber.message}</p>
            )}
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
