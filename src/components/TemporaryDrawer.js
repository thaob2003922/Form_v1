import React from "react";
import MenuIcon from '@mui/icons-material/Menu';
import IconButton from '@mui/material/IconButton';
import Drawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import { ListItemText } from "@mui/material";
import { makeStyles } from '@mui/styles';
import Divider from '@mui/material/Divider';
import SettingsIcon from '@mui/icons-material/Settings';
import HelpIcon from '@mui/icons-material/Help';
// import formimage from "../images/survey_logo.png";
import excelsheetimage from "../images/google_sheets.png";
import docimage from "../images/google_docs.png";
import slideimage from "../images/wechat_logo.png";
import driveimage from "../images/wechat_logo.png";
import NotificationsActiveIcon from '@mui/icons-material/NotificationsActive';
import "./Drawer.css"
const useStyle = makeStyles({
    listItem:{
        marginLeft:"20px",fontSize:"14px",fontWeight:"500px",color:"grey"
    },
    slideImages:{
        height:"20px",width:"20px"
    }
});
function TemporaryDrawer(){
    const classes = useStyle();
    const [state, setState] = React.useState({
        left: false
    })
    const toggleDrawer = (anchor, open) => (event) => {
        setState({...state, [anchor]: open});
    };
    const list = (anchor) =>(
        <div style={{width: '250px'}} role="presentation">
            <Divider />
            <List>
                <ListItem>
                <ListItemText style={{fontSize: "48px", marginLeft:"5px"}}>
                    <span style={{color:"red",fontWeight:"700px",fontSize:"22px",fontFamily:"'Product Sans',Arial,sans-serif"}}>W</span>
                    <span style={{color:"yellow",fontWeight:"500px",fontSize:"22px",fontFamily:"'Product Sans',Arial,sans-serif"}}>W</span>
                    <span style={{color:"blue",fontWeight:"500px",fontSize:"22px",fontFamily:"'Product Sans',Arial,sans-serif"}}>P</span>
                    <span style={{color:"blue",fontWeight:"500px",fontSize:"22px",fontFamily:"'Product Sans',Arial,sans-serif"}}>i</span>
                    <span style={{color:"blue",fontWeight:"500px",fontSize:"22px",fontFamily:"'Product Sans',Arial,sans-serif"}}>g</span>
                    <span style={{color:"blue",fontWeight:"500px",fontSize:"22px",fontFamily:"'Product Sans',Arial,sans-serif"}}>e</span>
                    <span style={{color:"blue",fontWeight:"500px",fontSize:"22px",fontFamily:"'Product Sans',Arial,sans-serif"}}>o</span>
                    <span style={{color:"blue",fontWeight:"500px",fontSize:"22px",marginRight:"10px",fontFamily:"'Product Sans',Arial,sans-serif"}}>n</span>
                    <span style={{color:"#5f6368",fontWeight:"500px",fontSize:"22px",fontFamily:"'Product Sans',Arial,sans-serif"}}>Docs</span>
                </ListItemText>
                </ListItem>
            </List>
            <Divider />
            <List style={{marginLeft:"8px",marginRight:"8px",marginTop:"15px"}}>
                <ListItem className="list_item">
                    <img src={docimage} className={classes.slideImages} alt=""/>
                    <div className={classes.listItem}>Docs</div>
                </ListItem>
                <ListItem className="list_item">
                    <img src={excelsheetimage} className={classes.slideImages} alt=""/>
                    <div className={classes.listItem}>Sheet</div>
                </ListItem>
                <ListItem className="list_item">
                    <img src={slideimage} className={classes.slideImages} alt=""/>
                    <div className={classes.listItem}>Account Management</div>
                </ListItem>
                <ListItem className="list_item">
                    <img src={driveimage} className={classes.slideImages} alt=""/>
                    <div className={classes.listItem}>Statistics</div>
                </ListItem>
            </List>
            
            <Divider />
            <List style={{marginLeft:"8px",marginRight:"8px",marginTop:"15px"}}>
                <ListItem className="list_item">
                <SettingsIcon />
                <div style={{marginLeft:"20px",fontSize:"14px"}}>Settings</div>
                </ListItem>

                <ListItem className="list_item">
                <HelpIcon />
                <div style={{marginLeft:"20px",fontSize:"14px"}}>Help & Feedback</div>
                </ListItem>
            </List>
            <Divider />
            <List style={{marginLeft:"8px",marginRight:"8px",marginTop:"15px"}}>
                <ListItem className="list_item">
                <NotificationsActiveIcon/>
                <div style={{marginLeft:"20px",fontSize:"14px"}}>Notifications</div>
                </ListItem>
            </List>
        </div>
    )
    return (
        <div>
            <React.Fragment>
            <IconButton onClick={toggleDrawer('left',true)}>
                <MenuIcon />
            </IconButton>
            <Drawer open={state['left']} onClose={toggleDrawer('left',false)} anchor='left'>
                {list('left')}
            </Drawer>
            </React.Fragment> 
        </div>
    )
}

export default TemporaryDrawer