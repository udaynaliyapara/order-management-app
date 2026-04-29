import { useQuery } from "@tanstack/react-query";
import { api } from "../api/axios";

function Menu() {
    const { data, isLoading, isError } = useQuery({
        queryKey: ["menu"],
        queryFn: () => api.get("/menu").then(res => res.data),
    });

    if (isLoading) return <h2>Loading...</h2>;
    if (isError) return <h2>Something went wrong</h2>;

    return (
        <div style={{ border: "1px solid #ccc", padding: "10px", margin: "10px" }}>
            <h1>Menu</h1>
            {data.map((item) => (
                <div key={item.id}>
                    <img src={item.image} width="100" />
                    <h3>{item.name}</h3>
                    <p>{item.description}</p>
                    <p>₹{item.price}</p>
                </div>
            ))}
        </div>
    );
}

export default Menu;