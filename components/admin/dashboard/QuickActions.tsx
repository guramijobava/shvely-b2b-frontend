"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Plus, Upload } from "lucide-react"
import Link from "next/link"

export function QuickActions() {
  return (
    <Card>
      <CardHeader className="pb-4">
        <CardTitle className="text-lg font-semibold">Quick Actions</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <Button asChild className="w-full h-14 justify-start">
          <Link href="/admin/verifications/send">
            <Plus className="h-5 w-5 mr-3 flex-shrink-0" />
            <div className="flex flex-col items-start">
              <span className="font-medium">Send New Verification</span>
              <span className="text-xs opacity-80">Single customer request</span>
            </div>
          </Link>
        </Button>

        <Button asChild variant="outline" className="w-full h-14 justify-start">
          <Link href="/admin/verifications/bulk">
            <Upload className="h-5 w-5 mr-3 flex-shrink-0" />
            <div className="flex flex-col items-start">
              <span className="font-medium">Bulk Upload</span>
              <span className="text-xs text-muted-foreground">CSV with multiple customers</span>
            </div>
          </Link>
        </Button>
      </CardContent>
    </Card>
  )
} 