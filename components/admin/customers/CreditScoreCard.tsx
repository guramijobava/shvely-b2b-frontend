"use client"

import type { CustomerFinancialProfile } from "@/lib/types"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { TrendingUp, TrendingDown, Minus } from "lucide-react"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

interface CreditScoreCardProps {
  creditScoreData?: CustomerFinancialProfile["creditScore"]
}

export function CreditScoreCard({ creditScoreData }: CreditScoreCardProps) {
  if (!creditScoreData) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Credit Score</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">Credit score data not available.</p>
        </CardContent>
      </Card>
    )
  }

  const { score, grade, scoreRange, factors, lastUpdated, provider, history } = creditScoreData
  const scorePercentage = scoreRange ? ((score - scoreRange.min) / (scoreRange.max - scoreRange.min)) * 100 : 0

  const getGradeColor = () => {
    if (!grade) return "bg-gray-500"
    if (["A", "B"].includes(grade)) return "bg-green-500"
    if (["C"].includes(grade)) return "bg-yellow-500"
    return "bg-red-500"
  }

  let trendIcon = <Minus className="h-4 w-4" />
  let trendText = "Stable"
  if (history && history.length > 1) {
    const latestScore = history[history.length - 1].score
    const previousScore = history[history.length - 2].score
    if (latestScore > previousScore) {
      trendIcon = <TrendingUp className="h-4 w-4 text-green-500" />
      trendText = `Up from ${previousScore}`
    } else if (latestScore < previousScore) {
      trendIcon = <TrendingDown className="h-4 w-4 text-red-500" />
      trendText = `Down from ${previousScore}`
    }
  }

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          Credit Score
          <Badge variant="outline">{provider}</Badge>
        </CardTitle>
        <CardDescription>Last updated: {new Date(lastUpdated).toLocaleDateString()}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="text-center">
          {/* Simplified circular progress */}
          <div className="relative w-32 h-32 mx-auto mb-2">
            <svg className="w-full h-full" viewBox="0 0 36 36">
              <path
                className="text-gray-200"
                strokeWidth="3"
                fill="none"
                stroke="currentColor"
                d="M18 2.0845
                  a 15.9155 15.9155 0 0 1 0 31.831
                  a 15.9155 15.9155 0 0 1 0 -31.831"
              />
              <path
                className={
                  grade === "A" || grade === "B" ? "text-green-500" : grade === "C" ? "text-yellow-500" : "text-red-500"
                }
                strokeWidth="3"
                strokeDasharray={`${scorePercentage}, 100`}
                strokeLinecap="round"
                fill="none"
                stroke="currentColor"
                d="M18 2.0845
                  a 15.9155 15.9155 0 0 1 0 31.831
                  a 15.9155 15.9155 0 0 1 0 -31.831"
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-4xl font-bold">{score}</span>
              <Badge className={`${getGradeColor()} text-white text-xs`}>{grade}</Badge>
            </div>
          </div>
          <p className="text-sm text-muted-foreground">
            Range: {scoreRange?.min} - {scoreRange?.max}
          </p>
          <div className="flex items-center justify-center text-sm mt-1">
            {trendIcon}
            <span className="ml-1">{trendText}</span>
          </div>
        </div>

        <div>
          <h4 className="font-semibold text-sm mb-1">Key Factors:</h4>
          <ul className="list-disc list-inside text-xs text-muted-foreground space-y-0.5">
            {factors?.slice(0, 3).map((factor, i) => (
              <li key={i}>{factor}</li>
            ))}
          </ul>
        </div>

        {/* Placeholder for score history chart */}
        {history && history.length > 0 && (
          <div className="mt-4">
            <h4 className="font-semibold text-sm mb-1">Score History (Simplified)</h4>
            <div className="h-20 bg-gray-100 rounded flex items-end justify-around p-2">
              {history.slice(-5).map((entry, i) => (
                <TooltipProvider key={i}>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div
                        className="w-4 bg-blue-500 hover:bg-blue-600"
                        style={{
                          height: `${((entry.score - (scoreRange?.min || 300)) / ((scoreRange?.max || 850) - (scoreRange?.min || 300))) * 80 + 10}%`,
                        }}
                      />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>
                        {new Date(entry.date).toLocaleDateString()}: {entry.score}
                      </p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
