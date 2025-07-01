import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import RomanNumeralConverter from './RomanNumeralConverter'
import { convertToRoman } from '../api/romanApi'

jest.mock('../api/romanApi', () => ({
    convertToRoman: jest.fn(),
  }))
  
  const mockConvertToRoman = convertToRoman as jest.Mock
  

describe('RomanNumeralConverter', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('renders input and button', () => {
    render(<RomanNumeralConverter />)
    expect(screen.getByLabelText(/number/i)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /convert/i })).toBeInTheDocument()
  })

  it('disables the convert button when input is empty', () => {
    render(<RomanNumeralConverter />);
    expect(screen.getByRole('button', { name: /convert/i })).toBeDisabled();
  });

  it('shows error for invalid input', async () => {
    render(<RomanNumeralConverter />)
    fireEvent.change(screen.getByLabelText(/number/i), { target: { value: 'abc' } })
    fireEvent.click(screen.getByRole('button', { name: /convert/i }))
    expect(await screen.findByText(/please enter an integer/i)).toBeInTheDocument()
  })

  it('shows result for valid input', async () => {
    mockConvertToRoman.mockResolvedValueOnce({ input: '42', output: 'XLII' })
    render(<RomanNumeralConverter />)
    fireEvent.change(screen.getByLabelText(/number/i), { target: { value: '42' } })
    fireEvent.click(screen.getByRole('button', { name: /convert/i }))
    expect(await screen.findByText(/roman numeral/i)).toBeInTheDocument()
    expect(await screen.findByText('XLII')).toBeInTheDocument()
  })

  it('shows API error', async () => {
    mockConvertToRoman.mockRejectedValueOnce({ message: 'API error' })
    render(<RomanNumeralConverter />)
    fireEvent.change(screen.getByLabelText(/number/i), { target: { value: '99' } })
    fireEvent.click(screen.getByRole('button', { name: /convert/i }))
    expect(await screen.findByText(/api error/i)).toBeInTheDocument()
  })
})