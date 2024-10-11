import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import PersonIcon from '@mui/icons-material/Person';
import LockIcon from '@mui/icons-material/Lock';
import EmailIcon from '@mui/icons-material/Email';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
const Signup = () => {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState(''); 
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const navigate = useNavigate();
    const handleRegister = async (e) => {
        e.preventDefault();
        if (!validatePassword(password)) {
            setMessage("Password must have at least 8 characters, including letters and special characters.");
            return; 
        }
        try {
            await axios.post('http://localhost:8000/api/users/signup', {
                username,
                email,
                password, 
            });
            setMessage('Registration successful! You can now log in.');
            alert('Registration successful! You can now log in');
            navigate('/login');
        } catch (err) {
            setMessage('Registration failed! Please try again.');
        }
    };
    
    const validatePassword = (password) => {
        const minLength = 8;
        const hasLetter = /[a-zA-Z]/.test(password);
        const hasNumber = /\d/.test(password); 
        const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
        
        return password.length >= minLength && hasLetter && hasNumber && hasSpecialChar;
    };
    
    const handlePasswordChange = (e) => {
        const newPassword = e.target.value;
        setPassword(newPassword);
    };
    
    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };
    return (
        <>
        <div className='form-container'>
            <div className='header_1'>
                <div className='text'>SignUp</div>
                <div className='underline'></div>
            </div>
            <div className='form'>
                <form onSubmit={handleRegister}>
                    <div className='form-group'>
                    <PersonIcon className='user-icon'/>
                        <input
                            type="text"
                            placeholder="Username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                            autoComplete="username"
                        />
                    </div>
                    <div className='form-group'>
                    <EmailIcon className='user-icon'/>
                        <input
                            type="email"
                            placeholder="Email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            autoComplete="email"
                        />
                    </div>
                    <div className='form-group'>
                    <LockIcon className='user-icon'/>
                        <input
                            type={showPassword ? 'text' : 'password'}
                            placeholder="Password"
                            value={password}
                            // onChange={(e) => setPassword(e.target.value)}
                            onChange={handlePasswordChange}
                            required
                            autoComplete="current-password"
                        /> 
                        <button type="button" onClick={togglePasswordVisibility} className='eye-icon'>
                            {showPassword ? <VisibilityIcon /> : <VisibilityOffIcon />} 
                        </button>
                    </div>
                    <div className='submit-container'>
                        <button type="submit" className='submit_1'>SignUp</button>
                    </div>
                    <div className='text-center'>
                        <p>Have an account ? <Link to="/login">Login</Link></p>
                    </div>
                </form>
            </div>
            {message && <p>{message}</p>}
        </div>
        </>
    );
};

export default Signup;
