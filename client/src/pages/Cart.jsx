import { useCart } from "../context/CartContext";

function Cart() {
    const { state, dispatch } = useCart();

    const total = state.items.reduce(
        (acc, item) => acc + item.price * item.quantity,
        0
    );

    if (state.items.length === 0) {
        return <h2>Your cart is empty</h2>;
    }

    return (
        <div>
            <h1>Cart</h1>

            {state.items.map((item) => (
                <div key={item.id} style={{ border: "1px solid #ccc", margin: 10, padding: 10 }}>
                    <h3>{item.name}</h3>
                    <p>₹{item.price}</p>

                    <div>
                        <button
                            onClick={() =>
                                dispatch({
                                    type: "UPDATE_QUANTITY",
                                    payload: { id: item.id, quantity: item.quantity - 1 }
                                })
                            }
                        >
                            -
                        </button>

                        <span style={{ margin: "0 10px" }}>{item.quantity}</span>

                        <button
                            onClick={() =>
                                dispatch({
                                    type: "UPDATE_QUANTITY",
                                    payload: { id: item.id, quantity: item.quantity + 1 }
                                })
                            }
                        >
                            +
                        </button>
                    </div>

                    <button
                        onClick={() =>
                            dispatch({ type: "REMOVE_FROM_CART", payload: item.id })
                        }
                    >
                        Remove
                    </button>
                </div>
            ))}

            <h2>Total: ₹{total}</h2>
        </div>
    );
}

export default Cart;