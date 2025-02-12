import { render, screen } from '@testing-library/react';
import MyComponent from './MyComponent';
import { test, expect } from 'vitest';

test('renders Hello component', () => {
  render(<MyComponent />);
  expect(screen.getByText(/MyComponent/i)).toBeInTheDocument();
});