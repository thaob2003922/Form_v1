import React, { useState, useEffect } from 'react';
import {
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Button,
    Box,
    TextField,
    Typography,
} from '@mui/material';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
const AccountManagement = () => {
    const [avatar, setAvatar] = useState(null);
    const [displayName, setDisplayName] = useState(''); // Tên hiển thị
    const [email, setEmail] = useState('');
    const [selectedFile, setSelectedFile] = useState(null);
    const [openDialog, setOpenDialog] = useState(false); // Dialog avatar
    const token = localStorage.getItem('token');
    const navigate = useNavigate();
    useEffect(() => {
        // Lấy dữ liệu ban đầu (avatar, tên hiển thị và email) từ API hoặc localStorage
        const storedAvatar = localStorage.getItem('avatarUrl');
        const storedName = localStorage.getItem('displayName');
        const storedEmail = localStorage.getItem('email');
        if (storedAvatar) setAvatar(storedAvatar);
        if (storedName) setDisplayName(storedName);
        if (storedEmail) setEmail(storedEmail);
    }, []);

    const handleFileChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            setSelectedFile(file);
        }
    };

    const handleAvatarSave = () => {
        if (selectedFile) {
            const formData = new FormData();
            formData.append('avatar', selectedFile);

            axios
                .post('http://localhost:8000/api/users/upload-avatar', formData, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                })
                .then((response) => {
                    const avatarUrl = response.data.avatarUrl;
                    setAvatar(avatarUrl);
                    localStorage.setItem('avatarUrl', avatarUrl);
                    setOpenDialog(false);
                })
                .catch((error) => {
                    console.error('Error uploading avatar:', error);
                    alert('Failed to upload avatar');
                });
        }
    };

    const handleUpdateProfile = () => {
        // Gửi yêu cầu cập nhật tên hiển thị và email
        axios
            .post(
                'http://localhost:8000/api/users/update-profile',
                { displayName, email },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            )
            .then(() => {
                alert('Cập nhật thông tin thành công!');
                localStorage.setItem('displayName', displayName);
                localStorage.setItem('email', email);
            })
            .catch((error) => {
                console.error('Error updating profile:', error);
                alert('Không thể cập nhật thông tin!');
            });
    };
    const handleNavigateHome = () => {
        navigate('/'); // Điều hướng về trang chủ
    };
    return (
        <Box
            sx={{
                padding: '15px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '15px',
                background: '#f9f9f9',
                borderRadius: '10px',
                boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                maxWidth: '500px',
                margin: 'auto',
                marginTop: '20px',
            }}
        >
            <Typography variant="h4" sx={{ fontWeight: 600, color: '#333' }}>
                Quản lý tài khoản
            </Typography>

            {/* Avatar Section */}
            <Box>
                <img
                    src={avatar || 'defaultAvt.jpg'}
                    alt="Avatar"
                    style={{
                        width: '120px',
                        height: '120px',
                        borderRadius: '50%',
                        border: '4px solid #1976d2',
                        boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
                        objectFit: 'cover',
                        marginBottom: '10px',
                    }}
                />
                <Button
                    variant="outlined"
                    onClick={() => setOpenDialog(true)}
                    sx={{
                        textTransform: 'none',
                        marginTop: '10px',
                    }}
                >
                    Cập nhật ảnh đại diện
                </Button>
            </Box>

            {/* Input Fields */}
            <Box sx={{ width: '60%', display: 'flex', flexDirection: 'column', gap: '15px' }}>
                <TextField
                    label="Tên hiển thị"
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    fullWidth
                    variant="outlined"
                />
                <TextField
                    label="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    fullWidth
                    variant="outlined"
                />
                <Button
                    variant="contained"
                    color="primary"
                    onClick={handleUpdateProfile}
                    sx={{
                        textTransform: 'none',
                        fontWeight: 500,
                        fontSize: '16px',
                    }}
                >
                    Cập nhật thông tin
                </Button>
                <Button
                    variant="outlined"
                    color="secondary"
                    onClick={handleNavigateHome}
                    sx={{
                        textTransform: 'none',
                        fontWeight: 500,
                        fontSize: '16px',
                        color: "black",
                    }}
                >
                    Quay về trang chủ
                </Button>
            </Box>

            {/* Dialog for updating avatar */}
            <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
                <DialogTitle>Cập nhật ảnh đại diện</DialogTitle>
                <DialogContent>
                    <input
                        type="file"
                        onChange={handleFileChange}
                        accept="image/*"
                        style={{
                            padding: '10px',
                            borderRadius: '8px',
                            border: '1px solid #ddd',
                            width: '100%',
                        }}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenDialog(false)} color="primary">
                        Hủy
                    </Button>
                    <Button onClick={handleAvatarSave} color="primary">
                        Lưu
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default AccountManagement;
