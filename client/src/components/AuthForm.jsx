import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../services/api';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setUserData } from '../redux/Slice/userSlice';
import toast from 'react-hot-toast';
import { signInWithPopup } from 'firebase/auth';
import { auth, provider } from '../services/firebase';


function AuthForm() {

    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLogins, setIsLogins] = useState(false);

    const navigate = useNavigate();
    const dispatch = useDispatch();


    const toggleMode = () => setIsLogins(!isLogins);

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            if (!isLogins) {
                const response = await api.post("/auth/register", {
                    name,
                    email,
                    password
                })
                dispatch(setUserData(response.data.user));
                toast.success("Registration Successful")
                navigate("/")
            } else {
                const response = await api.post("/auth/login", {
                    email,
                    password
                })
                dispatch(setUserData(response.data.user));
                toast.success("Login Successful")
                navigate("/")
            }
        } catch (error) {
            console.log(error);
            toast.error(error.response.data.message)
        }
    }

    const handleGoogleAuth = async () => {
        try {
            const result = await signInWithPopup(auth, provider);
            console.log(result);
            const response = await api.post("/auth/google-auth", {
                name: result.user.displayName,
                email: result.user.email
            })
            dispatch(setUserData(response.data.user));
            navigate("/")
        } catch (error) {
            console.log(error);
            toast.error(error.response.data.message)
        }
    }

    return (
        <motion.div
            className="w-full max-w-md p-8 space-y-6 bg-white/70 backdrop-blur-xl rounded-2xl shadow-lg"
        >
            <motion.div layout="position" className="text-center">
                <h2 className="text-3xl font-extrabold text-slate-900">
                    {isLogins ? 'Welcome Back' : 'Create an Account'}
                </h2>
                <p className="mt-2 text-slate-600">
                    {isLogins ? 'Sign in to continue your journey' : 'Get started with your next adventure'}
                </p>
            </motion.div>

            <form className="space-y-6">
                <motion.div layout="position">
                    <motion.button
                        type="button"
                        onClick={(event) => {
                            event.stopPropagation();
                            handleGoogleAuth();
                        }}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="w-full flex items-center justify-center gap-3 py-3 px-4 border border-slate-200 rounded-lg shadow-sm text-sm font-semibold text-slate-700 bg-white hover:bg-slate-50 transition-colors cursor-pointer"
                    >
                        <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google" className="w-5 h-5" />
                        Continue with Google
                    </motion.button>

                    <div className="relative my-6">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-slate-200"></div>
                        </div>
                        <div className="relative flex justify-center text-sm">
                            <span className="px-2 bg-white/70 text-slate-500">Or use email</span>
                        </div>
                    </div>
                </motion.div>

                <AnimatePresence mode="popLayout" initial={false}>
                    {!isLogins && (
                        <motion.div
                            key="name"
                            initial={{ opacity: 0, height: 0, y: -20 }}
                            animate={{ opacity: 1, height: 'auto', y: 0, transition: { duration: 0.3, ease: 'easeOut' } }}
                            exit={{ opacity: 0, height: 0, y: -20, transition: { duration: 0.2, ease: 'easeIn' } }}
                        >
                            <label htmlFor="name" className="block text-sm font-medium text-slate-700">
                                Name
                            </label>
                            <div className="mt-1">
                                <input
                                    value={name}
                                    onChange={(event) => setName(event.target.value)}
                                    type="text"
                                    required className="w-full px-4 py-3 border border-slate-200 rounded-lg 
                                      shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500
                                     focus:border-indigo-500"
                                />
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                <motion.div layout="position">
                    <label className="block text-sm font-medium text-slate-700">
                        Email address
                    </label>
                    <div className="mt-1">
                        <input
                            value={email}
                            onChange={(event) => setEmail(event.target.value)}
                            type="email"
                            required
                            className="w-full px-4 py-3 border border-slate-200 rounded-lg shadow-sm focus:outline-none 
                             focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                        />

                    </div>
                </motion.div>

                <motion.div layout="position">
                    <label className="block text-sm font-medium text-slate-700">
                        Password
                    </label>
                    <div className="mt-1">
                        <input
                            value={password}
                            onChange={(event) => setPassword(event.target.value)}
                            type="password"
                            required
                            className="w-full px-4 py-3 border border-slate-200 rounded-lg shadow-sm 
                             focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                        />
                    </div>
                </motion.div>

                <motion.div layout>
                    <motion.button
                        onClick={handleLogin}
                        type="submit"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-lg 
                            text-sm font-bold text-white bg-gradient-to-r from-indigo-600 to-violet-600 
                            focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 hover:shadow-2xl cursor-pointer"
                    >
                        {isLogins ? 'Sign In' : 'Create Account'}
                    </motion.button>
                </motion.div>
            </form>

            <motion.div layout="position" className="text-center">
                <p className="text-sm text-slate-600">
                    {isLogins ? "Don't have an account?" : 'Already have an account?'}
                    <button onClick={toggleMode} className="font-semibold text-indigo-600 hover:text-indigo-500 ml-1 focus:outline-none bg-transparent border-none cursor-pointer">
                        {isLogins ? 'Sign Up' : 'Sign In'}
                    </button>
                </p>
            </motion.div>
        </motion.div>
    );
}

export default AuthForm
