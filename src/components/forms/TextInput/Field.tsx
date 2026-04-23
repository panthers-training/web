import type { InputHTMLAttributes } from 'react';
import {
  Field as HLField,
  Input,
  Label,
  Description,
} from '@headlessui/react';

interface Props extends Omit<InputHTMLAttributes<HTMLInputElement>, 'className' | 'id'> {
  label: string;
  name: string;
  id?: string;
  error?: string;
  hint?: string;
  className?: string;
}

export default function Field({
  label,
  name,
  id = name,
  type = 'text',
  required = false,
  error,
  hint,
  className,
  ...inputProps
}: Props) {
  const hasError = Boolean(error);

  return (
    <HLField
      className={['relative flex flex-col gap-y-1.5', className].filter(Boolean).join(' ')}
    >
      <div className="relative">
        <Input
          id={id}
          name={name}
          type={type}
          required={required || undefined}
          placeholder=" "
          className={[
            'peer w-full bg-transparent pt-6 pb-2 text-white text-base font-normal focus:outline-none placeholder-transparent transition-colors duration-300 caret-accent',
            'border-b',
            hasError
              ? 'border-red-500 focus:border-red-400'
              : 'border-white/20 focus:border-white/40',
          ].join(' ')}
          {...inputProps}
        />

        <Label className={[
          'pointer-events-none select-none absolute left-0 transition-all duration-300',
          'top-2 text-xs font-medium tracking-widest uppercase',
          'peer-placeholder-shown:top-6 peer-placeholder-shown:text-base peer-placeholder-shown:tracking-normal peer-placeholder-shown:font-normal peer-placeholder-shown:normal-case',
          'peer-focus:top-2 peer-focus:text-xs peer-focus:tracking-widest peer-focus:font-medium peer-focus:uppercase',
          hasError
            ? 'text-red-400 peer-placeholder-shown:text-white/40 peer-focus:text-red-400'
            : 'text-accent peer-placeholder-shown:text-white/40 peer-focus:text-accent',
        ].join(' ')}>
          {label}
          {required && <span className="ml-0.5" aria-hidden="true">*</span>}
        </Label>

        <span
          aria-hidden="true"
          className={[
            'absolute bottom-0 left-0 h-px w-0 transition-all duration-500 ease-out peer-focus:w-full',
            hasError ? 'bg-red-500' : 'bg-accent',
          ].join(' ')}
        />
      </div>

      {hint && (
        <Description className="text-white/30 text-xs tracking-wide">
          {hint}
        </Description>
      )}

      {
        hasError ? (
          <div className="text-red-400 text-xs tracking-wide">
            {error}
          </div>
        ) : null
      }
    </HLField>
  );
}
