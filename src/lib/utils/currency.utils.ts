/**
 * Currency Utility Functions
 * Handles formatting, parsing, and validation of currency values
 */

import { CURRENCY_CONFIG } from '@/lib/config/app.config';

/**
 * Format a number as currency string for display
 * @param amount - The amount to format
 * @param options - Formatting options
 * @returns Formatted currency string (e.g., "₹1,234.56")
 */
export function formatCurrency(
  amount: number | string,
  options?: {
    showSymbol?: boolean;
    decimals?: number;
    locale?: string;
  }
): string {
  const {
    showSymbol = true,
    decimals = CURRENCY_CONFIG.display.decimalPlaces,
    locale = CURRENCY_CONFIG.primary.locale,
  } = options || {};

  const numAmount = typeof amount === 'string' ? parseFloat(amount) : amount;
  
  if (isNaN(numAmount)) {
    return showSymbol ? `${CURRENCY_CONFIG.primary.symbol}0` : '0';
  }

  const formatter = new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: CURRENCY_CONFIG.primary.code,
    minimumFractionDigits: 0,
    maximumFractionDigits: decimals,
  });

  const formatted = formatter.format(numAmount);
  
  // Remove symbol if not needed (for cases where we want just the number)
  if (!showSymbol) {
    return formatted.replace(CURRENCY_CONFIG.primary.symbol, '').trim();
  }

  return formatted;
}

/**
 * Format currency for input fields (no symbol, just number)
 * @param amount - The amount to format
 * @returns Formatted number string (e.g., "1234.56")
 */
export function formatCurrencyForInput(amount: number | string): string {
  const numAmount = typeof amount === 'string' ? parseFloat(amount) : amount;
  
  if (isNaN(numAmount)) {
    return '0';
  }

  // Use fixed decimal places but remove trailing zeros
  const formatted = numAmount.toFixed(CURRENCY_CONFIG.display.decimalPlaces);
  return parseFloat(formatted).toString();
}

/**
 * Parse currency string to number
 * @param currencyString - Currency string to parse
 * @returns Parsed number or 0 if invalid
 */
export function parseCurrency(currencyString: string): number {
  if (!currencyString) return 0;
  
  // Remove currency symbol and spaces
  const cleaned = currencyString
    .replace(CURRENCY_CONFIG.primary.symbol, '')
    .replace(/\s/g, '')
    .replace(/,/g, ''); // Remove thousands separators
  
  const parsed = parseFloat(cleaned);
  return isNaN(parsed) ? 0 : parsed;
}

/**
 * Validate currency input
 * @param value - Input value to validate
 * @returns Validation result
 */
export function validateCurrencyInput(value: string | number): {
  isValid: boolean;
  error?: string;
  parsedValue?: number;
} {
  const numValue = typeof value === 'string' ? parseCurrency(value) : value;
  
  // Check if it's a valid number
  if (isNaN(numValue)) {
    return {
      isValid: false,
      error: 'Please enter a valid amount',
    };
  }
  
  // Check minimum value
  if (numValue < CURRENCY_CONFIG.formatting.input.minValue) {
    return {
      isValid: false,
      error: `Amount must be at least ${formatCurrency(CURRENCY_CONFIG.formatting.input.minValue)}`,
    };
  }
  
  // Check decimal places
  const decimalPlaces = (numValue.toString().split('.')[1] || '').length;
  if (decimalPlaces > CURRENCY_CONFIG.formatting.input.maxDecimals) {
    return {
      isValid: false,
      error: `Maximum ${CURRENCY_CONFIG.formatting.input.maxDecimals} decimal places allowed`,
    };
  }
  
  return {
    isValid: true,
    parsedValue: numValue,
  };
}

/**
 * Get currency symbol
 * @returns Currency symbol (₹)
 */
export function getCurrencySymbol(): string {
  return CURRENCY_CONFIG.primary.symbol;
}

/**
 * Get currency code
 * @returns Currency code (INR)
 */
export function getCurrencyCode(): string {
  return CURRENCY_CONFIG.primary.code;
}

/**
 * Get currency name
 * @returns Currency name (Indian Rupee)
 */
export function getCurrencyName(): string {
  return CURRENCY_CONFIG.primary.name;
}

/**
 * Format price with proper spacing and symbol
 * @param amount - Amount to format
 * @returns Formatted price string
 */
export function formatPrice(amount: number | string): string {
  return formatCurrency(amount, { showSymbol: true });
}

/**
 * Format price range (e.g., "₹1,000 - ₹2,000")
 * @param minAmount - Minimum amount
 * @param maxAmount - Maximum amount
 * @returns Formatted price range string
 */
export function formatPriceRange(minAmount: number | string, maxAmount: number | string): string {
  const min = formatCurrency(minAmount, { showSymbol: false });
  const max = formatCurrency(maxAmount, { showSymbol: false });
  const symbol = getCurrencySymbol();
  
  return `${symbol}${min} - ${symbol}${max}`;
}

/**
 * Get currency display info for UI components
 * @returns Currency display information
 */
export function getCurrencyDisplayInfo() {
  return {
    symbol: CURRENCY_CONFIG.primary.symbol,
    code: CURRENCY_CONFIG.primary.code,
    name: CURRENCY_CONFIG.primary.name,
    symbolPosition: CURRENCY_CONFIG.display.symbolPosition,
    decimalPlaces: CURRENCY_CONFIG.display.decimalPlaces,
  };
}
