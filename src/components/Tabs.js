import React from 'react';
import { makeStyles } from '@mui/styles';
import Paper from '@mui/material/Paper';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import QuestionForm from './QuestionForm';
import { IconButton, Switch } from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { Typography } from "@mui/material";
// import axios from 'axios';
// import { useParams } from 'react-router-dom';
import ResponsesTable from './views/ResponsesTable';
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
    
    
    return (
        <Paper className={classes.root}>
            <Tabs className={classes.tabs} textColor='primary' indicatorColor='primary' centered value={value} onChange={handleChange}>
                <Tab label="Câu hỏi" className={classes.tab}{...allProps(0)}></Tab>
                <Tab label="Câu trả lời" className={classes.tab}{...allProps(1)}></Tab>
            </Tabs>

            <TabPanel value={value} index={0}>
                <QuestionForm />
            </TabPanel>
            <TabPanel value={value} index={1}>
                <div className='submit'>
                    <div className="user_form">
                        <div className="user_form_section">
                            <div className="user_form_questions" style={{display:'flex', flexDirection:'column',marginBottom:"20px"} }>
                                <div style={{display:'flex', flexDirection:'row',alignItems:"center",justifyContent:"space-between"}}>
                                {/* <div><button onClick={handleSubmit}>Export to Excel</button></div> */}
                                <div><h3>Danh sách người phản hồi</h3></div>
                                <Typography style={{
                                    fontSize: "15px", fontWeight: "400", letterSpacing: "0.1px", lineHeight: "24px",
                                    paddingBottom: "8px"
                                }}></Typography>
                                <IconButton>
                                    <MoreVertIcon className='form_header_icon'/>
                                </IconButton>
                                </div>
                                <div>
                                    <ResponsesTable/>
                                </div>
                            </div>
                            <br></br>
                            <div style={{marginBottom:"5px"}}>
                                <div style={{display:'flex',fontSize:"12px",justifyContent:'flex-end'}}>
                                    Chấp nhận phản hồi <Switch color='primary' size='small'/>
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