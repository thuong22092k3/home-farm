'use client';

import { cn } from '@/lib/utils';
import * as CheckboxPrimitive from '@radix-ui/react-checkbox';
import { motion, useReducedMotion } from 'motion/react';
import type React from 'react';

const SPRING_DEFAULT: { type: 'spring'; duration: number; bounce: number } = { type: 'spring', duration: 0.25, bounce: 0.1 };

export interface CheckboxProps {
  /** Whether the checkbox is checked */
  checked?: boolean;
  /** Default checked state for uncontrolled component */
  defaultChecked?: boolean;
  /** Whether the checkbox is disabled */
  disabled?: boolean;
  /** Label text displayed next to the checkbox */
  label?: string;
  /** Callback when checked state changes */
  onCheckedChange?: (checked: boolean) => void;
  /** Additional CSS class names */
  className?: string;
}

export default function Checkbox({ checked, defaultChecked, disabled = false, label, onCheckedChange, className }: CheckboxProps) {
  const shouldReduceMotion = useReducedMotion();

  return (
    <div className={cn('flex items-center gap-2', className)}>
      <CheckboxPrimitive.Root
        checked={checked}
        defaultChecked={defaultChecked}
        disabled={disabled}
        onCheckedChange={onCheckedChange}
        className={cn(
          'peer h-5 w-5 shrink-0 rounded-sm border border-primary ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground',
        )}
      >
        <CheckboxPrimitive.Indicator className={cn('flex items-center justify-center text-current')}>
          <motion.svg
            initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, scale: 0.5 }}
            animate={shouldReduceMotion ? { opacity: 1 } : { opacity: 1, scale: 1 }}
            transition={shouldReduceMotion ? { duration: 0 } : SPRING_DEFAULT}
            width='14'
            height='14'
            viewBox='0 0 14 14'
            fill='none'
            xmlns='http://www.w3.org/2000/svg'
          >
            <motion.path
              d='M3 7L6 10L11 4'
              stroke='currentColor'
              strokeWidth='2'
              strokeLinecap='round'
              strokeLinejoin='round'
              initial={shouldReduceMotion ? { pathLength: 0 } : { pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={shouldReduceMotion ? { duration: 0 } : { duration: 0.2, delay: 0.1 }}
            />
          </motion.svg>
        </CheckboxPrimitive.Indicator>
      </CheckboxPrimitive.Root>
      {label && (
        <label className={cn('text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70', disabled && 'opacity-50')}>
          {label}
        </label>
      )}
    </div>
  );
}
