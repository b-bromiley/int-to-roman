jest.mock('./api/romanApi', () => ({
   convertToRoman: jest.fn(),
}))
  
import React from 'react'
import { render, screen } from '@testing-library/react'
import App from './App'
  
test('renders main heading', () => {
  render(<App />)
  expect(screen.getByRole('heading', { name: /roman numeral converter/i })).toBeInTheDocument()
})