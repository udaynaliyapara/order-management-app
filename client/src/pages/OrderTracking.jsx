import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { api } from "../api/axios";
import { useParams, Link } from "react-router-dom";
import { io } from "socket.io-client";
import { CheckCircle2, Package, Truck, Clock } from "lucide-react";
import { motion } from "framer-motion";

const SOCKET_URL = import.meta.env.VITE_API_URL || "http://localhost:5000"; // Ensure this matches backend

const statuses = [
    { key: "Order Received", label: "Received", icon: Clock },
    { key: "Preparing", label: "Preparing", icon: Package },
    { key: "Out for Delivery", label: "Out for Delivery", icon: Truck },
    { key: "Delivered", label: "Delivered", icon: CheckCircle2 }
];

function OrderTracking() {
    const { id } = useParams();
    const [currentStatus, setCurrentStatus] = useState(null);

    const { data: orderData, isLoading } = useQuery({
        queryKey: ["order", id],
        queryFn: () => api.get(`/orders/${id}`).then(res => res.data),
    });

    useEffect(() => {
        if (orderData && !currentStatus) {
            // eslint-disable-next-line
            setCurrentStatus(orderData.status);
        }
    }, [orderData, currentStatus]);

    useEffect(() => {
        const socket = io(SOCKET_URL);

        socket.on("status_update", (updatedOrder) => {
            if (updatedOrder.id === id) {
                setCurrentStatus(updatedOrder.status);
            }
        });

        return () => socket.disconnect();
    }, [id]);

    if (isLoading || !currentStatus) return (
        <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-500"></div>
        </div>
    );

    const currentIndex = statuses.findIndex(s => s.key === currentStatus);

    return (
        <div className="max-w-3xl mx-auto pb-12">
            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-8 text-center text-slate-800">
                <div className="mb-8">
                    <span className="bg-slate-100 text-slate-600 px-3 py-1 rounded-full text-sm font-semibold tracking-wider uppercase mb-4 inline-block">
                        Order #{id}
                    </span>
                    <h1 className="text-3xl font-extrabold text-slate-900 mb-2">Track Your Order</h1>
                    <p className="text-slate-500">Your food is on its way!</p>
                </div>

                <div className="flex flex-col md:flex-row items-center justify-between relative max-w-xl mx-auto mb-12">
                    {/* Progress Bar background */}
                    <div className="hidden md:block absolute top-1/2 left-0 w-full h-1 bg-slate-100 -z-10 -translate-y-1/2"></div>

                    {/* Progress Fill */}
                    <div
                        className="hidden md:block absolute top-1/2 left-0 h-1 bg-red-500 -z-10 -translate-y-1/2 transition-all duration-1000 ease-in-out"
                        style={{ width: `${(currentIndex / (statuses.length - 1)) * 100}%` }}
                    ></div>

                    {/* Steps */}
                    {statuses.map((status, index) => {
                        const Icon = status.icon;
                        const isCompleted = index <= currentIndex;
                        const isCurrent = index === currentIndex;

                        return (
                            <div key={status.key} className="flex md:flex-col items-center gap-4 md:gap-3 w-full md:w-auto relative mb-6 md:mb-0">
                                <motion.div
                                    initial={false}
                                    animate={{
                                        scale: isCurrent ? 1.2 : 1,
                                        backgroundColor: isCompleted ? '#ef4444' : '#f1f5f9',
                                        color: isCompleted ? '#ffffff' : '#94a3b8'
                                    }}
                                    className={`w-12 h-12 rounded-full flex items-center justify-center font-bold z-10 
                                    ${isCompleted ? 'ring-4 ring-white shadow-md' : 'border-2 border-white'}`}
                                >
                                    <Icon size={20} />
                                </motion.div>
                                <div className={`text-sm md:text-xs font-bold uppercase tracking-wider text-left md:text-center ${isCompleted ? 'text-slate-800' : 'text-slate-400'}`}>
                                    {status.label}
                                </div>
                            </div>
                        );
                    })}
                </div>

                <div className="pt-8 border-t border-slate-100">
                    <Link to="/" className="text-red-500 font-semibold hover:underline">
                        Order more food
                    </Link>
                </div>
            </div>
        </div>
    );
}

export default OrderTracking;