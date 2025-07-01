import axios, { AxiosResponse, AxiosError } from 'axios'

/**
 * Interface for the conversion result from API
 */
export interface ConversionResult {
  input: string
  output: string
}

/**
 * Base URL for the API
 */
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080'

/**
 * Axios instance configured for the API
 */
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
})

/**
 * Converts an integer to Roman numeral by calling the API
 * 
 * @param number - The integer to convert (as string)
 * @returns Promise<ConversionResult> - The conversion result
 * @throws Error if the API call fails
 */
export const convertToRoman = async (number: string): Promise<ConversionResult> => {
  try {
    const response: AxiosResponse<ConversionResult> = await apiClient.get('/romannumeral', {
      params: { query: number }
    })
    
    return response.data
  } catch (error) {
    const axiosError = error as AxiosError
    
    if (axiosError.response) {
      // Server responded with error
      const errorMessage = typeof axiosError.response.data === 'string'
        ? axiosError.response.data
        : 'An error occurred during conversion'
      
      throw new Error(errorMessage)
    } else if (axiosError.request) {
      // Request was made but no response received
      throw new Error('Unable to connect to the server. Please check your connection and try again.')
    } else {
      // Something else happened
      throw new Error('An unexpected error occurred. Please try again.')
    }
  }
}


export default {
  convertToRoman
}