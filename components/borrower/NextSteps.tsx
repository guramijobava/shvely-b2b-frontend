"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { HelpCircle, Clock, Mail, Phone } from "lucide-react"
import Link from "next/link"

interface NextStepsProps {
  bankName?: string | null
  supportEmail?: string
  supportPhone?: string
}

export function NextSteps({
  bankName,
  supportEmail = "support@examplebank.com",
  supportPhone = "1-800-123-4567",
}: NextStepsProps) {
  return (
    <Card className="w-full mt-8">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <HelpCircle className="h-6 w-6" />
          <span>What Happens Next?</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <div className="flex items-start space-x-3">
            <Clock className="h-5 w-5 text-primary mt-1 flex-shrink-0" />
            <div>
              <h4 className="font-semibold">Review Process</h4>
              <p className="text-sm text-muted-foreground">
                {bankName || "Your financial institution"} will review the verified information. This typically takes
                1-2 business days, but may vary.
              </p>
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex items-start space-x-3">
            <Mail className="h-5 w-5 text-primary mt-1 flex-shrink-0" />
            <div>
              <h4 className="font-semibold">Communication</h4>
              <p className="text-sm text-muted-foreground">
                You will be contacted via email or phone regarding the status of your request once the review is
                complete.
              </p>
            </div>
          </div>
        </div>

        <div className="p-4 bg-gray-50 rounded-lg">
          <h4 className="font-semibold mb-2">Questions or Concerns?</h4>
          <p className="text-sm text-muted-foreground mb-1">
            If you have any questions, please contact {bankName || "your financial institution"}'s support team:
          </p>
          <div className="flex items-center space-x-2 text-sm">
            <Mail className="h-4 w-4" />
            <a href={`mailto:${supportEmail}`} className="hover:underline">
              {supportEmail}
            </a>
          </div>
          <div className="flex items-center space-x-2 text-sm">
            <Phone className="h-4 w-4" />
            <a href={`tel:${supportPhone}`} className="hover:underline">
              {supportPhone}
            </a>
          </div>
        </div>

        <p className="text-sm text-center text-muted-foreground pt-4 border-t">
          You can now safely close this window. Your information has been submitted.
        </p>
        <p className="text-xs text-center text-muted-foreground">
          For more details, visit our{" "}
          <Link href="/faq" className="underline hover:text-primary">
            FAQ page
          </Link>
          .
        </p>
      </CardContent>
    </Card>
  )
}
