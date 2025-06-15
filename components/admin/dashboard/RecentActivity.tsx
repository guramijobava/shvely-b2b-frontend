"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { LoadingSpinner } from "@/components/shared/LoadingSpinner"
import { EmptyState } from "@/components/shared/EmptyState"
import { formatRelativeTime, getStatusBadgeVariant } from "@/lib/utils"
import { FileCheck, Users, Clock, ExternalLink } from "lucide-react"
import Link from "next/link"

interface ActivityItem {
  id: string
  type: "verification_sent" | "verification_completed" | "customer_registered"
  title: string
  description: string
  timestamp: string
  status?: string
  customerName?: string
  href?: string
}

interface RecentActivityProps {
  activities?: ActivityItem[]
  isLoading?: boolean
}

export function RecentActivity({ activities = [], isLoading = false }: RecentActivityProps) {
  const getActivityIcon = (type: string) => {
    switch (type) {
      case "verification_sent":
        return <FileCheck className="h-4 w-4 text-blue-600" />
      case "verification_completed":
        return <FileCheck className="h-4 w-4 text-green-600" />
      case "customer_registered":
        return <Users className="h-4 w-4 text-purple-600" />
      default:
        return <Clock className="h-4 w-4 text-gray-600" />
    }
  }

  const getCustomerInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
  }

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <LoadingSpinner size="md" />
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Recent Activity</CardTitle>
        <Button variant="outline" size="sm" asChild>
          <Link href="/admin/activity">
            View All
            <ExternalLink className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      </CardHeader>
      <CardContent>
        {activities.length === 0 ? (
          <EmptyState
            icon={Clock}
            title="No recent activity"
            description="Activity will appear here as verifications are processed and customers interact with the system."
          />
        ) : (
          <div className="space-y-4">
            {activities.map((activity) => (
              <div
                key={activity.id}
                className="flex items-start space-x-4 p-3 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <div className="flex-shrink-0 mt-1">{getActivityIcon(activity.type)}</div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium text-gray-900">{activity.title}</p>
                    <span className="text-xs text-muted-foreground">{formatRelativeTime(activity.timestamp)}</span>
                  </div>

                  <p className="text-sm text-muted-foreground mt-1">{activity.description}</p>

                  <div className="flex items-center space-x-3 mt-2">
                    {activity.customerName && (
                      <div className="flex items-center space-x-2">
                        <Avatar className="h-6 w-6">
                          <AvatarImage src="/placeholder.svg" alt={activity.customerName} />
                          <AvatarFallback className="text-xs">
                            {getCustomerInitials(activity.customerName)}
                          </AvatarFallback>
                        </Avatar>
                        <span className="text-xs text-muted-foreground">{activity.customerName}</span>
                      </div>
                    )}

                    {activity.status && (
                      <Badge variant={getStatusBadgeVariant(activity.status)} className="text-xs">
                        {activity.status.replace("_", " ")}
                      </Badge>
                    )}

                    {activity.href && (
                      <Button variant="ghost" size="sm" asChild>
                        <Link href={activity.href} className="text-xs">
                          View Details
                        </Link>
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
