import React from 'react'
import Navbar from '../components/Navbar'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'

function Home() {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-slate-50 flex flex-col font-sans relative overflow-hidden">
            {/* Ambient Background Blobs */}
            <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full
             bg-indigo-400/20 blur-[120px] pointer-events-none" />
            <div className="absolute bottom-[-10%] right-[-5%] w-[30%] h-[30%] rounded-full
             bg-violet-400/20 blur-[100px] pointer-events-none" />

            <Navbar />

            <main className="flex-grow flex flex-col items-center justify-center px-6 text-center z-10">
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="max-w-4xl mx-auto space-y-8 mt-4"
                >
                    <motion.div
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ duration: 0.5, ease: "easeOut", delay: 0 }}
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-full 
                            border border-indigo-100 bg-white/60 text-sm font-semibold tracking-wide text-indigo-700 
                            mb-6 shadow-sm backdrop-blur-sm"
                    >
                        <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full
                             bg-indigo-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
                        </span>
                        AI-Powered Travel Planning
                    </motion.div>

                    <motion.h1
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ duration: 0.5, ease: "easeOut", delay: 0.2 }}
                        className="text-5xl md:text-7xl font-extrabold text-slate-900 tracking-tight 
                        leading-tight"
                    >
                        Your Ultimate Journey, <br className="hidden md:block" /> Crafted in Seconds.
                    </motion.h1>

                    <motion.p
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ duration: 0.5, ease: "easeOut", delay: 0.4 }}
                        className="text-lg md:text-xl text-slate-600 max-w-2xl mx-auto"
                    >
                        Upload your booking PDFs and let our AI automatically generate a perfectly
                        structured, personalized travel itinerary just for you.
                    </motion.p>

                    <motion.div
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ duration: 0.5, ease: "easeOut", delay: 0.6 }}
                        className="pt-8 flex flex-col sm:flex-row items-center justify-center gap-4"
                    >
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => navigate('/dashboard')}
                            className="px-8 py-4 bg-gradient-to-r from-indigo-600 to-violet-600
                             text-white text-lg font-bold rounded-full 
                            shadow-lg shadow-indigo-500/30 hover:shadow-indigo-500/40 transition-all w-full sm:w-auto cursor-pointer"
                        >
                            Start Planning Free
                        </motion.button>
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => navigate('/dashboard')}
                            className="px-8 py-4 bg-white text-slate-700 border border-slate-200 
                            text-lg 
                            font-bold rounded-full shadow-sm hover:shadow-md hover:border-slate-300
                             hover:bg-slate-50
                            transition-all w-full sm:w-auto cursor-pointer"
                        >
                            How it Works
                        </motion.button>
                    </motion.div>
                </motion.div>
            </main>
        </div>
    )
}

export default Home
