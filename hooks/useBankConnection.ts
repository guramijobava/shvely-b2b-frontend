"use client"

import { useState, useCallback } from "react"
import { borrowerApiClient } from "@/lib/borrower-api"
import { useToast } from "@/hooks/use-toast"

interface BankConnectionState {
  isConnecting: boolean
  connectionError: string | null
  connectedAccounts: Array<{ id: string; name: string; last4: string }>
  stripeClientSecret: string | null
  tellerConnectionUrl: string | null
}

export function useBankConnection(token: string) {
  const { toast } = useToast()
  const [state, setState] = useState<BankConnectionState>({
    isConnecting: false,
    connectionError: null,
    connectedAccounts: [],
    stripeClientSecret: null,
    tellerConnectionUrl: null,
  })

  const initiateConnection = useCallback(
    async (provider: "stripe" | "teller" = "stripe") => {
      setState((prev) => ({ ...prev, isConnecting: true, connectionError: null }))
      try {
        const response = await borrowerApiClient.initiateBankConnection(token, provider)
        if (response.success) {
          if (provider === "stripe" && response.clientSecret) {
            setState((prev) => ({ ...prev, stripeClientSecret: response.clientSecret, tellerConnectionUrl: null }))
            // Stripe SDK would be initialized here using the clientSecret
            toast({ title: "Stripe Ready", description: "Please connect your bank via Stripe." })
          } else if (provider === "teller" && response.connectionUrl) {
            setState((prev) => ({ ...prev, tellerConnectionUrl: response.connectionUrl, stripeClientSecret: null }))
            // Teller widget would be opened here using the connectionUrl
            toast({ title: "Teller Ready", description: "Please connect your bank via Teller." })
          } else {
            throw new Error("Invalid response from bank connection initiation.")
          }
        } else {
          throw new Error("Failed to initiate bank connection.")
        }
      } catch (error) {
        const message = error instanceof Error ? error.message : "Unknown bank connection error."
        setState((prev) => ({ ...prev, connectionError: message }))
        toast({ title: "Connection Error", description: message, variant: "destructive" })
        // Potentially try fallback
        if (provider === "stripe") {
          // Consider initiating Teller as fallback, or let user choose.
          // For now, just log.
          console.warn("Stripe connection failed, consider Teller fallback.")
        }
      } finally {
        setState((prev) => ({ ...prev, isConnecting: false }))
      }
    },
    [token, toast],
  )

  const handleConnectionSuccess = useCallback(
    (accounts: Array<{ id: string; name: string; last4: string }>) => {
      setState((prev) => ({
        ...prev,
        connectedAccounts: [...prev.connectedAccounts, ...accounts],
        connectionError: null,
        stripeClientSecret: null, // Clear secrets/URLs after use
        tellerConnectionUrl: null,
      }))
      toast({ title: "Bank Account Connected", description: `${accounts.length} account(s) successfully connected.` })
    },
    [toast],
  )

  const handleConnectionFailure = useCallback(
    (errorMessage: string) => {
      setState((prev) => ({ ...prev, connectionError: errorMessage }))
      toast({ title: "Bank Connection Failed", description: errorMessage, variant: "destructive" })
    },
    [toast],
  )

  return {
    ...state,
    initiateConnection,
    handleConnectionSuccess,
    handleConnectionFailure,
  }
}
