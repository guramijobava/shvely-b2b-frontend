import type {
  ApiResponse,
  PaginatedResponse,
  LoginRequest,
  LoginResponse,
  VerificationRequest,
  CreateVerificationRequest,
  CustomerFinancialProfile,
  Transaction,
  User,
} from "@/lib/types"

class ApiClient {
  private baseUrl: string
  private token: string | null = null

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl
  }

  setToken(token: string) {
    this.token = token
  }

  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<ApiResponse<T>> {
    // Always use mock data in development (client-side check)
    const isDevelopment = !process.env.NEXT_PUBLIC_API_URL || process.env.NEXT_PUBLIC_API_URL.includes("localhost")

    if (isDevelopment) {
      return this.getMockResponse<T>(endpoint, options.method, options.body)
    }

    const url = `${this.baseUrl}${endpoint}`
    const headers = {
      "Content-Type": "application/json",
      ...(this.token && { Authorization: `Bearer ${this.token}` }),
      ...options.headers,
    }

    try {
      const response = await fetch(url, {
        ...options,
        headers,
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.message || "API request failed")
      }

      return response.json()
    } catch (error) {
      throw error
    }
  }

  private async getMockResponse<T>(endpoint: string, method?: string, body?: BodyInit | null): Promise<ApiResponse<T>> {
    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 800))

    console.log("Mock API call:", endpoint, method)

    // Mock login response
    if (endpoint === "/auth/login" && method === "POST") {
      return {
        data: {
          user: {
            id: "1",
            email: "admin@example.com",
            name: "Admin User",
            role: "admin",
            permissions: [
              {
                resource: "verifications",
                actions: ["create", "read", "update", "delete"],
              },
              {
                resource: "customers",
                actions: ["create", "read", "update", "delete"],
              },
              {
                resource: "reports",
                actions: ["read"],
              },
              {
                resource: "settings",
                actions: ["read", "update"],
              },
            ],
            isActive: true,
            lastLogin: new Date().toISOString(),
          },
          token: "mock-jwt-token-" + Date.now(),
          expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
        } as T,
        success: true,
        message: "Login successful",
      }
    }

    // Mock current user response
    if (endpoint === "/auth/me") {
      return {
        data: {
          id: "1",
          email: "admin@example.com",
          name: "Admin User",
          role: "admin",
          permissions: [
            {
              resource: "verifications",
              actions: ["create", "read", "update", "delete"],
            },
            {
              resource: "customers",
              actions: ["create", "read", "update", "delete"],
            },
            {
              resource: "reports",
              actions: ["read"],
            },
            {
              resource: "settings",
              actions: ["read", "update"],
            },
          ],
          isActive: true,
          lastLogin: new Date().toISOString(),
        } as T,
        success: true,
      }
    }

    // Mock logout response
    if (endpoint === "/auth/logout" && method === "POST") {
      return {
        data: {} as T,
        success: true,
        message: "Logged out successfully",
      }
    }

    // SpringFin Credit Union - March 2024 Verifications
    // Realistic mix of mortgage, auto, business, and personal loan verifications
    if (endpoint.startsWith("/verifications") && !endpoint.includes("/verifications/")) {
      const mockVerifications: VerificationRequest[] = [
        {
          id: "ver_jennifer_martinez",
          customerInfo: {
            fullName: "Jennifer Martinez",
            email: "jennifer.martinez@email.com",
            phoneNumber: "+1 (555) 234-5678",
            nationality: "Georgian",
            identificationNumber: "01234567890",
            residingCountry: "United States",
            socialSecurityNumber: "123-45-6789",
          },
          settings: {
            expirationDays: 7,
            sendMethod: "email",
            includeReminders: true,
            agentNotes: "Mortgage pre-approval - Spring home buying season. Priority customer.",
          },
          status: "completed",
          timeline: {
            createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
            sentAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000 + 5 * 60 * 1000).toISOString(),
            customerStartedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000 - 2 * 60 * 60 * 1000).toISOString(),
            bankConnectedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000 - 1 * 60 * 60 * 1000).toISOString(),
            completedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
            expiresAt: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(),
          },
          verificationLink: "https://verify.springfincu.com/jennifer_martinez",
          verificationToken: "sfcu_2024_jmartinez",
          createdBy: "loan.officer@springfincu.com",
          connectedAccounts: 2,
          attempts: 1,
          lastActivity: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
        },
        {
          id: "ver_robert_chen",
          customerInfo: {
            fullName: "Robert Chen",
            email: "robert.chen@techcorp.com",
            phoneNumber: "+1 (555) 345-6789",
          },
          settings: {
            expirationDays: 5,
            sendMethod: "both", 
            includeReminders: true,
            agentNotes: "Auto loan verification - New Tesla Model Y purchase. Tech professional.",
          },
          status: "completed",
          timeline: {
            createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
            sentAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000 + 3 * 60 * 1000).toISOString(),
            customerStartedAt: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString(),
            bankConnectedAt: new Date(Date.now() - 7 * 60 * 60 * 1000).toISOString(),
            completedAt: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
            expiresAt: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000).toISOString(),
          },
          verificationLink: "https://verify.springfincu.com/robert_chen", 
          verificationToken: "sfcu_2024_rchen",
          createdBy: "auto.loans@springfincu.com",
          connectedAccounts: 3,
          attempts: 1,
          lastActivity: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
        },
        {
          id: "ver_amanda_johnson",
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
          settings: {
            expirationDays: 7,
            sendMethod: "email",
            includeReminders: true,
            agentNotes: "New checking account with direct deposit setup. First-time member.",
          },
          status: "in_progress",
          timeline: {
            createdAt: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
            sentAt: new Date(Date.now() - 4 * 60 * 60 * 1000 + 2 * 60 * 1000).toISOString(),
            customerStartedAt: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
            expiresAt: new Date(Date.now() + 6 * 24 * 60 * 60 * 1000 + 20 * 60 * 60 * 1000).toISOString(),
          },
          verificationLink: "https://verify.springfincu.com/amanda_johnson",
          verificationToken: "sfcu_2024_ajohnson",
          createdBy: "member.services@springfincu.com",
          connectedAccounts: 1,
          attempts: 1,
          lastActivity: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
        },
        {
          id: "ver_michael_thompson", 
          customerInfo: {
            fullName: "Michael Thompson",
            email: "mthompson@construction.biz",
            phoneNumber: "+1 (555) 567-8901",
          },
          settings: {
            expirationDays: 10,
            sendMethod: "both",
            includeReminders: true,
            agentNotes: "Home equity line of credit - Construction business expansion. Existing member.",
          },
          status: "completed",
          timeline: {
            createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
            sentAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000 + 10 * 60 * 1000).toISOString(),
            customerStartedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
            bankConnectedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000 + 2 * 60 * 60 * 1000).toISOString(),
            completedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000 + 3 * 60 * 60 * 1000).toISOString(),
            expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
          },
          verificationLink: "https://verify.springfincu.com/michael_thompson",
          verificationToken: "sfcu_2024_mthompson",
          createdBy: "business.loans@springfincu.com",
          connectedAccounts: 4,
          attempts: 1,
          lastActivity: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000 + 3 * 60 * 60 * 1000).toISOString(),
        },
        {
          id: "ver_sarah_davis",
          customerInfo: {
            fullName: "Sarah Davis",
            email: "sarah.davis@localcafe.com",
            phoneNumber: "+1 (555) 678-9012",
          },
          settings: {
            expirationDays: 7,
            sendMethod: "email",
            includeReminders: true,
            agentNotes: "Small business loan - Local cafe expansion. Community business partner.",
          },
          status: "sent",
          timeline: {
            createdAt: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString(),
            sentAt: new Date(Date.now() - 8 * 60 * 60 * 1000 + 5 * 60 * 1000).toISOString(),
            expiresAt: new Date(Date.now() + 6 * 24 * 60 * 60 * 1000 + 16 * 60 * 60 * 1000).toISOString(),
          },
          verificationLink: "https://verify.springfincu.com/sarah_davis",
          verificationToken: "sfcu_2024_sdavis",
          createdBy: "business.loans@springfincu.com",
          connectedAccounts: 0,
          attempts: 0,
        },
        {
          id: "ver_david_wilson",
          customerInfo: {
            fullName: "David Wilson",
            email: "david.wilson@email.com",
            phoneNumber: "+1 (555) 789-0123",
          },
          settings: {
            expirationDays: 5,
            sendMethod: "sms",
            includeReminders: true,
                         agentNotes: "Personal loan for home renovations - Spring project season.",
           },
           status: "sent",
          timeline: {
            createdAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
            sentAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000 + 3 * 60 * 1000).toISOString(),
            expiresAt: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000).toISOString(),
          },
          verificationLink: "https://verify.springfincu.com/david_wilson",
          verificationToken: "sfcu_2024_dwilson",
          createdBy: "loan.officer@springfincu.com",
          connectedAccounts: 0,
          attempts: 0,
        },
        {
          id: "ver_lisa_rodriguez",
          customerInfo: {
            fullName: "Lisa Rodriguez",
            email: "lisa.rodriguez@realestate.com",
            phoneNumber: "+1 (555) 890-1234",
          },
          settings: {
            expirationDays: 7,
            sendMethod: "both",
            includeReminders: true,
            agentNotes: "Mortgage refinance - Taking advantage of rate environment. Real estate professional.",
          },
          status: "sent",
          timeline: {
            createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
            sentAt: new Date(Date.now() - 2 * 60 * 60 * 1000 + 1 * 60 * 1000).toISOString(),
            expiresAt: new Date(Date.now() + 6 * 24 * 60 * 60 * 1000 + 22 * 60 * 60 * 1000).toISOString(),
          },
          verificationLink: "https://verify.springfincu.com/lisa_rodriguez",
          verificationToken: "sfcu_2024_lrodriguez",
          createdBy: "mortgage.specialist@springfincu.com",
          connectedAccounts: 0,
          attempts: 0,
        },
        {
          id: "ver_kevin_brown",
          customerInfo: {
            fullName: "Kevin Brown", 
            email: "kevin.brown@manufacturing.com",
            phoneNumber: "+1 (555) 901-2345",
          },
          settings: {
            expirationDays: 7,
            sendMethod: "email",
            includeReminders: false,
                         agentNotes: "Credit card application - Manufacturing employee. Payroll member.",
           },
           status: "sent",
          timeline: {
            createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
            sentAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000 + 15 * 60 * 1000).toISOString(),
            expiresAt: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(),
          },
          verificationLink: "https://verify.springfincu.com/kevin_brown",
          verificationToken: "sfcu_2024_kbrown",
          createdBy: "credit.applications@springfincu.com",
          connectedAccounts: 0,
          attempts: 0,
        },
        {
          id: "ver_maria_gonzalez",
          customerInfo: {
            fullName: "Maria Gonzalez",
            email: "maria.gonzalez@healthcare.org",
            phoneNumber: "+1 (555) 012-3456",
          },
          settings: {
            expirationDays: 7,
            sendMethod: "both",
            includeReminders: true,
            agentNotes: "First-time home buyer loan - Healthcare worker. Member appreciation rate.",
          },
          status: "in_progress",
          timeline: {
            createdAt: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
            sentAt: new Date(Date.now() - 6 * 60 * 60 * 1000 + 8 * 60 * 1000).toISOString(),
            customerStartedAt: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
            expiresAt: new Date(Date.now() + 6 * 24 * 60 * 60 * 1000 + 18 * 60 * 60 * 1000).toISOString(),
          },
          verificationLink: "https://verify.springfincu.com/maria_gonzalez",
          verificationToken: "sfcu_2024_mgonzalez",
          createdBy: "mortgage.specialist@springfincu.com",
          connectedAccounts: 1,
          attempts: 1,
          lastActivity: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
        },
        {
          id: "ver_james_miller",
          customerInfo: {
            fullName: "James Miller",
            email: "james.miller@education.edu",
            phoneNumber: "+1 (555) 123-4567",
          },
          settings: {
            expirationDays: 14,
            sendMethod: "email",
            includeReminders: true,
            agentNotes: "Education loan consolidation - Teacher. Education professional rate program.",
          },
          status: "failed",
          timeline: {
            createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
            sentAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000 + 20 * 60 * 1000).toISOString(),
            customerStartedAt: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString(),
            expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
          },
          verificationLink: "https://verify.springfincu.com/james_miller",
          verificationToken: "sfcu_2024_jmiller",
          createdBy: "education.loans@springfincu.com",
          connectedAccounts: 0,
          attempts: 4,
          lastActivity: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000 + 2 * 60 * 60 * 1000).toISOString(),
        }
      ]

      console.log("Returning SpringFin Credit Union verifications:", mockVerifications.length, "items")

      // Return the correct structure for PaginatedResponse
      return {
        data: {
          data: mockVerifications,
          pagination: {
            page: 1,
            limit: 10,
            total: mockVerifications.length,
            totalPages: 1,
          },
          success: true,
        } as T,
        success: true,
      }
    }

    // Mock single verification details  
    if (endpoint.startsWith("/verifications/") && endpoint.split("/").length === 3) {
      const verificationId = endpoint.split("/")[2]

      // Return detailed verification data - SpringFin Credit Union format
      const mockVerification: VerificationRequest = {
        id: verificationId,
        customerInfo: {
          fullName: "Jennifer Martinez",
          email: "jennifer.martinez@email.com",
          phoneNumber: "+1 (555) 234-5678",
          nationality: "Georgian",
          identificationNumber: "01234567890",
          residingCountry: "United States",
          socialSecurityNumber: "123-45-6789",
        },
        settings: {
          expirationDays: 7,
          sendMethod: "email",
          includeReminders: true,
          agentNotes:
            "Mortgage pre-approval - Spring home buying season. Priority customer with excellent credit profile.",
        },
        status: "completed",
        timeline: {
          createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
          sentAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000 + 5 * 60 * 1000).toISOString(),
          customerStartedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000 - 2 * 60 * 60 * 1000).toISOString(),
          bankConnectedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000 - 1 * 60 * 60 * 1000).toISOString(),
          completedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
          expiresAt: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(),
        },
        verificationLink: "https://verify.springfincu.com/jennifer_martinez",
        verificationToken: "sfcu_2024_jmartinez",
        createdBy: "loan.officer@springfincu.com",
        connectedAccounts: 2,
        attempts: 1,
        lastActivity: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
      }

      return {
        data: mockVerification as T,
        success: true,
      }
    }

    // Mock create verification
    if (endpoint === "/verifications" && method === "POST") {
      const requestData = body ? JSON.parse(body as string) : {}
      const newVerification: VerificationRequest = {
        id: "ver_new_" + Date.now(),
        customerInfo: requestData.customerInfo,
        settings: requestData.settings,
        status: "pending",
        timeline: {
          createdAt: new Date().toISOString(),
          expiresAt: new Date(Date.now() + requestData.settings.expirationDays * 24 * 60 * 60 * 1000).toISOString(),
        },
        verificationLink: `https://verify.example.com/${Date.now()}`,
        verificationToken: `token-${Date.now()}`,
        createdBy: "admin@example.com",
        connectedAccounts: 0,
        attempts: 0,
      }

      return {
        data: newVerification as T,
        success: true,
        message: "Verification created successfully",
      }
    }

    // SpringFin Credit Union - Customer Financial Profiles  
    // Simplified customer data matching verification narrative
    if (endpoint.startsWith("/customers") && !endpoint.includes("/customers/")) {
      const mockCustomers: CustomerFinancialProfile[] = [
        {
          customerId: "cust_jennifer_martinez",
          customerInfo: {
            fullName: "Jennifer Martinez",
            email: "jennifer.martinez@email.com",
            phoneNumber: "+1 (555) 234-5678",
            dateOfBirth: "1988-05-15",
            nationality: "Georgian",
            identificationNumber: "01234567890",
            residingCountry: "United States",
            street: "1234 Market Street",
            zipcode: "94102",
            socialSecurityNumber: "123-45-6789",
          },
          financialSummary: {
            totalBalance: 89500.25,
            monthlyIncome: 7800,
            monthlyExpenses: 4200,
            netCashFlow: 3600,
            accountAge: 36,
            overdraftCount: 0,
          },
          creditReports: {
            summary: {
              averageScore: 748,
              scoreVariance: 7,
              overallGrade: "A",
              riskLevel: "low",
              primaryBureau: "experian",
              majorDiscrepancies: [],
            },
            experian: { 
              score: 752, 
              grade: "A",
              lastUpdated: "2024-03-14",
              utilization: { totalCredit: 25000, usedCredit: 3200, utilizationPercentage: 12.8 },
              paymentHistory: { onTimePercentage: 98, recentLatePayments: 0 },
              creditScoreFactors: {
                paymentHistory: { score: 95, rating: "EXCEPTIONAL", impact: "high" },
                amountOfDebt: { score: 88, rating: "VERY GOOD", impact: "high" },
                lengthOfCreditHistory: { score: 75, rating: "GOOD", impact: "medium", averageAccountAge: 5.2 },
                amountOfNewCredit: { score: 92, rating: "EXCEPTIONAL", impact: "low", recentInquiries: 1 },
                creditMix: { score: 78, rating: "GOOD", impact: "low", accountTypes: ["Credit Card", "Auto Loan", "Mortgage"] }
              },
              creditHistory: [
                { month: "2023-04-01", score: 715 },
                { month: "2023-05-01", score: 720 },
                { month: "2023-06-01", score: 708 },
                { month: "2023-07-01", score: 725 }, 
                { month: "2023-08-01", score: 732 },
                { month: "2023-09-01", score: 728 },
                { month: "2023-10-01", score: 740 },
                { month: "2023-11-01", score: 745 },
                { month: "2023-12-01", score: 738 },
                { month: "2024-01-01", score: 748 },
                { month: "2024-02-01", score: 755 },
                { month: "2024-03-01", score: 752 }
              ]
            },
            equifax: { 
              score: 745, 
              grade: "A",
              lastUpdated: "2024-03-14",
              utilization: { totalCredit: 25000, usedCredit: 3100, utilizationPercentage: 12.4 },
              paymentHistory: { onTimePercentage: 98, recentLatePayments: 0 },
              creditScoreFactors: {
                paymentHistory: { score: 94, rating: "VERY GOOD", impact: "high" },
                amountOfDebt: { score: 87, rating: "VERY GOOD", impact: "high" },
                lengthOfCreditHistory: { score: 74, rating: "GOOD", impact: "medium", averageAccountAge: 5.2 },
                amountOfNewCredit: { score: 90, rating: "VERY GOOD", impact: "low", recentInquiries: 1 },
                creditMix: { score: 76, rating: "GOOD", impact: "low", accountTypes: ["Credit Card", "Auto Loan", "Mortgage"] }
              },
              creditHistory: [
                { month: "2023-04-01", score: 712 },
                { month: "2023-05-01", score: 718 },
                { month: "2023-06-01", score: 705 },
                { month: "2023-07-01", score: 722 }, 
                { month: "2023-08-01", score: 728 },
                { month: "2023-09-01", score: 725 },
                { month: "2023-10-01", score: 735 },
                { month: "2023-11-01", score: 742 },
                { month: "2023-12-01", score: 735 },
                { month: "2024-01-01", score: 740 },
                { month: "2024-02-01", score: 748 },
                { month: "2024-03-01", score: 745 }
              ]
            },
            transunion: { 
              score: 747, 
              grade: "A",
              lastUpdated: "2024-03-14",
              utilization: { totalCredit: 25000, usedCredit: 3150, utilizationPercentage: 12.6 },
              paymentHistory: { onTimePercentage: 98, recentLatePayments: 0 },
              creditScoreFactors: {
                paymentHistory: { score: 95, rating: "EXCEPTIONAL", impact: "high" },
                amountOfDebt: { score: 86, rating: "VERY GOOD", impact: "high" },
                lengthOfCreditHistory: { score: 75, rating: "GOOD", impact: "medium", averageAccountAge: 5.2 },
                amountOfNewCredit: { score: 91, rating: "VERY GOOD", impact: "low", recentInquiries: 1 },
                creditMix: { score: 77, rating: "GOOD", impact: "low", accountTypes: ["Credit Card", "Auto Loan", "Mortgage"] }
              },
              creditHistory: [
                { month: "2023-04-01", score: 737 },
                { month: "2023-05-01", score: 740 },
                { month: "2023-06-01", score: 738 },
                { month: "2023-07-01", score: 741 }, 
                { month: "2023-08-01", score: 744 },
                { month: "2023-09-01", score: 742 },
                { month: "2023-10-01", score: 746 },
                { month: "2023-11-01", score: 748 },
                { month: "2023-12-01", score: 745 },
                { month: "2024-01-01", score: 747 },
                { month: "2024-02-01", score: 749 },
                { month: "2024-03-01", score: 747 }
              ]
            },
          },
          riskIndicators: {
            irregularIncomePattern: false,
            highOverdraftFrequency: false,
            gamblingActivity: false,
            cryptocurrencyActivity: false,
            largeUnexplainedDeposits: false,
          },
          verificationId: "ver_jennifer_martinez",
          lastUpdated: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
          bankAccounts: [
            {
              accountId: "acc_jm_checking",
              accountType: "checking",
              accountNumber: "****1234",
              balance: 12500.25,
              bankName: "Chase Bank",
              openedDate: "2021-03-15",
              currency: "USD",
              transactions: [],
              monthlyBalances: [],
            }
          ],
          transactionAnalysis: {
            totalTransactions: 156,
            avgMonthlySpending: 4200,
            topCategories: [
              { 
                category: "Housing", 
                amount: 1800, 
                percentage: 42.8,
                transactionCount: 12,
                trend: "stable",
                monthlyData: []
              }
            ],
            incomeStreams: [
              { 
                source: "Marketing Manager Salary",
                frequency: "monthly",
                averageAmount: 7800,
                lastAmount: 7800,
                confidence: 95,
                category: "salary"
              }
            ],
            recurringPayments: [
              { 
                merchant: "Rent Payment",
                frequency: "monthly",
                averageAmount: 1800,
                category: "Housing"
              }
            ],
          },
        },
        {
          customerId: "cust_robert_chen",
          customerInfo: {
            fullName: "Robert Chen",
            email: "robert.chen@techcorp.com",
            phoneNumber: "+1 (555) 345-6789",
            dateOfBirth: "1985-09-22",
            nationality: "Georgian",
            identificationNumber: "11234567891",
            residingCountry: "United States",
            street: "5678 Elm Avenue",
            zipcode: "90210",
            socialSecurityNumber: "234-56-7890",
          },
          financialSummary: {
            totalBalance: 125750.00,
            monthlyIncome: 12500,
            monthlyExpenses: 6800,
            netCashFlow: 5700,
            accountAge: 48,
            overdraftCount: 0,
          },
          creditReports: {
            summary: {
              averageScore: 782,
              scoreVariance: 7,
              overallGrade: "A",
              riskLevel: "low",
              primaryBureau: "experian",
              majorDiscrepancies: [],
            },
            experian: { 
              score: 785, 
              grade: "A",
              lastUpdated: "2024-03-15",
              utilization: { totalCredit: 45000, usedCredit: 4500, utilizationPercentage: 10.0 },
              paymentHistory: { onTimePercentage: 100, recentLatePayments: 0 },
              creditScoreFactors: {
                paymentHistory: { score: 100, rating: "EXCEPTIONAL", impact: "high" },
                amountOfDebt: { score: 95, rating: "EXCEPTIONAL", impact: "high" },
                lengthOfCreditHistory: { score: 82, rating: "VERY GOOD", impact: "medium", averageAccountAge: 7.3 },
                amountOfNewCredit: { score: 85, rating: "VERY GOOD", impact: "low", recentInquiries: 0 },
                creditMix: { score: 88, rating: "VERY GOOD", impact: "low", accountTypes: ["Credit Card", "Auto Loan", "Mortgage", "Personal Loan"] }
              },
              creditHistory: [
                { month: "2023-04-01", score: 768 },
                { month: "2023-05-01", score: 771 },
                { month: "2023-06-01", score: 773 },
                { month: "2023-07-01", score: 776 }, 
                { month: "2023-08-01", score: 779 },
                { month: "2023-09-01", score: 777 },
                { month: "2023-10-01", score: 781 },
                { month: "2023-11-01", score: 783 },
                { month: "2023-12-01", score: 780 },
                { month: "2024-01-01", score: 782 },
                { month: "2024-02-01", score: 784 },
                { month: "2024-03-01", score: 785 }
              ]
            },
            equifax: { 
              score: 778, 
              grade: "A",
              lastUpdated: "2024-03-15",
              utilization: { totalCredit: 45000, usedCredit: 4600, utilizationPercentage: 10.2 },
              paymentHistory: { onTimePercentage: 100, recentLatePayments: 0 },
              creditScoreFactors: {
                paymentHistory: { score: 98, rating: "EXCEPTIONAL", impact: "high" },
                amountOfDebt: { score: 94, rating: "VERY GOOD", impact: "high" },
                lengthOfCreditHistory: { score: 80, rating: "VERY GOOD", impact: "medium", averageAccountAge: 7.3 },
                amountOfNewCredit: { score: 83, rating: "VERY GOOD", impact: "low", recentInquiries: 0 },
                creditMix: { score: 86, rating: "VERY GOOD", impact: "low", accountTypes: ["Credit Card", "Auto Loan", "Mortgage", "Personal Loan"] }
              },
              creditHistory: [
                { month: "2023-04-01", score: 761 },
                { month: "2023-05-01", score: 764 },
                { month: "2023-06-01", score: 766 },
                { month: "2023-07-01", score: 769 }, 
                { month: "2023-08-01", score: 772 },
                { month: "2023-09-01", score: 770 },
                { month: "2023-10-01", score: 774 },
                { month: "2023-11-01", score: 776 },
                { month: "2023-12-01", score: 773 },
                { month: "2024-01-01", score: 775 },
                { month: "2024-02-01", score: 777 },
                { month: "2024-03-01", score: 778 }
              ]
            },
            transunion: { 
              score: 783, 
              grade: "A",
              lastUpdated: "2024-03-15",
              utilization: { totalCredit: 45000, usedCredit: 4550, utilizationPercentage: 10.1 },
              paymentHistory: { onTimePercentage: 100, recentLatePayments: 0 },
              creditScoreFactors: {
                paymentHistory: { score: 99, rating: "EXCEPTIONAL", impact: "high" },
                amountOfDebt: { score: 95, rating: "EXCEPTIONAL", impact: "high" },
                lengthOfCreditHistory: { score: 81, rating: "VERY GOOD", impact: "medium", averageAccountAge: 7.3 },
                amountOfNewCredit: { score: 84, rating: "VERY GOOD", impact: "low", recentInquiries: 0 },
                creditMix: { score: 87, rating: "VERY GOOD", impact: "low", accountTypes: ["Credit Card", "Auto Loan", "Mortgage", "Personal Loan"] }
              },
              creditHistory: [
                { month: "2023-04-01", score: 766 },
                { month: "2023-05-01", score: 769 },
                { month: "2023-06-01", score: 771 },
                { month: "2023-07-01", score: 774 }, 
                { month: "2023-08-01", score: 777 },
                { month: "2023-09-01", score: 775 },
                { month: "2023-10-01", score: 779 },
                { month: "2023-11-01", score: 781 },
                { month: "2023-12-01", score: 778 },
                { month: "2024-01-01", score: 780 },
                { month: "2024-02-01", score: 782 },
                { month: "2024-03-01", score: 783 }
              ]
            },
          },
          riskIndicators: {
            irregularIncomePattern: false,
            highOverdraftFrequency: false,
            gamblingActivity: false,
            cryptocurrencyActivity: true,
            largeUnexplainedDeposits: false,
          },
          verificationId: "ver_robert_chen",
          lastUpdated: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
          bankAccounts: [
            {
              accountId: "acc_rc_checking",
              accountType: "checking",
              accountNumber: "****5678",
              balance: 15750.00,
              bankName: "Bank of America",
              openedDate: "2020-01-10",
              currency: "USD",
              transactions: [],
              monthlyBalances: [],
            }
          ],
          transactionAnalysis: {
            totalTransactions: 203,
            avgMonthlySpending: 6800,
            topCategories: [
              { 
                category: "Housing", 
                amount: 2800, 
                percentage: 41.2,
                transactionCount: 18,
                trend: "stable",
                monthlyData: []
              }
            ],
            incomeStreams: [
              { 
                source: "Senior Software Engineer",
                frequency: "monthly",
                averageAmount: 12500,
                lastAmount: 12500,
                confidence: 98,
                category: "salary"
              }
            ],
            recurringPayments: [
              { 
                merchant: "Mortgage Payment",
                frequency: "monthly",
                averageAmount: 2800,
                category: "Housing"
              }
            ],
          },
        },
        {
          customerId: "cust_michael_thompson",
          customerInfo: {
            fullName: "Michael Thompson",
            email: "mthompson@construction.biz",
            phoneNumber: "+1 (555) 567-8901",
            dateOfBirth: "1980-12-03",
            nationality: "Georgian",
            identificationNumber: "21234567892",
            residingCountry: "United States",
            street: "9012 Oak Street",
            zipcode: "77001",
            // socialSecurityNumber missing - will trigger customer info collection
          },
          financialSummary: {
            totalBalance: 186200.50,
            monthlyIncome: 15200,
            monthlyExpenses: 8900,
            netCashFlow: 6300,
            accountAge: 72,
            overdraftCount: 1,
          },
          creditReports: {
            summary: {
              averageScore: 712,
              scoreVariance: 10,
              overallGrade: "B",
              riskLevel: "low",
              primaryBureau: "experian",
              majorDiscrepancies: [],
            },
            experian: { 
              score: 718, 
              grade: "B",
              lastUpdated: "2024-03-13",
              utilization: { totalCredit: 35000, usedCredit: 8500, utilizationPercentage: 24.3 },
              paymentHistory: { onTimePercentage: 94, recentLatePayments: 1 },
              creditScoreFactors: {
                paymentHistory: { score: 78, rating: "GOOD", impact: "high" },
                amountOfDebt: { score: 65, rating: "FAIR", impact: "high" },
                lengthOfCreditHistory: { score: 92, rating: "EXCEPTIONAL", impact: "medium", averageAccountAge: 12.8 },
                amountOfNewCredit: { score: 88, rating: "VERY GOOD", impact: "low", recentInquiries: 0 },
                creditMix: { score: 85, rating: "VERY GOOD", impact: "low", accountTypes: ["Credit Card", "Business Credit Line", "Mortgage", "Equipment Loan"] }
              },
              creditHistory: [
                { month: "2023-04-01", score: 702 },
                { month: "2023-05-01", score: 705 },
                { month: "2023-06-01", score: 698 },
                { month: "2023-07-01", score: 707 }, 
                { month: "2023-08-01", score: 710 },
                { month: "2023-09-01", score: 704 },
                { month: "2023-10-01", score: 712 },
                { month: "2023-11-01", score: 715 },
                { month: "2023-12-01", score: 708 },
                { month: "2024-01-01", score: 713 },
                { month: "2024-02-01", score: 716 },
                { month: "2024-03-01", score: 718 }
              ]
            },
            equifax: { 
              score: 708, 
              grade: "B",
              lastUpdated: "2024-03-13",
              utilization: { totalCredit: 35000, usedCredit: 8400, utilizationPercentage: 24.0 },
              paymentHistory: { onTimePercentage: 94, recentLatePayments: 1 },
              creditScoreFactors: {
                paymentHistory: { score: 76, rating: "GOOD", impact: "high" },
                amountOfDebt: { score: 64, rating: "FAIR", impact: "high" },
                lengthOfCreditHistory: { score: 90, rating: "VERY GOOD", impact: "medium", averageAccountAge: 12.8 },
                amountOfNewCredit: { score: 86, rating: "VERY GOOD", impact: "low", recentInquiries: 0 },
                creditMix: { score: 83, rating: "VERY GOOD", impact: "low", accountTypes: ["Credit Card", "Business Credit Line", "Mortgage", "Equipment Loan"] }
              },
              creditHistory: [
                { month: "2023-04-01", score: 692 },
                { month: "2023-05-01", score: 695 },
                { month: "2023-06-01", score: 688 },
                { month: "2023-07-01", score: 697 }, 
                { month: "2023-08-01", score: 700 },
                { month: "2023-09-01", score: 694 },
                { month: "2023-10-01", score: 702 },
                { month: "2023-11-01", score: 705 },
                { month: "2023-12-01", score: 698 },
                { month: "2024-01-01", score: 703 },
                { month: "2024-02-01", score: 706 },
                { month: "2024-03-01", score: 708 }
              ]
            },
            transunion: { 
              score: 710, 
              grade: "B",
              lastUpdated: "2024-03-13",
              utilization: { totalCredit: 35000, usedCredit: 8450, utilizationPercentage: 24.1 },
              paymentHistory: { onTimePercentage: 94, recentLatePayments: 1 },
              creditScoreFactors: {
                paymentHistory: { score: 77, rating: "GOOD", impact: "high" },
                amountOfDebt: { score: 64, rating: "FAIR", impact: "high" },
                lengthOfCreditHistory: { score: 91, rating: "VERY GOOD", impact: "medium", averageAccountAge: 12.8 },
                amountOfNewCredit: { score: 87, rating: "VERY GOOD", impact: "low", recentInquiries: 0 },
                creditMix: { score: 84, rating: "VERY GOOD", impact: "low", accountTypes: ["Credit Card", "Business Credit Line", "Mortgage", "Equipment Loan"] }
              },
              creditHistory: [
                { month: "2023-04-01", score: 694 },
                { month: "2023-05-01", score: 697 },
                { month: "2023-06-01", score: 690 },
                { month: "2023-07-01", score: 699 }, 
                { month: "2023-08-01", score: 702 },
                { month: "2023-09-01", score: 696 },
                { month: "2023-10-01", score: 704 },
                { month: "2023-11-01", score: 707 },
                { month: "2023-12-01", score: 700 },
                { month: "2024-01-01", score: 705 },
                { month: "2024-02-01", score: 708 },
                { month: "2024-03-01", score: 710 }
              ]
            },
          },
          riskIndicators: {
            irregularIncomePattern: true,
            highOverdraftFrequency: false,
            gamblingActivity: false,
            cryptocurrencyActivity: false,
            largeUnexplainedDeposits: false,
          },
          verificationId: "ver_michael_thompson",
          lastUpdated: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000 + 3 * 60 * 60 * 1000).toISOString(),
          bankAccounts: [
            {
              accountId: "acc_mt_business",
              accountType: "checking",
              accountNumber: "****9012",
              balance: 45200.50,
              bankName: "Wells Fargo Business",
              openedDate: "2018-06-20",
              currency: "USD",
              transactions: [],
              monthlyBalances: [],
            }
          ],
          transactionAnalysis: {
            totalTransactions: 287,
            avgMonthlySpending: 8900,
            topCategories: [
              { 
                category: "Business", 
                amount: 3200, 
                percentage: 36.0,
                transactionCount: 45,
                trend: "increasing",
                monthlyData: []
              }
            ],
            incomeStreams: [
              { 
                source: "Construction Business",
                frequency: "irregular",
                averageAmount: 15200,
                lastAmount: 18500,
                confidence: 75,
                category: "other"
              }
            ],
            recurringPayments: [
              { 
                merchant: "Business Loan",
                frequency: "monthly",
                averageAmount: 2100,
                category: "Business"
              }
            ],
          },
        }
      ]

      console.log("Returning SpringFin Credit Union customers:", mockCustomers.length, "items")

      // Return the correct structure for PaginatedResponse
      return {
        data: {
          data: mockCustomers,
          pagination: {
            page: 1,
            limit: 10,
            total: mockCustomers.length,
            totalPages: 1,
          },
          success: true,
        } as T,
        success: true,
      }
    }

    // SpringFin Credit Union - Individual Customer Details
    if (endpoint.startsWith("/customers/") && endpoint.split("/").length === 3 && !endpoint.includes("/transactions") && !endpoint.includes("/income") && !endpoint.includes("/spending") && !endpoint.includes("/export") && !endpoint.includes("/notes") && !endpoint.includes("/flags")) {
      const customerId = endpoint.split("/")[2]
      console.log(`[Mock API] Fetching SpringFin Credit Union customer profile for ID: ${customerId}`)
      
      // Return the correct SpringFin customer based on ID
      let mockProfile: CustomerFinancialProfile

      if (customerId === "cust_jennifer_martinez") {
        mockProfile = {
          customerId: "cust_jennifer_martinez",
          customerInfo: {
            fullName: "Jennifer Martinez",
            email: "jennifer.martinez@email.com",
            phoneNumber: "+1 (555) 234-5678",
            dateOfBirth: "1988-05-15",
            nationality: "Georgian",
            identificationNumber: "01234567890",
            residingCountry: "United States",
            street: "1234 Market Street",
            zipcode: "94102",
            socialSecurityNumber: "123-45-6789",
            state: "California",
            city: "San Francisco",
          },
          financialSummary: {
            totalBalance: 89500.25,
            monthlyIncome: 7800,
            monthlyExpenses: 4200,
            netCashFlow: 3600,
            accountAge: 36,
            overdraftCount: 0,
          },
          creditReports: {
            summary: {
              averageScore: 748,
              scoreVariance: 7,
              overallGrade: "A",
              riskLevel: "low",
              primaryBureau: "experian",
              majorDiscrepancies: [],
            },
            experian: { 
              score: 752, 
              grade: "A",
              lastUpdated: "2024-03-14",
              utilization: { totalCredit: 25000, usedCredit: 3200, utilizationPercentage: 12.8 },
              paymentHistory: { onTimePercentage: 98, recentLatePayments: 0 },
              creditScoreFactors: {
                paymentHistory: { score: 95, rating: "EXCEPTIONAL", impact: "high" },
                amountOfDebt: { score: 88, rating: "VERY GOOD", impact: "high" },
                lengthOfCreditHistory: { score: 75, rating: "GOOD", impact: "medium", averageAccountAge: 5.2 },
                amountOfNewCredit: { score: 92, rating: "EXCEPTIONAL", impact: "low", recentInquiries: 1 },
                creditMix: { score: 78, rating: "GOOD", impact: "low", accountTypes: ["Credit Card", "Auto Loan", "Mortgage"] }
              },
              creditHistory: [
                { month: "2023-04-01", score: 738 },
                { month: "2023-05-01", score: 741 },
                { month: "2023-06-01", score: 739 },
                { month: "2023-07-01", score: 743 }, 
                { month: "2023-08-01", score: 746 },
                { month: "2023-09-01", score: 744 },
                { month: "2023-10-01", score: 748 },
                { month: "2023-11-01", score: 750 },
                { month: "2023-12-01", score: 747 },
                { month: "2024-01-01", score: 749 },
                { month: "2024-02-01", score: 751 },
                { month: "2024-03-01", score: 752 }
              ]
            },
            equifax: { 
              score: 745, 
              grade: "A",
              lastUpdated: "2024-03-14",
              utilization: { totalCredit: 25000, usedCredit: 3100, utilizationPercentage: 12.4 },
              paymentHistory: { onTimePercentage: 98, recentLatePayments: 0 },
              creditScoreFactors: {
                paymentHistory: { score: 94, rating: "VERY GOOD", impact: "high" },
                amountOfDebt: { score: 87, rating: "VERY GOOD", impact: "high" },
                lengthOfCreditHistory: { score: 74, rating: "GOOD", impact: "medium", averageAccountAge: 5.2 },
                amountOfNewCredit: { score: 90, rating: "VERY GOOD", impact: "low", recentInquiries: 1 },
                creditMix: { score: 76, rating: "GOOD", impact: "low", accountTypes: ["Credit Card", "Auto Loan", "Mortgage"] }
              },
              creditHistory: [
                { month: "2023-04-01", score: 735 },
                { month: "2023-05-01", score: 738 },
                { month: "2023-06-01", score: 736 },
                { month: "2023-07-01", score: 740 }, 
                { month: "2023-08-01", score: 742 },
                { month: "2023-09-01", score: 741 },
                { month: "2023-10-01", score: 744 },
                { month: "2023-11-01", score: 746 },
                { month: "2023-12-01", score: 743 },
                { month: "2024-01-01", score: 744 },
                { month: "2024-02-01", score: 746 },
                { month: "2024-03-01", score: 745 }
              ]
            },
            transunion: { 
              score: 747, 
              grade: "A",
              lastUpdated: "2024-03-14",
              utilization: { totalCredit: 25000, usedCredit: 3150, utilizationPercentage: 12.6 },
              paymentHistory: { onTimePercentage: 98, recentLatePayments: 0 },
              creditScoreFactors: {
                paymentHistory: { score: 95, rating: "EXCEPTIONAL", impact: "high" },
                amountOfDebt: { score: 86, rating: "VERY GOOD", impact: "high" },
                lengthOfCreditHistory: { score: 75, rating: "GOOD", impact: "medium", averageAccountAge: 5.2 },
                amountOfNewCredit: { score: 91, rating: "VERY GOOD", impact: "low", recentInquiries: 1 },
                creditMix: { score: 77, rating: "GOOD", impact: "low", accountTypes: ["Credit Card", "Auto Loan", "Mortgage"] }
              },
              creditHistory: [
                { month: "2023-04-01", score: 737 },
                { month: "2023-05-01", score: 740 },
                { month: "2023-06-01", score: 738 },
                { month: "2023-07-01", score: 741 }, 
                { month: "2023-08-01", score: 744 },
                { month: "2023-09-01", score: 742 },
                { month: "2023-10-01", score: 746 },
                { month: "2023-11-01", score: 748 },
                { month: "2023-12-01", score: 745 },
                { month: "2024-01-01", score: 747 },
                { month: "2024-02-01", score: 749 },
                { month: "2024-03-01", score: 747 }
              ]
            },
          },
          riskIndicators: {
            irregularIncomePattern: false,
            highOverdraftFrequency: false,
            gamblingActivity: false,
            cryptocurrencyActivity: false,
            largeUnexplainedDeposits: false,
          },
          verificationId: "ver_jennifer_martinez",
          lastUpdated: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
          bankAccounts: [
            {
              accountId: "acc_jm_checking",
              accountType: "checking",
              accountNumber: "****1234",
              balance: 12500.25,
              bankName: "Chase Bank",
              openedDate: "2021-03-15",
              currency: "USD",
              transactions: [],
              monthlyBalances: [
                { month: "2024-01", balance: 11800.50 },
                { month: "2024-02", balance: 12200.75 },
                { month: "2024-03", balance: 12500.25 }
              ],
            },
            {
              accountId: "acc_jm_savings",
              accountType: "savings",
              accountNumber: "****5678",
              balance: 77000.00,
              bankName: "Chase Bank",
              openedDate: "2021-03-15",
              currency: "USD",
              transactions: [],
              monthlyBalances: [
                { month: "2024-01", balance: 75500.00 },
                { month: "2024-02", balance: 76250.00 },
                { month: "2024-03", balance: 77000.00 }
              ],
            }
          ],
          transactionAnalysis: {
            totalTransactions: 156,
            avgMonthlySpending: 4200,
            topCategories: [
              { 
                category: "Housing", 
                amount: 1800, 
                percentage: 42.8,
                transactionCount: 12,
                trend: "stable",
                monthlyData: [
                  { month: "2024-01", amount: 1800 },
                  { month: "2024-02", amount: 1800 },
                  { month: "2024-03", amount: 1800 }
                ]
              },
              { 
                category: "Transportation", 
                amount: 650, 
                percentage: 15.5,
                transactionCount: 18,
                trend: "stable",
                monthlyData: [
                  { month: "2024-01", amount: 620 },
                  { month: "2024-02", amount: 680 },
                  { month: "2024-03", amount: 650 }
                ]
              },
              { 
                category: "Food", 
                amount: 580, 
                percentage: 13.8,
                transactionCount: 24,
                trend: "increasing",
                monthlyData: [
                  { month: "2024-01", amount: 520 },
                  { month: "2024-02", amount: 550 },
                  { month: "2024-03", amount: 580 }
                ]
              }
            ],
            incomeStreams: [
              { 
                source: "Marketing Manager Salary",
                frequency: "monthly",
                averageAmount: 7800,
                lastAmount: 7800,
                confidence: 95,
                category: "salary"
              }
            ],
            recurringPayments: [
              { 
                merchant: "Rent Payment",
                frequency: "monthly",
                averageAmount: 1800,
                category: "Housing"
              },
              { 
                merchant: "Car Payment",
                frequency: "monthly",
                averageAmount: 425,
                category: "Transportation"
              }
            ],
          },
        }
      } else if (customerId === "cust_robert_chen") {
        mockProfile = {
          customerId: "cust_robert_chen",
          customerInfo: {
            fullName: "Robert Chen",
            email: "robert.chen@techcorp.com",
            phoneNumber: "+1 (555) 345-6789",
            dateOfBirth: "1985-09-22",
            nationality: "Georgian",
            identificationNumber: "11234567891",
            residingCountry: "United States",
            street: "5678 Elm Avenue",
            zipcode: "90210",
            socialSecurityNumber: "234-56-7890",
            state: "New York",
            city: "New York",
          },
          financialSummary: {
            totalBalance: 125750.00,
            monthlyIncome: 12500,
            monthlyExpenses: 6800,
            netCashFlow: 5700,
            accountAge: 48,
            overdraftCount: 0,
          },
          creditReports: {
            summary: {
              averageScore: 782,
              scoreVariance: 7,
              overallGrade: "A",
              riskLevel: "low",
              primaryBureau: "experian",
              majorDiscrepancies: [],
            },
            experian: { 
              score: 785, 
              grade: "A",
              lastUpdated: "2024-03-15",
              utilization: { totalCredit: 45000, usedCredit: 4500, utilizationPercentage: 10.0 },
              paymentHistory: { onTimePercentage: 100, recentLatePayments: 0 },
              creditScoreFactors: {
                paymentHistory: { score: 100, rating: "EXCEPTIONAL", impact: "high" },
                amountOfDebt: { score: 95, rating: "EXCEPTIONAL", impact: "high" },
                lengthOfCreditHistory: { score: 82, rating: "VERY GOOD", impact: "medium", averageAccountAge: 7.3 },
                amountOfNewCredit: { score: 85, rating: "VERY GOOD", impact: "low", recentInquiries: 0 },
                creditMix: { score: 88, rating: "VERY GOOD", impact: "low", accountTypes: ["Credit Card", "Auto Loan", "Mortgage", "Personal Loan"] }
              },
              creditHistory: [
                { month: "2023-04-01", score: 768 },
                { month: "2023-05-01", score: 771 },
                { month: "2023-06-01", score: 773 },
                { month: "2023-07-01", score: 776 }, 
                { month: "2023-08-01", score: 779 },
                { month: "2023-09-01", score: 777 },
                { month: "2023-10-01", score: 781 },
                { month: "2023-11-01", score: 783 },
                { month: "2023-12-01", score: 780 },
                { month: "2024-01-01", score: 782 },
                { month: "2024-02-01", score: 784 },
                { month: "2024-03-01", score: 785 }
              ]
            },
            equifax: { 
              score: 778, 
              grade: "A",
              lastUpdated: "2024-03-15",
              utilization: { totalCredit: 45000, usedCredit: 4600, utilizationPercentage: 10.2 },
              paymentHistory: { onTimePercentage: 100, recentLatePayments: 0 },
              creditScoreFactors: {
                paymentHistory: { score: 98, rating: "EXCEPTIONAL", impact: "high" },
                amountOfDebt: { score: 94, rating: "VERY GOOD", impact: "high" },
                lengthOfCreditHistory: { score: 80, rating: "VERY GOOD", impact: "medium", averageAccountAge: 7.3 },
                amountOfNewCredit: { score: 83, rating: "VERY GOOD", impact: "low", recentInquiries: 0 },
                creditMix: { score: 86, rating: "VERY GOOD", impact: "low", accountTypes: ["Credit Card", "Auto Loan", "Mortgage", "Personal Loan"] }
              },
              creditHistory: [
                { month: "2023-04-01", score: 761 },
                { month: "2023-05-01", score: 764 },
                { month: "2023-06-01", score: 766 },
                { month: "2023-07-01", score: 769 }, 
                { month: "2023-08-01", score: 772 },
                { month: "2023-09-01", score: 770 },
                { month: "2023-10-01", score: 774 },
                { month: "2023-11-01", score: 776 },
                { month: "2023-12-01", score: 773 },
                { month: "2024-01-01", score: 775 },
                { month: "2024-02-01", score: 777 },
                { month: "2024-03-01", score: 778 }
              ]
            },
            transunion: { 
              score: 783, 
              grade: "A",
              lastUpdated: "2024-03-15",
              utilization: { totalCredit: 45000, usedCredit: 4550, utilizationPercentage: 10.1 },
              paymentHistory: { onTimePercentage: 100, recentLatePayments: 0 },
              creditScoreFactors: {
                paymentHistory: { score: 99, rating: "EXCEPTIONAL", impact: "high" },
                amountOfDebt: { score: 95, rating: "EXCEPTIONAL", impact: "high" },
                lengthOfCreditHistory: { score: 81, rating: "VERY GOOD", impact: "medium", averageAccountAge: 7.3 },
                amountOfNewCredit: { score: 84, rating: "VERY GOOD", impact: "low", recentInquiries: 0 },
                creditMix: { score: 87, rating: "VERY GOOD", impact: "low", accountTypes: ["Credit Card", "Auto Loan", "Mortgage", "Personal Loan"] }
              },
              creditHistory: [
                { month: "2023-04-01", score: 766 },
                { month: "2023-05-01", score: 769 },
                { month: "2023-06-01", score: 771 },
                { month: "2023-07-01", score: 774 }, 
                { month: "2023-08-01", score: 777 },
                { month: "2023-09-01", score: 775 },
                { month: "2023-10-01", score: 779 },
                { month: "2023-11-01", score: 781 },
                { month: "2023-12-01", score: 778 },
                { month: "2024-01-01", score: 780 },
                { month: "2024-02-01", score: 782 },
                { month: "2024-03-01", score: 783 }
              ]
            },
          },
          riskIndicators: {
            irregularIncomePattern: false,
            highOverdraftFrequency: false,
            gamblingActivity: false,
            cryptocurrencyActivity: true,
            largeUnexplainedDeposits: false,
          },
          verificationId: "ver_robert_chen",
          lastUpdated: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
          bankAccounts: [
            {
              accountId: "acc_rc_checking",
              accountType: "checking",
              accountNumber: "****5678",
              balance: 15750.00,
              bankName: "Bank of America",
              openedDate: "2020-01-10",
              currency: "USD",
              transactions: [],
              monthlyBalances: [],
            }
          ],
          transactionAnalysis: {
            totalTransactions: 203,
            avgMonthlySpending: 6800,
            topCategories: [
              { 
                category: "Housing", 
                amount: 2800, 
                percentage: 41.2,
                transactionCount: 18,
                trend: "stable",
                monthlyData: []
              }
            ],
            incomeStreams: [
              { 
                source: "Senior Software Engineer",
                frequency: "monthly",
                averageAmount: 12500,
                lastAmount: 12500,
                confidence: 98,
                category: "salary"
              }
            ],
            recurringPayments: [
              { 
                merchant: "Mortgage Payment",
                frequency: "monthly",
                averageAmount: 2800,
                category: "Housing"
              }
            ],
          },
        }
      } else if (customerId === "cust_michael_thompson") {
        mockProfile = {
          customerId: "cust_michael_thompson",
          customerInfo: {
            fullName: "Michael Thompson",
            email: "mthompson@construction.biz",
            phoneNumber: "+1 (555) 567-8901",
            dateOfBirth: "1980-12-03",
            nationality: "Georgian",
            identificationNumber: "21234567892",
            residingCountry: "United States",
            street: "9012 Oak Street",
            zipcode: "77001",
            // socialSecurityNumber missing - will trigger customer info collection
            state: "Texas",
            city: "Houston",
          },
          financialSummary: {
            totalBalance: 186200.50,
            monthlyIncome: 15200,
            monthlyExpenses: 8900,
            netCashFlow: 6300,
            accountAge: 72,
            overdraftCount: 1,
          },
          creditReports: {
            summary: {
              averageScore: 712,
              scoreVariance: 10,
              overallGrade: "B",
              riskLevel: "low",
              primaryBureau: "experian",
              majorDiscrepancies: [],
            },
            experian: { 
              score: 718, 
              grade: "B",
              lastUpdated: "2024-03-13",
              utilization: { totalCredit: 35000, usedCredit: 8500, utilizationPercentage: 24.3 },
              paymentHistory: { onTimePercentage: 94, recentLatePayments: 1 },
              creditScoreFactors: {
                paymentHistory: { score: 78, rating: "GOOD", impact: "high" },
                amountOfDebt: { score: 65, rating: "FAIR", impact: "high" },
                lengthOfCreditHistory: { score: 92, rating: "EXCEPTIONAL", impact: "medium", averageAccountAge: 12.8 },
                amountOfNewCredit: { score: 88, rating: "VERY GOOD", impact: "low", recentInquiries: 0 },
                creditMix: { score: 85, rating: "VERY GOOD", impact: "low", accountTypes: ["Credit Card", "Business Credit Line", "Mortgage", "Equipment Loan"] }
              },
              creditHistory: [
                { month: "2023-04-01", score: 702 },
                { month: "2023-05-01", score: 705 },
                { month: "2023-06-01", score: 698 },
                { month: "2023-07-01", score: 707 }, 
                { month: "2023-08-01", score: 710 },
                { month: "2023-09-01", score: 704 },
                { month: "2023-10-01", score: 712 },
                { month: "2023-11-01", score: 715 },
                { month: "2023-12-01", score: 708 },
                { month: "2024-01-01", score: 713 },
                { month: "2024-02-01", score: 716 },
                { month: "2024-03-01", score: 718 }
              ]
            },
            equifax: { 
              score: 708, 
              grade: "B",
              lastUpdated: "2024-03-13",
              utilization: { totalCredit: 35000, usedCredit: 8400, utilizationPercentage: 24.0 },
              paymentHistory: { onTimePercentage: 94, recentLatePayments: 1 },
              creditScoreFactors: {
                paymentHistory: { score: 76, rating: "GOOD", impact: "high" },
                amountOfDebt: { score: 64, rating: "FAIR", impact: "high" },
                lengthOfCreditHistory: { score: 90, rating: "VERY GOOD", impact: "medium", averageAccountAge: 12.8 },
                amountOfNewCredit: { score: 86, rating: "VERY GOOD", impact: "low", recentInquiries: 0 },
                creditMix: { score: 83, rating: "VERY GOOD", impact: "low", accountTypes: ["Credit Card", "Business Credit Line", "Mortgage", "Equipment Loan"] }
              },
              creditHistory: [
                { month: "2023-04-01", score: 692 },
                { month: "2023-05-01", score: 695 },
                { month: "2023-06-01", score: 688 },
                { month: "2023-07-01", score: 697 }, 
                { month: "2023-08-01", score: 700 },
                { month: "2023-09-01", score: 694 },
                { month: "2023-10-01", score: 702 },
                { month: "2023-11-01", score: 705 },
                { month: "2023-12-01", score: 698 },
                { month: "2024-01-01", score: 703 },
                { month: "2024-02-01", score: 706 },
                { month: "2024-03-01", score: 708 }
              ]
            },
            transunion: { 
              score: 710, 
              grade: "B",
              lastUpdated: "2024-03-13",
              utilization: { totalCredit: 35000, usedCredit: 8450, utilizationPercentage: 24.1 },
              paymentHistory: { onTimePercentage: 94, recentLatePayments: 1 },
              creditScoreFactors: {
                paymentHistory: { score: 77, rating: "GOOD", impact: "high" },
                amountOfDebt: { score: 64, rating: "FAIR", impact: "high" },
                lengthOfCreditHistory: { score: 91, rating: "VERY GOOD", impact: "medium", averageAccountAge: 12.8 },
                amountOfNewCredit: { score: 87, rating: "VERY GOOD", impact: "low", recentInquiries: 0 },
                creditMix: { score: 84, rating: "VERY GOOD", impact: "low", accountTypes: ["Credit Card", "Business Credit Line", "Mortgage", "Equipment Loan"] }
              },
              creditHistory: [
                { month: "2023-04-01", score: 694 },
                { month: "2023-05-01", score: 697 },
                { month: "2023-06-01", score: 690 },
                { month: "2023-07-01", score: 699 }, 
                { month: "2023-08-01", score: 702 },
                { month: "2023-09-01", score: 696 },
                { month: "2023-10-01", score: 704 },
                { month: "2023-11-01", score: 707 },
                { month: "2023-12-01", score: 700 },
                { month: "2024-01-01", score: 705 },
                { month: "2024-02-01", score: 708 },
                { month: "2024-03-01", score: 710 }
              ]
            },
          },
          riskIndicators: {
            irregularIncomePattern: true,
            highOverdraftFrequency: false,
            gamblingActivity: false,
            cryptocurrencyActivity: false,
            largeUnexplainedDeposits: false,
          },
          verificationId: "ver_michael_thompson",
          lastUpdated: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000 + 3 * 60 * 60 * 1000).toISOString(),
          bankAccounts: [
            {
              accountId: "acc_mt_business",
              accountType: "checking",
              accountNumber: "****9012",
              balance: 45200.50,
              bankName: "Wells Fargo Business",
              openedDate: "2018-06-20",
              currency: "USD",
              transactions: [],
              monthlyBalances: [],
            }
          ],
          transactionAnalysis: {
            totalTransactions: 287,
            avgMonthlySpending: 8900,
            topCategories: [
              { 
                category: "Business", 
                amount: 3200, 
                percentage: 36.0,
                transactionCount: 45,
                trend: "increasing",
                monthlyData: []
              }
            ],
            incomeStreams: [
              { 
                source: "Construction Business",
                frequency: "irregular",
                averageAmount: 15200,
                lastAmount: 18500,
                confidence: 75,
                category: "other"
              }
            ],
            recurringPayments: [
              { 
                merchant: "Business Loan",
                frequency: "monthly",
                averageAmount: 2100,
                category: "Business"
              }
            ],
          },
        }
      } else {
        // Default fallback for any other customer ID
        mockProfile = {
          customerId: customerId,
          customerInfo: {
            fullName: "SpringFin Member",
            email: "member@springfincu.com",
            phoneNumber: "+1 (555) 000-0000",
          },
          financialSummary: {
            totalBalance: 50000.00,
            monthlyIncome: 6000,
            monthlyExpenses: 4000,
            netCashFlow: 2000,
            accountAge: 24,
            overdraftCount: 0,
          },
          creditReports: {
            summary: {
              averageScore: 700,
              scoreVariance: 15,
              overallGrade: "B",
              riskLevel: "low",
              primaryBureau: "experian",
              majorDiscrepancies: [],
            },
            experian: { 
              score: 710, 
              grade: "B",
              lastUpdated: "2024-03-15",
              utilization: { totalCredit: 20000, usedCredit: 5000, utilizationPercentage: 25.0 },
              paymentHistory: { onTimePercentage: 95, recentLatePayments: 0 }
            },
            equifax: { 
              score: 695, 
              grade: "B",
              lastUpdated: "2024-03-15",
              utilization: { totalCredit: 20000, usedCredit: 5200, utilizationPercentage: 26.0 },
              paymentHistory: { onTimePercentage: 94, recentLatePayments: 1 }
            },
            transunion: { 
              score: 695, 
              grade: "B",
              lastUpdated: "2024-03-15",
              utilization: { totalCredit: 20000, usedCredit: 5100, utilizationPercentage: 25.5 },
              paymentHistory: { onTimePercentage: 95, recentLatePayments: 0 }
            },
          },
          riskIndicators: {
            irregularIncomePattern: false,
            highOverdraftFrequency: false,
            gamblingActivity: false,
            cryptocurrencyActivity: false,
            largeUnexplainedDeposits: false,
          },
          verificationId: "ver_default",
          lastUpdated: new Date().toISOString(),
          bankAccounts: [
            {
              accountId: "acc_default_checking",
              accountType: "checking",
              accountNumber: "****0000",
              balance: 50000.00,
              bankName: "SpringFin Credit Union",
              openedDate: "2022-01-01",
              currency: "USD",
              transactions: [],
              monthlyBalances: [],
            }
          ],
          transactionAnalysis: {
            totalTransactions: 100,
            avgMonthlySpending: 4000,
            topCategories: [
              { 
                category: "General", 
                amount: 4000, 
                percentage: 100.0,
                transactionCount: 100,
                trend: "stable",
                monthlyData: []
              }
            ],
            incomeStreams: [
              { 
                source: "Salary",
                frequency: "monthly",
                averageAmount: 6000,
                lastAmount: 6000,
                confidence: 90,
                category: "salary"
              }
            ],
            recurringPayments: [
              { 
                merchant: "Monthly Expenses",
                frequency: "monthly",
                averageAmount: 4000,
                category: "General"
              }
            ],
          },
        }
      }
      
      console.log(`[Mock API] Returning SpringFin customer profile for: ${mockProfile.customerInfo.fullName}`)
      return { data: mockProfile, success: true } as ApiResponse<T>
    }

    // Mock customer transactions
    if (endpoint.startsWith("/customers/") && endpoint.includes("/transactions")) {
      const customerId = endpoint.split("/")[2] // Assumes format /customers/:id/transactions
      // ... (existing mock transaction logic from your previous api.ts)
      // For brevity, I'll assume the transaction mock logic you had before is here.
      // If not, it needs to be added. Let's add a simplified version:
      const allTransactions: Transaction[] = [
        {
          id: "txn_1",
          accountId: "acc_chk_1",
          amount: -54.2,
          date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
          description: "Grocery Store Purchase",
          category: ["Groceries"],
          type: "debit",
          status: "posted",
        },
        {
          id: "txn_2",
          accountId: "acc_chk_1",
          amount: 6500.0,
          date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
          description: "Salary - Acme Corp",
          category: ["Income", "Salary"],
          type: "credit",
          status: "posted",
        },
      ]
      const url = new URL(endpoint, this.baseUrl)
      const page = Number.parseInt(url.searchParams.get("page") || "1", 10)
      const limit = Number.parseInt(url.searchParams.get("limit") || "10", 10)
      const total = allTransactions.length
      const paginatedData = allTransactions.slice((page - 1) * limit, page * limit)

      console.log(`[Mock API] Returning transactions for customer ${customerId}`)
      return {
        data: {
          data: paginatedData,
          pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
          success: true,
        } as T, // PaginatedResponse<Transaction>
        success: true,
      }
    }

    // Mock income analysis
    if (endpoint.startsWith("/customers/") && endpoint.includes("/income-analysis")) {
      const customerId = endpoint.split("/")[2]
      console.log(`[Mock API] Returning income analysis for customer ${customerId}`)
      return {
        data: {
          /* ... mock income analysis data ... */
        } as any,
        success: true,
      } as ApiResponse<T>
    }

    // Mock spending analysis
    if (endpoint.startsWith("/customers/") && endpoint.includes("/spending-analysis")) {
      const customerId = endpoint.split("/")[2]
      console.log(`[Mock API] Returning spending analysis for customer ${customerId}`)
      return {
        data: {
          /* ... mock spending analysis data ... */
        } as any,
        success: true,
      } as ApiResponse<T>
    }

    // Mock export
    if (endpoint.startsWith("/customers/") && endpoint.includes("/export")) {
      const customerId = endpoint.split("/")[2]
      console.log(`[Mock API] Returning export blob for customer ${customerId}`)
      const mockBlob = new Blob(["Mock export data"], { type: "text/plain" })
      return {
        data: mockBlob as any, // Blob is not JSON, special handling might be needed if request expects JSON
        success: true, // This structure might not be right for blob responses
      } as ApiResponse<T> // This needs careful handling for non-JSON responses
    }

    // Mock add note
    if (endpoint.startsWith("/customers/") && endpoint.includes("/notes") && method === "POST") {
      const customerId = endpoint.split("/")[2]
      console.log(`[Mock API] Adding note for customer ${customerId}`)
      return { data: { id: "note_mock_" + Date.now() } as any, success: true } as ApiResponse<T>
    }

    // Mock add flag
    if (endpoint.startsWith("/customers/") && endpoint.includes("/flags") && method === "POST") {
      const customerId = endpoint.split("/")[2]
      console.log(`[Mock API] Adding flag for customer ${customerId}`)
      return { data: { id: "flag_mock_" + Date.now() } as any, success: true } as ApiResponse<T>
    }

    // Default mock response
    return {
      data: {} as T,
      success: true,
    }
  }

  // Auth endpoints
  async login(credentials: LoginRequest): Promise<LoginResponse> {
    const response = await this.request<LoginResponse>("/auth/login", {
      method: "POST",
      body: JSON.stringify(credentials),
    })
    return response.data
  }

  async logout(): Promise<void> {
    await this.request("/auth/logout", { method: "POST" })
    this.token = null
  }

  async getCurrentUser(): Promise<User> {
    const response = await this.request<User>("/auth/me")
    return response.data
  }

  // Verification endpoints
  async getVerifications(params?: {
    page?: number
    limit?: number
    status?: string
    search?: string
    agent?: string
  }): Promise<PaginatedResponse<VerificationRequest>> {
    const queryParams = new URLSearchParams()
    if (params?.page) queryParams.set("page", String(params.page))
    if (params?.limit) queryParams.set("limit", String(params.limit))
    if (params?.status) queryParams.set("status", params.status)
    if (params?.search) queryParams.set("search", params.search)
    if (params?.agent) queryParams.set("agent", params.agent)

    const queryString = queryParams.toString()
    const endpoint = queryString ? `/verifications?${queryString}` : "/verifications"

    const response = await this.request<PaginatedResponse<VerificationRequest>>(endpoint)
    return response.data
  }

  async createVerification(data: CreateVerificationRequest): Promise<VerificationRequest> {
    const response = await this.request<VerificationRequest>("/verifications", {
      method: "POST",
      body: JSON.stringify(data),
    })
    return response.data
  }

  async createBulkVerifications(data: CreateVerificationRequest[]): Promise<{
    successful: VerificationRequest[]
    failed: Array<{ index: number; error: string; data: CreateVerificationRequest }>
  }> {
    const response = await this.request<{
      successful: VerificationRequest[]
      failed: Array<{ index: number; error: string; data: CreateVerificationRequest }>
    }>("/verifications/bulk", {
      method: "POST",
      body: JSON.stringify({ verifications: data }),
    })
    return response.data
  }

  async getVerification(id: string): Promise<VerificationRequest> {
    const response = await this.request<VerificationRequest>(`/verifications/${id}`)
    return response.data
  }

  async updateVerificationStatus(id: string, status: string): Promise<VerificationRequest> {
    const response = await this.request<VerificationRequest>(`/verifications/${id}/status`, {
      method: "PATCH",
      body: JSON.stringify({ status }),
    })
    return response.data
  }

  async resendVerification(id: string): Promise<void> {
    await this.request(`/verifications/${id}/resend`, { method: "POST" })
  }

  // Customer endpoints
  async getCustomers(params?: {
    page?: number
    limit?: number
    search?: string
  }): Promise<PaginatedResponse<CustomerFinancialProfile>> {
    const queryParams = new URLSearchParams(params as any).toString()
    const response = await this.request<PaginatedResponse<CustomerFinancialProfile>>(`/customers?${queryParams}`)
    return response.data
  }

  async getCustomer(id: string): Promise<CustomerFinancialProfile> {
    const response = await this.request<CustomerFinancialProfile>(`/customers/${id}`)
    return response.data
  }

  // Customer Financial Profile Endpoints (Illustrative - adapt to your actual API)
  async getCustomerFinancialProfile(customerId: string): Promise<CustomerFinancialProfile> {
    // SpringFin Credit Union - Direct call to the same endpoint logic
    console.log(`[Mock API] Fetching SpringFin financial profile for customer: ${customerId}`)
    await new Promise((resolve) => setTimeout(resolve, 700))

    // Use the same logic as the getMockResponse endpoint for consistency
    const response = await this.getMockResponse<CustomerFinancialProfile>(`/customers/${customerId}`)
    return response.data
  }

  async getCustomerTransactions(
    customerId: string,
    params?: {
      page?: number
      limit?: number
      startDate?: string
      endDate?: string
      category?: string
      accountId?: string
      type?: "debit" | "credit"
      status?: "pending" | "posted"
      search?: string
    },
  ): Promise<PaginatedResponse<Transaction>> {
    console.log(`[Mock API] Fetching transactions for customer: ${customerId}`, params)
    await new Promise((resolve) => setTimeout(resolve, 500))

    const allTransactions: Transaction[] = [
      // Sample transactions - expand this list for more variety
      {
        id: "txn_1",
        accountId: "acc_chk_1",
        amount: -54.2,
        date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
        description: "Grocery Store Purchase",
        category: ["Groceries"],
        type: "debit",
        status: "posted",
      },
      {
        id: "txn_2",
        accountId: "acc_chk_1",
        amount: 6500.0,
        date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
        description: "Salary - Acme Corp",
        category: ["Income", "Salary"],
        type: "credit",
        status: "posted",
      },
      {
        id: "txn_3",
        accountId: "acc_crd_1",
        amount: -85.0,
        date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
        description: "Netflix Subscription",
        category: ["Entertainment"],
        type: "debit",
        status: "posted",
      },
      {
        id: "txn_4",
        accountId: "acc_sav_1",
        amount: -200.0,
        date: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
        description: "Transfer to Checking",
        category: ["Transfers"],
        type: "debit",
        status: "posted",
      },
      {
        id: "txn_5",
        accountId: "acc_chk_1",
        amount: 200.0,
        date: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
        description: "Transfer from Savings",
        category: ["Transfers"],
        type: "credit",
        status: "posted",
      },
      {
        id: "txn_6",
        accountId: "acc_chk_1",
        amount: -120.0,
        date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
        description: "Restaurant - The Italian Place",
        category: ["Food & Dining", "Restaurants"],
        type: "debit",
        status: "posted",
      },
      {
        id: "txn_7",
        accountId: "acc_crd_1",
        amount: -30.5,
        date: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString(),
        description: "Coffee Shop",
        category: ["Food & Dining", "Coffee"],
        type: "debit",
        status: "posted",
      },
      {
        id: "txn_8",
        accountId: "acc_chk_1",
        amount: -70.0,
        date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
        description: "AT&T Internet Bill",
        category: ["Utilities", "Internet"],
        type: "debit",
        status: "posted",
      },
      {
        id: "txn_9",
        accountId: "acc_chk_1",
        amount: -1500.0,
        date: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000).toISOString(),
        description: "Rent Payment",
        category: ["Housing", "Rent"],
        type: "debit",
        status: "posted",
      },
      {
        id: "txn_10",
        accountId: "acc_crd_1",
        amount: -250.0,
        date: new Date(Date.now() - 9 * 24 * 60 * 60 * 1000).toISOString(),
        description: "Amazon Purchase",
        category: ["Shopping"],
        type: "debit",
        status: "pending",
      },
    ]

    // Basic filtering for mock
    let filteredTransactions = allTransactions
    if (params?.search) {
      filteredTransactions = filteredTransactions.filter((t) =>
        t.description.toLowerCase().includes(params.search!.toLowerCase()),
      )
    }
    if (params?.accountId) {
      filteredTransactions = filteredTransactions.filter((t) => t.accountId === params.accountId)
    }
    if (params?.type) {
      filteredTransactions = filteredTransactions.filter((t) => t.type === params.type)
    }
    // Add more filters as needed

    const page = params?.page || 1
    const limit = params?.limit || 10
    const total = filteredTransactions.length
    const paginatedData = filteredTransactions.slice((page - 1) * limit, page * limit)

    return {
      data: paginatedData,
      pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
      success: true,
    } as PaginatedResponse<Transaction>
  }

  async getCustomerIncomeAnalysis(customerId: string): Promise<any> {
    // Define a proper type for IncomeAnalysis
    console.log(`[Mock API] Fetching income analysis for customer: ${customerId}`)
    await new Promise((resolve) => setTimeout(resolve, 600))
    
    const baseAmount = 6500
    
    // Generate 12 months of history with clear progression (fixed values for consistent testing)
    const generateMonthlyHistory = () => {
      const months = []
      const currentDate = new Date()
      
      // Create clear variations for visual testing (deterministic values)
      const multipliers = [0.75, 0.82, 0.89, 0.94, 0.97, 1.02, 1.08, 1.15, 1.23, 1.18, 1.25, 1.32]
      
      for (let i = 11; i >= 0; i--) {
        const date = new Date(currentDate.getFullYear(), currentDate.getMonth() - i, 1)
        const monthName = date.toLocaleDateString('en-US', { month: 'short' })
        const year = date.getFullYear()
        
        // Use predetermined multipliers for clear visual differences
        const amount = Math.round(baseAmount * multipliers[11 - i])
        
        months.push({
          month: `${monthName} ${year}`,
          amount,
        })
      }
      return months
    }
    
    const history = generateMonthlyHistory()
    
    // Calculate averages
    const monthlyAverage = Math.round(history.reduce((sum, month) => sum + month.amount, 0) / history.length)
    const weeklyAverage = Math.round(monthlyAverage / 4.33) // ~4.33 weeks per month
    
    return {
      data: {
        // Average calculations
        averages: {
          monthly: monthlyAverage,
          weekly: weeklyAverage,
        },
        
        // Income sources with categories
        incomeSources: [
          {
            name: "Primary Salary",
            category: "Employment",
            source: "Acme Corp",
            amount: Math.round(baseAmount * 0.85),
            percentage: 85,
            frequency: "Monthly"
          },
          {
            name: "Freelance Work", 
            category: "Side Income",
            source: "Various Clients",
            amount: Math.round(baseAmount * 0.10),
            percentage: 10,
            frequency: "Irregular"
          },
          {
            name: "Investment Returns",
            category: "Passive Income", 
            source: "Stock Dividends",
            amount: Math.round(baseAmount * 0.03),
            percentage: 3,
            frequency: "Quarterly"
          },
          {
            name: "Other Benefits",
            category: "Benefits",
            source: "Government/Insurance", 
            amount: Math.round(baseAmount * 0.02),
            percentage: 2,
            frequency: "Monthly"
          }
        ],
        
        // Income breakdown by category
        categoryBreakdown: {
          "Employment": Math.round(baseAmount * 0.85),
          "Side Income": Math.round(baseAmount * 0.10), 
          "Passive Income": Math.round(baseAmount * 0.03),
          "Benefits": Math.round(baseAmount * 0.02)
        },
        
        // Legacy fields for backward compatibility
        primarySource: {
          name: "Acme Corp",
          type: "Salary",
          frequency: "Monthly",
          averageAmount: 6500,
          stabilityScore: 90,
          trend: "stable",
        },
        secondarySources: [
          { name: "Freelance Work", amount: Math.round(baseAmount * 0.10), frequency: "Irregular" },
          { name: "Investment Returns", amount: Math.round(baseAmount * 0.05), frequency: "Quarterly" }
        ],
        totalMonthlyIncome: baseAmount,
        employmentVerification: {
          status: "Verified",
          confidence: 95,
          employerNameMatch: true,
          consistentDeposits: true,
        },
        history,
      },
      success: true,
    }
  }

  async getCustomerSpendingAnalysis(customerId: string): Promise<any> {
    // Define a proper type for SpendingAnalysis
    console.log(`[Mock API] Fetching spending analysis for customer: ${customerId}`)
    await new Promise((resolve) => setTimeout(resolve, 650))
    return {
      data: {
        categories: [
          { name: "Housing", amount: 1500, percentage: 35, trend: "stable" },
          { name: "Food & Dining", amount: 600, percentage: 14, trend: "increasing" },
          { name: "Transportation", amount: 300, percentage: 7, trend: "stable" },
          { name: "Utilities", amount: 250, percentage: 6, trend: "stable" },
          { name: "Shopping", amount: 400, percentage: 9, trend: "decreasing" },
          { name: "Entertainment", amount: 200, percentage: 5, trend: "stable" },
        ],
        totalMonthlySpending: 4250,
        recurringPayments: [
          { merchant: "Netflix", amount: 15.99, category: "Entertainment" },
          { merchant: "AT&T", amount: 70.0, category: "Utilities" },
        ],
        spendingPatterns: {
          highestDay: "Friday",
          unusualAlerts: [],
        },
      },
      success: true,
    }
  }

  async exportCustomerReport(customerId: string, reportType: string, format: "pdf" | "excel" | "csv"): Promise<Blob> {
    console.log(`[Mock API] Exporting ${reportType} for customer ${customerId} as ${format}`)
    await new Promise((resolve) => setTimeout(resolve, 1200))
    const mockContent = `Mock ${format.toUpperCase()} report data for ${reportType}, Customer ID: ${customerId}`
    let mimeType = "text/plain"
    if (format === "pdf") mimeType = "application/pdf"
    if (format === "excel") mimeType = "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    if (format === "csv") mimeType = "text/csv"
    return new Blob([mockContent], { type: mimeType })
  }

  async addCustomerNote(customerId: string, note: { content: string; agentId: string }): Promise<any> {
    // Define Note type
    console.log(`[Mock API] Adding note for customer ${customerId}:`, note)
    await new Promise((resolve) => setTimeout(resolve, 400))
    return { data: { id: "note_" + Date.now(), ...note, createdAt: new Date().toISOString() }, success: true }
  }

  async flagCustomerAccount(customerId: string, flag: { type: string; reason: string; agentId: string }): Promise<any> {
    // Define Flag type
    console.log(`[Mock API] Flagging account for customer ${customerId}:`, flag)
    await new Promise((resolve) => setTimeout(resolve, 450))
    return { data: { id: "flag_" + Date.now(), ...flag, createdAt: new Date().toISOString() }, success: true }
  }

  // Ensure the existing getCustomers method in lib/api.ts returns CustomerFinancialProfile[]
  // or adapt the Customer List Page to use a simpler Customer type first and then fetch full profile on demand.
  // For this exercise, I'll assume getCustomers can return a list of objects that at least have
  // id, fullName, email, and enough for the list page. The full CustomerFinancialProfile will be fetched
  // when navigating to the detail page.

  // Modify existing getCustomers to return a list of basic customer info for the list page
  // The full CustomerFinancialProfile will be fetched by useCustomer hook on the [id] page.
  // This is a common pattern: list view has partial data, detail view has full data.
  // For now, I'll keep the mock in getCustomers as is, but this is a consideration for real implementation.
  // The useCustomers hook will use the existing getCustomers.
  // The useCustomer hook (for [id] page) will use getCustomerFinancialProfile.

  // Borrower verification endpoints
  async validateVerificationToken(token: string): Promise<{
    valid: boolean
    customerInfo?: { fullName: string; email: string }
  }> {
    const response = await this.request<{
      valid: boolean
      customerInfo?: { fullName: string; email: string }
    }>(`/verify/${token}/validate`)
    return response.data
  }

  async getBankConnectionUrl(token: string): Promise<{ connectionUrl: string }> {
    const response = await this.request<{ connectionUrl: string }>(`/verify/${token}/connect`)
    return response.data
  }

  async completeVerification(token: string): Promise<void> {
    await this.request(`/verify/${token}/complete`, { method: "POST" })
  }

  // Export endpoints
  async exportCustomerData(customerId: string, format: "pdf" | "excel" | "csv"): Promise<Blob> {
    // Always return mock blob for now
    const mockData = `Mock ${format.toUpperCase()} export data for customer ${customerId}`
    return new Blob([mockData], { type: "text/plain" })
  }
}

export const apiClient = new ApiClient(process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api")
