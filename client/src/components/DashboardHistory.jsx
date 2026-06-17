import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import api from "../services/api";
import toast from 'react-hot-toast';

function DashboardHistory() {
    const navigate = useNavigate();
    const [itineraries, setItineraries] = useState([]);


    const handleGetAllItinery = async () => {
        try {
            const response = await api.get("/ai/get-all");
            setItineraries(response.data.data);
        } catch (error) {
            console.log(error);
            toast.error(error.response.data.message);
        }
    }

    const handleDelete = async (id) => {
        try {
            const response = await api.delete(`/ai/delete/${id}`);
            toast.success(response.data.message);
            setItineraries(prev => prev.filter(item => item._id !== id));
        } catch (error) {
            console.log(error);
            toast.error(error.response.data.message);
        }
    }

    useEffect(() => {
        handleGetAllItinery();
    }, [])

    // Container variants for staggered animations
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: { staggerChildren: 0.1 }
        }
    };

    const itemVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: { y: 0, opacity: 1, transition: { duration: 0.4 } }
    };

    return (
        <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="max-w-6xl mx-auto w-full space-y-8"
        >
            {/* Header Section */}
            <motion.div variants={itemVariants} className="flex flex-col md:flex-row 
            md:items-center justify-between gap-4"
            >
                <div>
                    <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 
                    tracking-tight">
                        Travel History
                    </h1>
                    <p className="text-slate-600 mt-2 text-lg">
                        View and manage your past generated travel itineraries.
                    </p>
                </div>
            </motion.div>

            {/* Grid Layout for History Cards */}
            {itineraries.length > 0 ? (
                <motion.div variants={itemVariants} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {itineraries.map((trip) => (
                        <motion.div
                            key={trip._id}
                            onClick={() => navigate(`/dashboard/${trip._id}`)}
                            whileHover={{ y: -4, boxShadow: "0px 15px 30px rgba(0,0,0,0.08)" }}
                            className="bg-white/80 backdrop-blur-xl border border-slate-200 rounded-3xl p-6 shadow-lg shadow-slate-200/40 transition-all flex flex-col justify-between group cursor-pointer"
                        >
                            {(() => {
                                const destination = trip.flights?.[0]?.['Arrival City'] || trip.hotels?.[0]?.['Hotel Name'] || trip.trains?.[0]?.['Destination Station'] || 'Trip Details';
                                const startDate = trip.flights?.[0]?.['Departure Date'] || trip.hotels?.[0]?.['Check-In Date'] || trip.trains?.[0]?.['Boarding Date'];
                                const endDate = trip.hotels?.[trip.hotels.length - 1]?.['Check-Out Date'] || trip.flights?.[trip.flights.length - 1]?.['Arrival Date'] || trip.trains?.[trip.trains.length - 1]?.['Arrival Date'];
                                const passengerCount = trip.passengers?.length || 0;
                                const hasFlight = trip.flights?.length > 0;
                                const hasTrain = trip.trains?.length > 0;
                                const hasHotel = trip.hotels?.length > 0;

                                const isCompleted = endDate ? new Date(endDate) < new Date() : false;
                                const statusLabel = isCompleted ? 'Completed' : 'Upcoming';
                                const statusColor = isCompleted 
                                    ? 'bg-slate-100 text-slate-600' 
                                    : 'bg-emerald-100 text-emerald-700';

                                return (
                                    <>
                                        <div>
                                            <div className="flex items-center justify-between mb-4">
                                                <div className="w-14 h-14 bg-indigo-50 rounded-2xl flex items-center justify-center text-3xl group-hover:scale-110 transition-transform duration-300">
                                                    {hasFlight ? '✈️' : hasTrain ? '🚆' : hasHotel ? '🏨' : '🌍'}
                                                </div>
                                                <span className={`px-3 py-1 text-xs font-bold rounded-full ${statusColor}`}>
                                                    {statusLabel}
                                                </span>
                                            </div>
                                            <h3 className="text-xl font-bold text-slate-900 mb-1">{destination}</h3>
                                            <p className="text-sm font-medium text-slate-500 flex items-center gap-1.5 mb-6">
                                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
                                                </svg>
                                                {startDate && endDate ? `${startDate} - ${endDate}` : (startDate || 'Date not available')}
                                            </p>
                                            <div className="flex items-center gap-2 mb-4">
                                                <span className="text-xs font-bold bg-indigo-50 text-indigo-600 px-2 py-1 rounded-md flex items-center gap-1">
                                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-3 h-3"><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" /></svg>
                                                    {passengerCount} {passengerCount === 1 ? 'Passenger' : 'Passengers'}
                                                </span>
                                            </div>
                                        </div>
                                        <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                                            <span className="text-sm font-semibold text-indigo-600 group-hover:text-indigo-700 transition-colors">
                                                View Itinerary &rarr;
                                            </span>
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleDelete(trip._id);
                                                }}
                                                className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-full transition-all"
                                                title="Delete Itinerary"
                                            >
                                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                                                </svg>
                                            </button>
                                        </div>
                                    </>
                                );
                            })()}
                        </motion.div>
                    ))}
                </motion.div>
            ) : (
                <motion.div variants={itemVariants} className="text-center py-20 bg-white/50 backdrop-blur-md rounded-3xl border border-dashed border-slate-300">
                    <h3 className="text-xl font-bold text-slate-700 mb-2">No past trips found</h3>
                    <p className="text-slate-500 mb-6">It looks like you haven't generated any itineraries yet.</p>
                    <button onClick={() => navigate('/dashboard/upload')} className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-full shadow-md transition-colors">Create Your First Itinerary</button>
                </motion.div>
            )}
        </motion.div>
    );
}

export default DashboardHistory;