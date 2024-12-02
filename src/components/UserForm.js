import React, { useEffect, useState } from "react";
import "./UserForm.css";
import { useStateValue } from "./StateProvider";
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Button, Typography } from "@mui/material";
import { useParams } from 'react-router-dom';

function UserForm() {
    console.log("UserForm");
    
    const { id } = useParams();
    const { documentId, userId } = useParams();
    const navigate = useNavigate();
    const [answer, setAnswer] = useState([]);
    const [quest, setQuest] = useState([]);
    const [{ questions, doc_name, doc_desc }] = useStateValue();
    const token = localStorage.getItem('token');

    function select(que, option) {
        const k = answer.findIndex((ele) => ele.question === que);
        answer[k].answer = option;
        setAnswer([...answer]);
    }

    useEffect(() => {
        const newAnswers = questions.map((q) => ({
            question: q.questionText,
            answer: " "
        }));
        setAnswer(newAnswers);

        const newQuest = questions.map((q) => ({
            header: q.questionText,
            key: q.questionText
        }));
        setQuest(newQuest);
    }, [questions]);

    function selectinput(que, option) {
        const k = answer.findIndex((ele) => ele.question === que);
        answer[k].answer = option;
        setAnswer([...answer]);
    }

    function selectcheck(e, que, option) {
        let d = [];
        const k = answer.findIndex((ele) => ele.question === que);
        if (answer[k].answer) {
            d = answer[k].answer.split(",");
        }
        if (e === true) {
            d = Array.from(new Set([...d, option]));
        } else {
            const n = d.findIndex((el) => el.option === option);
            d.splice(n, 1);
        }
        answer[k].answer = d.join(",");
        setAnswer([...answer]);
    }

    function submit() {
        const post_answer_data = {};
        
        answer.forEach((ele) => {
            let cleanedAnswer = ele.answer
                .split(',')                // Tách câu trả lời bằng dấu phẩy
                .map(item => item.trim())  // Loại bỏ khoảng trắng thừa của từng phần tử
                .filter(item => item)      // Loại bỏ phần tử rỗng nếu có
                .join(',');                // Ghép lại thành chuỗi với dấu phẩy
            
            // Gán câu trả lời đã làm sạch vào đối tượng post_answer_data
            post_answer_data[ele.question] = cleanedAnswer;
        });
    
        console.log("post_answer_data:", post_answer_data);
    
        axios.post(`http://localhost:8000/api/userResponse/submit/${id}`, {
            documentId: documentId,
            userId: userId,
            answers: post_answer_data
        }, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            }
        })
        .then(response => {
            console.log(response.data);
            alert('Cảm ơn bạn đã phản hồi!');
            navigate(`/`);
        })
        .catch(error => {
            console.error("Lỗi gửi câu trả lời: ", error);
        });
    }    

    return (
        <div className="submit">
            <div className="user_form">
                <div className="user_form_section">
                    <div className="user_title_section">
                        <Typography style={{ fontSize: "26px" }}>{doc_name}</Typography>
                        <Typography style={{ fontSize: "15px" }}>{doc_desc}</Typography>
                    </div>
                    {
                        questions.map((question, qindex) => (
                            <div className="user_form_questions" key={qindex}>
                                <Typography style={{
                                    fontSize: "15px", fontWeight: "400", letterSpacing: "0.1px", lineHeight: "24px",
                                    paddingBottom: "8px"
                                }}>
                                    {qindex + 1}. {question.questionText}
                                </Typography>
                                {
                                    question.questionType === "text" ? (
                                        // Render một input duy nhất cho câu hỏi kiểu text
                                        <div>
                                            <input
                                                type="text"
                                                className="form_check_input"
                                                required={question.required}
                                                onChange={(e) => selectinput(question.questionText, e.target.value)}
                                                style={{ marginLeft: "5px", marginRight: "5px",  width: "95%" }}
                                            />
                                        </div>
                                    ) : (
                                        // Render các tùy chọn nếu không phải câu hỏi kiểu text
                                        question.options.map((ques, index) => (
                                            <div key={index} style={{ marginBottom: "5px" }}>
                                                <div style={{ display: "flex" }}>
                                                    <div className="form_check">
                                                        {question.questionType !== "radio" ? (
                                                            question.questionType !== "text" ? (
                                                                <label>
                                                                    <input
                                                                        type={question.questionType}
                                                                        name={qindex}
                                                                        value={ques.optionText}
                                                                        className="form_check_input"
                                                                        required={question.required}
                                                                        style={{ marginLeft: "5px", marginRight: "5px" }}
                                                                        onChange={(e) => selectcheck(e.target.checked, question.questionText, ques.optionText)}
                                                                    /> {ques.optionText}
                                                                </label>
                                                            ) : (
                                                                <label>
                                                                    <input
                                                                        type={question.questionType}
                                                                        name={qindex}
                                                                        value={ques.optionText}
                                                                        className="form_check_input"
                                                                        required={question.required}
                                                                        style={{ marginLeft: "5px", marginRight: "5px" }}
                                                                        onChange={(e) => selectinput(question.questionText, e.target.value)}
                                                                    /> {ques.optionText}
                                                                </label>
                                                            )
                                                        ) : (
                                                            <label>
                                                                <input
                                                                    type={question.questionType}
                                                                    name={qindex}
                                                                    value={ques.optionText}
                                                                    className="form_check_input"
                                                                    required={question.required}
                                                                    style={{ marginLeft: "5px", marginRight: "5px" }}
                                                                    onChange={(e) => select(question.questionText, ques.optionText)}
                                                                /> {ques.optionText}
                                                            </label>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        ))
                                    )
                                }
                            </div>
                        ))
                    }
                    <div className="user_form_submit">
                        <Button variant="contained" color="primary" onClick={submit} style={{ fontSize: "14px" }}>Nộp</Button>
                    </div>
                    <div className="user_footer">
                        WWPigeon
                    </div>
                </div>
            </div>
        </div>
    )
}

export default UserForm;
