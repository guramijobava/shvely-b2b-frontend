"use client"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useAuth } from "@/hooks/useAuth"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  LayoutDashboard,
  FileCheck,
  Users,
  Settings,
  ChevronLeft,
  ChevronRight,
  LogOut,
  Megaphone,
} from "lucide-react"
import Image from "next/image"

interface SidebarProps {
  isCollapsed: boolean
  onToggle: () => void
  className?: string
}

export function Sidebar({ isCollapsed, onToggle, className }: SidebarProps) {
  const pathname = usePathname()
  const { user, logout } = useAuth()

  const navigation = [
    {
      name: "Dashboard",
      href: "/admin/dashboard",
      icon: LayoutDashboard,
      badge: null,
    },
    {
      name: "Verifications",
      href: "/admin/verifications",
      icon: FileCheck,
      badge: 5, // Mock pending count
    },
    {
      name: "Campaigns",
      href: "/admin/campaigns",
      icon: Megaphone,
      badge: null,
    },
    {
      name: "Customers",
      href: "/admin/customers",
      icon: Users,
      badge: null,
    },
    {
      name: "Settings",
      href: "/admin/settings",
      icon: Settings,
      badge: null,
    },
  ]

  const handleLogout = async () => {
    try {
      await logout()
    } catch (error) {
      console.error("Logout failed:", error)
    }
  }

  const getUserInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
  }

  const getRoleBadgeVariant = (role: string) => {
    switch (role) {
      case "admin":
        return "default"
      case "supervisor":
        return "secondary"
      default:
        return "outline"
    }
  }

  return (
    <div
      className={cn(
        "relative flex flex-col bg-white border-r border-gray-200 transition-all duration-300 h-full",
        isCollapsed ? "w-20" : "w-64", // Increased collapsed width to 80px for 48px logo + padding
        className,
      )}
    >
      {/* Header */}
      <div className={cn("flex items-center p-4", isCollapsed ? "justify-center" : "justify-between")}>
        {isCollapsed ? (
          // Collapsed state - centered 48x48 symbol
          <div className="flex items-center justify-center">
            <Image
              src="/logo-symbol.svg"
              alt="Shvely"
              width={48}
              height={48}
              className="h-12 w-12 transition-all duration-300"
            />
          </div>
        ) : (
          // Expanded state - left-aligned full logo
          <>
            <div className="flex items-center">
              <Image
                src="/logo.svg"
                alt="Shvely"
                width={120}
                height={40}
                className="h-10 w-auto max-w-[120px] transition-all duration-300"
              />
            </div>
            <Button variant="ghost" size="sm" onClick={onToggle} className="h-8 w-8 p-0 hidden md:flex flex-shrink-0">
              <ChevronLeft className="h-4 w-4" />
            </Button>
          </>
        )}

        {/* Collapse button for collapsed state */}
        {isCollapsed && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onToggle}
            className="h-8 w-8 p-0 hidden md:flex absolute right-2 top-4"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        )}
      </div>

      <Separator />

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2">
        {navigation.map((item) => {
          const isActive = pathname.startsWith(item.href)
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "flex items-center rounded-lg text-sm font-medium transition-all duration-200 group",
                isActive
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "text-gray-600 hover:bg-gray-100 hover:text-gray-900",
                isCollapsed ? "justify-center px-2 py-3" : "space-x-3 px-3 py-2",
              )}
            >
              <item.icon className={cn("flex-shrink-0", isCollapsed ? "h-6 w-6" : "h-5 w-5")} />
              {!isCollapsed && (
                <>
                  <span className="flex-1">{item.name}</span>
                  {item.badge && (
                    <Badge variant={isActive ? "secondary" : "outline"} className="ml-auto">
                      {item.badge}
                    </Badge>
                  )}
                </>
              )}
            </Link>
          )
        })}
      </nav>

      <Separator />

      {/* User section at bottom */}
      <div className="p-4">
        {isCollapsed ? (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="w-full h-12 p-0">
                <Avatar className="h-10 w-10">
                  <AvatarImage src="/placeholder.svg" alt={user?.name} />
                  <AvatarFallback className="bg-primary text-primary-foreground text-sm">
                    {user?.name ? getUserInitials(user.name) : "U"}
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent side="right" align="end" className="w-56">
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium leading-none">{user?.name}</p>
                  <p className="text-xs leading-none text-muted-foreground">{user?.email}</p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link href="/admin/settings">
                  <Settings className="mr-2 h-4 w-4" />
                  <span>Settings</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleLogout} className="text-red-600">
                <LogOut className="mr-2 h-4 w-4" />
                <span>Log out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ) : (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="w-full justify-start p-2 h-auto">
                <div className="flex items-center space-x-3 w-full">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src="/placeholder.svg" alt={user?.name} />
                    <AvatarFallback className="bg-primary text-primary-foreground text-xs">
                      {user?.name ? getUserInitials(user.name) : "U"}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 text-left min-w-0">
                    <p className="text-sm font-medium truncate">{user?.name}</p>
                    <div className="flex items-center space-x-2">
                      <Badge variant={getRoleBadgeVariant(user?.role || "")} className="text-xs">
                        {user?.role}
                      </Badge>
                    </div>
                  </div>
                </div>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent side="right" align="end" className="w-56">
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium leading-none">{user?.name}</p>
                  <p className="text-xs leading-none text-muted-foreground">{user?.email}</p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link href="/admin/settings">
                  <Settings className="mr-2 h-4 w-4" />
                  <span>Settings</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleLogout} className="text-red-600">
                <LogOut className="mr-2 h-4 w-4" />
                <span>Log out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>
    </div>
  )
}
