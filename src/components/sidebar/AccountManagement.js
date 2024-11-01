import React, { useState } from 'react';

const AccountManagement = () => {
    const [avatar, setAvatar] = useState(null);

    const handleFileChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setAvatar(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    return (
        <div style={{ padding: '20px' }}>
            <h2>Account Management</h2>
            <div>
                <label htmlFor="avatar-upload" style={{ cursor: 'pointer' }}>
                    <img 
                        src={avatar || 'default-avatar.png'} 
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
            <div style={{ marginTop: '20px' }}>
                <h3>Change Avatar</h3>
                <input type="file" onChange={handleFileChange} />
            </div>
        </div>
    );
};

export default AccountManagement;
