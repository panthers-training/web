import { useState } from 'react';
import {
  RadioGroup,
  Radio,
  Label,
  Description,
} from '@headlessui/react';

// ─── Types ────────────────────────────────────────────────────────────────────

interface Option {
  value: string;
  label: string;
  shortcut?: string;
  description?: string;
  disabled?: boolean;
}

interface Props {
  label?: string;
  name: string;
  options: Option[];
  value?: string;
  defaultValue?: string;
  onChange?: (value: string) => void;
  orientation?: 'vertical' | 'horizontal';
  error?: string;
  hint?: string;
  className?: string;
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

function cn(...classes: (string | false | null | undefined)[]) {
  return classes.filter(Boolean).join(' ');
}

// ─── ButtonGroup ──────────────────────────────────────────────────────────────

export default function ButtonGroup({
  label,
  name,
  options,
  value,
  defaultValue = '',
  onChange,
  orientation = 'horizontal',
  error,
  hint,
  className,
}: Props) {
  const [internalValue, setInternalValue] = useState(defaultValue);
  const isControlled = value !== undefined;
  const currentValue = isControlled ? value : internalValue;
  const hasError = Boolean(error);

  function handleChange(next: string) {
    if (!isControlled) setInternalValue(next);
    onChange?.(next);
  }

  return (
    <div className={cn('flex flex-col gap-y-3', className)}>
      <RadioGroup
        name={name}
        value={currentValue}
        onChange={handleChange}
        aria-invalid={hasError ? 'true' : undefined}
        className={cn(
          'flex gap-3',
          orientation === 'horizontal' ? 'flex-row flex-wrap' : 'flex-col',
        )}
      >
        {label && (
          <Label className="w-full text-white/40 text-xs font-medium tracking-widest uppercase mb-1">
            {label}
          </Label>
        )}

        {options.map((option) => (
          <Radio
            key={option.value}
            value={option.value}
            disabled={option.disabled}
            className="group focus:outline-none disabled:cursor-not-allowed disabled:opacity-40"
          >
            <div
              className={cn(
                'flex items-center gap-4 px-6 py-4 border transition-all duration-200 text-sm font-medium tracking-wide cursor-pointer',
                'group-focus-visible:ring-1 group-focus-visible:ring-accent',
                'group-data-[checked]:bg-accent group-data-[checked]:border-accent group-data-[checked]:text-black',
                'group-data-[disabled]:cursor-not-allowed',
                hasError
                  ? 'border-red-500 text-white/60 hover:border-red-400 hover:text-white group-data-[checked]:bg-red-500 group-data-[checked]:border-red-500 group-data-[checked]:text-white'
                  : 'border-white/20 text-white/60 hover:border-accent hover:text-white',
              )}
            >
              {option.shortcut && (
                <span
                  className={cn(
                    'flex size-7 shrink-0 items-center justify-center border text-xs font-semibold tracking-widest transition-colors duration-200',
                    'group-data-[checked]:border-black/20 group-data-[checked]:text-black/60',
                    hasError
                      ? 'border-red-500/40 text-red-400/60'
                      : 'border-white/20 text-white/30 group-hover:border-accent/40 group-hover:text-accent/60',
                  )}
                >
                  {option.shortcut}
                </span>
              )}

              <span className="flex flex-col gap-y-0.5">
                {option.label}
                {option.description && (
                  <Description className="text-current/60 text-xs font-normal tracking-normal">
                    {option.description}
                  </Description>
                )}
              </span>
            </div>
          </Radio>
        ))}
      </RadioGroup>

      {!hasError && hint && (
        <p className="text-white/30 text-xs tracking-wide">{hint}</p>
      )}

      {hasError && (
        <p role="alert" className="text-red-400 text-xs tracking-wide">{error}</p>
      )}
    </div>
  );
}
