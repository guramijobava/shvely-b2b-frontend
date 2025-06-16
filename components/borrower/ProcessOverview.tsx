"use client"

import { CheckCircle, CircleDashed, Loader2 } from "lucide-react"
import { Progress } from "@/components/ui/progress"
import { cn } from "@/lib/utils"

type Step = "consent" | "connect" | "complete"

interface ProcessOverviewProps {
  currentStep: Step
  totalSteps?: number // e.g. 3
}

const stepsConfig: { id: Step; title: string; description: string; time: string }[] = [
  { id: "consent", title: "Review & Consent", description: "Confirm the data to be shared.", time: "~1 min" },
  {
    id: "connect",
    title: "Connect Bank Accounts",
    description: "Securely link your financial institutions.",
    time: "~2-3 mins",
  },
  { id: "complete", title: "Verification Complete", description: "Your information is submitted.", time: "Instant" },
]

export function ProcessOverview({ currentStep }: ProcessOverviewProps) {
  const currentStepIndex = stepsConfig.findIndex((s) => s.id === currentStep)
  const progressValue = ((currentStepIndex + 1) / stepsConfig.length) * 100

  return (
    <div className="space-y-6 my-8 p-6 bg-white rounded-lg shadow">
      <div className="text-center mb-4">
        <h2 className="text-xl font-semibold">Verification Process</h2>
        <p className="text-muted-foreground">Follow these simple steps.</p>
      </div>
      <Progress value={progressValue} className="w-full h-2 mb-6" />
      <ol className="space-y-4">
        {stepsConfig.map((step, index) => {
          const isActive = step.id === currentStep
          const isCompleted = index < currentStepIndex

          return (
            <li key={step.id} className="flex items-start space-x-3">
              <div className="flex-shrink-0">
                {isCompleted ? (
                  <CheckCircle className="h-6 w-6 text-green-500" />
                ) : isActive ? (
                  <Loader2 className="h-6 w-6 text-primary animate-spin" />
                ) : (
                  <CircleDashed className="h-6 w-6 text-muted-foreground" />
                )}
              </div>
              <div className={cn("flex-grow pb-4", index < stepsConfig.length - 1 && "border-b border-dashed")}>
                <h3
                  className={cn(
                    "font-medium",
                    isActive ? "text-primary" : isCompleted ? "text-gray-700" : "text-muted-foreground",
                  )}
                >
                  {step.title}
                </h3>
                <p className={cn("text-sm", isActive || isCompleted ? "text-gray-600" : "text-muted-foreground")}>
                  {step.description}
                </p>
                <p className={cn("text-xs mt-1", isActive || isCompleted ? "text-gray-500" : "text-muted-foreground")}>
                  Estimated time: {step.time}
                </p>
              </div>
            </li>
          )
        })}
      </ol>
    </div>
  )
}
