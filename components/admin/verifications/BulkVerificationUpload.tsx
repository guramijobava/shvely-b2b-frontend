"use client"

import { useState, useCallback, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { LoadingSpinner } from "@/components/shared/LoadingSpinner"
import { 
  Upload, 
  Download, 
  FileText, 
  AlertCircle, 
  CheckCircle, 
  X, 
  Pause, 
  Play, 
  Send,
  Edit,
  Trash2
} from "lucide-react"

interface BulkVerificationRow {
  id: string
  fullName: string
  email: string
  phoneNumber: string
  nationality?: string
  identificationNumber?: string
  residingCountry?: string
  socialSecurityNumber?: string
  state?: string
  city?: string
  expirationDays: number
  sendMethod: "email" | "sms" | "both"
  agentNotes?: string
  isValid: boolean
  errors: string[]
  status: "pending" | "processing" | "sent" | "failed" | "paused"
}

interface BulkUploadProgress {
  total: number
  processed: number
  successful: number
  failed: number
  paused: boolean
}

interface BulkVerificationUploadProps {
  onClose: () => void
  onComplete: (results: { successful: number; failed: number; errors: string[] }) => void
}

export function BulkVerificationUpload({ onClose, onComplete }: BulkVerificationUploadProps) {
  const [file, setFile] = useState<File | null>(null)
  const [csvData, setCsvData] = useState<BulkVerificationRow[]>([])
  const [isProcessing, setIsProcessing] = useState(false)
  const [isParsing, setIsParsing] = useState(false)
  const [progress, setProgress] = useState<BulkUploadProgress>({
    total: 0,
    processed: 0,
    successful: 0,
    failed: 0,
    paused: false
  })
  const [errors, setErrors] = useState<string[]>([])
  const [editingRow, setEditingRow] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [showPreview, setShowPreview] = useState(false)

  // Email validation regex
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  
  // Phone number validation (supports various formats)
  const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/

  const validateRow = useCallback((row: any, index: number): BulkVerificationRow => {
    const errors: string[] = []
    
    if (!row.fullName || row.fullName.trim().length < 1) {
      errors.push("Full name is required")
    }
    
    if (!row.email || !emailRegex.test(row.email.trim())) {
      errors.push("Valid email is required")
    }
    
    if (!row.phoneNumber || !phoneRegex.test(row.phoneNumber.replace(/[\s\-\(\)]/g, ""))) {
      errors.push("Valid phone number is required")
    }
    
    const expirationDays = parseInt(row.expirationDays) || 7
    if (expirationDays < 1 || expirationDays > 30) {
      errors.push("Expiration days must be between 1 and 30")
    }
    
    const sendMethod = row.sendMethod?.toLowerCase()
    if (!["email", "sms", "both"].includes(sendMethod)) {
      errors.push("Send method must be email, sms, or both")
    }

    return {
      id: `row-${index}`,
      fullName: row.fullName?.trim() || "",
      email: row.email?.trim() || "",
      phoneNumber: row.phoneNumber?.trim() || "",
      expirationDays: expirationDays,
      sendMethod: sendMethod as "email" | "sms" | "both" || "email",
      agentNotes: row.agentNotes?.trim() || "",
      isValid: errors.length === 0,
      errors,
      status: "pending"
    }
  }, [])

  const parseCSV = useCallback((content: string) => {
    const lines = content.split('\n').filter(line => line.trim())
    if (lines.length < 2) {
      throw new Error("CSV must contain at least a header row and one data row")
    }

    const headers = lines[0].split(',').map(h => h.trim().toLowerCase())
    const requiredHeaders = ['fullname', 'email', 'phonenumber']
    const missingHeaders = requiredHeaders.filter(h => !headers.some(header => header.includes(h.replace('name', '').replace('number', ''))))
    
    if (missingHeaders.length > 0) {
      throw new Error(`Missing required columns: ${missingHeaders.join(', ')}`)
    }

    const rows: BulkVerificationRow[] = []
    for (let i = 1; i < lines.length; i++) {
      const values = lines[i].split(',').map(v => v.trim().replace(/^"|"$/g, ''))
      const rowData: any = {}
      
      headers.forEach((header, index) => {
        if (header.includes('fullname') || header.includes('name')) {
          rowData.fullName = values[index]
        } else if (header.includes('email')) {
          rowData.email = values[index]
        } else if (header.includes('phone')) {
          rowData.phoneNumber = values[index]
        } else if (header.includes('nationality')) {
          rowData.nationality = values[index] || undefined
        } else if (header.includes('identification') || header.includes('id')) {
          rowData.identificationNumber = values[index] || undefined
        } else if (header.includes('residing') || header.includes('country')) {
          rowData.residingCountry = values[index] || undefined
        } else if (header.includes('ssn') || header.includes('social')) {
          rowData.socialSecurityNumber = values[index] || undefined
        } else if (header.includes('state')) {
          rowData.state = values[index] || undefined
        } else if (header.includes('city')) {
          rowData.city = values[index] || undefined
        } else if (header.includes('expiration')) {
          rowData.expirationDays = values[index]
        } else if (header.includes('send') || header.includes('method')) {
          rowData.sendMethod = values[index]
        } else if (header.includes('note')) {
          rowData.agentNotes = values[index]
        }
      })

      const validatedRow = validateRow(rowData, i - 1)
      rows.push(validatedRow)
    }

    return rows
  }, [validateRow])

  const downloadTemplate = useCallback(() => {
    const template = [
      "fullName,email,phoneNumber,nationality,identificationNumber,residingCountry,socialSecurityNumber,state,city,expirationDays,sendMethod,agentNotes",
      "John Smith,john.smith@example.com,+1-555-123-4567,Georgian,01234567890,United States,123-45-6789,California,San Francisco,7,email,Complete customer info",
      "Jane Doe,jane.doe@example.com,+1-555-987-6543,Georgian,,United States,456-78-9012,New York,New York,14,both,Missing Georgian ID - customer will provide",
      "Bob Wilson,bob.wilson@example.com,+1-555-111-2222,,,United States,789-12-3456,Texas,Austin,7,email,Only US info - nationality collection needed"
    ].join('\n')

    const blob = new Blob([template], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'bulk_verification_template.csv'
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }, [])

  const handleFileSelect = useCallback(async (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0]
    if (!selectedFile) return

    if (!selectedFile.name.endsWith('.csv')) {
      setErrors(["Please select a CSV file"])
      return
    }

    setFile(selectedFile)
    setIsParsing(true)
    setErrors([])
    setCsvData([])

    try {
      const content = await selectedFile.text()
      const parsedData = parseCSV(content)
      setCsvData(parsedData)
      setShowPreview(true)
      
      // Show summary of validation
      const validRows = parsedData.filter(row => row.isValid).length
      const invalidRows = parsedData.length - validRows
      
      if (invalidRows > 0) {
        setErrors([`${invalidRows} rows have validation errors. Please review and fix them before proceeding.`])
      }
    } catch (error) {
      setErrors([error instanceof Error ? error.message : "Failed to parse CSV file"])
    } finally {
      setIsParsing(false)
    }
  }, [parseCSV])

  const handleRowUpdate = useCallback((rowId: string, field: string, value: any) => {
    setCsvData(prev => prev.map(row => {
      if (row.id === rowId) {
        const updatedRow = { ...row, [field]: value }
        // Re-validate the row
        const mockRowData = {
          fullName: updatedRow.fullName,
          email: updatedRow.email,
          phoneNumber: updatedRow.phoneNumber,
          nationality: updatedRow.nationality,
          identificationNumber: updatedRow.identificationNumber,
          residingCountry: updatedRow.residingCountry,
          socialSecurityNumber: updatedRow.socialSecurityNumber,
          state: updatedRow.state,
          city: updatedRow.city,
          expirationDays: updatedRow.expirationDays,
          sendMethod: updatedRow.sendMethod,
          agentNotes: updatedRow.agentNotes
        }
        const revalidated = validateRow(mockRowData, parseInt(rowId.split('-')[1]))
        return { ...updatedRow, isValid: revalidated.isValid, errors: revalidated.errors }
      }
      return row
    }))
  }, [validateRow])

  const handleRemoveRow = useCallback((rowId: string) => {
    setCsvData(prev => prev.filter(row => row.id !== rowId))
  }, [])

  const processBulkVerifications = useCallback(async () => {
    const validRows = csvData.filter(row => row.isValid)
    if (validRows.length === 0) {
      setErrors(["No valid rows to process"])
      return
    }

    setIsProcessing(true)
    setProgress({
      total: validRows.length,
      processed: 0,
      successful: 0,
      failed: 0,
      paused: false
    })

    const failedRows: string[] = []
    let successful = 0
    let processed = 0

    // Process rows in batches to avoid overwhelming the API
    const batchSize = 5
    for (let i = 0; i < validRows.length; i += batchSize) {
      if (progress.paused) {
        break
      }

      const batch = validRows.slice(i, i + batchSize)
      const batchPromises = batch.map(async (row, batchIndex) => {
        try {
          // Update row status
          setCsvData(prev => prev.map(r => 
            r.id === row.id ? { ...r, status: "processing" } : r
          ))

          // Simulate API call - replace with actual API call
          await new Promise(resolve => setTimeout(resolve, 1000))
          
          // Mock API call result - replace with actual API client call
          // const result = await apiClient.createVerification({
          //   customerInfo: {
          //     fullName: row.fullName,
          //     email: row.email,
          //     phoneNumber: row.phoneNumber
          //   },
          //   settings: {
          //     expirationDays: row.expirationDays,
          //     sendMethod: row.sendMethod,
          //     includeReminders: true,
          //     agentNotes: row.agentNotes
          //   }
          // })

          // Update row status to success
          setCsvData(prev => prev.map(r => 
            r.id === row.id ? { ...r, status: "sent" } : r
          ))
          
          successful++
          return true
        } catch (error) {
          // Update row status to failed
          setCsvData(prev => prev.map(r => 
            r.id === row.id ? { ...r, status: "failed" } : r
          ))
          
          failedRows.push(`Row ${i + batchIndex + 1}: ${error instanceof Error ? error.message : "Unknown error"}`)
          return false
        } finally {
          processed++
          setProgress(prev => ({
            ...prev,
            processed,
            successful,
            failed: processed - successful
          }))
        }
      })

      await Promise.all(batchPromises)
    }

    setIsProcessing(false)
    onComplete({
      successful,
      failed: processed - successful,
      errors: failedRows
    })
  }, [csvData, progress.paused, onComplete])

  const togglePause = useCallback(() => {
    setProgress(prev => ({ ...prev, paused: !prev.paused }))
  }, [])

  const validRowCount = csvData.filter(row => row.isValid).length
  const invalidRowCount = csvData.length - validRowCount

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Upload className="h-5 w-5" />
            <span>Bulk Verification Upload</span>
          </CardTitle>
          <CardDescription>
            Upload a CSV file to send multiple verification requests at once. 
            <Button variant="link" onClick={downloadTemplate} className="p-0 h-auto ml-2">
              <Download className="h-4 w-4 mr-1" />
              Download Template
            </Button>
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {errors.length > 0 && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                <ul className="list-disc list-inside space-y-1">
                  {errors.map((error, index) => (
                    <li key={index}>{error}</li>
                  ))}
                </ul>
              </AlertDescription>
            </Alert>
          )}

          <div className="space-y-2">
            <Label htmlFor="csv-file">CSV File</Label>
            <Input
              id="csv-file"
              type="file"
              accept=".csv"
              onChange={handleFileSelect}
              ref={fileInputRef}
              disabled={isParsing || isProcessing}
            />
            <p className="text-xs text-muted-foreground">
              Required: fullName, email, phoneNumber. Optional identity fields: nationality → identificationNumber. Optional location fields: residingCountry → socialSecurityNumber, state, city. Settings: expirationDays, sendMethod, agentNotes
            </p>
          </div>

          {isParsing && (
            <div className="flex items-center space-x-2">
              <LoadingSpinner size="sm" />
              <span className="text-sm">Parsing CSV file...</span>
            </div>
          )}
        </CardContent>
      </Card>

      {showPreview && csvData.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <FileText className="h-5 w-5" />
                <span>Preview & Validation</span>
              </div>
              <div className="flex items-center space-x-4 text-sm">
                <Badge variant="outline" className="text-green-600 border-green-600">
                  <CheckCircle className="h-3 w-3 mr-1" />
                  {validRowCount} Valid
                </Badge>
                {invalidRowCount > 0 && (
                  <Badge variant="outline" className="text-red-600 border-red-600">
                    <AlertCircle className="h-3 w-3 mr-1" />
                    {invalidRowCount} Invalid
                  </Badge>
                )}
              </div>
            </CardTitle>
            <CardDescription>
              Review and edit the parsed data before sending. Fix any validation errors highlighted in red.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-96 w-full">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Status</TableHead>
                    <TableHead>Full Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Phone</TableHead>
                    <TableHead className="border-l border-gray-200 bg-gray-50">🇬🇪 Nationality</TableHead>
                    <TableHead className="bg-gray-50">🆔 ID Number</TableHead>
                    <TableHead className="border-l border-gray-200 bg-blue-50">🇺🇸 Residing Country</TableHead>
                    <TableHead className="bg-blue-50">SSN</TableHead>
                    <TableHead className="bg-blue-50">State</TableHead>
                    <TableHead className="bg-blue-50">City</TableHead>
                    <TableHead className="border-l border-gray-200">Expiration</TableHead>
                    <TableHead>Send Method</TableHead>
                    <TableHead>Notes</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {csvData.map((row) => (
                    <TableRow key={row.id} className={!row.isValid ? "bg-red-50" : ""}>
                      <TableCell>
                        {row.status === "processing" && <LoadingSpinner size="sm" />}
                        {row.status === "sent" && <CheckCircle className="h-4 w-4 text-green-600" />}
                        {row.status === "failed" && <X className="h-4 w-4 text-red-600" />}
                        {row.status === "pending" && !row.isValid && <AlertCircle className="h-4 w-4 text-red-600" />}
                        {row.status === "pending" && row.isValid && <CheckCircle className="h-4 w-4 text-green-600" />}
                      </TableCell>
                      <TableCell>
                        {editingRow === row.id ? (
                          <Input
                            value={row.fullName}
                            onChange={(e) => handleRowUpdate(row.id, "fullName", e.target.value)}
                            className="h-8"
                          />
                        ) : (
                          <span className={!row.fullName ? "text-red-600" : ""}>{row.fullName || "Required"}</span>
                        )}
                      </TableCell>
                      <TableCell>
                        {editingRow === row.id ? (
                          <Input
                            value={row.email}
                            onChange={(e) => handleRowUpdate(row.id, "email", e.target.value)}
                            className="h-8"
                          />
                        ) : (
                          <span className={!emailRegex.test(row.email) ? "text-red-600" : ""}>{row.email || "Required"}</span>
                        )}
                      </TableCell>
                      <TableCell>
                        {editingRow === row.id ? (
                          <Input
                            value={row.phoneNumber}
                            onChange={(e) => handleRowUpdate(row.id, "phoneNumber", e.target.value)}
                            className="h-8"
                          />
                        ) : (
                          <span className={!phoneRegex.test(row.phoneNumber.replace(/[\s\-\(\)]/g, "")) ? "text-red-600" : ""}>
                            {row.phoneNumber || "Required"}
                          </span>
                        )}
                      </TableCell>
                      {/* Georgian Identity Section */}
                      <TableCell className="border-l border-gray-200 bg-gray-50/50">
                        {editingRow === row.id ? (
                          <Select
                            value={row.nationality || ""}
                            onValueChange={(value) => handleRowUpdate(row.id, "nationality", value || undefined)}
                          >
                            <SelectTrigger className="h-8">
                              <SelectValue placeholder="Select" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Georgian">
                                <div className="flex items-center space-x-2">
                                  <span>🇬🇪</span>
                                  <span>Georgian</span>
                                </div>
                              </SelectItem>
                              <SelectItem value="coming_soon" disabled>
                                <div className="flex items-center space-x-2 text-muted-foreground">
                                  <span>🌍</span>
                                  <span>Other nationalities (Coming Soon)</span>
                                </div>
                              </SelectItem>
                            </SelectContent>
                          </Select>
                        ) : (
                          <span className="text-sm">{row.nationality || "—"}</span>
                        )}
                      </TableCell>
                      <TableCell className="bg-gray-50/50">
                        {editingRow === row.id ? (
                          <Input
                            value={row.identificationNumber || ""}
                            onChange={(e) => handleRowUpdate(row.id, "identificationNumber", e.target.value || undefined)}
                            className="h-8"
                            placeholder="ID number"
                            disabled={!row.nationality}
                          />
                        ) : (
                          <span className={`text-sm ${!row.nationality ? 'text-gray-400' : ''}`}>
                            {row.identificationNumber && row.nationality ? `•••••${row.identificationNumber.slice(-4)}` : "—"}
                          </span>
                        )}
                      </TableCell>
                      
                      {/* US Resident Section */}
                      <TableCell className="border-l border-gray-200 bg-blue-50/50">
                        {editingRow === row.id ? (
                          <Select
                            value={row.residingCountry || ""}
                            onValueChange={(value) => handleRowUpdate(row.id, "residingCountry", value || undefined)}
                          >
                            <SelectTrigger className="h-8">
                              <SelectValue placeholder="Select" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="United States">
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
                        ) : (
                          <span className="text-sm">{row.residingCountry || "—"}</span>
                        )}
                      </TableCell>
                      <TableCell className="bg-blue-50/50">
                        {editingRow === row.id ? (
                          <Input
                            value={row.socialSecurityNumber || ""}
                            onChange={(e) => handleRowUpdate(row.id, "socialSecurityNumber", e.target.value || undefined)}
                            className="h-8"
                            placeholder="XXX-XX-XXXX"
                            type="password"
                            disabled={!row.residingCountry}
                          />
                        ) : (
                          <span className={`text-sm ${!row.residingCountry ? 'text-gray-400' : ''}`}>
                            {row.socialSecurityNumber && row.residingCountry ? `XXX-XX-${row.socialSecurityNumber.slice(-4)}` : "—"}
                          </span>
                        )}
                      </TableCell>
                      <TableCell className="bg-blue-50/50">
                        {editingRow === row.id ? (
                          <Input
                            value={row.state || ""}
                            onChange={(e) => handleRowUpdate(row.id, "state", e.target.value || undefined)}
                            className="h-8"
                            placeholder="State"
                            disabled={!row.residingCountry}
                          />
                        ) : (
                          <span className={`text-sm ${!row.residingCountry ? 'text-gray-400' : ''}`}>
                            {row.state && row.residingCountry ? row.state : "—"}
                          </span>
                        )}
                      </TableCell>
                      <TableCell className="bg-blue-50/50">
                        {editingRow === row.id ? (
                          <Input
                            value={row.city || ""}
                            onChange={(e) => handleRowUpdate(row.id, "city", e.target.value || undefined)}
                            className="h-8"
                            placeholder="City"
                            disabled={!row.residingCountry}
                          />
                        ) : (
                          <span className={`text-sm ${!row.residingCountry ? 'text-gray-400' : ''}`}>
                            {row.city && row.residingCountry ? row.city : "—"}
                          </span>
                        )}
                      </TableCell>
                      <TableCell>
                        {editingRow === row.id ? (
                          <Select
                            value={String(row.expirationDays)}
                            onValueChange={(value) => handleRowUpdate(row.id, "expirationDays", parseInt(value))}
                          >
                            <SelectTrigger className="h-8">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="3">3 days</SelectItem>
                              <SelectItem value="7">7 days</SelectItem>
                              <SelectItem value="14">14 days</SelectItem>
                              <SelectItem value="30">30 days</SelectItem>
                            </SelectContent>
                          </Select>
                        ) : (
                          <span>{row.expirationDays} days</span>
                        )}
                      </TableCell>
                      <TableCell>
                        {editingRow === row.id ? (
                          <Select
                            value={row.sendMethod}
                            onValueChange={(value) => handleRowUpdate(row.id, "sendMethod", value)}
                          >
                            <SelectTrigger className="h-8">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="email">Email</SelectItem>
                              <SelectItem value="sms">SMS</SelectItem>
                              <SelectItem value="both">Both</SelectItem>
                            </SelectContent>
                          </Select>
                        ) : (
                          <Badge variant="outline">{row.sendMethod}</Badge>
                        )}
                      </TableCell>
                      <TableCell>
                        {editingRow === row.id ? (
                          <Textarea
                            value={row.agentNotes}
                            onChange={(e) => handleRowUpdate(row.id, "agentNotes", e.target.value)}
                            className="h-8 min-h-8"
                            rows={1}
                          />
                        ) : (
                          <span className="text-sm text-muted-foreground">
                            {row.agentNotes || "None"}
                          </span>
                        )}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-1">
                          {editingRow === row.id ? (
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => setEditingRow(null)}
                              className="h-6 px-2"
                            >
                              <CheckCircle className="h-3 w-3" />
                            </Button>
                          ) : (
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => setEditingRow(row.id)}
                              disabled={isProcessing}
                              className="h-6 px-2"
                            >
                              <Edit className="h-3 w-3" />
                            </Button>
                          )}
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleRemoveRow(row.id)}
                            disabled={isProcessing}
                            className="h-6 px-2 text-red-600 hover:text-red-700"
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </ScrollArea>

            {/* Validation errors for invalid rows */}
            {invalidRowCount > 0 && (
              <Alert className="mt-4">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  <div className="space-y-2">
                    <p className="font-medium">Validation Errors:</p>
                    {csvData.filter(row => !row.isValid).map(row => (
                      <div key={row.id} className="text-sm">
                        <span className="font-medium">Row {parseInt(row.id.split('-')[1]) + 1}:</span>
                        <ul className="list-disc list-inside ml-4">
                          {row.errors.map((error, index) => (
                            <li key={index}>{error}</li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                </AlertDescription>
              </Alert>
            )}
          </CardContent>
        </Card>
      )}

      {/* Processing Progress */}
      {isProcessing && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Send className="h-5 w-5" />
              <span>Sending Verifications</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Progress</span>
                <span>{progress.processed} of {progress.total}</span>
              </div>
              <Progress value={(progress.processed / progress.total) * 100} />
            </div>

            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold text-green-600">{progress.successful}</div>
                <div className="text-sm text-muted-foreground">Successful</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-red-600">{progress.failed}</div>
                <div className="text-sm text-muted-foreground">Failed</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-600">{progress.total - progress.processed}</div>
                <div className="text-sm text-muted-foreground">Remaining</div>
              </div>
            </div>

            <div className="flex justify-center">
              <Button
                variant="outline"
                onClick={togglePause}
                disabled={progress.processed >= progress.total}
              >
                {progress.paused ? (
                  <>
                    <Play className="h-4 w-4 mr-2" />
                    Resume
                  </>
                ) : (
                  <>
                    <Pause className="h-4 w-4 mr-2" />
                    Pause
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Action Buttons */}
      <div className="flex justify-between">
        <Button variant="outline" onClick={onClose} disabled={isProcessing}>
          Cancel
        </Button>
        
        <div className="flex space-x-3">
          {showPreview && !isProcessing && (
            <Button
              onClick={processBulkVerifications}
              disabled={validRowCount === 0 || isProcessing}
            >
              <Send className="h-4 w-4 mr-2" />
              Send {validRowCount} Verification{validRowCount !== 1 ? 's' : ''}
            </Button>
          )}
        </div>
      </div>
    </div>
  )
} 