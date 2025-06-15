"use client"

import { usePathname } from "next/navigation"
import Link from "next/link"
import { ChevronRight, Home } from "lucide-react"
import { cn } from "@/lib/utils"

export function Breadcrumb() {
  const pathname = usePathname()

  // Generate breadcrumb items from pathname
  const generateBreadcrumbs = () => {
    const segments = pathname.split("/").filter(Boolean)
    const breadcrumbs = []

    // Always start with Dashboard
    breadcrumbs.push({
      label: "Dashboard",
      href: "/admin/dashboard",
      isActive: pathname === "/admin/dashboard",
    })

    // Skip 'admin' segment and process the rest
    const relevantSegments = segments.slice(1)
    let currentPath = "/admin"

    relevantSegments.forEach((segment, index) => {
      currentPath += `/${segment}`
      const isLast = index === relevantSegments.length - 1

      // Format segment name
      const label = segment
        .split("-")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ")

      // Skip if it's the dashboard segment (already added)
      if (segment !== "dashboard") {
        breadcrumbs.push({
          label,
          href: currentPath,
          isActive: isLast,
        })
      }
    })

    return breadcrumbs
  }

  const breadcrumbs = generateBreadcrumbs()

  return (
    <nav className="flex items-center space-x-1 text-sm text-muted-foreground">
      <Home className="h-4 w-4" />
      {breadcrumbs.map((crumb, index) => (
        <div key={crumb.href} className="flex items-center space-x-1">
          {index > 0 && <ChevronRight className="h-4 w-4" />}
          {crumb.isActive ? (
            <span className="font-medium text-foreground">{crumb.label}</span>
          ) : (
            <Link
              href={crumb.href}
              className={cn("hover:text-foreground transition-colors", index === 0 && "font-medium")}
            >
              {crumb.label}
            </Link>
          )}
        </div>
      ))}
    </nav>
  )
}
