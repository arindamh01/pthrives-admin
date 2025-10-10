'use client';

import React, { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { getCurrencySymbol, formatCurrencyForInput, parseCurrency, validateCurrencyInput } from '@/lib/utils/currency.utils';

interface CurrencyInputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange' | 'value'> {
  label?: React.ReactNode;
  value?: number | string;
  onChange?: (value: number) => void;
  error?: string;
  className?: string;
  placeholder?: string;
  showSymbol?: boolean;
  allowDecimals?: boolean;
  minValue?: number;
  maxValue?: number;
}

export default function CurrencyInput({
  label,
  value = 0,
  onChange,
  error,
  className,
  placeholder,
  showSymbol = true,
  allowDecimals = true,
  minValue: _minValue = 0,
  maxValue: _maxValue,
  ...props
}: CurrencyInputProps) {
  const [displayValue, setDisplayValue] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  
  const currencySymbol = getCurrencySymbol();
  
  // Initialize display value
  useEffect(() => {
    const numValue = typeof value === 'string' ? parseCurrency(value) : value;
    setDisplayValue(numValue > 0 ? formatCurrencyForInput(numValue) : '');
  }, [value]);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;
    
    // Allow empty input
    if (inputValue === '') {
      setDisplayValue('');
      onChange?.(0);
      return;
    }
    
    // Remove non-numeric characters except decimal point
    const cleaned = inputValue.replace(/[^\d.]/g, '');
    
    // Prevent multiple decimal points
    const decimalCount = (cleaned.match(/\./g) || []).length;
    if (decimalCount > 1) {
      return;
    }
    
    // Limit decimal places
    if (allowDecimals) {
      const parts = cleaned.split('.');
      if (parts[1] && parts[1].length > 2) {
        return;
      }
    } else {
      // Remove decimal point if decimals not allowed
      const noDecimal = cleaned.replace('.', '');
      setDisplayValue(noDecimal);
      const numValue = parseFloat(noDecimal);
      if (!isNaN(numValue)) {
        onChange?.(numValue);
      }
      return;
    }
    
    setDisplayValue(cleaned);
    
    // Parse and validate
    const numValue = parseFloat(cleaned);
    if (!isNaN(numValue)) {
      onChange?.(numValue);
    }
  };
  
  const handleBlur = () => {
    setIsFocused(false);
    
    // Format the value on blur
    const numValue = parseFloat(displayValue);
    if (!isNaN(numValue) && numValue > 0) {
      setDisplayValue(formatCurrencyForInput(numValue));
    }
  };
  
  const handleFocus = () => {
    setIsFocused(true);
  };
  
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    // Allow: backspace, delete, tab, escape, enter, home, end, left, right, up, down
    if ([8, 9, 27, 13, 46, 35, 36, 37, 38, 39, 40].indexOf(e.keyCode) !== -1 ||
        // Allow: Ctrl+A, Ctrl+C, Ctrl+V, Ctrl+X
        (e.keyCode === 65 && e.ctrlKey === true) ||
        (e.keyCode === 67 && e.ctrlKey === true) ||
        (e.keyCode === 86 && e.ctrlKey === true) ||
        (e.keyCode === 88 && e.ctrlKey === true)) {
      return;
    }
    
    // Ensure that it is a number and stop the keypress
    if ((e.shiftKey || (e.keyCode < 48 || e.keyCode > 57)) && (e.keyCode < 96 || e.keyCode > 105)) {
      // Allow decimal point if decimals are allowed
      if (allowDecimals && e.keyCode === 190 && displayValue.indexOf('.') === -1) {
        return;
      }
      e.preventDefault();
    }
  };
  
  const validation = validateCurrencyInput(displayValue);
  
  return (
    <div className={cn('space-y-2', className)}>
      {label && (
        <label className="block text-sm font-medium text-gray-700">
          {label}
        </label>
      )}
      
      <div className="relative">
        {showSymbol && (
          <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 text-sm font-medium">
            {currencySymbol}
          </div>
        )}
        
        <input
          type="text"
          value={displayValue}
          onChange={handleChange}
          onBlur={handleBlur}
          onFocus={handleFocus}
          onKeyDown={handleKeyDown}
          placeholder={placeholder || `Enter amount in ${currencySymbol}`}
          className={cn(
            'w-full px-3 py-2 border rounded-lg text-sm transition-colors',
            'focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent',
            'disabled:bg-gray-50 disabled:text-gray-500 disabled:cursor-not-allowed',
            showSymbol ? 'pl-8' : 'pl-3',
            error || (!validation.isValid && displayValue !== '') 
              ? 'border-red-300 focus:ring-red-500' 
              : 'border-gray-300 focus:border-blue-500',
            isFocused ? 'bg-white' : 'bg-white'
          )}
          {...props}
        />
        
        {/* Currency code indicator */}
        <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-xs text-gray-400">
          INR
        </div>
      </div>
      
      {/* Error message */}
      {error && (
        <p className="text-xs text-red-500">{error}</p>
      )}
      
      {/* Validation message */}
      {!validation.isValid && displayValue !== '' && !error && (
        <p className="text-xs text-red-500">{validation.error}</p>
      )}
      
      {/* Helper text */}
      {validation.isValid && displayValue !== '' && (
        <p className="text-xs text-gray-500">
          {currencySymbol}{parseFloat(displayValue).toLocaleString('en-IN')}
        </p>
      )}
    </div>
  );
}
