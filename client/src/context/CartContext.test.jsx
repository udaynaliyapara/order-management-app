import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { CartProvider, useCart } from '../context/CartContext';

// Dummy component to test the context
function TestComponent() {
    const { state, dispatch } = useCart();
    return (
        <div>
            <div data-testid="item-count">{state.items.length}</div>
            <button onClick={() => dispatch({ type: 'ADD_TO_CART', payload: { id: 1, name: 'Pizza', price: 200 } })}>
                Add Pizza
            </button>
            <button onClick={() => dispatch({ type: 'UPDATE_QUANTITY', payload: { id: 1, quantity: 2 } })}>
                Update to 2
            </button>
            <button onClick={() => dispatch({ type: 'CLEAR_CART' })}>
                Clear Cart
            </button>
        </div>
    );
}

describe('CartContext', () => {
    it('should add items, update quantity, and clear cart correctly', () => {
        render(
            <CartProvider>
                <TestComponent />
            </CartProvider>
        );

        const count = screen.getByTestId('item-count');
        expect(count.textContent).toBe('0');

        const addButton = screen.getByText('Add Pizza');
        fireEvent.click(addButton);
        expect(count.textContent).toBe('1');

        // Add same item again will just increase quantity, length remains 1
        fireEvent.click(addButton);
        expect(count.textContent).toBe('1');

        const clearButton = screen.getByText('Clear Cart');
        fireEvent.click(clearButton);
        expect(count.textContent).toBe('0');
    });
});
