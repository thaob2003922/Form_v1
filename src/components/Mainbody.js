import React, { useState, useEffect } from 'react';
import IconButton from '@mui/material/IconButton';
import FolderOpenIcon from '@mui/icons-material/FolderOpen';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import StorageIcon from '@mui/icons-material/Storage';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import "./Mainbody.css"
import doc_image from "../images/samples.jpg"
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { Menu, MenuItem, Button } from "@mui/material";
import RelatedShareForm from './RelatedShareForm';
function Mainbody() {
    const navigate = useNavigate();

    function navigate_to(docname) {
        // handleClick(docname.documentId);
        // console.log("docname mainbody:", docname);

        navigate("/form/" + docname.documentId)
    }
    // const handleClick = (documentId) => {
    //     localStorage.setItem('documentId', documentId);
    // };

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
    const currentDateTime = new Date().toLocaleString('vi-VN', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    });

    const [anchorEl, setAnchorEl] = useState(null);
    const [selectedOption, setSelectedOption] = useState("Do tôi sở hữu");

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleSelect = (option) => {
        setSelectedOption(option);
        handleClose();
    };
    return (
        <div className='mainbody'>
            <div className='mainbody_top'>
                <div className='mainbody_top_left' style={{ fontSize: "16px", fontWeight: "500px" }}>
                    Biểu mẫu gần đây
                </div>
                <div className='mainbody_top_right'>
                    <div className="mainbody_top_center" style={{ fontSize: "14px", marginRight: "125px" }}>
                        <Button
                            onClick={handleClick}
                            endIcon={<ArrowDropDownIcon />}
                            style={{ textTransform: "none", fontSize: "15px", color: selectedOption === "Do tôi sở hữu" ? "black" : "red", }}
                        >
                            {selectedOption}
                        </Button>
                        <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleClose}>
                            <MenuItem onClick={() => handleSelect("Do tôi sở hữu")}>Do tôi sở hữu</MenuItem>
                            <MenuItem onClick={() => handleSelect("Không phải do tôi sở hữu")}>
                                Không phải do tôi sở hữu
                            </MenuItem>
                        </Menu>
                        <IconButton>
                            <StorageIcon style={{ fontSize: "16px", color: "black" }} />
                        </IconButton>
                        <IconButton>
                            <FolderOpenIcon style={{ fontSize: "16px", color: "black" }} />
                        </IconButton>
                    </div>
                </div>
            </div>
            <div className='mainbody_docs'>
                {selectedOption === "Do tôi sở hữu" ? (
                    files.map((ele, index) => (
                        <div key={index} className='doc_card' onClick={() => navigate("/form/" + ele.documentId)}>
                            <img className="doc_image" src={doc_image} alt='Document Thumbnail' />
                            <div className='doc_card_content'>
                                <h4>{ele?.documentName || "Untitled Doc"}</h4>
                                <div className='doc_content'>
                                    <div className='content_left'>
                                        <StorageIcon
                                            style={{
                                                color: "white",
                                                fontSize: "12px",
                                                backgroundColor: "#6E2594",
                                                padding: "3px",
                                                marginRight: "3px",
                                                borderRadius: "2px"
                                            }}
                                        />
                                        Đã mở {currentDateTime}
                                    </div>
                                    <div className='content_right'>
                                        <MoreVertIcon
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                setMenuOpen(menuOpen === index ? null : index);
                                            }}
                                            style={{ fontSize: "16px", color: "grey", cursor: "pointer" }}
                                        />
                                        {menuOpen === index && (
                                            <div className="dropdown-menu">
                                                <div onClick={() => { handleEdit(ele.documentId); setMenuOpen(null); }}>
                                                    <EditIcon style={{ marginRight: '4px' }} />Đổi tên
                                                </div>
                                                <div onClick={() => { handleDelete(ele.documentId); setMenuOpen(null); }}>
                                                    <DeleteIcon style={{ marginRight: '4px', color: 'red' }} />Xóa
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>

                    ))
                ) : (
                    <RelatedShareForm />
                )}
            </div>
        </div>
    )
}

export default Mainbody