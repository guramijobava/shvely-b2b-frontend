"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { LoadingSpinner } from "@/components/shared/LoadingSpinner"
import { Eye, EyeOff, Building2, CheckCircle, AlertCircle } from "lucide-react"
import Image from "next/image"

interface DemoBankCredentialsModalProps {
  isOpen: boolean
  onClose: () => void
  bankName: string
  bankId: string
  onSuccess: (accountData: MockAccountData) => void
}

interface MockAccountData {
  accountId: string
  bankName: string
  accountType: string
  accountNumber: string
  balance: string
  connectedAt: string
}

export function DemoBankCredentialsModal({ 
  isOpen, 
  onClose, 
  bankName, 
  bankId,
  onSuccess 
}: DemoBankCredentialsModalProps) {
  
  // Get the appropriate bank logo
  const getBankLogo = (bankId: string) => {
    switch (bankId) {
      case "chase":
        return "/bank-logo-chase.svg"
      case "boa":
        return "/bank-logo-america.svg"
      case "wells":
        return "/bank-logo-wf.svg"
      case "citi":
        return "/bank-logo-citi.svg"
      default:
        return "/placeholder.svg?height=40&width=100"
    }
  }
  const [credentials, setCredentials] = useState({
    username: "",
    password: ""
  })
  const [showPassword, setShowPassword] = useState(false)
  const [isConnecting, setIsConnecting] = useState(false)
  const [connectionStep, setConnectionStep] = useState<"form" | "connecting" | "success" | "error">("form")
  const [errorMessage, setErrorMessage] = useState("")
  const [accountData, setAccountData] = useState<MockAccountData | null>(null)

  const handleInputChange = (field: string, value: string) => {
    setCredentials(prev => ({ ...prev, [field]: value }))
  }

  const simulateConnection = async () => {
    setIsConnecting(true)
    setConnectionStep("connecting")
    setErrorMessage("")

    try {
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 2500))

      // Mock validation - fail if password is "wrong"
      if (credentials.password.toLowerCase() === "wrong") {
        throw new Error("Invalid credentials. Please check your username and password.")
      }

      // Mock account data
      const mockAccount: MockAccountData = {
        accountId: `acc_${bankId}_${Date.now()}`,
        bankName: bankName,
        accountType: "Checking",
        accountNumber: `****${Math.floor(Math.random() * 9000) + 1000}`,
        balance: `$${(Math.random() * 50000 + 1000).toLocaleString("en-US", { minimumFractionDigits: 2 })}`,
        connectedAt: new Date().toISOString()
      }

      setAccountData(mockAccount)
      setConnectionStep("success")

      // Auto-close after showing success
      setTimeout(() => {
        onSuccess(mockAccount)
        handleClose()
      }, 2000)

    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "Connection failed. Please try again.")
      setConnectionStep("error")
    } finally {
      setIsConnecting(false)
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (credentials.username && credentials.password) {
      simulateConnection()
    }
  }

  const handleClose = () => {
    setCredentials({ username: "", password: "" })
    setConnectionStep("form")
    setErrorMessage("")
    setAccountData(null)
    setIsConnecting(false)
    onClose()
  }

  const handleTryAgain = () => {
    setConnectionStep("form")
    setErrorMessage("")
  }

  const isFormValid = credentials.username.length > 0 && credentials.password.length > 0

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-center space-y-3">
            <div className="flex justify-center">
              <div className="p-3 bg-white rounded-lg border">
                <Image 
                  src={getBankLogo(bankId)} 
                  alt={`${bankName} logo`} 
                  width={80} 
                  height={32} 
                  className="h-8 w-auto"
                />
              </div>
            </div>
            <div>
              <span>Connect to {bankName}</span>
              <p className="text-sm font-normal text-muted-foreground mt-1">
                Enter your online banking credentials
              </p>
            </div>
          </DialogTitle>
        </DialogHeader>

        {connectionStep === "form" && (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="username">Username or Email</Label>
                <Input
                  id="username"
                  type="text"
                  value={credentials.username}
                  onChange={(e) => handleInputChange("username", e.target.value)}
                  placeholder="Enter your username or email"
                  disabled={isConnecting}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={credentials.password}
                    onChange={(e) => handleInputChange("password", e.target.value)}
                    placeholder="Enter your password"
                    disabled={isConnecting}
                    className="pr-10"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => setShowPassword(!showPassword)}
                    disabled={isConnecting}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4 text-muted-foreground" />
                    ) : (
                      <Eye className="h-4 w-4 text-muted-foreground" />
                    )}
                  </Button>
                </div>
              </div>
            </div>

            <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
              <div className="flex items-start space-x-2">
                <Building2 className="h-4 w-4 text-green-600 mt-0.5" />
                <div className="text-xs text-green-800">
                  <p className="font-medium">Secure Connection</p>
                  <p>Your login credentials are encrypted and protected</p>
                </div>
              </div>
            </div>

            <div className="flex space-x-3">
              <Button
                type="button"
                variant="outline"
                onClick={handleClose}
                disabled={isConnecting}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={!isFormValid || isConnecting}
                className="flex-1"
              >
                Connect Account
              </Button>
            </div>
          </form>
        )}

        {connectionStep === "connecting" && (
          <div className="py-8 text-center space-y-4">
            <LoadingSpinner size="lg" className="mx-auto" />
            <div>
              <h3 className="font-medium">Connecting to {bankName}</h3>
              <p className="text-sm text-muted-foreground mt-1">
                Securely authenticating your credentials...
              </p>
            </div>
          </div>
        )}

        {connectionStep === "success" && accountData && (
          <div className="py-6 text-center space-y-4">
            <div className="mx-auto w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
              <CheckCircle className="h-6 w-6 text-green-600" />
            </div>
            <div>
              <h3 className="font-medium text-green-900">Account Connected Successfully!</h3>
              <p className="text-sm text-muted-foreground mt-1">
                Your {bankName} account has been securely connected
              </p>
            </div>
            <div className="p-4 bg-green-50 border border-green-200 rounded-lg text-left">
              <h4 className="font-medium text-green-900 mb-2">Connected Account</h4>
              <div className="space-y-1 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Bank:</span>
                  <span>{accountData.bankName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Type:</span>
                  <span>{accountData.accountType}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Account:</span>
                  <span>{accountData.accountNumber}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Balance:</span>
                  <span className="font-medium">{accountData.balance}</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {connectionStep === "error" && (
          <div className="py-6 space-y-4">
            <div className="text-center">
              <div className="mx-auto w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                <AlertCircle className="h-6 w-6 text-red-600" />
              </div>
              <h3 className="font-medium text-red-900 mt-4">Connection Failed</h3>
            </div>
            
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{errorMessage}</AlertDescription>
            </Alert>

            <div className="flex space-x-3">
              <Button
                type="button"
                variant="outline"
                onClick={handleClose}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                onClick={handleTryAgain}
                className="flex-1"
              >
                Try Again
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
} 