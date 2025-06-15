"use client"
import type React from "react"
import { useEffect } from "react"
import { usePathname, useParams } from "next/navigation"
import { borrowerApiClient } from "@/lib/borrower-api"

interface AuditEvent {
  type:
    | "page_view"
    | "action"
    | "error"
    | "consent_change"
    | "connection_attempt"
    | "connection_success"
    | "connection_failure"
  timestamp: string
  details: Record<string, any>
  path?: string
}

export function AuditLogger({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const params = useParams()
  const token = params.token as string | undefined

  const logEvent = (event: Omit<AuditEvent, "timestamp" | "path">) => {
    const fullEvent: AuditEvent = {
      ...event,
      timestamp: new Date().toISOString(),
      path: pathname,
    }
    // In a real app, batch these and send to backend
    borrowerApiClient.logAuditEvent(token || null, fullEvent).catch((err) => {
      console.warn("Failed to log audit event:", err) // Non-critical, so just warn
    })
  }

  useEffect(() => {
    // Log page view on path change
    logEvent({ type: "page_view", details: { pageTitle: document.title } })
  }, [pathname]) // eslint-disable-line react-hooks/exhaustive-deps
  // pathname is sufficient, logEvent is stable due to useCallback in a real hook

  // Provide a way for children to log events (e.g., via context)
  // For simplicity here, we're just doing page views.
  // A more robust solution would use React Context to provide `logEvent` to children.

  return <>{children}</>
}

// Example of how to use it if context was provided:
// const { logEvent } = useAudit();
// logEvent({ type: 'action', details: { actionName: 'submit_form' } });
