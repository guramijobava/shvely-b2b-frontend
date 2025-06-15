"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Download, FileText, Mail } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface DownloadConfirmationProps {
  verificationId: string
  customerEmail?: string | null
}

export function DownloadConfirmation({ verificationId, customerEmail }: DownloadConfirmationProps) {
  const { toast } = useToast()

  const handleDownload = (type: "certificate" | "summary" | "privacy") => {
    // Placeholder for PDF generation and download
    console.log(`Downloading ${type} for verification ${verificationId}`)
    toast({
      title: "Download Started",
      description: `Your ${type} document is being prepared.`,
    })
    // Simulate download
    setTimeout(() => {
      const blob = new Blob([`Mock ${type} document for ${verificationId}`], { type: "application/pdf" })
      const url = URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = `${type}_${verificationId}.pdf`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
    }, 1500)
  }

  const handleEmailCopy = () => {
    console.log(`Emailing copy for verification ${verificationId} to ${customerEmail}`)
    toast({
      title: "Email Sent",
      description: `A copy of your verification summary has been sent to ${customerEmail}.`,
    })
  }

  return (
    <Card className="w-full mt-8">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Download className="h-6 w-6" />
          <span>Download Your Records</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm text-muted-foreground">
          For your records, you can download a summary of your verification.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Button variant="outline" onClick={() => handleDownload("certificate")}>
            <FileText className="h-4 w-4 mr-2" />
            Completion Certificate
          </Button>
          <Button variant="outline" onClick={() => handleDownload("summary")}>
            <FileText className="h-4 w-4 mr-2" />
            Connected Accounts Summary
          </Button>
          <Button variant="outline" onClick={() => handleDownload("privacy")}>
            <FileText className="h-4 w-4 mr-2" />
            Privacy Policy & Terms
          </Button>
          {customerEmail && (
            <Button variant="outline" onClick={handleEmailCopy}>
              <Mail className="h-4 w-4 mr-2" />
              Email Me a Copy
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
