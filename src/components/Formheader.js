import React from 'react';
import IconButton from '@mui/material/IconButton';
import formimage from "../images/survey_logo.png";
import avatarimage from "../images/avatar.jpg";
import Avatar from '@mui/material/Avatar';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import FolderOpenIcon from '@mui/icons-material/FolderOpen';
import StarOutlineIcon from '@mui/icons-material/StarOutline';
import ColorLensIcon from '@mui/icons-material/ColorLens';
import VisibilityIcon from '@mui/icons-material/Visibility';
import SettingsIcon from '@mui/icons-material/Settings';
import "./Formheader.css";
import { Button } from '@mui/material';
import { Link } from "react-router-dom";
import { useStateValue } from "./StateProvider";
import { useNavigate } from 'react-router-dom';
import { useParams } from 'react-router-dom';
function Formheader(){
    const navigate = useNavigate();
    const { id } = useParams();
    const [{doc_name},dispatch] = useStateValue();
    function navigates() {
        navigate(`/response/${id}`); 
    }
    return(
        <div className='form_header'>
           <div className='form_header_left'>
                <Link to='/'>
                <img src={formimage} style={{height:"45px",width:"40px"}} alt=''/>
                </Link>
                <input type='text' placeholder='Unitled form' className='form_name' value={doc_name}></input>
                <FolderOpenIcon className='form_header_icon' />
                <StarOutlineIcon className='form_header_icon' />
                <span style={{fontSize:"12px", fontWeight:"600px"}}>All changes saved</span>
           </div>
           <div className='form_header_right'>
                <IconButton>
                    <ColorLensIcon className='form_header_icon'/>
                </IconButton>
                <IconButton onClick={() => navigates()}>
                    <VisibilityIcon className='form_header_icon'/>
                </IconButton>
                <IconButton>
                    <SettingsIcon className='form_header_icon'/>
                </IconButton>
                <IconButton>
                    <Button variant='contained' color='primary' href='#contained-buttons'>Send</Button>
                </IconButton>
                <IconButton>
                    <MoreVertIcon className='form_header_icon'/>
                </IconButton>
                <IconButton>
                    <Avatar style={{height:"30px",width:"30px"}} src={avatarimage} alt=""/>
                </IconButton>
           </div>
        </div>
    )
}

export default Formheader