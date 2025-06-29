"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { LoadingSpinner } from "@/components/shared/LoadingSpinner"
import { EmptyState } from "@/components/shared/EmptyState"
import { formatRelativeTime, getStatusBadgeVariant } from "@/lib/utils"
import { CheckCircle, Send, Clock, ExternalLink, AlertTriangle, Eye } from "lucide-react"
import Link from "next/link"

interface ActivityItem {
  id: string
  type: "verification_sent" | "verification_completed" | "verification_expiring"
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
        return <Send className="h-4 w-4 text-blue-600" />
      case "verification_completed":
        return <CheckCircle className="h-4 w-4 text-green-600" />
      case "verification_expiring":
        return <AlertTriangle className="h-4 w-4 text-orange-600" />
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
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Just Completed */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <CheckCircle className="h-5 w-5 text-green-600" />
            <span>Just Completed</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {activities.filter(a => a.type === "verification_completed").length === 0 ? (
            <EmptyState
              icon={CheckCircle}
              title="No recent completions"
              description="Completed verifications will appear here."
            />
          ) : (
            <div className="space-y-3">
              {activities
                .filter(a => a.type === "verification_completed")
                .slice(0, 3)
                .map((activity) => (
                <div key={activity.id} className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src="/placeholder.svg" alt={activity.customerName} />
                    <AvatarFallback className="text-xs bg-green-100 text-green-700">
                      {getCustomerInitials(activity.customerName || "")}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900">{activity.customerName}</p>
                    <p className="text-xs text-muted-foreground">{formatRelativeTime(activity.timestamp)}</p>
                  </div>
                  <Button size="sm" variant="outline" asChild>
                    <Link href={activity.href || "#"}>
                      <Eye className="h-3 w-3 mr-1" />
                      View Data
                    </Link>
                  </Button>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Recently Sent */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Send className="h-5 w-5 text-blue-600" />
            <span>Recently Sent</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {activities.filter(a => a.type === "verification_sent").length === 0 ? (
            <EmptyState
              icon={Send}
              title="No recent sends"
              description="Recently sent verifications will appear here."
            />
          ) : (
            <div className="space-y-3">
              {activities
                .filter(a => a.type === "verification_sent")
                .slice(0, 3)
                .map((activity) => (
                <div key={activity.id} className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src="/placeholder.svg" alt={activity.customerName} />
                    <AvatarFallback className="text-xs bg-blue-100 text-blue-700">
                      {getCustomerInitials(activity.customerName || "")}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900">{activity.customerName}</p>
                    <p className="text-xs text-muted-foreground">{formatRelativeTime(activity.timestamp)}</p>
                  </div>
                  <Badge variant={getStatusBadgeVariant(activity.status || "")} className="text-xs">
                    {activity.status === "sent" ? "Waiting" : activity.status}
                  </Badge>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Expiring Soon */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <AlertTriangle className="h-5 w-5 text-orange-600" />
            <span>Expiring Soon</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {activities.filter(a => a.type === "verification_expiring").length === 0 ? (
            <EmptyState
              icon={Clock}
              title="No expiring requests"
              description="Verifications nearing expiration will appear here."
            />
          ) : (
            <div className="space-y-3">
              {activities
                .filter(a => a.type === "verification_expiring")
                .slice(0, 3)
                .map((activity) => (
                <div key={activity.id} className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src="/placeholder.svg" alt={activity.customerName} />
                    <AvatarFallback className="text-xs bg-orange-100 text-orange-700">
                      {getCustomerInitials(activity.customerName || "")}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900">{activity.customerName}</p>
                    <p className="text-xs text-muted-foreground">Expires in 2 days</p>
                  </div>
                  <Button size="sm" variant="outline" asChild>
                    <Link href={activity.href || "#"}>
                      Remind
                    </Link>
                  </Button>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
