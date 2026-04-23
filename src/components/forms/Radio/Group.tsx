import { useState } from 'react';
import {
  RadioGroup,
  Radio,
  Field as HLField,
  Label,
  Description,
} from '@headlessui/react';

interface Option {
  value: string;
  label: string;
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

export default function Group({
  label,
  name,
  options,
  value,
  defaultValue = '',
  onChange,
  orientation = 'vertical',
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
    <div className={['flex flex-col gap-y-3', className].filter(Boolean).join(' ')}>
      <RadioGroup
        name={name}
        value={currentValue}
        onChange={handleChange}
        aria-invalid={hasError ? 'true' : undefined}
        className={[
          'flex gap-3',
          orientation === 'horizontal' ? 'flex-row flex-wrap' : 'flex-col',
        ].join(' ')}
      >
        {label && (
          <Label className="text-white/40 text-xs font-medium tracking-widest uppercase mb-1">
            {label}
          </Label>
        )}

        {options.map((option) => (
          <Radio
            key={option.value}
            value={option.value}
            disabled={option.disabled}
            className="group f- lex items-start gap-3 cursor-pointer disabled:cursor-not-allowed disabled:opacity-40 focus:outline-none"
          >
            <HLField className="flex items-start gap-3 w-full">
              {/* Custom radio indicator */}
              <span className="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full border border-white/20 transition-all duration-200 group-data-[checked]:border-accent group-data-[focus]:ring-1 group-data-[focus]:ring-accent group-data-[focus]:ring-offset-2 group-data-[focus]:ring-offset-black">
                <span className="size-2 rounded-full transition-all duration-200 scale-0 group-data-[checked]:scale-100 group-data-[checked]:bg-accent" />
              </span>

              <span className="flex flex-col gap-y-0.5">
                <Label className="text-white text-sm font-medium leading-5 cursor-pointer group-data-[disabled]:cursor-not-allowed">
                  {option.label}
                </Label>
                {option.description && (
                  <Description className="text-white/40 text-xs leading-4">
                    {option.description}
                  </Description>
                )}
              </span>
            </HLField>
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
