"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { 
  Settings, 
  User, 
  Shield, 
  Bell, 
  Mail, 
  Database,
  Key,
  Palette,
  Globe,
  Lock
} from "lucide-react"

export default function SettingsPage() {
  const settingsCategories = [
    {
      title: "Account Settings",
      description: "Manage your profile and account preferences",
      icon: User,
      items: [
        "Profile Information",
        "Account Security",
        "Two-Factor Authentication",
        "Account Deletion"
      ]
    },
    {
      title: "Security & Privacy",
      description: "Configure security settings and privacy controls",
      icon: Shield,
      items: [
        "Password Policy",
        "Session Management",
        "Access Logs",
        "Data Retention"
      ]
    },
    {
      title: "Notifications",
      description: "Control how and when you receive notifications",
      icon: Bell,
      items: [
        "Email Notifications",
        "Push Notifications",
        "SMS Alerts",
        "Notification Schedule"
      ]
    },
    {
      title: "Email Configuration",
      description: "Setup email templates and delivery settings",
      icon: Mail,
      items: [
        "SMTP Configuration",
        "Email Templates",
        "Delivery Settings",
        "Bounce Management"
      ]
    },
    {
      title: "API & Integrations",
      description: "Manage API keys and third-party integrations",
      icon: Key,
      items: [
        "API Keys",
        "Webhooks",
        "Third-party Integrations",
        "Rate Limiting"
      ]
    },
    {
      title: "System Configuration",
      description: "Configure system-wide settings and preferences",
      icon: Database,
      items: [
        "Database Settings",
        "Cache Configuration",
        "Logging Settings",
        "Backup Configuration"
      ]
    },
    {
      title: "User Interface",
      description: "Customize the look and feel of the application",
      icon: Palette,
      items: [
        "Theme Settings",
        "Branding",
        "Custom CSS",
        "Layout Options"
      ]
    },
    {
      title: "Localization",
      description: "Configure language and regional settings",
      icon: Globe,
      items: [
        "Language Settings",
        "Time Zone",
        "Date Formats",
        "Currency Settings"
      ]
    }
  ]

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
          <p className="text-muted-foreground">
            Configure application settings and preferences.
          </p>
        </div>
        <Badge variant="secondary" className="px-3 py-1">
          Demo Mode
        </Badge>
      </div>

      {/* Demo Notice */}
      <Card className="border-amber-200 bg-amber-50">
        <CardHeader className="pb-3">
          <div className="flex items-center space-x-2">
            <Lock className="h-5 w-5 text-amber-600" />
            <CardTitle className="text-amber-800">Settings Not Available</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <CardDescription className="text-amber-700">
            The settings functionality is not available in this demo version. In a production environment, 
            this page would allow administrators to configure various aspects of the bank verification platform 
            including security settings, notifications, integrations, and system preferences.
          </CardDescription>
        </CardContent>
      </Card>

      {/* Settings Categories Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {settingsCategories.map((category, index) => (
          <Card key={index} className="relative opacity-60 cursor-not-allowed">
            <CardHeader className="pb-3">
              <div className="flex items-center space-x-2">
                <category.icon className="h-5 w-5 text-muted-foreground" />
                <CardTitle className="text-lg">{category.title}</CardTitle>
              </div>
              <CardDescription>{category.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {category.items.map((item, itemIndex) => (
                  <li 
                    key={itemIndex} 
                    className="text-sm text-muted-foreground flex items-center space-x-2"
                  >
                    <div className="w-1 h-1 bg-muted-foreground rounded-full" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
            
            {/* Overlay to indicate disabled state */}
            <div className="absolute inset-0 bg-white/20 rounded-lg" />
          </Card>
        ))}
      </div>
    </div>
  )
} 