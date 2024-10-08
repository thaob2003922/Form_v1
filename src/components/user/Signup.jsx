// import React, { useState } from 'react';
// import axios from 'axios';
// import { useNavigate, Link } from 'react-router-dom';
// function Signup(){
//     const history = useNavigate()
//     const [email, setEmail] = useState('')
//     const [password, setPassword] = useState('')
//     // const [username, setUserName] = useState('')
//     async function submit(e){
//         e.preventDefault();
//         try{
//             await axios.post("http://localhost:8000/signup",{
//                 email, password
//             })
//             .then(res=>{
//                 if(res.data==="exist"){
//                     alert("User already exists")
//                 }
//                 else if(res.data==="noteexist"){
//                     history("/Home")
//                 }
//             })
//             .catch(e =>{
//                 alert("wrong details")
//                 console.log(e);
                
//             })
//         }
//         catch(e){
//             console.log(e);
            
//         }
//     }

//     return(
//         <div className='login'>
//             <h1>Login</h1>
//             <form action="POST">
//                 <input type='text' onChange={(e)=>{setEmail(e.target.value)}} placeholder='Email' name='' id='' />
//                 <input type='password' onChange={(e)=>{setPassword(e.target.value)}} placeholder='Password' name='' id='' />
//                 <input type='submit' onClick={submit}/>
//             </form>
//             <>
//             <br>
//                 <p>OR</p>
//             </br>
//             </>
//             <Link to='/'>Login</Link>
//         </div>
//     )
// }

// export default Signup
import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import PersonIcon from '@mui/icons-material/Person';
import LockIcon from '@mui/icons-material/Lock';
import EmailIcon from '@mui/icons-material/Email';
const Signup = () => {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState(''); 
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');
    const navigate = useNavigate();
    const handleRegister = async (e) => {
        e.preventDefault();
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
                            type="password"
                            placeholder="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            autoComplete="current-password"
                        />
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
