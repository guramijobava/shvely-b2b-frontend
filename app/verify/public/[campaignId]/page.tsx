"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { CampaignRegistrationForm } from "@/components/borrower/CampaignRegistrationForm"
import { LoadingSpinner } from "@/components/shared/LoadingSpinner"
import { ErrorStateDisplay } from "@/components/borrower/ErrorStates"
import { borrowerApiClient } from "@/lib/borrower-api"

interface Campaign {
  id: string
  publicId: string
  name: string
  description: string
  country: string
  status: "active" | "paused" | "completed"
  branding: {
    bankName: string
    primaryColor: string
    secondaryColor: string
    logo: string
    fontFamily: string
  }
}

export default function PublicCampaignPage() {
  const params = useParams()
  const router = useRouter()
  const [campaign, setCampaign] = useState<Campaign | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const campaignId = params.campaignId as string

  useEffect(() => {
    const fetchCampaign = async () => {
      try {
        const campaignData = await borrowerApiClient.getCampaign(campaignId)
        
        if (campaignData.status !== "active") {
          setError("Campaign is not active")
          return
        }

        // Type cast the API response to match our Campaign interface
        setCampaign(campaignData as Campaign)
      } catch (err) {
        console.error("Failed to load campaign:", err)
        setError("Campaign not found or is no longer available")
      } finally {
        setLoading(false)
      }
    }

    fetchCampaign()
  }, [campaignId])

  const handleRegistrationSubmit = async (data: {
    firstName: string
    lastName: string
    email: string
  }) => {
    try {
      // Submit campaign registration and create verification
      await borrowerApiClient.submitCampaignRegistration({
        campaignId,
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email
      })
      
      // Redirect to email sent confirmation
      router.push(`/verify/public/${campaignId}/email-sent?email=${encodeURIComponent(data.email)}`)
    } catch (error) {
      console.error("Campaign registration failed:", error)
      throw error
    }
  }

  // Apply campaign branding
  useEffect(() => {
    if (campaign?.branding) {
      const root = document.documentElement
      root.style.setProperty('--campaign-primary', campaign.branding.primaryColor)
      root.style.setProperty('--campaign-secondary', campaign.branding.secondaryColor)
      root.style.setProperty('--campaign-font', campaign.branding.fontFamily)
    }
  }, [campaign])

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-200px)] text-center">
        <LoadingSpinner size="lg" className="mb-4" />
        <p className="text-lg font-medium">Loading campaign...</p>
        <p className="text-muted-foreground">Please wait a moment.</p>
      </div>
    )
  }

  if (error || !campaign) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-200px)]">
        <ErrorStateDisplay 
          errorType="invalid_token" 
          onRetry={() => window.location.reload()} 
        />
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <CampaignRegistrationForm
        bankName={campaign.branding.bankName}
        bankLogo={campaign.branding.logo}
        onSubmit={handleRegistrationSubmit}
      />
    </div>
  )
} 