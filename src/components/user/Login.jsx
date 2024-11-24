import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import './Login.css'
import PersonIcon from '@mui/icons-material/Person';
import LockIcon from '@mui/icons-material/Lock';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import { jwtDecode } from 'jwt-decode';


const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();

    const handleLogin = async (e) => {
        e.preventDefault();
        if (!username || !password) {
            alert('Please fill in all fields.');
            return;
        }
        try {
            const response = await axios.post('http://localhost:8000/api/users/login', { username, password });
            const token = response.data.token;
            localStorage.setItem('token', token);

            // Giải mã token để lấy userId và username
            const decodedToken = jwtDecode(token);
            const userId = decodedToken.id;
            const userRole = decodedToken.role;
            const userEmail = decodedToken.email;
            const userUsername = decodedToken.username;

            localStorage.setItem('userId', userId);
            localStorage.setItem('role', userRole);
            localStorage.setItem('email', userEmail);
            localStorage.setItem('username', userUsername);

            const userResponse = await axios.get('http://localhost:8000/api/users/get-user', {
                headers: {
                    'Authorization': `Bearer ${token}`, // Gửi token trong header
                },
            });

            const avatarUrl = userResponse.data.avatarUrl; // Lấy avatar từ API
            localStorage.setItem('avatarUrl', avatarUrl);

            // Nếu có redirect path (trường hợp người dùng đang ở một trang yêu cầu đăng nhập)
            const searchParams = new URLSearchParams(location.search);
            const redirectTo = searchParams.get('redirectTo') ?? '/';  // Giá trị của 'redirectTo'
            alert("Logged in successfully! Welcome to the WWPigeon website!");

            // const storedDocumentId = localStorage.getItem('documentId');
            // if (storedDocumentId) {
            //     // Nếu có documentId trong localStorage, điều hướng đến trang điền form
            //     navigate(`/fill-form/${storedDocumentId}`);
            // } else {
            //     // Nếu không có documentId, điều hướng về redirect path hoặc trang mặc định
            //     navigate(redirectTo);
            // }
            navigate(redirectTo);
           
        } catch (err) {
            // alert("Login failed!")
            if (err.response && err.response.status === 401) {
                setMessage('An error occurred during login. Please try again later.');
            } else {
                alert('Your account and/or password is incorrect, please try again.');
            }

        }
    };

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    return (
        <div className="form-container">
            <div className="header_1">
                <div className="text">Login</div>
                <div className="underline"></div>
            </div>
            <div className="form">
                <form onSubmit={handleLogin}>
                    <div className="form-group">
                        <PersonIcon className="user-icon" />
                        <input
                            type="text"
                            placeholder="Username/Email"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            autoComplete="username"
                        />
                    </div>
                    <div className="form-group">
                        <LockIcon className="user-icon" />
                        <input
                            type={showPassword ? 'text' : 'password'}
                            placeholder="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            autoComplete="current-password"
                        />
                        <button type="button" onClick={togglePasswordVisibility} className="eye-icon">
                            {showPassword ? <VisibilityIcon /> : <VisibilityOffIcon />}
                        </button>
                    </div>
                    <div className="forgot-pass">Forgot Password?</div>
                    <div className="submit-container">
                        <button type="submit" className="submit_1">Login</button>
                    </div>
                    <div className="text-center">
                        <p>Don't have an account? <Link to="/signup">Signup</Link></p>
                    </div>
                </form>
            </div>
            {message && <p>{message}</p>}
        </div>
    );
};


export default Login;
