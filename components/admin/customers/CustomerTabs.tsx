"use client"

import { usePathname, useRouter } from "next/navigation"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs" // Assuming TabsContent is not needed here for navigation
import { LayoutDashboard, Landmark, ListChecks, TrendingUp, BarChartBig, FileDown } from "lucide-react"

interface CustomerTabsProps {
  customerId: string
}

const tabConfig = [
  { value: "", label: "Overview", icon: LayoutDashboard, href: (id: string) => `/admin/customers/${id}` },
  { value: "accounts", label: "Accounts", icon: Landmark, href: (id: string) => `/admin/customers/${id}/accounts` },
  {
    value: "transactions",
    label: "Transactions",
    icon: ListChecks,
    href: (id: string) => `/admin/customers/${id}/transactions`,
  },
  { value: "income", label: "Income", icon: TrendingUp, href: (id: string) => `/admin/customers/${id}/income` },
  { value: "spending", label: "Spending", icon: BarChartBig, href: (id: string) => `/admin/customers/${id}/spending` },
  { value: "reports", label: "Reports", icon: FileDown, href: (id: string) => `/admin/customers/${id}/reports` },
]

export function CustomerTabs({ customerId }: CustomerTabsProps) {
  const router = useRouter()
  const pathname = usePathname()

  // Determine active tab based on current pathname
  const segments = pathname.split("/")
  const lastSegment = segments[segments.length - 1]
  const activeTabValue = customerId === lastSegment ? "" : lastSegment

  const onTabChange = (value: string) => {
    const tab = tabConfig.find((t) => t.value === value)
    if (tab) {
      router.push(tab.href(customerId))
    }
  }

  return (
    <Tabs value={activeTabValue} onValueChange={onTabChange} className="w-full">
      <TabsList className="grid w-full grid-cols-3 sm:grid-cols-6">
        {tabConfig.map((tab) => (
          <TabsTrigger
            key={tab.value}
            value={tab.value}
            className="flex-col sm:flex-row sm:gap-2 h-auto py-2 sm:py-1.5"
          >
            <tab.icon className="h-4 w-4 mb-1 sm:mb-0" />
            {tab.label}
            {/* Add badge indicators here if needed, e.g., <Badge>3</Badge> */}
          </TabsTrigger>
        ))}
      </TabsList>
      {/* TabsContent will be rendered by the child page components based on the route */}
    </Tabs>
  )
}
