"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger,
  DialogDescription,
  DialogFooter
} from "@/components/ui/dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator
} from "@/components/ui/dropdown-menu"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { 
  Plus, 
  Search, 
  Copy, 
  ExternalLink, 
  BarChart3, 
  Users, 
  MousePointer, 
  TrendingUp,
  Megaphone,
  MoreHorizontal,
  Eye,
  Pause,
  Play,
  Trash2
} from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface Campaign {
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
  }
}

export default function CampaignsPage() {
  const { toast } = useToast()
  const [searchTerm, setSearchTerm] = useState("")
  const [showCreateDialog, setShowCreateDialog] = useState(false)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [showPauseDialog, setShowPauseDialog] = useState(false)
  const [selectedCampaign, setSelectedCampaign] = useState<Campaign | null>(null)
  const [newCampaign, setNewCampaign] = useState<{
    name: string
    description: string
    country: string
    status: "active" | "paused" | "completed"
  }>({
    name: "",
    description: "",
    country: "US",
    status: "active"
  })

  // Mock campaigns data
  const [campaigns, setCampaigns] = useState<Campaign[]>([
    {
      id: "1",
      publicId: "1247856390",
      name: "Facebook Community Group",
      description: "Targeting local Facebook community groups for loan applications",
      country: "US",
      status: "active",
      publicLink: "https://verify.bankname.com/verify/public/1247856390",
      createdAt: "2024-01-15",
      analytics: {
        clicks: 156,
        conversions: 42,
        conversionRate: 26.9
      }
    },
    {
      id: "2",
      publicId: "9384756210", 
      name: "Email Newsletter Q1",
      description: "Monthly newsletter campaign for Q1 2024",
      country: "US",
      status: "active",
      publicLink: "https://verify.bankname.com/verify/public/9384756210",
      createdAt: "2024-01-01",
      analytics: {
        clicks: 89,
        conversions: 31,
        conversionRate: 34.8
      }
    },
    {
      id: "3",
      publicId: "5672891043",
      name: "Website Banner",
      description: "Main website banner for home loan promotions", 
      country: "US",
      status: "paused",
      publicLink: "https://verify.bankname.com/verify/public/5672891043",
      createdAt: "2023-12-20",
      analytics: {
        clicks: 234,
        conversions: 67,
        conversionRate: 28.6
      }
    }
  ])

  const filteredCampaigns = campaigns.filter(campaign =>
    campaign.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    campaign.description.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handleCreateCampaign = () => {
    if (!newCampaign.name.trim()) {
      toast({
        title: "Campaign name required",
        description: "Please enter a campaign name.",
        variant: "destructive",
      })
      return
    }

    // Generate secure 10-digit publicId
    const publicId = Math.floor(1000000000 + Math.random() * 9000000000).toString()
    
    const campaign: Campaign = {
      id: Date.now().toString(),
      publicId: publicId,
      name: newCampaign.name,
      description: newCampaign.description,
      country: newCampaign.country,
      status: newCampaign.status,
      publicLink: `https://verify.bankname.com/verify/public/${publicId}`,
      createdAt: new Date().toISOString().split('T')[0],
      analytics: {
        clicks: 0,
        conversions: 0,
        conversionRate: 0
      }
    }

    setCampaigns([campaign, ...campaigns])
    setNewCampaign({ name: "", description: "", country: "US", status: "active" })
    setShowCreateDialog(false)

    toast({
      title: "Campaign created",
      description: "Your new campaign has been created successfully.",
    })
  }

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

  const handleDeleteCampaign = () => {
    if (selectedCampaign) {
      setCampaigns(campaigns.filter(c => c.id !== selectedCampaign.id))
      setShowDeleteDialog(false)
      setSelectedCampaign(null)
      toast({
        title: "Campaign deleted",
        description: "The campaign has been permanently deleted.",
      })
    }
  }

  const handleTogglePause = () => {
    if (selectedCampaign) {
      const newStatus = selectedCampaign.status === "active" ? "paused" : "active"
      setCampaigns(campaigns.map(c => 
        c.id === selectedCampaign.id 
          ? { ...c, status: newStatus }
          : c
      ))
      setShowPauseDialog(false)
      setSelectedCampaign(null)
      toast({
        title: `Campaign ${newStatus}`,
        description: `The campaign has been ${newStatus}.`,
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

  // Calculate total stats
  const totalStats = campaigns.reduce((acc, campaign) => ({
    clicks: acc.clicks + campaign.analytics.clicks,
    conversions: acc.conversions + campaign.analytics.conversions,
  }), { clicks: 0, conversions: 0 })

  const totalConversionRate = totalStats.clicks > 0 
    ? Math.round((totalStats.conversions / totalStats.clicks) * 100) 
    : 0

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Campaign Management</h1>
          <p className="text-muted-foreground">
            Create and manage public verification link campaigns for social media, email, and website integration.
          </p>
        </div>
        <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Create Campaign
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Campaign</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Campaign Name</Label>
                <Input
                  id="name"
                  placeholder="e.g., Facebook Community Group"
                  value={newCampaign.name}
                  onChange={(e) => setNewCampaign(prev => ({ ...prev, name: e.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  placeholder="Brief description of this campaign..."
                  value={newCampaign.description}
                  onChange={(e) => setNewCampaign(prev => ({ ...prev, description: e.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="country">Country</Label>
                <Select
                  value={newCampaign.country}
                  onValueChange={(value: string) => 
                    setNewCampaign(prev => ({ ...prev, country: value }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="US">
                      <div className="flex items-center space-x-2">
                        <span>🇺🇸</span>
                        <span>United States</span>
                      </div>
                    </SelectItem>
                    <SelectItem value="coming_soon" disabled>
                      <div className="flex items-center space-x-2 text-muted-foreground">
                        <span>🌍</span>
                        <span>Other countries (Coming Soon)</span>
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-xs text-muted-foreground">
                  We're working on extending our network to more countries.
                </p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <Select
                  value={newCampaign.status}
                  onValueChange={(value: "active" | "paused" | "completed") => 
                    setNewCampaign(prev => ({ ...prev, status: value }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="paused">Paused</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setShowCreateDialog(false)}>
                  Cancel
                </Button>
                <Button onClick={handleCreateCampaign}>
                  Create Campaign
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Campaigns</CardTitle>
            <Megaphone className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{campaigns.length}</div>
            <p className="text-xs text-muted-foreground">
              {campaigns.filter(c => c.status === "active").length} active
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Clicks</CardTitle>
            <MousePointer className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalStats.clicks}</div>
            <p className="text-xs text-muted-foreground">
              Across all campaigns
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Conversions</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalStats.conversions}</div>
            <p className="text-xs text-muted-foreground">
              Completed verifications
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Conversion Rate</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalConversionRate}%</div>
            <p className="text-xs text-muted-foreground">
              Average across campaigns
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Campaigns Table */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Campaigns</CardTitle>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search campaigns..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 w-64"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {filteredCampaigns.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <Megaphone className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No campaigns found.</p>
              <p className="text-sm">Create your first campaign to get started.</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Campaign Name</TableHead>
                  <TableHead>Country</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-center">Clicks</TableHead>
                  <TableHead className="text-center">Conversions</TableHead>
                  <TableHead className="text-center">Rate</TableHead>
                  <TableHead className="w-[50px]"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredCampaigns.map((campaign) => (
                  <TableRow key={campaign.id}>
                    <TableCell>
                      <div className="space-y-1">
                        <div className="font-medium">{campaign.name}</div>
                        <div className="text-sm text-muted-foreground">{campaign.description}</div>
                        <div className="text-xs text-muted-foreground">
                          Created on {formatDate(campaign.createdAt)}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <span>{getCountryDisplay(campaign.country).flag}</span>
                        <span className="text-sm">{getCountryDisplay(campaign.country).name}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant={getStatusBadgeVariant(campaign.status)}>
                        {campaign.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-center font-medium">
                      {campaign.analytics.clicks}
                    </TableCell>
                    <TableCell className="text-center font-medium">
                      {campaign.analytics.conversions}
                    </TableCell>
                    <TableCell className="text-center font-medium">
                      {campaign.analytics.conversionRate}%
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem 
                            onClick={() => window.open(`/admin/campaigns/${campaign.id}`, '_blank')}
                          >
                            <Eye className="mr-2 h-4 w-4" />
                            View Details
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => copyToClipboard(campaign.publicLink)}>
                            <Copy className="mr-2 h-4 w-4" />
                            Copy Link
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem 
                            onClick={() => {
                              setSelectedCampaign(campaign)
                              setShowPauseDialog(true)
                            }}
                          >
                            {campaign.status === "active" ? (
                              <>
                                <Pause className="mr-2 h-4 w-4" />
                                Pause Campaign
                              </>
                            ) : (
                              <>
                                <Play className="mr-2 h-4 w-4" />
                                Resume Campaign
                              </>
                            )}
                          </DropdownMenuItem>
                          <DropdownMenuItem 
                            onClick={() => {
                              setSelectedCampaign(campaign)
                              setShowDeleteDialog(true)
                            }}
                            className="text-red-600"
                          >
                            <Trash2 className="mr-2 h-4 w-4" />
                            Delete Campaign
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Delete Confirmation Dialog */}
      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Campaign</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete "{selectedCampaign?.name}"? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDeleteDialog(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDeleteCampaign}>
              Delete Campaign
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Pause/Resume Confirmation Dialog */}
      <Dialog open={showPauseDialog} onOpenChange={setShowPauseDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {selectedCampaign?.status === "active" ? "Pause" : "Resume"} Campaign
            </DialogTitle>
            <DialogDescription>
              Are you sure you want to {selectedCampaign?.status === "active" ? "pause" : "resume"} "{selectedCampaign?.name}"?
              {selectedCampaign?.status === "active" && " The public link will stop working while paused."}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowPauseDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleTogglePause}>
              {selectedCampaign?.status === "active" ? "Pause" : "Resume"} Campaign
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
} 