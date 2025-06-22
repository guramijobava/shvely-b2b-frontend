"use client"

import type React from "react"
import { ErrorBoundary } from "@/components/shared/ErrorBoundary"
import { PWAWrapper } from "@/components/borrower/PWAWrapper"
import { AuditLogger } from "@/components/borrower/AuditLogger"
import { LogoBanner } from "@/components/borrower/LogoBanner"
import { Toaster } from "@/components/ui/toaster"

export default function BorrowerVerificationLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <PWAWrapper>
      <AuditLogger>
        <div className="min-h-screen bg-gray-50 flex flex-col">
          <header className="py-4 px-6 bg-white shadow-sm">
            <LogoBanner bankName="Demo Bank" className="py-0" />
          </header>
          <main className="flex-grow container mx-auto px-4 py-8 max-w-2xl">
            <ErrorBoundary
              fallback={
                <div className="text-center py-10">
                  <h2 className="text-xl font-semibold text-red-600">An Unexpected Error Occurred</h2>
                  <p className="text-muted-foreground">
                    Please try refreshing the page or contact support if the problem persists.
                  </p>
                </div>
              }
            >
              {children}
            </ErrorBoundary>
          </main>
          <footer className="py-6 text-center text-sm text-muted-foreground">
            © {new Date().getFullYear()} Shvely. All rights reserved.
            <br />
            <a href="/privacy-policy" className="hover:underline">
              Privacy Policy
            </a>{" "}
            |{" "}
            <a href="/terms-of-service" className="hover:underline">
              Terms of Service
            </a>
          </footer>
          <Toaster />
        </div>
      </AuditLogger>
    </PWAWrapper>
  )
}
