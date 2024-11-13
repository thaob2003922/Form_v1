import React, { useState, useEffect } from 'react';
import { Dialog, DialogActions, DialogContent, DialogTitle, Button } from '@mui/material';
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
            // Lưu tạm thời vào state
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
            for (let [key, value] of formData.entries()) {
                console.log(`${key}:`, value);
            }
            axios.post('http://localhost:8000/api/users/upload-avatar', formData, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            })
            .then((response) => {
                const avatarUrl = response.data.avatarUrl;
                console.log("Avatar URL:", avatarUrl);  
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
        <div style={{ 
            padding: '20px',
            justifyContent: 'center',
            alignItems: 'center',
            flexDirection: 'column'  
        }}>
            <h2>Account Management</h2>

            <div>
                <label htmlFor="avatar-upload" style={{ cursor: 'pointer' }}>
                    <img
                        src={avatar || 'defaultAvt.jpg'}
                        alt="Avatar"
                        style={{ width: '100px', height: '100px', borderRadius: '50%' }}
                    />
                </label>
                <input
                    id="avatar-upload"
                    type="file"
                    onChange={handleFileChange}
                    style={{ display: 'none' }}
                />
            </div>

            {/* Section thay đổi avatar */}
            <div style={{ marginTop: '20px' }}>
                <h3>Change Avatar</h3>
                <Button variant="contained" color="primary" onClick={handleDialogOpen}>
                    Upload New Avatar
                </Button>
            </div>

            {/* Dialog để upload avatar */}
            <Dialog open={openDialog} onClose={handleDialogClose}>
                <DialogTitle>Upload New Avatar</DialogTitle>
                <DialogContent>
                    <input
                        type="file"
                        onChange={handleFileChange}
                        accept="image/*"
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleDialogClose} color="primary">
                        Cancel
                    </Button>
                    <Button onClick={handleSave} color="primary" autoFocus>
                        Save
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
};

export default AccountManagement;
