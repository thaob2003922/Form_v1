import React from 'react';
import { makeStyles } from '@mui/styles';
import Paper from '@mui/material/Paper';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import QuestionForm from './QuestionForm';
import { IconButton, Switch } from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { Typography } from "@mui/material";

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
// function TabPanel(props) {
//     const { children, value, index, ...other } = props;
//     return (
//         <div role='tabpanel' hidden={value !== index} id={`simple-tabpanel-${index}`}
//             aria-labelledby={`simple-tab-${index}`} {...other}
//         >
//             {value === index && (
//                 <div>{children}</div>
//             )}
//         </div>
//     )
// }
const TabPanel = ({ children, index, value }) => {
    return (
        <div role="tabpanel" hidden={value !== index}>
            {value === index && <>{children}</>}
        </div>
    );
};
// TabPanel.propTypes = {
//     children: PropTypes.node,
//     index: PropTypes.any.isRequired,
//     value: PropTypes.any.isRequired
// }
function allProps(index) {
    return {
        id: `simple-tab-${index}`,
        'aria-controls': `simple-tabpanel-${index}`
    }
}

function CenteredTabs() {
    const classes = useStyles();
    const [value, setValue] = React.useState(0);

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };
    return (
        <Paper className={classes.root}>
            <Tabs className={classes.tabs} textColor='primary' indicatorColor='primary' centered value={value} onChange={handleChange}>
                <Tab label="Questions" className={classes.tab}{...allProps(0)}></Tab>
                <Tab label="Responses" className={classes.tab}{...allProps(1)}></Tab>
            </Tabs>

            <TabPanel value={value} index={0}>
                {/* <QuestionForm /> */}
            </TabPanel>
            <TabPanel value={value} index={1}>
                <div className='submit' style={{ height: "76vh" }}>
                    <div className="user_form">
                        <div className="user_form_section">
                            <div className="user_form_questions" style={{display:'flex', flexDirection:'column',marginBottom:"20px"} }>
                                <div style={{display:'flex', flexDirection:'row',alignItems:"center",justifyContent:"space-between"}}>
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