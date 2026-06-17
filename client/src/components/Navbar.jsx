import React, { useRef, useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useSelector } from 'react-redux';
import api from '../services/api';
import toast from 'react-hot-toast';
import { setUserData } from '../redux/Slice/userSlice';
import { useDispatch } from 'react-redux';

function Navbar() {

    const [openProfile, setOpenProfile] = useState(false);
    const profileRef = useRef(null);
    const { userData } = useSelector(state => state.user);
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const handleLogout = async () => {
        try {
            const response = await api.get("/auth/logout");
            dispatch(setUserData(null));
            toast.success(response.data.message);
            navigate("/");
        } catch (error) {
            console.log(error);
            toast.error(error.response.data.message)
        }
    }

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (profileRef.current && !profileRef.current.contains(event.target)) {
                setOpenProfile(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    return (
        <motion.nav
            initial={{ y: -100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="flex items-center justify-between px-8 py-4 bg-white/70 backdrop-blur-xl 
            border-b border-gray-100 shadow-sm 
            w-full z-50 sticky top-0"
        >

            <motion.div
                className="flex items-center cursor-pointer"
                onClick={() => navigate('/')}
            >
                <span className="text-2xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-violet-600 tracking-wide">
                    AI Travel
                </span>
            </motion.div>


            <div className="flex items-center space-x-4">
                {
                    userData ? (
                        <div 
                            ref={profileRef}
                            className="relative w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center 
                        cursor-pointer" onClick={() => setOpenProfile(!openProfile)}
                        >
                            <h1 className="text-white text-xl font-semibold p-5">
                                {userData.name.charAt(0).toUpperCase()}
                            </h1>

                            {
                                openProfile && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className="absolute top-12 right-0 w-48 bg-white rounded-xl 
                                        shadow-xl border border-slate-100 p-2 z-50"
                                    >
                                        <div className="px-4 py-2 border-b border-slate-50 mb-1">
                                            <p className="text-sm font-bold text-slate-900 truncate">
                                                {userData.name}
                                            </p>
                                            <p className="text-xs text-slate-500 truncate">
                                                {userData.email}
                                            </p>
                                        </div>
                                        <button
                                            onClick={handleLogout}
                                            className="w-full text-left px-4 py-2 text-sm text-red-600
                                         hover:bg-red-50 rounded-lg transition-colors 
                                         font-medium cursor-pointer">
                                            Logout
                                        </button>
                                    </motion.div>
                                )
                            }
                        </div>
                    ) : (
                        <motion.button
                            whileHover={{ scale: 1.05, boxShadow: "0px 4px 15px rgba(79, 70, 229, 0.3)" }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => navigate('/login')}
                            className="px-5 py-2 text-sm font-semibold text-white bg-gradient-to-r
                            from-indigo-600 to-violet-600 rounded-full shadow-md transition-all
                             cursor-pointer"
                        >
                            Get Started
                        </motion.button>
                    )
                }

            </div>
        </motion.nav >
    )
}

export default Navbar
