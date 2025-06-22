"use client"

import Image from "next/image"

interface LogoBannerProps {
  bankName?: string | null
  className?: string
}

export function LogoBanner({ bankName, className = "" }: LogoBannerProps) {
  return (
    <div className={`flex items-center justify-center ${className}`}>
      <div className="flex items-center space-x-6">
        {/* Main App Logo */}
        <div className="flex-shrink-0">
          <Image 
            src="/logo.svg" 
            alt="Shvely" 
            width={120} 
            height={40} 
            className="h-8 w-auto"
          />
        </div>
        
        {/* Plus Icon */}
        <div className="flex-shrink-0 text-gray-400">
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            width="24" 
            height="24" 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="2" 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            className="lucide lucide-plus"
          >
            <path d="M5 12h14"/>
            <path d="M12 5v14"/>
          </svg>
        </div>
        
        {/* Bank Logo */}
        <div className="flex-shrink-0">
          <Image 
            src="/bank_logo_example.svg" 
            alt={bankName || "Bank"} 
            width={120} 
            height={40} 
            className="h-8 w-auto"
          />
        </div>
      </div>
    </div>
  )
} 