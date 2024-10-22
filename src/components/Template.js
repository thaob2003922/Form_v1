import React from 'react';
// import { fontSize } from '@mui/system';
import IconButton from '@mui/material/IconButton';
import UnfoldMoreIcon from '@mui/icons-material/UnfoldMore';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import "./Template.css"
import axios from 'axios';
import blank from "../images/blank.png"
import party from "../images/party_invitation.png"
import contact from "../images/contact.png"
import { v4 as uuidv4 } from 'uuid';
import { useNavigate } from 'react-router-dom';
function Template(){
    const navigate = useNavigate();
    const token = localStorage.getItem('token');
    const createForm = () => {
        const create_form_id = uuidv4();
        console.log(create_form_id);
        var question_list=[{questionText:"Question",questionType:"radio",options:[{optionText:"Option 1"}],
            open: true, required: false}]
        axios.post(`http://localhost:8000/api/documents/add_questions/${create_form_id}`,{
            'document_name':'',
            'doc_desc': '',
            'questions': question_list
        },
        {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`, // Đảm bảo bạn gửi token
            }
        })
        navigate(`/form/${create_form_id}`); 
    }
    return (
        <div className='template_section'>
            <div className='template_top'>
                <div className='template_left'>
                    <span style={{fontSize:"16px", color:"#202124"}}>Start new survey</span>
                </div>
                <div className='template_right'>
                    <div className='gallery_button'>
                        Template gallery
                        <UnfoldMoreIcon fontSize='small'/>
                    </div>
                    <IconButton>
                        <MoreVertIcon fontSize='small'/>
                    </IconButton>
                </div>
            </div>
            <div className='template_body'>
                <div className='card' onClick={createForm}>
                    <img className="card_image" src={blank} alt=''/>
                    <p className='card_title'>Blank</p>
                </div>
                <div className='card'>
                    <img className="card_image" src={party} alt=''/>
                    <p className='card_title'>Party</p>
                </div>
                <div className='card'>
                    <img className="card_image" src={contact} alt=''/>
                    {/* <span>Contact Information</span> */}
                    <p className='card_title'>Contact Information</p>
                </div>
            </div>
        </div>
    )
}

export default Template