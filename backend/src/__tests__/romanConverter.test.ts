import {
  convertIntegerToRoman,
  convertToRoman,
  validateInput
} from '../utils/romanConverter'

describe('Roman Numeral Converter', () => {
  describe('validateInput', () => {
    it('should return null for valid input', () => {
      expect(validateInput('1')).toBeNull()
      expect(validateInput('42')).toBeNull()
      expect(validateInput('3999')).toBeNull()
    });

    it('should return error for missing input', () => {
      const result = validateInput('')
      expect(result).toEqual({
        error: 'MISSING_INPUT',
        message: 'Input is required'
      })
    })

    it('should return error for invalid number', () => {
      const result = validateInput('abc')
      expect(result).toEqual({
        error: 'INVALID_NUMBER',
        message: 'Input must be a valid integer'
      })
    })

    it('should return error for out of range numbers', () => {
      const result1 = validateInput('0')
      expect(result1).toEqual({
        error: 'OUT_OF_RANGE',
        message: 'Input must be between 1 and 3999'
      })

      const result2 = validateInput('4000')
      expect(result2).toEqual({
        error: 'OUT_OF_RANGE',
        message: 'Input must be between 1 and 3999'
      })
    })

    it('should return error for invalid characters', () => {
      const result = validateInput('3.14')
      expect(result).toEqual({
        error: 'INVALID_CHARACTERS',
        message: 'Input must be a valid integer'
      })
    })
  });

  describe('convertToRoman', () => {
    it('should convert basic numbers correctly', () => {
      expect(convertToRoman(1)).toBe('I')
      expect(convertToRoman(5)).toBe('V')
      expect(convertToRoman(10)).toBe('X')
      expect(convertToRoman(50)).toBe('L')
      expect(convertToRoman(100)).toBe('C')
      expect(convertToRoman(500)).toBe('D')
      expect(convertToRoman(1000)).toBe('M')
    })

    it('should handle subtractive notation correctly', () => {
      expect(convertToRoman(4)).toBe('IV')
      expect(convertToRoman(9)).toBe('IX')
      expect(convertToRoman(40)).toBe('XL')
      expect(convertToRoman(90)).toBe('XC')
      expect(convertToRoman(400)).toBe('CD')
      expect(convertToRoman(900)).toBe('CM')
    })

    it('should handle complex numbers correctly', () => {
      expect(convertToRoman(42)).toBe('XLII')
      expect(convertToRoman(1984)).toBe('MCMLXXXIV')
      expect(convertToRoman(2023)).toBe('MMXXIII')
      expect(convertToRoman(3999)).toBe('MMMCMXCIX')
    });

    it('should throw error for invalid numbers', () => {
      expect(() => convertToRoman(0)).toThrow('Number must be between 1 and 3999')
      expect(() => convertToRoman(4000)).toThrow('Number must be between 1 and 3999')
    })
  })

  describe('convertIntegerToRoman', () => {
    it('should convert basic numbers correctly', () => {
        expect(convertToRoman(1)).toBe('I')
        expect(convertToRoman(5)).toBe('V')
        expect(convertToRoman(10)).toBe('X')
        expect(convertToRoman(50)).toBe('L')
        expect(convertToRoman(100)).toBe('C')
        expect(convertToRoman(500)).toBe('D')
        expect(convertToRoman(1000)).toBe('M')
      })
  
      it('should handle subtractive notation correctly', () => {
        expect(convertToRoman(4)).toBe('IV')
        expect(convertToRoman(9)).toBe('IX')
        expect(convertToRoman(40)).toBe('XL')
        expect(convertToRoman(90)).toBe('XC')
        expect(convertToRoman(400)).toBe('CD')
        expect(convertToRoman(900)).toBe('CM')
      })
  
      it('should handle complex numbers correctly', () => {
        expect(convertToRoman(42)).toBe('XLII')
        expect(convertToRoman(1984)).toBe('MCMLXXXIV')
        expect(convertToRoman(2023)).toBe('MMXXIII')
        expect(convertToRoman(3999)).toBe('MMMCMXCIX')
      });
  
      it('should throw error for invalid numbers', () => {
        expect(() => convertToRoman(0)).toThrow('Number must be between 1 and 3999')
        expect(() => convertToRoman(4000)).toThrow('Number must be between 1 and 3999')
      })


    it('should return correct ConversionResult for valid input', () => {
      const result = convertIntegerToRoman('42')
      expect(result).toEqual({
        input: '42',
        output: 'XLII'
      })
    })

    it('should throw ValidationError for invalid input', () => {
      expect(() => convertIntegerToRoman('')).toThrow()
      expect(() => convertIntegerToRoman('abc')).toThrow()
      expect(() => convertIntegerToRoman('0')).toThrow()
      expect(() => convertIntegerToRoman('4000')).toThrow()
    })

    it('should handle whitespace in input', () => {
      const result = convertIntegerToRoman('  42  ')
      expect(result).toEqual({
        input: '42',
        output: 'XLII'
      })
    })
  })

  describe('Edge cases and boundary conditions', () => {
    it('should handle minimum and maximum values', () => {
      expect(convertIntegerToRoman('1')).toEqual({ input: '1', output: 'I' })
      expect(convertIntegerToRoman('3999')).toEqual({ input: '3999', output: 'MMMCMXCIX' });
    })

    it('should handle common numbers', () => {
      const commonNumbers = [
        { input: '1', expected: 'I' },
        { input: '5', expected: 'V' },
        { input: '10', expected: 'X' },
        { input: '50', expected: 'L' },
        { input: '100', expected: 'C' },
        { input: '500', expected: 'D' },
        { input: '1000', expected: 'M' }
      ]

      commonNumbers.forEach(({ input, expected }) => {
        const result = convertIntegerToRoman(input)
        expect(result.output).toBe(expected)
      })
    })
  })
})