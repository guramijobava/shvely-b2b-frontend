"use client"

import { SendVerificationForm } from "@/components/admin/verifications/SendVerificationForm"
import { ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function SendVerificationPage() {
  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center space-x-4">
        <Button variant="ghost" size="sm" asChild>
          <Link href="/admin/verifications">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Verifications
          </Link>
        </Button>
      </div>

      <div>
        <h1 className="text-3xl font-bold text-gray-900">Send New Verification</h1>
        <p className="text-muted-foreground">Create and send a new bank verification request to a customer.</p>
      </div>

      {/* Form */}
      <SendVerificationForm />
    </div>
  )
}
