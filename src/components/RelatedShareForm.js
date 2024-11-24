import React, { useEffect, useState } from 'react';
import axios from 'axios';
import doc_image from "../images/samples.jpg"
import "./RelatedShareForm.css"
import { CheckBox } from '@mui/icons-material';
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
                    'Authorization': `Bearer ${token}`, // Đảm bảo bạn gửi token
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
        <div className='userform-ctn'>
            {Array.isArray(relatedShareForms) && relatedShareForms.map((rsf, index) => {
                return (
                    <Link to={rsf.shareFormURL}>
                        <div key={index} >
                            <p>{rsf.documentId.documentName}</p>
                            <Checkbox disabled checked={rsf.status === "success"} />
                        </div>
                    </Link>
                )
            })}

        </div>
    )
}
export default RelatedShareForm