/**
 * Global App Configuration
 * Centralized configuration for the PThrives Admin application
 */

// Currency Configuration
export const CURRENCY_CONFIG = {
  // Primary currency
  primary: {
    code: 'INR',
    symbol: '₹',
    name: 'Indian Rupee',
    locale: 'en-IN', // For formatting
  },
  
  // Display settings
  display: {
    symbolPosition: 'before' as 'before' | 'after',
    decimalPlaces: 2,
    thousandsSeparator: ',',
    decimalSeparator: '.',
  },
  
  // Formatting options
  formatting: {
    // Format for display (e.g., ₹1,234.56)
    display: {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    },
    
    // Format for input (e.g., 1234.56)
    input: {
      allowDecimals: true,
      maxDecimals: 2,
      minValue: 0,
    },
  },
} as const;

// App-wide settings
export const APP_CONFIG = {
  // Application metadata
  app: {
    name: 'PThrives Admin',
    version: '1.0.0',
    description: 'PThrives Learning Management System Admin Panel',
  },
  
  // Currency settings
  currency: CURRENCY_CONFIG,
  
  // Default values
  defaults: {
    // Course pricing defaults
    course: {
      minPrice: 0,
      maxPrice: 1000000, // 10 lakh rupees
      defaultEconomicalPrice: 0,
      defaultStandardPrice: 0,
      defaultPremiumPrice: 0,
    },
    
    // Form validation
    validation: {
      debounceDelay: 800, // ms
      minSlugLength: 3,
    },
  },
  
  // API settings
  api: {
    baseUrl: process.env.NEXT_PUBLIC_API_URL || '',
    timeout: 30000, // 30 seconds
    retryAttempts: 3,
  },
} as const;

// Type definitions
export type CurrencyConfig = typeof CURRENCY_CONFIG;
export type AppConfig = typeof APP_CONFIG;

// Export individual configs for convenience
export { CURRENCY_CONFIG as currency };
export { APP_CONFIG as app };
