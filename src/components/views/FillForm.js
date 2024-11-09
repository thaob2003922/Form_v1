import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button, Typography } from '@mui/material';
import axios from 'axios';
import "./FillForm.css"
const FillForm = () => {
    const { documentId: urlDocumentId } = useParams();  // Lấy documentId từ URL
    const [questions, setQuestions] = useState([]);  // Lưu câu hỏi
    const [docName, setDocName] = useState("");
    const [docDesc, setDocDesc] = useState("");
    const [answers, setAnswers] = useState({});  // Lưu câu trả lời dưới dạng object
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const token = localStorage.getItem('token');
    const navigate = useNavigate();

    // Lấy documentId từ localStorage (nếu có)
    const storedDocumentId = localStorage.getItem('documentId');

    // Cập nhật câu trả lời khi người dùng chọn một option
    const handleAnswerChange = (questionText, answer) => {
        setAnswers(prevAnswers => ({
            ...prevAnswers,
            [questionText]: answer  // Dùng questionText làm key, answer làm value
        }));
    };

    const handleSubmit = () => {
        // Kiểm tra nếu có token và câu trả lời đã được điền đầy đủ
        if (!token) {
            alert('Please login to submit your answers');
            return;
        }

        if (Object.keys(answers).length !== questions.length) {
            alert('Please answer all questions');
            return;
        }

        // Gửi câu trả lời lên server
        axios.post(`http://localhost:8000/api/userResponse/submit/${urlDocumentId}`, {
            documentId: urlDocumentId,
            userId: localStorage.getItem('userId'),  // Lấy userId từ localStorage hoặc từ context, nếu có
            answers: answers  // Gửi dữ liệu dưới dạng object
        }, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        })
        .then(response => {
            console.log(response.data);
            alert('Thank you for your feedback!');
            
            // Xóa documentId khỏi localStorage
            localStorage.removeItem('documentId');
            
            // Điều hướng về trang chủ sau khi gửi xong
            navigate('/');
        })
        .catch(error => {
            console.error('Error submitting answers:', error);
        });
    };

    useEffect(() => {
        if (!token) {
            setIsLoggedIn(false);  
            return;
        }

        setIsLoggedIn(true);

        // Lấy documentId từ URL nếu có, nếu không lấy từ localStorage
        const documentId = urlDocumentId || storedDocumentId;

        if (documentId) {
            fetch(`http://localhost:8000/api/documents/get_document_by_id/${documentId}`, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
            })
            .then(response => response.json())
            .then(data => {
                setQuestions(data.questions || []);
                setDocName(data.documentName || "");
                setDocDesc(data.documentDesc || "");
            })
            .catch(error => {
                console.error('Error fetching questions:', error);
            });
        } else {
            console.log("No documentId found");
            // Điều hướng về trang chủ nếu không có documentId
            navigate('/');
        }
    }, [urlDocumentId, storedDocumentId, token, navigate]);

    if (!isLoggedIn) {
        return (
            <div>
                <h1>Please login to access the form</h1>
                <div className='isLoggedIn'>
                    <button onClick={() => navigate('/login')} style={{fontSize: '15px',padding: '15px 25px',}}>  
                        Login
                    </button>
                </div> 
            </div>
        );
    }
    
    return (
        <div className="user_form">
            <div className="user_form_section">
                <div className="user_title_section">
                    <Typography style={{ fontSize: "26px" }}>{docName}</Typography>
                    <Typography style={{ fontSize: "15px" }}>{docDesc}</Typography>
                </div>

                {Array.isArray(questions) && questions.length > 0 ? (
                    questions.map((question, qindex) => (
                        <div className="user_form_questions" key={qindex}>
                            <Typography
                                style={{
                                    fontSize: "15px",
                                    fontWeight: "400",
                                    letterSpacing: "0.1px",
                                    lineHeight: "24px",
                                    paddingBottom: "8px"
                                }}
                            >
                                {qindex + 1}. {question.questionText}
                            </Typography>

                            {question.options.map((ques, index) => (
                                <div key={index} style={{ marginBottom: "5px" }}>
                                    <div style={{ display: "flex" }}>
                                        <div className="form_check">
                                            <label>
                                                <input
                                                    type={question.questionType}
                                                    name={`question-${qindex}`}
                                                    value={ques.optionText}
                                                    className="form_check_input"
                                                    required={question.required}
                                                    onChange={() => handleAnswerChange(question.questionText, ques.optionText)} // Cập nhật câu trả lời
                                                    style={{ marginLeft: "5px", marginRight: "5px" }}
                                                />{" "}
                                                {ques.optionText}
                                            </label>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ))
                ) : (
                    <p>No questions available.</p>
                )}

                <div className="user_form_submit">
                    <Button variant="contained" color="primary" style={{ fontSize: "14px" }} onClick={handleSubmit}>
                        Submit
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default FillForm;
