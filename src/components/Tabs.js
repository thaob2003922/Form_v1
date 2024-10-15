import React from 'react';
import { makeStyles } from '@mui/styles';
import Paper from '@mui/material/Paper';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
// import QuestionForm from './QuestionForm';
import { IconButton, Switch } from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { Typography } from "@mui/material";
import axios from 'axios';
// import { useParams } from 'react-router-dom';

const useStyles = makeStyles({
    root: { flexGrow: 1 },
    tab: {
        fontSize: "12px",
        color: "#5f6368",
        textTransform: "capitalize",
        height: "10px",
        fontWeight: "600px",
        fontFamily: "Google Sans, Arial, sans-serif"
    },
    tabs: {
        height: "10px"
    }
})

const TabPanel = ({ children, index, value }) => {
    return (
        <div role="tabpanel" hidden={value !== index}>
            {value === index && <>{children}</>}
        </div>
    );
};

function allProps(index) {
    return {
        id: `simple-tab-${index}`,
        'aria-controls': `simple-tabpanel-${index}`
    }
}

function CenteredTabs() {
    const classes = useStyles();
    const [value, setValue] = React.useState(0);
    // const {id}= useParams();
    const handleChange = (event, newValue) => {
        setValue(newValue);
    };
    
    const handleSubmit = async (id) => {
        try {
            // Lấy dữ liệu câu hỏi
            const questionsResponse = await axios.get(`http://localhost:8000/api/documents/get_all_filenames`); 
            
            const questions = questionsResponse.data;
    
            // Tạo mảng columns từ dữ liệu câu hỏi
            const columns = questions.map(question => ({
                header: question.questionText,
                key: question.questionType === 'multiple' ? 'options' : 'answer' // Tùy thuộc vào loại câu hỏi
            }));
    
            // Tạo answer_data
            const answer_data = questions.map(question => ({
                dateTime: new Date().toISOString(),
                // Thêm các trường khác tùy thuộc vào loại câu hỏi
            }));
    
            // Gửi dữ liệu đến API
            const response = await axios.post(`http://localhost:8000/api/userResponse/user_response/${id}`, {
                answer_data,
                columns,
            });
    
            // Xử lý phản hồi nếu cần
            console.log(response.data);
            //  // Tải xuống file Excel sau khi hoàn tất việc gửi
            // const downloadResponse = await axios.get(`http://localhost:8000/api/userResponse/download/${docId}`, {
            //     responseType: 'blob', // Để nhận dữ liệu nhị phân
            // });

            // // Tạo URL cho file Excel
            // const url = window.URL.createObjectURL(new Blob([downloadResponse.data]));
            // const link = document.createElement('a');
            // link.href = url;
            // link.setAttribute('download', `${docId}.xlsx`); 
            // document.body.appendChild(link);
            // link.click(); // Tự động nhấp vào link để tải file
            // link.remove(); 
        } catch (error) {
            console.error("Error during submit:", error);
        }
    };
    
    return (
        <Paper className={classes.root}>
            <Tabs className={classes.tabs} textColor='primary' indicatorColor='primary' centered value={value} onChange={handleChange}>
                <Tab label="Questions" className={classes.tab}{...allProps(0)}></Tab>
                <Tab label="Responses" className={classes.tab}{...allProps(1)}></Tab>
            </Tabs>

            <TabPanel value={value} index={0}>
                {/*<QuestionForm />*/}
            </TabPanel>
            <TabPanel value={value} index={1}>
                <div className='submit' style={{ height: "76vh" }}>
                    <div className="user_form">
                        <div className="user_form_section">
                            <div className="user_form_questions" style={{display:'flex', flexDirection:'column',marginBottom:"20px"} }>
                                <div style={{display:'flex', flexDirection:'row',alignItems:"center",justifyContent:"space-between"}}>
                                <div><button onClick={handleSubmit}>Export to Excel</button></div>
                                <Typography style={{
                                    fontSize: "15px", fontWeight: "400", letterSpacing: "0.1px", lineHeight: "24px",
                                    paddingBottom: "8px"
                                }}></Typography>
                                <IconButton>
                                    <MoreVertIcon className='form_header_icon'/>
                                </IconButton>
                                </div>
                            </div>
                            <br></br>
                            <div style={{marginBottom:"5px"}}>
                                <div style={{display:'flex',fontSize:"12px",justifyContent:'flex-end'}}>
                                    Accepting responses <Switch color='primary' size='small'/>
                                </div>
                            </div>
                        </div>
                            <div className="user_footer">
                                WWPigeon
                            </div>
                    </div>
                </div>
            </TabPanel>
        </Paper>
    )
}

export default CenteredTabs;