import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import api from "../services/api";
import toast from 'react-hot-toast';

function DashboardHome() {
    const { userData } = useSelector((state) => state.user);
    const navigate = useNavigate();

    const [itineraries, setItineraries] = useState([]);


    const handleGetAllItinery = async () => {
        try {
            const response = await api.get("/ai/get-all");
            setItineraries(response.data.data);
        } catch (error) {
            console.log(error);
            toast.error(error.response?.data?.message || "Failed to fetch itineraries");
        }
    }

    useEffect(() => {
        handleGetAllItinery();
    }, [])

    
    const stats = [
        { id: 1, label: "Total Itineraries", value: itineraries.length.toString(), icon: "🗺️", color: "from-blue-500 to-cyan-500" },
        { id: 2, label: "Upcoming Trips", value: itineraries.length.toString(), icon: "✈️", color: "from-indigo-500 to-purple-500" },
        { id: 3, label: "Documents Parsed", value: itineraries.length.toString(), icon: "📄", color: "from-emerald-500 to-teal-500" }
    ];

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1, transition: { staggerChildren: 0.1 } }}
            className="max-w-6xl mx-auto w-full space-y-8"
        >
            
            <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1, transition: { duration: 0.4 } }} className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight">
                        Welcome back, {userData?.name?.split(' ')[0] || 'Explorer'}! 👋
                    </h1>
                    <p className="text-slate-600 mt-2 text-lg">
                        Ready for your next adventure? Let AI craft your perfect itinerary.
                    </p>
                </div>
                <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => navigate('/dashboard/upload')}
                    className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-violet-600 text-white font-bold rounded-xl shadow-lg shadow-indigo-500/30 transition-all flex items-center gap-2"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                    </svg>
                    New Itinerary
                </motion.button>
            </motion.div>

            
            <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1, transition: { duration: 0.4 } }} className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {stats.map((stat) => (
                    <div key={stat.id} className="bg-white/80 backdrop-blur-xl border border-slate-100 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-slate-500 mb-1">{stat.label}</p>
                                <h3 className="text-3xl font-bold text-slate-900">{stat.value}</h3>
                            </div>
                            <div className={`w-14 h-14 rounded-full flex items-center justify-center text-2xl bg-gradient-to-br ${stat.color} text-white shadow-inner`}>
                                {stat.icon}
                            </div>
                        </div>
                    </div>
                ))}
            </motion.div>

            
            <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1, transition: { duration: 0.4 } }} className="bg-white/80 backdrop-blur-xl border border-slate-100 rounded-3xl p-8 shadow-lg shadow-slate-200/40">
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold text-slate-800">Your Recent Itineraries</h2>
                    <button
                        onClick={() => navigate('/dashboard/history')}
                        className="text-sm font-semibold text-indigo-600 hover:text-indigo-700 transition-colors"
                    >
                        View All &rarr;
                    </button>
                </div>

                {itineraries.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {itineraries.slice(0, 3).map((trip) => {
                            const destination = trip.flights?.[0]?.['Arrival City'] || trip.hotels?.[0]?.['Hotel Name'] || trip.trains?.[0]?.['Destination Station'] || 'Trip Details';
                            const startDate = trip.flights?.[0]?.['Departure Date'] || trip.hotels?.[0]?.['Check-In Date'] || trip.trains?.[0]?.['Boarding Date'];
                            const hasFlight = trip.flights?.length > 0;
                            const hasTrain = trip.trains?.length > 0;
                            const hasHotel = trip.hotels?.length > 0;

                            return (
                                <motion.div
                                    key={trip._id}
                                    onClick={() => navigate(`/dashboard/${trip._id}`)}
                                    whileHover={{ y: -4, boxShadow: "0px 15px 30px rgba(0,0,0,0.08)" }}
                                    className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm transition-all cursor-pointer group"
                                >
                                    <div className="flex items-center gap-4 mb-4">
                                        <div className="w-12 h-12 bg-indigo-50 rounded-xl flex items-center justify-center text-2xl group-hover:scale-110 transition-transform">
                                            {hasFlight ? '✈️' : hasTrain ? '🚆' : hasHotel ? '🏨' : '🌍'}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <h3 className="font-bold text-slate-900 truncate">{destination}</h3>
                                            <p className="text-xs text-slate-500">{startDate || 'Date TBD'}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center justify-between pt-4 border-t border-slate-50">
                                        <span className="text-xs font-bold text-indigo-600">View Details</span>
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-4 h-4 text-indigo-600">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                                        </svg>
                                    </div>
                                </motion.div>
                            );
                        })}
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center py-12 text-center border-2 border-dashed border-slate-200 rounded-2xl bg-slate-50/50">
                        <div className="w-20 h-20 mb-4 bg-indigo-50 rounded-full flex items-center justify-center text-indigo-300">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-10 h-10">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
                            </svg>
                        </div>
                        <h3 className="text-lg font-bold text-slate-700 mb-2">No itineraries yet</h3>
                        <p className="text-slate-500 max-w-md mx-auto mb-6">
                            You haven't generated any travel itineraries yet. Upload your first booking document to get started!
                        </p>
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => navigate('/dashboard/upload')}
                            className="px-6 py-2.5 bg-white border border-slate-200 text-slate-700 font-semibold rounded-full shadow-sm hover:bg-slate-50 transition-colors"
                        >
                            Upload Document
                        </motion.button>
                    </div>
                )}
            </motion.div>
        </motion.div>
    );
}

export default DashboardHome;