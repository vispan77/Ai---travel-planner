import React, { useState } from 'react'
import { useNavigate, Routes, Route, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useDispatch } from 'react-redux';
import toast from 'react-hot-toast';
import api from '../services/api';
import { setUserData } from '../redux/Slice/userSlice';
import DashboardHome from '../components/DashboardHome';
import DashboardUpload from '../components/DashboardUpload';
import DashboardHistory from '../components/DashboardHistory';
import Iteneray from '../components/Iteneray';

function Dashboard() {
    const navigate = useNavigate();
    const location = useLocation();
    const dispatch = useDispatch();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const sidebarItems = [
        { name: "Home", path: "/dashboard" }, 
        { name: "Upload", path: "/dashboard/upload" },   
    ];

    const handleLogout = async () => {
        try {
            const response = await api.get("/auth/logout");
            dispatch(setUserData(null));
            toast.success(response.data.message);
            navigate("/");
        } catch (error) {
            console.log(error);
            toast.error(error.response?.data?.message || "Failed to logout")
        }
    }

    return (
        <div className="min-h-screen bg-slate-50 flex flex-col md:flex-row font-sans relative">
            
            <div className="md:hidden flex items-center justify-between bg-white/80 backdrop-blur-xl p-4 border-b border-gray-200 sticky top-0 z-50">
                <div className="text-xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-violet-600 tracking-wide">
                    AI Travel
                </div>
                <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="p-2 text-slate-600 focus:outline-none">
                    {isMobileMenuOpen ? (
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                    ) : (
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" /></svg>
                    )}
                </button>
            </div>

            
            <motion.div
                initial={{ x: -100, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
                className={`w-64 bg-white/80 backdrop-blur-xl border-r border-gray-100 shadow-md 
                p-6 flex flex-col justify-start items-center fixed md:sticky top-0 h-screen z-40 transition-transform duration-300 ease-in-out
                ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}`}
            >
                
                <div
                    className="hidden md:block text-2xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r
                    from-indigo-600 to-violet-600 tracking-wide mb-8"
                >
                    AI Travel
                </div>

                
                <nav className="flex flex-col w-full space-y-4 flex-grow mt-8 md:mt-0">
                    {sidebarItems.map((item, index) => (
                        <motion.button
                            key={item.name}
                            initial={{ x: -20, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            transition={{ delay: 0.1 * index, duration: 0.3 }}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => {
                                navigate(item.path);
                                setIsMobileMenuOpen(false); // Close mobile menu when navigating
                            }}
                            className={`w-full text-left px-4 py-3 rounded-lg focus:outline-none focus:ring-2
                 focus:ring-indigo-500 focus:ring-opacity-50 font-semibold transition-all duration-200 
                 ${location.pathname === item.path
                                    ? "bg-indigo-50 text-indigo-600"
                                    : "text-slate-700 hover:bg-indigo-50/50 hover:text-indigo-600"
                                }`}
                        >
                            {item.name}
                        </motion.button>
                    ))}
                </nav>

                
                <div className="w-full mt-auto pt-8 border-t border-slate-200">
                    <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={handleLogout}
                        className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-lg text-red-600 hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50 font-semibold transition-all duration-200"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12.75" />
                        </svg>
                        Logout
                    </motion.button>
                </div>
            </motion.div>

           
            {isMobileMenuOpen && (
                <div
                    className="fixed inset-0 bg-slate-900/50 z-30 md:hidden backdrop-blur-sm"
                    onClick={() => setIsMobileMenuOpen(false)}
                />
            )}

            {/* Main Content Area */}
            <div className="flex-grow p-4 md:p-8 w-full md:w-auto overflow-y-auto">
                <Routes>
                    <Route path="/" element={<DashboardHome />} />
                    <Route path="upload" element={<DashboardUpload />} />
                    <Route path="history" element={<DashboardHistory />} />
                    <Route path="/:id" element={<Iteneray />} />
                </Routes>
            </div>
        </div>
    )
}

export default Dashboard
