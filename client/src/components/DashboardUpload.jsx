import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';;
import toast from 'react-hot-toast';
import api from '../services/api';
import { useNavigate } from 'react-router-dom';

function DashboardUpload() {
    const [file, setFile] = useState(null);
    const [loading, setLoading] = useState(false);
    const inputRef = useRef(null);

    const navigate = useNavigate();

    const handleChange = function (e) {
        e.preventDefault();
        if (e.target.files && e.target.files[0]) {
            handleFile(e.target.files[0]);
        }
    };

    const onButtonClick = () => {
        inputRef.current.click();
    };

    const handleFile = (selectedFile) => {
        if (selectedFile.type === 'application/pdf') {
            setFile(selectedFile);
        } else {
            alert('Please upload a valid PDF document.');
        }
    };

    const removeFile = () => {
        setFile(null);
        // Reset input value so the same file can be selected again if needed
        if (inputRef.current) inputRef.current.value = "";
    };

    const handleUpload = async () => {
        try {
            setLoading(true);
            const formData = new FormData();
            formData.append('file', file);
            const response = await api.post("/ai/ai-response", formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            toast.success(response.data.message);
            setFile(null);
            if (inputRef.current) inputRef.current.value = "";
            navigate(`/dashboard/${response.data.data._id}`)
        } catch (error) {
            console.log(error);
            toast.error(error.response.data.message);
        } finally {
            setLoading(false);
        }
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="max-w-4xl mx-auto w-full"
        >
            <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-xl border border-white p-8 
            sm:p-12 overflow-hidden relative">
                {/* Background decorative elements */}
                <div className="absolute top-[-10%] right-[-5%] w-64 h-64 rounded-full bg-indigo-400/10 
                blur-[80px] pointer-events-none" />

                <div className="relative z-10 mb-10 text-center">
                    <h1 className="text-4xl font-extrabold text-slate-900 mb-4 tracking-tight">
                        Upload Document
                    </h1>
                    <p className="text-lg text-slate-600 max-w-2xl mx-auto">
                        Upload your travel booking PDFs (flights, hotels, etc.)
                        here to automatically extract details and generate your personalized itinerary.
                    </p>
                </div>

                <form className="relative z-10" onSubmit={(e) => e.preventDefault()}>
                    <input
                        ref={inputRef}
                        type="file"
                        className="hidden"
                        accept=".pdf,application/pdf"
                        onChange={handleChange}
                    />

                    <AnimatePresence mode="wait">
                        {!file ? (
                            <motion.div
                                key="upload-zone"
                                initial={{ opacity: 0, scale: 0.98 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.98 }}
                                className="flex flex-col items-center justify-center w-full min-h-[320px] border-2 border-dashed rounded-3xl transition-all duration-300 cursor-pointer border-slate-300 bg-slate-50/50 hover:bg-indigo-50/30 hover:border-indigo-300"
                                onClick={onButtonClick}
                            >
                                <div className="flex flex-col items-center justify-center p-8 text-center pointer-events-none">
                                    <div className="p-6 rounded-full mb-6 transition-colors duration-300 bg-white shadow-sm border border-slate-100">
                                        <svg className="w-12 h-12 transition-colors duration-300 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 13h6m-3-3v6m5 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                        </svg>
                                    </div>
                                    <h3 className="text-xl font-semibold text-slate-800 mb-2">
                                        Click to upload your PDF
                                    </h3>
                                    <p className="text-slate-500 mb-6 max-w-sm">
                                        We'll extract your travel details securely.
                                    </p>
                                    {/* <span className="inline-flex items-center px-6 py-2.5 bg-white border border-slate-200 rounded-full text-sm font-bold text-slate-700 shadow-sm pointer-events-auto hover:bg-slate-50 transition-colors">
                                        Browse Files
                                    </span> */}
                                </div>
                            </motion.div>
                        ) : (
                            <motion.div
                                key="file-preview"
                                initial={{ opacity: 0, scale: 0.98, y: 10 }}
                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.98, y: -10 }}
                                className="bg-white border border-slate-200 rounded-3xl p-8 shadow-xl shadow-slate-200/40 relative overflow-hidden"
                            >
                                
                                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500"></div>

                                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 mb-8">
                                    <div className="flex items-center space-x-5 w-full overflow-hidden">
                                        <div className="p-4 bg-indigo-50 rounded-2xl text-indigo-600 flex-shrink-0 shadow-inner">
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-10 h-10">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
                                            </svg>
                                        </div>
                                        <div className="min-w-0 flex-1">
                                            <p className="text-lg font-bold text-slate-900 truncate mb-1" title={file.name}>{file.name}</p>
                                            <div className="flex items-center text-sm text-slate-500">
                                                <span className="font-medium bg-slate-100 px-2 py-0.5 rounded-md">PDF Document</span>
                                                <span className="mx-2">•</span>
                                                <span>{(file.size / 1024 / 1024).toFixed(2)} MB</span>
                                            </div>
                                        </div>
                                    </div>

                                    <button
                                        type="button"
                                        onClick={removeFile}
                                        className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors focus:outline-none flex-shrink-0"
                                        title="Remove file"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                        </svg>
                                    </button>
                                </div>

                                <div className="flex flex-col sm:flex-row items-center gap-4 pt-6 border-t border-slate-100">
                                    <button
                                        type="button"
                                        onClick={removeFile}
                                        className="w-full sm:w-auto px-6 py-3 text-sm font-semibold text-slate-700 bg-white border border-slate-300 hover:bg-slate-50 rounded-xl transition-colors focus:outline-none focus:ring-2 focus:ring-slate-200"
                                    >
                                        Choose Another
                                    </button>
                                    <button
                                        type="button"
                                        onClick={handleUpload}
                                        disabled={loading}
                                        className={`w-full sm:w-auto flex-1 flex items-center justify-center gap-2 px-8 py-3 bg-gradient-to-r from-indigo-600 to-violet-600 text-white text-base font-bold rounded-xl shadow-lg shadow-indigo-500/30 transition-all focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 ${loading ? 'opacity-70 cursor-not-allowed' : 'hover:shadow-indigo-500/50 hover:-translate-y-0.5'}`}
                                    >
                                        {loading ? (
                                            <>
                                                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                                <span>Processing...</span>
                                            </>
                                        ) : (
                                            <>
                                                <span>Generate Itinerary</span>
                                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12h15m0 0l-6.75-6.75M19.5 12l-6.75 6.75" />
                                                </svg>
                                            </>
                                        )}
                                    </button>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </form>
            </div>
        </motion.div>
    );
}

export default DashboardUpload;