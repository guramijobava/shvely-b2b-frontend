"use client"

import { useState, useEffect, useCallback } from "react"
import { useRouter, useParams } from "next/navigation"
import { borrowerApiClient } from "@/lib/borrower-api"

interface ValidatedTokenInfo {
  fullName: string
  email: string
  bankName?: string
}

export function useTokenValidation() {
  const router = useRouter()
  const params = useParams()
  const token = params.token as string

  const [isValidating, setIsValidating] = useState(true)
  const [isValid, setIsValid] = useState(false)
  const [errorType, setErrorType] = useState<"invalid" | "expired" | "network" | null>(null)
  const [customerInfo, setCustomerInfo] = useState<ValidatedTokenInfo | null>(null)

  const validate = useCallback(async () => {
    if (!token) {
      setIsValidating(false)
      setErrorType("invalid")
      router.push(`/verify/${token}/error?type=invalid_token`)
      return
    }

    setIsValidating(true)
    setErrorType(null)
    try {
      const response = await borrowerApiClient.validateToken(token)
      if (response.valid && response.customerInfo) {
        setIsValid(true)
        setCustomerInfo(response.customerInfo)
      } else {
        setIsValid(false)
        const type = response.error === "expired" ? "expired" : "invalid"
        setErrorType(type)
        router.push(`/verify/${token}/error?type=${type}_token`)
      }
    } catch (e) {
      console.error("Token validation failed:", e)
      setIsValid(false)
      setErrorType("network")
      router.push(`/verify/${token}/error?type=network_error`)
    } finally {
      setIsValidating(false)
    }
  }, [token, router])

  useEffect(() => {
    validate()
  }, [validate])

  return { token, isValidating, isValid, errorType, customerInfo, refetchValidation: validate }
}
