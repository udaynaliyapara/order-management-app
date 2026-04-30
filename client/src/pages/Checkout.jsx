import { useState } from "react";
import { useCart } from "../context/CartContext";
import { useForm } from "react-hook-form";
import { api } from "../api/axios";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { ArrowLeft, Loader2, MapPin, Phone, User } from "lucide-react";

function Checkout() {
    const navigate = useNavigate();
    const { state, dispatch } = useCart();
    const { register, handleSubmit, formState: { errors } } = useForm();
    const [loading, setLoading] = useState(false);

    if (state.items.length === 0) {
        return (
            <div className="text-center mt-20">
                <h2 className="text-2xl font-bold mb-4">Cart is empty</h2>
                <button onClick={() => navigate("/")} className="text-red-500 font-medium hover:underline">
                    Go back to Menu
                </button>
            </div>
        );
    }

    const total = state.items.reduce((acc, item) => acc + item.price * item.quantity, 0);

    const onSubmit = async (data) => {
        setLoading(true);
        const payload = {
            items: state.items,
            customer: data
        };

        try {
            const res = await api.post("/orders", payload);
            toast.success("Order placed successfully!");
            dispatch({ type: "CLEAR_CART" });
            navigate(`/track/${res.data.id}`);
        } catch (err) {
            toast.error(err.response?.data?.message || "Failed to place order.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto pb-12 flex flex-col md:flex-row gap-8">
            <div className="flex-1">
                <button onClick={() => navigate("/cart")} className="flex items-center gap-2 text-slate-500 hover:text-slate-800 mb-8 transition">
                    <ArrowLeft size={16} /> Back to Cart
                </button>

                <h1 className="text-3xl font-extrabold text-slate-900 mb-6">Checkout</h1>

                <div className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-slate-100">
                    <h2 className="text-xl font-bold mb-6 text-slate-800">Delivery Details</h2>

                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Full Name</label>
                            <div className="relative">
                                <User className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                                <input
                                    {...register("name", { required: "Name is required", minLength: { value: 2, message: "Name must be at least 2 characters" } })}
                                    placeholder="John Doe"
                                    className={`w-full pl-10 pr-4 py-3 border rounded-xl bg-slate-50 focus:bg-white transition outline-none ${errors.name ? 'border-red-500 focus:ring-2 focus:ring-red-200' : 'border-slate-200 focus:border-red-500 focus:ring-2 focus:ring-red-100'}`}
                                />
                            </div>
                            {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Delivery Address</label>
                            <div className="relative">
                                <MapPin className="absolute left-3 top-3 text-slate-400" size={18} />
                                <textarea
                                    {...register("address", { required: "Address is required", minLength: { value: 10, message: "Address is too short" } })}
                                    placeholder="123 Main St, Apartment 4B"
                                    rows={3}
                                    className={`w-full pl-10 pr-4 py-3 border rounded-xl bg-slate-50 focus:bg-white transition outline-none resize-none ${errors.address ? 'border-red-500 focus:ring-2 focus:ring-red-200' : 'border-slate-200 focus:border-red-500 focus:ring-2 focus:ring-red-100'}`}
                                />
                            </div>
                            {errors.address && <p className="text-red-500 text-sm mt-1">{errors.address.message}</p>}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Phone Number</label>
                            <div className="relative">
                                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                                <input
                                    type="tel"
                                    {...register("phone", {
                                        required: "Phone number is required",
                                        pattern: { value: /^[0-9]{10}$/, message: "Please enter a valid 10-digit phone number" }
                                    })}
                                    placeholder="9876543210"
                                    className={`w-full pl-10 pr-4 py-3 border rounded-xl bg-slate-50 focus:bg-white transition outline-none ${errors.phone ? 'border-red-500 focus:ring-2 focus:ring-red-200' : 'border-slate-200 focus:border-red-500 focus:ring-2 focus:ring-red-100'}`}
                                />
                            </div>
                            {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone.message}</p>}
                        </div>

                        <div className="pt-4 mt-8 border-t border-slate-100">
                            <button
                                disabled={loading}
                                className="w-full bg-slate-900 text-white py-4 rounded-xl font-medium hover:bg-slate-800 active:scale-[0.98] transition flex items-center justify-center gap-2 disabled:bg-slate-300"
                            >
                                {loading ? (
                                    <>
                                        <Loader2 className="animate-spin" size={20} />
                                        Processing...
                                    </>
                                ) : "Place Order • ₹" + (total + Math.floor(total * 0.05))}
                            </button>
                        </div>
                    </form>
                </div>
            </div>

            <div className="md:w-80 hidden md:block">
                <div className="bg-slate-900 text-white rounded-2xl p-6 sticky top-24">
                    <h3 className="font-bold text-lg mb-4">Your Order</h3>
                    <div className="space-y-3 mb-6 max-h-60 overflow-y-auto pr-2">
                        {state.items.map(item => (
                            <div key={item.id} className="flex justify-between text-sm">
                                <span className="text-slate-300"><span className="text-white font-medium">{item.quantity}x</span> {item.name}</span>
                                <span>₹{item.price * item.quantity}</span>
                            </div>
                        ))}
                    </div>
                    <div className="border-t border-slate-700 pt-4 space-y-2 text-sm">
                        <div className="flex justify-between text-slate-300">
                            <span>Subtotal</span>
                            <span>₹{total}</span>
                        </div>
                        <div className="flex justify-between text-slate-300">
                            <span>Taxes & Fees</span>
                            <span>₹{Math.floor(total * 0.05)}</span>
                        </div>
                        <div className="flex justify-between font-bold text-lg text-white pt-2 border-t border-slate-700 mt-2">
                            <span>Total</span>
                            <span>₹{total + Math.floor(total * 0.05)}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Checkout;