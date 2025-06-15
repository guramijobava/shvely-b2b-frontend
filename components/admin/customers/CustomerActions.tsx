"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuSubContent,
  DropdownMenuPortal,
} from "@/components/ui/dropdown-menu"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"
import { apiClient } from "@/lib/api"
import { useReportGeneration } from "@/hooks/useReportGeneration"
import { MoreVertical, Download, MessageSquare, CalendarPlus, Printer, Flag, Edit3, AlertCircle } from "lucide-react"

interface CustomerActionsProps {
  customerId: string
  customerEmail: string // For "Send Message"
}

export function CustomerActions({ customerId, customerEmail }: CustomerActionsProps) {
  const { toast } = useToast()
  const { generateReport, isGenerating } = useReportGeneration(customerId)
  const [showNoteModal, setShowNoteModal] = useState(false)
  const [noteContent, setNoteContent] = useState("")
  const [isSubmittingNote, setIsSubmittingNote] = useState(false)

  const handleAddNote = async () => {
    if (!noteContent.trim()) {
      toast({ title: "Note is empty", description: "Please write something in the note.", variant: "destructive" })
      return
    }
    setIsSubmittingNote(true)
    try {
      // Assuming agentId comes from auth context or similar
      const agentId = "current_agent_id_placeholder"
      await apiClient.addCustomerNote(customerId, { content: noteContent, agentId })
      toast({ title: "Note Added", description: "Internal note saved successfully." })
      setShowNoteModal(false)
      setNoteContent("")
    } catch (error) {
      toast({ title: "Failed to Add Note", description: String(error), variant: "destructive" })
    } finally {
      setIsSubmittingNote(false)
    }
  }

  const handleFlagAccount = async (type: string, reason: string) => {
    setIsSubmittingNote(true) // Re-use loading state for simplicity
    try {
      const agentId = "current_agent_id_placeholder"
      await apiClient.flagCustomerAccount(customerId, { type, reason, agentId })
      toast({ title: "Account Flagged", description: `Account flagged for ${type}.` })
    } catch (error) {
      toast({ title: "Failed to Flag Account", description: String(error), variant: "destructive" })
    } finally {
      setIsSubmittingNote(false)
    }
  }

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="sm">
            Actions <MoreVertical className="ml-2 h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56">
          <DropdownMenuLabel>Customer Actions</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuSub>
            <DropdownMenuSubTrigger>
              <Download className="mr-2 h-4 w-4" />
              Export Data
            </DropdownMenuSubTrigger>
            <DropdownMenuPortal>
              <DropdownMenuSubContent>
                <DropdownMenuItem onClick={() => generateReport("FinancialSummary", "pdf")} disabled={isGenerating}>
                  Financial Summary (PDF)
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => generateReport("TransactionHistory", "excel")} disabled={isGenerating}>
                  Transactions (Excel)
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => generateReport("TransactionHistory", "csv")} disabled={isGenerating}>
                  Transactions (CSV)
                </DropdownMenuItem>
              </DropdownMenuSubContent>
            </DropdownMenuPortal>
          </DropdownMenuSub>
          <DropdownMenuItem onClick={() => setShowNoteModal(true)}>
            <Edit3 className="mr-2 h-4 w-4" />
            Add Internal Note
          </DropdownMenuItem>
          <DropdownMenuSub>
            <DropdownMenuSubTrigger>
              <Flag className="mr-2 h-4 w-4" />
              Flag Account
            </DropdownMenuSubTrigger>
            <DropdownMenuPortal>
              <DropdownMenuSubContent>
                <DropdownMenuItem onClick={() => handleFlagAccount("Suspicious Activity", "Manual review required")}>
                  <AlertCircle className="mr-2 h-4 w-4 text-red-500" /> Suspicious Activity
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleFlagAccount("Follow-up Required", "Needs agent follow-up")}>
                  <CalendarPlus className="mr-2 h-4 w-4 text-blue-500" /> Follow-up Required
                </DropdownMenuItem>
              </DropdownMenuSubContent>
            </DropdownMenuPortal>
          </DropdownMenuSub>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => (window.location.href = `mailto:${customerEmail}`)}>
            <MessageSquare className="mr-2 h-4 w-4" />
            Send Message
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => console.log("Schedule follow-up for", customerId)}>
            <CalendarPlus className="mr-2 h-4 w-4" />
            Schedule Follow-up
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => window.print()}>
            <Printer className="mr-2 h-4 w-4" />
            Print Profile
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <Dialog open={showNoteModal} onOpenChange={setShowNoteModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Internal Note</DialogTitle>
            <DialogDescription>
              Add an internal note for this customer. This note will only be visible to authorized agents.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="note" className="text-right col-span-1">
                Note
              </Label>
              <Textarea
                id="note"
                value={noteContent}
                onChange={(e) => setNoteContent(e.target.value)}
                className="col-span-3"
                rows={5}
                placeholder="Type your note here..."
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowNoteModal(false)} disabled={isSubmittingNote}>
              Cancel
            </Button>
            <Button onClick={handleAddNote} disabled={isSubmittingNote}>
              {isSubmittingNote ? "Saving..." : "Save Note"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
