"use client"

import { useSearchParams, useRouter, useParams } from "next/navigation"
import { ErrorStateDisplay } from "@/components/borrower/ErrorStates"
import { Button } from "@/components/ui/button"
import { Home } from "lucide-react"

export default function VerificationErrorPage() {
  const router = useRouter()
  const params = useParams()
  const searchParams = useSearchParams()
  const errorType = searchParams.get("type") as any // Cast to ErrorStatesProps['errorType']
  const token = params.token as string

  const handleRetry = () => {
    // Determine where to retry to. If token related, maybe back to start.
    // For other errors, could be previous step.
    // For simplicity, redirecting to the start of the flow for the given token.
    if (token) {
      router.push(`/verify/${token}`)
    } else {
      router.push("/") // Fallback if no token
    }
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-200px)] py-10">
      <ErrorStateDisplay errorType={errorType || "unknown"} onRetry={handleRetry} />
      <Button variant="outline" onClick={() => router.push("/")} className="mt-8">
        <Home className="mr-2 h-4 w-4" /> Go to Homepage
      </Button>
    </div>
  )
}
