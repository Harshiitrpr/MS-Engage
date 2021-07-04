import React from 'react';
import {Drawer, Divider} from '@material-ui/core';

//sub components
import ChatHead from "./chat/chatHead/chatHead.jsx";
import ChatWall from "./chat/chatWall/chatWall.jsx";
import SendMessageSection from "./chat/sendMessageSection/sendMessageSection.jsx";

// Toast notifications
import MessageToast from "../notifications/messageToast";

const ChatDrawer = (props) => {

    return(
        <Drawer
            // className={classes.drawer}
            variant="persistent"
            anchor="right"
            open={props.chatBoxVisible}
            // classes={{
            //     paper: classes.drawerPaper,
            // }}
        >
            <ChatHead setChatBoxVisible = {props.setChatBoxVisible}/>
            <Divider />
            <ChatWall messages={props.messages}/>
            <Divider />
            <SendMessageSection socketRef= {props.socketRef} myName={props.myName}/>
            <MessageToast/>
        </Drawer>
        
    )
}

export default ChatDrawer;
