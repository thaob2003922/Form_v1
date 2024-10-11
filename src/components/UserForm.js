import React, { useEffect, useState } from "react";
import "./UserForm.css";
import { useStateValue } from "./StateProvider";
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Button, Typography } from "@mui/material";
function UserForm(){
    // var quest =[];
    // var post_answer =[];
    var navigate = useNavigate();
    var [answer, setAnswer] = useState();
    var [quest, setQuest] = useState([]);
    var [{questions, doc_name, doc_desc},dispatch] = useStateValue();
    function select(que, option) {
        var k = answer.findIndex((ele)=>(ele.question === que))
        answer[k].answer = option;
        setAnswer(answer)
        console.log(answer);
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
    // useEffect(()=>{
    //     questions.map((q)=>{
    //         return(
    //             answer.push({
    //                 "question": q.questionText,
    //                 "answer": " "
    //             })
    //         )
           
    //     })
    //     questions.map((q, index)=>{
    //         return (
    //             quest.push({"header": q.questionText,"key": q.questionText})
    //         )
            
    //     })
    // },[])
    var post_answer_data ={}
    function selectinput(que, option){
        var k = answer.findIndex((ele)=>(ele.question === que))
        answer[k].answer= option;
        setAnswer(answer)
        console.log(answer);
    }
    function selectcheck(e,que,option){
        var d =[];
        var k= answer.findIndex((ele)=>(ele.question === que))
        if(answer[k].answer){
            d=answer[k].answer.split(",")
        }
        if( e === true){
            // d.push(option)
            d = Array.from(new Set([...d, option]));
        }else{
            var n= d.findIndex((el)=>(el.option === option))
            d.splice(n,1)
        }
        answer[k].answer= d.join(",")
        setAnswer(answer)
    }
    function submit(){
        answer.map((ele)=>{
            return (
                post_answer_data[ele.question]= ele.answer
            )
        })
        axios.post(`http://localhost:8000/user_response/${doc_name}`,{
            "columm": quest,
            "answer_data": [post_answer_data]
        })
        navigate(`/submitted`)
    }

    return(
        <div className="submit">
            <div className="user_form">
                <div className="user_form_section">
                    <div className="user_title_section">
                        <Typography style={{fontSize:"26px"}}>{doc_name}</Typography>
                        <Typography style={{fontSize:"15px"}}>{doc_desc}</Typography>
                    </div>
                    {
                    questions.map((question, qindex)=>(
                        <div className="user_form_questions">
                        <Typography style={{fontSize:"15px",fontWeight:"400",letterSpacing:"0.1px",lineHeight:"24px",
                            paddingBottom:"8px"}}>{qindex+1}.{question.questionText}</Typography>
                        {
                            question.options.map((ques, index)=>(
                                <div key={index} style={{marginBottom:"5px"}}>
                                    <div style={{display:"flex"}}>
                                    <div className="form_check">{
                                        question.questionType !== "radio" ? (
                                            question.questionType !== "text" ? (
                                        <label>
                                        <input 
                                        type={question.questionType}
                                        name={qindex}
                                        value={ques.optionText}
                                        className="form_check_input"
                                        required={question.required}
                                        style={{marginLeft:"5px",marginRight:"5px"}}
                                        onChange={(e)=>{selectcheck(e.target.checked,question.questionText,ques.optionText)}}
                                        /> {ques.optionText}
                                        </label>):(
                                        
                                        <label>
                                        <input 
                                        type={question.questionType}
                                        name={qindex}
                                        value={ques.optionText}
                                        className="form_check_input"
                                        required={question.required}
                                        style={{marginLeft:"5px",marginRight:"5px"}}
                                        onChange={(e)=>{selectinput(question.questionText,e.target.value)}}
                                        /> {ques.optionText}   
                                        </label>)):(

                                        <label>
                                        <input 
                                        type={question.questionType}
                                        name={qindex}
                                        value={ques.optionText}
                                        className="form_check_input"
                                        required={question.required}
                                        style={{marginLeft:"5px",marginRight:"5px"}}
                                        onChange={(e)=>{select(question.questionText,ques.optionText)}}
                                        /> {ques.optionText}   
                                        </label>)
                                        }
                                    </div>
                                    </div>
                                </div>
                            ))
                        }
                        </div>
                        
                    ))
                    }
                    <div className="user_form_submit">
                        <Button variant="contained" color="primary" onClick={submit} style={{fontSize:"14px"}}>Submit</Button>
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