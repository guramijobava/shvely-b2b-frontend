"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { DateRangePicker } from "@/components/shared/DateRangePicker"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import { 
  ArrowLeft, 
  Copy, 
  ExternalLink, 
  Calendar,
  Users,
  MousePointer,
  TrendingUp,
  CheckCircle,
  XCircle,
  Clock,
  Phone,
  Mail,
  RefreshCw,
  FileText,
  Filter,
  ChevronDown,
  ChevronRight,
  AlertCircle,
  MessageSquare,
  Bell,
  Download
} from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import Link from "next/link"
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  AreaChart,
  Area,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  ResponsiveContainer,
  Tooltip
} from 'recharts'

interface ActivityEntry {
  timestamp: string
  type: "form_started" | "form_submitted" | "consent_given" | "bank_connection_attempted" | "bank_connection_failed" | "bank_connection_abandoned" | "completed" | "reminder_scheduled" | "reminder_sent"
  description: string
}

interface CampaignDetails {
  id: string
  publicId: string
  name: string
  description: string
  country: string
  status: "active" | "paused" | "completed"
  publicLink: string
  createdAt: string
  analytics: {
    clicks: number
    conversions: number
    conversionRate: number
    dailyStats: Array<{
      date: string
      clicks: number
      conversions: number
    }>
  }
  funnel: {
    clicks: number
    startedForm: number
    formSubmitted: number
    consentGiven: number
    completed: number
  }
  leads: Array<{
    id: string
    fullName: string
    email: string
    phoneNumber: string
    startedAt: string
    currentStep: "form_submitted" | "consent_given" | "bank_connection_failed" | "bank_connection_abandoned" | "completed"
    completedAt?: string
    verificationId?: string
    activityHistory: ActivityEntry[]
    nextReminderAt?: string
    reminderCount: number
  }>
}

export default function CampaignDetailsPage() {
  const params = useParams()
  const router = useRouter()
  const { toast } = useToast()
  const [dateRange, setDateRange] = useState("7")
  const [funnelDateRange, setFunnelDateRange] = useState("7")
  const [campaign, setCampaign] = useState<CampaignDetails | null>(null)
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState("all")
  const [currentPage, setCurrentPage] = useState(1)
  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set())
  const itemsPerPage = 10

  const campaignId = params.id as string

  useEffect(() => {
    // Mock data - in real app this would be an API call
    const mockCampaign: CampaignDetails = {
      id: campaignId,
      publicId: "1247856390",
      name: "Facebook Community Group",
      description: "Targeting local Facebook community groups for loan applications",
      country: "US",
      status: "active",
      publicLink: "https://verify.bankname.com/verify/public/1247856390",
      createdAt: "2024-01-15",
      analytics: {
        clicks: 240,
        conversions: 60,
        conversionRate: 25.0,
        dailyStats: [
          { date: "2024-01-15", clicks: 35, conversions: 9 },
          { date: "2024-01-16", clicks: 42, conversions: 11 },
          { date: "2024-01-17", clicks: 28, conversions: 7 },
          { date: "2024-01-18", clicks: 38, conversions: 10 },
          { date: "2024-01-19", clicks: 45, conversions: 12 },
          { date: "2024-01-20", clicks: 32, conversions: 6 },
          { date: "2024-01-21", clicks: 20, conversions: 5 }
        ]
      },
      funnel: {
        clicks: 240,
        startedForm: 145,
        formSubmitted: 95,
        consentGiven: 75,
        completed: 60
      },
      leads: [
        {
          id: "1",
          fullName: "Sarah Johnson",
          email: "sarah.johnson@email.com",
          phoneNumber: "+1 (555) 123-4567",
          startedAt: "2024-01-21T14:30:00Z",
          currentStep: "consent_given",
          activityHistory: [
            { timestamp: "2024-01-21T14:30:00Z", type: "form_started", description: "Started verification form" },
            { timestamp: "2024-01-21T14:35:00Z", type: "form_submitted", description: "Submitted personal information" },
            { timestamp: "2024-01-21T14:45:00Z", type: "consent_given", description: "Provided data sharing consent" },
            { timestamp: "2024-01-22T09:00:00Z", type: "reminder_scheduled", description: "First reminder scheduled for tomorrow" }
          ],
          nextReminderAt: "2024-01-22T14:45:00Z",
          reminderCount: 0
        },
        {
          id: "2",
          fullName: "Mike Chen",
          email: "mike.chen@email.com",
          phoneNumber: "+1 (555) 234-5678",
          startedAt: "2024-01-20T16:20:00Z",
          currentStep: "form_submitted",
          activityHistory: [
            { timestamp: "2024-01-20T16:20:00Z", type: "form_started", description: "Started verification form" },
            { timestamp: "2024-01-20T16:25:00Z", type: "form_submitted", description: "Submitted personal information" },
            { timestamp: "2024-01-21T16:25:00Z", type: "reminder_sent", description: "First reminder sent via email" }
          ],
          nextReminderAt: "2024-01-24T16:25:00Z",
          reminderCount: 1
        },
        {
          id: "3",
          fullName: "Lisa Rodriguez",
          email: "lisa.rodriguez@email.com",
          phoneNumber: "+1 (555) 345-6789",
          startedAt: "2024-01-19T11:15:00Z",
          currentStep: "bank_connection_failed",
          activityHistory: [
            { timestamp: "2024-01-19T11:15:00Z", type: "form_started", description: "Started verification form" },
            { timestamp: "2024-01-19T11:20:00Z", type: "form_submitted", description: "Submitted personal information" },
            { timestamp: "2024-01-19T11:25:00Z", type: "consent_given", description: "Provided data sharing consent" },
            { timestamp: "2024-01-19T11:30:00Z", type: "bank_connection_attempted", description: "Attempted to connect to Chase Bank" },
            { timestamp: "2024-01-19T11:35:00Z", type: "bank_connection_failed", description: "Bank connection failed - invalid credentials" },
            { timestamp: "2024-01-20T11:35:00Z", type: "reminder_sent", description: "First reminder sent via SMS" },
            { timestamp: "2024-01-22T11:35:00Z", type: "reminder_sent", description: "Second reminder sent via email" }
          ],
          nextReminderAt: "2024-01-27T11:35:00Z",
          reminderCount: 2
        },
        {
          id: "4",
          fullName: "John Smith",
          email: "john.smith@email.com",
          phoneNumber: "+1 (555) 456-7890",
          startedAt: "2024-01-21T09:15:00Z",
          currentStep: "completed",
          completedAt: "2024-01-21T09:28:00Z",
          verificationId: "ver_12345",
          activityHistory: [
            { timestamp: "2024-01-21T09:15:00Z", type: "form_started", description: "Started verification form" },
            { timestamp: "2024-01-21T09:18:00Z", type: "form_submitted", description: "Submitted personal information" },
            { timestamp: "2024-01-21T09:20:00Z", type: "consent_given", description: "Provided data sharing consent" },
            { timestamp: "2024-01-21T09:25:00Z", type: "bank_connection_attempted", description: "Connected to Wells Fargo" },
            { timestamp: "2024-01-21T09:28:00Z", type: "completed", description: "Verification completed successfully" }
          ],
          reminderCount: 0
        },
        {
          id: "5",
          fullName: "Emma Davis",
          email: "emma.davis@email.com",
          phoneNumber: "+1 (555) 567-8901",
          startedAt: "2024-01-20T13:45:00Z",
          currentStep: "completed",
          completedAt: "2024-01-20T14:02:00Z",
          verificationId: "ver_12346",
          activityHistory: [
            { timestamp: "2024-01-20T13:45:00Z", type: "form_started", description: "Started verification form" },
            { timestamp: "2024-01-20T13:50:00Z", type: "form_submitted", description: "Submitted personal information" },
            { timestamp: "2024-01-20T13:55:00Z", type: "consent_given", description: "Provided data sharing consent" },
            { timestamp: "2024-01-20T14:00:00Z", type: "bank_connection_attempted", description: "Connected to Bank of America" },
            { timestamp: "2024-01-20T14:02:00Z", type: "completed", description: "Verification completed successfully" }
          ],
          reminderCount: 0
        },
        {
          id: "6",
          fullName: "Alex Thompson",
          email: "alex.thompson@email.com",
          phoneNumber: "+1 (555) 678-9012",
          startedAt: "2024-01-21T11:30:00Z",
          currentStep: "bank_connection_abandoned",
          activityHistory: [
            { timestamp: "2024-01-21T11:30:00Z", type: "form_started", description: "Started verification form" },
            { timestamp: "2024-01-21T11:35:00Z", type: "form_submitted", description: "Submitted personal information" },
            { timestamp: "2024-01-21T11:40:00Z", type: "consent_given", description: "Provided data sharing consent" },
            { timestamp: "2024-01-21T11:43:00Z", type: "bank_connection_attempted", description: "Started bank connection process" },
            { timestamp: "2024-01-21T11:45:00Z", type: "bank_connection_abandoned", description: "User abandoned bank connection step" },
            { timestamp: "2024-01-22T11:45:00Z", type: "reminder_scheduled", description: "First reminder scheduled" }
          ],
          nextReminderAt: "2024-01-22T11:45:00Z",
          reminderCount: 0
        },
        {
          id: "7",
          fullName: "Jessica Brown",
          email: "jessica.brown@email.com",
          phoneNumber: "+1 (555) 789-0123",
          startedAt: "2024-01-20T15:20:00Z",
          currentStep: "completed",
          completedAt: "2024-01-20T15:35:00Z",
          verificationId: "ver_12347",
          activityHistory: [
            { timestamp: "2024-01-20T15:20:00Z", type: "form_started", description: "Started verification form" },
            { timestamp: "2024-01-20T15:25:00Z", type: "form_submitted", description: "Submitted personal information" },
            { timestamp: "2024-01-20T15:30:00Z", type: "consent_given", description: "Provided data sharing consent" },
            { timestamp: "2024-01-20T15:35:00Z", type: "completed", description: "Verification completed successfully" }
          ],
          reminderCount: 0
        },
        {
          id: "8",
          fullName: "David Wilson",
          email: "david.wilson@email.com",
          phoneNumber: "+1 (555) 890-1234",
          startedAt: "2024-01-19T10:15:00Z",
          currentStep: "form_submitted",
          activityHistory: [
            { timestamp: "2024-01-19T10:15:00Z", type: "form_started", description: "Started verification form" },
            { timestamp: "2024-01-19T10:20:00Z", type: "form_submitted", description: "Submitted personal information" },
            { timestamp: "2024-01-20T10:20:00Z", type: "reminder_sent", description: "First reminder sent via email" },
            { timestamp: "2024-01-22T10:20:00Z", type: "reminder_sent", description: "Second reminder sent via SMS" }
          ],
          nextReminderAt: "2024-01-27T10:20:00Z",
          reminderCount: 2
        },
        {
          id: "9",
          fullName: "Rachel Green",
          email: "rachel.green@email.com",
          phoneNumber: "+1 (555) 901-2345",
          startedAt: "2024-01-21T16:45:00Z",
          currentStep: "consent_given",
          activityHistory: [
            { timestamp: "2024-01-21T16:45:00Z", type: "form_started", description: "Started verification form" },
            { timestamp: "2024-01-21T16:50:00Z", type: "form_submitted", description: "Submitted personal information" },
            { timestamp: "2024-01-21T16:55:00Z", type: "consent_given", description: "Provided data sharing consent" },
            { timestamp: "2024-01-22T16:55:00Z", type: "reminder_scheduled", description: "First reminder scheduled" }
          ],
          nextReminderAt: "2024-01-22T16:55:00Z",
          reminderCount: 0
        },
        {
          id: "10",
          fullName: "Michael Taylor",
          email: "michael.taylor@email.com",
          phoneNumber: "+1 (555) 012-3456",
          startedAt: "2024-01-18T14:30:00Z",
          currentStep: "bank_connection_failed",
          activityHistory: [
            { timestamp: "2024-01-18T14:30:00Z", type: "form_started", description: "Started verification form" },
            { timestamp: "2024-01-18T14:35:00Z", type: "form_submitted", description: "Submitted personal information" },
            { timestamp: "2024-01-18T14:40:00Z", type: "consent_given", description: "Provided data sharing consent" },
            { timestamp: "2024-01-18T14:45:00Z", type: "bank_connection_attempted", description: "Attempted to connect to CitiBank" },
            { timestamp: "2024-01-18T14:50:00Z", type: "bank_connection_failed", description: "Bank connection failed - network timeout" },
            { timestamp: "2024-01-19T14:50:00Z", type: "reminder_sent", description: "First reminder sent via email" },
            { timestamp: "2024-01-21T14:50:00Z", type: "reminder_sent", description: "Second reminder sent via SMS" }
          ],
          nextReminderAt: "2024-01-25T14:50:00Z",
          reminderCount: 2
        },
        {
          id: "11",
          fullName: "Amanda Davis",
          email: "amanda.davis@email.com",
          phoneNumber: "+1 (555) 123-4567",
          startedAt: "2024-01-19T09:20:00Z",
          currentStep: "completed",
          completedAt: "2024-01-19T09:38:00Z",
          verificationId: "ver_12348",
          activityHistory: [
            { timestamp: "2024-01-19T09:20:00Z", type: "form_started", description: "Started verification form" },
            { timestamp: "2024-01-19T09:25:00Z", type: "form_submitted", description: "Submitted personal information" },
            { timestamp: "2024-01-19T09:30:00Z", type: "consent_given", description: "Provided data sharing consent" },
            { timestamp: "2024-01-19T09:38:00Z", type: "completed", description: "Verification completed successfully" }
          ],
          reminderCount: 0
        },
        {
          id: "12",
          fullName: "Brian Martinez",
          email: "brian.martinez@email.com",
          phoneNumber: "+1 (555) 234-5678",
          startedAt: "2024-01-20T11:10:00Z",
          currentStep: "bank_connection_abandoned",
          activityHistory: [
            { timestamp: "2024-01-20T11:10:00Z", type: "form_started", description: "Started verification form" },
            { timestamp: "2024-01-20T11:15:00Z", type: "form_submitted", description: "Submitted personal information" },
            { timestamp: "2024-01-20T11:20:00Z", type: "consent_given", description: "Provided data sharing consent" },
            { timestamp: "2024-01-20T11:25:00Z", type: "bank_connection_attempted", description: "Started bank connection process" },
            { timestamp: "2024-01-20T11:30:00Z", type: "bank_connection_abandoned", description: "User abandoned bank connection step" },
            { timestamp: "2024-01-21T11:30:00Z", type: "reminder_sent", description: "First reminder sent via email" }
          ],
          nextReminderAt: "2024-01-24T11:30:00Z",
          reminderCount: 1
        },
        {
          id: "13",
          fullName: "Sophie Anderson",
          email: "sophie.anderson@email.com",
          phoneNumber: "+1 (555) 345-6789",
          startedAt: "2024-01-21T13:45:00Z",
          currentStep: "form_submitted",
          activityHistory: [
            { timestamp: "2024-01-21T13:45:00Z", type: "form_started", description: "Started verification form" },
            { timestamp: "2024-01-21T13:50:00Z", type: "form_submitted", description: "Submitted personal information" },
            { timestamp: "2024-01-22T13:50:00Z", type: "reminder_scheduled", description: "First reminder scheduled" }
          ],
          nextReminderAt: "2024-01-22T13:50:00Z",
          reminderCount: 0
        },
        {
          id: "14",
          fullName: "Kevin Lee",
          email: "kevin.lee@email.com",
          phoneNumber: "+1 (555) 456-7890",
          startedAt: "2024-01-18T16:30:00Z",
          currentStep: "completed",
          completedAt: "2024-01-18T16:45:00Z",
          verificationId: "ver_12349",
          activityHistory: [
            { timestamp: "2024-01-18T16:30:00Z", type: "form_started", description: "Started verification form" },
            { timestamp: "2024-01-18T16:35:00Z", type: "form_submitted", description: "Submitted personal information" },
            { timestamp: "2024-01-18T16:40:00Z", type: "consent_given", description: "Provided data sharing consent" },
            { timestamp: "2024-01-18T16:45:00Z", type: "completed", description: "Verification completed successfully" }
          ],
          reminderCount: 0
        },
        {
          id: "15",
          fullName: "Nicole White",
          email: "nicole.white@email.com",
          phoneNumber: "+1 (555) 567-8901",
          startedAt: "2024-01-17T12:15:00Z",
          currentStep: "consent_given",
          activityHistory: [
            { timestamp: "2024-01-17T12:15:00Z", type: "form_started", description: "Started verification form" },
            { timestamp: "2024-01-17T12:20:00Z", type: "form_submitted", description: "Submitted personal information" },
            { timestamp: "2024-01-17T12:25:00Z", type: "consent_given", description: "Provided data sharing consent" },
            { timestamp: "2024-01-18T12:25:00Z", type: "reminder_sent", description: "First reminder sent via SMS" },
            { timestamp: "2024-01-20T12:25:00Z", type: "reminder_sent", description: "Second reminder sent via email" }
          ],
          nextReminderAt: "2024-01-24T12:25:00Z",
          reminderCount: 2
        }
      ]
    }

    setTimeout(() => {
      setCampaign(mockCampaign)
      setLoading(false)
    }, 500)
  }, [campaignId])

  const copyToClipboard = async (url: string) => {
    try {
      await navigator.clipboard.writeText(url)
      toast({
        title: "Link copied!",
        description: "The verification link has been copied to your clipboard.",
      })
    } catch (error) {
      toast({
        title: "Copy failed",
        description: "Unable to copy link to clipboard.",
        variant: "destructive",
      })
    }
  }

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case "active":
        return "default"
      case "paused":
        return "secondary"
      case "completed":
        return "outline"
      default:
        return "outline"
    }
  }

  const getCustomerStatusIcon = (status: string) => {
    switch (status) {
      case "form_submitted":
        return <Clock className="h-4 w-4 text-yellow-500" />
      case "consent_given":
        return <CheckCircle className="h-4 w-4 text-blue-500" />
      case "bank_connection_failed":
        return <XCircle className="h-4 w-4 text-red-500" />
      case "bank_connection_abandoned":
        return <AlertCircle className="h-4 w-4 text-orange-500" />
      case "completed":
        return <CheckCircle className="h-4 w-4 text-green-500" />
      default:
        return <Clock className="h-4 w-4 text-gray-500" />
    }
  }

  const getCustomerStatusText = (status: string) => {
    switch (status) {
      case "form_submitted":
        return "Form Submitted"
      case "consent_given":
        return "Consent Given"
      case "bank_connection_failed":
        return "Connection Failed"
      case "bank_connection_abandoned":
        return "Connection Abandoned"
      case "completed":
        return "Completed"
      default:
        return "Unknown"
    }
  }

  const getCurrentStepDate = (lead: any) => {
    // Find the most recent activity that matches the current step
    const stepTypeMap: { [key: string]: string } = {
      "form_submitted": "form_submitted",
      "consent_given": "consent_given", 
      "bank_connection_failed": "bank_connection_failed",
      "bank_connection_abandoned": "bank_connection_abandoned",
      "completed": "completed"
    }
    
    const targetType = stepTypeMap[lead.currentStep]
    if (!targetType) return null
    
    // Find the latest activity of this type
    const matchingActivity = lead.activityHistory
      .filter((activity: any) => activity.type === targetType)
      .sort((a: any, b: any) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())[0]
    
    return matchingActivity ? matchingActivity.timestamp : null
  }

  const getActivityIcon = (type: string) => {
    switch (type) {
      case "form_started":
        return <FileText className="h-3 w-3 text-blue-500" />
      case "form_submitted":
        return <CheckCircle className="h-3 w-3 text-green-500" />
      case "consent_given":
        return <CheckCircle className="h-3 w-3 text-blue-500" />
      case "bank_connection_attempted":
        return <RefreshCw className="h-3 w-3 text-yellow-500" />
      case "bank_connection_failed":
        return <XCircle className="h-3 w-3 text-red-500" />
      case "bank_connection_abandoned":
        return <AlertCircle className="h-3 w-3 text-orange-500" />
      case "completed":
        return <CheckCircle className="h-3 w-3 text-green-500" />
      case "reminder_scheduled":
        return <Bell className="h-3 w-3 text-gray-500" />
      case "reminder_sent":
        return <MessageSquare className="h-3 w-3 text-blue-500" />
      default:
        return <Clock className="h-3 w-3 text-gray-500" />
    }
  }

  const formatRelativeTime = (dateString: string) => {
    const now = new Date()
    const date = new Date(dateString)
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60))
    
    if (diffInHours < 1) return "Just now"
    if (diffInHours < 24) return `${diffInHours}h ago`
    
    const diffInDays = Math.floor(diffInHours / 24)
    if (diffInDays < 7) return `${diffInDays}d ago`
    
    const diffInWeeks = Math.floor(diffInDays / 7)
    return `${diffInWeeks}w ago`
  }

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  const getCountryDisplay = (countryCode: string) => {
    switch (countryCode) {
      case "US":
        return { flag: "🇺🇸", name: "United States" }
      default:
        return { flag: "🌍", name: "Unknown" }
    }
  }

  const toggleRowExpansion = (leadId: string) => {
    const newExpanded = new Set(expandedRows)
    if (newExpanded.has(leadId)) {
      newExpanded.delete(leadId)
    } else {
      newExpanded.add(leadId)
    }
    setExpandedRows(newExpanded)
  }

  const getFilteredLeads = () => {
    if (!campaign) return []
    
    if (activeTab === "all") {
      return campaign.leads
    }
    
    return campaign.leads.filter(lead => lead.currentStep === activeTab)
  }

  const getPaginatedLeads = () => {
    const filtered = getFilteredLeads()
    const startIndex = (currentPage - 1) * itemsPerPage
    return filtered.slice(startIndex, startIndex + itemsPerPage)
  }

  const getTotalPages = () => {
    return Math.ceil(getFilteredLeads().length / itemsPerPage)
  }

  const getTabCounts = () => {
    if (!campaign) return {}
    
    return {
      all: campaign.leads.length,
      form_submitted: campaign.leads.filter(l => l.currentStep === "form_submitted").length,
      consent_given: campaign.leads.filter(l => l.currentStep === "consent_given").length,
      bank_connection_failed: campaign.leads.filter(l => l.currentStep === "bank_connection_failed").length,
      bank_connection_abandoned: campaign.leads.filter(l => l.currentStep === "bank_connection_abandoned").length,
      completed: campaign.leads.filter(l => l.currentStep === "completed").length,
    }
  }

  const exportToCSV = () => {
    const leadsToExport = getFilteredLeads()
    const csvHeaders = [
      'Full Name',
      'Email',
      'Phone Number',
      'Current Step',
      'Started At',
      'Completed At',
      'Verification ID',
      'Reminder Count',
      'Campaign Country'
    ]
    
    const csvData = leadsToExport.map(lead => [
      lead.fullName,
      lead.email,
      lead.phoneNumber,
      getCustomerStatusText(lead.currentStep),
      formatDateTime(lead.startedAt),
      lead.completedAt ? formatDateTime(lead.completedAt) : '',
      lead.verificationId || '',
      lead.reminderCount.toString(),
      getCountryDisplay(campaign?.country || 'US').name
    ])
    
    const csvContent = [
      csvHeaders.join(','),
      ...csvData.map(row => row.map(field => `"${field}"`).join(','))
    ].join('\n')
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob)
      link.setAttribute('href', url)
      const tabName = activeTab === 'all' ? 'All' : getCustomerStatusText(activeTab)
      const fileName = `campaign-${campaign?.name?.replace(/\s+/g, '-').toLowerCase()}-${tabName.replace(/\s+/g, '-').toLowerCase()}-leads.csv`
      link.setAttribute('download', fileName)
      link.style.visibility = 'hidden'
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      
      toast({
        title: "Export successful",
        description: `${leadsToExport.length} leads exported to CSV file.`,
      })
    }
  }

  if (loading) {
    return (
      <div className="p-6 space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="grid grid-cols-4 gap-4 mb-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-24 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  if (!campaign) {
    return (
      <div className="p-6">
        <div className="text-center py-8">
          <h2 className="text-xl font-semibold text-red-600">Campaign Not Found</h2>
          <p className="text-muted-foreground">The requested campaign could not be found.</p>
          <Link href="/admin/campaigns" className="mt-4 inline-block">
            <Button>Back to Campaigns</Button>
          </Link>
        </div>
      </div>
    )
  }

  const tabCounts = getTabCounts()
  const funnelData = [
    { name: "Link Clicks", value: campaign.funnel.clicks, percentage: 100, color: "#3b82f6" },
    { name: "Started Form", value: campaign.funnel.startedForm, percentage: (campaign.funnel.startedForm / campaign.funnel.clicks) * 100, color: "#10b981" },
    { name: "Form Submitted", value: campaign.funnel.formSubmitted, percentage: (campaign.funnel.formSubmitted / campaign.funnel.clicks) * 100, color: "#8b5cf6" },
    { name: "Consent Given", value: campaign.funnel.consentGiven, percentage: (campaign.funnel.consentGiven / campaign.funnel.clicks) * 100, color: "#f59e0b" },
    { name: "Completed", value: campaign.funnel.completed, percentage: (campaign.funnel.completed / campaign.funnel.clicks) * 100, color: "#059669" }
  ]

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center space-x-4">
        <Button variant="ghost" size="sm" asChild>
          <Link href="/admin/campaigns">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Campaigns
          </Link>
        </Button>
      </div>

      <div className="bg-white border border-gray-200 rounded-xl p-4 sm:p-6 lg:p-8 mb-6">
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between space-y-4 sm:space-y-0">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-black">
            {campaign.name}
          </h1>
          <Select 
            value={campaign.status} 
            onValueChange={(value: "active" | "paused" | "completed") => {
              setCampaign(prev => prev ? { ...prev, status: value } : null)
              toast({
                title: "Status updated",
                description: `Campaign status changed to ${value}.`,
              })
            }}
          >
            <SelectTrigger className="w-full sm:w-36 border border-gray-300 hover:border-blue-400 transition-colors">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="active">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span>Active</span>
                </div>
              </SelectItem>
              <SelectItem value="paused">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                  <span>Paused</span>
                </div>
              </SelectItem>
              <SelectItem value="completed">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-gray-500 rounded-full"></div>
                  <span>Completed</span>
                </div>
              </SelectItem>
            </SelectContent>
          </Select>
        </div>
        
                  <div className="space-y-4">
            <p className="text-base sm:text-lg text-gray-700 leading-relaxed">
              {campaign.description}
            </p>
            
            <div className="flex flex-wrap items-center gap-3">
              <div className="flex items-center space-x-2 bg-gray-50/80 px-3 py-2 rounded-lg">
                <Calendar className="h-4 w-4 text-blue-600" />
                <span className="text-sm font-medium text-gray-700">
                  Created {formatDate(campaign.createdAt)}
                </span>
              </div>
              
              <div className="flex items-center space-x-2 bg-blue-50/80 px-3 py-2 rounded-lg">
                <span className="text-lg">{getCountryDisplay(campaign.country).flag}</span>
                <span className="text-sm font-medium text-gray-700">
                  {getCountryDisplay(campaign.country).name}
                </span>
              </div>
            </div>
          </div>
      </div>

      {/* Campaign Link */}
      <Card>
        <CardHeader>
          <CardTitle>Campaign Link</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-2 p-3 bg-gray-50 rounded-lg">
            <code className="flex-1 text-sm font-mono break-all text-gray-600">
              {campaign.publicLink}
            </code>
            <Button size="sm" variant="outline" onClick={() => copyToClipboard(campaign.publicLink)}>
              <Copy className="h-4 w-4" />
            </Button>
            <Button size="sm" variant="outline" onClick={() => window.open(campaign.publicLink, "_blank")}>
              <ExternalLink className="h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Analytics Charts */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0">
          <h2 className="text-xl font-semibold text-gray-900">Analytics Overview</h2>
          <div className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-3">
            <Label htmlFor="analyticsDateRange" className="text-sm font-medium text-gray-700">Period:</Label>
            <Select value={dateRange} onValueChange={setDateRange}>
              <SelectTrigger className="w-full sm:w-32 border border-gray-300 hover:border-blue-400 transition-colors">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="7">7 days</SelectItem>
                <SelectItem value="14">14 days</SelectItem>
                <SelectItem value="30">30 days</SelectItem>
                <SelectItem value="90">90 days</SelectItem>
                <SelectItem value="custom">Custom range</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Clicks</CardTitle>
            <MousePointer className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold mb-4">{campaign.analytics.clicks}</div>
            <div className="h-32">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={campaign.analytics.dailyStats}>
                  <Line 
                    type="monotone" 
                    dataKey="clicks" 
                    stroke="#3b82f6" 
                    strokeWidth={2}
                    dot={false}
                  />
                  <Tooltip 
                    labelFormatter={(label) => `Date: ${label}`}
                    formatter={(value: any) => [`${value} clicks`, 'Clicks']}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Conversions</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold mb-4">{campaign.analytics.conversions}</div>
            <div className="h-32">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={campaign.analytics.dailyStats}>
                  <Bar 
                    dataKey="conversions" 
                    fill="#10b981"
                    radius={[2, 2, 0, 0]}
                  />
                  <Tooltip 
                    labelFormatter={(label) => `Date: ${label}`}
                    formatter={(value: any) => [`${value} conversions`, 'Conversions']}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Conversion Rate</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold mb-4">{campaign.analytics.conversionRate}%</div>
            <div className="h-32">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={campaign.analytics.dailyStats.map(day => ({
                  ...day,
                  rate: day.clicks > 0 ? ((day.conversions / day.clicks) * 100).toFixed(1) : 0
                }))}>
                  <Area 
                    type="monotone" 
                    dataKey="rate" 
                    stroke="#8b5cf6" 
                    fill="#8b5cf6"
                    fillOpacity={0.3}
                  />
                  <Tooltip 
                    labelFormatter={(label) => `Date: ${label}`}
                    formatter={(value: any) => [`${value}%`, 'Conversion Rate']}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Incomplete</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold mb-4">{campaign.leads.filter(lead => lead.currentStep !== 'completed').length}</div>
            <div className="h-32">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={[
                      { name: 'Completed', value: campaign.leads.filter(lead => lead.currentStep === 'completed').length, color: '#10b981' },
                      { name: 'Incomplete', value: campaign.leads.filter(lead => lead.currentStep !== 'completed').length, color: '#f59e0b' }
                    ]}
                    cx="50%"
                    cy="50%"
                    innerRadius={20}
                    outerRadius={40}
                    dataKey="value"
                  >
                    <Cell fill="#10b981" />
                    <Cell fill="#f59e0b" />
                  </Pie>
                  <Tooltip formatter={(value: any, name: any) => [`${value}`, name]} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
        </div>
      </div>

      {/* Conversion Funnel - Vertical Bars */}
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0">
            <CardTitle>Conversion Funnel</CardTitle>
            <div className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-3">
              <Label htmlFor="funnelDateRange" className="text-sm font-medium text-gray-700">Period:</Label>
              <Select value={funnelDateRange} onValueChange={setFunnelDateRange}>
                <SelectTrigger className="w-full sm:w-32 border border-gray-300 hover:border-blue-400 transition-colors">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="7">7 days</SelectItem>
                  <SelectItem value="14">14 days</SelectItem>
                  <SelectItem value="30">30 days</SelectItem>
                  <SelectItem value="90">90 days</SelectItem>
                  <SelectItem value="custom">Custom range</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={funnelData}
                margin={{
                  top: 20,
                  right: 30,
                  left: 20,
                  bottom: 60,
                }}
              >
                <XAxis 
                  dataKey="name" 
                  angle={-45}
                  textAnchor="end"
                  height={80}
                  interval={0}
                  fontSize={12}
                />
                <YAxis />
                <Tooltip 
                  formatter={(value: any, name: any) => [`${value}`, 'Count']}
                  labelFormatter={(label) => `${label}`}
                  content={({ active, payload, label }) => {
                    if (active && payload && payload.length) {
                      const data = payload[0].payload;
                      return (
                        <div className="bg-white p-3 border rounded shadow-lg">
                          <p className="font-medium">{label}</p>
                          <p className="text-sm">
                            <span style={{ color: data.color }}>●</span> Count: {data.value}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            Percentage: {data.percentage.toFixed(1)}%
                          </p>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Bar 
                  dataKey="value" 
                  radius={[4, 4, 0, 0]}
                >
                  {funnelData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Lead Management with Tabs */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Lead Management</CardTitle>
            <Button onClick={exportToCSV} variant="outline" size="sm">
              <Download className="h-4 w-4 mr-2" />
              Export {activeTab === 'all' ? 'All' : getCustomerStatusText(activeTab)} ({getFilteredLeads().length})
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-6">
              <TabsTrigger value="all">All ({tabCounts.all})</TabsTrigger>
              <TabsTrigger value="form_submitted">Form Submitted ({tabCounts.form_submitted})</TabsTrigger>
              <TabsTrigger value="consent_given">Consent Given ({tabCounts.consent_given})</TabsTrigger>
              <TabsTrigger value="bank_connection_failed">Failed ({tabCounts.bank_connection_failed})</TabsTrigger>
              <TabsTrigger value="bank_connection_abandoned">Abandoned ({tabCounts.bank_connection_abandoned})</TabsTrigger>
              <TabsTrigger value="completed">Completed ({tabCounts.completed})</TabsTrigger>
            </TabsList>
            
            <TabsContent value={activeTab} className="mt-6">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-12"></TableHead>
                    <TableHead>Customer</TableHead>
                    <TableHead>Current Step</TableHead>
                    <TableHead>Started</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {getPaginatedLeads().map((lead) => (
                    <>
                      <TableRow key={lead.id} className="cursor-pointer hover:bg-gray-50">
                        <TableCell>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => toggleRowExpansion(lead.id)}
                            className="p-0 h-auto"
                          >
                            {expandedRows.has(lead.id) ? (
                              <ChevronDown className="h-4 w-4" />
                            ) : (
                              <ChevronRight className="h-4 w-4" />
                            )}
                          </Button>
                        </TableCell>
                        <TableCell>
                          <div className="space-y-1">
                            <div className="flex items-center space-x-2">
                              {lead.currentStep === "completed" ? (
                                <Link 
                                  href={`/admin/customers/${lead.verificationId?.replace('ver_', 'cust_')}`}
                                  className="font-medium text-blue-600 hover:text-blue-800 hover:underline flex items-center space-x-1"
                                >
                                  <span>{lead.fullName}</span>
                                  <ExternalLink className="h-3 w-3" />
                                </Link>
                              ) : (
                                <span className="font-medium">{lead.fullName}</span>
                              )}
                            </div>
                            <div className="text-sm text-muted-foreground">{lead.email}</div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="space-y-1">
                            <div className="flex items-center space-x-2">
                              {getCustomerStatusIcon(lead.currentStep)}
                              <span className="text-sm">{getCustomerStatusText(lead.currentStep)}</span>
                            </div>
                            {getCurrentStepDate(lead) && (
                              <div className="text-xs text-muted-foreground">
                                {formatDate(getCurrentStepDate(lead))}
                              </div>
                            )}
                          </div>
                        </TableCell>
                        <TableCell className="text-sm">
                          {formatDate(lead.startedAt)}
                        </TableCell>
                      </TableRow>
                      
                      {expandedRows.has(lead.id) && (
                        <TableRow>
                          <TableCell colSpan={4} className="bg-gray-50 p-6">
                            <div className="space-y-4">
                              {/* Activity History */}
                              <div>
                                <h4 className="font-semibold text-sm mb-3">Activity History</h4>
                                <div className="space-y-3">
                                  {lead.activityHistory.map((activity, index) => (
                                    <div key={index} className="flex items-start space-x-3">
                                      <div className="flex-shrink-0 mt-1">
                                        {getActivityIcon(activity.type)}
                                      </div>
                                      <div className="flex-1 space-y-1">
                                        <div className="text-sm">{activity.description}</div>
                                        <div className="text-xs text-muted-foreground">
                                          {formatDateTime(activity.timestamp)}
                                        </div>
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              </div>
                              
                              {/* Reminder Information */}
                              {lead.currentStep !== "completed" && (
                                <div className="border-t pt-4">
                                  <h4 className="font-semibold text-sm mb-2">Automated Follow-up System</h4>
                                  <div className="bg-blue-50 p-3 rounded-lg space-y-2">
                                    <div className="text-sm text-blue-800">
                                      <strong>Reminder Schedule:</strong> We send 3 automated reminders to customers who haven't completed their verification:
                                    </div>
                                    <ul className="text-sm text-blue-700 ml-4 space-y-1">
                                      <li>• <strong>1st reminder:</strong> 1 day after last activity</li>
                                      <li>• <strong>2nd reminder:</strong> 3 days after last activity</li>
                                      <li>• <strong>3rd reminder:</strong> 1 week after last activity</li>
                                    </ul>
                                    <div className="text-sm text-blue-800 mt-2">
                                      <strong>Current Status:</strong> {lead.reminderCount} of 3 reminders sent
                                      {lead.nextReminderAt && (
                                        <span className="block">
                                          <strong>Next reminder:</strong> {formatDateTime(lead.nextReminderAt)}
                                        </span>
                                      )}
                                    </div>
                                  </div>
                                </div>
                              )}
                              
                              {/* Completion Info */}
                              {lead.currentStep === "completed" && lead.verificationId && (
                                <div className="border-t pt-4">
                                  <h4 className="font-semibold text-sm mb-2">Verification Details</h4>
                                  <div className="bg-green-50 p-3 rounded-lg">
                                    <div className="text-sm text-green-800">
                                      <strong>Verification ID:</strong> {lead.verificationId}
                                    </div>
                                    <div className="text-sm text-green-800">
                                      <strong>Completed:</strong> {lead.completedAt && formatDateTime(lead.completedAt)}
                                    </div>
                                  </div>
                                </div>
                              )}
                            </div>
                          </TableCell>
                        </TableRow>
                      )}
                    </>
                  ))}
                </TableBody>
              </Table>
              
              {/* Pagination */}
              {getTotalPages() > 1 && (
                <div className="flex items-center justify-between mt-4">
                  <div className="text-sm text-muted-foreground">
                    Showing {(currentPage - 1) * itemsPerPage + 1} to {Math.min(currentPage * itemsPerPage, getFilteredLeads().length)} of {getFilteredLeads().length} results
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                      disabled={currentPage === 1}
                    >
                      Previous
                    </Button>
                    <div className="flex items-center space-x-1">
                      {Array.from({ length: getTotalPages() }, (_, i) => i + 1).map(page => (
                        <Button
                          key={page}
                          variant={currentPage === page ? "default" : "outline"}
                          size="sm"
                          onClick={() => setCurrentPage(page)}
                          className="w-8 h-8 p-0"
                        >
                          {page}
                        </Button>
                      ))}
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentPage(prev => Math.min(getTotalPages(), prev + 1))}
                      disabled={currentPage === getTotalPages()}
                    >
                      Next
                    </Button>
                  </div>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
} 