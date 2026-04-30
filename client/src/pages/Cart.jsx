import { useCart } from "../context/CartContext";
import { Link } from "react-router-dom";
import { Trash2, Minus, Plus, ArrowRight, ShoppingBag } from "lucide-react";
import { motion } from "framer-motion";

function Cart() {
    const { state, dispatch } = useCart();

    const total = state.items.reduce(
        (acc, item) => acc + item.price * item.quantity,
        0
    );

    if (state.items.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center h-[60vh] text-center">
                <div className="bg-red-50 p-6 rounded-full mb-6 text-red-500">
                    <ShoppingBag size={48} />
                </div>
                <h2 className="text-2xl font-bold text-slate-800 mb-2">Your cart is empty</h2>
                <p className="text-slate-500 mb-8 max-w-sm">Looks like you haven't added anything to your cart yet.</p>
                <Link to="/" className="bg-slate-900 text-white px-6 py-3 rounded-xl font-medium hover:bg-slate-800 transition">
                    Browse Menu
                </Link>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto pb-12">
            <h1 className="text-3xl font-extrabold text-slate-900 mb-8">Your Cart</h1>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-4">
                    {state.items.map((item, i) => (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.05 }}
                            key={item.id}
                            className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100 flex sm:flex-row flex-col sm:items-center gap-4 hover-glass transition"
                        >
                            <img src={item.image} alt={item.name} className="w-20 h-20 object-cover rounded-xl bg-slate-100" />

                            <div className="flex-1">
                                <h3 className="font-bold text-lg text-slate-800">{item.name}</h3>
                                <p className="text-red-500 font-semibold mt-1">₹{item.price}</p>
                            </div>

                            <div className="flex items-center gap-4 mt-4 sm:mt-0 justify-between sm:justify-end w-full sm:w-auto">
                                <div className="flex items-center bg-slate-100 rounded-lg p-1">
                                    <button
                                        onClick={() => dispatch({ type: "UPDATE_QUANTITY", payload: { id: item.id, quantity: item.quantity - 1 } })}
                                        className="p-1 hover:bg-white rounded-md text-slate-600 transition"
                                    >
                                        <Minus size={16} />
                                    </button>
                                    <span className="w-8 text-center font-medium">{item.quantity}</span>
                                    <button
                                        onClick={() => dispatch({ type: "UPDATE_QUANTITY", payload: { id: item.id, quantity: item.quantity + 1 } })}
                                        className="p-1 hover:bg-white rounded-md text-slate-600 transition"
                                    >
                                        <Plus size={16} />
                                    </button>
                                </div>

                                <button
                                    onClick={() => dispatch({ type: "REMOVE_FROM_CART", payload: item.id })}
                                    className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition"
                                    title="Remove item"
                                >
                                    <Trash2 size={20} />
                                </button>
                            </div>
                        </motion.div>
                    ))}
                </div>

                <div className="lg:col-span-1">
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 sticky top-24">
                        <h2 className="text-xl font-bold text-slate-900 mb-6">Order Summary</h2>

                        <div className="space-y-4 mb-6">
                            <div className="flex justify-between text-slate-600">
                                <span>Subtotal</span>
                                <span>₹{total}</span>
                            </div>
                            <div className="flex justify-between text-slate-600">
                                <span>Taxes & Fees</span>
                                <span>₹{Math.floor(total * 0.05)}</span>
                            </div>
                            <div className="pt-4 border-t border-slate-100 flex justify-between items-center">
                                <span className="font-bold text-lg text-slate-900">Total</span>
                                <span className="font-extrabold text-2xl text-red-500">₹{total + Math.floor(total * 0.05)}</span>
                            </div>
                        </div>

                        <Link
                            to="/checkout"
                            className="w-full bg-slate-900 text-white py-3.5 rounded-xl font-medium flex items-center justify-center gap-2 hover:bg-slate-800 active:scale-95 transition"
                        >
                            Proceed to Checkout
                            <ArrowRight size={18} />
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Cart;