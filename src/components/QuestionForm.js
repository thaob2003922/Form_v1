import React, { useState, useEffect } from 'react';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import Typography from '@mui/material/Typography';
import FormControlLabel from '@mui/material/FormControlLabel';
import "./QuestionForm.css";
import { AddCircleOutline, CheckBox, CropOriginal, FilterNone, MoreVert, OndemandVideo, ShortText, Subject, TextFields } from '@mui/icons-material';
import { Button, IconButton, MenuItem, Radio, Select, Switch } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import DeleteIcon from '@mui/icons-material/Delete';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import DragIndicatorIcon from '@mui/icons-material/DragIndicator';
import axios from 'axios';

import "./reducer.js"
import { actionTypes } from './reducer.js';
import { useStateValue } from './StateProvider.js';
import { useParams } from 'react-router-dom';
function QuestionForm() {
    const { id } = useParams();
    const [{doc_name}, dispatch] = useStateValue();
    const [documentExists, setDocumentExists] = useState(true);
    const [questions, setQuestions] = useState(
        [{
            questionText: "Question",
            questionType: "radio",
            options: [
                { optionText: "Option 1" }

            ],
            open: true,
            required: false
        }]
    )

    console.log('docNameInStore ', doc_name);
    
    const [selectedValue, setSelectedValue] = useState('');
    const handleChange = (event) => {
        setSelectedValue(event.target.value);
    };
    const [documentName, setDocName] = useState(doc_name);
    const [documentDescription, setDocDesc] = useState("");

    const [value, setValue] = useState('');
    const handleChangeAddOther = (event) => {
        setValue(event.target.value);
    };
    const [inputValue, setInputValue] = useState('');

    useEffect(() => {setDocName(doc_name)},[doc_name])

    useEffect(() => {
        console.log('data_added' , Date.now());
        
        async function data_adding() {
            try {
                const document = await axios.get(`http://localhost:8000/api/documents/get_document_by_id/${id}`)
                console.log('document_in_db', document);
                
                if (document) {
                    console.log('adding document ', Date.now());
                    const response = await axios.get(`http://localhost:8000/api/documents/data/${id}`);

                    console.log('response_in_query ', response.data);
                    const question_data = response.data.questions;
                    const doc_name = response.data.documentName;
                    const doc_descip = response.data.documentDescription;

                    setDocName(doc_name);
                    setDocDesc(doc_descip);
                    setQuestions(question_data);

                    
                    

                    dispatch({ type: actionTypes.SET_DOC_NAME, doc_name });
                    dispatch({ type: actionTypes.SET_DOC_DESC, doc_desc: doc_descip });
                    dispatch({ type: actionTypes.SET_QUESTION, questions: question_data });
                }

            } catch (error) {
                console.error("Error fetching document data", error);
                setDocumentExists(false); // Đánh dấu rằng tài liệu không còn tồn tại
            }
        }
        data_adding();
    }, [id]);
    // const handleDelete = async (id) => {
    //     try {
    //         await axios.delete(`http://localhost:8000/api/documents/delete_document/${id}`);
    //         setDocumentExists(false); // Đánh dấu tài liệu đã bị xóa
    //     } catch (error) {
    //         console.error("Error deleting document", error);
    //     }
    // };

    function changeQuestion(text, i) {
        var newQuestion = [...questions];
        newQuestion[i].questionText = text;
        setQuestions(newQuestion);
        console.log(newQuestion);
    }
    function changeOptionValue(text, i, j) {
        var optionsQuestion = [...questions];
        optionsQuestion[i].options[j].optionText = text;
        setQuestions(optionsQuestion);
        console.log(optionsQuestion);

    }
    function addQuestionType(i, type) {
        let qs = [...questions];
        console.log(type);
        qs[i].questionType = type;
        setQuestions(qs);
    }
    function removeOption(i, j) {
        var removeOptionQuestion = [...questions];
        if (removeOptionQuestion[i].options.length > 1) {
            removeOptionQuestion[i].options.splice(j, 1);
            setQuestions(removeOptionQuestion)
            console.log(i + "__" + j);

        }
    }
    function addOption(i) {
        var optionsOfQuestion = [...questions];
        if (optionsOfQuestion[i].options.length < 5) {
            optionsOfQuestion[i].options.push({ optionText: "Option " + (optionsOfQuestion[i].options.length + 1) })
        } else {
            console.log("Max 5 options");

        }
        setQuestions(optionsOfQuestion);
    }
    function copyQuestion(i) {
        expandedCloseAll();
        let qs = [...questions];
        var newQuestion = { ...qs[i] };
        setQuestions([...questions, newQuestion]);
    }
    function deleteQuestion(i) {
        let qs = [...questions];
        if (questions.length > 1) {
            qs.splice(i, 1);
        }
        setQuestions(qs);
    }
    function requiredQuestion(i) {
        var reqQuestion = [...questions];
        reqQuestion[i].required = !reqQuestion[i].required;
        console.log(reqQuestion[i].required + " " + i);
        setQuestions(reqQuestion);

    }
    function addMoreQuestionField() {
        expandedCloseAll();
        setQuestions([...questions, {
            questionText: "Question", questionType: "radio", options: [{ optionText: "Option 1" }], open: true, required: false
        }]
        );
    }
    function onDragEnd(result) {
        if (!result.destination) {
            return;
        }
        var itemgg = [...questions];
        const itemF = reorder(
            itemgg,
            result.source.index,
            result.destination.index
        );
        setQuestions(itemF);
    }
    const reorder = (list, startIndex, endIndex) => {
        const result = Array.from(list);
        const [removed] = result.splice(startIndex, 1);
        result.splice(endIndex, 0, removed);
        return result;
    }
    function expandedCloseAll() {
        let qs = [...questions];
        for (let j = 0; j < qs.length; j++) {
            qs[j].open = true;
        } setQuestions(qs);
    }
    function handleExpand(i) {
        let qs = [...questions];
        for (let j = 0; j < qs.length; j++) {
            if (i === j) {
                qs[i].open = true;
            } else {
                qs[j].open = false;
            }
        } setQuestions(qs);
    }
    function commitToDB() {
        dispatch({
            type: actionTypes.SET_QUESTION,
            questions: questions
        })
        dispatch({
            type: actionTypes.SET_DOC_NAME,
            doc_name: documentName
        })
        dispatch({
            type: actionTypes.SET_DOC_DESC,
            doc_desc: documentDescription
        })
        axios.post(`http://localhost:8000/api/documents/add_questions/${id}`, {
            'document_name': documentName,
            'doc_desc': documentDescription,
            'questions': questions,
        })


    }
    function questionsUI() {
        return questions.map((ques, i) => (
            <Draggable key={i} draggableId={`draggable-${i}`} index={i}>
                {(provided, snapshot) => (
                    <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}>
                        <div>
                            <div style={{ marginBottom: "0px" }}>
                                <div style={{ width: "100%", marginBottom: "0px" }}>
                                    <DragIndicatorIcon style={{
                                        transform: "rotate(-90deg)", color: "#202124",
                                        position: "relative", left: "310px"
                                    }} fontSize="small" />
                                </div>
                                <div>
                                    <Accordion expanded={questions[i].open} onChange={() => { handleExpand(i) }} className={questions[i].open ? 'add_border' : ""}>
                                        <AccordionSummary aria-controls="panel1a-content" id='panel1a-header' style={{ width: "100%" }}>
                                            {questions[i].open ? (
                                                <div className='saved_questions'>
                                                    <Typography style={{ fontSize: "15px", fontWeight: "400px", letterSpacing: "0.1px", lineHeight: "24px", paddingBottom: "8px" }}>
                                                        {i + 1}. {questions[i].questionText}
                                                    </Typography>

                                                    {ques.options.map((op, j) => (
                                                        <div key={j}>
                                                            <div style={{ display: "flex", }}>
                                                                <FormControlLabel style={{ marginLeft: "5px", marginBottom: "5px" }} disabled control={<input type={ques.questionType}
                                                                    color='primary' style={{ marginRight: "3px", }} required={ques.type} value={inputValue} onChange={(e) => setInputValue(e.target.value)} />} label={
                                                                        <Typography style={{
                                                                            fontFamily: "Roboto, Arial, sans-serif",
                                                                            fontSize: "13px",
                                                                            fontWeight: "400px",
                                                                            letterSpacing: "0.2px",
                                                                            lineHeight: '20px',
                                                                            color: "#202124"
                                                                        }}>
                                                                            {ques.options[j].optionText}
                                                                        </Typography>
                                                                    } />
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            ) : ""}
                                        </AccordionSummary>
                                        {questions[i].open ? (
                                            <div className='question_boxes'>
                                                <AccordionDetails className='add_question'>
                                                    <div className='add_question_top'>
                                                        <input className='question' type='text' placeholder='Question' value={ques.questionText}
                                                            onChange={(e) => { changeQuestion(e.target.value, i) }}></input>
                                                        <CropOriginal style={{ color: "#5f6368" }} />
                                                        <Select className='select' style={{ color: "#5f6368", fontSize: "13px" }} value={selectedValue || ''} onChange={handleChange} >
                                                            <MenuItem id='text' value="Text" onClick={() => { addQuestionType(i, "text") }}><Subject style={{ marginRight: "10px" }} /> Paragraph</MenuItem>
                                                            <MenuItem id='checkbox' value="Checbox" onClick={() => { addQuestionType(i, "checkbox") }}><CheckBox style={{ marginRight: "10px", color: "#70757a" }} checked />Checkboxes</MenuItem>
                                                            <MenuItem id='radio' value="Radio" onClick={() => { addQuestionType(i, "radio") }}><Radio style={{ marginRight: "10px", color: "#70757a" }} checked />Muitiple Choice </MenuItem>
                                                        </Select>
                                                    </div>
                                                    {ques.options.map((op, j) => (
                                                        <div className='add_question_body' key={j}>
                                                            {
                                                                (ques.questionType !== "text") ?
                                                                    <input type={ques.questionType} style={{ marginRight: "10px" }} value={inputValue} onChange={(e) => setInputValue(e.target.value)}></input> :
                                                                    <ShortText style={{ marginRight: "10px" }}></ShortText>
                                                            }
                                                            <div>
                                                                <input className='text_input' type='text' placeholder='option' value={ques.options[j].optionText}
                                                                    onChange={(e) => { changeOptionValue(e.target.value, i, j) }}>
                                                                </input>
                                                            </div>
                                                            <CropOriginal style={{ color: "#5f6368" }} />
                                                            <IconButton aria-label="delete" onClick={() => { removeOption(i, j) }}>
                                                                <CloseIcon />
                                                            </IconButton>
                                                        </div>
                                                    ))}

                                                    {ques.options.length < 5 ? (
                                                        <div className='add_question_body'>
                                                            <FormControlLabel disabled control={
                                                                (ques.questionType !== "text") ?
                                                                    <input type={ques.questionType} color='primary' inputprops={{ 'aria-label': 'secondary checkbox' }}
                                                                        style={{ marginLeft: "10px", marginRight: "10px" }} disabled value={inputValue} onChange={(e) => setInputValue(e.target.value)} /> :
                                                                    <ShortText style={{ marginRight: "10px" }} />
                                                            } label={
                                                                <div>
                                                                    <input type='text' className='text_input' style={{ fontSize: "13px", width: "60px" }} placeholder='Add other' value={value} onChange={handleChangeAddOther}></input>
                                                                    <Button size='small' onClick={() => { addOption(i) }} style={{ textTransform: "none", color: "#4285f4", fontSize: "13px", fontWeight: "600" }}>Add option</Button>
                                                                </div>
                                                            }

                                                            />
                                                        </div>
                                                    ) : ""}

                                                    <div className='add_footer'>
                                                        <div className='add_question_bottom_left'>
                                                            <Button size='small' style={{ textTransform: "none", color: "#4285f4", fontSize: "13px", fontWeight: "600" }}>
                                                                <OpenInNewIcon style={{ border: "1px solid #4285f4", padding: "0.5px", marginRight: "8px" }} />Answer Key
                                                            </Button>
                                                        </div>
                                                        <div className='add_question_bottom'>
                                                            <IconButton aria-label='copy' onClick={() => { copyQuestion(i) }}>
                                                                <FilterNone />
                                                            </IconButton>
                                                            <IconButton aria-label='delete' onClick={() => { deleteQuestion(i) }}>
                                                                <DeleteIcon />
                                                            </IconButton>
                                                            <span style={{ color: "#5f6368", fontSize: "13px" }}>Required</span>
                                                            <Switch name='checkedA' color='primary' onClick={() => { requiredQuestion(i) }}></Switch>
                                                            <IconButton>
                                                                <MoreVert />
                                                            </IconButton>
                                                        </div>
                                                    </div>
                                                </AccordionDetails>
                                                <div className='question_edit'>
                                                    <AddCircleOutline onClick={addMoreQuestionField} className='edit' />
                                                    <OndemandVideo className='edit' />
                                                    <CropOriginal className='edit' />
                                                    <TextFields className='edit' />
                                                </div>
                                            </div>) : " "}
                                    </Accordion>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </Draggable>

        ))
    }
    return (
        <div>
            <div className='question_form'>
                <br></br>
                <div className='section'>
                    <div className='question_title_section'>
                        <div className='ques_form_top'>
                            <input className='ques_form_top_name' type='text' style={{ color: "black" }} placeholder='Untitled document' value={documentName} onChange={(e) => { setDocName(e.target.value) }}></input>
                            <input className='ques_form_top_desc' type='text' placeholder='Add description' value={documentDescription} onChange={(e) => { setDocDesc(e.target.value) }}></input>
                        </div>
                    </div>
                    <DragDropContext onDragEnd={onDragEnd}>
                        <Droppable droppableId='question-droppable'>
                            {(provided, snapshot) => (
                                <div
                                    {...provided.droppableProps}
                                    ref={provided.innerRef}
                                >
                                    {questionsUI()}
                                    {provided.placeholder}
                                </div>
                            )}
                        </Droppable>
                    </DragDropContext>
                    <div className='save_form'>
                        <Button variant='contained' color='primary' onClick={commitToDB} style={{ fontSize: "14px" }}>Save</Button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default QuestionForm;