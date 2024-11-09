import React, { useState } from 'react';
import { Button, IconButton, Avatar } from '@mui/material';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useStateValue } from './StateProvider';
import Logout from './user/Logout';
import formimage from '../images/survey_logo.png';
import avatarimage from '../images/defaultAvt.jpg';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import FolderOpenIcon from '@mui/icons-material/FolderOpen';
import StarOutlineIcon from '@mui/icons-material/StarOutline';
import ColorLensIcon from '@mui/icons-material/ColorLens';
import VisibilityIcon from '@mui/icons-material/Visibility';
import SettingsIcon from '@mui/icons-material/Settings';
import './Formheader.css';
import { Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material';

function Formheader() {
    const navigate = useNavigate();
    const { id } = useParams();
    const [{ doc_name }, dispatch] = useStateValue();
    function navigates() {
        navigate(`/response/${id}`);
    }
    const username = localStorage.getItem('username') || 'Guest';
    const [showLogout, setShowLogout] = useState(false);

    const toggleLogout = () => {
        setShowLogout(!showLogout);
    };
    
    const [open, setOpen] = useState(false);

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };
    const handleClick = () => {
        // Xóa 'documentId' khỏi localStorage
        localStorage.removeItem('documentId');

        // Điều hướng về trang chủ ("/")
        navigate('/');
    };
    return (
        <div className='form_header'>
            <div className='form_header_left'>
                <Link to='/' onClick={handleClick}>
                    <img src={formimage} style={{ height: "45px", width: "40px" }} alt='' />
                </Link>
                <input type='text' placeholder='Unitled form' className='form_name' value={doc_name}></input>
                <FolderOpenIcon className='form_header_icon' />
                <StarOutlineIcon className='form_header_icon' />
                <span style={{ fontSize: "12px", fontWeight: "600px" }}>All changes saved</span>
            </div>
            <div className='form_header_right'>
                <IconButton>
                    <ColorLensIcon className='form_header_icon' />
                </IconButton>
                <IconButton onClick={() => navigates()}>
                    <VisibilityIcon className='form_header_icon' />
                </IconButton>
                <IconButton>
                    <SettingsIcon className='form_header_icon' />
                </IconButton>
                
                <IconButton onClick={handleClickOpen}>
                    <Button variant='contained' color='primary'>Send</Button>
                </IconButton>

                <Dialog open={open} onClose={handleClose}>
                    <DialogTitle>Link to Form</DialogTitle>
                    <DialogContent>
                        <p>Here is your link: <a href={`/fill-form/${id}`} target="_blank" rel="noopener noreferrer">{`/fill-form/${id}`}</a></p>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleClose} color='primary'>
                            Close
                        </Button>
                    </DialogActions>
                </Dialog>
                <IconButton>
                    <MoreVertIcon className='form_header_icon' />
                </IconButton>

                <span className="username-display">{username}</span>
                <IconButton onClick={toggleLogout}>
                    <Avatar src={avatarimage} />
                </IconButton>
                {showLogout && (
                    <div className="logout_menu">
                        <Logout />
                    </div>
                )}


            </div>
        </div>
    )
}

export default Formheader