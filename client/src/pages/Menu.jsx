import { useQuery } from "@tanstack/react-query";
import { api } from "../api/axios";
import { useCart } from "../context/CartContext";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import { Plus } from "lucide-react";

function Menu() {
    const { data, isLoading, isError } = useQuery({
        queryKey: ["menu"],
        queryFn: () => api.get("/menu").then(res => res.data),
    });

    const { dispatch } = useCart();

    const handleAddToCart = (item) => {
        dispatch({ type: "ADD_TO_CART", payload: item });
        toast.success(`Added ${item.name} to cart!`, {
            icon: '🍔',
            style: {
                borderRadius: '10px',
                background: '#333',
                color: '#fff',
            },
        });
    };

    if (isLoading) return (
        <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-500"></div>
        </div>
    );

    if (isError) return (
        <div className="text-center text-red-500 h-64 flex items-center justify-center font-semibold">
            Failed to load menu. Please try again later.
        </div>
    );

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
    };

    const itemVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: { y: 0, opacity: 1 }
    };

    return (
        <div className="pb-12">
            <div className="mb-10 text-center md:text-left">
                <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 mb-2">Our Menu</h1>
                <p className="text-slate-500">Discover our delicious offerings handcrafted with care.</p>
            </div>

            <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8"
            >
                {data.map((item) => (
                    <motion.div
                        variants={itemVariants}
                        key={item.id}
                        whileHover={{ y: -5 }}
                        className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden hover-glass transition-all duration-300"
                    >
                        <div className="relative h-48 overflow-hidden bg-slate-100">
                            <img
                                src={item.image}
                                alt={item.name}
                                className="w-full h-full object-cover"
                            />
                        </div>

                        <div className="p-5">
                            <div className="flex justify-between items-start mb-2">
                                <h3 className="text-xl font-bold text-slate-800">{item.name}</h3>
                                <span className="font-bold text-lg text-red-500 bg-red-50 px-2 flex items-center py-1 rounded-md">₹{item.price}</span>
                            </div>
                            <p className="text-sm text-slate-500 mb-6 line-clamp-2 min-h-10">{item.description}</p>

                            <button
                                onClick={() => handleAddToCart(item)}
                                className="w-full flex items-center justify-center gap-2 bg-slate-900 text-white font-medium px-4 py-2.5 rounded-xl hover:bg-slate-800 active:scale-95 transition-all"
                            >
                                <Plus size={18} />
                                Add to Order
                            </button>
                        </div>
                    </motion.div>
                ))}
            </motion.div>
        </div>
    );
}

export default Menu;