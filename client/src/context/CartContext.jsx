import { createContext, useContext, useReducer } from "react";

const CartContext = createContext();

const initialState = {
    items: []
};

function cartReducer(state, action) {
    switch (action.type) {
        case "ADD_TO_CART": {
            const existing = state.items.find(i => i.id === action.payload.id);

            if (existing) {
                return {
                    ...state,
                    items: state.items.map(item =>
                        item.id === action.payload.id
                            ? { ...item, quantity: item.quantity + 1 }
                            : item
                    )
                };
            }

            return {
                ...state,
                items: [...state.items, { ...action.payload, quantity: 1 }]
            };
        }

        case "REMOVE_FROM_CART":
            return {
                ...state,
                items: state.items.filter(item => item.id !== action.payload)
            };

        case "UPDATE_QUANTITY":
            return {
                ...state,
                items: state.items
                    .map(item =>
                        item.id === action.payload.id
                            ? { ...item, quantity: action.payload.quantity }
                            : item
                    )
                    .filter(item => item.quantity > 0)
            };

        case "CLEAR_CART":
            return {
                ...state,
                items: []
            };

        default:
            return state;
    }
}

export function CartProvider({ children }) {
    const [state, dispatch] = useReducer(cartReducer, initialState);

    return (
        <CartContext.Provider value={{ state, dispatch }}>
            {children}
        </CartContext.Provider>
    );
}

export function useCart() {
    return useContext(CartContext);
}