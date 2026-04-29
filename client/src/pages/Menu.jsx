import { useEffect, useState } from "react";
import { api } from "../api/axios";

function Menu() {
    const [menu, setMenu] = useState([]);

    useEffect(() => {
        api.get("/menu").then((res) => {
            setMenu(res.data);
        });
    }, []);

    return (
        <div>
            <h1>Menu</h1>
            {menu.map((item) => (
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