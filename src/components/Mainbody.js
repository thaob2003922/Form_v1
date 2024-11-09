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
import EditIcon from '@mui/icons-material/Edit'; 
import DeleteIcon from '@mui/icons-material/Delete'; 
function Mainbody(){
    const navigate = useNavigate();
    
    function navigate_to(docname){
        handleClick(docname.documentId);
        console.log(docname)
    
        navigate("/form/" + docname.documentId)
    }
    const handleClick = (documentId) => {
        localStorage.setItem('documentId', documentId);
    };
    
    const [files, setFiles] = useState([]);
    const [menuOpen, setMenuOpen] = useState(null);
    const token = localStorage.getItem('token');
    const filenames = async () => {
        try {
            const response = await axios.get("http://localhost:8000/api/documents/get_all_filenames", {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`, // Đảm bảo bạn gửi token
                },
            });
            let filenames = response.data;
            console.log('filenames:', filenames);
            
            setFiles(filenames.documents);
        } catch (error) {
            console.error("Error fetching filenames:", error);
        }
    };
    useEffect(() => {
        filenames();
    }, []); 

    const handleDelete = async (docId) => {
        try {
            const response = await axios.delete(`http://localhost:8000/api/documents/delete_document/${docId}`);
            console.log(response.data.message); // Thông báo thành công
            await filenames(); 
            navigate("/");
        } catch (error) {
            console.error('Error deleting document:', error.response?.data?.message || error.message);
        }
    };

    const handleEdit = (docId) => {
        // console.log("Chỉnh sửa tài liệu với ID:", docId);
        // // Thêm logic chỉnh sửa tại đây
    };
    const currentDateTime = new Date().toLocaleString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        // hour: '2-digit',
        // minute: '2-digit',
        // hour12: true, // sử dụng 12 giờ (AM/PM)
    });
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
                    <h4 style={{ overflow: "hidden",
                                whiteSpace: "nowrap",
                                textOverflow: "ellipsis"}}> 
                    {ele?.documentName ? ele.documentName : "Untitled Doc"}</h4>
                   
                        <div className='doc_content'>
                            <div className='content_left'>
                                <StorageIcon style={{color:"white",fontSize:"12px",backgroundColor:"6E2594",padding:"3px",marginRight:"3px",borderRadius:"2px"}}/>
                                Opened {currentDateTime}
                            </div>
                            {/* <div className='content_right'>
                            <MoreVertIcon  
                                style={{fontSize:"16px", color:"grey"}}
                            />
                            </div> */}
                    
                            <div className='content_right'>
                                <MoreVertIcon  
                                    onClick={(e) => {
                                        e.stopPropagation(); // Ngăn không cho sự kiện click lan ra ngoài
                                        setMenuOpen(menuOpen === index ? null : index); // Chuyển đổi trạng thái menu
                                        }}
                                    style={{ fontSize: "16px", color: "grey", cursor: "pointer" }}
                                />
                                {menuOpen === index && (
                                <div className="dropdown-menu" style={{ position: 'absolute', background: 'white', border: '1px solid grey', borderRadius: '4px', marginTop: '8px', zIndex: 1000 }}>
                                    <div 
                                        onClick={() => { handleEdit(ele.documentId); setMenuOpen(null); }} 
                                        style={{ padding: '8px', cursor: 'pointer', display: 'flex', alignItems: 'center'}}
                                    >
                                    <EditIcon style={{ marginRight: '4px' }} />Edit name
                                    </div>
                                    <div 
                                        onClick={() => { handleDelete(ele.documentId); setMenuOpen(null); }} 
                                        style={{ padding: '8px', cursor: 'pointer', display: 'flex', alignItems: 'center', color: 'red' }}
                                    >
                                    <DeleteIcon style={{ marginRight: '4px' }} />Delete
                                    </div>
                                </div>
                                    )}
                            </div>
                        </div>
                    </div>
                </div>))
            }
            </div>
        </div>
    )
}

export default Mainbody