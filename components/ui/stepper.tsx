// components/ui/stepper.tsx
import { cn } from "@/lib/utils";
import { Check } from "lucide-react";

interface StepperProps {
  currentStep: number;
  totalSteps: number;
  className?: string;
}

export function Stepper({ currentStep, totalSteps, className }: StepperProps) {
  return (
    <div className={cn("flex items-center justify-between", className)}>
      {Array.from({ length: totalSteps }).map((_, index) => (
        <div key={index} className="flex flex-col items-center">
          <div
            className={cn(
              "w-8 h-8 rounded-full flex items-center justify-center",
              currentStep > index + 1
                ? "bg-primary text-primary-foreground"
                : currentStep === index + 1
                ? "bg-primary text-primary-foreground"
                : "bg-muted text-muted-foreground"
            )}
          >
            {currentStep > index + 1 ? (
              <Check className="h-4 w-4" />
            ) : (
              index + 1
            )}
          </div>
          <div
            className={cn(
              "text-xs mt-1",
              currentStep >= index + 1
                ? "text-foreground"
                : "text-muted-foreground"
            )}
          >
            Step {index + 1}
          </div>
        </div>
      ))}
    </div>
  );
}
