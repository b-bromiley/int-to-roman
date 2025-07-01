/**
 * Interface for the conversion result
 */
export interface ConversionResult {
  input: string
  output: string
}

/**
 * Interface for validation errors
 */
export interface ValidationError {
  error: string
  message: string
}

/**
 * Roman numeral mapping for conversion
 * Ordered from largest to smallest for proper conversion
 */
const ROMAN_NUMERALS: Array<{ value: number; numeral: string }> = [
  { value: 1000, numeral: 'M' },
  { value: 900, numeral: 'CM' },
  { value: 500, numeral: 'D' },
  { value: 400, numeral: 'CD' },
  { value: 100, numeral: 'C' },
  { value: 90, numeral: 'XC' },
  { value: 50, numeral: 'L' },
  { value: 40, numeral: 'XL' },
  { value: 10, numeral: 'X' },
  { value: 9, numeral: 'IX' },
  { value: 5, numeral: 'V' },
  { value: 4, numeral: 'IV' },
  { value: 1, numeral: 'I' }
]

/**
 * Validates if the input is a valid integer for Roman numeral conversion
 * 
 * @param input - The input string to validate
 * @returns ValidationError | null - Returns error object if validation fails, null if valid
 */
export function validateInput(input: string): ValidationError | null {
  // Check if input is provided
  if (!input || input.trim() === '') {
    return {
      error: 'MISSING_INPUT',
      message: 'Input is required'
    }
  }

  // Check if input is a valid number
  const num = parseInt(input.trim(), 10)
  if (isNaN(num)) {
    return {
      error: 'INVALID_NUMBER',
      message: 'Input must be a valid integer'
    }
  }

  // Check if number is within valid range (1-3999)
  if (num < 1 || num > 3999) {
    return {
      error: 'OUT_OF_RANGE',
      message: 'Input must be between 1 and 3999'
    }
  }

  // Check if input contains invalid characters
  if (!/^\d+$/.test(input.trim())) {
    return {
      error: 'INVALID_CHARACTERS',
      message: 'Input must be a valid integer'
    }
  }

  return null
}

/**
 * Converts an integer to its Roman numeral representation
 * 
 * @param num - The integer to convert (must be between 1-3999)
 * @returns string - The Roman numeral representation
 * @throws Error if input is invalid
 */
export function convertToRoman(num: number): string {
  if (num < 1 || num > 3999) {
    throw new Error('Number must be between 1 and 3999')
  }

  let result = ''
  let remaining = num

  // Iterate through Roman numeral mappings from largest to smallest
  for (const { value, numeral } of ROMAN_NUMERALS) {
    // While the remaining value is greater than or equal to current Roman value
    while (remaining >= value) {
      result += numeral
      remaining -= value
    }
  }

  return result
}

/**
 * Main conversion function that validates input and converts to Roman numeral
 * 
 * @param input - The input string to convert
 * @returns ConversionResult - Object containing input and output
 * @throws ValidationError if input validation fails
 */
export function convertIntegerToRoman(input: string): ConversionResult {
  const validationError = validateInput(input)
  if (validationError) {
    throw validationError
  }

  const num = parseInt(input.trim(), 10)
  const romanNumeral = convertToRoman(num)

  return {
    input: input.trim(),
    output: romanNumeral
  }
}