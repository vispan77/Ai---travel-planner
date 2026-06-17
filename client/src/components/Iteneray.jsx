import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../services/api';
import toast from 'react-hot-toast';

export default function Itinerary() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [itineraryData, setItineraryData] = useState(null);

    const handleGetItineraryById = async () => {
        try {
            const response = await api.get(`/ai/get-by-id/${id}`);
            setItineraryData(response.data.data)
        } catch (error) {
            console.log(error);
            toast.error("Something went wrong");
        }
    }

    useEffect(() => {
        handleGetItineraryById();
    }, [id]);

    const handleShare = async () => {
        const shareData = {
            title: `My Trip to ${destination}`,
            text: `Check out my travel itinerary for ${destination}!`,
            url: window.location.href,
        };
        try {
            await navigator.share(shareData);
        } catch (err) {
            navigator.clipboard.writeText(window.location.href);
            toast.success("Link copied to clipboard!");
        }
    };

    if (!itineraryData) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <div className="flex flex-col items-center gap-4">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-indigo-600"></div>
                    <p className="text-slate-500 font-medium animate-pulse">Loading your itinerary...</p>
                </div>
            </div>
        );
    }

    const itinerary = itineraryData;

    
    const destination = itinerary.flights?.[0]?.['Arrival City'] || itinerary.hotels?.[0]?.['Hotel Name'] || itinerary.trains?.[0]?.['Destination Station'] || 'Your Trip';
    const startDate = itinerary.flights?.[0]?.['Departure Date'] || itinerary.hotels?.[0]?.['Check-In Date'] || itinerary.trains?.[0]?.['Boarding Date'];
    const endDate = itinerary.hotels?.[itinerary.hotels.length - 1]?.['Check-Out Date'] || itinerary.flights?.[itinerary.flights.length - 1]?.['Arrival Date'] || itinerary.trains?.[itinerary.trains.length - 1]?.['Arrival Date'];

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
    };

    const itemVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: { y: 0, opacity: 1, transition: { duration: 0.5, ease: "easeOut" } }
    };

    return (
        <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="max-w-5xl mx-auto w-full space-y-8 pb-12"
        >
            {/* Header Section */}
            <motion.div variants={itemVariants} className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                    <button 
                        onClick={() => navigate(-1)}
                        className="p-2 bg-white border border-slate-200 rounded-full hover:bg-slate-50 hover:shadow-md transition-all focus:outline-none"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-5 h-5 text-slate-600">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
                        </svg>
                    </button>
                    <div>
                        <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight">
                            {destination}
                        </h1>
                        <p className="text-slate-500 font-medium mt-1 flex items-center gap-2">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4 text-indigo-500">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
                            </svg>
                            {startDate && endDate ? `${startDate} - ${endDate}` : (startDate || 'Date TBD')}
                        </p>
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    <button
                        onClick={handleShare}
                        className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 text-slate-700 text-sm font-bold rounded-full shadow-sm hover:bg-slate-50 transition-all"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M7.217 10.907a2.25 2.25 0 100 2.186m0-2.186c.18.324.283.696.283 1.093s-.103.77-.283 1.093m0-2.186l9.566-5.314m-9.566 7.5l9.566 5.314m0 0a2.25 2.25 0 103.935 2.186 2.25 2.25 0 00-3.935-2.186zm0-12.814a2.25 2.25 0 103.933-2.185 2.25 2.25 0 00-3.933 2.185z" />
                        </svg>
                        Share
                    </button>
                    <span className="px-4 py-2 bg-emerald-100 text-emerald-700 text-sm font-bold rounded-full shadow-sm">
                        {itinerary.tripSummary?.status || "Ready"}
                    </span>
                </div>
            </motion.div>

            
            <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                {itinerary.flights?.map((flight, idx) => (
                    <div key={idx} className="bg-white/80 backdrop-blur-xl border border-slate-200 rounded-3xl p-6 shadow-lg shadow-slate-200/40 relative overflow-hidden group hover:-translate-y-1 transition-transform duration-300">
                        <div className="absolute -top-4 -right-4 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24" className="w-32 h-32 text-blue-600"><path d="M20.56 3.91c.59.59.59 1.54 0 2.12l-9.9 9.9-4.24 1.41 1.41-4.24 9.9-9.9c.59-.59 1.54-.59 2.12 0h.71zM3 21c-.55 0-1-.45-1-1v-8c0-.55.45-1 1-1h8c.55 0 1 .45 1 1v8c0 .55-.45 1-1 1H3z"/></svg>
                        </div>
                        <div className="flex items-center gap-3 mb-4 relative z-10">
                            <div className="p-3 bg-blue-50 text-blue-600 rounded-xl shadow-inner">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" /></svg>
                            </div>
                            <h2 className="text-xl font-bold text-slate-800">Flight</h2>
                        </div>
                        <div className="space-y-4 relative z-10">
                            <div>
                                <p className="text-slate-400 uppercase text-[11px] font-bold tracking-wider">Airline & Flight</p>
                                <p className="text-slate-900 font-bold text-lg">{flight["Airline Name"]} <span className="text-slate-400 font-medium text-sm">• {flight["Flight Number"]}</span></p>
                                <div className="flex flex-wrap gap-2 mt-2">
                                    {flight.PNR && flight.PNR !== "Not Available" && <span className="text-xs bg-slate-100 text-slate-600 px-2 py-1 rounded font-medium shadow-sm">PNR: {flight.PNR}</span>}
                                    {flight["Travel Class"] && flight["Travel Class"] !== "Not Available" && <span className="text-xs bg-slate-100 text-slate-600 px-2 py-1 rounded font-medium shadow-sm">Class: {flight["Travel Class"]}</span>}
                                </div>
                            </div>
                            <div className="flex justify-between items-center bg-slate-50 p-4 rounded-2xl border border-slate-100">
                                <div>
                                    <p className="text-slate-400 uppercase text-[10px] font-bold">Departure</p>
                                    <p className="font-bold text-slate-800">{flight["Departure City"]}</p>
                                    <p className="text-sm font-medium text-slate-500">{flight["Departure Time"]}</p>
                                </div>
                                <div className="text-slate-300">
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M17.25 8.25L21 12m0 0l-3.75 3.75M21 12H3" /></svg>
                                </div>
                                <div className="text-right">
                                    <p className="text-slate-400 uppercase text-[10px] font-bold">Arrival</p>
                                    <p className="font-bold text-slate-800">{flight["Arrival City"]}</p>
                                    <p className="text-sm font-medium text-slate-500">{flight["Arrival Time"]}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}

                
                {itinerary.trains?.map((train, idx) => (
                    <div key={idx} className="bg-white/80 backdrop-blur-xl border border-slate-200 rounded-3xl p-6 shadow-lg shadow-slate-200/40 relative overflow-hidden group hover:-translate-y-1 transition-transform duration-300">
                        <div className="absolute -top-4 -right-4 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24" className="w-32 h-32 text-emerald-600"><path d="M12 2C8 2 4 2.5 4 6v9.5C4 16.88 5.12 18 6.5 18h.5v2h2v-2h6v2h2v-2h.5c1.38 0 2.5-1.12 2.5-2.5V6c0-3.5-4-4-8-4zm0 2c3.5 0 6 .5 6 2v4H6V6c0-1.5 2.5-2 6-2zm-3.5 11c-.83 0-1.5-.67-1.5-1.5S7.67 12 8.5 12s1.5.67 1.5 1.5S9.33 15 8.5 15zm7 0c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5z"/></svg>
                        </div>
                        <div className="flex items-center gap-3 mb-4 relative z-10">
                            <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl shadow-inner">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M12 21v-8.25M15.75 21v-8.25M8.25 21v-8.25M3 9l9-6 9 6m-1.5 12V10.332A48.36 48.36 0 0012 9.75c-2.551 0-5.056.2-7.5.582V21M3 21h18M12 6.75h.008v.008H12V6.75z" /></svg>
                            </div>
                            <h2 className="text-xl font-bold text-slate-800">Train</h2>
                        </div>
                        <div className="space-y-4 relative z-10">
                            <div>
                                <p className="text-slate-400 uppercase text-[11px] font-bold tracking-wider">Train Name & Number</p>
                                <p className="text-slate-900 font-bold text-lg">{train["Train Name"]} <span className="text-slate-400 font-medium text-sm">• {train["Train Number"]}</span></p>
                                <div className="flex flex-wrap gap-2 mt-2">
                                    {train.PNR && train.PNR !== "Not Available" && <span className="text-xs bg-slate-100 text-slate-600 px-2 py-1 rounded font-medium shadow-sm">PNR: {train.PNR}</span>}
                                    {train.Coach && train.Coach !== "Not Available" && <span className="text-xs bg-slate-100 text-slate-600 px-2 py-1 rounded font-medium shadow-sm">Coach: {train.Coach}</span>}
                                    {train.Seat && train.Seat !== "Not Available" && <span className="text-xs bg-slate-100 text-slate-600 px-2 py-1 rounded font-medium shadow-sm">Seat: {train.Seat}</span>}
                                    {train.Berth && train.Berth !== "Not Available" && <span className="text-xs bg-slate-100 text-slate-600 px-2 py-1 rounded font-medium shadow-sm">Berth: {train.Berth}</span>}
                                </div>
                            </div>
                            <div className="flex justify-between items-center bg-slate-50 p-4 rounded-2xl border border-slate-100">
                                <div>
                                    <p className="text-slate-400 uppercase text-[10px] font-bold">Boarding</p>
                                    <p className="font-bold text-slate-800 max-w-[120px] truncate" title={train["Boarding Station"]}>{train["Boarding Station"]}</p>
                                    <p className="text-sm font-medium text-slate-500">{train["Boarding Time"] || train["Boarding Date"]}</p>
                                </div>
                                <div className="text-slate-300">
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M17.25 8.25L21 12m0 0l-3.75 3.75M21 12H3" /></svg>
                                </div>
                                <div className="text-right">
                                    <p className="text-slate-400 uppercase text-[10px] font-bold">Destination</p>
                                    <p className="font-bold text-slate-800 max-w-[120px] truncate" title={train["Destination Station"]}>{train["Destination Station"]}</p>
                                    <p className="text-sm font-medium text-slate-500">{train["Arrival Time"] || train["Arrival Date"]}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}

                
                {itinerary.hotels?.map((hotel, idx) => (
                    <div key={idx} className="bg-white/80 backdrop-blur-xl border border-slate-200 rounded-3xl p-6 shadow-lg shadow-slate-200/40 relative overflow-hidden group hover:-translate-y-1 transition-transform duration-300">
                        <div className="absolute -top-4 -right-4 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24" className="w-32 h-32 text-violet-600"><path d="M19 21H5a2 2 0 01-2-2V5a2 2 0 012-2h14a2 2 0 012 2v14a2 2 0 01-2 2zM7 10h2v2H7v-2zm4 0h2v2h-2v-2zm4 0h2v2h-2v-2z" /></svg>
                        </div>
                        <div className="flex items-center gap-3 mb-4 relative z-10">
                            <div className="p-3 bg-violet-50 text-violet-600 rounded-xl shadow-inner">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 21h19.5m-18-18v18m10.5-18v18m6-13.5V21M6.75 6.75h.75m-.75 3h.75m-.75 3h.75m3-6h.75m-.75 3h.75m-.75 3h.75M6.75 21v-3.375c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21M3 3h12.25M15 15h.008v.008H15V15zm0 2.25h.008v.008H15v-.008zm0 2.25h.008v.008H15v-.008z" /></svg>
                            </div>
                            <h2 className="text-xl font-bold text-slate-800">Accommodation</h2>
                        </div>
                        <div className="space-y-4 relative z-10">
                            <div>
                                <p className="text-slate-400 uppercase text-[11px] font-bold tracking-wider">Hotel</p>
                                <p className="text-slate-900 font-bold text-lg">{hotel["Hotel Name"]}</p>
                                <p className="text-sm font-medium text-slate-500 flex items-start gap-1 mt-1">
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4 mt-0.5 flex-shrink-0 text-slate-400"><path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" /></svg>
                                    {hotel["Hotel Address"] || "Address not provided"}
                                </p>
                                <div className="flex flex-wrap gap-2 mt-2">
                                    {hotel["Booking Reference"] && hotel["Booking Reference"] !== "Not Available" && <span className="text-xs bg-slate-100 text-slate-600 px-2 py-1 rounded font-medium shadow-sm">Ref: {hotel["Booking Reference"]}</span>}
                                    {hotel["Room Type"] && hotel["Room Type"] !== "Not Available" && <span className="text-xs bg-slate-100 text-slate-600 px-2 py-1 rounded font-medium shadow-sm">Room: {hotel["Room Type"]}</span>}
                                </div>
                            </div>
                            <div className="flex justify-between items-center bg-slate-50 p-4 rounded-2xl border border-slate-100">
                                <div>
                                    <p className="text-slate-400 uppercase text-[10px] font-bold">Check-In</p>
                                    <p className="font-bold text-slate-800">{hotel["Check-In Date"]}</p>
                                    <p className="text-sm font-medium text-slate-500">{hotel["Check-In Time"] || "TBD"}</p>
                                </div>
                                <div className="text-slate-300">
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M17.25 8.25L21 12m0 0l-3.75 3.75M21 12H3" /></svg>
                                </div>
                                <div className="text-right">
                                    <p className="text-slate-400 uppercase text-[10px] font-bold">Check-Out</p>
                                    <p className="font-bold text-slate-800">{hotel["Check-Out Date"]}</p>
                                    <p className="text-sm font-medium text-slate-500">{hotel["Check-Out Time"] || "TBD"}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}

                
                {itinerary.transportation?.map((transport, idx) => (
                    <div key={idx} className="bg-white/80 backdrop-blur-xl border border-slate-200 rounded-3xl p-6 shadow-lg shadow-slate-200/40 relative overflow-hidden group hover:-translate-y-1 transition-transform duration-300">
                        <div className="absolute -top-4 -right-4 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24" className="w-32 h-32 text-orange-600"><path d="M18.92 6.01C18.72 5.42 18.16 5 17.5 5h-11c-.66 0-1.21.42-1.42 1.01L3 12v8c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1h12v1c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-8l-2.08-5.99zM6.85 7h10.29l1.08 3.11H5.77L6.85 7zM19 17H5v-5h14v5zM7.5 16c.83 0 1.5-.67 1.5-1.5S8.33 13 7.5 13 6 13.67 6 14.5 6.67 16 7.5 16zm9 0c.83 0 1.5-.67 1.5-1.5s-.67-1.5-1.5-1.5-1.5.67-1.5 1.5.67 1.5 1.5 1.5z"/></svg>
                        </div>
                        <div className="flex items-center gap-3 mb-4 relative z-10">
                            <div className="p-3 bg-orange-50 text-orange-600 rounded-xl shadow-inner">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 00-3.213-9.193 2.056 2.056 0 00-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 00-10.026 0 1.106 1.106 0 00-.987 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h-12" /></svg>
                            </div>
                            <h2 className="text-xl font-bold text-slate-800">Transportation</h2>
                        </div>
                        <div className="space-y-4 relative z-10">
                            <div>
                                <p className="text-slate-400 uppercase text-[11px] font-bold tracking-wider">Service Provider & Type</p>
                                <p className="text-slate-900 font-bold text-lg">{transport["Service Provider"] || "Transport"} <span className="text-slate-400 font-medium text-sm">• {transport["Vehicle Type"] || "Vehicle"}</span></p>
                                <div className="flex flex-wrap gap-2 mt-2">
                                    {transport["Booking Reference"] && transport["Booking Reference"] !== "Not Available" && <span className="text-xs bg-slate-100 text-slate-600 px-2 py-1 rounded font-medium shadow-sm">Ref: {transport["Booking Reference"]}</span>}
                                </div>
                            </div>
                            <div className="flex justify-between items-center bg-slate-50 p-4 rounded-2xl border border-slate-100">
                                <div>
                                    <p className="text-slate-400 uppercase text-[10px] font-bold">Pick-up</p>
                                    <p className="font-bold text-slate-800 max-w-[120px] truncate" title={transport["Pick-up Location"]}>{transport["Pick-up Location"] || "TBD"}</p>
                                    <p className="text-sm font-medium text-slate-500">{transport["Pick-up Time"] || transport["Pick-up Date"] || "TBD"}</p>
                                </div>
                                <div className="text-slate-300">
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M17.25 8.25L21 12m0 0l-3.75 3.75M21 12H3" /></svg>
                                </div>
                                <div className="text-right">
                                    <p className="text-slate-400 uppercase text-[10px] font-bold">Drop-off</p>
                                    <p className="font-bold text-slate-800 max-w-[120px] truncate" title={transport["Drop-off Location"]}>{transport["Drop-off Location"] || "TBD"}</p>
                                    <p className="text-sm font-medium text-slate-500">{transport["Drop-off Time"] || transport["Drop-off Date"] || "TBD"}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}

                
                {itinerary.events?.map((event, idx) => (
                    <div key={idx} className="bg-white/80 backdrop-blur-xl border border-slate-200 rounded-3xl p-6 shadow-lg shadow-slate-200/40 relative overflow-hidden group hover:-translate-y-1 transition-transform duration-300">
                        <div className="absolute -top-4 -right-4 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24" className="w-32 h-32 text-pink-600"><path d="M19 3h-1V1h-2v2H8V1H6v2H5c-1.11 0-1.99.9-1.99 2L3 19c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V8h14v11zM7 10h5v5H7z"/></svg>
                        </div>
                        <div className="flex items-center gap-3 mb-4 relative z-10">
                            <div className="p-3 bg-pink-50 text-pink-600 rounded-xl shadow-inner">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" /></svg>
                            </div>
                            <h2 className="text-xl font-bold text-slate-800">Event</h2>
                        </div>
                        <div className="space-y-4 relative z-10">
                            <div>
                                <p className="text-slate-400 uppercase text-[11px] font-bold tracking-wider">Event Name</p>
                                <p className="text-slate-900 font-bold text-lg">{event["Event Name"] || "Scheduled Event"}</p>
                                <p className="text-sm font-medium text-slate-500 flex items-start gap-1 mt-1">
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4 mt-0.5 flex-shrink-0 text-slate-400"><path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" /></svg>
                                    {event["Location"] || "Location TBD"}
                                </p>
                                <div className="flex flex-wrap gap-2 mt-2">
                                    {event["Booking Reference"] && event["Booking Reference"] !== "Not Available" && <span className="text-xs bg-slate-100 text-slate-600 px-2 py-1 rounded font-medium shadow-sm">Ref: {event["Booking Reference"]}</span>}
                                </div>
                            </div>
                            <div className="flex items-center gap-2 bg-slate-50 p-4 rounded-2xl border border-slate-100">
                                <div className="flex-1">
                                    <p className="text-slate-400 uppercase text-[10px] font-bold">Schedule</p>
                                    <p className="font-bold text-slate-800">{event["Start Date"] || event.Date}</p>
                                    <p className="text-sm font-medium text-slate-500">{event["Start Time"] || event.Time || "TBD"} {event["End Time"] && event["End Time"] !== "Not Available" && `- ${event["End Time"]}`}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </motion.div>

            
            {itinerary.passengers?.length > 0 && (
                <motion.div variants={itemVariants} className="bg-white/80 backdrop-blur-xl border border-slate-200 rounded-3xl p-8 shadow-lg shadow-slate-200/40">
                    <h2 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-3">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6 text-indigo-600"><path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0311.952-3.141M12 15.75a3 3 0 11-6 0 3 3 0 016 0zm3 0h.008v.008H15v-.008z" /></svg>
                        Passengers
                    </h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                        {itinerary.passengers.map((passenger, idx) => (
                            <div key={idx} className="bg-slate-50 rounded-2xl p-4 border border-slate-100 hover:border-indigo-100 hover:shadow-md transition-all group flex items-start gap-4">
                                <div className="w-10 h-10 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center font-bold text-lg flex-shrink-0 group-hover:scale-110 transition-transform">
                                    {passenger["First Name"]?.[0] || passenger["Full Name"]?.[0] || "?"}
                                </div>
                                <div className="min-w-0">
                                    <p className="font-bold text-slate-900 truncate" title={passenger["Full Name"]}>{passenger["Full Name"]}</p>
                                    <div className="flex flex-wrap gap-2 mt-1.5">
                                        {passenger["Passenger Type"] && passenger["Passenger Type"] !== "Not Available" && passenger["Passenger Type"].trim() !== "" && (
                                            <span className="text-[10px] font-bold uppercase tracking-wider bg-slate-200 px-2 py-0.5 rounded-full border border-slate-300 text-slate-600 shadow-sm">{passenger["Passenger Type"]}</span>
                                        )}
                                        {passenger.Gender && passenger.Gender !== "Not Available" && passenger.Gender.trim() !== "" && (
                                            <span className="text-[10px] font-bold uppercase tracking-wider bg-white px-2 py-0.5 rounded-full border border-slate-200 text-slate-500 shadow-sm">{passenger.Gender}</span>
                                        )}
                                        {passenger.Age && passenger.Age !== "Not Available" && passenger.Age.trim() !== "" && (
                                            <span className="text-[10px] font-bold uppercase tracking-wider bg-white px-2 py-0.5 rounded-full border border-slate-200 text-slate-500 shadow-sm">Age: {passenger.Age}</span>
                                        )}
                                        {passenger["Seat Number"] && passenger["Seat Number"] !== "Not Available" && passenger["Seat Number"].trim() !== "" && (
                                            <span className="text-[10px] font-bold uppercase tracking-wider bg-indigo-50 px-2 py-0.5 rounded-full border border-indigo-100 text-indigo-600 shadow-sm">Seat: {passenger["Seat Number"]}</span>
                                        )}
                                        {passenger["Meal Preference"] && passenger["Meal Preference"] !== "Not Available" && passenger["Meal Preference"].trim() !== "" && (
                                            <span className="text-[10px] font-bold uppercase tracking-wider bg-orange-50 px-2 py-0.5 rounded-full border border-orange-100 text-orange-600 shadow-sm">Meal: {passenger["Meal Preference"]}</span>
                                        )}
                                        {passenger["Frequent Flyer Number"] && passenger["Frequent Flyer Number"] !== "Not Available" && passenger["Frequent Flyer Number"].trim() !== "" && (
                                            <span className="text-[10px] font-bold uppercase tracking-wider bg-teal-50 px-2 py-0.5 rounded-full border border-teal-100 text-teal-600 shadow-sm">FFN: {passenger["Frequent Flyer Number"]}</span>
                                        )}
                                        {passenger["Passport Number"] && passenger["Passport Number"] !== "Not Available" && passenger["Passport Number"].trim() !== "" && (
                                            <span className="text-[10px] font-bold uppercase tracking-wider bg-rose-50 px-2 py-0.5 rounded-full border border-rose-100 text-rose-600 shadow-sm">Passport: {passenger["Passport Number"]}</span>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </motion.div>
            )}

            
            {itinerary.dailyItinerary?.length > 0 && (
                <motion.div variants={itemVariants} className="bg-white/80 backdrop-blur-xl border border-slate-200 rounded-3xl p-6 md:p-10 shadow-lg shadow-slate-200/40">
                    <h2 className="text-2xl font-bold text-slate-900 mb-8 flex items-center gap-3">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6 text-indigo-600"><path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" /></svg>
                        Daily Schedule
                    </h2>
                    <div className="space-y-12">
                        {itinerary.dailyItinerary.map((day, idx) => (
                            <div key={idx} className="relative">
                                <div className="sticky top-20 z-20 bg-white/90 backdrop-blur-sm py-3 mb-6 border-b border-slate-100">
                                    <h3 className="text-xl font-extrabold text-indigo-600 flex items-center gap-2">
                                        <span className="bg-indigo-100 text-indigo-800 px-3 py-1 rounded-lg text-lg">
                                            {day.Day || `Day ${idx + 1}`}
                                        </span>
                                        <span className="text-slate-500 font-medium text-base ml-1">{day.Date || day.date}</span>
                                    </h3>
                                </div>
                                <div className="space-y-8 pl-4 md:pl-2">
                                    {(day.Itinerary || day.activities || []).map((item, iIdx, arr) => (
                                        <div key={iIdx} className="relative flex flex-col md:flex-row gap-4 md:gap-8 group">
                                            {/* Timeline Line & Dot */}
                                            <div className="hidden md:flex flex-col items-center mt-1.5">
                                                <div className="w-3 h-3 rounded-full bg-indigo-400 ring-4 ring-indigo-50 z-10 group-hover:bg-indigo-600 group-hover:ring-indigo-100 transition-colors"></div>
                                                {iIdx !== arr.length - 1 && (
                                                    <div className="w-0.5 h-full bg-slate-200 absolute top-4"></div>
                                                )}
                                            </div>
                                            
                                            <div className="md:w-32 flex-shrink-0 pt-0.5">
                                                <span className="text-sm font-bold text-slate-600 bg-slate-100 border border-slate-200 shadow-sm px-3 py-1.5 rounded-full inline-block">
                                                    {item.Time || item.departureTime || item.arrivalTime || "Anytime"}
                                                </span>
                                            </div>
                                            
                                            <div className="flex-grow bg-slate-50 rounded-2xl p-5 border border-slate-100 group-hover:border-indigo-200 group-hover:shadow-md transition-all group-hover:bg-white">
                                                <p className="text-slate-800 font-semibold leading-relaxed text-lg mb-1">
                                                    {item.Activity || item.type}
                                                </p>
                                                {(item.trainName || item.boardingStation || item.arrivalStation) && (
                                                    <p className="text-slate-600 font-medium mb-2">
                                                        {item.trainName && `${item.trainName} (${item.trainNumber})`}
                                                        {item.boardingStation && ` from ${item.boardingStation}`}
                                                        {item.arrivalStation && ` to ${item.arrivalStation}`}
                                                    </p>
                                                )}
                                                {(item.flightNumber || item.departureCity || item.arrivalCity) && (
                                                    <p className="text-slate-600 font-medium mb-2">
                                                        {item.airlineName && `${item.airlineName} `}({item.flightNumber})
                                                        {item.departureCity && ` from ${item.departureCity}`}
                                                        {item.arrivalCity && ` to ${item.arrivalCity}`}
                                                    </p>
                                                )}
                                                {(item.hotelName || item.location) && (
                                                    <p className="text-slate-600 font-medium mb-2">
                                                        {item.hotelName && `🏨 ${item.hotelName}`}
                                                        {item.hotelName && item.location && ' - '}
                                                        {item.location && `📍 ${item.location}`}
                                                    </p>
                                                )}
                                                {(item.notes || day.Notes) && (
                                                    <div className="text-sm text-slate-500 bg-amber-50/50 p-3 rounded-xl border border-amber-100/50 mt-3 flex gap-2 items-start">
                                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-amber-500 flex-shrink-0"><path strokeLinecap="round" strokeLinejoin="round" d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z" /></svg>
                                                        <span className="italic">{item.notes || day.Notes}</span>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                </motion.div>
            )}

            
            {itinerary.payments?.length > 0 && (
                <motion.div variants={itemVariants} className="bg-white/80 backdrop-blur-xl border border-slate-200 rounded-3xl p-6 md:p-10 shadow-lg shadow-slate-200/40 relative overflow-hidden">
                    <h2 className="text-2xl font-bold mb-8 flex items-center gap-3 relative z-10">
                        <div className="p-2 bg-indigo-50 rounded-xl">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6 text-indigo-600"><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 002.25-2.25V6.75A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25v10.5A2.25 2.25 0 004.5 19.5z" /></svg>
                        </div>
                        Payment Summary
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 relative z-10">
                        {itinerary.payments.map((pay, idx) => (
                            <div key={idx} className="bg-slate-50 rounded-2xl p-6 border border-slate-100 transition-colors">
                                <div className="flex justify-between items-end border-b border-slate-200 pb-4 mb-4">
                                    <span className="text-slate-500 font-medium">Total Amount</span>
                                    <span className="text-3xl font-extrabold text-slate-900 tracking-tight">
                                        {pay.Currency && pay.Currency !== "Not Available" ? pay.Currency : ""} {pay["Total Amount"]}
                                    </span>
                                </div>
                                <div className="space-y-3">
                                    {(pay.Discounts && pay.Discounts !== "Not Available") && (
                                        <div className="flex justify-between text-sm">
                                            <span className="text-slate-500">Discounts</span>
                                            <span className="font-medium text-emerald-600">-{pay.Discounts}</span>
                                        </div>
                                    )}
                                    {(pay["Payment Method"] && pay["Payment Method"] !== "Not Available") && (
                                        <div className="flex justify-between text-sm">
                                            <span className="text-slate-500">Payment Method</span>
                                            <span className="font-medium text-slate-800">{pay["Payment Method"]}</span>
                                        </div>
                                    )}
                                    {(pay.Taxes && pay.Taxes !== "Not Available") && (
                                        <div className="flex justify-between text-sm">
                                            <span className="text-slate-500">Taxes</span>
                                            <span className="font-medium text-slate-800">{pay.Taxes}</span>
                                        </div>
                                    )}
                                    {(pay.Fees && pay.Fees !== "Not Available") && (
                                        <div className="flex justify-between text-sm">
                                            <span className="text-slate-500">Fees</span>
                                            <span className="font-medium text-slate-800">{pay.Fees}</span>
                                        </div>
                                    )}
                                    {(pay["Transaction ID"] && pay["Transaction ID"] !== "Not Available") && (
                                        <div className="flex justify-between text-sm mt-2 pt-2 border-t border-slate-200">
                                            <span className="text-slate-500">Transaction ID</span>
                                            <span className="font-mono text-xs text-slate-600 bg-white border border-slate-200 shadow-sm px-2 py-1 rounded">{pay["Transaction ID"]}</span>
                                        </div>
                                    )}
                                    {(pay["MakeMyTrip ID"] && pay["MakeMyTrip ID"] !== "Not Available") && (
                                        <div className="flex justify-between text-sm">
                                            <span className="text-slate-500">Booking ID</span>
                                            <span className="font-mono text-xs text-slate-600 bg-white border border-slate-200 shadow-sm px-2 py-1 rounded">{pay["MakeMyTrip ID"]}</span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </motion.div>
            )}
        </motion.div>
    );
}
