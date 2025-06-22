"use client"

import { CardContent } from "@/components/ui/card"

import { Card } from "@/components/ui/card"

import { useState, useMemo } from "react"
import { useRouter } from "next/navigation"
import { useCustomers } from "@/hooks/useCustomers" // Assuming this hook fetches basic customer list data
import { DataTable } from "@/components/shared/DataTable"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ActionDropdown } from "@/components/shared/ActionDropdown"
import { formatCurrency, formatRelativeTime } from "@/lib/utils"
import { Eye, Download, Search, UserCircle, BarChart3, AlertTriangle } from "lucide-react"
import { useDebounce } from "@/hooks/useDebounce"
import { StatsCard } from "@/components/admin/dashboard/StatsCard" // Reusing StatsCard

// Simplified customer type for the list, full profile fetched on detail page
interface CustomerListItem {
  id: string
  fullName: string
  email: string
  phoneNumber: string
  totalBalance: number
  creditScore?: number
  creditGrade?: string
  verificationId: string
  lastUpdated: string
  riskLevel?: "low" | "medium" | "high" | "unknown"
  isHighRisk: boolean
}

export default function CustomerListPage() {
  const router = useRouter()
  const [searchTerm, setSearchTerm] = useState("")
  const [filters, setFilters] = useState({
    status: "all",
    creditScoreRange: "all",
    riskLevel: "all",
    page: 1,
    limit: 10,
  })

  const debouncedSearchTerm = useDebounce(searchTerm, 300)

  // useCustomers hook might need adjustment if it doesn't support these specific filters
  // or if it returns a different data structure.
  // For now, we'll assume it can take a search param and we'll filter client-side for others.
  const {
    customers: rawCustomers, // Assuming this returns CustomerFinancialProfile[]
    pagination,
    isLoading,
    error,
    fetchCustomers, // To refetch if needed
  } = useCustomers({
    search: debouncedSearchTerm,
    page: filters.page,
    limit: filters.limit,
  })

  // Client-side filtering for mock (ideally done server-side)
  const customers = useMemo(() => {
    return (rawCustomers || [])
      .map(
        (c): CustomerListItem => ({
          id: c.customerId,
          fullName: c.customerInfo.fullName,
          email: c.customerInfo.email,
          phoneNumber: c.customerInfo.phoneNumber,
          totalBalance: c.financialSummary.totalBalance,
          creditScore: c.creditReports?.summary?.averageScore,
          creditGrade: c.creditReports?.summary?.overallGrade,
          verificationId: c.verificationId,
          lastUpdated: new Date(c.lastUpdated).toLocaleDateString(),
          riskLevel: c.creditReports?.summary?.riskLevel || "unknown",
                     isHighRisk:
             c.customerId === "cust_002_high_risk" ||
             (c.creditReports?.summary?.averageScore != null && c.creditReports.summary.averageScore < 650)
        }),
      )
      .filter((c) => {
        if (filters.riskLevel !== "all" && c.riskLevel !== filters.riskLevel) return false
        // Add more client-side filters if necessary for creditScoreRange, status
        return true
      })
  }, [rawCustomers, filters.riskLevel])

  const getCustomerInitials = (name: string) =>
    name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
  const getRiskColor = (level?: "low" | "medium" | "high" | "unknown") => {
    if (level === "high") return "bg-red-500"
    if (level === "medium") return "bg-yellow-500"
    return "bg-green-500"
  }
  const getCreditGradeVariant = (grade?: string): "default" | "secondary" | "destructive" | "outline" => {
    if (!grade) return "outline"
    if (["A", "B"].includes(grade)) return "default" // Greenish in default theme
    if (["C"].includes(grade)) return "secondary" // Yellowish
    return "destructive" // Reddish
  }

  const columns = [
    {
      key: "fullName",
      label: "Customer",
      render: (item: CustomerListItem) => (
        <div className="flex items-center space-x-3">
          <Avatar className="h-9 w-9">
            <AvatarImage src={`/placeholder.svg?text=${getCustomerInitials(item.fullName)}`} />
            <AvatarFallback>{getCustomerInitials(item.fullName)}</AvatarFallback>
          </Avatar>
          <div>
            <div className="font-medium">{item.fullName}</div>
            <a href={`mailto:${item.email}`} className="text-xs text-muted-foreground hover:underline">
              {item.email}
            </a>
          </div>
        </div>
      ),
    },
    {
      key: "creditScore",
      label: "Credit Score",
      render: (item: CustomerListItem) =>
        item.creditScore ? (
          <div className="flex items-center space-x-2">
            <span>{item.creditScore}</span>
            {item.creditGrade && <Badge variant={getCreditGradeVariant(item.creditGrade)}>{item.creditGrade}</Badge>}
          </div>
        ) : (
          <span className="text-muted-foreground">N/A</span>
        ),
    },
    {
      key: "totalBalance",
      label: "Total Balance",
      render: (item: CustomerListItem) =>
        item.totalBalance ? formatCurrency(item.totalBalance) : <span className="text-muted-foreground">N/A</span>,
    },
    {
      key: "riskLevel",
      label: "Risk Level",
      render: (item: CustomerListItem) =>
        item.riskLevel ? (
          <div className="flex items-center space-x-2">
            <span className={`h-2.5 w-2.5 rounded-full ${getRiskColor(item.riskLevel)}`} />
            <span className="capitalize">{item.riskLevel}</span>
          </div>
        ) : (
          <span className="text-muted-foreground">N/A</span>
        ),
    },
    {
      key: "verifiedDate",
      label: "Verified Date",
      render: (item: CustomerListItem) =>
        item.lastUpdated ? formatRelativeTime(item.lastUpdated) : <span className="text-muted-foreground">N/A</span>,
    },
    {
      key: "actions",
      label: "Actions",
      render: (item: CustomerListItem) => (
        <ActionDropdown
          actions={[
            { label: "View Profile", icon: Eye, onClick: () => router.push(`/admin/customers/${item.id}`) },
            {
              label: "Export Data",
              icon: Download,
              onClick: () => console.log("Export data for", item.id),
              separator: true,
            },
          ]}
        />
      ),
    },
  ]

  const handlePageChange = (page: number) => {
    setFilters((prev) => ({ ...prev, page }))
  }

  // Mock stats - replace with actual aggregated data
  const totalCustomers = pagination?.total || 0
  const avgCreditScore =
    customers.reduce((sum, c) => sum + (c.creditScore || 0), 0) / (customers.filter((c) => c.creditScore).length || 1)
  const highRiskCount = customers.filter((c) => c.riskLevel === "high").length

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Customers</h1>
          <p className="text-muted-foreground">View and manage customer financial profiles.</p>
        </div>
        <Button onClick={() => console.log("Export full list")}>
          <Download className="mr-2 h-4 w-4" /> Export List
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatsCard title="Total Customers" value={totalCustomers} icon={UserCircle} isLoading={isLoading} />
        <StatsCard
          title="Avg. Credit Score"
          value={avgCreditScore > 0 ? Math.round(avgCreditScore) : "N/A"}
          icon={BarChart3}
          isLoading={isLoading}
        />
        <StatsCard title="High-Risk Customers" value={highRiskCount} icon={AlertTriangle} isLoading={isLoading} />
      </div>

      <Card>
        <CardContent className="p-4 space-y-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-grow">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search by name, email, phone..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select
              value={filters.riskLevel}
              onValueChange={(value) => setFilters((prev) => ({ ...prev, riskLevel: value, page: 1 }))}
            >
              <SelectTrigger className="w-full md:w-[180px]">
                <SelectValue placeholder="Risk Level" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Risk Levels</SelectItem>
                <SelectItem value="low">Low Risk</SelectItem>
                <SelectItem value="medium">Medium Risk</SelectItem>
                <SelectItem value="high">High Risk</SelectItem>
              </SelectContent>
            </Select>
            {/* Add more filters for status, credit score range */}
          </div>

          {error && <p className="text-red-500">Error loading customers: {error}</p>}

          <DataTable
            columns={columns}
            data={customers}
            isLoading={isLoading}
            pagination={pagination || undefined} // Pass pagination if available
            onPageChange={handlePageChange}
            getRowId={(item: CustomerListItem) => item.id}
            onRowClick={(item: CustomerListItem) => router.push(`/admin/customers/${item.id}`)}
            emptyState={{
              icon: UserCircle,
              title: "No Customers Found",
              description: "No customers match your current filters. Try adjusting your search or filters.",
            }}
          />
        </CardContent>
      </Card>
    </div>
  )
}
