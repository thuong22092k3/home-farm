'use client';

import { cn } from '@/lib/utils';
import * as RadioGroupPrimitive from '@radix-ui/react-radio-group';
import { motion, useReducedMotion } from 'motion/react';
import type React from 'react';
import { Children, isValidElement, cloneElement } from 'react';

const SPRING_DEFAULT: { type: 'spring'; duration: number; bounce: number } = { type: 'spring', duration: 0.25, bounce: 0.1 };

export interface RadioGroupProps {
  /** The value of the selected radio item */
  value?: string;
  /** Default value for uncontrolled component */
  defaultValue?: string;
  /** Callback when value changes */
  onValueChange?: (value: string) => void;
  /** Whether the radio group is disabled */
  disabled?: boolean;
  /** Children RadioGroupItem components */
  children: React.ReactNode;
  /** Additional CSS class names */
  className?: string;
}

export function RadioGroup({ value, defaultValue, onValueChange, disabled, children, className }: RadioGroupProps) {
  return (
    <RadioGroupPrimitive.Root
      value={value}
      defaultValue={defaultValue}
      onValueChange={onValueChange}
      disabled={disabled}
      className={cn('grid gap-2', className)}
    >
      {Children.map(children, (child) => {
        if (isValidElement(child)) {
          return cloneElement(child as React.ReactElement<{ onValueChange?: (v: string) => void }>, {
            onValueChange,
          });
        }
        return child;
      })}
    </RadioGroupPrimitive.Root>
  );
}

export interface RadioGroupItemProps {
  /** The value of this radio item */
  value: string;
  /** Whether this radio item is disabled */
  disabled?: boolean;
  /** Label text */
  label?: string;
  /** Additional CSS class names */
  className?: string;
}

export function RadioGroupItem({ value, disabled, label, className }: RadioGroupItemProps) {
  const id = `radio-${value}`;
  const shouldReduceMotion = useReducedMotion();

  return (
    <div className={cn('flex items-center gap-2', className)}>
      <RadioGroupPrimitive.Item
        id={id}
        value={value}
        disabled={disabled}
        className={cn(
          'peer h-5 w-5 shrink-0 rounded-full border border-primary ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:border-primary',
        )}
      >
        <RadioGroupPrimitive.Indicator className='flex items-center justify-center'>
          <motion.div
            initial={shouldReduceMotion ? { scale: 1 } : { scale: 0 }}
            animate={{ scale: 1 }}
            transition={shouldReduceMotion ? { duration: 0 } : SPRING_DEFAULT}
            className='h-2.5 w-2.5 rounded-full bg-primary'
          />
        </RadioGroupPrimitive.Indicator>
      </RadioGroupPrimitive.Item>
      {label && (
        <label
          htmlFor={id}
          className={cn('text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70', disabled && 'opacity-50')}
        >
          {label}
        </label>
      )}
    </div>
  );
}
