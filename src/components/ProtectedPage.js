import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Header from './Header';
import Template from "./Template";
import Mainbody from "./Mainbody";

const ProtectedPage = () => {
    const [message, setMessage] = useState('');
    const [isLoggedIn, setIsLoggedIn] = useState(false); 
    const navigate = useNavigate();
    useEffect(() => {
        const fetchProtectedData = async () => {
            const token = localStorage.getItem('token');
            try {
                const response = await axios.get('http://localhost:8000/api/users/protected', {
                    headers: { Authorization: token },
                });
                setMessage(response.data.message);
                setIsLoggedIn(true);
            } catch (err) {
                setMessage('Access denied');
            }
        };
        if(isLoggedIn) {
            fetchProtectedData();
        }
        // fetchProtectedData();
    }, [isLoggedIn]);

    useEffect(() => {
        const token = localStorage.getItem('token'); // Kiểm tra token
        if (!token) {
            navigate('/login'); // Chuyển đến trang đăng nhập nếu không có token
        }
    }, [navigate]); // Chạy hiệu ứng khi component được render

    
    return <><Header /><Template /><Mainbody /></>;
};

export default ProtectedPage;
