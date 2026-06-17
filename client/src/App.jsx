import React from 'react'
import { Route, Routes } from 'react-router-dom'
import Home from './pages/Home'
import AuthPage from './pages/AuthPage'
import getCurrentUser from './hook/getCurrentUser';
import { Toaster } from 'react-hot-toast';
import Dashboard from './pages/Dashboard';
import { useSelector } from 'react-redux';

function App() {
  getCurrentUser();

  const { userData } = useSelector((state) => state.user)
  return (
    <div>
      <Toaster />
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/login' element={<AuthPage />} />
        <Route path="/dashboard/*" element={userData ? <Dashboard /> : <AuthPage />} />
      </Routes>

    </div>
  )
}

export default App
