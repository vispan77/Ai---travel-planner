import React, { useEffect } from 'react'
import api from '../services/api';
import { useDispatch } from 'react-redux';
import { setUserData } from '../redux/Slice/userSlice';


function getCurrentUser() {
    const dispatch = useDispatch();


    const handleGetCurrentUser = async () => {
        try {
            const result = await api.get("/auth/getme");
            dispatch(setUserData(result.data.user))
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        handleGetCurrentUser()
    }, [])
}

export default getCurrentUser
