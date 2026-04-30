import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import Menu from './Menu';
import { useQuery } from '@tanstack/react-query';
import { useCart } from '../context/CartContext';

// Mock dependencies
vi.mock('@tanstack/react-query');
vi.mock('../context/CartContext');

describe('Menu Component', () => {
    it('shows a loading spinner when data is loading', () => {
        useQuery.mockReturnValue({ isLoading: true });
        useCart.mockReturnValue({ dispatch: vi.fn(), state: { items: [] } });

        const { container } = render(<Menu />);
        expect(container.querySelector('.animate-spin')).toBeInTheDocument();
    });

    it('displays menu items when data is successfully loaded', () => {
        useQuery.mockReturnValue({
            isLoading: false,
            isError: false,
            data: [
                { id: 1, name: 'Burger', description: 'Delicious burger', price: 150, image: 'burger.jpg' },
                { id: 2, name: 'Pizza', description: 'Cheesy pizza', price: 250, image: 'pizza.jpg' },
            ]
        });
        useCart.mockReturnValue({ dispatch: vi.fn(), state: { items: [] } });

        render(<Menu />);

        expect(screen.getByText('Burger')).toBeInTheDocument();
        expect(screen.getByText('Pizza')).toBeInTheDocument();
        expect(screen.getByText('₹150')).toBeInTheDocument();
    });
});
