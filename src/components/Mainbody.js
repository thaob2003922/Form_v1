import React, { useState, useEffect } from 'react';
import IconButton from '@mui/material/IconButton';
import FolderOpenIcon from '@mui/icons-material/FolderOpen';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import StorageIcon from '@mui/icons-material/Storage';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import "./Mainbody.css"
import doc_image from "../images/party_invitation.png"
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function Mainbody(){
    const navigate = useNavigate();
    
    function navigate_to(docname){
        var fname = docname.split('.');
        // console.log(typeof docname, docname);
        navigate("/form/" + fname[0])
    }
    
    const [files, setFiles] = useState([]);
    
    const filenames = async () => {
        try {
            const request = await axios.get("http://localhost:8000/api/documents/get_all_filenames");
            let filenames = request.data;
            setFiles(filenames);
        } catch (error) {
            console.error("Error fetching filenames:", error);
        }
    };
    useEffect(() => {
        filenames();
    }, []); 
    return (
        <div className='mainbody'>
            <div className='mainbody_top'>
                <div className='mainbody_top_left' style={{fontSize:"16px",fontWeight:"500px"}}>
                Rencents form
                </div>
                <div className='mainbody_top_right'>
                <div className='mainbody_top_center' style={{fontSize:"14px",marginRight:"125px"}}>Owned by anyone<ArrowDropDownIcon/></div>
                    <IconButton>
                        <StorageIcon style={{fontSize:"16px",color:"black"}}/>
                    </IconButton>
                    <IconButton>
                        <FolderOpenIcon style={{fontSize:"16px",color:"black"}}/>
                    </IconButton>
                </div>
            </div>
            <div className='mainbody_docs'>{
                files.map((ele,index) =>(
                    <div key={index} className='doc_card' onClick={()=>{
                    navigate_to(ele)
                }}>
                    <img className="doc_image" src={doc_image} alt=''/>
                    <div className='doc_card_content'>
                    <h5 style={{ overflow: "hidden",
                                whiteSpace: "nowrap",
                                textOverflow: "ellipsis"}}> 
                    {ele?.documentName ? ele.doccumentName : "Untitled Doc"}</h5>
                   
                        <div className='doc_content'>
                            <div className='content_left'>
                                <StorageIcon style={{color:"white",fontSize:"12px",backgroundColor:"6E2594",padding:"3px",marginRight:"3px",borderRadius:"2px"}}/>
                                Opend 23 Sep 2024
                            </div>
                            <MoreVertIcon style={{fontSize:"16px", color:"grey"}}/>
                        </div>
                    </div>
                </div>))
            }
            </div>
        </div>
    )
}

export default Mainbody