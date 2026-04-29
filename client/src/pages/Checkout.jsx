import { useCart } from "../context/CartContext";
import { useForm } from "react-hook-form";
import { api } from "../api/axios";

function Checkout() {
    const { state } = useCart();
    const { register, handleSubmit } = useForm();

    const onSubmit = async (data) => {
        const payload = {
            items: state.items,
            customer: data
        };

        const res = await api.post("/orders", payload);
        console.log("Order placed:", res.data);
    };

    return (
        <div>
            <h1>Checkout</h1>

            <form onSubmit={handleSubmit(onSubmit)}>
                <input {...register("name")} placeholder="Name" required />
                <input {...register("address")} placeholder="Address" required />
                <input {...register("phone")} placeholder="Phone" required />

                <button type="submit">Place Order</button>
            </form>
        </div>
    );
}

export default Checkout;