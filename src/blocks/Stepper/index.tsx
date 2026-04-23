import React, {
  createContext,
  useContext,
  type CSSProperties,
  type ReactNode,
  type ReactElement,
} from 'react';

// ─── Types ────────────────────────────────────────────────────────────────────

type Variant = 'classic' | 'typeform';
type Animation = 'slide-x' | 'slide-y' | 'fade';

interface StepperContextValue {
  currentStep: number;
  totalSteps: number;
  isFirst: boolean;
  isLast: boolean;
  variant: Variant;
  next: () => void;
  prev: () => void;
  goToStep: (n: number) => void;
}

// ─── Context + hook ───────────────────────────────────────────────────────────

const StepperContext = createContext<StepperContextValue | null>(null);

export function useStepper(): StepperContextValue {
  const ctx = useContext(StepperContext);
  if (!ctx) throw new Error('useStepper must be used inside a <Stepper>.');
  return ctx;
}

// ─── Step ─────────────────────────────────────────────────────────────────────

export interface StepProps {
  children: ReactNode;
  label?: string;
  description?: string;
  className?: string;
}

function Step(_props: StepProps) {
  return null;
}
Step.displayName = 'Stepper.Step';

// ─── Helpers ──────────────────────────────────────────────────────────────────

function isStep(child: unknown): child is ReactElement<StepProps> {
  return React.isValidElement(child) && (child as ReactElement).type === Step;
}

function cn(...classes: (string | false | null | undefined)[]): string {
  return classes.filter(Boolean).join(' ');
}

// ─── Check icon ───────────────────────────────────────────────────────────────

function CheckIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
      <path
        d="M2 6.5l2.5 2.5 5.5-5.5"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

// ─── Classic indicator ────────────────────────────────────────────────────────

interface StepMeta {
  label?: string;
  description?: string;
}

function ClassicIndicator({
  steps,
  currentStep,
}: {
  steps: StepMeta[];
  currentStep: number;
}) {
  return (
    <nav aria-label="Step progress" className="flex items-start w-full mb-10">
      {steps.map((step, index) => {
        const isCompleted = index < currentStep;
        const isActive = index === currentStep;

        return (
          <React.Fragment key={index}>
            <div className="flex flex-col items-center gap-2 shrink-0">
              <div
                aria-current={isActive ? 'step' : undefined}
                className={cn(
                  'size-8 rounded-full flex items-center justify-center text-xs font-semibold transition-all duration-300',
                  isCompleted && 'bg-accent text-black',
                  isActive && 'border-2 border-accent text-accent',
                  !isCompleted && !isActive && 'border border-white/20 text-white/30',
                )}
              >
                {isCompleted ? <CheckIcon /> : <span>{index + 1}</span>}
              </div>

              {step.label && (
                <span
                  className={cn(
                    'text-xs tracking-wide text-center max-w-24 leading-tight transition-colors duration-300',
                    isActive && 'text-accent',
                    isCompleted && 'text-white/60',
                    !isCompleted && !isActive && 'text-white/30',
                  )}
                >
                  {step.label}
                  {step.description && (
                    <span className="block text-white/30 text-xs mt-0.5">
                      {step.description}
                    </span>
                  )}
                </span>
              )}
            </div>

            {index < steps.length - 1 && (
              <div
                className={cn(
                  'flex-1 h-px mx-3 mt-4 transition-colors duration-500',
                  isCompleted ? 'bg-accent' : 'bg-white/10',
                )}
              />
            )}
          </React.Fragment>
        );
      })}
    </nav>
  );
}

// ─── Typeform container ───────────────────────────────────────────────────────

interface StepContent {
  content: ReactNode;
  className?: string;
}

function getStepStyle(offset: number, animation: Animation): CSSProperties {
  if (animation === 'fade') {
    return {
      opacity: offset === 0 ? 1 : 0,
      pointerEvents: offset === 0 ? 'auto' : 'none',
      transition: 'opacity 0.4s ease',
    };
  }

  const axis = animation === 'slide-x' ? 'translateX' : 'translateY';
  const transform =
    offset === 0 ? 'none' : offset < 0 ? `${axis}(-100%)` : `${axis}(100%)`;

  return {
    transform,
    pointerEvents: offset === 0 ? 'auto' : 'none',
    transition: 'transform 0.45s cubic-bezier(0.4, 0, 0.2, 1)',
  };
}

function TypeformContainer({
  steps,
  currentStep,
  animation,
}: {
  steps: StepContent[];
  currentStep: number;
  animation: Animation;
}) {
  return (
    <div className="relative overflow-hidden w-full h-full">
      {steps.map((step, index) => {
        const offset = index - currentStep;
        return (
          <div
            key={index}
            className={cn('absolute inset-0', step.className)}
            style={getStepStyle(offset, animation)}
            aria-hidden={offset !== 0 ? 'true' : undefined}
          >
            {step.content}
          </div>
        );
      })}
    </div>
  );
}

// ─── Stepper ──────────────────────────────────────────────────────────────────

interface StepperProps {
  children: ReactNode;
  step: number;
  onStepChange: (step: number) => void;
  variant?: Variant;
  animation?: Animation;
  className?: string;
}

function Stepper({
  children,
  step: currentStep,
  onStepChange,
  variant = 'classic',
  animation = 'slide-x',
  className,
}: StepperProps) {
  const rawChildren = React.Children.toArray(children);

  if (process.env.NODE_ENV !== 'production') {
    rawChildren.forEach((child) => {
      if (!isStep(child)) {
        console.error(
          'Stepper: All direct children must be <Stepper.Step> components. Other elements are ignored.',
        );
      }
    });
  }

  const stepElements = rawChildren.filter(isStep);
  const totalSteps = stepElements.length;

  const steps = stepElements.map((el) => ({
    label: el.props.label,
    description: el.props.description,
    content: el.props.children,
    className: el.props.className,
  }));

  function goToStep(n: number) {
    onStepChange(Math.max(0, Math.min(n, totalSteps - 1)));
  }

  const ctx: StepperContextValue = {
    currentStep,
    totalSteps,
    isFirst: currentStep === 0,
    isLast: currentStep === totalSteps - 1,
    variant,
    next: () => goToStep(currentStep + 1),
    prev: () => goToStep(currentStep - 1),
    goToStep,
  };

  return (
    <StepperContext.Provider value={ctx}>
      <div className={cn('flex flex-col', className)}>
        {variant === 'classic' && (
          <>
            <ClassicIndicator steps={steps} currentStep={currentStep} />
            <div className={steps[currentStep]?.className}>
              {steps[currentStep]?.content}
            </div>
          </>
        )}

        {variant === 'typeform' && (
          <TypeformContainer
            steps={steps}
            currentStep={currentStep}
            animation={animation}
          />
        )}
      </div>
    </StepperContext.Provider>
  );
}

Stepper.Step = Step;

export default Stepper;
