import React from 'react';
import { useLocation } from 'react-router-dom';
import Navbar from '../components/Navbar';
import AuthForm from '../components/AuthForm';
import { motion } from "motion/react"

function AuthPage() {

    return (
        <div className="min-h-screen bg-slate-50 flex flex-col font-sans relative overflow-hidden">
            
            <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full
             bg-indigo-400/20 blur-[120px] pointer-events-none" />
            <div className="absolute bottom-[-10%] right-[-5%] w-[30%] h-[30%] rounded-full
             bg-violet-400/20 blur-[100px] pointer-events-none" />

            <Navbar />

            <motion.main
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="flex-grow flex items-center justify-center p-6 z-10"
            >
                <AuthForm />
            </motion.main>
        </div>
    );
}

export default AuthPage
