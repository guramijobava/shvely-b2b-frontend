"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { 
  FileText,
  AlertTriangle,
  CheckCircle,
  Building,
  DollarSign,
  Calendar,
  Gavel
} from "lucide-react"

interface PublicRecordsModalProps {
  isOpen: boolean
  onClose: () => void
}

export function PublicRecordsModal({ isOpen, onClose }: PublicRecordsModalProps) {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    })
  }

  // Mock public records data using actual API structure
  const publicRecordsData = [
    {
      adjustmentPercent: "0",
      amount: "45000",
      bankruptcyAssetAmount: "5000",
      bankruptcyVoluntaryIndicator: "Y",
      bookPageSequence: "123-456",
      consumerComment: "Discharged Chapter 7 bankruptcy",
      courtCode: "EDC001",
      courtName: "Eastern District Court",
      disputeFlag: "N",
      ecoa: "I",
      evaluation: "Bankruptcy",
      filingDate: "2019-03-15",
      plaintiffName: "",
      referenceNumber: "19-12345",
      repaymentPercent: "0",
      status: "Discharged",
      statusDate: "2019-09-15"
    },
    {
      adjustmentPercent: "0",
      amount: "28500",
      bankruptcyAssetAmount: "2500",
      bankruptcyVoluntaryIndicator: "Y",
      bookPageSequence: "789-012",
      consumerComment: "Active Chapter 13 bankruptcy",
      courtCode: "CDC002",
      courtName: "Central District Court",
      disputeFlag: "N",
      ecoa: "I",
      evaluation: "Bankruptcy",
      filingDate: "2021-08-22",
      plaintiffName: "",
      referenceNumber: "21-67890",
      repaymentPercent: "25",
      status: "Active",
      statusDate: "2021-08-22"
    },
    {
      adjustmentPercent: "0",
      amount: "12500",
      bankruptcyAssetAmount: "",
      bankruptcyVoluntaryIndicator: "",
      bookPageSequence: "345-678",
      consumerComment: "Federal tax lien",
      courtCode: "IRS001",
      courtName: "Internal Revenue Service",
      disputeFlag: "N",
      ecoa: "I",
      evaluation: "Tax Lien",
      filingDate: "2022-01-10",
      plaintiffName: "United States of America",
      referenceNumber: "IRS-2022-001",
      repaymentPercent: "0",
      status: "Active",
      statusDate: "2022-01-10"
    },
    {
      adjustmentPercent: "0",
      amount: "3200",
      bankruptcyAssetAmount: "",
      bankruptcyVoluntaryIndicator: "",
      bookPageSequence: "901-234",
      consumerComment: "State tax lien released",
      courtCode: "ST001",
      courtName: "State Revenue Department",
      disputeFlag: "N",
      ecoa: "I",
      evaluation: "Tax Lien",
      filingDate: "2021-11-05",
      plaintiffName: "State of California",
      referenceNumber: "ST-2021-567",
      repaymentPercent: "0",
      status: "Released",
      statusDate: "2022-03-15"
    },
    {
      adjustmentPercent: "0",
      amount: "8900",
      bankruptcyAssetAmount: "",
      bankruptcyVoluntaryIndicator: "",
      bookPageSequence: "567-890",
      consumerComment: "Civil judgment satisfied",
      courtCode: "CSC001",
      courtName: "County Superior Court",
      disputeFlag: "N",
      ecoa: "I",
      evaluation: "Civil Judgment",
      filingDate: "2020-09-18",
      plaintiffName: "ABC Collections LLC",
      referenceNumber: "CV-2020-8901",
      repaymentPercent: "0",
      status: "Satisfied",
      statusDate: "2021-05-10"
    },
    {
      adjustmentPercent: "0",
      amount: "185000",
      bankruptcyAssetAmount: "",
      bankruptcyVoluntaryIndicator: "",
      bookPageSequence: "123-789",
      consumerComment: "Foreclosure completed",
      courtCode: "FC001",
      courtName: "County Clerk of Court",
      disputeFlag: "N",
      ecoa: "I",
      evaluation: "Foreclosure",
      filingDate: "2018-12-03",
      plaintiffName: "First National Bank",
      referenceNumber: "FC-2018-4567",
      repaymentPercent: "0",
      status: "Completed",
      statusDate: "2019-03-20"
    }
  ]

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "discharged":
      case "satisfied":
      case "released":
        return "bg-green-100 text-green-800 border-green-200"
      case "active":
        return "bg-red-100 text-red-800 border-red-200"
      case "completed":
        return "bg-gray-100 text-gray-800 border-gray-200"
      default:
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
    }
  }

  const getTotalAmount = () => {
    return publicRecordsData.reduce((sum, item) => sum + parseFloat(item.amount), 0)
  }

  const getActiveAmount = () => {
    return publicRecordsData
      .filter(item => item.status === "Active")
      .reduce((sum, item) => sum + parseFloat(item.amount), 0)
  }

  const getRecordsByType = (type: string) => {
    return publicRecordsData.filter(item => item.evaluation === type)
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-3">
            <div className="text-purple-600">
              <FileText className="h-6 w-6" />
            </div>
            <div>
              <div className="text-xl font-bold">Public Records Details</div>
              <div className="text-sm text-gray-500 font-normal">
                Complete public records history and analysis
              </div>
            </div>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Summary Overview */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-gray-600">Total Records</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-red-600">
                  {publicRecordsData.length}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-gray-600">Total Amount</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-red-600">
                  {formatCurrency(getTotalAmount())}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-gray-600">Active Amount</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-red-600">
                  {formatCurrency(getActiveAmount())}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Detailed Records by Type */}
          <Tabs defaultValue="all" className="w-full">
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="all">All ({publicRecordsData.length})</TabsTrigger>
              <TabsTrigger value="bankruptcies">Bankruptcies ({getRecordsByType('Bankruptcy').length})</TabsTrigger>
              <TabsTrigger value="taxliens">Tax Liens ({getRecordsByType('Tax Lien').length})</TabsTrigger>
              <TabsTrigger value="judgments">Judgments ({getRecordsByType('Civil Judgment').length})</TabsTrigger>
              <TabsTrigger value="foreclosures">Foreclosures ({getRecordsByType('Foreclosure').length})</TabsTrigger>
            </TabsList>

            <TabsContent value="all" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <FileText className="h-5 w-5 text-red-600" />
                    <span>All Public Records</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {publicRecordsData.map((record, index) => (
                      <div key={index} className="border rounded-lg p-4">
                        <div className="flex justify-between items-start mb-3">
                          <div className="flex-1">
                            <div className="font-semibold text-lg">{record.evaluation}</div>
                            <div className="text-sm text-gray-600">Ref #{record.referenceNumber}</div>
                            {record.consumerComment && (
                              <div className="text-sm text-gray-500 mt-1">{record.consumerComment}</div>
                            )}
                          </div>
                          <Badge className={getStatusColor(record.status)}>
                            {record.status}
                          </Badge>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                          <div className="flex items-center space-x-2">
                            <DollarSign className="h-4 w-4 text-gray-400" />
                            <div>
                              <div className="text-sm text-gray-600">Amount</div>
                              <div className="font-semibold">{formatCurrency(parseFloat(record.amount))}</div>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Calendar className="h-4 w-4 text-gray-400" />
                            <div>
                              <div className="text-sm text-gray-600">Filed Date</div>
                              <div className="font-semibold">{formatDate(record.filingDate)}</div>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Building className="h-4 w-4 text-gray-400" />
                            <div>
                              <div className="text-sm text-gray-600">Court/Agency</div>
                              <div className="font-semibold">{record.courtName}</div>
                            </div>
                          </div>
                          {record.plaintiffName && (
                            <div className="flex items-center space-x-2">
                              <FileText className="h-4 w-4 text-gray-400" />
                              <div>
                                <div className="text-sm text-gray-600">Plaintiff</div>
                                <div className="font-semibold">{record.plaintiffName}</div>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="bankruptcies" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Gavel className="h-5 w-5 text-red-600" />
                    <span>Bankruptcy Records</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {getRecordsByType('Bankruptcy').map((record, index) => (
                      <div key={index} className="border rounded-lg p-4">
                        <div className="flex justify-between items-start mb-3">
                          <div className="flex-1">
                            <div className="font-semibold text-lg">{record.consumerComment}</div>
                            <div className="text-sm text-gray-600">Ref #{record.referenceNumber}</div>
                            {record.bankruptcyVoluntaryIndicator === 'Y' && (
                              <Badge className="bg-blue-100 text-blue-800 border-blue-200 mt-1">
                                Voluntary
                              </Badge>
                            )}
                          </div>
                          <Badge className={getStatusColor(record.status)}>
                            {record.status}
                          </Badge>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                          <div className="flex items-center space-x-2">
                            <DollarSign className="h-4 w-4 text-gray-400" />
                            <div>
                              <div className="text-sm text-gray-600">Amount</div>
                              <div className="font-semibold">{formatCurrency(parseFloat(record.amount))}</div>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Calendar className="h-4 w-4 text-gray-400" />
                            <div>
                              <div className="text-sm text-gray-600">Filed Date</div>
                              <div className="font-semibold">{formatDate(record.filingDate)}</div>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Building className="h-4 w-4 text-gray-400" />
                            <div>
                              <div className="text-sm text-gray-600">Court</div>
                              <div className="font-semibold">{record.courtName}</div>
                            </div>
                          </div>
                          {record.bankruptcyAssetAmount && (
                            <div className="flex items-center space-x-2">
                              <FileText className="h-4 w-4 text-gray-400" />
                              <div>
                                <div className="text-sm text-gray-600">Asset Amount</div>
                                <div className="font-semibold">{formatCurrency(parseFloat(record.bankruptcyAssetAmount))}</div>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="taxliens" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <AlertTriangle className="h-5 w-5 text-red-600" />
                    <span>Tax Lien Records</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {getRecordsByType('Tax Lien').map((record, index) => (
                      <div key={index} className="border rounded-lg p-4">
                        <div className="flex justify-between items-start mb-3">
                          <div className="flex-1">
                            <div className="font-semibold text-lg">{record.consumerComment}</div>
                            <div className="text-sm text-gray-600">Ref #{record.referenceNumber}</div>
                          </div>
                          <Badge className={getStatusColor(record.status)}>
                            {record.status}
                          </Badge>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                          <div className="flex items-center space-x-2">
                            <DollarSign className="h-4 w-4 text-gray-400" />
                            <div>
                              <div className="text-sm text-gray-600">Amount</div>
                              <div className="font-semibold">{formatCurrency(parseFloat(record.amount))}</div>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Calendar className="h-4 w-4 text-gray-400" />
                            <div>
                              <div className="text-sm text-gray-600">Filed Date</div>
                              <div className="font-semibold">{formatDate(record.filingDate)}</div>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Building className="h-4 w-4 text-gray-400" />
                            <div>
                              <div className="text-sm text-gray-600">Agency</div>
                              <div className="font-semibold">{record.courtName}</div>
                            </div>
                          </div>
                          {record.plaintiffName && (
                            <div className="flex items-center space-x-2">
                              <FileText className="h-4 w-4 text-gray-400" />
                              <div>
                                <div className="text-sm text-gray-600">Plaintiff</div>
                                <div className="font-semibold">{record.plaintiffName}</div>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="judgments" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Gavel className="h-5 w-5 text-red-600" />
                    <span>Civil Judgment Records</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {getRecordsByType('Civil Judgment').map((record, index) => (
                      <div key={index} className="border rounded-lg p-4">
                        <div className="flex justify-between items-start mb-3">
                          <div className="flex-1">
                            <div className="font-semibold text-lg">{record.consumerComment}</div>
                            <div className="text-sm text-gray-600">Ref #{record.referenceNumber}</div>
                          </div>
                          <Badge className={getStatusColor(record.status)}>
                            {record.status}
                          </Badge>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                          <div className="flex items-center space-x-2">
                            <DollarSign className="h-4 w-4 text-gray-400" />
                            <div>
                              <div className="text-sm text-gray-600">Amount</div>
                              <div className="font-semibold">{formatCurrency(parseFloat(record.amount))}</div>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Calendar className="h-4 w-4 text-gray-400" />
                            <div>
                              <div className="text-sm text-gray-600">Filed Date</div>
                              <div className="font-semibold">{formatDate(record.filingDate)}</div>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Building className="h-4 w-4 text-gray-400" />
                            <div>
                              <div className="text-sm text-gray-600">Court</div>
                              <div className="font-semibold">{record.courtName}</div>
                            </div>
                          </div>
                          {record.plaintiffName && (
                            <div className="flex items-center space-x-2">
                              <FileText className="h-4 w-4 text-gray-400" />
                              <div>
                                <div className="text-sm text-gray-600">Plaintiff</div>
                                <div className="font-semibold">{record.plaintiffName}</div>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="foreclosures" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Building className="h-5 w-5 text-red-600" />
                    <span>Foreclosure Records</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {getRecordsByType('Foreclosure').map((record, index) => (
                      <div key={index} className="border rounded-lg p-4">
                        <div className="flex justify-between items-start mb-3">
                          <div className="flex-1">
                            <div className="font-semibold text-lg">{record.consumerComment}</div>
                            <div className="text-sm text-gray-600">Ref #{record.referenceNumber}</div>
                          </div>
                          <Badge className={getStatusColor(record.status)}>
                            {record.status}
                          </Badge>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                          <div className="flex items-center space-x-2">
                            <DollarSign className="h-4 w-4 text-gray-400" />
                            <div>
                              <div className="text-sm text-gray-600">Amount</div>
                              <div className="font-semibold">{formatCurrency(parseFloat(record.amount))}</div>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Calendar className="h-4 w-4 text-gray-400" />
                            <div>
                              <div className="text-sm text-gray-600">Filed Date</div>
                              <div className="font-semibold">{formatDate(record.filingDate)}</div>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Building className="h-4 w-4 text-gray-400" />
                            <div>
                              <div className="text-sm text-gray-600">Court</div>
                              <div className="font-semibold">{record.courtName}</div>
                            </div>
                          </div>
                          {record.plaintiffName && (
                            <div className="flex items-center space-x-2">
                              <FileText className="h-4 w-4 text-gray-400" />
                              <div>
                                <div className="text-sm text-gray-600">Plaintiff</div>
                                <div className="font-semibold">{record.plaintiffName}</div>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </DialogContent>
    </Dialog>
  )
} 