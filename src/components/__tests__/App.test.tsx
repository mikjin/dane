import React from 'react';
import { render, screen } from '@testing-library/react';
import App from '../../App';

jest.mock('../../context/TaxContext', () => ({
  TaxProvider: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
}));

describe('App Component', () => {
  it('renders without crashing', () => {
    render(<App />);
    expect(screen.getByText(/Kalkulátor rozdělení daní ČR/i)).toBeInTheDocument();
  });

  it('contains TaxCalculator and TaxDistribution components', () => {
    render(<App />);
    expect(screen.getByText(/Roční odvod na daních/i)).toBeInTheDocument();
    expect(screen.getByText(/Rozdělení vašich daní/i)).toBeInTheDocument();
  });

  it('displays the correct title and description', () => {
    render(<App />);
    expect(screen.getByText(/Kalkulátor rozdělení daní ČR/i)).toBeInTheDocument();
    expect(screen.getByText(/Zjistěte, jak jsou vaše daně rozděleny mezi různé státní služby/i)).toBeInTheDocument();
  });
});