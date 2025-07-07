// This file would contain borrower-specific API client logic.
// For now, we'll assume the main apiClient in lib/api.ts can be extended or used.
// If specific configurations or endpoints are needed only for the borrower flow,
// they would be defined here.

import { apiClient as mainApiClient } from "@/lib/api" // Assuming we extend the main client

export const borrowerApiClient = {
  validateToken: async (token: string) => {
    console.log(`[Mock API] Validating token: ${token}`)
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))
    
    if (token === "sfcu_2024_ajohnson") {
      return {
        valid: true,
        customerInfo: {
          fullName: "Amanda Johnson",
          email: "amanda.johnson@gmail.com",
          phoneNumber: "+1 (555) 456-7890",
          // dateOfBirth missing - will trigger customer info collection
          // nationality missing - will trigger customer info collection
          // identificationNumber missing - will trigger customer info collection
          // residingCountry missing - will trigger customer info collection
          // street missing - will trigger customer info collection
          // zipcode missing - will trigger customer info collection
          // socialSecurityNumber missing - will trigger customer info collection
          // state missing - will trigger customer info collection
          // city missing - will trigger customer info collection
        },
        bankName: "SpringFin Credit Union",
      }
    } else if (token === "valid-token") {
      return {
        valid: true,
        customerInfo: {
          fullName: "John Doe",
          email: "john.doe@example.com",
          phoneNumber: "+1 (555) 123-4567",
          nationality: "Georgian",
          identificationNumber: "01234567890",
          residingCountry: "United States",
          // socialSecurityNumber missing - will trigger customer info collection
        },
        bankName: "Demo Bank Inc.", // Added bankName for welcome message
      }
    } else if (token === "expired-token") {
      return { valid: false, error: "expired" }
    }
    return { valid: false, error: "invalid" }
  },

  initiateBankConnection: async (token: string, provider: "stripe" | "teller") => {
    console.log(`[Mock API] Initiating bank connection for token: ${token} with ${provider}`)
    await new Promise((resolve) => setTimeout(resolve, 1500))
    // In a real scenario, this would return a client secret or redirect URL for the SDK
    if (provider === "stripe") {
      return { success: true, clientSecret: "stripe_client_secret_mock" }
    }
    return { success: true, connectionUrl: "https://teller.io/connect/mock_url" }
  },

  recordConsent: async (token: string, consentData: any) => {
    console.log(`[Mock API] Recording consent for token: ${token}`, consentData)
    await new Promise((resolve) => setTimeout(resolve, 1000))
    return { success: true, message: "Consent recorded successfully." }
  },

  updateCustomerInfo: async (token: string, customerInfo: any) => {
    console.log(`[Mock API] Updating customer info for token: ${token}`, customerInfo)
    await new Promise((resolve) => setTimeout(resolve, 800))
    return {
      success: true,
      message: "Customer information updated successfully",
    }
  },

  completeVerification: async (token: string) => {
    console.log(`[Mock API] Completing verification for token: ${token}`)
    await new Promise((resolve) => setTimeout(resolve, 1000))
    return {
      success: true,
      message: "Verification completed.",
      completionDetails: {
        timestamp: new Date().toISOString(),
        connectedAccountsCount: 2,
      },
    }
  },

  getVerificationStatus: async (token: string) => {
    console.log(`[Mock API] Getting status for token: ${token}`)
    await new Promise((resolve) => setTimeout(resolve, 500))
    // This could return more detailed status if needed
    return { status: "in_progress" }
  },

  logAuditEvent: async (token: string | null, event: any) => {
    // In a real app, token might be null for initial page loads before validation
    console.log(`[Mock Audit Log] Token: ${token || "N/A"}`, event)
    // No actual API call for mock
    return Promise.resolve({ success: true })
  },

  // Example of using the main apiClient if needed for some shared endpoints
  // This is just illustrative.
  getSharedResource: async (id: string) => {
    return mainApiClient.getVerification(id) // Example
  },
}

// Extend main apiClient with borrower specific methods (if not creating a separate instance)
// This is one way to structure it. Another is to keep them separate.
// For this example, we'll assume borrowerApiClient is used directly.
