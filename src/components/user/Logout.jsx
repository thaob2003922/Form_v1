import React from 'react';
import { useNavigate } from 'react-router-dom';
const Logout = () => {
    const navigate = useNavigate();
    const handleLogout = () => {
        const confirmLogout = window.confirm('Are you sure you want to log out?');

        if (confirmLogout) {
            localStorage.removeItem('token');
            alert('Logged out successfully');
            navigate('/login');
        }
    };

    return <button onClick={handleLogout} className='logout-btn'>Logout</button>;
};

export default Logout;