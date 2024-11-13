import React, { useState } from 'react';
import { Button, IconButton, Avatar, FormControl, Select, InputLabel, MenuItem, TextField } from '@mui/material';
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
    const [accessLevel, setAccessLevel] = useState('anyone');
    // Trạng thái lưu danh sách người mời
    const [invitees, setInvitees] = useState("");
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
    const handleSendLink = () => {
        const link = `/fill-form/${id}`;
        const accessInfo = `Access level: ${accessLevel}`;
        console.log(`Link: ${link}, Access: ${accessInfo}, Invitees: ${invitees}`);

        // Ở đây bạn có thể gửi thông tin lên server để mời người dùng
        // Ví dụ:
        // axios.post('/api/invite', { invitees, formLink: link, accessLevel });

        // Đóng Dialog sau khi gửi
        setOpen(false);
    };
    const handleClick = () => {
        localStorage.removeItem('documentId');
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
                        <p>Here is your link:
                            <a href={`/fill-form/${id}`} target="_blank" rel="noopener noreferrer">
                                {`/fill-form/${id}`}
                            </a>
                        </p>
                        <FormControl fullWidth>
                            <InputLabel style={{ marginTop: '10px', fontSize: "18px" }}>Access Level</InputLabel>
                            <Select
                                value={accessLevel}
                                onChange={(e) => setAccessLevel(e.target.value)}
                                style={{ marginTop: "20px" }}
                            >
                                <MenuItem value="anyone">Anyone with the link</MenuItem>
                                <MenuItem value="inviteOnly">Only invited people</MenuItem>
                                <MenuItem value="restricted">Restricted</MenuItem>
                            </Select>
                        </FormControl>
                        {/* Trường nhập email hoặc userID */}
                        <TextField
                            fullWidth
                            label="Invitees (email or userID)"
                            multiline
                            rows={4}
                            value={invitees}
                            onChange={(e) => setInvitees(e.target.value)}
                            placeholder="Enter email or userID, separated by commas"
                            style={{ marginTop: '20px' }}
                        />
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleClose} color='primary'>
                            Close
                        </Button>
                        <Button onClick={handleSendLink} color='primary'>
                            Send
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