"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CreditBureauReport } from "@/types/customer"

interface BureauScoreCardProps {
  bureau: "equifax" | "experian" | "transunion"
  report: CreditBureauReport
}

const bureauDisplayNames = {
  equifax: "Equifax",
  experian: "Experian", 
  transunion: "TransUnion"
}

const gradeColors = {
  A: "bg-green-100 text-green-800 border-green-200",
  B: "bg-blue-100 text-blue-800 border-blue-200", 
  C: "bg-yellow-100 text-yellow-800 border-yellow-200",
  D: "bg-orange-100 text-orange-800 border-orange-200",
  F: "bg-red-100 text-red-800 border-red-200"
}

export function BureauScoreCard({ bureau, report }: BureauScoreCardProps) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    })
  }

  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-2">
          <h3 className="font-semibold text-sm">{bureauDisplayNames[bureau]}</h3>
          <Badge className={`${gradeColors[report.grade]}`}>
            {report.grade}
          </Badge>
        </div>
        
        <div className="text-center mb-3">
          <div className="text-2xl font-bold text-gray-900">
            {report.score}
          </div>
        </div>
        
        <div className="text-xs text-gray-500 text-center">
          Updated {formatDate(report.lastUpdated)}
        </div>
      </CardContent>
    </Card>
  )
} 