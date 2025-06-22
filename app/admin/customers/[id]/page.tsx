"use client"

import { useEffect } from "react"
import { useParams, useRouter } from "next/navigation"

export default function CustomerOverviewPage() {
  const params = useParams()
  const router = useRouter()
  const customerId = params.id as string

  useEffect(() => {
    // Redirect to accounts tab since Overview tab has been removed
    router.replace(`/admin/customers/${customerId}/accounts`)
  }, [customerId, router])

  return null
}
