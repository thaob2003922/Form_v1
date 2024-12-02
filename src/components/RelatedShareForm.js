import React, { useEffect, useState } from 'react';
import axios from 'axios';
import doc_image from "../images/samples.jpg"
import "./RelatedShareForm.css"
import { Checkbox } from '@mui/material';
import { Link } from 'react-router-dom';
function RelatedShareForm() {
    const token = localStorage.getItem('token');
    const [relatedShareForms, setRelatedShareForms] = useState([]);

    const userformRelated = async () => {
        try {
            const response = await axios.get("http://localhost:8000/api/user-form/user-forms-related", {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
            });
            let userformRelated = response.data;
            console.log('userformRelated:', userformRelated);

            setRelatedShareForms(userformRelated.relatedShareForm);
        } catch (error) {
            console.error("Error fetching userformRelated:", error);
        }
    };
    useEffect(() => {
        userformRelated();
    }, []);

    return (
        <div className='mainbody-related'>
            {Array.isArray(relatedShareForms) && relatedShareForms.length > 0 && (
                <div className='related_left' style={{ fontSize: "16px", fontWeight: "500" }}>
                    Được chia sẻ với tôi
                </div>
            )}
            <div className='userform-ctn'>
                {Array.isArray(relatedShareForms) && relatedShareForms.map((rsf, index) => {
                    return rsf.documentId && (
                        <Link to={rsf.shareFormURL} key={index} className="userform-item">
                            <div className='doc_card'>
                                <img className="doc_image" src={doc_image} alt='Document Thumbnail' />
                                <div className='doc_card_content'>
                                    <div className='doc_card_header'>
                                        <h4>{rsf.documentId.documentName || "Untitled Doc"}</h4>
                                        <Checkbox disabled checked={rsf.status === "success"} />
                                    </div>
                                </div>
                            </div>
                        </Link>
                    );
                })}
            </div>
        </div>

    );

}
export default RelatedShareForm