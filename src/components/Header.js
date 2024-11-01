import React, {useState} from "react";
import "./Header.css";
// import MenuIcon from '@mui/icons-material/Menu';
import IconButton from '@mui/material/IconButton';
import formimage from "../images/survey_logo.png";
import SearchIcon from '@mui/icons-material/Search';
import Avatar from '@mui/material/Avatar';
import avatarimage from "../images/defaultAvt.jpg";
import TemporaryDrawer from "./TemporaryDrawer";
import Logout from "./user/Logout";
function Header(){
    const [showLogout, setShowLogout] = useState(false);

    const toggleLogout = () => {
        setShowLogout(!showLogout);
    };
    const username = localStorage.getItem('username') || 'Guest';
    return (
        <div className="header">
            <div className="header_info">
                <TemporaryDrawer />
                <img src={formimage} style={{height:'40px', width:'40px'}} className="form_image" alt="not showing right now"/>
            <div className="info">
                WWPigeon
            </div>
            </div>
            <div className="header_search">
                <IconButton>
                <SearchIcon />
                </IconButton>
                <input type="text" name="search" placeholder="Search" />
            </div>
            <div className="header_right">
                {/* <IconButton>
                <AppsIcon />
                </IconButton> */}
                <span className="username-display">{username}</span>
                <IconButton onClick={toggleLogout}>
                    <Avatar src={avatarimage}/>
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