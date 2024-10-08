import React from "react";
import "./Header.css";
// import MenuIcon from '@mui/icons-material/Menu';
import IconButton from '@mui/material/IconButton';
import formimage from "../images/survey_logo.png";
import SearchIcon from '@mui/icons-material/Search';
import AppsIcon from '@mui/icons-material/Apps';
import Avatar from '@mui/material/Avatar';
import avatarimage from "../images/avatar.jpg";
import TemporaryDrawer from "./TemporaryDrawer";
function Header(){
    return (
        <div className="header">
            <div className="header_info">
                {/* <IconButton>
                <MenuIcon />
                </IconButton> */}
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
                <IconButton>
                <AppsIcon />
                </IconButton>
                <IconButton>
                    <Avatar src={avatarimage}/>
                </IconButton>
            </div>
        </div>
    )
}

export default Header;