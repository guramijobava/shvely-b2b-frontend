"use client"

import type React from "react"
import { useEffect } from "react"
import { registerServiceWorker, handleInstallPrompt } from "@/lib/pwa-utils"
import Head from "next/head"

export function PWAWrapper({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    registerServiceWorker()

    const beforeInstallPromptHandler = (event: Event) => {
      // Type assertion needed as Event type doesn't have prompt/userChoice by default
      handleInstallPrompt(event as Event & { prompt: () => void; userChoice: Promise<{ outcome: string }> })
    }

    window.addEventListener("beforeinstallprompt", beforeInstallPromptHandler)

    return () => {
      window.removeEventListener("beforeinstallprompt", beforeInstallPromptHandler)
    }
  }, [])

  return (
    <>
      <Head>
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#000000" /> {/* Match manifest */}
        <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no, user-scalable=no" />
        {/* Add other PWA related meta tags if needed */}
      </Head>
      {children}
    </>
  )
}
