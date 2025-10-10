'use client';

import React from 'react';
import { cn } from '@/lib/utils';
import { formatCurrency, getCurrencySymbol } from '@/lib/utils/currency.utils';

interface CurrencyDisplayProps {
  amount: number | string;
  className?: string;
  showSymbol?: boolean;
  showCode?: boolean;
  decimals?: number;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'default' | 'success' | 'warning' | 'error' | 'muted';
}

export default function CurrencyDisplay({
  amount,
  className,
  showSymbol = true,
  showCode = false,
  decimals = 2,
  size = 'md',
  variant = 'default',
}: CurrencyDisplayProps) {
  const formattedAmount = formatCurrency(amount, {
    showSymbol,
    decimals,
  });

  const sizeClasses = {
    sm: 'text-xs',
    md: 'text-sm',
    lg: 'text-lg',
  };

  const variantClasses = {
    default: 'text-gray-900',
    success: 'text-green-600',
    warning: 'text-yellow-600',
    error: 'text-red-600',
    muted: 'text-gray-500',
  };

  return (
    <span
      className={cn(
        'font-medium',
        sizeClasses[size],
        variantClasses[variant],
        className
      )}
    >
      {formattedAmount}
      {showCode && (
        <span className="ml-1 text-xs text-gray-400">
          INR
        </span>
      )}
    </span>
  );
}

// Convenience components for common use cases
export function PriceDisplay({ amount, className }: { amount: number | string; className?: string }) {
  return (
    <CurrencyDisplay
      amount={amount}
      className={className}
      size="md"
      variant="default"
    />
  );
}

export function DiscountPrice({ amount, className }: { amount: number | string; className?: string }) {
  return (
    <CurrencyDisplay
      amount={amount}
      className={className}
      size="md"
      variant="success"
    />
  );
}

export function OriginalPrice({ amount, className }: { amount: number | string; className?: string }) {
  return (
    <CurrencyDisplay
      amount={amount}
      className={cn('line-through', className)}
      size="sm"
      variant="muted"
    />
  );
}

export function PriceRange({ 
  minAmount, 
  maxAmount, 
  className 
}: { 
  minAmount: number | string; 
  maxAmount: number | string; 
  className?: string;
}) {
  const symbol = getCurrencySymbol();
  const minFormatted = formatCurrency(minAmount, { showSymbol: false });
  const maxFormatted = formatCurrency(maxAmount, { showSymbol: false });

  return (
    <span className={cn('text-sm font-medium text-gray-900', className)}>
      {symbol}{minFormatted} - {symbol}{maxFormatted}
    </span>
  );
}
