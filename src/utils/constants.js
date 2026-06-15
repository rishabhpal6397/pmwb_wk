// src/utils/constants.js
export const PATTERNS = {
  // Only letters (A-Z, a-z) and spaces
  ALPHABETS_SPACES: '^[A-Za-z\\s]+$',
  
  // Letters, spaces, and common punctuation (period, comma, hyphen, apostrophe)
  TEXT_WITH_PUNCTUATION: "^[A-Za-z\\s\\-',.?!]+$",
  
  // Alphanumeric and spaces (letters, numbers, spaces)
  ALPHANUMERIC_SPACES: '^[A-Za-z0-9\\s]+$',
  
  // Alphanumeric, spaces, hyphens, and underscores
  CODE: '^[A-Za-z0-9\\s\\-_]+$',
  
  // Basic email regex
  EMAIL: "^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$",
  
  // Phone (simple – allows numbers, spaces, parentheses, hyphens)
  PHONE: '^[0-9\\s\\-()+]+$',
  
  // Positive integer (for counts like FTEs)
  POSITIVE_INTEGER: '^[0-9]+$',
  
  // Decimal number (for effort, cost)
  DECIMAL: '^[0-9]+\\.?[0-9]*$',
};