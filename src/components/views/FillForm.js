import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button, Typography} from '@mui/material';
import axios from 'axios';
import "./FillForm.css";
import loginloading from '../user/img-temp/backgr.jpg'
const FillForm = () => {
    const { shareformId: urlShareFormId } = useParams();  // Lấy shareformId từ URL
    console.log('ShareFormId ', urlShareFormId);

    const redirectToSearchParams = new URLSearchParams();

    redirectToSearchParams.set('redirectTo', `/fill-form/${urlShareFormId}`);

    const [document, setDocument] = useState(null);
    const [questions, setQuestions] = useState([]);
    const [docName, setDocName] = useState("");
    const [docDesc, setDocDesc] = useState("");
    const [answers, setAnswers] = useState({});  // Lưu câu trả lời dưới dạng object
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [hasAccess, setHasAccess] = useState(true);  // Cờ kiểm tra quyền truy cập
    const token = localStorage.getItem('token');
    const navigate = useNavigate();

    // Lấy shareformId từ localStorage (nếu có)
    // const storedDocumentId = localStorage.getItem('shareformId');

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
            alert('Vui lòng đăng nhập để gửi câu trả lời của bạn');
            return;
        }

        if (Object.keys(answers).length !== questions.length) {
            alert('Hãy trả lời tất cả câu hỏi!');
            return;
        }

        if (document?.documentId) {
            // Gửi câu trả lời lên server
            axios.post(`http://localhost:8000/api/userResponse/submit/${document.documentId}`, {
                doc_id: document.documentId,
                // email: localStorage.getItem('email'),
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
                    alert('Cảm ơn bạn đã phản hồi!');

                    // Xóa shareformId khỏi localStorage
                    localStorage.removeItem('shareformId');

                    // Điều hướng về trang chủ sau khi gửi xong
                    navigate('/');
                })
                .catch(error => {
                    console.error('Lỗi gửi câu trả lời:', error);
                });
        }
    };

    useEffect(() => {
        if (!token) {
            setIsLoggedIn(false);
            return;
        }

        setIsLoggedIn(true);

        // Lấy shareformId từ URL nếu có, nếu không lấy từ localStorage
        // const shareformId = urlShareFormId || storedDocumentId;

        if (urlShareFormId) {
            // Kiểm tra quyền truy cập người dùng đối với tài liệu này
            axios.get(`http://localhost:8000/api/documents/check-access/${urlShareFormId}`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            })
                .then(response => {
                    if (response.status === 200) {
                        console.log("Check access granted ", response.data)
                        const document = response.data.document;

                        setHasAccess(true)
                        setQuestions(document.questions || []);
                        setDocName(document.documentName || "");
                        setDocDesc(document.documentDesc || "");
                        setDocument(document)

                        // setHasAccess(true);
                        // // Lấy câu hỏi từ server nếu có quyền truy cập
                        // axios.get(`http://localhost:8000/api/documents/get_document_by_id/${shareformId}`, {
                        //     headers: {
                        //         'Authorization': `Bearer ${token}`,
                        //     },
                        // })
                        // .then(response => {
                        //     setQuestions(response.data.questions || []);
                        //     setDocName(response.data.documentName || "");
                        //     setDocDesc(response.data.documentDesc || "");
                        // })
                        // .catch(error => {
                        //     console.error('Error fetching questions:', error);
                        // });
                    } else {
                        setHasAccess(false);
                    }
                })
                .catch(error => {
                    if (error.response && error.response.status === 403) {
                        setHasAccess(false);
                        alert("Bạn không có quyền truy cập vào tài liệu này.");
                        // navigate('/');
                    }
                });
        } else {
            console.log("No shareformId found");
            // Điều hướng về trang chủ nếu không có shareformId
            // navigate('/');
        }
    }, [urlShareFormId, token, navigate]); // old dependency: [urlShareFormId, storedDocumentId, token, navigate]


    // if (!isLoggedIn) {
    //     return (
    //         <div>
    //             <h1>Vui lòng đăng nhập để truy cập vào biểu mẫu</h1>
    //             <div className='isLoggedIn'>
    //                 <button onClick={() => navigate(`/login?${redirectToSearchParams.toString()}`)} style={{ fontSize: '15px', padding: '15px 25px', }}>
    //                     Login
    //                 </button>
    //             </div>
    //         </div>
    //     );
    // }
    if (!isLoggedIn) {
        return (
            <div style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                height: '100vh',
                backgroundColor: '#white',
                fontFamily: 'Arial, sans-serif',
            }}>
                <h1 style={{
                    fontSize: '24px',
                    fontWeight: 'bold',
                    color: '#333',
                    textAlign: 'center',
                    marginBottom: '20px',
                }}>
                    Vui lòng đăng nhập để truy cập vào biểu mẫu
                </h1>
                <img
                    src={loginloading}
                    alt="loading..."
                    style={{
                        width: '300px',
                        marginBottom: '30px',
                    }}
                />
                <div className='isLoggedIn'>
                    <button
                        onClick={() => navigate(`/login?${redirectToSearchParams.toString()}`)}
                        style={{
                            fontSize: '16px',
                            padding: '12px 30px',
                            backgroundColor: '#007bff',
                            color: '#fff',
                            border: 'none',
                            borderRadius: '5px',
                            cursor: 'pointer',
                            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                            transition: 'background-color 0.3s ease',
                        }}
                        onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#0056b3'}
                        onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#007bff'}
                    >
                        Đăng nhập
                    </button>
                </div>
            </div>
        );
    }


    if (!hasAccess) {
        return (
            <div  style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                height: '100vh',
                backgroundColor: '#white',
                fontFamily: 'Arial, sans-serif',
            }}>
                <h1 style={{
                    fontSize: '24px',
                    fontWeight: 'bold',
                    color: '#333',
                    textAlign: 'center',
                    marginBottom: '20px',
                }}>
                    Bạn không có quyền truy cập vào tài liệu này
                </h1>
                <img
                    src={loginloading}
                    alt="loading..."
                    style={{
                        width: '300px',
                        marginBottom: '30px',
                    }}
                />
                <div className='hasAccess'>
                    <button 
                    onClick={() => navigate(`/`)}
                    style={{
                            fontSize: '16px',
                            padding: '12px 30px',
                            backgroundColor: '#007bff',
                            color: '#fff',
                            border: 'none',
                            borderRadius: '5px',
                            cursor: 'pointer',
                            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                            transition: 'background-color 0.3s ease',
                        }}
                        onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#0056b3'}
                        onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#007bff'}>
                    Quay lại trang chủ
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

                            {
                                question.questionType === 'text' ? (
                                    // Render một input duy nhất cho câu hỏi kiểu text
                                    <div key="text-input" style={{ marginBottom: "5px"}}>
                                        <div style={{width:"95%" }}>
                                            <div className="form_check">
                                                <label>
                                                    <input
                                                        type="text"
                                                        name={`question-${qindex}`}  // Dùng name động cho câu hỏi kiểu text
                                                        className="form_check_input"
                                                        required={question.required}  // Điều kiện bắt buộc (required)
                                                        onChange={(e) => handleAnswerChange(question.questionText, e.target.value)}  // Cập nhật câu trả lời khi người dùng nhập
                                                        style={{ marginLeft: "5px", marginRight: "5px", width: "95%" }}  // Điều chỉnh kiểu dáng
                                                    />
                                                </label>
                                            </div>
                                        </div>
                                    </div>
                                ) : (
                                    // Render các tùy chọn nếu không phải câu hỏi kiểu text
                                    question.options.map((ques, index) => (
                                        <div key={index} style={{ marginBottom: "5px" }}>
                                            <div style={{ display: "flex" }}>
                                                <div className="form_check">
                                                    <label>
                                                        <input
                                                            type={question.questionType}  // Đảm bảo sử dụng đúng loại input theo questionType
                                                            name={`question-${qindex}`}  // Dùng name động cho mỗi câu hỏi
                                                            value={ques.optionText}
                                                            className="form_check_input"
                                                            required={question.required}  // Điều kiện bắt buộc (required)
                                                            onChange={() => handleAnswerChange(question.questionText, ques.optionText)}  // Cập nhật câu trả lời khi chọn
                                                            style={{ marginLeft: "5px", marginRight: "5px" }}  // Căn chỉnh các input
                                                        />
                                                        {ques.optionText}
                                                    </label>
                                                </div>
                                            </div>
                                        </div>
                                    ))
                                )
                            }
                        </div>
                    ))
                ) : (
                    <p>No questions available.</p>
                )}

                <div className="user_form_submit">
                    <Button variant="contained" color="primary" style={{ fontSize: "14px" }} onClick={handleSubmit}>
                        Nộp
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default FillForm;
