import React, { useState, useEffect } from 'react';
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
import axios from 'axios';

function Formheader() {
    const navigate = useNavigate();
    const { id } = useParams();
    const token = localStorage.getItem('token');
    const [{ doc_name }, dispatch] = useStateValue();
    const [accessLevel, setAccessLevel] = useState('');
    const [invitees, setInvitees] = useState(''); // Danh sách email mời người dùng nhập
    const [inviteeList, setInviteeList] = useState([]);  // Danh sách người mời (email)
    const username = localStorage.getItem('username') || 'Guest';
    const [showLogout, setShowLogout] = useState(false);
    const [open, setOpen] = useState(false);
    const [avatar, setAvatar] = useState(null);

    console.log("access level: ", accessLevel);
    const [accessTypes, setAccessTypes] = useState([]);

    useEffect(() => {
        const storedAvatar = localStorage.getItem('avatarUrl');
        if (storedAvatar) {
            setAvatar(storedAvatar);
        }
        const storageEventHandler = (e) => {
            if (e.key === 'avatarUrl') {
                setAvatar(e.newValue);  // Sử dụng đường dẫn tương đối
            }
        };

        window.addEventListener('storage', storageEventHandler);

        // Cleanup khi component unmount
        return () => {
            window.removeEventListener('storage', storageEventHandler);
        };
    }, []);
    // Hiển thị danh sách người mời khi có thay đổi
    useEffect(() => {
        // Nếu document đã được tải thành công, hiển thị danh sách người mời
        const fetchDocument = async () => {
            try {
                const response = await axios.get(`http://localhost:8000/api/documents/${id}`, {
                    headers: { 'Authorization': `Bearer ${token}` },
                });
                setInviteeList(response.data.invitees || []); // Cập nhật danh sách người mời
            } catch (error) {
                console.error('Error fetching document:', error);
            }
        };

        fetchDocument();
    }, [id, token]);

    useEffect(() => {
        //Lay ds accessType
        const fetchAccessType = async () => {
            try {
                const response = await axios.get(`http://localhost:8000/api/access-type/all`);

                if (response.status === 200) {
                    const data = response.data;
                    console.log("data access type:", data)

                    setAccessTypes(data.data)
                }
            } catch (error) {
                console.error('Error fetching access type:', error);
            }
        };

        fetchAccessType();
    }, [id]);

    const toggleLogout = () => {
        setShowLogout(!showLogout);
    };

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

        // Gửi dữ liệu lên server
        axios.put('http://localhost:8000/api/documents/invite', {
            formId: id,
            invitees: invitees.split(',').map(email => email.trim()),  // Tách và làm sạch danh sách email
            accessLevel: accessLevel,
        }, {
            headers: { 'Authorization': `Bearer ${token}` },
        })
            .then(response => {
                const data = response.data;
                console.log("Emails sent successfully:", response.data);
                alert("Link is copied to clipboard!" + " Link: " + `http://localhost:3000${data.shareFormURL}`);
                if (navigator.clipboard) {
                    navigator.clipboard.writeText(`http://localhost:3000${data.shareFormURL}`);
                }
                setInviteeList(data.shareForm.invitees); // Cập nhật lại danh sách người mời sau khi gửi thành công
            }).catch(error => {
                console.error("Error sending emails:", error);
            });

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
                <input type='text' placeholder='Untitled form' className='form_name' value={doc_name}></input>
                <FolderOpenIcon className='form_header_icon' />
                <StarOutlineIcon className='form_header_icon' />
                <span style={{ fontSize: "12px", fontWeight: "600px" }}>All changes saved</span>
            </div>
            <div className='form_header_right'>
                <IconButton>
                    <ColorLensIcon className='form_header_icon' />
                </IconButton>
                <IconButton onClick={() => navigate(`/response/${id}`)}>
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
                        {/* <p>Here is your link:
                            <a href={`/fill-form/${id}`} target="_blank" rel="noopener noreferrer">
                                {`/fill-form/${id}`}
                            </a>
                        </p> */}
                        <FormControl fullWidth>
                            <InputLabel style={{ marginTop: '10px', fontSize: "18px" }}>Access Type</InputLabel>
                            <Select
                                value={accessLevel}
                                onChange={(e) => setAccessLevel(e.target.value)}
                                style={{ marginTop: "20px" }}
                            >
                                {Array.isArray(accessTypes) && accessTypes.map((item, index) => (
                                    <MenuItem key={index} value={item._id}>{item.name}</MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                        <TextField
                            disabled={accessTypes.find((accessType) => accessType.name === "PUBLIC")?._id === accessLevel}
                            fullWidth
                            label="Invitees (email)"
                            multiline
                            rows={4}
                            value={invitees}
                            onChange={(e) => setInvitees(e.target.value)}
                            placeholder="Enter email, separated by commas"
                            style={{ marginTop: '20px' }}
                        />
                        {/* Hiển thị danh sách người mời dưới trường nhập liệu */}
                        {invitees && (
                            <div style={{ marginTop: '20px' }}>
                                <h4>Invitees preview:</h4>
                                <ul>
                                    {invitees.split(',').map((email, index) => (
                                        <li key={index}>{email.trim()}</li>
                                    ))}
                                </ul>
                            </div>
                        )}
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
                    <Avatar src={avatar || avatarimage} />
                </IconButton>
                {showLogout && (
                    <div className="logout_menu">
                        <Logout />
                    </div>
                )}
            </div>
        </div>
    );
}

export default Formheader;
