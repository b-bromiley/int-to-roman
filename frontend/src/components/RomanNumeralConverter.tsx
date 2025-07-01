import React, { useState } from 'react'
import {
  View,
  TextField,
  Button,
  Text,
  Heading,
  ProgressCircle,
  Flex
} from '@adobe/react-spectrum'
import { convertToRoman } from '../api/romanApi'

/**
 * Interface for the conversion result
 */
interface ConversionResult {
  input: string
  output: string
}

/**
 * Interface for API error response
 */
interface ApiError {
  message: string
}

/**
 * Main converter component that provides the user interface
 * for converting integers to Roman numerals
 */
const RomanNumeralConverter: React.FC = () => {
  const [input, setInput] = useState<string>('')
  const [result, setResult] = useState<ConversionResult | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState<boolean>(false)

  /**
   * Validates the input before sending to API
   * 
   * @param value - The input value to validate
   * @returns boolean - True if valid, false otherwise
   */
  const validateInput = (value: string): boolean => {
    const num = parseInt(value, 10)
    return !!value && /^\d+$/.test(value) && !isNaN(num) && num >= 1 && num <= 3999
  }

  /**
   * Handles the conversion request
   */
  const handleConvert = async (): Promise<void> => {
    // Clear previous results
    setResult(null)
    setError(null)

    // Validate input
    if (!validateInput(input.trim())) {
      setError('Please enter an integer between 1 and 3999')
      return
    }

    setIsLoading(true)

    try {
      const response = await convertToRoman(input.trim())
        setResult(response)
    } catch (err) {
      const apiError = err as ApiError
      setError(apiError.message || 'An error occurred during conversion')
    } finally {
      setIsLoading(false)
    }
  }

  /**
   * Handles input change and clears errors
   * 
   * @param value - The new input value
   */
  const handleInputChange = (value: string): void => {
    setInput(value)
    // Clear error when user starts typing
    if (error) {
      setError(null)
    }
  }

  return (
    <View>
      <Flex direction="column" gap="size-200">
        {/* Input Section */}
        <View>
          <Heading level={3} marginBottom="size-100">
            Enter a Number
          </Heading>
          
          <Flex gap="size-100" alignItems="start" direction="column">
            <TextField
              aria-label='Number'
              value={input}
              description="Integer between 1 and 3999"
              inputMode="numeric"
              onChange={handleInputChange}
              onKeyDown={e => { if (e.key === 'Enter') handleConvert() }}
              width="size-3000"
              isDisabled={isLoading}
            />
            <Button
              variant="primary"
              onPress={handleConvert}
              isDisabled={isLoading || !input.trim()}
            >
              Convert to roman numeral
            </Button>
          </Flex>
        </View>

        {/* Loading State */}
        {isLoading && (
          <Flex alignItems="center" gap="size-100">
            <ProgressCircle size="S" aria-label="Loading" />
            <Text>Converting...</Text>
          </Flex>
        )}

        {/* Error Display */}
        {error && (
          <View backgroundColor="negative" padding="size-200" borderRadius="medium">
            <Flex direction="column" gap="size-100">
              <Text><strong>Error</strong></Text>
              <Text>{error}</Text>
            </Flex>
          </View>
        )}

        {/* Result Display */}
        {result && (
          <View backgroundColor="blue-400" padding="size-200" borderRadius="medium">
            <Flex direction="column" gap="size-100">
              <Text><strong>Input:</strong> {result.input}</Text>
              <Text><strong>Roman Numeral:</strong> {result.output}</Text>
            </Flex>
          </View>
        )}
      </Flex>
    </View>
  )
}

export default RomanNumeralConverter