import React from 'react';
import { useNavigate } from 'react-router-dom';
const Logout = () => {
    const navigate = useNavigate();
    const handleLogout = () => {
        // const confirmLogout = window.confirm('Are you sure you want to log out?');
        const confirmLogout = window.confirm('Bạn có chắc chắn muốn đăng xuất không?');
        console.log(confirmLogout); 
        if (confirmLogout) {
            localStorage.removeItem('token');
            localStorage.removeItem('avatarUrl');
            // alert('Logged out successfully');
            alert('Đăng xuất thành công');
            navigate('/login');
        }
    };

    return <button onClick={handleLogout} className='logout-btn'>Đăng xuất</button>;
};

export default Logout;
