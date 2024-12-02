import React, { useState, useEffect } from "react";
import "./Header.css";
// import MenuIcon from '@mui/icons-material/Menu';
import IconButton from '@mui/material/IconButton';
import formimage from "../images/survey_logo.png";
import SearchIcon from '@mui/icons-material/Search';
import Avatar from '@mui/material/Avatar';
import avatarimage from "../images/defaultAvt.jpg";
import TemporaryDrawer from "./TemporaryDrawer";
import Logout from "./user/Logout";
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
function Header() {
    const [showLogout, setShowLogout] = useState(false);

    const toggleLogout = () => {
        setShowLogout(!showLogout);
    };
    const [avatar, setAvatar] = useState(null);
    const username = localStorage.getItem('username') || 'Guest';
    const [searchTerm, setSearchTerm] = useState('');
    const [results, setResults] = useState([]);
    const token = localStorage.getItem('token');
    const navigate = useNavigate();
    const [noResults, setNoResults] = useState(false);

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



    const handleSearch = async () => {
        try {
            const response = await axios.get(`http://localhost:8000/api/documents/search?query=${searchTerm}`, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`, 
                },
            });
            const data = response.data;
            if (data.length > 0) {
                setResults(data);
                setNoResults(false);
            } else {
                setResults([]);
                setNoResults(true);
            }
        } catch (error) {
            console.error("Error fetching search results", error);
        }
    };

    // const handleCeateAccessType = async () => {
    //     try {
    //         const response = await axios.get(`http://localhost:8000/api/access-type/create-mock-access-type`);
    //     } catch (error) {
    //         console.error("Error fetching search results", error);
    //     }
    // };

    const handleSelect = (documentId) => {
        navigate(`/form/${documentId}`);
    };
    const handleOutsideClick = (event) => {
        const dropdown = document.querySelector('.dropdown');
        if (dropdown && !dropdown.contains(event.target)) {
            setResults([]); // Xóa kết quả
            setNoResults(false); // Tắt thông báo không có kết quả
            setSearchTerm(''); // Xóa input
        }
    };

    useEffect(() => {
        document.addEventListener('click', handleOutsideClick);
        return () => {
            document.removeEventListener('click', handleOutsideClick);
        };
    }, []);

    return (
        <div className="header">
            <div className="header_info">
                <TemporaryDrawer />
                <img src={formimage} style={{ height: '40px', width: '40px' }} className="form_image" alt="not showing right now" />
                <div className="info">
                    WWPigeon
                </div>
            </div>
            {/* <div>
                <button onClick={handleCeateAccessType}>
                    Create access type
                </button>
            </div> */}
            <div className="header_search">
                <IconButton onClick={handleSearch}>
                    <SearchIcon />
                </IconButton>
                <input
                    type="text"
                    name="search"
                    placeholder="Tìm kiếm"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
                <div className="dropdown">
                    {noResults && <div>Không tìm thấy kết quả phù hợp</div>}
                    {results.map((item) => (
                        <div key={item._id} onClick={() => handleSelect(item.documentId)}>
                            {item.documentName}
                        </div>
                    ))}
                </div>
            </div>
            <div className="header_right">
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
    )
}

export default Header;