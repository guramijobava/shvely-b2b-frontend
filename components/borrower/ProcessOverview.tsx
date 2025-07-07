"use client"

import { useState, useMemo } from "react"
import { CheckCircle, CircleDashed, Loader2, ChevronLeft, ChevronRight, ChevronDown, ChevronUp } from "lucide-react"
import { Progress } from "@/components/ui/progress"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { useTokenValidation } from "@/hooks/useTokenValidation"
import { requiresCustomerInfoCollection } from "@/lib/verification-utils"

type Step = "consent" | "customer-info" | "connect" | "complete"

interface ProcessOverviewProps {
  currentStep: Step
  totalSteps?: number // e.g. 3
}

export function ProcessOverview({ currentStep }: ProcessOverviewProps) {
  const [isExpanded, setIsExpanded] = useState(true)
  const { customerInfo } = useTokenValidation()

  const stepsConfig = useMemo(() => {
    const baseSteps: { id: Step; title: string; description: string; time: string }[] = [
      { id: "consent", title: "Review & Consent", description: "Confirm the data to be shared.", time: "~1 min" },
      {
        id: "connect",
        title: "Connect Bank Accounts",
        description: "Securely link your financial institutions.",
        time: "~2-3 mins",
      },
      { id: "complete", title: "Verification Complete", description: "Your information is submitted.", time: "Instant" },
    ]

    // Insert customer-info step if required (before consent)
    if (customerInfo && requiresCustomerInfoCollection(customerInfo)) {
      baseSteps.unshift({
        id: "customer-info",
        title: "Personal Information",
        description: "Provide additional details for verification.",
        time: "~2 mins",
      })
    }

    return baseSteps
  }, [customerInfo])

  const currentStepIndex = stepsConfig.findIndex((s) => s.id === currentStep)
  const progressValue = ((currentStepIndex + 1) / stepsConfig.length) * 100

  const StepIcon = ({ step, index }: { step: typeof stepsConfig[0], index: number }) => {
    const isActive = step.id === currentStep
    const isCompleted = index < currentStepIndex

    if (isCompleted) {
      return <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />
    } else if (isActive) {
      return <Loader2 className="h-5 w-5 text-primary animate-spin flex-shrink-0" />
    } else {
      return <CircleDashed className="h-5 w-5 text-muted-foreground flex-shrink-0" />
    }
  }

  const CollapsedView = () => (
    <>
      {/* Mobile collapsed view - top banner with progress */}
      <div className="lg:hidden">
        <div className="bg-white border-b border-gray-200 p-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center space-x-3">
              <StepIcon step={stepsConfig[currentStepIndex]} index={currentStepIndex} />
              <div>
                <h3 className="font-medium text-sm">Step {currentStepIndex + 1} of {stepsConfig.length}</h3>
                <p className="text-xs text-muted-foreground">{stepsConfig[currentStepIndex].title}</p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsExpanded(true)}
              className="p-2"
            >
              <ChevronDown className="h-4 w-4" />
            </Button>
          </div>
          <Progress value={progressValue} className="w-full h-2" />
        </div>
      </div>

      {/* Desktop collapsed view - side navigation */}
      <div className="hidden lg:block">
        <div className="fixed left-0 top-0 h-full w-16 bg-white border-r border-gray-200 shadow-sm z-40">
          <div className="flex flex-col items-center py-6 space-y-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsExpanded(true)}
              className="p-2 rotate-180"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            
            <div className="flex flex-col space-y-4">
              {stepsConfig.map((step, index) => (
                <div
                  key={step.id}
                  className="flex flex-col items-center space-y-1"
                  title={step.title}
                >
                  <StepIcon step={step} index={index} />
                  <div className="w-1 h-8 bg-gray-200 rounded-full">
                    <div 
                      className="bg-primary rounded-full transition-all duration-300"
                      style={{ 
                        height: `${index <= currentStepIndex ? 100 : 0}%`,
                        width: '100%'
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        
        {/* Spacer for fixed sidebar */}
        <div className="w-16"></div>
      </div>
    </>
  )

  const ExpandedView = () => (
    <>
      {/* Mobile expanded view - top section */}
      <div className="lg:hidden">
        <div className="bg-white border-b border-gray-200">
          <div className="p-4">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-lg font-semibold">Verification Process</h2>
                <p className="text-sm text-muted-foreground">Follow these simple steps</p>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsExpanded(false)}
                className="p-2"
              >
                <ChevronUp className="h-4 w-4" />
              </Button>
            </div>
            
            <Progress value={progressValue} className="w-full h-2 mb-4" />
            
            <div className="space-y-3">
              {stepsConfig.map((step, index) => {
                const isActive = step.id === currentStep
                const isCompleted = index < currentStepIndex

                return (
                  <div key={step.id} className="flex items-start space-x-3">
                    <StepIcon step={step} index={index} />
                    <div className="flex-grow">
                      <h3
                        className={cn(
                          "font-medium text-sm",
                          isActive ? "text-primary" : isCompleted ? "text-gray-700" : "text-muted-foreground",
                        )}
                      >
                        {step.title}
                      </h3>
                      <p className={cn("text-xs", isActive || isCompleted ? "text-gray-600" : "text-muted-foreground")}>
                        {step.description}
                      </p>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Desktop expanded view - side navigation */}
      <div className="hidden lg:block">
        <div className="fixed left-0 top-0 h-full w-80 bg-white border-r border-gray-200 shadow-sm z-40">
          <div className="p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-xl font-semibold">Verification Process</h2>
                <p className="text-sm text-muted-foreground">Follow these simple steps</p>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsExpanded(false)}
                className="p-2"
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
            </div>
            
            <Progress value={progressValue} className="w-full h-2 mb-6" />
            
            <ol className="space-y-6">
              {stepsConfig.map((step, index) => {
                const isActive = step.id === currentStep
                const isCompleted = index < currentStepIndex

                return (
                  <li key={step.id} className="flex items-start space-x-4">
                    <StepIcon step={step} index={index} />
                    <div className={cn("flex-grow", index < stepsConfig.length - 1 && "pb-6 border-b border-dashed border-gray-200")}>
                      <h3
                        className={cn(
                          "font-medium",
                          isActive ? "text-primary" : isCompleted ? "text-gray-700" : "text-muted-foreground",
                        )}
                      >
                        {step.title}
                      </h3>
                      <p className={cn("text-sm mt-1", isActive || isCompleted ? "text-gray-600" : "text-muted-foreground")}>
                        {step.description}
                      </p>
                      <p className={cn("text-xs mt-2", isActive || isCompleted ? "text-gray-500" : "text-muted-foreground")}>
                        Estimated time: {step.time}
                      </p>
                    </div>
                  </li>
                )
              })}
            </ol>
          </div>
        </div>
        
        {/* Spacer for fixed sidebar */}
        <div className="w-80"></div>
      </div>
    </>
  )

  return (
    <>
      {isExpanded ? <ExpandedView /> : <CollapsedView />}
    </>
  )
}
