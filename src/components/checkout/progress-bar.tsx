
'use client';

interface ProgressBarProps {
    currentStep: number;
    totalSteps: number;
}

const steps = ["Account", "Billing", "Payment", "Review"];

export default function ProgressBar({ currentStep, totalSteps }: ProgressBarProps) {
    const progressPercentage = (currentStep / (totalSteps - 1)) * 100;

    return (
        <div className="mb-8">
            <div className="relative h-2 bg-secondary rounded-full">
                <div
                    className="absolute top-0 left-0 h-full bg-primary rounded-full transition-all duration-500 ease-out"
                    style={{ width: `${progressPercentage}%` }}
                />
            </div>
            <div className="flex justify-between text-xs text-muted-foreground mt-2">
                {steps.map((step, index) => (
                    <span key={step} className={index <= currentStep ? "font-semibold text-primary" : ""}>
                        {step}
                    </span>
                ))}
            </div>
        </div>
    );
}
