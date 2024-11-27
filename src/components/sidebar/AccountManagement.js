import React, { useState, useEffect } from 'react';
import { Dialog, DialogActions, DialogContent, DialogTitle, Button, Box } from '@mui/material';
import axios from 'axios'; // Để gọi API

const AccountManagement = () => {
    const [avatar, setAvatar] = useState(null); // Avatar state (để hiển thị trong giao diện)
    const [selectedFile, setSelectedFile] = useState(null); 
    const [openDialog, setOpenDialog] = useState(false); // Dialog open state
    const token = localStorage.getItem('token');
    
    // Mở dialog
    const handleDialogOpen = () => {
        setOpenDialog(true);
    };

    const handleDialogClose = () => {
        setOpenDialog(false);
    };
    
    // Xử lý thay đổi tệp (lưu tạm thời vào state)
    const handleFileChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            setSelectedFile(file);
        }
    };

    useEffect(() => {
        // Lấy avatar từ localStorage nếu có
        const storedAvatar = localStorage.getItem('avatarUrl');
        if (storedAvatar) {
            setAvatar(storedAvatar);
        }
    }, []);

    const handleSave = () => {
        if (selectedFile) {
            const formData = new FormData();
            formData.append('avatar', selectedFile);
            
            axios.post('http://localhost:8000/api/users/upload-avatar', formData, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            })
            .then((response) => {
                const avatarUrl = response.data.avatarUrl;
                setAvatar(avatarUrl);
                localStorage.setItem('avatarUrl', avatarUrl); 
                handleDialogClose(); 
            })
            .catch((error) => {
                console.error('Error uploading avatar:', error);
                alert('Failed to upload avatar');
            });
        }
    };

    return (
        <Box
            sx={{
                padding: '20px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                textAlign: 'center',
                gap: '20px',
            }}
        >
            <h2 style={{ fontWeight: 600 }}>Quản lý tài khoản</h2>

            {/* Avatar Section */}
            <Box>
                <label htmlFor="avatar-upload" style={{ cursor: 'pointer' }}>
                    <img
                        src={avatar || 'defaultAvt.jpg'}
                        alt="Avatar"
                        style={{
                            width: '120px',
                            height: '120px',
                            borderRadius: '50%',
                            border: '3px solid #f5f5f5',
                            boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
                            objectFit: 'cover',
                        }}
                    />
                </label>
                <input
                    id="avatar-upload"
                    type="file"
                    onChange={handleFileChange}
                    style={{ display: 'none' }}
                />
            </Box>

            {/* Section thay đổi avatar */}
            <Box sx={{ marginTop: '20px' }}>
                <Button
                    variant="contained"
                    color="primary"
                    onClick={handleDialogOpen}
                    sx={{
                        padding: '8px 20px',
                        fontSize: '16px',
                        textTransform: 'none',
                        boxShadow: '0 3px 6px rgba(0,0,0,0.1)',
                    }}
                >
                    Cập nhật ảnh mới
                </Button>
            </Box>

            {/* Dialog để upload avatar */}
            <Dialog open={openDialog} onClose={handleDialogClose}>
                <DialogTitle>Cập nhật ảnh mới</DialogTitle>
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
                    <Button onClick={handleDialogClose} color="primary">
                        Hủy
                    </Button>
                    <Button
                        onClick={handleSave}
                        color="primary"
                        autoFocus
                        sx={{
                            padding: '8px 20px',
                            textTransform: 'none',
                            fontSize: '16px',
                        }}
                    >
                        Lưu
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default AccountManagement;
