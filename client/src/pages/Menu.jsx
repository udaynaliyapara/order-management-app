import { useQuery } from "@tanstack/react-query";
import { api } from "../api/axios";
import { useCart } from "../context/CartContext";

function Menu() {
    const { data, isLoading, isError } = useQuery({
        queryKey: ["menu"],
        queryFn: () => api.get("/menu").then(res => res.data),
    });

    if (isLoading) return <h2>Loading...</h2>;
    if (isError) return <h2>Something went wrong</h2>;

    const { dispatch } = useCart();
    const { state } = useCart();

    console.log(state.items);

    return (
        <div style={{ border: "1px solid #ccc", padding: "10px", margin: "10px" }}>
            <h1>Menu</h1>
            {data.map((item) => (
                <div key={item.id}>
                    <img src={item.image} width="100" />
                    <h3>{item.name}</h3>
                    <p>{item.description}</p>
                    <p>₹{item.price}</p>
                    <button onClick={() => dispatch({ type: "ADD_TO_CART", payload: item })}>
                        Add to Cart
                    </button>
                </div>
            ))}
        </div>
    );
}

export default Menu;